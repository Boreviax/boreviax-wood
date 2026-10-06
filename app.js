import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_AUTH_STORAGE_KEY } from "./config.js";

const SUPABASE_MODULE_URL = "./vendor/supabase.mjs";
const XLSX_MODULE_URL = "./vendor/xlsx.mjs";

const configured = !SUPABASE_URL.includes("YOUR_PROJECT") && !SUPABASE_PUBLISHABLE_KEY.includes("YOUR_");
let supabase = null;
let authListenerBound = false;
let authSubscription = null;
let cloudReachable = false;
let reconnecting = false;

function withTimeout(promise, ms, message){
  let timer;
  return Promise.race([
    promise,
    new Promise((_,reject)=>{ timer=setTimeout(()=>reject(new Error(message)),ms); })
  ]).finally(()=>clearTimeout(timer));
}

function timedFetch(input, init={}){
  const controller=new AbortController();
  const upstream=init.signal;
  const abort=()=>controller.abort(upstream?.reason);
  if(upstream?.aborted) abort();
  else upstream?.addEventListener("abort",abort,{once:true});
  const timer=setTimeout(()=>controller.abort(new DOMException("Request timed out","TimeoutError")),15000);
  return fetch(input,{...init,signal:controller.signal}).finally(()=>{
    clearTimeout(timer);
    upstream?.removeEventListener("abort",abort);
  });
}

async function ensureSupabase(){
  if(supabase) return supabase;
  if(!navigator.onLine) throw new Error("当前处于离线状态");
  const { createClient } = await withTimeout(import(SUPABASE_MODULE_URL),15000,"云端组件加载超时");
  supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:SUPABASE_AUTH_STORAGE_KEY},
    global:{fetch:timedFetch}
  });
  bindAuthListener();
  return supabase;
}

function bindAuthListener(){
  if(authListenerBound || !supabase) return;
  authListenerBound = true;
  const {data}=supabase.auth.onAuthStateChange((_event,newSession)=>{
    // Supabase warns against awaiting client calls inside this callback: it can
    // deadlock the auth client. Only copy state here; all I/O happens elsewhere.
    if(newSession&&localStorage.getItem(PENDING_SIGNOUT_KEY)!=="1"){
      session=newSession;
      cloudReachable=navigator.onLine;
      saveOfflineIdentity();
    }
    setTimeout(()=>updateNetworkUI().catch(()=>{}),0);
  });
  authSubscription=data?.subscription||null;
}

const canCloud = () => navigator.onLine && cloudReachable && !!supabase && !!session?.user?.id && !session?._offline;
const $ = id => document.getElementById(id);
const money = n => "¥" + Number(n || 0).toLocaleString("zh-CN",{minimumFractionDigits:2,maximumFractionDigits:2});
const usd = n => "$" + Number(n || 0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const finMoney = n => { const v=Number(n||0); if(Math.abs(v)<0.005)return "-"; const a="¥"+Math.abs(v).toLocaleString("zh-CN",{minimumFractionDigits:2,maximumFractionDigits:2}); return v<0?`(${a})`:a; };
const esc = v => String(v ?? "").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const today = (d=new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const monthRange = () => { const n=new Date(); return {start:today(new Date(n.getFullYear(),n.getMonth(),1)),end:today(new Date(n.getFullYear(),n.getMonth()+1,0))}; };
const yearRange = () => { const n=new Date(); return {start:`${n.getFullYear()}-01-01`,end:`${n.getFullYear()}-12-31`}; };
const allRange = () => ({start:null,end:null});
const inRange = (d,r) => (!r.start || d>=r.start) && (!r.end || d<=r.end);
const notify = msg => { const t=$("toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),1900); };
const num = id => Number($(id).value || 0);
const val = id => $(id).value.trim();
const round2 = n => Math.round((Number(n)||0)*100)/100;
const fmtCurrency = (amount,currency="RMB") => currency==="USD" ? usd(amount) : money(amount);
const dateLabel = d => d || "全部";


/* V15: one offline-first cache and one durable, inspectable sync queue. */
const OFFLINE_DB_NAME="boreviax-ledger-offline-v1", OFFLINE_DB_VERSION=1;
let deferredInstallPrompt=null, syncingQueue=false;
function idbOpen(){return new Promise((resolve,reject)=>{const req=indexedDB.open(OFFLINE_DB_NAME,OFFLINE_DB_VERSION);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains("kv"))db.createObjectStore("kv");if(!db.objectStoreNames.contains("queue"))db.createObjectStore("queue",{keyPath:"qid",autoIncrement:true});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function idbSet(store,key,value){const db=await idbOpen();return new Promise((resolve,reject)=>{const tx=db.transaction(store,"readwrite"),s=tx.objectStore(store);store==="kv"?s.put(value,key):s.put(value);tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};});}
async function idbGet(store,key){const db=await idbOpen();return new Promise((resolve,reject)=>{const tx=db.transaction(store,"readonly"),req=tx.objectStore(store).get(key);req.onsuccess=()=>{db.close();resolve(req.result);};req.onerror=()=>{db.close();reject(req.error);};});}
async function idbGetAll(store){const db=await idbOpen();return new Promise((resolve,reject)=>{const tx=db.transaction(store,"readonly"),req=tx.objectStore(store).getAll();req.onsuccess=()=>{db.close();resolve(req.result||[]);};req.onerror=()=>{db.close();reject(req.error);};});}
async function idbDelete(store,key){const db=await idbOpen();return new Promise((resolve,reject)=>{const tx=db.transaction(store,"readwrite");tx.objectStore(store).delete(key);tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};});}
async function idbPatchQueue(qid,patch){const db=await idbOpen();return new Promise((resolve,reject)=>{const tx=db.transaction("queue","readwrite"),s=tx.objectStore("queue"),req=s.get(qid);req.onsuccess=()=>{if(req.result)s.put({...req.result,...patch});};tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};});}
const cacheKey=uid=>`ledger:${uid}`; const profileKey=uid=>`profile:${uid}`;
const syncMetaKey=uid=>`sync-meta:${uid}`;
const OFFLINE_IDENTITY_KEY="boreviax-ledger-offline-identity-v1";
const PENDING_SIGNOUT_KEY="boreviax-ledger-pending-signout-v1";
function saveOfflineIdentity(){
  if(!session?.user?.id) return;
  localStorage.setItem(OFFLINE_IDENTITY_KEY,JSON.stringify({
    id:session.user.id,
    email:session.user.email||"",
    saved_at:new Date().toISOString()
  }));
}
function loadOfflineIdentity(){
  try{
    const x=JSON.parse(localStorage.getItem(OFFLINE_IDENTITY_KEY)||"null");
    if(!x?.id) return null;
    return {user:{id:x.id,email:x.email||""},_offline:true};
  }catch(_){ return null; }
}
function clearOfflineIdentity(){ localStorage.removeItem(OFFLINE_IDENTITY_KEY); }
async function cacheCurrentData(){if(!session?.user?.id)return;await idbSet("kv",cacheKey(session.user.id),{purchases,purchaseItems,receipts,investments,transfers,expenses,settings,cached_at:new Date().toISOString()});}
async function loadCachedData(){if(!session?.user?.id)return false;const c=await idbGet("kv",cacheKey(session.user.id));if(!c)return false;purchases=c.purchases||[];purchaseItems=c.purchaseItems||[];receipts=c.receipts||[];investments=c.investments||[];transfers=c.transfers||[];expenses=c.expenses||[];settings=c.settings||{id:1,initial_balance:0,private_initial_balance:0};normalizeLegacyData();refreshFilters();renderAll();return true;}
async function queueOp(kind,payload,entityId=null){await idbSet("queue",null,{user_id:session.user.id,kind,entity_id:entityId, payload,attempts:0,created_at:new Date().toISOString()});await updateNetworkUI();}
async function queueMany(operations){
  if(!operations.length)return;
  const db=await idbOpen();
  await new Promise((resolve,reject)=>{
    const tx=db.transaction("queue","readwrite"),store=tx.objectStore("queue");
    operations.forEach(op=>store.put({user_id:session.user.id,attempts:0,created_at:new Date().toISOString(),...op}));
    tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
  });
  db.close();await updateNetworkUI();
}
async function pendingOperations(){if(!session?.user?.id)return [];return (await idbGetAll("queue")).filter(x=>x.user_id===session.user.id).sort((a,b)=>a.qid-b.qid);}
async function pendingCount(){return (await pendingOperations()).length;}
async function getSyncMeta(){if(!session?.user?.id)return {};return await idbGet("kv",syncMetaKey(session.user.id))||{};}
async function updateNetworkUI(){
  if(!$('realtimeState')||!$('syncState')) return;
  let count=0,meta={};
  try{[count,meta]=await Promise.all([pendingCount(),getSyncMeta()]);}catch(err){console.warn("local sync status unavailable",err);}
  if(canCloud()){
    $('realtimeState').textContent='☁ 云端已连接';
    $('realtimeState').classList.remove('offline');
  }else if(navigator.onLine){
    $('realtimeState').textContent='📱 本地模式 · 云端待连接';
    $('realtimeState').classList.add('offline');
  }else{
    $('realtimeState').textContent='📱 离线模式';
    $('realtimeState').classList.add('offline');
  }
  const failed=!!meta.last_error&&count>0;
  $('syncState').textContent=syncingQueue?`同步中 · ${count} 笔`:failed?`${count} 笔待同步 · 上次失败`:count?`${count} 笔待同步`:'同步正常';
  $('syncState').classList.toggle('pending',!!count&&!syncingQueue);
  $('syncState').classList.toggle('syncing',syncingQueue);
  $('syncState').classList.toggle('error',failed);
  $('syncState').title=failed?`上次同步错误：${meta.last_error}`:meta.last_success?`上次同步：${new Date(meta.last_success).toLocaleString()}`:'所有数据已同步';
  $('syncNowBtn').classList.toggle('hidden',!navigator.onLine||!count);
  $('syncDetailsBtn')?.classList.toggle('hidden',!count&&!failed);
}
function cloudRow(row){return Object.fromEntries(Object.entries(row||{}).filter(([k,v])=>!k.startsWith("_")&&v!==undefined));}
function syncErrorText(err){
  const parts=[err?.code,err?.message,err?.details,err?.hint].filter(Boolean).map(String);
  return [...new Set(parts)].join(" · ").slice(0,600)||String(err||"未知错误").slice(0,600);
}
function isNetworkError(err){return !navigator.onLine||/fetch|network|timeout|timed out|abort|connection|load failed/i.test(syncErrorText(err));}
function isAuthError(err){return /jwt|token|session|not authenticated|unauthorized|401|PGRST301/i.test(syncErrorText(err));}
async function expectCloud(query){const result=await query;if(result?.error)throw result.error;return result;}
function operationEntityId(op){return op.entity_id||op.payload?.purchase?.id||op.payload?.id||(op.kind==="put_settings"?"1":null);}
function operationEntityType(kind=""){
  if(kind.includes("purchase"))return "purchase";
  if(kind.includes("receipt"))return "receipt";
  if(kind.includes("investment"))return "investment";
  if(kind.includes("transfer"))return "transfer";
  if(kind.includes("expense"))return "expense";
  if(kind.includes("settings"))return "settings";
  return kind||"unknown";
}
function operationEntityKey(op){return `${operationEntityType(op.kind)}:${operationEntityId(op)||op.qid}`;}
function operationLabel(op){
  const names={purchase:"采购单",receipt:"客户来款",investment:"投资款",transfer:"公私户互转",expense:"费用",settings:"期初余额"};
  const action=String(op.kind||"").startsWith("delete_")?"删除":"保存";
  return `${names[operationEntityType(op.kind)]||"记录"}${action}`;
}
async function ensureFreshCloudSession(){
  if(!supabase)throw new Error("云端组件尚未连接");
  let {data,error}=await supabase.auth.getSession();
  if(error)throw error;
  let cloudSession=data?.session||null;
  if(cloudSession?.expires_at&&cloudSession.expires_at*1000<Date.now()+60000){
    const refreshed=await supabase.auth.refreshSession();
    if(refreshed.error)throw refreshed.error;
    cloudSession=refreshed.data?.session||null;
  }
  if(!cloudSession)throw new Error("登录已过期，请退出后重新登录再同步");
  session=cloudSession;session._offline=false;cloudReachable=true;saveOfflineIdentity();
  return cloudSession;
}
async function executeQueuedOperation(op){
  let kind=op.kind,payload=op.payload||{};
  // Backward compatibility: never strand entries made by V6/V10.
  if(kind==="create_purchase")kind="put_purchase";
  if(kind==="create_receipt")kind="put_receipt";
  if(kind==="create_expense")kind="put_expense";
  if(kind==="put_purchase"){
    const purchase=cloudRow(payload.purchase),items=(payload.items||[]).map(cloudRow),removed=[...new Set(payload.removed_item_ids||[])].filter(Boolean);
    await expectCloud(supabase.from("purchases").upsert(purchase,{onConflict:"id"}));
    if(items.length)await expectCloud(supabase.from("purchase_items").upsert(items,{onConflict:"id"}));
    if(removed.length)await expectCloud(supabase.from("purchase_items").delete().in("id",removed));
  }else if(kind==="delete_purchase"){
    await expectCloud(supabase.from("purchases").delete().eq("id",payload.id));
  }else if(kind==="put_receipt"){
    await expectCloud(supabase.from("receipts").upsert(cloudRow(payload),{onConflict:"id"}));
  }else if(kind==="delete_receipt"){
    await expectCloud(supabase.from("receipts").delete().eq("id",payload.id));
  }else if(kind==="put_investment"){
    await expectCloud(supabase.from("investments").upsert(cloudRow(payload),{onConflict:"id"}));
  }else if(kind==="delete_investment"){
    await expectCloud(supabase.from("investments").delete().eq("id",payload.id));
  }else if(kind==="put_transfer"){
    await expectCloud(supabase.from("account_transfers").upsert(cloudRow(payload),{onConflict:"id"}));
  }else if(kind==="delete_transfer"){
    await expectCloud(supabase.from("account_transfers").delete().eq("id",payload.id));
  }else if(kind==="put_expense"){
    await expectCloud(supabase.from("expenses").upsert(cloudRow(payload),{onConflict:"id"}));
  }else if(kind==="delete_expense"){
    await expectCloud(supabase.from("expenses").delete().eq("id",payload.id));
  }else if(kind==="put_settings"){
    await expectCloud(supabase.from("app_settings").upsert(cloudRow(payload),{onConflict:"id"}));
  }else{
    throw new Error(`不支持的待同步操作：${kind}`);
  }
}
function setPendingStateFromQueue(ops){
  const ids={purchase:new Set(),receipt:new Set(),investment:new Set(),transfer:new Set(),expense:new Set(),settings:new Set()};
  for(const op of ops){const type=operationEntityType(op.kind),id=operationEntityId(op);if(ids[type]&&id!=null)ids[type].add(String(id));}
  const mark=(rows,type)=>rows.map(row=>({...row,_pending:ids[type].has(String(row.id))}));
  purchases=mark(purchases,"purchase");
  purchaseItems=purchaseItems.map(row=>({...row,_pending:ids.purchase.has(String(row.purchase_id))}));
  receipts=mark(receipts,"receipt");investments=mark(investments,"investment");transfers=mark(transfers,"transfer");expenses=mark(expenses,"expense");
  settings={...settings,_pending:ids.settings.has(String(settings.id||1))};
}
function markCloudUnavailable(err){
  cloudReachable=false;
  if(session)session._offline=true;
  stopCloudRefresh();
  console.warn("cloud unavailable; continuing locally",err);
}
async function syncOfflineQueue({reloadAfter=true,silent=false}={}){
  if(syncingQueue||!session?.user?.id)return false;
  if(!canCloud()){await updateNetworkUI();return false;}
  const all=await pendingOperations();
  if(!all.length){await updateNetworkUI();return true;}
  syncingQueue=true;await updateNetworkUI();
  let synced=0,failures=[],stoppedForConnection=false;
  const blockedEntities=new Set();
  try{
    await ensureFreshCloudSession();
    for(const op of all){
      const entityKey=operationEntityKey(op);
      if(blockedEntities.has(entityKey))continue;
      try{await executeQueuedOperation(op);}
      catch(err){
        const errorText=syncErrorText(err);
        await idbPatchQueue(op.qid,{attempts:Number(op.attempts||0)+1,last_error:errorText,last_attempt_at:new Date().toISOString()});
        failures.push({op,error:errorText});blockedEntities.add(entityKey);
        if(isNetworkError(err)||isAuthError(err)){stoppedForConnection=true;markCloudUnavailable(err);break;}
        continue;
      }
      await idbDelete("queue",op.qid);synced++;
    }
    const remaining=await pendingOperations();
    setPendingStateFromQueue(remaining);
    if(remaining.length){refreshFilters();renderAll();}
    const now=new Date().toISOString(),firstError=failures[0]?.error||remaining.find(x=>x.last_error)?.last_error||null;
    await idbSet("kv",syncMetaKey(session.user.id),{
      last_success:remaining.length?(await getSyncMeta()).last_success||null:now,
      last_attempt:now,last_error:firstError,last_error_at:firstError?now:null,
      failed_count:remaining.filter(x=>x.last_error).length,synced_count:synced
    });
    await cacheCurrentData();
    if(!remaining.length&&reloadAfter)await reloadAll();
    if(!silent)notify(remaining.length?`已同步 ${synced} 笔，仍有 ${remaining.length} 笔未完成；请查看同步详情`:`${synced} 笔本地更改已同步`);
    return remaining.length===0;
  }catch(err){
    console.error("offline sync failed",err);
    const errorText=syncErrorText(err),now=new Date().toISOString();
    await idbSet("kv",syncMetaKey(session.user.id),{last_success:(await getSyncMeta()).last_success||null,last_attempt:now,last_error:errorText,last_error_at:now,failed_count:(await pendingCount()),synced_count:synced});
    if(isNetworkError(err)||isAuthError(err))markCloudUnavailable(err);
    if(!silent)notify(`同步未完成：${errorText}`);
    return false;
  }finally{syncingQueue=false;await updateNetworkUI();if(stoppedForConnection)console.warn("sync paused until cloud session recovers");}
}
function offlineId(){return crypto.randomUUID?crypto.randomUUID():`${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;}
async function finishLocalMutation(label){
  normalizeLegacyData();refreshFilters();renderAll();await cacheCurrentData();await updateNetworkUI();
  const synced=await syncOfflineQueue({silent:true});
  if(synced)notify(`${label}已保存并同步`);
  else if(navigator.onLine)notify(`${label}已保存到本机，但云端尚未完成；请查看同步详情`);
  else notify(`${label}已保存到本机，联网后自动同步`);
}

if('serviceWorker' in navigator){
  window.addEventListener('load',async()=>{
    try{
      const hadController=!!navigator.serviceWorker.controller;
      const reg=await navigator.serviceWorker.register('/sw.js',{scope:'/'});
      await reg.update();
      await navigator.serviceWorker.ready;
      if(hadController){
        let reloading=false;
        navigator.serviceWorker.addEventListener("controllerchange",()=>{if(!reloading){reloading=true;location.reload();}});
      }
    }catch(err){console.error('service worker registration failed',err);}
  });
}
function showInstallButtons(show){["installAppBtn","installLoginBtn"].forEach(id=>$(id)?.classList.toggle("hidden",!show));}
async function installPwa(){if(!deferredInstallPrompt){notify("请使用 Chrome 或 Edge 地址栏右侧的安装图标");return;}deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;showInstallButtons(false);}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;showInstallButtons(true);});
window.addEventListener('appinstalled',()=>{showInstallButtons(false);deferredInstallPrompt=null;notify('Boreviax Ledger 已安装');});

let session=null, profile=null, role="viewer";
let purchases=[], purchaseItems=[], receipts=[], investments=[], transfers=[], expenses=[], settings={initial_balance:0,private_initial_balance:0};
let editing={purchase:null,receipt:null,investment:null,transfer:null,expense:null};
let ranges={p:monthRange(),r:monthRange(),i:monthRange(),t:monthRange(),b:monthRange(),e:monthRange(),s:yearRange(),pl:yearRange()};
let balanceAsOf=today();
let cloudRefreshTimer=null;
let cloudRefreshRunning=false;
const canWrite = () => role==="admin" || role==="finance";
const isAdmin = () => role==="admin";

if (!configured) {
  $("loginMsg").textContent = "尚未配置 Supabase。请先填写 config.js。";
  $("loginBtn").disabled = true;
}

$("loginBtn").onclick = login;
$("loginPassword").addEventListener("keydown", e => { if(e.key==="Enter") login(); });
$("logoutBtn").onclick = async () => {
  stopCloudRefresh();
  if(supabase && navigator.onLine){
    try{await supabase.auth.signOut({scope:"local"});localStorage.removeItem(PENDING_SIGNOUT_KEY);}
    catch(_){localStorage.setItem(PENDING_SIGNOUT_KEY,"1");}
  }else{
    localStorage.setItem(PENDING_SIGNOUT_KEY,"1");
  }
  clearOfflineIdentity();
  session=null;profile=null;role="viewer";cloudReachable=false;
  showLogin();
};

$("installAppBtn").onclick=installPwa;
if($("installLoginBtn"))$("installLoginBtn").onclick=installPwa;

async function reconnectCloud({announce=false}={}){
  if(reconnecting||!navigator.onLine)return false;
  reconnecting=true;
  try{
    await ensureSupabase();
    if(localStorage.getItem(PENDING_SIGNOUT_KEY)==="1"){
      try{await supabase.auth.signOut({scope:"local"});}catch(_){}
      localStorage.removeItem(PENDING_SIGNOUT_KEY);clearOfflineIdentity();
      session=null;profile=null;role="viewer";cloudReachable=false;
      return false;
    }
    const {data:{session:cloudSession}}=await supabase.auth.getSession();
    if(cloudSession){
      session=cloudSession;session._offline=false;cloudReachable=true;saveOfflineIdentity();
      const syncOk=await bootApp();
      if(announce)notify(syncOk?"网络已恢复，本地数据已同步":"网络已恢复，但仍有记录待同步；请查看同步详情");
      return true;
    }else{
      cloudReachable=false;
      if(announce)notify("网络已恢复；请重新登录后同步本地记录");
      await updateNetworkUI();
      return false;
    }
  }catch(err){
    markCloudUnavailable(err);
    await updateNetworkUI();
    return false;
  }finally{
    reconnecting=false;
  }
}
async function requestSync(){
  if(!navigator.onLine){notify("当前离线，恢复网络后会自动同步");return;}
  if(!canCloud()){
    await reconnectCloud({announce:false});
    if(!canCloud())notify("云端尚未连接，请退出后重新登录再同步");
    return;
  }
  await syncOfflineQueue();
}
$("syncNowBtn").onclick=requestSync;
async function showSyncDetails(){
  const ops=await pendingOperations(),meta=await getSyncMeta();
  $("syncDialogSummary").textContent=ops.length
    ? `还有 ${ops.length} 笔本地更改等待上传。已同步的记录不会重复上传。`
    : "所有本地更改均已同步。";
  $("syncQueueList").innerHTML=ops.length?ops.map(op=>{
    const error=op.last_error?`<small>失败原因：${esc(op.last_error)}</small>`:`<small>${navigator.onLine?"等待重新同步":"当前离线，联网后会自动同步"}</small>`;
    const time=op.last_attempt_at||op.created_at;
    return `<div class="sync-queue-item ${op.last_error?"error":""}"><b>${esc(operationLabel(op))}</b><small>本地编号：${esc(operationEntityId(op)||op.qid)}</small>${error}${time?`<small>时间：${esc(new Date(time).toLocaleString())}</small>`:""}</div>`;
  }).join(""):`<div class="empty">同步正常，没有待处理记录。</div>`;
  if(meta.last_error&&!ops.length)$("syncDialogSummary").textContent="上次错误已经清除，目前同步正常。";
  const dialog=$("syncDialog");
  if(typeof dialog.showModal==="function"){if(!dialog.open)dialog.showModal();}
  else alert($("syncDialogSummary").textContent+(meta.last_error?`\n${meta.last_error}`:""));
}
$("syncDetailsBtn").onclick=showSyncDetails;
$("syncState").onclick=()=>{if(!$("syncDetailsBtn").classList.contains("hidden"))void showSyncDetails();};
$("retrySyncBtn").onclick=async()=>{await requestSync();await showSyncDetails();};
window.addEventListener("online",()=>{void reconnectCloud({announce:true});});
window.addEventListener("offline",async()=>{
  stopCloudRefresh();
  cloudReachable=false;if(session)session._offline=true;
  await updateNetworkUI();
});
setInterval(()=>{
  if(!navigator.onLine||!session?.user?.id)return;
  if(canCloud()){
    if(!cloudRefreshTimer)startCloudRefresh();
    void syncOfflineQueue({silent:true});
  }
  else void reconnectCloud({announce:false});
},30000);

async function login(){
  const btn=$("loginBtn");
  $("loginMsg").textContent="";
  const email=$("loginEmail").value.trim(), password=$("loginPassword").value;
  if(!email || !password){ $("loginMsg").textContent="请输入邮箱和密码。"; return; }
  if(!navigator.onLine){
    $("loginMsg").textContent="此设备第一次离线使用前，需要联网登录一次；以后断网可直接打开。";
    return;
  }
  btn.disabled=true;
  btn.textContent="登录中...";
  try{
    await ensureSupabase();
    const {data,error}=await supabase.auth.signInWithPassword({email,password});
    if(error){ $("loginMsg").textContent=error.message; return; }
    if(data?.session){
      session=data.session;session._offline=false;cloudReachable=true;
      localStorage.removeItem(PENDING_SIGNOUT_KEY);
      saveOfflineIdentity();
      await bootApp();
    }
  }catch(err){
    console.error(err);
    $("loginMsg").textContent="登录请求失败："+(err?.message||String(err));
  }finally{
    btn.disabled=false;
    btn.textContent="登录";
  }
}

async function bootApp({preferLocal=false}={}){
  let p=null,error=null;

  // Offline-first: when requested, load cached permission/profile before any network call.
  if(preferLocal||!canCloud()){
    p=await idbGet("kv",profileKey(session.user.id));
    if(p) session._offline=true;
  }

  // Try cloud profile only if we still need it. Any network failure falls back to local cache.
  if(!p && canCloud()){
    try{
      const res=await supabase.from("profiles").select("id,display_name,role").eq("id",session.user.id).single();
      p=res.data;
      error=res.error;
      if(p) await idbSet("kv",profileKey(session.user.id),p);
    }catch(err){
      error=err;
    }

    if(!p){
      const cached=await idbGet("kv",profileKey(session.user.id));
      if(cached){
        p=cached;
        session._offline=true;
      }
    }
  }

  // If cloud isn't usable, use the cached permission/profile.
  if(!p){
    p=await idbGet("kv",profileKey(session.user.id));
    if(p) session._offline=true;
  }

  if(!p){
    $("loginMsg").textContent=error
      ? "云端暂时不可用，且本机没有权限缓存："+(error?.message||String(error))
      : "此设备没有本地权限缓存，请先联网登录一次。";
    showLogin();
    return;
  }

  profile=p; role=p.role || "viewer";
  $("loginView").classList.add("hidden"); $("appView").classList.remove("hidden");
  $("userEmail").textContent=session.user.email || "";
  $("roleBadge").textContent=role.toUpperCase();
  document.body.classList.toggle("viewer",!canWrite());
  document.querySelectorAll(".admin-only").forEach(el=>el.classList.toggle("hidden",!isAdmin()));
  document.querySelectorAll(".viewer-tip").forEach(el=>el.textContent=!canWrite()?"只读账号":"");
  initDates();

  let syncOk=true;
  if(canCloud()){
    saveOfflineIdentity();
    // Upload local changes before refreshing from cloud, so a stale cloud snapshot
    // can never overwrite unsynced work on this device.
    syncOk=await syncOfflineQueue({reloadAfter:false,silent:true});
    if(syncOk)syncOk=await reloadAll();
    else await loadCachedData();
    startCloudRefresh();
  }else{
    await loadCachedData();
  }
  await updateNetworkUI();
  return syncOk;
}

function showLogin(){
  $("appView").classList.add("hidden"); $("loginView").classList.remove("hidden");
}

async function reloadAll(){
  if(!canCloud()){const ok=await loadCachedData();if(!ok)notify("暂无离线缓存，请先联网打开一次账本");await updateNetworkUI();return false;}
  let pRes,piRes,rRes,iRes,tRes,eRes,sRes;
  try{
    [pRes,piRes,rRes,iRes,tRes,eRes,sRes] = await Promise.all([
    supabase.from("purchases").select("*").order("order_date",{ascending:false}),
    supabase.from("purchase_items").select("*"),
    supabase.from("receipts").select("*").order("date",{ascending:false}),
    supabase.from("investments").select("*").order("date",{ascending:false}),
    supabase.from("account_transfers").select("*").order("date",{ascending:false}),
    supabase.from("expenses").select("*").order("date",{ascending:false}),
    supabase.from("app_settings").select("*").eq("id",1).maybeSingle()
    ]);
  }catch(err){
    console.error("cloud read failed",err);
    markCloudUnavailable(err);
    const ok=await loadCachedData();
    notify(ok?"云端暂不可用，已进入📱 离线模式":"读取数据失败，且没有本地缓存");
    await updateNetworkUI();
    return false;
  }
  const errs=[pRes.error,piRes.error,rRes.error,iRes.error,tRes.error,eRes.error,sRes.error].filter(Boolean);
  if(errs.length){
    console.error(errs);
    markCloudUnavailable(errs[0]);
    const ok=await loadCachedData();
    notify(ok?"网络读取失败，已进入📱 离线模式":"读取数据失败，且没有本地缓存");
    await updateNetworkUI();
    return false;
  }
  session._offline=false;cloudReachable=true;
  purchases=pRes.data||[]; purchaseItems=piRes.data||[]; receipts=rRes.data||[]; investments=iRes.data||[]; transfers=tRes.data||[]; expenses=eRes.data||[];
  settings=sRes.data || {id:1,initial_balance:0,private_initial_balance:0};
  normalizeLegacyData();refreshFilters();renderAll();await cacheCurrentData();await updateNetworkUI();return true;
}

function normalizeLegacyData(){
  purchases=purchases.map(p=>({...p,currency:p.currency||"RMB",rate:Number(p.rate||1)||1,fee:Number(p.fee||0),account_type:p.account_type==="private"?"private":"corporate"}));
  receipts=receipts.map(r=>{
    const currency=r.currency || (Number(r.usd||0)>0?"USD":"RMB");
    const amount=Number((r.amount ?? (currency==="USD"?r.usd:r.rmb)) || 0);
    const rate=currency==="RMB"?1:Number(r.rate||0);
    return {...r,currency,amount,rate,pending_amount:Number(r.pending_amount||0),account_type:r.account_type==="private"?"private":"corporate"};
  });
  investments=investments.map(i=>({...i,currency:i.currency||"RMB",original_amount:Number(i.original_amount??i.rmb??0),rate:Number(i.rate||1)||1,rmb:Number(i.rmb||0),account_type:i.account_type==="private"?"private":"corporate"}));
  transfers=transfers.map(t=>{const from_account=t.from_account==="private"?"private":"corporate",requestedTo=t.to_account==="corporate"?"corporate":"private",to_account=requestedTo===from_account?(from_account==="private"?"corporate":"private"):requestedTo;return {...t,from_account,to_account,amount:Number(t.amount||0),purpose:t.purpose||"账户调拨"};});
  expenses=expenses.map(e=>({
    ...e,
    currency:e.currency||"RMB",
    original_amount:Number(e.original_amount ?? e.amount ?? 0),
    rate:Number(e.rate||1)||1,
    amount:Number(e.amount||0),
    payment_source:e.payment_source==="private"?"private":"corporate"
  }));
  settings={...settings,initial_balance:Number(settings.initial_balance||0),private_initial_balance:Number(settings.private_initial_balance||0)};
}

function stopCloudRefresh(){
  if(cloudRefreshTimer){clearInterval(cloudRefreshTimer);cloudRefreshTimer=null;}
}
async function refreshCloudSnapshot(){
  if(cloudRefreshRunning||!canCloud()||document.hidden||syncingQueue)return;
  cloudRefreshRunning=true;
  try{
    if((await pendingCount())>0)await syncOfflineQueue({silent:true});
    else await reloadAll();
  }catch(err){
    console.warn("automatic cloud refresh failed",err);
    if(isNetworkError(err))markCloudUnavailable(err);
  }finally{cloudRefreshRunning=false;}
}
function startCloudRefresh(){
  if(!canCloud()){updateNetworkUI();return;}
  stopCloudRefresh();
  $("realtimeState").textContent="☁ 云端已连接 · 自动刷新";
  $("realtimeState").classList.remove("offline");
  // Auth and REST are relayed over HTTPS. Polling avoids a direct Supabase
  // WebSocket dependency while keeping other devices' entries up to date.
  cloudRefreshTimer=setInterval(()=>{void refreshCloudSnapshot();},20000);
}

document.querySelectorAll(".tab").forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active"); $("page-"+btn.dataset.page).classList.add("active");
  if(btn.dataset.page==="stats") renderStats();
  if(btn.dataset.page==="dashboard") drawCashChart();
  if(btn.dataset.page==="reports") renderReports();
  if(btn.dataset.page==="balances") renderBalanceDetails();
});

document.querySelectorAll(".chip").forEach(chip=>chip.onclick=()=>{
  const kind=chip.dataset.kind;
  document.querySelectorAll(`.chip[data-kind="${kind}"]`).forEach(x=>x.classList.remove("active"));
  chip.classList.add("active");
  ranges[kind]=chip.dataset.range==="month"?monthRange():chip.dataset.range==="year"?yearRange():allRange();
  $(kind+"Start").value=ranges[kind].start||""; $(kind+"End").value=ranges[kind].end||"";
  if(kind==="p")renderPurchases(); else if(kind==="r")renderReceipts(); else if(kind==="i")renderInvestments(); else if(kind==="t")renderTransfers(); else if(kind==="b")renderBalanceDetails(); else if(kind==="e")renderExpenses(); else if(kind==="s")renderStats();
});

function customRange(kind){
  let a=$(kind+"Start").value||null,b=$(kind+"End").value||null;
  if(a&&b&&a>b) [a,b]=[b,a];
  $(kind+"Start").value=a||""; $(kind+"End").value=b||"";
  document.querySelectorAll(`.chip[data-kind="${kind}"]`).forEach(x=>x.classList.remove("active"));
  return {start:a,end:b};
}
$("applyPRangeBtn").onclick=()=>{ranges.p=customRange("p");renderPurchases();};
$("applyRRangeBtn").onclick=()=>{ranges.r=customRange("r");renderReceipts();};
$("applyIRangeBtn").onclick=()=>{ranges.i=customRange("i");renderInvestments();};
$("applyTRangeBtn").onclick=()=>{ranges.t=customRange("t");renderTransfers();};
$("applyBRangeBtn").onclick=()=>{ranges.b=customRange("b");renderBalanceDetails();};
$("applyERangeBtn").onclick=()=>{ranges.e=customRange("e");renderExpenses();};
$("applySRangeBtn").onclick=()=>{ranges.s=customRange("s");renderStats();};
$("applyPLRangeBtn").onclick=()=>{ranges.pl=customRange("pl");renderProfitStatement();};
$("applyBSDateBtn").onclick=()=>{balanceAsOf=$("bsDate").value||today();renderBalanceSheet();};

function itemsForPurchase(id){ return purchaseItems.filter(x=>x.purchase_id===id); }
function purchaseCurrency(p){ return p.currency||"RMB"; }
function purchaseRate(p){ return purchaseCurrency(p)==="RMB"?1:(Number(p.rate||0)||0); }
function purchaseTotal(p){ return itemsForPurchase(p.id).reduce((s,x)=>s+Number(x.subtotal||0),0); }
function purchaseTotalRmb(p){ return round2(purchaseTotal(p)*purchaseRate(p)); }
function accountType(row,field="account_type"){ return row?.[field]==="private"?"private":"corporate"; }
function accountLabel(type){ return type==="private"?"私户":"公户"; }
function purchaseSettlementPaid(p){ return Number(p.deposit||0)+Number(p.balance_pay||0); }
function purchaseSettlementPaidRmb(p){ return round2(purchaseSettlementPaid(p)*purchaseRate(p)); }
function purchaseFeeRmb(p){ return round2(Number(p.fee||0)*purchaseRate(p)); }
function purchaseCashPaidRmb(p){ return round2(purchaseSettlementPaidRmb(p)+purchaseFeeRmb(p)); }
function purchaseUnpaidRmb(p){ return Math.max(0,round2(purchaseTotalRmb(p)-purchaseSettlementPaidRmb(p))); }
function paymentEvents(p){
  const rate=purchaseRate(p),currency=purchaseCurrency(p);
  return [
    {date:p.deposit_date,amount:Number(p.deposit||0),name:"定金",currency,rate},
    {date:p.balance_date,amount:Number(p.balance_pay||0),name:"尾款",currency,rate},
    {date:p.fee_date,amount:Number(p.fee||0),name:"手续费",currency,rate}
  ].filter(x=>x.date&&x.amount>0).map(x=>({...x,rmb:round2(x.amount*x.rate)}));
}
function settlementEvents(p){ return paymentEvents(p).filter(x=>x.name!=="手续费"); }
function purchasePaymentsInRange(r){ let s=0; purchases.forEach(p=>paymentEvents(p).forEach(x=>{if(inRange(x.date,r))s+=x.rmb;})); return round2(s); }
function purchasePaidRmbAsOf(p,asOf){ return round2(settlementEvents(p).filter(x=>x.date<=asOf).reduce((s,x)=>s+x.rmb,0)); }
function receiptGrossRmb(r){ return r.currency==="USD"?round2(Number(r.amount||0)*Number(r.rate||0)):round2(Number(r.amount||0)); }
function receiptPendingRmb(r){ return round2(Number(r.pending_amount||0)*(r.currency==="USD"?Number(r.rate||0):1)); }
function investmentRmb(i){ return Number(i.rmb||0); }
function transferRmb(t){ return Number(t.amount||0); }
function transferDirection(t){ return t.from_account==="private"?"private_to_corporate":"corporate_to_private"; }
function transferDirectionLabel(t){ return `${accountLabel(t.from_account)} → ${accountLabel(t.to_account)}`; }
function expenseRmb(e){ return Number(e.amount||0); }
function accountCashBalance(type,asOf=null){
  const included=date=>!asOf||date<=asOf;
  const opening=type==="private"?Number(settings.private_initial_balance||0):Number(settings.initial_balance||0);
  const receiptIn=receipts.filter(r=>accountType(r)===type&&included(r.date)).reduce((s,r)=>s+Number(r.rmb||0),0);
  const investmentIn=investments.filter(i=>accountType(i)===type&&included(i.date)).reduce((s,i)=>s+investmentRmb(i),0);
  const transferIn=transfers.filter(t=>t.to_account===type&&included(t.date)).reduce((s,t)=>s+transferRmb(t),0);
  const transferOut=transfers.filter(t=>t.from_account===type&&included(t.date)).reduce((s,t)=>s+transferRmb(t),0);
  let purchaseOut=0;purchases.filter(p=>accountType(p)===type).forEach(p=>paymentEvents(p).forEach(x=>{if(included(x.date))purchaseOut+=x.rmb;}));
  const expenseOut=expenses.filter(e=>accountType(e,"payment_source")===type&&included(e.date)).reduce((s,e)=>s+expenseRmb(e),0);
  return round2(opening+receiptIn+investmentIn+transferIn-transferOut-purchaseOut-expenseOut);
}
function previousIsoDate(date){
  if(!date)return null;
  const value=new Date(`${date}T00:00:00Z`);
  if(Number.isNaN(value.getTime()))return null;
  value.setUTCDate(value.getUTCDate()-1);
  return value.toISOString().slice(0,10);
}
function balanceEventOrderAt(row){return String(row?.created_at||row?.updated_at||"");}
function compareBalanceEvents(a,b){
  return String(a.date||"").localeCompare(String(b.date||""))
    ||String(a.order_at||"").localeCompare(String(b.order_at||""))
    ||Number(a.order_seq||0)-Number(b.order_seq||0)
    ||String(a.key||"").localeCompare(String(b.key||""));
}
function balanceTypeLabel(type){return ({receipt:"客户来款",investment:"投资款",purchase:"采购付款",expense:"办公/其他费用",transfer:"公私互转"})[type]||"其他";}
function balanceDetailEvents(){
  const events=[];
  const add=event=>{
    const inflow=round2(event.inflow||0),outflow=round2(event.outflow||0);
    if(event.date&&(inflow>0||outflow>0))events.push({...event,inflow,outflow});
  };
  receipts.forEach(r=>add({
    key:`receipt:${r.id}`,date:r.date,account:accountType(r),type:"receipt",type_label:"客户来款",
    summary:`${r.customer||"未填写客户"} · ${r.payment_type||"客户来款"}`,inflow:Number(r.rmb||0),outflow:0,
    note:r.note||"",pending:!!r._pending,order_at:balanceEventOrderAt(r),order_seq:10
  }));
  investments.forEach(i=>add({
    key:`investment:${i.id}`,date:i.date,account:accountType(i),type:"investment",type_label:"投资款",
    summary:i.investor||"未填写资金来源",inflow:investmentRmb(i),outflow:0,
    note:i.note||"",pending:!!i._pending,order_at:balanceEventOrderAt(i),order_seq:20
  }));
  purchases.forEach(p=>paymentEvents(p).forEach(payment=>add({
    key:`purchase:${p.id}:${payment.name}:${payment.date}`,date:payment.date,account:accountType(p),type:"purchase",type_label:`采购${payment.name}`,
    summary:`${p.supplier||"未填写供应商"}${p.order_no?` · ${p.order_no}`:""}`,inflow:0,outflow:payment.rmb,
    note:p.note||"",pending:!!p._pending,order_at:balanceEventOrderAt(p),order_seq:30+({"定金":0,"尾款":1,"手续费":2}[payment.name]||0)
  })));
  transfers.forEach(t=>{
    const summary=`${accountLabel(t.from_account)} → ${accountLabel(t.to_account)} · ${t.purpose||"账户调拨"}`,amount=transferRmb(t),orderAt=balanceEventOrderAt(t);
    add({key:`transfer:${t.id}:out`,date:t.date,account:t.from_account,type:"transfer",type_label:"内部转出",summary,inflow:0,outflow:amount,note:t.note||"",pending:!!t._pending,order_at:orderAt,order_seq:40});
    add({key:`transfer:${t.id}:in`,date:t.date,account:t.to_account,type:"transfer",type_label:"内部转入",summary,inflow:amount,outflow:0,note:t.note||"",pending:!!t._pending,order_at:orderAt,order_seq:41});
  });
  expenses.forEach(e=>add({
    key:`expense:${e.id}`,date:e.date,account:accountType(e,"payment_source"),type:"expense",type_label:e.category||"其他费用",
    summary:e.party||e.category||"费用",inflow:0,outflow:expenseRmb(e),note:e.note||"",pending:!!e._pending,
    order_at:balanceEventOrderAt(e),order_seq:50
  }));
  return events;
}
function balanceDetailLedger(){
  const balances={corporate:Number(settings.initial_balance||0),private:Number(settings.private_initial_balance||0)};
  return balanceDetailEvents().sort(compareBalanceEvents).map(event=>{
    balances[event.account]=round2(balances[event.account]+event.inflow-event.outflow);
    return {...event,balance:balances[event.account]};
  });
}
function balanceDetailView(options={}){
  const range=options.range||ranges.b;
  const account=options.account!==undefined?options.account:($("bAccountFilter")?.value||"");
  const type=options.type!==undefined?options.type:($("bTypeFilter")?.value||"");
  const rows=balanceDetailLedger().filter(event=>inRange(event.date,range)&&(!account||event.account===account)&&(!type||event.type===type)).sort((a,b)=>compareBalanceEvents(b,a));
  const openingDate=previousIsoDate(range.start);
  const corporateOpening=range.start?accountCashBalance("corporate",openingDate):Number(settings.initial_balance||0);
  const privateOpening=range.start?accountCashBalance("private",openingDate):Number(settings.private_initial_balance||0);
  const corporateEnding=accountCashBalance("corporate",range.end||null),privateEnding=accountCashBalance("private",range.end||null);
  return {
    range,account,type,rows,
    corporateOpening,privateOpening,corporateEnding,privateEnding,
    companyEnding:round2(corporateEnding+privateEnding),
    filteredIn:round2(rows.reduce((sum,event)=>sum+event.inflow,0)),
    filteredOut:round2(rows.reduce((sum,event)=>sum+event.outflow,0))
  };
}

/* Purchase form */
function addItemRow(data={}){
  const row=document.createElement("div"); row.className="item-row";
  row.dataset.itemId=data.id||offlineId();
  const currency=$("pCurrency")?.value||"RMB";
  row.innerHTML=`<div class="item-grid">
    <div class="mini"><label>产品名称 *</label><input class="i-name" value="${esc(data.product_name||data.name||"")}"></div>
    <div class="mini"><label>规格 / 型号</label><input class="i-spec" value="${esc(data.spec||"")}"></div>
    <div class="mini"><label>数量 *</label><input class="i-qty" type="number" step="0.0001" min="0" value="${data.qty??""}"></div>
    <div class="mini"><label>单位</label><input class="i-unit" value="${esc(data.unit||"")}"></div>
    <div class="mini"><label>单价 <span class="p-item-currency">${currency}</span></label><input class="i-price" type="number" step="0.0001" min="0" value="${data.unit_price??data.unitPrice??""}"></div>
    <div class="mini"><label>小计 <span class="p-item-currency">${currency}</span> *</label><input class="i-subtotal" type="number" step="0.01" min="0" value="${data.subtotal??""}"></div>
    <button class="remove-item">×</button>
  </div>`;
  $("purchaseItems").appendChild(row);
  const q=row.querySelector(".i-qty"),p=row.querySelector(".i-price"),s=row.querySelector(".i-subtotal");
  const calc=()=>{if(Number(q.value)>0&&Number(p.value)>0)s.value=(Number(q.value)*Number(p.value)).toFixed(2);updatePurchasePreview();};
  q.oninput=calc;p.oninput=calc;s.oninput=updatePurchasePreview;
  row.querySelector(".remove-item").onclick=()=>{if(document.querySelectorAll(".item-row").length<=1){notify("至少保留一个产品");return;}row.remove();updatePurchasePreview();};
  updatePurchasePreview();
}
$("addItemBtn").onclick=()=>addItemRow();

function collectFormItems(){
  return [...document.querySelectorAll(".item-row")].map(r=>({
    id:r.dataset.itemId||offlineId(),
    product_name:r.querySelector(".i-name").value.trim(),
    spec:r.querySelector(".i-spec").value.trim(),
    qty:Number(r.querySelector(".i-qty").value||0),
    unit:r.querySelector(".i-unit").value.trim(),
    unit_price:Number(r.querySelector(".i-price").value||0),
    subtotal:Number(r.querySelector(".i-subtotal").value||0)
  })).filter(x=>x.product_name||x.subtotal||x.qty);
}
function syncPurchaseCurrencyUI(){
  const currency=$("pCurrency").value;
  $("pRate").disabled=currency==="RMB";
  if(currency==="RMB")$("pRate").value="1";
  document.querySelectorAll(".p-item-currency").forEach(x=>x.textContent=currency);
  updatePurchasePreview();
}
function updatePurchasePreview(){
  const total=collectFormItems().reduce((s,x)=>s+x.subtotal,0),currency=$("pCurrency")?.value||"RMB",rate=currency==="RMB"?1:num("pRate");
  $("purchaseTotalPreview").textContent=currency==="RMB"?money(total):`${usd(total)}  ≈  ${money(total*rate)}`;
}
$("pCurrency").onchange=syncPurchaseCurrencyUI;
$("pRate").oninput=updatePurchasePreview;

$("savePurchaseBtn").onclick=async()=>{
  if(!canWrite()) return;
  const supplier=val("pSupplier"),orderDate=$("pOrderDate").value,items=collectFormItems(),currency=$("pCurrency").value,rate=currency==="RMB"?1:num("pRate");
  if(!supplier||!orderDate){notify("请填写供应商和采购日期");return;}
  if(currency==="USD"&&rate<=0){notify("USD 采购请填写汇率");return;}
  if(!items.length||items.some(x=>!x.product_name||x.subtotal<=0)){notify("每个产品都要填写产品名称和小计");return;}
  const existing=editing.purchase?purchases.find(x=>x.id===editing.purchase):null;
  const purchaseId=editing.purchase||offlineId();
  const purchasePayload={
    id:purchaseId,
    supplier,order_no:val("pOrderNo")||null,order_date:orderDate,account_type:$("pAccountType").value,currency,rate,
    deposit:num("pDeposit"),deposit_date:$("pDepositDate").value||null,
    balance_pay:num("pBalancePay"),balance_date:$("pBalanceDate").value||null,
    fee:num("pFee"),fee_date:$("pFeeDate").value||null,
    note:val("pNote")||null,created_by:existing?.created_by||session.user.id,updated_at:new Date().toISOString()
  };
  if(purchasePayload.deposit>0&&!purchasePayload.deposit_date){notify("填写定金后请选择定金付款日期");return;}
  if(purchasePayload.balance_pay>0&&!purchasePayload.balance_date){notify("填写尾款后请选择尾款付款日期");return;}
  if(purchasePayload.fee>0&&!purchasePayload.fee_date){notify("填写手续费后请选择手续费付款日期");return;}
  const previewTotal=items.reduce((s,x)=>s+x.subtotal,0);
  if(purchasePayload.deposit+purchasePayload.balance_pay>previewTotal+0.001 && !confirm("已付货款高于采购总额，超出部分会在资产负债表中显示为供应商预付款。仍然保存吗？"))return;
  const saveBtn=$("savePurchaseBtn");saveBtn.disabled=true;
  try{
    const previousItemIds=existing?itemsForPurchase(purchaseId).map(x=>x.id):[];
    const itemPayload=items.map(x=>({...x,purchase_id:purchaseId,_pending:true}));
    const nextItemIds=new Set(itemPayload.map(x=>x.id));
    const removedItemIds=previousItemIds.filter(id=>!nextItemIds.has(id));
    purchases=editing.purchase
      ? purchases.map(x=>x.id===purchaseId?{...purchasePayload,_pending:true}:x)
      : [{...purchasePayload,_pending:true},...purchases];
    purchaseItems=[...purchaseItems.filter(x=>x.purchase_id!==purchaseId),...itemPayload];
    await queueOp("put_purchase",{purchase:purchasePayload,items:itemPayload.map(cloudRow),removed_item_ids:removedItemIds},purchaseId);
    resetPurchaseForm();await finishLocalMutation("采购单");
  }finally{saveBtn.disabled=false;}
};
$("cancelPurchaseEditBtn").onclick=resetPurchaseForm;

function resetPurchaseForm(){
  editing.purchase=null;$("purchaseTitle").textContent="新增供应商采购单";$("savePurchaseBtn").textContent="保存采购单";$("cancelPurchaseEditBtn").classList.add("hidden");
  ["pSupplier","pOrderNo","pDeposit","pBalancePay","pFee","pNote","pDepositDate","pBalanceDate","pFeeDate"].forEach(id=>$(id).value="");
  $("pOrderDate").value=today(); $("pAccountType").value="corporate"; $("pCurrency").value="RMB"; $("pRate").value="1"; $("purchaseItems").innerHTML=""; addItemRow(); syncPurchaseCurrencyUI();
}
window.editPurchase=async id=>{
  if(!canWrite())return;const p=purchases.find(x=>x.id===id);if(!p)return;editing.purchase=id;
  $("purchaseTitle").textContent="修改供应商采购单";$("savePurchaseBtn").textContent="保存修改";$("cancelPurchaseEditBtn").classList.remove("hidden");
  $("pSupplier").value=p.supplier||"";$("pOrderNo").value=p.order_no||"";$("pOrderDate").value=p.order_date||today();$("pAccountType").value=accountType(p);
  $("pCurrency").value=p.currency||"RMB";$("pRate").value=p.rate||1;
  $("pDeposit").value=p.deposit||"";$("pDepositDate").value=p.deposit_date||"";$("pBalancePay").value=p.balance_pay||"";$("pBalanceDate").value=p.balance_date||"";$("pFee").value=p.fee||"";$("pFeeDate").value=p.fee_date||"";$("pNote").value=p.note||"";
  $("purchaseItems").innerHTML=""; const its=itemsForPurchase(id); (its.length?its:[{}]).forEach(addItemRow); syncPurchaseCurrencyUI(); window.scrollTo({top:280,behavior:"smooth"});
};
window.deletePurchase=async id=>{if(!canWrite()||!confirm("确定删除这张采购单吗？"))return;purchases=purchases.filter(x=>x.id!==id);purchaseItems=purchaseItems.filter(x=>x.purchase_id!==id);if(editing.purchase===id)resetPurchaseForm();await queueOp("delete_purchase",{id},id);await finishLocalMutation("采购单删除操作");};

/* Receipts */
function syncReceiptCurrencyUI(auto=true){
  const currency=$("rCurrency").value;
  $("rRate").disabled=currency==="RMB";
  if(currency==="RMB")$("rRate").value="1";
  else if(!$("rRate").value||Number($("rRate").value)===1)$("rRate").value="";
  if(auto) autoReceiptRmb();
}
function autoReceiptRmb(){
  const amount=num("rAmount"),currency=$("rCurrency").value,rate=currency==="RMB"?1:num("rRate"),fee=num("rFxFee");
  if(amount>0&&(currency==="RMB"||rate>0))$("rRmb").value=Math.max(0,amount*rate-fee).toFixed(2);
}
$("rCurrency").onchange=()=>syncReceiptCurrencyUI(true);
["rAmount","rRate","rFxFee"].forEach(id=>$(id).addEventListener("input",autoReceiptRmb));
$("saveReceiptBtn").onclick=async()=>{
  if(!canWrite())return;
  const customer=val("rCustomer"),date=$("rDate").value,currency=$("rCurrency").value,amount=num("rAmount"),pending_amount=num("rPending"),rate=currency==="RMB"?1:num("rRate"),fx_fee=num("rFxFee"),rmb=num("rRmb");
  if(!customer||!date||(amount<=0&&pending_amount<=0)){notify("请填写客户、日期，以及实际来款或待收货款");return;}
  if(amount>0&&rmb<=0){notify("实际来款大于 0 时，请填写实际入账人民币");return;}
  if(amount<=0&&fx_fee>0){notify("没有实际来款时不能填写换汇或银行费用");return;}
  if(currency==="USD"&&rate<=0){notify("USD 来款或待收货款请填写汇率");return;}
  const existing=editing.receipt?receipts.find(x=>x.id===editing.receipt):null,id=editing.receipt||offlineId();
  const payload={id,customer,payment_type:$("rType").value,date,account_type:$("rAccountType").value,currency,amount,usd:currency==="USD"?amount:0,rate,fx_fee,rmb,pending_amount,qty:num("rQty"),note:val("rNote")||null,created_by:existing?.created_by||session.user.id,updated_at:new Date().toISOString()};
  const saveBtn=$("saveReceiptBtn");saveBtn.disabled=true;
  try{receipts=editing.receipt?receipts.map(x=>x.id===id?{...payload,_pending:true}:x):[{...payload,_pending:true},...receipts];await queueOp("put_receipt",payload,id);resetReceiptForm();await finishLocalMutation("客户来款");}
  finally{saveBtn.disabled=false;}
};
$("cancelReceiptEditBtn").onclick=resetReceiptForm;
function resetReceiptForm(){
  editing.receipt=null;$("receiptTitle").textContent="新增客户来款";$("saveReceiptBtn").textContent="保存客户来款";$("cancelReceiptEditBtn").classList.add("hidden");
  ["rCustomer","rAmount","rRate","rFxFee","rRmb","rPending","rQty","rNote"].forEach(id=>$(id).value="");$("rType").value="定金";$("rDate").value=today();$("rAccountType").value="corporate";$("rCurrency").value="USD";syncReceiptCurrencyUI(false);
}
window.editReceipt=id=>{
  if(!canWrite())return;const r=receipts.find(x=>x.id===id);if(!r)return;editing.receipt=id;
  $("receiptTitle").textContent="修改客户来款";$("saveReceiptBtn").textContent="保存修改";$("cancelReceiptEditBtn").classList.remove("hidden");
  $("rCustomer").value=r.customer||"";$("rType").value=r.payment_type||"定金";$("rDate").value=r.date||today();$("rAccountType").value=accountType(r);$("rCurrency").value=r.currency||"USD";$("rAmount").value=r.amount||"";$("rRate").value=r.rate||"";$("rFxFee").value=r.fx_fee||"";$("rRmb").value=r.rmb||"";$("rPending").value=r.pending_amount||"";$("rQty").value=r.qty||"";$("rNote").value=r.note||"";syncReceiptCurrencyUI(false);window.scrollTo({top:280,behavior:"smooth"});
};
window.deleteReceipt=async id=>{if(!canWrite()||!confirm("确定删除这笔客户来款吗？"))return;receipts=receipts.filter(x=>x.id!==id);if(editing.receipt===id)resetReceiptForm();await queueOp("delete_receipt",{id},id);await finishLocalMutation("客户来款删除操作");};

/* Investments */
function syncInvestmentCurrencyUI(auto=true){
  const currency=$("iCurrency").value;
  $("iRate").disabled=currency==="RMB";
  if(currency==="RMB")$("iRate").value="1";
  else if(!$("iRate").value||Number($("iRate").value)===1)$("iRate").value="";
  if(auto)autoInvestmentRmb();
}
function autoInvestmentRmb(){
  const amount=num("iOriginalAmount"),currency=$("iCurrency").value,rate=currency==="RMB"?1:num("iRate");
  if(amount>0&&(currency==="RMB"||rate>0))$("iRmb").value=(amount*rate).toFixed(2);
}
$("iCurrency").onchange=()=>syncInvestmentCurrencyUI(true);
["iOriginalAmount","iRate"].forEach(id=>$(id).addEventListener("input",autoInvestmentRmb));
$("saveInvestmentBtn").onclick=async()=>{
  if(!canWrite())return;
  const investor=val("iInvestor"),date=$("iDate").value,currency=$("iCurrency").value,original_amount=num("iOriginalAmount"),rate=currency==="RMB"?1:num("iRate"),rmb=num("iRmb");
  if(!investor||!date||original_amount<=0||rmb<=0){notify("请填写投资人、到账日期和金额");return;}
  if(currency==="USD"&&rate<=0){notify("USD 投资款请填写汇率");return;}
  const existing=editing.investment?investments.find(x=>x.id===editing.investment):null,id=editing.investment||offlineId();
  const payload={id,investor,date,account_type:$("iAccountType").value,currency,original_amount,rate,rmb,note:val("iNote")||null,created_by:existing?.created_by||session.user.id,updated_at:new Date().toISOString()};
  const saveBtn=$("saveInvestmentBtn");saveBtn.disabled=true;
  try{investments=editing.investment?investments.map(x=>x.id===id?{...payload,_pending:true}:x):[{...payload,_pending:true},...investments];await queueOp("put_investment",payload,id);resetInvestmentForm();await finishLocalMutation("投资款");}
  finally{saveBtn.disabled=false;}
};
$("cancelInvestmentEditBtn").onclick=resetInvestmentForm;
function resetInvestmentForm(){
  editing.investment=null;$("investmentTitle").textContent="新增投资款";$("saveInvestmentBtn").textContent="保存投资款";$("cancelInvestmentEditBtn").classList.add("hidden");
  ["iInvestor","iOriginalAmount","iRate","iRmb","iNote"].forEach(id=>$(id).value="");$("iDate").value=today();$("iAccountType").value="corporate";$("iCurrency").value="RMB";$("iRate").value="1";syncInvestmentCurrencyUI(false);
}
window.editInvestment=id=>{
  if(!canWrite())return;const i=investments.find(x=>x.id===id);if(!i)return;editing.investment=id;
  $("investmentTitle").textContent="修改投资款";$("saveInvestmentBtn").textContent="保存修改";$("cancelInvestmentEditBtn").classList.remove("hidden");
  $("iInvestor").value=i.investor||"";$("iDate").value=i.date||today();$("iAccountType").value=accountType(i);$("iCurrency").value=i.currency||"RMB";$("iOriginalAmount").value=i.original_amount||"";$("iRate").value=i.rate||1;$("iRmb").value=i.rmb||"";$("iNote").value=i.note||"";syncInvestmentCurrencyUI(false);window.scrollTo({top:280,behavior:"smooth"});
};
window.deleteInvestment=async id=>{if(!canWrite()||!confirm("确定删除这笔投资款吗？"))return;investments=investments.filter(x=>x.id!==id);if(editing.investment===id)resetInvestmentForm();await queueOp("delete_investment",{id},id);await finishLocalMutation("投资款删除操作");};

/* Corporate/private account transfers */
function selectedTransferAccounts(){
  return $("tDirection").value==="private_to_corporate"
    ? {from_account:"private",to_account:"corporate"}
    : {from_account:"corporate",to_account:"private"};
}
$("tDirection").onchange=()=>{$("tPurpose").value=$("tDirection").value==="private_to_corporate"?"临时垫款":"归还垫款";};
$("saveTransferBtn").onclick=async()=>{
  if(!canWrite())return;
  const date=$("tDate").value,amount=num("tAmount"),accounts=selectedTransferAccounts();
  if(!date||amount<=0){notify("请填写转账日期和大于 0 的金额");return;}
  const existing=editing.transfer?transfers.find(x=>x.id===editing.transfer):null,id=editing.transfer||offlineId();
  const payload={id,date,...accounts,amount,purpose:$("tPurpose").value,note:val("tNote")||null,created_by:existing?.created_by||session.user.id,updated_at:new Date().toISOString()};
  const saveBtn=$("saveTransferBtn");saveBtn.disabled=true;
  try{transfers=editing.transfer?transfers.map(x=>x.id===id?{...payload,_pending:true}:x):[{...payload,_pending:true},...transfers];await queueOp("put_transfer",payload,id);resetTransferForm();await finishLocalMutation("内部转账");}
  finally{saveBtn.disabled=false;}
};
$("cancelTransferEditBtn").onclick=resetTransferForm;
function resetTransferForm(){
  editing.transfer=null;$("transferTitle").textContent="新增公私户内部转账";$("saveTransferBtn").textContent="保存内部转账";$("cancelTransferEditBtn").classList.add("hidden");
  $("tDate").value=today();$("tDirection").value="private_to_corporate";$("tAmount").value="";$("tPurpose").value="临时垫款";$("tNote").value="";
}
window.editTransfer=id=>{
  if(!canWrite())return;const t=transfers.find(x=>x.id===id);if(!t)return;editing.transfer=id;
  $("transferTitle").textContent="修改公私户内部转账";$("saveTransferBtn").textContent="保存修改";$("cancelTransferEditBtn").classList.remove("hidden");
  $("tDate").value=t.date||today();$("tDirection").value=transferDirection(t);$("tAmount").value=t.amount||"";$("tPurpose").value=t.purpose||"账户调拨";$("tNote").value=t.note||"";window.scrollTo({top:280,behavior:"smooth"});
};
window.deleteTransfer=async id=>{if(!canWrite()||!confirm("确定删除这笔内部转账吗？"))return;transfers=transfers.filter(x=>x.id!==id);if(editing.transfer===id)resetTransferForm();await queueOp("delete_transfer",{id},id);await finishLocalMutation("内部转账删除操作");};

/* Expenses */
function syncExpenseCurrencyUI(auto=true){
  const currency=$("eCurrency").value;
  $("eRate").disabled=currency==="RMB";
  if(currency==="RMB")$("eRate").value="1";
  else if(!$("eRate").value||Number($("eRate").value)===1)$("eRate").value="";
  if(auto)autoExpenseRmb();
}
function autoExpenseRmb(){
  const amount=num("eOriginalAmount"),currency=$("eCurrency").value,rate=currency==="RMB"?1:num("eRate");
  if(amount>0&&(currency==="RMB"||rate>0))$("eAmount").value=(amount*rate).toFixed(2);
}
$("eCurrency").onchange=()=>syncExpenseCurrencyUI(true);
["eOriginalAmount","eRate"].forEach(id=>$(id).addEventListener("input",autoExpenseRmb));
$("saveExpenseBtn").onclick=async()=>{
  if(!canWrite())return;
  const date=$("eDate").value,currency=$("eCurrency").value,original_amount=num("eOriginalAmount"),rate=currency==="RMB"?1:num("eRate"),amount=num("eAmount");
  if(!date||original_amount<=0||amount<=0){notify("请填写日期和金额");return;}
  if(currency==="USD"&&rate<=0){notify("USD 费用请填写汇率");return;}
  const existing=editing.expense?expenses.find(x=>x.id===editing.expense):null,id=editing.expense||offlineId();
  const payload={id,date,category:$("eCategory").value,payment_source:$("ePaymentSource").value,currency,original_amount,rate,amount,party:val("eParty")||null,note:val("eNote")||null,created_by:existing?.created_by||session.user.id,updated_at:new Date().toISOString()};
  const saveBtn=$("saveExpenseBtn");saveBtn.disabled=true;
  try{expenses=editing.expense?expenses.map(x=>x.id===id?{...payload,_pending:true}:x):[{...payload,_pending:true},...expenses];await queueOp("put_expense",payload,id);resetExpenseForm();await finishLocalMutation("费用");}
  finally{saveBtn.disabled=false;}
};
$("cancelExpenseEditBtn").onclick=resetExpenseForm;
function resetExpenseForm(){
  editing.expense=null;$("expenseTitle").textContent="新增费用";$("saveExpenseBtn").textContent="保存费用";$("cancelExpenseEditBtn").classList.add("hidden");$("eDate").value=today();$("eCategory").value="差旅费";$("ePaymentSource").value="corporate";$("eCurrency").value="RMB";$("eRate").value="1";["eOriginalAmount","eAmount","eParty","eNote"].forEach(id=>$(id).value="");syncExpenseCurrencyUI(false);
}
window.editExpense=id=>{
  if(!canWrite())return;const e=expenses.find(x=>x.id===id);if(!e)return;editing.expense=id;
  $("expenseTitle").textContent="修改费用";$("saveExpenseBtn").textContent="保存修改";$("cancelExpenseEditBtn").classList.remove("hidden");
  $("eDate").value=e.date||today();$("eCategory").value=e.category||"差旅费";$("ePaymentSource").value=accountType(e,"payment_source");$("eCurrency").value=e.currency||"RMB";$("eOriginalAmount").value=e.original_amount||e.amount||"";$("eRate").value=e.rate||1;$("eAmount").value=e.amount||"";$("eParty").value=e.party||"";$("eNote").value=e.note||"";syncExpenseCurrencyUI(false);window.scrollTo({top:280,behavior:"smooth"});
};
window.deleteExpense=async id=>{if(!canWrite()||!confirm("确定删除这笔费用吗？"))return;expenses=expenses.filter(x=>x.id!==id);if(editing.expense===id)resetExpenseForm();await queueOp("delete_expense",{id},id);await finishLocalMutation("费用删除操作");};

function renderAll(){renderSummary();renderPurchases();renderReceipts();renderInvestments();renderTransfers();renderBalanceDetails();renderExpenses();renderStats();renderRecent();renderReports();drawCashChart();if(isAdmin()){$("initialBalanceInput").value=settings.initial_balance||0;$("privateInitialBalanceInput").value=settings.private_initial_balance||0;}}
function renderSummary(){
  const totalR=receipts.reduce((s,x)=>s+Number(x.rmb||0),0),totalI=investments.reduce((s,x)=>s+investmentRmb(x),0),totalP=purchasePaymentsInRange(allRange()),totalE=expenses.reduce((s,x)=>s+expenseRmb(x),0);
  const publicCash=accountCashBalance("corporate"),privateCash=accountCashBalance("private");
  $("currentBalance").textContent=money(publicCash+privateCash);$("corporateBalance").textContent=money(publicCash);$("privateBalance").textContent=money(privateCash);
  $("accountBalanceFormula").textContent=`公户 ${money(publicCash)} · 私户 ${money(privateCash)} · 内部互转不改变总额`;
  $("balanceFormula").textContent=`期初 ${money(Number(settings.initial_balance||0)+Number(settings.private_initial_balance||0))} + 到账 ${money(totalR)} + 投资 ${money(totalI)} - 采购付款 ${money(totalP)} - 费用 ${money(totalE)}`;
  const mr=receipts.filter(x=>inRange(x.date,monthRange())),mi=investments.filter(x=>inRange(x.date,monthRange())),mt=transfers.filter(x=>inRange(x.date,monthRange())),me=expenses.filter(x=>inRange(x.date,monthRange()));
  $("monthReceipt").textContent=money(mr.reduce((s,x)=>s+Number(x.rmb||0),0));$("monthReceiptCount").textContent=mr.length+" 笔";
  $("monthInvestment").textContent=money(mi.reduce((s,x)=>s+investmentRmb(x),0));$("monthInvestmentCount").textContent=mi.length+" 笔";
  $("monthTransfer").textContent=money(mt.reduce((s,x)=>s+transferRmb(x),0));$("monthTransferCount").textContent=mt.length+" 笔 · 不影响公司总余额";
  $("monthPurchasePaid").textContent=money(purchasePaymentsInRange(monthRange()));
  $("monthExpense").textContent=money(me.reduce((s,x)=>s+expenseRmb(x),0));$("monthExpenseCount").textContent=me.length+" 笔";
  $("allPurchaseUnpaid").textContent=money(purchases.reduce((s,x)=>s+purchaseUnpaidRmb(x),0));
  $("allPendingReceipt").textContent=money(receipts.reduce((s,x)=>s+receiptPendingRmb(x),0));
}
function refreshFilters(){
  const suppliers=[...new Set(purchases.map(x=>x.supplier).filter(Boolean))].sort(), customers=[...new Set(receipts.map(x=>x.customer).filter(Boolean))].sort();
  const ps=$("pSupplierFilter").value,rc=$("rCustomerFilter").value;
  $("pSupplierFilter").innerHTML='<option value="">全部供应商</option>'+suppliers.map(x=>`<option>${esc(x)}</option>`).join("");
  $("rCustomerFilter").innerHTML='<option value="">全部客户</option>'+customers.map(x=>`<option>${esc(x)}</option>`).join("");
  if(suppliers.includes(ps))$("pSupplierFilter").value=ps;if(customers.includes(rc))$("rCustomerFilter").value=rc;
}
$("pSupplierFilter").onchange=renderPurchases;$("pAccountFilter").onchange=renderPurchases;$("pKeyword").oninput=renderPurchases;$("rCustomerFilter").onchange=renderReceipts;$("rAccountFilter").onchange=renderReceipts;$("rKeyword").oninput=renderReceipts;$("iAccountFilter").onchange=renderInvestments;$("iKeyword").oninput=renderInvestments;$("tDirectionFilter").onchange=renderTransfers;$("bAccountFilter").onchange=renderBalanceDetails;$("bTypeFilter").onchange=renderBalanceDetails;$("eSourceFilter").onchange=renderExpenses;
const pendingTag=row=>row?._pending?'<span class="pending-tag">待同步</span>':"";

function renderPurchases(){
  const sf=$("pSupplierFilter").value,af=$("pAccountFilter").value,k=$("pKeyword").value.trim().toLowerCase();
  const list=purchases.filter(p=>inRange(p.order_date,ranges.p)).filter(p=>{
    const itemText=itemsForPurchase(p.id).map(i=>`${i.product_name} ${i.spec||""}`).join(" ");
    return(!sf||p.supplier===sf)&&(!af||accountType(p)===af)&&(!k||`${p.order_no||""} ${itemText} ${p.note||""}`.toLowerCase().includes(k));
  }).sort((a,b)=>b.order_date.localeCompare(a.order_date));
  const total=list.reduce((s,p)=>s+purchaseTotalRmb(p),0),paid=list.reduce((s,p)=>s+purchaseSettlementPaidRmb(p),0),fees=list.reduce((s,p)=>s+purchaseFeeRmb(p),0),itemCount=list.reduce((s,p)=>s+itemsForPurchase(p.id).length,0);
  $("pKpiTotal").textContent=money(total);$("pKpiPaid").textContent=money(paid);$("pKpiUnpaid").textContent=money(list.reduce((s,p)=>s+purchaseUnpaidRmb(p),0));$("pKpiFee").textContent=money(fees);$("pKpiItems").textContent=itemCount;
  $("purchaseBody").innerHTML=list.map(p=>{
    const currency=purchaseCurrency(p),rate=purchaseRate(p),detail=itemsForPurchase(p.id).map(i=>`<div><b>${esc(i.product_name)}</b>${i.spec?" · "+esc(i.spec):""} · ${Number(i.qty||0).toLocaleString()}${esc(i.unit||"")} · ${fmtCurrency(i.subtotal,currency)}</div>`).join("");
    const totalOriginal=purchaseTotal(p);
    const totalDisplay=currency==="RMB"?money(totalOriginal):`${usd(totalOriginal)}<br><small>≈ ${money(purchaseTotalRmb(p))}</small>`;
    const pay=(v,d)=>Number(v||0)?`${fmtCurrency(v,currency)}<br><small>${d||""}</small>`:"-";
    return `<tr><td>${p.order_date}</td><td><b>${accountLabel(accountType(p))}</b></td><td><b>${esc(p.supplier)}</b>${pendingTag(p)}<br><small>${esc(p.order_no||"")}</small></td><td><b>${currency}</b><br><small>${currency==="USD"?"1 USD = "+rate+" RMB":"汇率 1"}</small></td><td><div class="detail-list">${detail}</div></td><td>${totalDisplay}</td>
    <td>${pay(p.deposit,p.deposit_date)}</td><td>${pay(p.balance_pay,p.balance_date)}</td><td>${pay(p.fee,p.fee_date)}</td>
    <td class="pos">${money(purchaseSettlementPaidRmb(p))}</td><td class="${purchaseUnpaidRmb(p)>0?"warn":"pos"}">${money(purchaseUnpaidRmb(p))}</td>
    ${canWrite()?`<td><button class="linkbtn" onclick="editPurchase('${p.id}')">修改</button><button class="linkbtn del" onclick="deletePurchase('${p.id}')">删除</button></td>`:""}</tr>`;
  }).join("");
  $("purchaseEmpty").style.display=list.length?"none":"block";
}
function renderReceipts(){
  const cf=$("rCustomerFilter").value,af=$("rAccountFilter").value,k=$("rKeyword").value.trim().toLowerCase();
  const list=receipts.filter(x=>inRange(x.date,ranges.r)).filter(r=>(!cf||r.customer===cf)&&(!af||accountType(r)===af)&&(!k||`${r.payment_type||""} ${r.note||""}`.toLowerCase().includes(k))).sort((a,b)=>b.date.localeCompare(a.date));
  $("rKpiUsd").textContent=usd(list.filter(x=>x.currency==="USD").reduce((s,x)=>s+Number(x.amount||0),0));
  $("rKpiOriginalRmb").textContent=money(list.filter(x=>x.currency==="RMB").reduce((s,x)=>s+Number(x.amount||0),0));
  $("rKpiRmb").textContent=money(list.reduce((s,x)=>s+Number(x.rmb||0),0));$("rKpiPending").textContent=money(list.reduce((s,x)=>s+receiptPendingRmb(x),0));$("rKpiCount").textContent=list.length;
  $("receiptBody").innerHTML=list.map(r=>`<tr><td>${r.date}</td><td><b>${accountLabel(accountType(r))}</b></td><td>${esc(r.customer)}${pendingTag(r)}</td><td>${esc(r.payment_type)}</td><td><b>${r.currency}</b></td><td>${fmtCurrency(r.amount,r.currency)}</td><td>${r.currency==="USD"?(r.rate||"-"):"1"}</td><td>${r.fx_fee?money(r.fx_fee):"-"}</td><td class="pos">${money(r.rmb)}</td><td class="${Number(r.pending_amount||0)>0?"warn":""}">${Number(r.pending_amount||0)>0?`${fmtCurrency(r.pending_amount,r.currency)}<br><small>≈ ${money(receiptPendingRmb(r))}</small>`:"-"}</td><td>${r.qty||""}</td><td>${esc(r.note||"")}</td>${canWrite()?`<td><button class="linkbtn" onclick="editReceipt('${r.id}')">修改</button><button class="linkbtn del" onclick="deleteReceipt('${r.id}')">删除</button></td>`:""}</tr>`).join("");
  $("receiptEmpty").style.display=list.length?"none":"block";
}
function renderInvestments(){
  const af=$("iAccountFilter").value,k=$("iKeyword").value.trim().toLowerCase();
  const list=investments.filter(x=>inRange(x.date,ranges.i)).filter(i=>(!af||accountType(i)===af)&&(!k||`${i.investor||""} ${i.note||""}`.toLowerCase().includes(k))).sort((a,b)=>b.date.localeCompare(a.date));
  $("iKpiTotal").textContent=money(list.reduce((s,x)=>s+investmentRmb(x),0));$("iKpiCorporate").textContent=money(list.filter(x=>accountType(x)==="corporate").reduce((s,x)=>s+investmentRmb(x),0));$("iKpiPrivate").textContent=money(list.filter(x=>accountType(x)==="private").reduce((s,x)=>s+investmentRmb(x),0));$("iKpiCount").textContent=list.length;
  $("investmentBody").innerHTML=list.map(i=>`<tr><td>${i.date}</td><td><b>${accountLabel(accountType(i))}</b></td><td>${esc(i.investor)}${pendingTag(i)}</td><td><b>${i.currency}</b></td><td>${fmtCurrency(i.original_amount,i.currency)}</td><td>${i.currency==="USD"?(i.rate||"-"):"1"}</td><td class="pos">${money(i.rmb)}</td><td>${esc(i.note||"")}</td>${canWrite()?`<td><button class="linkbtn" onclick="editInvestment('${i.id}')">修改</button><button class="linkbtn del" onclick="deleteInvestment('${i.id}')">删除</button></td>`:""}</tr>`).join("");
  $("investmentEmpty").style.display=list.length?"none":"block";
}
function renderTransfers(){
  const direction=$("tDirectionFilter").value;
  const periodTransfers=transfers.filter(x=>inRange(x.date,ranges.t)),list=periodTransfers.filter(t=>!direction||transferDirection(t)===direction).sort((a,b)=>b.date.localeCompare(a.date));
  const toCorporate=list.filter(x=>transferDirection(x)==="private_to_corporate").reduce((s,x)=>s+transferRmb(x),0),toPrivate=list.filter(x=>transferDirection(x)==="corporate_to_private").reduce((s,x)=>s+transferRmb(x),0);
  const cumulative=transfers.filter(x=>!ranges.t.end||x.date<=ranges.t.end),cumulativeToCorporate=cumulative.filter(x=>transferDirection(x)==="private_to_corporate").reduce((s,x)=>s+transferRmb(x),0),cumulativeToPrivate=cumulative.filter(x=>transferDirection(x)==="corporate_to_private").reduce((s,x)=>s+transferRmb(x),0);
  $("tKpiTotal").textContent=money(list.reduce((s,x)=>s+transferRmb(x),0));
  $("tKpiToCorporate").textContent=money(toCorporate);
  $("tKpiToPrivate").textContent=money(toPrivate);
  $("tKpiOutstanding").textContent=money(cumulativeToCorporate-cumulativeToPrivate);
  $("tKpiCount").textContent=list.length;
  $("transferBody").innerHTML=list.map(t=>`<tr><td>${t.date}</td><td><b>${accountLabel(t.from_account)}</b></td><td><b>${accountLabel(t.to_account)}</b></td><td class="pos">${money(t.amount)}</td><td>${esc(t.purpose||"")}${pendingTag(t)}</td><td>${esc(t.note||"")}</td>${canWrite()?`<td><button class="linkbtn" onclick="editTransfer('${t.id}')">修改</button><button class="linkbtn del" onclick="deleteTransfer('${t.id}')">删除</button></td>`:""}</tr>`).join("");
  $("transferEmpty").style.display=list.length?"none":"block";
}
function renderBalanceDetails(){
  const view=balanceDetailView();
  $("bKpiCorporateOpening").textContent=money(view.corporateOpening);
  $("bKpiCorporateEnding").textContent=money(view.corporateEnding);
  $("bKpiPrivateOpening").textContent=money(view.privateOpening);
  $("bKpiPrivateEnding").textContent=money(view.privateEnding);
  $("bKpiCompanyEnding").textContent=money(view.companyEnding);
  $("bKpiIn").textContent=money(view.filteredIn);
  $("bKpiOut").textContent=money(view.filteredOut);
  $("bKpiCount").textContent=view.rows.length;
  $("balanceDetailBody").innerHTML=view.rows.map(event=>`<tr>
    <td>${event.date}</td><td><b>${accountLabel(event.account)}</b></td><td>${esc(event.type_label)}</td>
    <td>${esc(event.summary)}${event.pending?pendingTag({_pending:true}):""}</td>
    <td class="pos">${event.inflow>0?money(event.inflow):"-"}</td><td class="neg">${event.outflow>0?money(event.outflow):"-"}</td>
    <td class="${event.balance<0?"neg":"pos"}">${money(event.balance)}</td><td>${esc(event.note||"")}</td>
  </tr>`).join("");
  $("balanceDetailEmpty").style.display=view.rows.length?"none":"block";
}
function renderExpenses(){
  const sf=$("eSourceFilter").value,list=expenses.filter(x=>inRange(x.date,ranges.e)).filter(e=>!sf||accountType(e,"payment_source")===sf).sort((a,b)=>b.date.localeCompare(a.date));
  $("eKpiTotal").textContent=money(list.reduce((s,x)=>s+expenseRmb(x),0));$("eKpiTravel").textContent=money(list.filter(x=>x.category==="差旅费").reduce((s,x)=>s+expenseRmb(x),0));$("eKpiReimb").textContent=money(list.filter(x=>x.category==="个人报销").reduce((s,x)=>s+expenseRmb(x),0));$("eKpiCount").textContent=list.length;
  $("expenseBody").innerHTML=list.map(e=>`<tr><td>${e.date}</td><td><b>${accountLabel(accountType(e,"payment_source"))}</b></td><td>${esc(e.category)}${pendingTag(e)}</td><td><b>${e.currency}</b></td><td>${fmtCurrency(e.original_amount,e.currency)}</td><td>${e.currency==="USD"?(e.rate||"-"):"1"}</td><td class="neg">${money(e.amount)}</td><td>${esc(e.party||"")}</td><td>${esc(e.note||"")}</td>${canWrite()?`<td><button class="linkbtn" onclick="editExpense('${e.id}')">修改</button><button class="linkbtn del" onclick="deleteExpense('${e.id}')">删除</button></td>`:""}</tr>`).join("");
  $("expenseEmpty").style.display=list.length?"none":"block";
}
function renderStats(){
  const po=purchases.filter(x=>inRange(x.order_date,ranges.s)),re=receipts.filter(x=>inRange(x.date,ranges.s)),inv=investments.filter(x=>inRange(x.date,ranges.s)),tr=transfers.filter(x=>inRange(x.date,ranges.s)),ex=expenses.filter(x=>inRange(x.date,ranges.s));
  $("sPurchaseTotal").textContent=money(po.reduce((s,p)=>s+purchaseTotalRmb(p),0));$("sPurchasePaid").textContent=money(purchasePaymentsInRange(ranges.s));$("sReceipt").textContent=money(re.reduce((s,x)=>s+Number(x.rmb||0),0));$("sInvestment").textContent=money(inv.reduce((s,x)=>s+investmentRmb(x),0));$("sTransfer").textContent=money(tr.reduce((s,x)=>s+transferRmb(x),0));$("sExpense").textContent=money(ex.reduce((s,x)=>s+expenseRmb(x),0));
  const sm={};po.forEach(p=>sm[p.supplier]=(sm[p.supplier]||0)+purchaseTotalRmb(p));renderBars("supplierStats",sm,money);
  const pm={};po.forEach(p=>itemsForPurchase(p.id).forEach(i=>{const k=i.spec?`${i.product_name} · ${i.spec}`:i.product_name;pm[k]=(pm[k]||0)+Number(i.subtotal||0)*purchaseRate(p);}));renderBars("productStats",pm,money);
  const cm={};re.forEach(r=>cm[r.customer]=(cm[r.customer]||0)+Number(r.rmb||0));renderBars("customerStats",cm,money);
  const em={};ex.forEach(e=>em[e.category]=(em[e.category]||0)+expenseRmb(e));renderBars("expenseStats",em,money);
}
function renderBars(id,map,fmt){
  const rows=Object.entries(map).sort((a,b)=>b[1]-a[1]),el=$(id);if(!rows.length){el.innerHTML='<div class="empty">这个时间段没有数据。</div>';return;}const max=rows[0][1]||1;
  el.innerHTML=rows.map(([n,v])=>`<div class="bar-row"><div>${esc(n)}</div><div class="bar-track"><span style="width:${Math.max(3,v/max*100)}%"></span></div><div style="text-align:right;font-weight:800">${fmt(v)}</div></div>`).join("");
}
function renderRecent(){
  let events=[];
  receipts.filter(r=>Number(r.rmb||0)>0).forEach(r=>events.push({date:r.date,text:`客户来款 · ${r.customer} · ${accountLabel(accountType(r))}`,amount:Number(r.rmb||0),type:"in"}));
  investments.forEach(i=>events.push({date:i.date,text:`投资款 · ${i.investor} · ${accountLabel(accountType(i))}`,amount:investmentRmb(i),type:"in"}));
  transfers.forEach(t=>events.push({date:t.date,text:`公私互转 · ${transferDirectionLabel(t)} · ${t.purpose||"账户调拨"}`,amount:transferRmb(t),type:"transfer"}));
  expenses.forEach(e=>events.push({date:e.date,text:`${e.category}${e.party?" · "+e.party:""} · ${accountLabel(accountType(e,"payment_source"))}`,amount:expenseRmb(e),type:"out"}));
  purchases.forEach(p=>paymentEvents(p).forEach(x=>events.push({date:x.date,text:`采购${x.name} · ${p.supplier} · ${accountLabel(accountType(p))}`,amount:x.rmb,type:"out"})));
  events.sort((a,b)=>b.date.localeCompare(a.date));events=events.slice(0,10);
  $("recentList").innerHTML=events.length?`<div class="table-wrap"><table style="min-width:0"><tbody>${events.map(x=>{const sign=x.type==="in"?"+":x.type==="out"?"-":"↔ ",cls=x.type==="in"?"pos":x.type==="out"?"neg":"";return `<tr><td>${x.date}</td><td>${esc(x.text)}</td><td class="${cls}" style="text-align:right">${sign}${money(x.amount)}</td></tr>`;}).join("")}</tbody></table></div>`:'<div class="empty">还没有记录。</div>';
}
function drawCashChart(){
  const c=$("cashChart"),ctx=c.getContext("2d"),rect=c.getBoundingClientRect(),dpr=window.devicePixelRatio||1,w=Math.max(320,Math.floor(rect.width)),h=260;c.width=w*dpr;c.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const n=new Date(),ms=[];for(let i=5;i>=0;i--){const d=new Date(n.getFullYear(),n.getMonth()-i,1),key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`,r={start:key+"-01",end:today(new Date(d.getFullYear(),d.getMonth()+1,0))};ms.push({label:(d.getMonth()+1)+"月",inc:receipts.filter(x=>inRange(x.date,r)).reduce((s,x)=>s+Number(x.rmb||0),0)+investments.filter(x=>inRange(x.date,r)).reduce((s,x)=>s+investmentRmb(x),0),out:purchasePaymentsInRange(r)+expenses.filter(x=>inRange(x.date,r)).reduce((s,x)=>s+expenseRmb(x),0)});}
  const max=Math.max(1,...ms.flatMap(x=>[x.inc,x.out])),pad={l:46,r:12,t:22,b:34},cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;ctx.strokeStyle="#e6eaf1";ctx.fillStyle="#778196";ctx.font="11px sans-serif";
  for(let i=0;i<=4;i++){const y=pad.t+ch*i/4;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();ctx.fillText(compact(max*(1-i/4)),4,y+4);}
  const gw=cw/ms.length,bw=Math.min(23,gw*.25);ms.forEach((m,i)=>{const x=pad.l+i*gw+gw/2,hi=ch*m.inc/max,ho=ch*m.out/max;ctx.fillStyle="#2f9d70";ctx.fillRect(x-bw-2,pad.t+ch-hi,bw,hi);ctx.fillStyle="#d05a5a";ctx.fillRect(x+2,pad.t+ch-ho,bw,ho);ctx.fillStyle="#6d788b";ctx.textAlign="center";ctx.fillText(m.label,x,h-10);});ctx.textAlign="left";
}
function compact(n){if(n>=1e8)return(n/1e8).toFixed(1)+"亿";if(n>=1e4)return(n/1e4).toFixed(1)+"万";return Math.round(n)+"";}

/* Financial statements */
function profitData(r=ranges.pl){
  const re=receipts.filter(x=>inRange(x.date,r)),po=purchases.filter(x=>inRange(x.order_date,r)),ex=expenses.filter(x=>inRange(x.date,r));
  const grossReceipts=round2(re.reduce((s,x)=>s+receiptGrossRmb(x),0));
  const receiptFees=round2(re.reduce((s,x)=>s+Number(x.fx_fee||0),0));
  const netRevenue=round2(re.reduce((s,x)=>s+Number(x.rmb||0),0));
  const purchaseCost=round2(po.reduce((s,x)=>s+purchaseTotalRmb(x),0));
  const purchaseFees=round2(po.reduce((s,x)=>s+purchaseFeeRmb(x),0));
  const grossProfit=round2(netRevenue-purchaseCost-purchaseFees);
  const categoryMap={};ex.forEach(e=>categoryMap[e.category]=(categoryMap[e.category]||0)+expenseRmb(e));
  const operatingExpenses=round2(ex.reduce((s,x)=>s+expenseRmb(x),0));
  const netProfit=round2(grossProfit-operatingExpenses);
  return {grossReceipts,receiptFees,netRevenue,purchaseCost,purchaseFees,grossProfit,categoryMap,operatingExpenses,netProfit};
}
function profitRows(r=ranges.pl){
  const d=profitData(r),rows=[
    {label:"营业收入",section:true},
    {label:"客户来款折算总额",value:d.grossReceipts},
    {label:"减：收款 / 换汇手续费",value:-d.receiptFees},
    {label:"实际入账营业收入",value:d.netRevenue,total:true},
    {label:"采购成本",section:true},
    {label:"减：采购成本（按采购单日期）",value:-d.purchaseCost},
    {label:"减：采购手续费",value:-d.purchaseFees},
    {label:"毛利润",value:d.grossProfit,total:true}
  ];
  rows.push({label:"运营费用",section:true});
  Object.entries(d.categoryMap).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>rows.push({label:`减：${k}`,value:-round2(v)}));
  rows.push({label:"运营费用合计",value:-d.operatingExpenses,total:true});
  rows.push({label:"净利润",value:d.netProfit,grand:true});
  return rows;
}
function renderProfitStatement(){
  const rows=profitRows();
  $("profitPeriodText").textContent=`期间：${dateLabel(ranges.pl.start)} 至 ${dateLabel(ranges.pl.end)}`;
  $("profitBody").innerHTML=rows.map(r=>r.section?`<tr class="section"><td colspan="2">${esc(r.label)}</td></tr>`:`<tr class="${r.grand?"grand":r.total?"total":""} ${r.value<0?"negative":""}"><td>${esc(r.label)}</td><td>${finMoney(r.value)}</td></tr>`).join("");
}
function balanceData(asOf=balanceAsOf){
  const upto={start:null,end:asOf};
  const totalInvestments=round2(investments.filter(x=>x.date<=asOf).reduce((s,x)=>s+investmentRmb(x),0));
  const cashCorporate=accountCashBalance("corporate",asOf),cashPrivate=accountCashBalance("private",asOf),cash=round2(cashCorporate+cashPrivate);
  let accountsPayable=0,supplierAdvances=0;
  purchases.filter(p=>p.order_date<=asOf).forEach(p=>{
    const diff=round2(purchaseTotalRmb(p)-purchasePaidRmbAsOf(p,asOf));
    if(diff>=0)accountsPayable+=diff;else supplierAdvances+=Math.abs(diff);
  });
  accountsPayable=round2(accountsPayable);supplierAdvances=round2(supplierAdvances);
  const cumulativeProfit=profitData(upto).netProfit;
  const initialCapital=round2(Number(settings.initial_balance||0)+Number(settings.private_initial_balance||0));
  const ownerContributions=round2(initialCapital+totalInvestments);
  const totalAssets=round2(cash+supplierAdvances);
  const totalEquity=round2(ownerContributions+cumulativeProfit);
  const totalLiabEquity=round2(accountsPayable+totalEquity);
  return {cashCorporate,cashPrivate,cash,supplierAdvances,totalAssets,accountsPayable,initialCapital,totalInvestments,ownerContributions,cumulativeProfit,totalEquity,totalLiabEquity,difference:round2(totalAssets-totalLiabEquity)};
}
function balanceRows(asOf=balanceAsOf){
  const d=balanceData(asOf);return [
    {label:"资产",section:true},
    {label:"公户余额",value:d.cashCorporate},
    {label:"私户余额",value:d.cashPrivate},
    {label:"现金及银行存款合计",value:d.cash,total:true},
    {label:"供应商预付款 / 超付款",value:d.supplierAdvances},
    {label:"资产合计",value:d.totalAssets,total:true},
    {label:"负债",section:true},
    {label:"应付账款（采购未付款）",value:d.accountsPayable},
    {label:"负债合计",value:d.accountsPayable,total:true},
    {label:"所有者权益",section:true},
    {label:"期初余额",value:d.initialCapital},
    {label:"期间累计投资款",value:d.totalInvestments},
    {label:"所有者投入合计",value:d.ownerContributions,total:true},
    {label:"累计利润",value:d.cumulativeProfit},
    {label:"所有者权益合计",value:d.totalEquity,total:true},
    {label:"负债和所有者权益合计",value:d.totalLiabEquity,grand:true}
  ];
}
function renderBalanceSheet(){
  $("balanceDateText").textContent=`截至：${balanceAsOf}`;
  const rows=balanceRows();
  $("balanceBody").innerHTML=rows.map(r=>r.section?`<tr class="section"><td colspan="2">${esc(r.label)}</td></tr>`:`<tr class="${r.grand?"grand":r.total?"total":""} ${r.value<0?"negative":""}"><td>${esc(r.label)}</td><td>${finMoney(r.value)}</td></tr>`).join("");
  const d=balanceData();const ok=Math.abs(d.difference)<0.02;
  $("balanceCheck").classList.toggle("bad",!ok);$("balanceCheck").textContent=ok?"✓ 资产 = 负债 + 所有者权益，报表平衡。":`⚠ 报表差额 ${money(d.difference)}，请检查日期或异常付款。`;
}
function renderReports(){renderProfitStatement();renderBalanceSheet();}

/* Excel exports */
async function loadXlsx(){return await withTimeout(import(XLSX_MODULE_URL),15000,"Excel 组件加载超时；首次导出请先联网一次");}
function statementAoA(title,subtitle,rows){
  return [["Boreviax Materials Inc."],[title],[subtitle],[],["项目","金额（RMB）"],...rows.filter(x=>!x.section).map(x=>[x.label,Number(x.value||0)])];
}
function setSheetWidths(ws,widths=[34,20]){ ws["!cols"]=widths.map(w=>({wch:w})); }
function applyExcelNumberFormat(ws){ for(const addr of Object.keys(ws)){ if(addr.startsWith("!"))continue; const c=ws[addr]; if(c&&c.t==="n")c.z='#,##0.00;[Red](#,##0.00);-'; } }
function balanceDetailAoA(options={}){
  const view=balanceDetailView(options),accountText=view.account?accountLabel(view.account):"公户和私户",typeText=view.type?balanceTypeLabel(view.type):"全部类型";
  return [
    ["Boreviax Materials Inc."],["公户 / 私户余额明细"],
    [`期间：${dateLabel(view.range.start)} 至 ${dateLabel(view.range.end)}`],[`账户：${accountText} · 业务类型：${typeText}`],
    ["期间起始公户余额",view.corporateOpening],["期间结束公户余额",view.corporateEnding],
    ["期间起始私户余额",view.privateOpening],["期间结束私户余额",view.privateEnding],
    ["期间结束公司总余额",view.companyEnding],[],
    ["日期","账户","业务类型","摘要","流入 RMB","流出 RMB","账户余额 RMB","备注"],
    ...view.rows.map(event=>[event.date,accountLabel(event.account),event.type_label,event.summary,event.inflow||null,event.outflow||null,event.balance,event.note||""])
  ];
}
function makeBalanceDetailSheet(XLSX,options={}){
  const ws=XLSX.utils.aoa_to_sheet(balanceDetailAoA(options));
  setSheetWidths(ws,[12,10,15,38,15,15,17,32]);applyExcelNumberFormat(ws);return ws;
}
async function exportBalanceDetailExcel(){
  try{
    const XLSX=await loadXlsx(),wb=XLSX.utils.book_new(),ws=makeBalanceDetailSheet(XLSX);
    XLSX.utils.book_append_sheet(wb,ws,"余额明细");
    XLSX.writeFile(wb,`Boreviax_公私户余额明细_${ranges.b.start||"全部"}_${ranges.b.end||today()}.xlsx`);
  }catch(err){console.error(err);alert("余额明细导出失败："+(err.message||err));}
}
async function exportProfitExcel(){
  const XLSX=await loadXlsx(),wb=XLSX.utils.book_new(),rows=profitRows(),aoa=statementAoA("利润表（管理口径）",`期间：${dateLabel(ranges.pl.start)} 至 ${dateLabel(ranges.pl.end)}`,rows),ws=XLSX.utils.aoa_to_sheet(aoa);setSheetWidths(ws);applyExcelNumberFormat(ws);XLSX.utils.book_append_sheet(wb,ws,"利润表");XLSX.writeFile(wb,`Boreviax_利润表_${ranges.pl.start||"全部"}_${ranges.pl.end||today()}.xlsx`);
}
async function exportBalanceExcel(){
  const XLSX=await loadXlsx(),wb=XLSX.utils.book_new(),rows=balanceRows(),aoa=statementAoA("资产负债表（简化管理口径）",`截至：${balanceAsOf}`,rows),ws=XLSX.utils.aoa_to_sheet(aoa);setSheetWidths(ws);applyExcelNumberFormat(ws);XLSX.utils.book_append_sheet(wb,ws,"资产负债表");XLSX.writeFile(wb,`Boreviax_资产负债表_${balanceAsOf}.xlsx`);
}
async function exportFullWorkbook(){
  try{
    const XLSX=await loadXlsx(),wb=XLSX.utils.book_new();
    const pRows=[["采购日期","付款账户","供应商","单号","币种","汇率","产品","规格","数量","单位","单价原币","小计原币","小计RMB","定金原币","定金日期","尾款原币","尾款日期","手续费原币","手续费日期","已付货款RMB","未付货款RMB","采购现金支出RMB","备注"]];
    purchases.forEach(p=>itemsForPurchase(p.id).forEach(i=>pRows.push([p.order_date,accountLabel(accountType(p)),p.supplier,p.order_no||"",p.currency,p.rate,i.product_name,i.spec||"",i.qty,i.unit||"",i.unit_price,i.subtotal,round2(Number(i.subtotal||0)*purchaseRate(p)),p.deposit,p.deposit_date||"",p.balance_pay,p.balance_date||"",p.fee,p.fee_date||"",purchaseSettlementPaidRmb(p),purchaseUnpaidRmb(p),purchaseCashPaidRmb(p),p.note||""])));
    const rRows=[["记录/到账日期","收款账户","客户","款项类型","币种","实际来款原币","汇率","折算总额RMB","银行/换汇费用RMB","实际入账RMB","待收货款原币","待收货款RMB","数量","备注"],...receipts.map(r=>[r.date,accountLabel(accountType(r)),r.customer,r.payment_type,r.currency,r.amount,r.rate,receiptGrossRmb(r),r.fx_fee,r.rmb,r.pending_amount,receiptPendingRmb(r),r.qty,r.note||""])];
    const iRows=[["到账日期","入账账户","投资人/资金来源","币种","原币金额","汇率","实际入账RMB","备注"],...investments.map(i=>[i.date,accountLabel(accountType(i)),i.investor,i.currency,i.original_amount,i.rate,i.rmb,i.note||""])];
    const tRows=[["转账日期","转出账户","转入账户","金额RMB","用途","备注"],...transfers.map(t=>[t.date,accountLabel(t.from_account),accountLabel(t.to_account),t.amount,t.purpose||"",t.note||""])];
    const eRows=[["日期","付款来源","类别","币种","原币金额","汇率","折合RMB","报销人/对方","备注"],...expenses.map(e=>[e.date,accountLabel(accountType(e,"payment_source")),e.category,e.currency,e.original_amount,e.rate,e.amount,e.party||"",e.note||""])];
    const pWs=XLSX.utils.aoa_to_sheet(pRows),rWs=XLSX.utils.aoa_to_sheet(rRows),iWs=XLSX.utils.aoa_to_sheet(iRows),tWs=XLSX.utils.aoa_to_sheet(tRows),eWs=XLSX.utils.aoa_to_sheet(eRows);setSheetWidths(pWs,[12,10,22,18,8,10,22,18,10,8,14,14,14,14,12,14,12,14,12,14,14,15,28]);setSheetWidths(rWs,[12,10,22,12,8,14,10,14,14,14,14,14,10,28]);setSheetWidths(iWs,[12,10,22,8,14,10,14,28]);setSheetWidths(tWs,[12,12,12,14,16,30]);setSheetWidths(eWs,[12,10,14,8,14,10,14,18,28]);applyExcelNumberFormat(pWs);applyExcelNumberFormat(rWs);applyExcelNumberFormat(iWs);applyExcelNumberFormat(tWs);applyExcelNumberFormat(eWs);
    XLSX.utils.book_append_sheet(wb,pWs,"采购账");XLSX.utils.book_append_sheet(wb,rWs,"客户来款");XLSX.utils.book_append_sheet(wb,iWs,"投资款");XLSX.utils.book_append_sheet(wb,tWs,"公私互转");XLSX.utils.book_append_sheet(wb,makeBalanceDetailSheet(XLSX,{range:allRange(),account:"",type:""}),"余额明细");XLSX.utils.book_append_sheet(wb,eWs,"费用");
    const plWs=XLSX.utils.aoa_to_sheet(statementAoA("利润表（管理口径）",`期间：${dateLabel(ranges.pl.start)} 至 ${dateLabel(ranges.pl.end)}`,profitRows()));setSheetWidths(plWs);applyExcelNumberFormat(plWs);XLSX.utils.book_append_sheet(wb,plWs,"利润表");
    const bsWs=XLSX.utils.aoa_to_sheet(statementAoA("资产负债表（简化管理口径）",`截至：${balanceAsOf}`,balanceRows()));setSheetWidths(bsWs);applyExcelNumberFormat(bsWs);XLSX.utils.book_append_sheet(wb,bsWs,"资产负债表");
    XLSX.writeFile(wb,`Boreviax_公司账本_${today()}.xlsx`);
  }catch(err){console.error(err);alert("Excel 导出失败："+(err.message||err));}
}
$("balanceDetailExcelBtn").onclick=exportBalanceDetailExcel;$("profitExcelBtn").onclick=exportProfitExcel;$("balanceExcelBtn").onclick=exportBalanceExcel;$("exportWorkbookBtn").onclick=exportFullWorkbook;

/* PDF export uses the browser's native print-to-PDF so Chinese text remains crisp and compatible. */
function printableHtml(title,subtitle,rows,note){
  const body=rows.map(r=>r.section?`<tr class="section"><td colspan="2">${esc(r.label)}</td></tr>`:`<tr class="${r.grand?"grand":r.total?"total":""}"><td>${esc(r.label)}</td><td>${finMoney(r.value)}</td></tr>`).join("");
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>${esc(title)}</title><style>@page{size:A4;margin:16mm}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",Arial,sans-serif;color:#172033;margin:0}h1{font-size:22px;margin:0 0 5px}h2{font-size:14px;margin:0 0 22px;color:#667085;font-weight:500}.brand{font-size:12px;font-weight:800;margin-bottom:26px;color:#1f4fd7}table{width:100%;border-collapse:collapse}th,td{padding:10px 8px;border-bottom:1px solid #e3e7ee;font-size:12px}th{text-align:left;background:#f6f8fb;color:#667085}th:last-child,td:last-child{text-align:right}.section td{font-weight:800;background:#f5f7fb}.total td{font-weight:800;border-top:1.5px solid #8c98aa}.grand td{font-weight:900;background:#eef3ff;font-size:14px}.note{margin-top:24px;padding:10px;background:#fff8e8;border:1px solid #f0d999;font-size:10px;line-height:1.6;color:#6f5415}</style></head><body><div class="brand">BOREVIAX MATERIALS INC.</div><h1>${esc(title)}</h1><h2>${esc(subtitle)}</h2><table><thead><tr><th>项目</th><th>金额（RMB）</th></tr></thead><tbody>${body}</tbody></table><div class="note">${esc(note)}</div><script>window.onload=()=>setTimeout(()=>window.print(),250);<\/script></body></html>`;
}
function printStatement(type){
  const w=window.open("","_blank","width=900,height=900");if(!w){alert("浏览器阻止了打印窗口，请允许弹窗后重试。");return;}
  const note="内部管理报表：客户实际来款按到账日确认收入；投资款计入所有者投入，不计入利润；采购成本按采购单日期确认；采购未付款计入应付账款。待收货款仅作业务跟踪；公私户内部转账只调整账户余额，二者均不影响公司总余额或利润。";
  if(type==="profit")w.document.write(printableHtml("利润表（管理口径）",`期间：${dateLabel(ranges.pl.start)} 至 ${dateLabel(ranges.pl.end)}`,profitRows(),note));
  else w.document.write(printableHtml("资产负债表（简化管理口径）",`截至：${balanceAsOf}`,balanceRows(),note));
  w.document.close();
}
$("profitPdfBtn").onclick=()=>printStatement("profit");$("balancePdfBtn").onclick=()=>printStatement("balance");

$("saveInitialBalanceBtn").onclick=async()=>{
  if(!isAdmin())return;
  const payload={id:1,initial_balance:num("initialBalanceInput"),private_initial_balance:num("privateInitialBalanceInput"),updated_by:session.user.id,updated_at:new Date().toISOString()};
  const btn=$("saveInitialBalanceBtn");btn.disabled=true;
  try{settings={...settings,...payload,_pending:true};await queueOp("put_settings",payload,"1");await finishLocalMutation("初始余额");}
  finally{btn.disabled=false;}
};

/* Import old V3 JSON */
$("importV3Btn").onclick=()=>$("importV3File").click();
$("importV3File").onchange=e=>{
  const f=e.target.files[0];if(!f||!canWrite())return;const rd=new FileReader();
  rd.onload=async()=>{try{
    const old=JSON.parse(rd.result);if(old.version!==3||!Array.isArray(old.purchases))throw new Error("不是 V3 备份");
    if(!confirm(`将把 V3 备份中的 ${old.purchases.length} 张采购单、${(old.receipts||[]).length} 笔客户来款、${(old.expenses||[]).length} 笔费用导入账本。继续吗？`))return;
    const operations=[];
    for(const p of old.purchases){
      const id=offlineId(),purchase={id,supplier:p.supplier,order_no:p.orderNo||null,order_date:p.orderDate,account_type:"corporate",currency:"RMB",rate:1,deposit:Number(p.deposit||0),deposit_date:p.depositDate||null,balance_pay:Number(p.balancePay||0),balance_date:p.balanceDate||null,fee:0,fee_date:null,note:p.note||null,created_by:session.user.id,updated_at:new Date().toISOString()};
      const its=(p.items||[]).map(i=>({id:offlineId(),purchase_id:id,product_name:i.name||"旧版项目",spec:i.spec||null,qty:Number(i.qty||0),unit:i.unit||null,unit_price:Number(i.unitPrice||0),subtotal:Number(i.subtotal||0)}));
      purchases.push({...purchase,_pending:true});purchaseItems.push(...its.map(x=>({...x,_pending:true})));operations.push({kind:"put_purchase",entity_id:id,payload:{purchase,items:its,removed_item_ids:[]}});
    }
    for(const r of old.receipts||[]){const id=offlineId(),amount=Number(r.usd||0)>0?Number(r.usd||0):Number(r.rmb||0),currency=Number(r.usd||0)>0?"USD":"RMB",row={id,customer:r.customer,payment_type:r.type||"其他",date:r.date,account_type:"corporate",currency,amount,usd:currency==="USD"?amount:0,rate:currency==="USD"?Number(r.rate||0):1,fx_fee:Number(r.fxFee||0),rmb:Number(r.rmb||0),pending_amount:0,qty:Number(r.qty||0),note:r.note||null,created_by:session.user.id,updated_at:new Date().toISOString()};receipts.push({...row,_pending:true});operations.push({kind:"put_receipt",entity_id:id,payload:row});}
    for(const x of old.expenses||[]){const id=offlineId(),amount=Number(x.amount||0),row={id,date:x.date,category:x.category||"其他费用",payment_source:"corporate",currency:"RMB",original_amount:amount,rate:1,amount,party:x.party||null,note:x.note||null,created_by:session.user.id,updated_at:new Date().toISOString()};expenses.push({...row,_pending:true});operations.push({kind:"put_expense",entity_id:id,payload:row});}
    if(isAdmin()&&old.settings?.initialBalance!=null){const row={id:1,initial_balance:Number(old.settings.initialBalance||0),private_initial_balance:Number(settings.private_initial_balance||0),updated_by:session.user.id,updated_at:new Date().toISOString()};settings={...settings,...row,_pending:true};operations.push({kind:"put_settings",entity_id:"1",payload:row});}
    await queueMany(operations);await finishLocalMutation("V3 备份");
  }catch(err){alert("导入失败："+(err.message||err));}finally{e.target.value="";}};
  rd.readAsText(f,"utf-8");
};

function initDates(){
  $("pOrderDate").value=today();$("rDate").value=today();$("iDate").value=today();$("tDate").value=today();$("eDate").value=today();$("bsDate").value=balanceAsOf;
  [["p",ranges.p],["r",ranges.r],["i",ranges.i],["t",ranges.t],["b",ranges.b],["e",ranges.e],["s",ranges.s],["pl",ranges.pl]].forEach(([k,r])=>{$(k+"Start").value=r.start||"";$(k+"End").value=r.end||"";});
  if(!$("purchaseItems").children.length)addItemRow();
  syncPurchaseCurrencyUI();syncReceiptCurrencyUI(false);syncInvestmentCurrencyUI(false);syncExpenseCurrencyUI(false);
}
window.addEventListener("resize",drawCashChart);

if(configured){
  // Paint the cached ledger immediately, then reconcile with cloud in the background.
  const localSession=loadOfflineIdentity();

  if(localSession){
    session=localSession;
    await bootApp({preferLocal:true});
    if(navigator.onLine)void reconnectCloud({announce:false});
  }else if(navigator.onLine){
    try{
      const connected=await reconnectCloud({announce:false});
      if(!connected)showLogin();
    }catch(err){
      console.error(err);
      showLogin();
      $("loginMsg").textContent="云端暂不可用，且本机尚无离线身份。请联网登录一次。";
    }
  }else{
    showLogin();
    $("loginMsg").textContent="此设备第一次离线使用前，需要联网登录一次。";
  }
}
