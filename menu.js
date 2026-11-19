/* 來杯！菜單（照「菜單B5雙面 正確版.pdf」）——要改菜單、價格、英文，就改這個檔案
   o: 規格選項（每個選項自己的價格）  t: 溫度 cold／hot／both  s: 甜度 full（無糖～全糖）／min3（最低三分）
   top: 可以加料  pop: 👑 招牌 */
const M = (zh,en,price)=>({zh,en,price});
const MENU = [
  {id:"herb", zh:"拾草漢方・島嶼敘事", tab:"漢方島嶼", en:"Herbal & Island Stories", items:[
    {id:"h1",zh:"青草茶",en:"Herbal Grass Tea",dzh:"漢方草本飲品",den:"Traditional herbal drink",price:65,t:"both",s:"grass"},
    {id:"h3",zh:"島嶼檸檬飲",en:"Island Lemonade",dzh:"島嶼敘事・固定甜度",den:"An island original · pre-sweetened",price:65,t:"both",s:null}]},
  {id:"luye", zh:"拾茶・鹿野高台 自家茶園", tab:"鹿野茶園", en:"Luye Highland Teas · Our Own Garden", sub:{zh:"皆為中杯（M）",en:"All medium (M)"}, items:[
    {id:"l1",zh:"鹿野金萱茶",en:"Luye Jin Xuan Tea",o:[M("現泡","Fresh-brewed",50),{...M("冷泡","Cold-brewed",60),t:"cold"}],t:"both",s:"full"},
    {id:"l2",zh:"鹿野紅烏龍",en:"Luye Red Oolong",o:[M("現泡","Fresh-brewed",50),{...M("冷泡","Cold-brewed",60),t:"cold"}],t:"both",s:"full"},
    {id:"l3",zh:"鹿野蜜香紅茶",en:"Luye Honey-Scented Black Tea",o:[M("現泡","Fresh-brewed",50),{...M("冷泡","Cold-brewed",60),t:"cold"}],t:"both",s:"full"},
    {id:"l4",zh:"鹿野蜜香紅烏龍",en:"Luye Honey-Scented Red Oolong",dzh:"現泡",den:"Fresh-brewed",price:50,t:"both",s:"full",pop:true}]},
  {id:"tea", zh:"拾茶・剛剛好的清香", tab:"清香茶", en:"Classic Teas", sub:{zh:"可加料：珍珠／椰果／寒天 +5",en:"Add toppings: pearls / coconut jelly / agar +5"}, items:[
    {id:"t1",zh:"紅茶",en:"Black Tea",o:[M("M","M",20),M("L","L",35)],t:"both",s:"full",top:true},
    {id:"t2",zh:"綠茶",en:"Green Tea",o:[M("M","M",20),M("L","L",35)],t:"both",s:"full",top:true},
    {id:"t3",zh:"烏龍茶",en:"Oolong Tea",o:[M("M","M",20),M("L","L",35)],t:"both",s:"full",top:true},
    {id:"t4",zh:"紅烏龍",en:"Red Oolong",o:[M("M","M",35),M("L","L",45)],t:"both",s:"full",top:true},
    {id:"t5",zh:"綠烏龍",en:"Green Oolong",o:[M("M","M",35),M("L","L",45)],t:"both",s:"full",top:true},
    {id:"t6",zh:"桂花釀烏龍",en:"Osmanthus Oolong",dzh:"L 杯",den:"Size L",price:60,t:"cold",s:"min3",top:true,pop:true},
    {id:"t7",zh:"桂花釀綠茶",en:"Osmanthus Green Tea",dzh:"L 杯",den:"Size L",price:60,t:"cold",s:"min3",top:true},
    {id:"t8",zh:"蜂蜜紅",en:"Honey Black Tea",dzh:"L 杯",den:"Size L",price:60,t:"both",s:"min3",top:true},
    {id:"t9",zh:"蜂蜜綠",en:"Honey Green Tea",dzh:"L 杯",den:"Size L",price:60,t:"both",s:"min3",top:true},
    {id:"t10",zh:"蜂蜜烏龍",en:"Honey Oolong",dzh:"L 杯",den:"Size L",price:60,t:"both",s:"min3",top:true}]},
  {id:"fruit", zh:"拾果・酸甜之間剛剛好", tab:"果茶", en:"Fruit & Honey", sub:{zh:"皆為 L 杯・可加料 +5",en:"All size L · toppings +5"}, items:[
    {id:"f1",zh:"檸檬汁",en:"Lemon Juice",price:65,t:"cold",s:"full",top:true},
    {id:"f2",zh:"蜂蜜水",en:"Honey Water",price:65,t:"cold",s:"full",top:true},
    {id:"f3",zh:"金桔檸檬",en:"Kumquat Lemon",price:65,t:"cold",s:"full",top:true},
    {id:"f4",zh:"蜂蜜檸檬",en:"Honey Lemon",price:65,t:"cold",s:"full",top:true},
    {id:"f5",zh:"夢幻花果茶",en:"Dreamy Fruit & Flower Tea",price:65,t:"both",s:"full",top:true,pop:true},
    {id:"f6",zh:"柚子茶",en:"Yuzu Citron Tea",price:65,t:"both",s:"full",top:true},
    {id:"f7",zh:"金剛洛神花茶",en:"Roselle Tea",dzh:"固定甜度",den:"Pre-sweetened",price:65,t:"both",s:null,top:true},
    {id:"f8",zh:"桂圓紅棗茶",en:"Longan & Red Date Tea",dzh:"熱飲",den:"Hot drink",price:65,t:"hot",s:"full",top:true},
    {id:"f9",zh:"黑糖薑母茶",en:"Brown Sugar Ginger Tea",dzh:"熱飲",den:"Hot drink",price:65,t:"hot",s:"full",top:true}]},
  {id:"milk", zh:"拾奶・濃淡剛好 溫潤入心", tab:"奶茶鮮奶", en:"Milk Teas & Fresh Milk", sub:{zh:"皆為 L 杯・可加料 +5",en:"All size L · toppings +5"}, items:[
    {id:"m1",zh:"奶茶／奶綠／烏龍奶",en:"Milk Tea",o:[M("奶茶","Black milk tea",60),M("奶綠","Green milk tea",60),M("烏龍奶","Oolong milk tea",60)],t:"both",s:"min3",top:true},
    {id:"m2",zh:"珍珠奶茶",en:"Bubble Milk Tea",price:65,t:"both",s:"min3",top:true},
    {id:"m3",zh:"泰式奶茶",en:"Thai Milk Tea",price:70,t:"both",s:"min3",top:true,pop:true},
    {id:"m4",zh:"抹茶奶茶",en:"Matcha Milk Tea",price:70,t:"both",s:"min3",top:true},
    {id:"m5",zh:"濃香可可",en:"Rich Cocoa",price:70,t:"both",s:"min3",top:true},
    {id:"m6",zh:"黑糖鮮奶",en:"Brown Sugar Fresh Milk",price:70,t:"both",s:null,top:true},
    {id:"m7",zh:"黑糖珍珠鮮奶",en:"Brown Sugar Boba Fresh Milk",price:75,t:"both",s:null,top:true},
    {id:"m8",zh:"紅茶鮮奶",en:"Black Tea Latte",price:70,t:"both",s:"full",top:true},
    {id:"m9",zh:"綠茶鮮奶",en:"Green Tea Latte",price:70,t:"both",s:"full",top:true},
    {id:"m10",zh:"烏龍鮮奶",en:"Oolong Tea Latte",price:70,t:"both",s:"full",top:true}]},
  {id:"coffee", zh:"經典咖啡", tab:"咖啡", en:"Coffee", items:[
    {id:"c1",zh:"美式咖啡",en:"Americano",o:[M("M","M",45),M("L","L",55)],t:"both",s:"full"},
    {id:"c2",zh:"鮮奶拿鐵",en:"Café Latte",o:[M("M","M",70),M("L","L",85)],t:"both",s:"full"},
    {id:"c4",zh:"鴛鴦咖啡",en:"Yuanyang (Coffee + Milk Tea)",o:[M("M","M",75),M("L","L",90)],t:"both",s:"full"}]},
  {id:"secret", zh:"隱藏版・古法熬製系列", tab:"隱藏版", en:"Secret Menu · Slow-Simmered", sub:{zh:"皆為中杯（M）$85",en:"All medium (M) · $85"}, items:[
    {id:"x1",zh:"宮廷桂花烏梅",en:"Imperial Osmanthus Smoked Plum",dzh:"桂花清香、烏梅酸甜，花香回甘，適合餐後享用",den:"Osmanthus aroma, sweet-sour smoked plum. Lovely after a meal.",price:85,t:"both",s:null,pop:true},
    {id:"x2",zh:"冰梅汁",en:"Iced Plum Juice",dzh:"酸甜平衡、冰涼清爽，清新順口",den:"Balanced sweet and sour, light and refreshing",price:85,t:"cold",s:null,pop:true}]},
  {id:"pop", zh:"斑鳩冰品", tab:"冰棒", en:"Banjiu Ice Pops", sub:{zh:"一支 $50",en:"$50 each"}, items:[
    {id:"p1",zh:"初鹿鮮奶",en:"Chulu Fresh Milk",price:50},
    {id:"p2",zh:"蜜鳳梨",en:"Honey Pineapple",price:50},
    {id:"p3",zh:"鳳梨釋迦",en:"Pineapple Sugar Apple",price:50},
    {id:"p4",zh:"紅豆牛奶",en:"Red Bean Milk",price:50},
    {id:"p5",zh:"鳳尾洛神",en:"Roselle",price:50},
    {id:"p6",zh:"百香果",en:"Passion Fruit",price:50},
    {id:"p7",zh:"山楂烏梅",en:"Hawthorn & Smoked Plum",price:50},
    {id:"p8",zh:"桂圓糯米",en:"Longan Sticky Rice",price:50},
    {id:"p9",zh:"杏仁蛋黃鹹冰棒",en:"Almond Salted Egg Yolk",price:50}]},
  {id:"snack", zh:"點心・甜品與在地伴手禮", tab:"點心", en:"Snacks, Desserts & Local Gifts", items:[
    {id:"k2",zh:"奶酪",en:"Panna Cotta",o:[M("原味","Original",50),M("海草","Seaweed",60)]},
    {id:"k3",zh:"鬆餅",en:"Waffle",o:[M("蜂蜜","Honey",50),M("巧克力","Chocolate",50),M("鮪魚玉米","Tuna & Corn",60)]},
    {id:"k4",zh:"小米甜甜圈",en:"Millet Donut",price:45},
    {id:"k5",zh:"紅豆紫米粥",en:"Red Bean & Purple Rice Porridge",price:55}]}
];
/* 2026-11-19 Jenny：飲料一律冷飲（只有黑糖薑母茶、桂圓紅棗茶是熱的）；甜度照店裡的分法 */
const COLD = ["ice","less","light","none"];
const ICE = {cold:COLD, hot:["hot"], both:COLD};
/* 2026-11-19 Jenny：拾草漢方甜度固定，只有青草茶能選無糖／微糖；金剛洛神花茶固定甜度；林投汁、日式抹茶咖啡、手工起司棒拿掉 */
const SUGAR = {full:["s0","s1","s3","s5","s10"], min3:["s3","s5","s7","s10"], grass:["s0","sl"]};
/* 這些甜度不預設，客人一定要自己選（青草茶：無糖／微糖） */
const SUGAR_PICK = ["grass"];
const TOPS = ["pearl","coco","agar"], TOP_PRICE = 5;
const LBL = {
  ice:{zh:"正常冰",en:"Regular ice"}, less:{zh:"少冰",en:"Less ice"}, light:{zh:"微冰",en:"Light ice"}, none:{zh:"去冰",en:"No ice"}, hot:{zh:"熱",en:"Hot"},
  s10:{zh:"全糖",en:"Full sugar"}, s7:{zh:"少糖",en:"Less sugar (70%)"}, s5:{zh:"半糖（五分）",en:"Half sugar (50%)"}, s3:{zh:"三分糖",en:"30% sugar"}, s1:{zh:"一分糖",en:"10% sugar"}, s0:{zh:"無糖",en:"No sugar"}, sl:{zh:"微糖",en:"Light sugar"},
  pearl:{zh:"珍珠",en:"Tapioca pearls"}, coco:{zh:"椰果",en:"Coconut jelly"}, agar:{zh:"寒天",en:"Agar jelly"}
};
const TABLES = ["1","2","3","4","5","6","7","8"];
const T = {
  zh:{eyebrow:"綠島・GREEN ISLAND", add:"加入", choose:"選擇", viewcart:"查看購物車", cart:"你的餐點",
      flow:"送出後請到櫃檯付款，付款後會給你取餐號碼，做好叫號請自己取餐。", note:"備註（選填）", notePh:"例如：飲料分開裝", total:"合計", send:"送出訂單", sending:"送出中…",
      keep:"繼續點餐", empty:"購物車是空的", popular:"招牌", sent:"訂單送出了！",
      sentMsg:n=>"請到櫃檯告訴店員訂單代碼「"+n+"」並付款。付款後這裡會顯示你的取餐號碼。",
      ok:"好", mine:"我的訂單", code:"訂單代碼", num:"取餐號碼", st:{new:"請到櫃檯付款",cooking:"製作中",done:"好了，請取餐",cancel:"已取消"}, err:"訂單沒有送出去，請再試一次，或直接跟店員說。",
      demo:"示範模式：這個畫面沒有連上雲端，訂單只會存在這支手機裡。",
      gSize:"規格", gIce:"冰塊", gSugar:"甜度", gTop:"加料", gTopHint:"每樣 +$5，可以多選", qty:"數量", addN:p=>"加入購物車　"+p, min3:"這杯最低甜度三分", inCart:n=>"已點 "+n, from:"起", pickSugar:"請先選甜度"},
  en:{eyebrow:"GREEN ISLAND · TAIWAN", add:"Add", choose:"Choose", viewcart:"View cart", cart:"Your order",
      flow:"After ordering, please pay at the counter. You'll get a pickup number; collect your order when it's called.", note:"Notes (optional)", notePh:"e.g. pack drinks separately", total:"Total", send:"Place order", sending:"Sending…",
      keep:"Keep browsing", empty:"Your cart is empty", popular:"Signature", sent:"Order placed!",
      sentMsg:n=>"Please go to the counter, show order code \""+n+"\" and pay. Your pickup number will appear here after payment.",
      ok:"OK", mine:"My orders", code:"Order code", num:"Pickup number", st:{new:"Please pay at the counter",cooking:"Preparing",done:"Ready, please pick up",cancel:"Cancelled"}, err:"Your order didn't go through. Please try again or tell our staff.",
      demo:"Demo mode: not connected, so orders are saved on this phone only.",
      gSize:"Option", gIce:"Ice level", gSugar:"Sweetness", gTop:"Toppings", gTopHint:"+$5 each, pick any", qty:"Quantity", addN:p=>"Add to cart · "+p, min3:"Minimum sweetness for this drink is 30%", inCart:n=>n+" in cart", from:"from", pickSugar:"Please choose sweetness"}
};
const ITEM = {}; MENU.forEach(c=>c.items.forEach(i=>ITEM[i.id]=i));
