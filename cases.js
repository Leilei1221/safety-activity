// ═══════════════════════════════════════════════
// 事故案例資料（index.html 與 timeline.html 共用）
// ═══════════════════════════════════════════════
// 【如何新增一個事件】
// 1. 在下方 cases 加一個新的 key（英文小寫，例如 'kaohsiung-gas'），依年代順序放：
//      title / year / icon（lucide 圖示名稱）/ summary
//      domino：5 張骨牌（環境因素、人為疏失、危險因素、意外事故、損失）
//      prevention：5 項三段五級措施（level 必須是五個級別名稱之一）
// 2. 在 storyData 加同一個 key：
//      sources：資料來源
//      chapters：故事時間線（time / title / fx 場景效果 / icon / text）
//      sim：現場模擬題（每題恰好一個 correct: true）
// 3. 完成！首頁的門、3D 時間之河上的年份燈塔都會自動出現。
//    （3D 因果骨牌動畫需另外製作專屬場景；沒有場景的事件會連到平面版故事。）
// 注意：內容務必以官方調查報告或可信報導為依據，並在 sources 註明。

// ═══════════════════════════════════════════════
// 案例資料庫
// ═══════════════════════════════════════════════
const cases = {
    'case2': {
        title: '彩色派對粉塵爆炸事故',
        year: '2015',
        icon: 'flame',
        summary: '【世紀悲劇：粉塵地獄】數百名年輕人夢寐以求的彩色派對，因舞台區噴灑的高濃度玉米澱粉塵遇熱源瞬間引爆！烈焰吞噬全場，造成15人死亡、逾480人全身大面積燒燙傷。這場人為疏失，凸顯了大型活動安全審核機制全面失靈的慘痛代價。',
        domino: [
            { name: '環境因素 (化學/物理)', factor: '現場有大量可燃性粉塵（玉米澱粉）與潛在點火源（燈光、電線）。', color: 'bg-gray-100' },
            { name: '人為疏失 (不當態度/知識)', factor: '主辦方缺乏粉塵爆炸知識，未進行風險評估，違規使用危險材料。', color: 'bg-yellow-100' },
            { name: '危險因素 (不安全狀態)', factor: '高濃度粉塵雲達到爆炸下限；火源引燃。', color: 'bg-orange-100' },
            { name: '意外事故 (立即事件)', factor: '粉塵爆炸，火焰瞬間噴射，人群推擠踩踏。', color: 'bg-red-100' },
            { name: '損失 (後果)', factor: '15人死亡，超過480人燒燙傷；國家醫療資源耗竭。', color: 'bg-slate-100' },
        ],
        prevention: [
            { stage: '第一段：事故前預防', level: '一級：促進健康', action: '宣導可燃性粉塵危害知識；政府嚴格審核大型活動材料安全性。', tag: 'stage-1' },
            { stage: '第一段：事故前預防', level: '二級：特殊保護', action: '法規強制禁止使用易燃粉塵；活動現場規劃清晰逃生路線及滅火設備。', tag: 'stage-1' },
            { stage: '第二段：事故發生時', level: '三級：早期診斷與治療', action: '立即廣播疏散；對燒燙傷患者進行「沖脫泡蓋送」緊急處理；實施檢傷分類。', tag: 'stage-2' },
            { stage: '第三段：事故發生後處置', level: '四級：限制失能', action: '啟動大量傷患機制，調度燒燙傷中心資源，防止傷口感染與限制失能。', tag: 'stage-3' },
            { stage: '第三段：事故發生後處置', level: '五級：復健', action: '提供長期身心復健與職能重建；追究法律責任，促成公共安全法規修正。', tag: 'stage-3' },
        ]
    },
    'case3': {
        title: '花蓮震災大樓倒塌事故',
        year: '2018',
        icon: 'hammer',
        summary: '【天災背後的人禍】花蓮強震，位於斷層帶上的某電梯大樓竟在短短8秒內崩解！調查揭露，建案負責人缺乏土木專業資格，且施工過程有嚴重結構瑕疵。這不是單純的天災，而是無良建商與制度漏洞聯手造成的14條人命悲劇。',
        domino: [
            { name: '環境因素 (地理/結構)', factor: '建築物位於斷層帶（高地震風險）；結構耐震能力遠低於標準。', color: 'bg-gray-100' },
            { name: '人為疏失 (專業/倫理)', factor: '建商不具備專業資格；施工團隊有重大結構錯誤；政府監造勘驗失職。', color: 'bg-yellow-100' },
            { name: '危險因素 (不安全狀態)', factor: '地震來襲時建築物無法承受側向剪力。', color: 'bg-orange-100' },
            { name: '意外事故 (立即事件)', factor: '大樓結構性潰散，8秒內倒塌。', color: 'bg-red-100' },
            { name: '損失 (後果)', factor: '14條人命喪失；巨額財產損失；社會對建築安全信心崩潰。', color: 'bg-slate-100' },
        ],
        prevention: [
            { stage: '第一段：事故前預防', level: '一級：促進健康', action: '嚴格執行土地使用管制；對全民宣導防災與避難知識。', tag: 'stage-1' },
            { stage: '第一段：事故前預防', level: '二級：特殊保護', action: '嚴格執行建築師/技師的專業簽證制度；強制老舊建築進行耐震補強。', tag: 'stage-1' },
            { stage: '第二段：事故發生時', level: '三級：早期診斷與治療', action: '地震時遵循「趴下、掩護、穩住」；立即啟動專業搜救隊伍。', tag: 'stage-2' },
            { stage: '第三段：事故發生後處置', level: '四級：限制失能', action: '對獲救傷者進行創傷醫學處理，預防擠壓傷併發症。', tag: 'stage-3' },
            { stage: '第三段：事故發生後處置', level: '五級：復健', action: '提供災民與家屬長期心理輔導；從重追訴非法建商，全面改革建築法規。', tag: 'stage-3' },
        ]
    },
    'puyuma': {
        title: '普悠瑪列車出軌事故',
        year: '2018',
        icon: 'train-track',
        summary: '【被關掉的安全系統】2018年10月21日，台鐵6432次普悠瑪列車在宜蘭新馬站，以約每小時140公里的速度衝進限速75公里的彎道，出軌翻覆，造成18人死亡、215人受傷。調查揭露：故障的列車仍在載客、列車自動防護系統（ATP）被關閉，背後是台鐵長期的維修與管理問題。',
        domino: [
            { name: '環境因素 (組織/設備)', factor: '台鐵維修延宕，列車主風泵故障仍上線載客；作業手冊與程序不完整，訓練與考核制度不足。', color: 'bg-gray-100' },
            { name: '人為疏失 (違規操作)', factor: '司機員把主風泵故障誤判為ATP問題，違規隔離ATP後繼續行駛；故障未依規定通報與處置。', color: 'bg-yellow-100' },
            { name: '危險因素 (不安全狀態)', factor: '列車失去ATP的自動超速防護，以約140 km/h接近限速75 km/h的彎道。', color: 'bg-orange-100' },
            { name: '意外事故 (立即事件)', factor: '列車在新馬站彎道出軌翻覆。', color: 'bg-red-100' },
            { name: '損失 (後果)', factor: '18人死亡、215人受傷；損失及賠償逾9.58億元，社會對鐵道安全信心重挫。', color: 'bg-slate-100' },
        ],
        prevention: [
            { stage: '第一段：事故前預防', level: '一級：促進健康', action: '建立「異常就停、故障就報」的安全文化；加強員工與旅客的鐵道安全教育。', tag: 'stage-1' },
            { stage: '第一段：事故前預防', level: '二級：特殊保護', action: '確實維修保養列車；ATP不得任意隔離並建立監控機制；完善作業手冊並落實訓練考核。', tag: 'stage-1' },
            { stage: '第二段：事故發生時', level: '三級：早期診斷與治療', action: '立即通報並攔停鄰線列車；現場進行檢傷分類與緊急救護，迅速後送傷患。', tag: 'stage-2' },
            { stage: '第三段：事故發生後處置', level: '四級：限制失能', action: '傷者送醫接受外科手術與加護照護，預防併發症、降低永久失能。', tag: 'stage-3' },
            { stage: '第三段：事故發生後處置', level: '五級：復健', action: '提供傷者身心復健與心理輔導；依運安會改善建議，改革台鐵組織、維修與訓練制度。', tag: 'stage-3' },
        ]
    },
    'taroko': {
        title: '太魯閣號清水隧道事故',
        year: '2021',
        icon: 'train-front',
        summary: '【49條人命的連鎖失誤】2021年4月2日清明連假首日，台鐵408次太魯閣號在花蓮清水隧道北口，撞上從施工便道邊坡滑落到軌道上的大貨車，8節車廂全部出軌，造成49人死亡、213人受傷，是台鐵近60年來最嚴重的事故。',
        domino: [
            { name: '環境因素 (工程/地形)', factor: '邊坡工地緊鄰隧道口與軌道；施工便道未依設計鋪設瀝青混凝土，邊坡缺乏適當安全防護；台鐵臨軌工程安全規定不足。', color: 'bg-gray-100' },
            { name: '人為疏失 (違規/判斷錯誤)', factor: '工地主任於連假停工期間違規進入工地；大貨車熄火無法發動後，未找維修業者，而用吊帶連接挖掘機拖移。', color: 'bg-yellow-100' },
            { name: '危險因素 (不安全狀態)', factor: '大貨車從施工便道邊坡滑落，停在列車行駛的軌道上。', color: 'bg-orange-100' },
            { name: '意外事故 (立即事件)', factor: '408次列車駛近清水隧道北口時撞上大貨車，8節車廂全部出軌。', color: 'bg-red-100' },
            { name: '損失 (後果)', factor: '49人死亡（含2名司機員）、213人受傷；北迴線中斷，社會對鐵道安全信心受創。', color: 'bg-slate-100' },
        ],
        prevention: [
            { stage: '第一段：事故前預防', level: '一級：促進健康', action: '加強臨軌施工人員的工安教育與法規宣導；推動重視安全的組織文化。', tag: 'stage-1' },
            { stage: '第一段：事故前預防', level: '二級：特殊保護', action: '臨軌工地設置邊坡防護設施、落實工地出入管制；車輛故障交由專業業者處理並通報台鐵。', tag: 'stage-1' },
            { stage: '第二段：事故發生時', level: '三級：早期診斷與治療', action: '乘客依車長指示疏散；救難人員進行檢傷分類，優先救治重傷者並迅速後送。', tag: 'stage-2' },
            { stage: '第三段：事故發生後處置', level: '四級：限制失能', action: '傷者送醫接受骨折、創傷手術與加護治療，預防併發症與永久失能。', tag: 'stage-3' },
            { stage: '第三段：事故發生後處置', level: '五級：復健', action: '提供傷者身心復健與家屬心理輔導；依運安會建議檢討臨軌工程規定與站票政策。', tag: 'stage-3' },
        ]
    },
    'mataian': {
        title: '馬太鞍溪堰塞湖溢流災害',
        year: '2025',
        icon: 'waves',
        summary: '【山的另一頭，湖在長大】2025年7月薇帕颱風後，花蓮馬太鞍溪上游大規模崩塌，形成堰塞湖。9月23日樺加沙颱風帶來豪雨，湖水溢流，泥流沖斷台9線馬太鞍溪橋、衝破堤防，淹進光復鄉市區，造成19人罹難、5人失蹤、157人受傷。災後約50萬人次「鏟子超人」湧入光復協助清淤。',
        domino: [
            { name: '環境因素 (地質/氣候)', factor: '馬太鞍溪上游大規模崩塌，土石堵住溪谷形成堰塞湖；颱風豪雨讓湖水快速上升。', color: 'bg-gray-100' },
            { name: '人為疏失 (預警/撤離)', factor: '預警與撤離的風險溝通出現落差：部分居民未撤離或只做「垂直避難」。撤離的決策與執行，檢調與監察院仍在調查。', color: 'bg-yellow-100' },
            { name: '危險因素 (不安全狀態)', factor: '湖水越過壩頂溢流，大量泥水夾帶土石沖向下游，超出河道與堤防能承受的程度。', color: 'bg-orange-100' },
            { name: '意外事故 (立即事件)', factor: '9月23日下午，泥流沖斷台9線馬太鞍溪橋、衝破堤防，湧入光復鄉市區。', color: 'bg-red-100' },
            { name: '損失 (後果)', factor: '19人罹難、5人失蹤、157人受傷；大片家園與農田被泥沙掩埋。', color: 'bg-slate-100' },
        ],
        prevention: [
            { stage: '第一段：事故前預防', level: '一級：促進健康', action: '推動全民防災教育與演練，認識堰塞湖與土石流風險；社區熟悉避難地圖與撤離路線。', tag: 'stage-1' },
            { stage: '第一段：事故前預防', level: '二級：特殊保護', action: '持續監測堰塞湖水位並及早處置；劃定潛在淹水範圍，確實通知並撤離每一戶，特別是行動不便的長輩。', tag: 'stage-1' },
            { stage: '第二段：事故發生時', level: '三級：早期診斷與治療', action: '洪水來襲時立即往高處或指定避難處所移動；搜救受困者，進行檢傷分類與緊急醫療。', tag: 'stage-2' },
            { stage: '第三段：事故發生後處置', level: '四級：限制失能', action: '傷患送醫治療，注意泥水造成的傷口感染；協助慢性病長者持續用藥，避免病情惡化。', tag: 'stage-3' },
            { stage: '第三段：事故發生後處置', level: '五級：復健', action: '災後清淤重建、心理支持與生計復原；檢討預警撤離機制，修正相關作業規範。', tag: 'stage-3' },
        ]
    }
};
// ═══════════════════════════════════════════════
// 事故故事時間線 + 現場模擬
// fx：場景動畫效果（calm/spin/spinfast/impact/powder/fire/siren/hospital/dark/court/shake/rubble）
// ═══════════════════════════════════════════════
const storyData = {
    'case2': {
        sources: '資料來源：衛生福利部「八仙樂園粉塵暴燃專區」、中央社、中時新聞網、遠見雜誌等報導。',
        chapters: [
            { time: '2015/06/27 晚間', title: '八仙樂園的彩色派對', fx: 'calm', icon: 'music',
              text: '新北市八里區八仙水上樂園舉辦「Color Play Asia 彩色派對」，上千名年輕人在排空水的泳池區，準備迎接暑假。' },
            { time: '活動進行中', title: '越來越濃的彩色粉塵', fx: 'powder', icon: 'cloud',
              text: '舞台持續向人群噴灑彩色玉米澱粉，粉塵瀰漫、能見度越來越低。舞台上架設著會發熱的電腦燈。' },
            { time: '約 20:32', title: '火焰竄向人群', fx: 'fire', icon: 'flame',
              text: '舞台前方突然起火，火焰沿著空氣中的粉塵瞬間蔓延，吞噬了整個派對區。' },
            { time: '當晚到隔天', title: '全台醫院總動員', fx: 'siren', icon: 'ambulance',
              text: '近500人燒燙傷，平均燒燙傷面積約四成。傷患分送各地，全台共52家醫院收治住院。' },
            { time: '事後', title: '15條年輕的生命', fx: 'dark', icon: 'heart-crack',
              text: '最終15人不幸死亡。檢方鑑定認定：舞台電腦燈的高溫，引燃了空氣中的玉米澱粉粉塵。' },
            { time: '2018 年', title: '判決與修法', fx: 'court', icon: 'gavel',
              text: '主辦人因業務過失致死，判刑5年定讞。政府全面禁止大型活動噴灑色粉，並強化大型活動的安全管理。' },
        ],
        sim: [
            { scene: '派對開始了。舞台一直往人群噴色粉，濃到看不清前方，舞台上的燈具很燙。你會怎麼做？', fx: 'powder',
              options: [
                { text: '擠到最前面，搶最多的粉最好玩', correct: false, why: '粉塵最濃處就是最危險的地方。' },
                { text: '察覺「可燃粉塵＋熱源」有爆燃風險，離開粉塵最濃處並向工作人員反映', correct: true, why: '粉塵濃度夠高、再遇上熱源就可能爆燃。察覺危險並遠離，是最好的自我保護。' },
                { text: '點根菸放鬆一下', correct: false, why: '在可燃粉塵中出現明火，等於直接點燃火源。' },
              ] },
            { scene: '突然一陣火焰從舞台前方竄過來，你的衣服著火了！', fx: 'fire',
              options: [
                { text: '趕快往外狂奔找水', correct: false, why: '奔跑會帶來更多空氣，讓火燒得更旺。' },
                { text: '停、躺、滾：立刻停下、躺倒、雙手摀臉，來回翻滾壓熄火焰', correct: true, why: '翻滾可以隔絕空氣、壓熄火焰；摀臉能保護臉部與呼吸道。' },
                { text: '用手拍打身上的火', correct: false, why: '徒手拍打效果有限，還會讓手部嚴重燒傷。' },
              ] },
            { scene: '火熄了，同伴的手臂和腿嚴重燒燙傷，旁邊有水源。正確的處置是？', fx: 'hospital',
              options: [
                { text: '趕快塗上牙膏或醬油降溫', correct: false, why: '偏方會污染傷口、增加感染風險，也妨礙醫師判斷傷勢。' },
                { text: '沖脫泡蓋送：用流動冷水沖（約15–30分鐘），在水中小心脫去或剪開衣物（黏住的不要硬扯），再覆蓋乾淨布料並送醫', correct: true, why: '這是燒燙傷的標準處理五步驟。大面積燒燙傷沖水時也要注意保暖、避免失溫。' },
                { text: '直接拿冰塊冰敷', correct: false, why: '冰塊可能造成凍傷，大面積冰敷更可能導致失溫。' },
              ] },
            { scene: '你是現場救護指揮官：傷患有數百人，救護車有限。你會怎麼安排？', fx: 'siren',
              options: [
                { text: '誰先排隊就先送誰', correct: false, why: '先到先送會讓最危急的傷患錯過黃金救援時間。' },
                { text: '進行檢傷分類，依傷勢嚴重度決定後送順序，並分散送往不同醫院', correct: true, why: '這就是大量傷患的應變原則。八仙事件中，全台共52家醫院一起收治傷患。' },
                { text: '全部送到最近的那家醫院', correct: false, why: '單一醫院會瞬間癱瘓，反而延誤所有人的治療。' },
              ] },
        ]
    },
    'case3': {
        sources: '資料來源：中央社、中央廣播電臺、鏡週刊、自由時報等報導；臺灣花蓮地方檢察署新聞稿。',
        chapters: [
            { time: '2018/02/06 23:50', title: '深夜的強震', fx: 'shake', icon: 'activity',
              text: '花蓮發生規模6.0的強烈地震（中央氣象局當時公布），花蓮市震度達7級。許多人正在睡夢中。' },
            { time: '地震發生後約8秒', title: '大樓倒下了', fx: 'rubble', icon: 'building-2',
              text: '雲門翠堤大樓的低樓層崩塌，整棟大樓嚴重傾斜。大樓1、2樓是「漂亮生活旅店」，住著許多旅客。' },
            { time: '震後數日', title: '與時間賽跑的搜救', fx: 'siren', icon: 'siren',
              text: '搜救人員冒著餘震的危險，在傾斜的大樓裡一層一層搜尋受困者。' },
            { time: '結果', title: '14條人命', fx: 'dark', icon: 'heart-crack',
              text: '雲門翠堤大樓共14人罹難；這場地震全台共造成17人死亡。' },
            { time: '調查', title: '被拿掉的牆', fx: 'court', icon: 'search',
              text: '媒體比對結構圖發現，一樓比四樓短少23面結構牆。檢方調查指出：建商不具營造業資格、欠缺專業，設計、監造與施工都有重大瑕疵。' },
            { time: '2019/10', title: '一審判決', fx: 'court', icon: 'gavel',
              text: '花蓮地方法院依過失致死罪，判處建商、建築師、土木技師3人各有期徒刑5年（一審判決）。' },
        ],
        sim: [
            { scene: '深夜11點50分，你正在床上睡覺，突然天搖地動！你的第一個動作是？', fx: 'shake',
              options: [
                { text: '馬上衝下樓梯往外跑', correct: false, why: '搖晃中移動很容易跌倒，或被掉落物、玻璃砸傷。' },
                { text: '趴下、掩護、穩住：在床上就用枕頭護住頭頸，遠離窗戶與可能倒下的家具', correct: true, why: '搖晃時先保護頭頸，是地震避難的第一原則。' },
                { text: '趕快搭電梯下樓', correct: false, why: '地震時電梯可能停電或故障，會被困在裡面。' },
              ] },
            { scene: '大樓傾斜了，你被困在房間裡，門口被堵住，空氣中都是灰塵。你該怎麼做？', fx: 'rubble',
              options: [
                { text: '一直大聲呼救，直到有人聽見', correct: false, why: '持續大喊會消耗體力，還會吸入大量粉塵。' },
                { text: '用衣物摀住口鼻，敲擊水管或牆壁發出規律聲響，保留體力等待救援', correct: true, why: '敲擊聲可以傳得比喊叫遠，又能節省體力。' },
                { text: '點打火機照明，看清楚環境', correct: false, why: '震後可能有瓦斯外洩，明火可能引發火災或爆炸。' },
              ] },
            { scene: '（倒轉時間）如果你是地震前正在找房子的人，下面哪個做法最能降低風險？', fx: 'calm',
              options: [
                { text: '只看租金和裝潢漂不漂亮', correct: false, why: '裝潢看不出結構安全。' },
                { text: '留意一樓是否打掉隔間牆、改成大面積店面或挑高，並查詢建物是否做過耐震評估', correct: true, why: '一樓牆柱被拆改、形成「軟弱層」，是地震時大樓倒塌的重要原因——雲門翠堤一樓就比四樓短少23面結構牆。' },
                { text: '專挑一樓打掉隔間、空間最大的房子', correct: false, why: '一樓牆被拆越多，大樓越可能在地震中從底部崩塌。' },
              ] },
        ]
    },
    'puyuma': {
        sources: '資料來源：國家運輸安全調查委員會調查報告、監察院糾正案、中央社、聯合新聞網等報導。',
        chapters: [
            { time: '2018/10/21 下午', title: '週日的返鄉列車', fx: 'calm', icon: 'train-track',
              text: '週日下午，台鐵6432次普悠瑪列車從樹林站開往台東，車上共有366人。' },
            { time: '行駛途中', title: '故障的列車', fx: 'impact', icon: 'gauge',
              text: '列車的主風泵出現故障，動力一再中斷。司機員誤以為是ATP出問題，在16:17將ATP隔離，列車從此失去自動超速防護。' },
            { time: '約 16:50', title: '衝進彎道', fx: 'spinfast', icon: 'gauge',
              text: '列車以約每小時140公里的速度，衝進限速75公里的新馬站彎道。' },
            { time: '翻覆瞬間', title: '列車出軌', fx: 'impact', icon: 'alert-octagon',
              text: '第1節車廂右側車輪浮起，列車出軌並向左傾覆。' },
            { time: '結果', title: '18條人命', fx: 'dark', icon: 'heart-crack',
              text: '事故造成18人死亡、215人受傷。' },
            { time: '2020/10', title: '調查結果', fx: 'court', icon: 'search',
              text: '運安會指出：故障列車仍上線載客、手冊與訓練不足、管理規定未落實，導致ATP被違規隔離與超速，並提出27項改善建議。監察院也糾正交通部與台鐵。' },
            { time: '2023 年', title: '判決', fx: 'court', icon: 'gavel',
              text: '司機員因業務過失致死，判刑4年6個月定讞。' },
        ],
        sim: [
            { scene: '你是司機員：列車動力一再中斷、儀表出現警示，你不確定是哪裡故障。你會怎麼做？', fx: 'impact',
              options: [
                { text: '先把ATP關掉，開到終點再說', correct: false, why: '關掉ATP就失去自動超速防護——本案正是這樣釀成大禍。' },
                { text: '依標準程序向行控中心與車長通報，依指示處理；安全系統異常時必須降速或停車等待處置', correct: true, why: '「異常就報、不確定就停」，安全系統是最後一道防線，不能自己拿掉。' },
                { text: '加速把延誤的時間追回來', correct: false, why: '趕時間是很多重大事故的共同原因，準點永遠不能比安全重要。' },
              ] },
            { scene: '你是乘客，列車過彎時快到讓人站不穩、行李晃動。你可以怎麼保護自己？', fx: 'spinfast',
              options: [
                { text: '站起來拿手機錄影', correct: false, why: '站著最容易在急彎或急煞時摔倒受傷。' },
                { text: '立刻坐好、抓穩扶手或椅背，遠離車門與車廂連接處，並告知車長或服務人員', correct: true, why: '坐穩、抓牢能降低受傷；把異常告訴車上人員，也可能讓問題及早被處理。' },
                { text: '走到車廂連接處看看發生什麼事', correct: false, why: '車廂連接處是事故時最危險的位置之一。' },
              ] },
            { scene: '列車翻覆後車廂側躺，四周一片混亂。你怎麼逃生？', fx: 'rubble',
              options: [
                { text: '先找回手機和行李再離開', correct: false, why: '分秒必爭，財物可以再買，生命不能重來。' },
                { text: '確認周圍危險，聽從車長或救難人員指示，從朝上的車門或以車窗擊破器破窗逃出，並協助身旁的人', correct: true, why: '先觀察再行動，依指示有秩序撤離，並互相幫助。' },
                { text: '一出車廂就在軌道上奔跑離開', correct: false, why: '鄰線可能仍有列車通過，軌道上也有電力與碎片等危險。' },
              ] },
            { scene: '如果你是事後的台鐵主管，你會怎麼避免悲劇重演？', fx: 'court',
              options: [
                { text: '把責任都歸給司機員就好', correct: false, why: '運安會指出維修、訓練、程序與管理都有問題，只處罰個人無法阻止下一次事故。' },
                { text: '從維修保養、作業程序、訓練考核與安全文化全面改善，並讓ATP無法被任意隔離', correct: true, why: '這就是抽掉「環境因素」這張骨牌——從根本改變組織。' },
                { text: '只要加重罰則，員工自然會小心', correct: false, why: '罰則不能取代完善的制度、設備與訓練。' },
              ] },
        ]
    },
    'taroko': {
        sources: '資料來源：國家運輸安全調查委員會調查報告、報導者、中央社、聯合新聞網等報導（司法進度截至2026年4月）。',
        chapters: [
            { time: '2021/04/02 早上', title: '清明連假第一天', fx: 'calm', icon: 'train-front',
              text: '清明連假第一天，台鐵408次太魯閣號從樹林站開往台東，車上載著498人，也有買站票的旅客。' },
            { time: '事故前', title: '連假中的工地', fx: 'dark', icon: 'construction',
              text: '清水隧道北口上方的邊坡工地正值連假停工，工地主任卻帶著移工違規進入工地。' },
            { time: '事故前不久', title: '滑下邊坡的大貨車', fx: 'rubble', icon: 'truck',
              text: '大貨車在施工便道的斜坡上熄火、無法再發動。工地主任沒有找維修業者，而是用吊帶連接挖掘機拖移——大貨車滑下邊坡，停在軌道上。' },
            { time: '約 09:28', title: '撞擊', fx: 'impact', icon: 'train-front',
              text: '列車駛近清水隧道北口，撞上軌道上的大貨車，8節車廂全部出軌。' },
            { time: '救援', title: '黑暗隧道裡的救援', fx: 'siren', icon: 'siren',
              text: '隧道內漆黑狹窄，乘客互相扶持逃出車廂，救難人員進入隧道搶救傷者。' },
            { time: '結果', title: '49條人命', fx: 'dark', icon: 'heart-crack',
              text: '49人死亡（包括2名司機員），213人受傷，是台鐵近60年來最嚴重的事故。' },
            { time: '2022/05', title: '調查報告', fx: 'court', icon: 'search',
              text: '運安會指出多項肇因，包括違規施工、便道與邊坡缺乏防護、台鐵臨軌工程安全規定不足；也發現站票乘客的罹難率是坐票的7倍。' },
            { time: '司法進度', title: '尚未結束的審判', fx: 'court', icon: 'gavel',
              text: '肇事包商的妨害投標罪判刑10個月定讞；過失致死等其他罪名，最高法院已發回更審，司法程序仍在進行（截至2026年4月）。' },
        ],
        sim: [
            { scene: '你是工地負責人：連假期間，大貨車在緊鄰軌道的便道斜坡上熄火、發不動了。你該怎麼做？', fx: 'rubble',
              options: [
                { text: '用吊帶綁在挖掘機上硬拖', correct: false, why: '本案大貨車就是這樣滑落到軌道上。' },
                { text: '先固定車輛，立即通報台鐵（車站或行控中心）請求注意或攔停列車，並找專業維修業者處理', correct: true, why: '臨軌作業出狀況，第一件事是讓列車知道危險，再由專業的人處理故障車輛。' },
                { text: '先放著，等連假結束再處理', correct: false, why: '車輛可能滑落，而且沒有人知道軌道旁有危險。' },
              ] },
            { scene: '你在列車上，一陣劇烈撞擊後列車停下，車廂傾斜、燈光昏暗。你第一步怎麼做？', fx: 'impact',
              options: [
                { text: '馬上打開車門跳到軌道上', correct: false, why: '隧道內與鄰線可能仍有危險，貿然跳下容易再受傷。' },
                { text: '先確認自己和身邊的人傷勢，聽從車長或廣播指示，依緊急逃生指引有秩序疏散', correct: true, why: '先穩住、再撤離，才能避免混亂中的二次傷害。' },
                { text: '先到行李架拿行李', correct: false, why: '分秒必爭，財物可以再買，生命不能重來。' },
              ] },
            { scene: '撤出車廂後，你在漆黑的隧道裡。接下來怎麼做？', fx: 'dark',
              options: [
                { text: '在軌道中間坐下休息', correct: false, why: '軌道上仍可能有危險，也會妨礙救援。' },
                { text: '用手機照明，沿著隧道壁往出口或救難人員的方向移動，注意腳下，並協助受傷的人', correct: true, why: '沿壁移動較安全，也方便救難人員找到你。' },
                { text: '大家一起擠回車廂裡', correct: false, why: '出軌的車廂結構可能不穩，擠回去更危險。' },
              ] },
            { scene: '連假買票只剩站票。運安會發現站票乘客罹難率是坐票的7倍，站在車廂間通道與玄關的人生還機率更低。如果只能站，你會站哪裡？', fx: 'calm',
              options: [
                { text: '車廂連接處的通道，方便下車', correct: false, why: '這正是運安會指出生還機率最低的位置。' },
                { text: '盡量待在車廂內，抓穩扶手或椅背，遠離車廂連接處與車門', correct: true, why: '車廂內有座椅與扶手可以依靠，撞擊時較有保護。' },
                { text: '坐在車門邊的行李上', correct: false, why: '車門與玄關附近在撞擊時特別危險。' },
              ] },
        ]
    },
    'mataian': {
        sources: '資料來源：報導者、公視新聞網、中央社、台灣事實查核中心、國家災害防救科技中心等報導與資料（調查進度以教材編寫時為準）。',
        chapters: [
            { time: '2025/07', title: '山的傷口', fx: 'rubble', icon: 'mountain',
              text: '薇帕颱風帶來豪雨後，馬太鞍溪上游發生大規模崩塌，土石堵住溪谷，形成壩高約120公尺的堰塞湖。' },
            { time: '8月～9月', title: '持續長大的湖', fx: 'calm', icon: 'waves',
              text: '林業保育署持續監測堰塞湖，湖水在接下來兩個月不斷累積。' },
            { time: '2025/09/22', title: '紅色警戒', fx: 'siren', icon: 'siren',
              text: '樺加沙颱風逼近，林業保育署發布紅色警戒，花蓮縣政府啟動下游地區撤離。' },
            { time: '9/23 下午', title: '湖水溢流', fx: 'impact', icon: 'waves',
              text: '豪雨讓湖水越過壩頂，大量泥水夾帶土石沖向下游。' },
            { time: '9/23 下午', title: '淹進光復', fx: 'rubble', icon: 'house',
              text: '泥流沖斷台9線馬太鞍溪橋，衝破堤防，湧入光復鄉市區。' },
            { time: '結果', title: '19條人命', fx: 'dark', icon: 'heart-crack',
              text: '災害造成19人罹難、5人失蹤、157人受傷，大片家園與農田被泥沙掩埋。' },
            { time: '災後', title: '鏟子超人', fx: 'hospital', icon: 'shovel',
              text: '9月24日到10月12日，約50萬人次搭火車到光復，拿著鏟子幫忙清淤，被稱為「鏟子超人」。' },
            { time: '調查', title: '尚未結束的檢討', fx: 'court', icon: 'search',
              text: '撤離的決策與執行，檢調與監察院介入調查；「垂直避難」的爭議，也讓各界重新檢討防災撤離的做法。' },
        ],
        sim: [
            { scene: '你家在堰塞湖下游，政府發布紅色警戒要求撤離，但你家是兩層樓。你會怎麼做？', fx: 'siren',
              options: [
                { text: '待在二樓就好，水應該淹不上來', correct: false, why: '泥流夾帶土石，衝擊力和淹水高度都可能超出預期。' },
                { text: '依指示撤離到指定避難處所，並帶著家中長輩一起離開', correct: true, why: '在警戒範圍內，最安全的做法是及早撤離到安全的地方。' },
                { text: '先觀望，看到水來了再走', correct: false, why: '泥流來得又快又猛，等看到時往往已經來不及。' },
              ] },
            { scene: '撤離時，你發現隔壁獨居的阿嬤不肯離開家。你該怎麼辦？', fx: 'calm',
              options: [
                { text: '尊重她的決定，自己先走', correct: false, why: '長輩常低估危險，也可能行動不便，需要有人協助。' },
                { text: '耐心說明危險，並立刻通報村里長、消防或警察人員協助撤離', correct: true, why: '把狀況交給有能力的人處理，才能讓每個人都離開危險區。' },
                { text: '自己留下來陪她', correct: false, why: '這樣兩個人都會身處險境，也增加救援的負擔。' },
              ] },
            { scene: '洪水突然湧進街道，你被困在屋內。你會怎麼做？', fx: 'rubble',
              options: [
                { text: '涉水出去開車離開', correct: false, why: '泥水中看不見坑洞與漂流物，車輛也可能被沖走。' },
                { text: '往高處移動，保留手機電力，用燈光或顏色鮮明的衣物向救援人員示意', correct: true, why: '先讓自己待在安全的高處，再讓救援人員看得到你。' },
                { text: '躲進地下室', correct: false, why: '地下室會最先被淹沒，非常危險。' },
              ] },
            { scene: '你想當「鏟子超人」去光復幫忙清淤。出發前要注意什麼？', fx: 'hospital',
              options: [
                { text: '穿短褲、拖鞋比較方便', correct: false, why: '泥沙裡可能有尖銳物與細菌，皮膚外露容易受傷感染。' },
                { text: '穿雨鞋、戴手套和口罩，有傷口立刻清洗消毒，注意補水防曬，並聽從志工中心分派', correct: true, why: '保護好自己，才能真正幫上忙，也不會增加當地醫療的負擔。' },
                { text: '自己開車直接衝進災區', correct: false, why: '私人車輛會堵住救災道路，建議搭乘大眾運輸。' },
              ] },
        ]
    }
};

// ═══════════════════════════════════════════════
// 觀看紀錄（index.html 與 timeline.html 共用）
// 規則：每起事故要「看完故事或 3D 動畫」且「至少觀看 WATCH_MIN_SEC 秒」，才能進入分析
// ═══════════════════════════════════════════════
const WATCH_MIN_SEC = 60;   // 每起事故至少要觀看的秒數（老師可自行調整，例如改成 120）
const watchLog = {
    all() { try { return JSON.parse(localStorage.getItem('sg_watch') || '{}'); } catch (_) { return {}; } },
    get(key) { return this.all()[key] || { sec: 0, done: false }; },
    save(all) { try { localStorage.setItem('sg_watch', JSON.stringify(all)); } catch (_) {} },
    add(key, sec) { const a = this.all(); a[key] = a[key] || { sec: 0, done: false }; a[key].sec += sec; this.save(a); },
    finish(key) { const a = this.all(); a[key] = a[key] || { sec: 0, done: false }; a[key].done = true; a[key].doneAt = a[key].doneAt || Date.now(); this.save(a); },
    teacher() { try { return localStorage.getItem('sg_teacher') === '1'; } catch (_) { return false; } },
    unlocked(key) { if (this.teacher()) return true; const w = this.get(key); return w.done && w.sec >= WATCH_MIN_SEC; },
    remain(key) { return Math.max(0, Math.ceil(WATCH_MIN_SEC - this.get(key).sec)); },
    clear() { try { localStorage.removeItem('sg_watch'); } catch (_) {} },
    text(key) {   // 給報告與學習記錄用的文字
        const w = this.get(key), m = Math.floor(w.sec / 60), s = Math.round(w.sec % 60);
        return `${w.done ? '已看完' : '尚未看完'}，觀看 ${m} 分 ${s} 秒`;
    },
};
// 只在畫面顯示時計時（切到別的分頁、縮小視窗就暫停）
const watchTimer = {
    key: null, id: null,
    start(key) {
        if (this.key === key && this.id) return;
        this.stop(); this.key = key;
        this.id = setInterval(() => { if (document.visibilityState === 'visible') watchLog.add(key, 1); }, 1000);
    },
    stop() { clearInterval(this.id); this.id = null; this.key = null; },
};
// 老師預覽：在網址加上 ?teacher=1 開啟，?teacher=0 關閉（開啟後不受觀看限制）
(function () {
    try {
        const t = new URLSearchParams(location.search).get('teacher');
        if (t === '1') localStorage.setItem('sg_teacher', '1');
        if (t === '0') localStorage.removeItem('sg_teacher');
    } catch (_) {}
    // 老師模式開啟時，畫面左下角固定顯示標籤，避免在公用電腦上忘了關閉
    function badge() {
        if (!watchLog.teacher() || document.getElementById('teacher-badge')) return;
        const el = document.createElement('div');
        el.id = 'teacher-badge';
        el.setAttribute('style', 'position:fixed;left:12px;bottom:12px;z-index:9999;display:flex;align-items:center;gap:8px;' +
            'padding:6px 12px;border-radius:9999px;background:#1e3a8a;color:#fff;font:600 13px/1.4 sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.35)');
        el.innerHTML = '🎓 老師模式（不受觀看限制）<button type="button" style="border:0;border-radius:9999px;padding:2px 10px;' +
            'background:#fff;color:#1e3a8a;font:600 12px sans-serif;cursor:pointer">關閉</button>';
        el.querySelector('button').onclick = () => { try { localStorage.removeItem('sg_teacher'); } catch (_) {} location.replace(location.pathname + location.hash); };   // 去掉網址中的 ?teacher=1，避免重新開啟
        document.body.appendChild(el);
    }
    if (document.body) badge(); else document.addEventListener('DOMContentLoaded', badge);
})();
