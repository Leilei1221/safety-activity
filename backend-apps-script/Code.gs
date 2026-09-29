/**
 * 事故現場・安全守護者 — Google Apps Script 後台
 *
 * 功能：接收學生送出的學習記錄 → 產生學習回饋 → 寫進這份 Google 試算表（一次提交＝一列）
 * 產生文件：之後可用試算表外掛 Autocrat，把每一列套進 Google 文件範本
 *
 * 部署步驟請看同資料夾的 README.md
 *
 * 【指令碼屬性】（專案設定 → 指令碼屬性，不要把金鑰寫在程式碼裡）
 *   GROQ_API_KEY   ：Groq 金鑰（gsk_ 開頭）。沒填就使用固定回饋，不會出錯
 *   GROQ_MODEL     ：選填，預設 openai/gpt-oss-120b（可在 listGroqModels 查目前可用的模型）
 *   ACTIVITY_NAME  ：選填，活動名稱，預設「安全守護者」
 */

const SHEET_NAME = '學習記錄';
const HEADERS = [
  '提交時間', '活動名稱', '班級', '座號', '姓名', '事故',
  '骨牌1 環境因素', '骨牌2 人為疏失', '骨牌3 危險因素', '骨牌4 意外事故', '骨牌5 損失',
  '三段五級得分', '三段五級明細',
  '現場模擬得分', '現場模擬明細',
  '事故故事觀看', '學習回饋', '回饋來源', '提交編號',
];
const DOMINO_NAMES = ['環境因素', '人為疏失', '危險因素', '意外事故', '損失'];
const MAX_TEXT = 1000;   // 每一格最多保留的字數，避免異常資料塞爆試算表

/** 瀏覽器直接打開網址時顯示：用來確認部署成功 */
function doGet() {
  return json_({ ok: true, message: '安全守護者後台運作中' });
}

/** 學生送出學習記錄 */
function doPost(e) {
  let data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ status: 'error', error: '資料格式錯誤' });
  }
  if (!data.name || !data.class_name || !data.case_title) {
    return json_({ status: 'error', error: '缺少班級、姓名或事故名稱' });
  }

  const id = Utilities.getUuid();
  const fb = makeFeedback_(data);

  // 同時很多人送出時，排隊寫入，避免互相覆蓋
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
    const sheet = getSheet_();
    sheet.appendRow(buildRow_(data, fb, id));
  } catch (err) {
    return json_({ status: 'error', error: '寫入試算表失敗，請稍後再送一次' });
  } finally {
    lock.releaseLock();
  }
  return json_({ id: id, status: 'done', feedback: fb.text, error: '' });
}

// ─────────────────────────────────────────
// 試算表
// ─────────────────────────────────────────
function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#fde2e2');
  }
  return sheet;
}

function clip_(v) {
  const s = String(v == null ? '' : v).trim();
  // 開頭是 = + - @ 的文字會被試算表當成公式，前面加上 ' 當純文字保存
  const safe = /^[=+\-@]/.test(s) ? "'" + s : s;
  return safe.length > MAX_TEXT ? safe.slice(0, MAX_TEXT) + '…' : safe;
}

function buildRow_(d, fb, id) {
  const props = PropertiesService.getScriptProperties();
  const domino = d.domino_inputs || {};
  const prev = d.prevention_results || {};
  const prevText = Object.keys(prev).sort((a, b) => a - b).map(k => {
    const r = prev[k] || {};
    return `措施${Number(k) + 1}：選「${r.selected || '未答'}」（正確：${r.correct || ''}）${r.isCorrect ? '✓' : '✗'}`;
  }).join('\n');
  return [
    Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd HH:mm'),
    props.getProperty('ACTIVITY_NAME') || '安全守護者',
    clip_(d.class_name), clip_(d.seat), clip_(d.name), clip_(d.case_title),
    ...[0, 1, 2, 3, 4].map(i => clip_(domino[i] || domino[String(i)] || '（未填寫）')),
    `${Number(d.score) || 0}/${Number(d.total) || 0}`,
    clip_(prevText || '（未作答）'),
    d.sim_total ? `${Number(d.sim_score) || 0}/${Number(d.sim_total) || 0}` : '',
    clip_(d.sim_text || ''),
    clip_(d.watch_text || ''),
    clip_(fb.text),
    fb.source,
    id,
  ];
}

// ─────────────────────────────────────────
// 學習回饋：有 Groq 金鑰就用 AI，否則（或失敗時）用固定回饋
// ─────────────────────────────────────────
function makeFeedback_(d) {
  const key = PropertiesService.getScriptProperties().getProperty('GROQ_API_KEY');
  if (key) {
    try {
      const text = groqFeedback_(d, key);
      if (text) return { text: text, source: 'AI（Groq）' };
    } catch (err) {
      console.warn('Groq 回饋失敗，改用固定回饋：' + err);
    }
  }
  return { text: fixedFeedback_(d), source: '固定回饋' };
}

// 骨牌作答的客觀檢查：空白、太簡短、和其他骨牌重複（AI 與固定回饋共用）
const SHORT_LEN = 6;   // 去掉空白與標點後少於這個字數，視為「太簡短」
function assessDomino_(d) {
  const domino = d.domino_inputs || {};
  const norm = v => v.replace(/[\s，。、！？!?,.；;：:「」『』（）()]/g, '');
  const items = [0, 1, 2, 3, 4].map(i => {
    const text = String(domino[i] || domino[String(i)] || '').trim();
    return { i: i, text: text, len: norm(text).length };
  });
  items.forEach(it => {
    it.empty = !it.len;
    it.short = !it.empty && it.len < SHORT_LEN;
    it.dupOf = it.empty ? -1 : items.findIndex(o => o.i < it.i && norm(o.text) === norm(it.text));
  });
  return {
    items: items,
    filled: items.filter(it => !it.empty).length,
    short: items.filter(it => it.short),
    dup: items.filter(it => it.dupOf >= 0),
    solid: items.filter(it => !it.empty && !it.short && it.dupOf < 0).length,
  };
}

function groqFeedback_(d, key) {
  const ref = Array.isArray(d.domino_reference) ? d.domino_reference : [];
  const qa = assessDomino_(d);
  const dominoSummary = qa.items.map(it => {
    const r = ref[it.i] || {};
    const flags = [];
    if (it.empty) flags.push('未填寫');
    if (it.short) flags.push(`只有 ${it.len} 個字，太簡短`);
    if (it.dupOf >= 0) flags.push(`和骨牌${it.dupOf + 1}寫的一樣`);
    return `  - 骨牌${it.i + 1}（${r.name || DOMINO_NAMES[it.i]}）
      學生寫：${it.text ? '「' + it.text + '」' : '（空白）'}${flags.length ? '【' + flags.join('、') + '】' : ''}
      參考分析：${r.factor || '（無）'}`;
  }).join('\n');
  const prev = d.prevention_results || {};
  const prevSummary = Object.keys(prev).sort((a, b) => a - b).map(k => {
    const r = prev[k] || {};
    return `  - 措施${Number(k) + 1}：選擇「${r.selected || '未答'}」（正確：${r.correct || ''}）${r.isCorrect ? '✓' : '✗'}`;
  }).join('\n') || '  （學生未完成配對）';

  const prompt = `你是一位高中健康與護理老師，要給學生「事故傷害分析」作業寫回饋。
你的回饋要溫暖，但必須誠實、具體：學生寫得簡略、敷衍或方向不對時，要點出觀察到的事實，給修正方向，並鼓勵他再試一次。
不可以稱讚學生沒有做到的事，也不可以把空泛、錯置或重複的答案說成「寫得很到位」。

學生：${d.name}（${d.class_name}班 第${d.seat}號）
案例：${d.case_title}

【骨牌理論】學生作答與參考分析（程式已先檢查：${qa.solid}/5 張寫得具體）：
${dominoSummary}

【三段五級配對】${d.score}/${d.total} 題正確（這是選擇配對題，全對代表分級觀念正確，但不代表骨牌分析寫得好）：
${prevSummary}
${d.sim_total ? `\n【現場模擬】${Number(d.sim_score) || 0}/${Number(d.sim_total) || 0} 個情境做出安全的選擇\n${d.sim_review || ''}\n` : ''}
背景知識（以此為準，不要自創其他理論或名詞）：
- 骨牌理論：環境因素 → 人為疏失 → 危險因素（不安全狀態）→ 意外事故 → 損失，抽掉任一張骨牌就能阻止事故。
  每張骨牌要寫出「誰／什麼條件」＋「具體狀況」，例如不是只寫「地震」，而是「大樓蓋在斷層帶上，結構耐震能力不足」。
- 三段五級：一級 促進健康（教育宣導）、二級 特殊保護（針對特定危險的防護）、三級 早期診斷與治療（事故當下的緊急處置）、四級 限制失能、五級 復健。

評估原則：
- 學生的答案和參考分析「方向相同」就算對，不要求字句一樣；但只有一兩個字、沒有說明原因或對象的，算「太簡略」。
- 自然現象（如地震、颱風）本身通常是觸發事件；「危險因素」要寫的是讓事故發生的不安全狀態（例如建築物承受不了搖晃），不是再寫一次自然現象。
- 口語化或情緒性的描述（例如「人死了一堆」）要引導改成具體、客觀的說法（例如傷亡人數、財產與社會影響）。

請寫 200～300 字的回饋，依序包含：
1. 稱呼姓名，真誠肯定他「確實做到」的部分（例如完成觀看、配對正確、某張骨牌方向正確）。
2. 觀察到的事實：具體引用 1～3 張寫得不足的骨牌原文，說明缺了什麼。沒有不足就說明哪裡寫得好。
3. 修正方向：用提問引導思考（例如「是誰的決定讓風險變大？」「當時有哪些不安全的狀態？」），給一個改寫示範的開頭，但不要直接給完整答案。
4. 鼓勵他用這個方法重新整理自己的分析，或在下一個事件再試一次。
${d.sim_review ? '5. 現場模擬若有選錯，用一句話提醒正確做法。\n' : ''}
直接輸出回饋文字，不要標題、條列符號或前言，使用繁體中文（台灣用語）。`;

  const model = (PropertiesService.getScriptProperties().getProperty('GROQ_MODEL') || 'openai/gpt-oss-120b').trim();
  const req = { model: model, messages: [{ role: 'user', content: prompt }], max_tokens: 2048, temperature: 0.7 };
  // gpt-oss 會先「思考」再回答，思考也算字數；設成 low 讓字數留給回饋本身
  if (/gpt-oss/.test(model)) req.reasoning_effort = 'low';
  const res = UrlFetchApp.fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + key },
    payload: JSON.stringify(req),
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) throw new Error('HTTP ' + res.getResponseCode() + ' ' + res.getContentText().slice(0, 200));
  const choice = JSON.parse(res.getContentText()).choices[0];
  const text = String(choice.message.content || '').trim();
  if (!text) throw new Error('AI 沒有產生文字（finish_reason：' + choice.finish_reason + '）');
  return text;
}

/** 測試用：在編輯器選這個函式按「執行」，下方執行記錄會顯示 AI 回饋或錯誤原因 */
function testGroq() {
  const key = PropertiesService.getScriptProperties().getProperty('GROQ_API_KEY');
  console.log('有沒有讀到金鑰：' + (key ? '有' : '沒有'));
  console.log(groqFeedback_({ name: '測試', class_name: '101', seat: '1', case_title: '測試事故', score: 5, total: 5 }, key));
}

/** 查詢這把金鑰目前可用的 Groq 模型（模型被停用時，用來挑新的 GROQ_MODEL） */
function listGroqModels() {
  const key = PropertiesService.getScriptProperties().getProperty('GROQ_API_KEY');
  const res = UrlFetchApp.fetch('https://api.groq.com/openai/v1/models', {
    headers: { Authorization: 'Bearer ' + key },
    muteHttpExceptions: true,
  });
  const body = JSON.parse(res.getContentText());
  (body.data || []).map(m => m.id).sort().forEach(id => console.log(id));
}

function fixedFeedback_(d) {
  const name = d.name || '同學';
  const score = Number(d.score) || 0, total = Number(d.total) || 0;
  const qa = assessDomino_(d);
  const parts = [`${name}，謝謝你完成「${d.case_title}」的事故分析！`];
  if (qa.solid === 5) parts.push('你的五張骨牌都寫出了具體的狀況，能一步步找出事故的因果，這是成為安全守護者最重要的能力。');
  else if (qa.filled === 0) parts.push('這次骨牌理論還沒有寫下自己的想法，下次試著把事故的因果一環一環串起來。');
  else {
    const notes = [];
    if (qa.filled < 5) notes.push(`還有 ${5 - qa.filled} 張骨牌空白`);
    if (qa.short.length) notes.push(`${qa.short.map(it => `骨牌${it.i + 1}「${it.text}」`).join('、')}寫得太簡短`);
    if (qa.dup.length) notes.push(`${qa.dup.map(it => `骨牌${it.i + 1}和骨牌${it.dupOf + 1}`).join('、')}寫的內容一樣`);
    parts.push(`骨牌分析中，${notes.join('；')}。每張骨牌試著寫出「誰或什麼條件＋具體狀況」，例如不是只寫「地震」，而是「大樓蓋在斷層帶上，結構耐震能力不足」。對照官方分析想一想：是誰的決定讓風險變大？當時有哪些不安全的狀態？用這個方法重新整理一次，會更看清楚事故是怎麼一環扣一環發生的。`);
  }
  if (total && score === total) parts.push('三段五級的配對全部正確，分級觀念很清楚！');
  else if (total && score >= total / 2) parts.push(`三段五級答對 ${score}/${total} 題，建議再複習「一級：促進健康」和「二級：特殊保護」的差別：一級是教育與宣導，二級是針對特定危險的防護措施。`);
  else if (total) parts.push(`三段五級答對 ${score}/${total} 題，別灰心！記住口訣：事故前是一、二級（教育、防護），事故當下是三級（早期處置），事故後是四、五級（限制失能、復健）。`);
  if (d.sim_total) parts.push(`現場模擬中，你在 ${Number(d.sim_score) || 0}/${d.sim_total} 個情境做出了安全的選擇。`);
  parts.push('希望你把今天學到的，帶進生活中的每一個選擇，保護自己，也保護身邊的人。');
  return parts.join('');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
