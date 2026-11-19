/* 來杯！的綠島小指南（2026-11-19）——要改景點、餐廳、說明，就改這個檔案
   景點：Jenny 推薦；說明是 Claude 依網路資料寫的初稿，Jenny 可以改成自己的話
   餐廳：Jenny 從別人的推薦清單精簡，只放店名＋實用提醒（不照抄別人的心得） */
const GUIDE = {
  title: {zh:"來杯的綠島小指南", en:"Lai Bei!'s Green Island Mini Guide"},
  intro: {zh:"在地人推薦的景點和餐廳，走累了記得來杯一杯 🥤", en:"Local picks for sights and food. Thirsty? Come grab a drink 🥤"},
  spotsTitle: {zh:"📍 我推薦的景點", en:"📍 Places I recommend"},
  pairWith: {zh:"配這杯", en:"Pair with"},
  orderThis: {zh:"點這杯", en:"Order"},
  spots: [
    {zh:"國家人權博物館", en:"National Human Rights Museum",
     sub:{zh:"白色恐怖綠島紀念園區", en:"Green Island White Terror Memorial Park"},
     dzh:"來杯就在園區旁邊，參觀完過來坐一下、喝杯東西休息。", den:"Lai Bei! is right next to the park. Take a break with us after your visit.",
     drink:"x1"},
    {zh:"環島公路：哈巴狗與睡美人岩", en:"Round-Island Road: Puppy Rock & Sleeping Beauty Rock",
     dzh:"騎車環島一定會經過的海景，兩塊岩石像趴著的小狗和躺著的睡美人。", den:"A must-see on the scooter ride around the island. One rock looks like a resting puppy, the other like a sleeping woman.",
     drink:"x2"},
    {zh:"大白沙", en:"Dabaisha (Big White Sand)",
     dzh:"綠島南端，白色細沙配清澈海水，有一條面海步道。石頭比較利，下水建議穿拖鞋。", den:"On the southern tip: white sand, clear water and a seaside boardwalk. Wear sandals in the water; some rocks are sharp.",
     drink:"f1"},
    {zh:"小白屋", en:"Little White House",
     dzh:"燈塔附近的舊崗哨，從窗框拍燈塔和海景像一幅畫。入口比較隱密，路上有林投葉會刺人，建議穿長褲。", den:"An old lookout post near the lighthouse. Its window frames the lighthouse and sea like a painting. The path is hidden and has prickly pandanus leaves, so wear long pants.",
     drink:"f5"}
  ],
  foodTitle: {zh:"🍴 綠島吃什麼", en:"🍴 Where to eat"},
  food: [
    {zh:"台式", en:"Taiwanese", shops:[
      {n:"風味情"}, {n:"超難吃牛肉麵", zh:"週一休", en:"Closed Mon"}, {n:"小島太太"},
      {n:"魚燾極鮮鍋物", zh:"要先訂位", en:"Reservation needed"}]},
    {zh:"日式", en:"Japanese", shops:[
      {n:"夏天家", zh:"粉專私訊訂位", en:"Book via Facebook message"}, {n:"只有海"},
      {n:"歸海食堂", zh:"晚上才開", en:"Evenings only"}]},
    {zh:"西式", en:"Western", shops:[
      {n:"富富廚房", zh:"私訊訂位", en:"Book via message"}, {n:"Moon island 沐嶋", zh:"週二休", en:"Closed Tue"}]},
    {zh:"早午餐／咖啡", en:"Brunch & cafés", shops:[
      {n:"島後面"}, {n:"離海五分鐘", zh:"搬到龜灣方向", en:"Moved toward Guiwan"}, {n:"來杯！", zh:"就是我們 🥤", en:"That's us 🥤", me:true}]},
    {zh:"宵夜炸物", en:"Late-night fried food", shops:[
      {n:"A+炸食美饌", zh:"週三休", en:"Closed Wed"}, {n:"ㄞˋ轉角鹹酥雞"}]},
    {zh:"酒吧", en:"Bars", shops:[
      {n:"一個地方 BAR A•PLACE"}, {n:"牛浪 NiuLand"}, {n:"深入 島嶼酒吧", zh:"照店家 IG 指示找路", en:"Follow their Instagram directions"}]}
  ],
  tipsTitle: {zh:"🤿 小提醒", en:"🤿 Good to know"},
  tips: [
    {zh:"熱門店建議提早去或先訂位。", en:"Popular places fill up. Go early or book ahead."},
    {zh:"島上很多店營業時間不固定，出發前先看店家 IG。", en:"Many shops keep irregular hours. Check their Instagram before you go."},
    {zh:"天氣不好、船停開的時候，很多店會臨時休息。", en:"When weather is bad or ferries stop, many shops close for the day."}
  ]
};

/* 畫出小指南（app.js 切到 #guide 時會呼叫） */
window.renderGuide = function(lang){
  const box = document.getElementById("guide"); if(!box) return;
  const t = o => o[lang] || o.zh;
  const mk = (tag, cls, text) => { const e = document.createElement(tag); if(cls) e.className = cls; if(text != null) e.textContent = text; return e; };
  box.replaceChildren();
  box.append(mk("h2","g-title",t(GUIDE.title)), mk("p","g-intro",t(GUIDE.intro)));

  box.append(mk("h3","g-h",t(GUIDE.spotsTitle)));
  const spots = mk("div","g-spots");
  GUIDE.spots.forEach(s => {
    const card = mk("div","g-spot");
    card.append(mk("div","g-name",t(s)));
    if(s.sub) card.append(mk("div","g-sub",t(s.sub)));
    card.append(mk("p","g-desc",lang==="zh"?s.dzh:s.den));
    const it = ITEM[s.drink];
    if(it){
      const row = mk("div","g-pair");
      row.append(mk("span","g-pair-l",t(GUIDE.pairWith)+"："), mk("b",null,it[lang]));
      const btn = mk("button","g-order",t(GUIDE.orderThis));
      btn.onclick = () => { location.hash = ""; setTimeout(() => window.openItemById && window.openItemById(s.drink), 50); };
      row.append(btn); card.append(row);
    }
    spots.append(card);
  });
  box.append(spots);

  box.append(mk("h3","g-h",t(GUIDE.foodTitle)));
  GUIDE.food.forEach(c => {
    const sec = mk("div","g-food");
    sec.append(mk("div","g-cat",t(c)));
    const ul = mk("ul","g-list");
    c.shops.forEach(s => {
      const li = mk("li", s.me ? "g-me" : null);
      li.append(mk("span","g-shop",s.n));
      if(s.zh) li.append(mk("span","g-note",lang==="zh"?s.zh:s.en));
      ul.append(li);
    });
    sec.append(ul); box.append(sec);
  });

  box.append(mk("h3","g-h",t(GUIDE.tipsTitle)));
  const tips = mk("ul","g-tips"); GUIDE.tips.forEach(x => tips.append(mk("li",null,t(x)))); box.append(tips);
};
