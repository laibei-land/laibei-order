// 來杯！線上點餐（公開版）：客人不用登入就能點；老闆娘用 Google 登入後台
// 菜單、文字、選項在 menu.js；Firebase 設定在 firebase-config.js
import { firebaseConfig } from "./firebase-config.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
const configured = firebaseConfig.apiKey && firebaseConfig.apiKey !== "貼上";
let F = null;   // Firebase 函式
let fdb = null, auth = null;

let lang = "zh", cart = [], note = "";
let myIds = [], myOrders = {}, allOrders = {}, kFilter = "open", adminOK = false;
const unsubs = {};
const $ = s => document.querySelector(s);
const money = n => "$" + Number(n || 0).toLocaleString("en-US");
const L = () => T[lang];
const store = {get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}, set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
function el(tag, attrs={}, ...kids){const e=document.createElement(tag);for(const[k,v]of Object.entries(attrs)){if(k==="class")e.className=v;else if(k.startsWith("on"))e.addEventListener(k.slice(2),v);else e.setAttribute(k,v)}kids.flat().forEach(k=>{if(k!==null&&k!==undefined&&k!=="")e.append(k)});return e}
const startOfToday = () => {const d=new Date();d.setHours(0,0,0,0);return d.getTime()};
const dayKey = () => {const d=new Date();return d.getFullYear()+String(d.getMonth()+1).padStart(2,"0")+String(d.getDate()).padStart(2,"0")};

/* ---------- 價格與選項 ---------- */
const needsSheet = i => (i.o&&i.o.length>1)||i.t||i.s||i.top;
function unitPrice(l){const i=ITEM[l.id];if(!i)return 0;const base=i.o?i.o[l.o||0].price:i.price;return base+(l.tops||[]).length*TOP_PRICE}
function summary(l,lg){const i=ITEM[l.id],p=[];if(i&&i.o)p.push(i.o[l.o||0][lg]);if(l.ice&&LBL[l.ice])p.push(LBL[l.ice][lg]);if(l.sugar&&LBL[l.sugar])p.push(LBL[l.sugar][lg]);(l.tops||[]).forEach(t=>LBL[t]&&p.push("+"+LBL[t][lg]));return p.join(lg==="zh"?"・":" · ")}
const lineKey = l => [l.id,l.o??"",l.ice||"",l.sugar||"",(l.tops||[]).slice().sort().join("+")].join("|");
function priceText(i){if(!i.o)return money(i.price);const ps=i.o.map(o=>o.price);if(i.o.every(o=>["M","L"].includes(o.zh)))return i.o.map(o=>o.zh+" "+money(o.price)).join("　");return Math.min(...ps)===Math.max(...ps)?money(ps[0]):money(Math.min(...ps))+" "+L().from}
/* 後台用菜單價格重算，避免有人改價格 */
const realTotal = o => (o.items||[]).reduce((a,l)=>a+unitPrice(l)*(l.q||0),0);

/* ---------- 菜單畫面 ---------- */
function setLang(l){lang=l;store.set("lang",l);document.documentElement.lang=l==="zh"?"zh-Hant":"en";
  $("#lang-zh").setAttribute("aria-pressed",l==="zh");$("#lang-en").setAttribute("aria-pressed",l==="en");
  $("#t-eyebrow").textContent=L().eyebrow;$("#t-viewcart").textContent=L().viewcart;
  if(!configured){$("#demo-note").textContent=L().demo;}
  if($("#tabs")){$("#tab-menu").textContent=l==="zh"?"🥤 點餐":"🥤 Order";$("#tab-guide").textContent=l==="zh"?"🗺 綠島小指南":"🗺 Island Guide";}
  if(window.renderGuide&&$("#view-guide")&&!$("#view-guide").hidden)window.renderGuide(l);
  renderMenu();renderBar();renderMine();if(!$("#sheet").hidden&&sheetMode==="cart")openCart();else closeSheet()}
const countOf = id => cart.filter(l=>l.id===id).reduce((a,l)=>a+l.q,0);
function renderMenu(){
  const cats=$("#cats"),menu=$("#menu");cats.replaceChildren();menu.replaceChildren();
  MENU.forEach(c=>{
    cats.append(el("button",{onclick:()=>document.getElementById("cat-"+c.id).scrollIntoView({behavior:"smooth",block:"start"})},lang==="zh"?c.tab:c.en.split(" · ")[0]));
    const list=el("div",{class:"items"});
    c.items.forEach(i=>{const n=countOf(i.id);
      const ctrl=el("div",{class:"ctrl",style:"flex-direction:column;gap:4px"},el("button",{class:"add",onclick:()=>needsSheet(i)?openItem(i):addLine({id:i.id,o:i.o?0:null,q:1})},needsSheet(i)?L().choose:L().add),n?el("div",{class:"incart"},L().inCart(n)):"");
      const name=el("div",{class:"name"},i[lang]);if(i.pop)name.append(el("span",{class:"crown"},"♛ "+L().popular));
      list.append(el("div",{class:"item"},name,(i.dzh||i.den)?el("div",{class:"desc"},lang==="zh"?i.dzh:i.den):"",el("div",{class:"price"},priceText(i)),ctrl))});
    menu.append(el("section",{class:"cat",id:"cat-"+c.id},el("h2",{},c[lang]),el("p",{class:"sub"},c.sub?c.sub[lang]:(lang==="zh"?c.en:c.zh)),list))});
}
function addLine(l){const k=lineKey(l),ex=cart.find(x=>lineKey(x)===k);if(ex)ex.q+=l.q;else cart.push(l);saveCart()}
function saveCart(){store.set("cart2",cart);renderMenu();renderBar()}
const cartCount=()=>cart.reduce((a,l)=>a+l.q,0);
const cartTotal=()=>cart.reduce((a,l)=>a+unitPrice(l)*l.q,0);
function renderBar(){const n=cartCount();$("#bar").hidden=n===0||$("#view-menu").hidden;$("#bar-count").textContent=n;$("#bar-total").textContent=money(cartTotal())}

let sheetMode="";
function openItem(i){
  sheetMode="item";const p=$("#panel");$("#sheet").hidden=false;
  const st={id:i.id,o:i.o?0:null,ice:null,sugar:null,tops:[],q:1};
  const temp=()=>(i.o&&i.o[st.o]&&i.o[st.o].t)||i.t;
  const draw=()=>{
    const ices=temp()?ICE[temp()]:null;if(ices&&!ices.includes(st.ice))st.ice=ices[0];if(!ices)st.ice=null;
    const mustPick=!!i.s&&typeof SUGAR_PICK!=="undefined"&&SUGAR_PICK.includes(i.s);
    const sugars=i.s?SUGAR[i.s]:null;if(sugars&&!mustPick&&!sugars.includes(st.sugar))st.sugar=sugars[sugars.length-1];
    const chips=(opts,cur,set,lab)=>el("div",{class:"chips"},...opts.map(v=>el("button",{"aria-pressed":String(cur(v)),onclick:()=>{set(v);draw()}},lab(v))));
    p.replaceChildren(el("h3",{},i[lang]),(i.dzh||i.den)?el("p",{class:"hint"},lang==="zh"?i.dzh:i.den):"");
    if(i.o&&i.o.length>1)p.append(el("div",{class:"group"},el("div",{class:"gl"},L().gSize),chips(i.o.map((_,k)=>k),k=>st.o===k,k=>st.o=k,k=>i.o[k][lang]+"　"+money(i.o[k].price))));
    if(ices&&ices.length>1)p.append(el("div",{class:"group"},el("div",{class:"gl"},L().gIce),chips(ices,v=>st.ice===v,v=>st.ice=v,v=>LBL[v][lang])));
    if(sugars)p.append(el("div",{class:"group"},el("div",{class:"gl"},L().gSugar,i.s==="min3"?el("small",{},L().min3):""),chips(sugars,v=>st.sugar===v,v=>st.sugar=v,v=>LBL[v][lang])));
    if(i.top)p.append(el("div",{class:"group"},el("div",{class:"gl"},L().gTop,el("small",{},L().gTopHint)),chips(TOPS,v=>st.tops.includes(v),v=>{st.tops=st.tops.includes(v)?st.tops.filter(x=>x!==v):[...st.tops,v]},v=>LBL[v][lang])));
    p.append(el("div",{class:"qrow"},el("span",{style:"font-weight:700"},L().qty),el("button",{class:"step",onclick:()=>{st.q=Math.max(1,st.q-1);draw()}},"−"),el("span",{class:"qty"},String(st.q)),el("button",{class:"step",onclick:()=>{st.q=Math.min(20,st.q+1);draw()}},"+")));
    const need=mustPick&&!st.sugar;
    const addBtn=el("button",{class:"primary",onclick:()=>{if(need)return;addLine({...st,tops:[...st.tops]});closeSheet()}},need?L().pickSugar:L().addN(money(unitPrice(st)*st.q)));addBtn.disabled=need;
    p.append(addBtn,el("button",{class:"ghost",onclick:closeSheet},L().keep));
  };
  draw();
}
function openCart(){
  sheetMode="cart";const p=$("#panel");p.replaceChildren();$("#sheet").hidden=false;
  p.append(el("h3",{},L().cart));
  if(!cartCount()){p.append(el("p",{},L().empty),el("button",{class:"ghost",onclick:closeSheet},L().keep));return}
  cart.forEach((l,idx)=>{const i=ITEM[l.id];
    p.append(el("div",{class:"line"},el("div",{class:"l"},el("div",{},i[lang]),summary(l,lang)?el("div",{class:"o"},summary(l,lang)):"",el("div",{class:"num o"},money(unitPrice(l))+" × "+l.q)),
      el("div",{style:"display:flex;gap:8px;align-items:center"},el("button",{class:"step",onclick:()=>{l.q--;if(l.q<=0)cart.splice(idx,1);saveCart();openCart()}},"−"),el("span",{class:"qty"},String(l.q)),el("button",{class:"step",onclick:()=>{l.q=Math.min(20,l.q+1);saveCart();openCart()}},"+"))))});
  const ta=el("textarea",{id:"note",placeholder:L().notePh,maxlength:"200"});ta.value=note;ta.addEventListener("input",()=>note=ta.value);
  const err=el("div",{class:"err",hidden:""});
  const btn=el("button",{class:"primary",onclick:()=>submit(btn,err)},L().send);
  p.append(el("div",{class:"field"},el("label",{for:"note"},L().note),ta),
    el("div",{class:"total"},el("span",{},L().total),el("span",{class:"num"},money(cartTotal()))),
    el("p",{class:"flow"},L().flow),btn,err,el("button",{class:"ghost",onclick:closeSheet},L().keep));
}
function closeSheet(){$("#sheet").hidden=true;sheetMode=""}
$("#sheet").addEventListener("click",e=>{if(e.target.id==="sheet")closeSheet()});

/* ---------- 送出訂單 ---------- */
const orderCode = () => String(Math.floor(Math.random()*900+100));
const withTimeout = (p,ms) => Promise.race([p,new Promise((_,rej)=>setTimeout(()=>rej(new Error("timeout")),ms))]);
async function submit(btn,err){
  btn.disabled=true;btn.textContent=L().sending;err.hidden=true;
  const order={code:orderCode(),note:note.trim().slice(0,200),lang,status:"new",createdAt:Date.now(),
    items:cart.map(l=>({id:l.id,q:l.q,price:unitPrice(l),o:l.o??null,ice:l.ice||null,sugar:l.sugar||null,tops:l.tops||[]})),total:cartTotal()};
  try{
    let id;
    if(F){const ref=F.doc(F.collection(fdb,"orders"));id=ref.id;await withTimeout(F.setDoc(ref,order),15000)}
    else{id="demo"+Date.now();allOrders[id]={...order};}
    myIds=[...myIds.filter(x=>x.t>Date.now()-12*3600e3),{id,t:Date.now()}];store.set("myOrders",myIds);
    watchMine(id,order);
    cart=[];note="";saveCart();
    $("#panel").replaceChildren(el("h3",{},L().sent),el("p",{},L().sentMsg(order.code)),el("button",{class:"primary",onclick:closeSheet},L().ok));
  }catch(e){console.error(e);btn.disabled=false;btn.textContent=L().send;err.textContent=L().err;err.hidden=false}
}

/* ---------- 客人看自己的訂單 ---------- */
function watchMine(id,initial){
  if(initial)myOrders[id]=initial;
  if(F&&!unsubs[id])unsubs[id]=F.onSnapshot(F.doc(fdb,"orders",id),s=>{if(s.exists()){myOrders[id]=s.data();renderMine()}},()=>{});
  if(!F)myOrders[id]=allOrders[id]||initial;
  renderMine();
}
function renderMine(){
  const box=$("#my-orders");box.replaceChildren();
  if(!F)Object.keys(myOrders).forEach(id=>{if(allOrders[id])myOrders[id]=allOrders[id]});
  const list=Object.values(myOrders).filter(o=>o&&Date.now()-o.createdAt<12*3600e3).sort((a,b)=>b.createdAt-a.createdAt);
  if(!list.length)return;
  box.append(el("section",{class:"cat"},el("h2",{},L().mine),...list.map(o=>el("div",{class:"mine"},
    el("div",{},o.num?el("div",{class:"bignum"},el("small",{},L().num),String(o.num)):el("div",{style:"font-weight:700"},L().code+"："+o.code),
      el("div",{style:"color:var(--muted);font-size:13px"},(o.items||[]).map(i=>(ITEM[i.id]?.[lang]||i.id)+" ×"+i.q).join(lang==="zh"?"、":", "))),
    el("span",{class:"chip "+o.status},L().st[o.status]||"")))));
}

/* ---------- 老闆娘後台（網址最後加 #kitchen） ---------- */
let kUnsub=null;
function onHash(){
  const hasGuide=!!$("#view-guide");
  const k=location.hash==="#kitchen",g=hasGuide&&location.hash==="#guide";
  $("#view-kitchen").hidden=!k;$("#view-menu").hidden=k||g;
  if(hasGuide){$("#view-guide").hidden=!g;$("#tabs").hidden=k;
    $("#tab-menu").setAttribute("aria-current",!k&&!g?"page":"false");$("#tab-guide").setAttribute("aria-current",g?"page":"false");}
  renderBar();
  if(k)startKitchen();
  if(g&&window.renderGuide){window.renderGuide(lang);window.scrollTo(0,0)}
}
/* 小指南的「點這杯」按鈕用 */
window.openItemById=id=>{const i=ITEM[id];if(!i)return;needsSheet(i)?openItem(i):addLine({id:i.id,o:i.o?0:null,q:1})};
function startKitchen(){
  if(!F){$("#k-login").hidden=true;$("#k-board").hidden=false;$("#k-who").textContent="示範模式（還沒連上 Firebase）";renderKitchen();return}
  const u=auth.currentUser;
  if(!u){$("#k-login").hidden=false;$("#k-board").hidden=true;return}
  $("#k-login").hidden=true;$("#k-board").hidden=false;
  $("#k-who").replaceChildren("登入：",u.email||"",el("button",{onclick:()=>F.signOut(auth)},"登出"));
  if(kUnsub)return;
  const q=F.query(F.collection(fdb,"orders"),F.where("createdAt",">=",startOfToday()-6*3600e3));
  kUnsub=F.onSnapshot(q,s=>{allOrders={};s.forEach(d=>allOrders[d.id]=d.data());adminOK=true;renderKitchen()},e=>{
    console.error(e);kUnsub=null;
    $("#orders").replaceChildren(el("div",{class:"empty"},e.code==="permission-denied"?"這個 Google 帳號沒有後台權限。請登出，改用店裡設定的那個帳號。":"暫時讀不到訂單，請檢查網路後重新整理。"));
  });
}
document.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{kFilter=b.dataset.f;document.querySelectorAll("[data-f]").forEach(x=>x.setAttribute("aria-pressed",x===b));renderKitchen()});

function renderKitchen(){
  const all=Object.entries(allOrders).map(([oid,o])=>({...o,oid}));
  const todays=all.filter(o=>o.createdAt>=startOfToday());
  $("#s-new").textContent=todays.filter(o=>o.status==="new").length;
  $("#s-cook").textContent=todays.filter(o=>o.status==="cooking").length;
  $("#s-rev").textContent=money(todays.filter(o=>o.status==="cooking"||o.status==="done").reduce((a,o)=>a+realTotal(o),0));
  const isOpen=o=>o.status==="new"||o.status==="cooking";
  const list=all.filter(o=>kFilter==="done"?!isOpen(o):isOpen(o)).sort((a,b)=>kFilter==="done"?b.createdAt-a.createdAt:a.createdAt-b.createdAt);
  const box=$("#orders");box.replaceChildren();
  if(!list.length){box.append(el("div",{class:"empty"},kFilter==="done"?"還沒有完成的訂單。":"目前沒有訂單。客人送出後，會馬上出現在這裡。"));return}
  list.forEach(o=>{
    const t=new Date(o.createdAt),mins=Math.round((Date.now()-o.createdAt)/60000),real=realTotal(o);
    const acts=el("div",{class:"acts"});
    if(o.status==="new"){
      const cancel=el("button",{class:"btn-cancel"},"取消");
      cancel.onclick=()=>{if(cancel.classList.contains("sure"))setStatus(o,"cancel");else{cancel.classList.add("sure");cancel.textContent="確定取消？";setTimeout(()=>{cancel.classList.remove("sure");cancel.textContent="取消"},4000)}};
      acts.append(el("button",{class:"btn-cook",onclick:e=>{e.target.disabled=true;setStatus(o,"cooking")}},"已付款 "+money(real)+"，給號碼"),cancel);
    }
    if(o.status==="cooking")acts.append(el("button",{class:"btn-done",onclick:()=>setStatus(o,"done")},"做好了，叫 "+o.num+" 號"));
    if(o.status==="done")acts.append(el("button",{class:"btn-back",onclick:()=>setStatus(o,"cooking")},"改回製作中"));
    box.append(el("div",{class:"order "+o.status},
      el("div",{class:"head"},o.num?el("span",{class:"bigcode"},el("small",{},"取餐號碼"),String(o.num)):el("span",{class:"bigcode"},el("small",{},"訂單代碼（客人報給你）"),o.code),el("span",{class:"chip "+o.status},o.status==="new"?"等付款":T.zh.st[o.status])),
      el("div",{class:"meta num"},(o.num?"代碼 "+o.code+"・":"")+t.toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"})+"（"+mins+" 分鐘前）"+(o.lang==="en"?"・外國客人":"")),
      el("ul",{},...(o.items||[]).map(i=>{const s=summary(i,"zh");return el("li",{},(ITEM[i.id]?.zh||"（菜單沒有這樣）")+" × "+i.q,s?el("small",{}," ｜"+s):"")})),
      o.note?el("div",{class:"note"},"備註："+o.note):"",
      el("div",{class:"meta num",style:"margin-top:6px"},"合計 "+money(real),real!==o.total?el("span",{class:"mismatch"},"（客人畫面顯示 "+money(o.total)+"，請以這裡為準）"):""),acts))});
}

/* 付款時給取餐號碼：用每天一個計數器，從 1 號開始，兩支手機同時按也不會重複 */
let writing=Promise.resolve();
function setStatus(o,s){
  if(!F){const x=allOrders[o.oid];if(!x)return;x.status=s;if(s==="cooking"&&!x.num){x.num=Object.values(allOrders).filter(y=>y.num&&y.createdAt>=startOfToday()).reduce((m,y)=>Math.max(m,y.num),0)+1;x.paidAt=Date.now()}renderKitchen();renderMine();return}
  writing=writing.then(async()=>{
    const ref=F.doc(fdb,"orders",o.oid);
    if(s==="cooking"&&!o.num){
      const cref=F.doc(fdb,"counters",dayKey());
      await F.runTransaction(fdb,async tx=>{
        const [cs,os]=[await tx.get(cref),await tx.get(ref)];
        if(os.data()?.num){tx.update(ref,{status:"cooking"});return}
        const n=(cs.exists()?cs.data().n:0)+1;
        tx.set(cref,{n});tx.update(ref,{status:"cooking",num:n,paidAt:Date.now()});
      });
    }else await F.updateDoc(ref,{status:s});
  }).catch(e=>{console.error(e);alertBox("剛剛那一下沒有存到，請檢查網路再按一次。")});
}
function alertBox(msg){const b=el("div",{class:"empty",style:"border-color:var(--pink);color:var(--pink);margin-bottom:10px"},msg);$("#orders").prepend(b);setTimeout(()=>b.remove(),6000)}

/* ---------- 啟動 ---------- */
lang=store.get("lang")||"zh";cart=(store.get("cart2")||[]).filter(l=>l&&ITEM[l.id]&&l.q>0);
myIds=(store.get("myOrders")||[]).filter(x=>x&&x.id&&x.t>Date.now()-12*3600e3);
$("#open-cart").onclick=openCart;$("#lang-zh").onclick=()=>setLang("zh");$("#lang-en").onclick=()=>setLang("en");
if(!configured){$("#demo-note").hidden=false}
setLang(lang);

if(configured){
  try{
    const [app,fs,au]=await Promise.all([import(SDK+"firebase-app.js"),import(SDK+"firebase-firestore.js"),import(SDK+"firebase-auth.js")]);
    F={...fs,...au};
    const fapp=app.initializeApp(firebaseConfig);
    fdb=fs.getFirestore(fapp);auth=au.getAuth(fapp);
    $("#k-signin").onclick=async()=>{try{await au.signInWithPopup(auth,new au.GoogleAuthProvider())}catch(e){console.error(e);$("#k-login-msg").textContent="登入沒有成功："+(e.code||"請再試一次")}};
    au.onAuthStateChanged(auth,()=>{if(kUnsub){kUnsub();kUnsub=null}allOrders={};if(location.hash==="#kitchen")startKitchen()});
    myIds.forEach(x=>watchMine(x.id));
  }catch(e){console.error(e);F=null;const n=$("#demo-note");n.textContent="連不上點餐系統，請檢查網路後重新整理。";n.hidden=false}
}
onHash();window.addEventListener("hashchange",onHash);
