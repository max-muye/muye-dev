import { neon } from "@neondatabase/serverless";

const maxFileBytes = 5 * 1024 * 1024;
const maxTextBytes = 1024;
const clerkIssuer = "https://clerk.www.muye.dev";
const combiningMarkPattern = /[\u0300-\u036f\u1ab0-\u1aff\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g;
const hiddenControlPattern = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u00ad\u034f\u061c\u115f\u1160\u17b4\u17b5\u180e\u200b-\u200f\u2028-\u202e\u2060-\u206f\u3164\ufe00-\ufe0f\ufeff\uffa0]/g;
let setupPromise;

const appHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#050505">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="apple-mobile-web-app-title" content="LocalTalk">
  <link rel="manifest" href="/talk/manifest.webmanifest">
  <link rel="apple-touch-icon" href="/assets/icon-localtalk.svg">
  <link rel="stylesheet" href="/assets/site-footer.css?v=1">
  <title>Local Talk</title>
  <style>
    :root{color-scheme:light;--bg:#eef4f1;--panel:#fbfdfb;--text:#132019;--muted:#65736a;--line:#d7e4dc;--accent:#16734d;--accent2:#2f7dd1;--bubble:#e4f4eb;--admin:#e8efff;--shadow:0 18px 60px rgba(18,43,28,.14)}
    [data-theme=dark]{color-scheme:dark;--bg:#0d1210;--panel:#151d19;--text:#eef7f0;--muted:#9eaaa3;--line:#2a3931;--accent:#5fd193;--accent2:#7db7ff;--bubble:#20372a;--admin:#1d2a42;--shadow:0 18px 70px rgba(0,0,0,.38)}
    *{box-sizing:border-box}body{margin:0;min-height:100vh;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:radial-gradient(circle at 20% 10%,color-mix(in srgb,var(--accent2) 18%,transparent),transparent 28rem),radial-gradient(circle at 86% 18%,color-mix(in srgb,var(--accent) 16%,transparent),transparent 24rem),var(--bg);color:var(--text);display:grid;place-items:stretch;transition:background-color .34s ease,color .34s ease}
    body::before{content:"";position:fixed;inset:0;background:#d8ddd9;opacity:0;pointer-events:none;z-index:5;transition:opacity .22s ease}body.theme-wash::before{opacity:.72}
    main{width:min(920px,calc(100% - 24px));height:calc(100vh - 24px);margin:12px auto;display:grid;grid-template-rows:auto auto 1fr auto auto;background:color-mix(in srgb,var(--panel) 94%,transparent);border:1px solid var(--line);border-radius:8px;box-shadow:var(--shadow);overflow:hidden;transition:background-color .34s ease,border-color .34s ease,box-shadow .34s ease}
    header{padding:18px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;gap:14px;backdrop-filter:blur(16px);transition:border-color .34s ease,background-color .34s ease}h1{margin:0;font-size:21px;font-weight:800;letter-spacing:0}.sub{margin-top:2px;color:var(--muted);font-size:13px}.header-side{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap}.status{color:var(--muted);font-size:13px;min-width:62px;text-align:right}
    .disclaimer{border-top:1px solid var(--line);background:color-mix(in srgb,#fff8dc 80%,var(--panel));color:#5c4611;padding:10px 18px;font-size:12px;line-height:1.35;transition:background-color .34s ease,border-color .34s ease}.disclaimer strong{margin-right:6px}[data-theme=dark] .disclaimer{background:#2d2a1d;color:#f2dfa0}
    .downloads{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 18px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--panel) 88%,var(--accent));transition:background-color .34s ease,border-color .34s ease}.downloads span{color:var(--muted);font-size:13px;font-weight:800}.download-link{height:34px;padding:0 11px;border:1px solid var(--line);border-radius:8px;display:inline-grid;place-items:center;color:var(--text);background:color-mix(in srgb,var(--panel) 80%,transparent);font-size:13px;font-weight:800;text-decoration:none}.download-link:hover{border-color:var(--accent);color:var(--accent)}
    #messages{padding:18px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}.message{align-self:flex-start;max-width:min(700px,88%);padding:11px 13px;border-radius:8px;background:var(--bubble);border:1px solid color-mix(in srgb,var(--accent) 14%,transparent);overflow-wrap:anywhere;line-height:1.38;transition:background-color .34s ease,border-color .34s ease,color .34s ease,outline-color .18s ease}.message:hover{outline:2px solid color-mix(in srgb,var(--accent) 20%,transparent);outline-offset:2px}.message.admin{background:var(--admin);border-color:color-mix(in srgb,var(--accent2) 24%,transparent)}.message.new{animation:messageIn .42s cubic-bezier(.16,1,.3,1)}.message p{margin:0;white-space:pre-wrap}.message pre{max-width:100%;margin:8px 0;padding:10px 12px;border:1px solid var(--line);border-radius:8px;background:#050505;color:#f8f4ea;overflow:auto;white-space:pre;font:13px/1.45 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.message code{font:inherit}.html-frame{display:block;width:min(520px,100%);height:260px;margin:8px 0;border:1px solid var(--line);border-radius:8px;background:#fff}.sender{display:block;margin-bottom:4px;color:var(--accent);font-size:12px;font-weight:800}.message.admin .sender{color:var(--accent2)}.file-link{color:var(--accent2);font-weight:800;text-decoration:none}.file-link:hover{text-decoration:underline}.time{display:block;margin-top:6px;color:var(--muted);font-size:12px}.quote{margin:0 0 8px;padding:7px 9px;border-left:3px solid var(--accent);border-radius:6px;background:color-mix(in srgb,var(--panel) 64%,transparent);color:var(--muted);font-size:12px}.mini-actions{display:flex;gap:6px;margin-top:8px}.mini-button{height:28px;padding:0 9px;border-radius:7px;font-size:12px;color:var(--text);background:color-mix(in srgb,var(--panel) 76%,transparent);border:1px solid var(--line)}
    form{border-top:1px solid var(--line);padding:12px;display:grid;grid-template-columns:auto 1fr auto;gap:10px;background:color-mix(in srgb,var(--panel) 96%,transparent);transition:background-color .34s ease,border-color .34s ease}.quote-bar{grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:color-mix(in srgb,var(--bubble) 72%,transparent);color:var(--muted);font-size:13px}.quote-bar[hidden]{display:none}.quote-clear{height:26px;width:26px;padding:0;border-radius:7px;color:var(--text);background:transparent;border:1px solid var(--line)}input{min-width:0;height:46px;border:1px solid var(--line);border-radius:8px;padding:0 14px;font:inherit;background:color-mix(in srgb,var(--panel) 82%,transparent);color:var(--text);outline:none;transition:background-color .34s ease,border-color .34s ease,color .34s ease,box-shadow .18s ease}input:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 18%,transparent)}
    button,.button-link,.file-button{height:46px;border:0;border-radius:8px;padding:0 18px;font:inherit;font-weight:750;color:#fff;background:var(--accent);cursor:pointer;text-decoration:none;display:inline-grid;place-items:center;transition:background-color .34s ease,border-color .34s ease,color .34s ease,filter .18s ease,transform .18s ease}.file-button{width:46px;padding:0;color:var(--text);background:transparent;border:1px solid var(--line);font-size:24px}button:hover,.button-link:hover,.file-button:hover{filter:brightness(.94);transform:translateY(-1px)}.mini-button{height:28px;padding:0 9px;color:var(--text);background:color-mix(in srgb,var(--panel) 76%,transparent);border:1px solid var(--line);border-radius:7px;font-size:12px}.secondary-button{height:36px;padding:0 12px;color:var(--text);background:color-mix(in srgb,var(--panel) 76%,transparent);border:1px solid var(--line)}.admin-link,.signed-link{color:var(--accent2);background:transparent;border:1px solid var(--line)}#file{display:none}
    @keyframes messageIn{from{opacity:0;transform:translateY(26px) scale(.97)}70%{opacity:1;transform:translateY(-2px) scale(1)}to{opacity:1;transform:translateY(0) scale(1)}}@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
    @media(max-width:620px){main{width:100%;height:100vh;margin:0;border:0;border-radius:0}header{align-items:flex-start}.downloads{align-items:stretch}.download-link{flex:1;min-width:130px}form{grid-template-columns:1fr}.file-button,form button{width:100%}}
  </style>
</head>
<body>
  <main>
    <header>
      <div><h1 data-i18n="title">Local Talk</h1><div class="sub" data-i18n="sub">anonymous room</div></div>
      <div class="header-side">
        <button class="secondary-button" id="encrypt-room" type="button" hidden>Encrypt room</button>
        <button class="secondary-button" id="notify-toggle" type="button">Notify</button>
        <button class="secondary-button" id="theme-toggle" type="button">Dark</button>
        <a class="button-link secondary-button" href="/" data-i18n="home">Home</a>
        <a class="button-link secondary-button signed-link" href="/talk/signed" data-i18n="signedRoom">Signed room</a>
        <a class="button-link secondary-button admin-link" href="/talk/admin" data-i18n="admin">Admin</a>
        <div class="status" id="status">loading... / 加载中...</div>
      </div>
    </header>
    <section class="downloads" aria-label="LocalTalk app downloads">
      <span>Apps</span>
      <a class="download-link" href="/download/#localtalk">Download</a>
    </section>
    <section id="messages" aria-live="polite"></section>
    <form id="form">
      <div class="quote-bar" id="quote-bar" hidden><span id="quote-text"></span><button class="quote-clear" id="quote-clear" type="button">x</button></div>
      <label class="file-button" title="Upload file / 上传文件" aria-label="Upload file / 上传文件">+<input id="file" type="file"></label>
      <input id="text" autocomplete="off" placeholder="Message / 消息" maxlength="1024" autofocus>
      <button type="submit" data-i18n="send">Send</button>
    </form>
    <footer class="disclaimer"><strong id="public-disclaimer-title">Accuracy and Risk</strong><span id="public-disclaimer">This site does not guarantee that all content is always accurate, complete, timely, or available. Users are responsible for the risks arising from downloading, accessing, and using related content; to the extent permitted by law, this site is not liable for losses caused by improper use.</span></footer>
  </main>
  <script>
    if("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(()=>{});
    const dict={en:{title:"Local Talk",sub:"anonymous room",send:"Send",message:"Message",loading:"loading...",online:"online",banned:"banned",notAllowed:"this message is not allowed",sendFailed:"send failed",uploading:"uploading...",uploadFailed:"upload failed",download:"Download All",downloadFailed:"download failed",dark:"Dark",light:"Light",home:"Home",signedRoom:"Signed room",admin:"Admin",you:"You",someone:"Someone",nameSender:"Name this sender",namePrompt:"Name this sender. Leave empty to clear the name.",nameSaved:"name saved",nameFailed:"name failed",quote:"Quote",private:"Private",chooseUser:"choose a user",privateTo:"Private to",privateMsg:"Private message",name:"Name",fileQuote:"File",notify:"Notify",notificationsOn:"Notifications On",notificationsUnavailable:"notifications unavailable",notificationsBlocked:"notifications blocked",newMessage:"New message",dbError:"database error",disclaimerTitle:"Accuracy and Risk",disclaimer:"This site does not guarantee that all content is always accurate, complete, timely, or available. Users are responsible for the risks arising from downloading, accessing, and using related content; to the extent permitted by law, this site is not liable for losses caused by improper use."},zh:{title:"本地聊天",sub:"匿名聊天室",send:"发送",message:"消息",loading:"加载中...",online:"在线",banned:"已封禁",notAllowed:"这条消息不允许发送",sendFailed:"发送失败",uploading:"上传中...",uploadFailed:"上传失败",download:"下载全部",downloadFailed:"下载失败",dark:"深色",light:"浅色",home:"主页",signedRoom:"登录房间",admin:"管理",you:"你",someone:"某人",nameSender:"给发送者命名",namePrompt:"给这个发送者起名。留空可以清除名字。",nameSaved:"名字已保存",nameFailed:"保存名字失败",quote:"引用",private:"私聊",chooseUser:"选择一个用户",privateTo:"私聊给",privateMsg:"私聊消息",name:"命名",fileQuote:"文件",notify:"通知",notificationsOn:"通知已开启",notificationsUnavailable:"通知不可用",notificationsBlocked:"通知已阻止",newMessage:"新消息",dbError:"数据库错误",disclaimerTitle:"准确性与风险",disclaimer:"本站不保证所有内容始终准确、完整、及时或可用。用户下载、访问和使用相关内容所产生的风险由用户自行承担；因不当使用造成的损失，本站在法律允许的范围内不承担责任。"}};
    Object.assign(dict.en,{encryptRoom:"Encrypt room",passwordPrompt:"Room password (8 or more characters)",passwordAgain:"Enter the password again",passwordMismatch:"passwords do not match",encryptFailed:"could not encrypt this room",encrypted:"encrypted room",wrongRoomPassword:"wrong room password",unlockCancelled:"room is locked",encryptedNoFiles:"files are disabled in encrypted rooms"});
    Object.assign(dict.zh,{encryptRoom:"加密房间",passwordPrompt:"房间密码（至少 8 个字符）",passwordAgain:"再次输入密码",passwordMismatch:"两次密码不一致",encryptFailed:"无法加密这个房间",encrypted:"加密房间",wrongRoomPassword:"房间密码错误",unlockCancelled:"房间已锁定",encryptedNoFiles:"加密房间暂不支持文件"});
    const root=document.documentElement;root.dataset.theme=localStorage.getItem("localtalk-theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
    const talkBase="/talk";
    const browserPath=location.pathname.replace(/\\/$/,"");
    const roomPath=browserPath===""||browserPath===talkBase?"":browserPath.startsWith(talkBase+"/")?browserPath.slice(talkBase.length):browserPath;
    ["ja","ko","es","fr","de","pt","ru","ar"].forEach(code=>{dict[code]=dict.en});
    let lang=dict[localStorage.getItem("muye-lang")]?localStorage.getItem("muye-lang"):(localStorage.getItem("localtalk-lang")==="zh"?"zh":"en");let currentMessages=[];let mySenderKey="";let quote=null;let publicBanned=false;let publicBanReason="";let uploadBusy=false;let sendBusy=false;let filePickUntil=0;let roomEncrypted=false;let roomKey=null;let roomVerifier="";let roomSalt="";let roomMessageCount=0;
    const messages=document.querySelector("#messages"),form=document.querySelector("#form"),input=document.querySelector("#text"),file=document.querySelector("#file"),status=document.querySelector("#status"),themeToggle=document.querySelector("#theme-toggle"),notifyToggle=document.querySelector("#notify-toggle"),encryptRoomButton=document.querySelector("#encrypt-room"),quoteBar=document.querySelector("#quote-bar"),quoteText=document.querySelector("#quote-text"),quoteClear=document.querySelector("#quote-clear");
    function deviceId(){let id=localStorage.getItem("localtalk-device-id");if(!id){id=crypto.randomUUID();localStorage.setItem("localtalk-device-id",id)}return id}
    function api(path){return talkBase+roomPath+path}
    function t(k){return dict[lang][k]||dict.en[k]||k}
    function syncText(){document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));document.querySelector("#public-disclaimer-title").textContent=t("disclaimerTitle");document.querySelector("#public-disclaimer").textContent=t("disclaimer");input.placeholder=t("message");themeToggle.textContent=root.dataset.theme==="dark"?t("light"):t("dark");encryptRoomButton.textContent=roomEncrypted?t("encrypted"):t("encryptRoom");syncNotify()}
    function bytesToBase64(bytes){let value="";for(const byte of bytes)value+=String.fromCharCode(byte);return btoa(value)}
    function base64ToBytes(value){const binary=atob(value);return Uint8Array.from(binary,ch=>ch.charCodeAt(0))}
    async function deriveRoomSecret(password,salt){const material=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);const bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:base64ToBytes(salt),iterations:210000},material,256);const raw=new Uint8Array(bits);const marked=new Uint8Array(raw.length+21);marked.set(raw);marked.set(new TextEncoder().encode("localtalk-verifier-v1"),raw.length);const verifier=bytesToBase64(new Uint8Array(await crypto.subtle.digest("SHA-256",marked)));const key=await crypto.subtle.importKey("raw",raw,{name:"AES-GCM"},false,["encrypt","decrypt"]);return{key,verifier}}
    async function encryptPayload(payload){const iv=crypto.getRandomValues(new Uint8Array(12));const data=new TextEncoder().encode(JSON.stringify(payload));const encrypted=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv},roomKey,data));return"e2ee:v1:"+bytesToBase64(iv)+":"+bytesToBase64(encrypted)}
    async function decryptPayload(value){const parts=String(value||"").split(":");if(parts.length!==4||parts[0]!=="e2ee"||parts[1]!=="v1")throw new Error("bad encrypted message");const plain=await crypto.subtle.decrypt({name:"AES-GCM",iv:base64ToBytes(parts[2])},roomKey,base64ToBytes(parts[3]));return JSON.parse(new TextDecoder().decode(plain))}
    async function unlockRoom(){while(roomEncrypted&&!roomKey){const password=prompt(t("passwordPrompt"));if(password===null){status.textContent=t("unlockCancelled");return false}const secret=await deriveRoomSecret(password,roomSalt);if(secret.verifier===roomVerifier){roomKey=secret.key;return true}status.textContent=t("wrongRoomPassword")}return true}
    async function decryptMessages(list){if(!roomEncrypted)return list;if(!await unlockRoom())return[];return Promise.all(list.map(async message=>{if(message.isMaster)return message;try{const payload=await decryptPayload(message.text);return{...message,text:payload.text||"",quoteText:payload.quoteText||"",quoteName:payload.quoteName||""}}catch{return{...message,text:"[encrypted message]",quoteText:"",quoteName:""}}}))}
    function displayText(value){return String(value||"").replace(/(?:\\\\b|\u0008)[\s\S]*/g,"").replace(/\\\\n/g,"\\n").replace(/\\\\\\\\/g,"\\\\")}
    function linkHref(value){return value.startsWith("https://")?value:"https://"+value}
    function appendLinkedText(node,value){const text=displayText(value);const re=/((?:https:\\/\\/|(?:localtalk|www)\\.muye\\.dev\\/)[^\\s<>"'\\\\]+)/g;let last=0;for(const match of text.matchAll(re)){if(match.index>last)node.append(document.createTextNode(text.slice(last,match.index)));const a=document.createElement("a");a.className="file-link";a.href=linkHref(match[0]).replace("https://www.muye.dev/talk/","https://www.muye.dev/talk/");a.target="_blank";a.rel="noopener noreferrer";a.textContent=match[0].replace("www.muye.dev/talk/","www.muye.dev/talk/");node.appendChild(a);last=match.index+match[0].length}if(last<text.length)node.append(document.createTextNode(text.slice(last)))}
    function appendRichText(node,value){const text=displayText(value);const parts=text.split("\`\`\`");for(let i=0;i<parts.length;i++){if(!parts[i])continue;if(i%2){let block=parts[i].replace(/^\\n/,"").replace(/\\n$/,"");const isHtml=/^html\\s/i.test(block)||/^<!doctype html/i.test(block)||/^<html[\\s>]/i.test(block);if(isHtml){block=block.replace(/^html\\s*/i,"");const frame=document.createElement("iframe");frame.className="html-frame";frame.sandbox="";frame.referrerPolicy="no-referrer";frame.srcdoc=block;node.appendChild(frame)}else{const pre=document.createElement("pre");const code=document.createElement("code");code.textContent=block;pre.appendChild(code);node.appendChild(pre)}}else appendLinkedText(node,parts[i])}}
    function senderLabel(message){const isMe=message.senderKey&&message.senderKey===mySenderKey;return message.isAdmin?"Admin":(isMe?t("you"):(message.displayName||t("someone")))}
    function quoteValue(message){return message.kind==="file"?t("fileQuote")+": "+(message.name||"file"):displayText(message.text).slice(0,180)}
    function syncNotify(){notifyToggle.textContent=("Notification" in window&&Notification.permission==="granted")?t("notificationsOn"):t("notify")}
    async function enableNotifications(){if(!("Notification" in window)){status.textContent=t("notificationsUnavailable");return}const value=Notification.permission==="default"?await Notification.requestPermission():Notification.permission;syncNotify();status.textContent=value==="granted"?t("notificationsOn"):t("notificationsBlocked")}
    function askNotificationsOnce(){if(!("Notification" in window)||Notification.permission!=="default")return;Notification.requestPermission().then(syncNotify).catch(()=>{})}
    function showMessageNotification(message){if(!("Notification" in window)||Notification.permission!=="granted")return;if(message.senderKey&&message.senderKey===mySenderKey)return;const body=message.kind==="file"?t("fileQuote")+": "+(message.name||"file"):displayText(message.text).slice(0,120);const note=new Notification(t("newMessage")+" - "+senderLabel(message),{body,tag:"localtalk-message-"+message.id});note.onclick=()=>{window.focus();note.close()}}
    function setQuote(message){quote={quoteName:senderLabel(message),quoteText:quoteValue(message)};quoteText.textContent=quote.quoteName+": "+quote.quoteText;quoteBar.hidden=false;input.focus()}
    function clearQuote(){quote=null;quoteText.textContent="";quoteBar.hidden=true}
    async function nameSender(message){if(message.isAdmin)return;const name=prompt(t("namePrompt"),message.displayName||"");if(name===null)return;const r=await fetch(api("/name-sender"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({senderKey:message.senderKey,name})});status.textContent=r.ok?t("nameSaved"):t("nameFailed");if(r.ok)await loadHistory()}
    function makeMessageEl(message,animate=false){const item=document.createElement("article");item.className="message"+(message.isAdmin?" admin":"")+(animate?" new":"");item.dataset.id=message.id;const sender=document.createElement("span");sender.className="sender";sender.textContent=senderLabel(message);item.appendChild(sender);if(message.quoteText){const q=document.createElement("div");q.className="quote";q.textContent=(message.quoteName||t("someone"))+": "+message.quoteText;item.appendChild(q)}if(message.kind==="file"){const link=document.createElement("a");link.className="file-link";link.href=api("/file/"+encodeURIComponent(message.id));link.textContent=message.name||"file";link.download=message.name||"file";item.append(t("fileQuote")+": ",link)}else{const text=document.createElement("p");appendRichText(text,message.text);item.appendChild(text)}const time=document.createElement("span");time.className="time";time.textContent=message.time||"";item.appendChild(time);const actions=document.createElement("div");actions.className="mini-actions";const quoteButton=document.createElement("button");quoteButton.className="mini-button";quoteButton.type="button";quoteButton.textContent=t("quote");quoteButton.onclick=()=>setQuote(message);actions.appendChild(quoteButton);if(!message.isAdmin){const nameButton=document.createElement("button");nameButton.className="mini-button";nameButton.type="button";nameButton.textContent=t("name");nameButton.onclick=()=>nameSender(message);actions.appendChild(nameButton)}item.appendChild(actions);return item}
    function firstPositions(){const map=new Map();messages.querySelectorAll(".message").forEach(el=>map.set(el.dataset.id,el.getBoundingClientRect().top));return map}
    function animateShift(first){messages.querySelectorAll(".message").forEach(el=>{const from=first.get(el.dataset.id);if(from===undefined)return;const dy=from-el.getBoundingClientRect().top;if(!dy)return;el.animate([{transform:"translateY("+dy+"px)"},{transform:"translateY(0)"}],{duration:520,easing:"cubic-bezier(.16,1,.3,1)"})})}
    function renderMessages(list){currentMessages=list;messages.textContent="";currentMessages.forEach(msg=>messages.appendChild(makeMessageEl(msg,false)));messages.scrollTop=messages.scrollHeight}
    function applyMessages(list){if(!currentMessages.length){renderMessages(list);return}const known=new Set(currentMessages.map(msg=>String(msg.id)));const fresh=list.filter(msg=>!known.has(String(msg.id)));if(!fresh.length){currentMessages=list;return}const first=firstPositions();currentMessages=list;for(const msg of fresh){messages.appendChild(makeMessageEl(msg,true));showMessageNotification(msg)}requestAnimationFrame(()=>animateShift(first));messages.scrollTo({top:messages.scrollHeight,behavior:"smooth"})}
    async function loadMySenderKey(){const r=await fetch(api("/sender-key"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({deviceId:deviceId()})});if(r.ok)mySenderKey=(await r.json()).senderKey||""}
    function banStatus(reason){const labels={en:{device_banned:"device banned",room_device_banned:"room device banned",ip_banned:"IP banned",ipv6_banned:"IPv6 banned",auto_message_spam:"auto-ban: too many messages",auto_upload_spam:"auto-ban: too many uploads"},zh:{device_banned:"设备已封禁",room_device_banned:"本房间设备已封禁",ip_banned:"IP 已封禁",ipv6_banned:"IPv6 已封禁",auto_message_spam:"自动封禁：消息过快",auto_upload_spam:"自动封禁：上传过快"}};return labels[lang][reason]||t("banned")}
    function syncLock(){const disabled=publicBanned||(roomEncrypted&&!roomKey);input.disabled=disabled;file.disabled=disabled||roomEncrypted;form.querySelector('button[type="submit"]').disabled=disabled;encryptRoomButton.hidden=!roomPath||roomEncrypted||roomMessageCount!==0;status.textContent=publicBanned?banStatus(publicBanReason):(roomEncrypted&&!roomKey?t("unlockCancelled"):(roomEncrypted?t("encrypted"):t("online")));syncText()}
    async function loadRoomState(){const r=await fetch(api("/room-state")+"?deviceId="+encodeURIComponent(deviceId()),{cache:"no-store"});if(r.ok){const state=await r.json();publicBanned=state.banned;publicBanReason=state.banReason||"";roomEncrypted=Boolean(state.encrypted);roomSalt=state.encryptionSalt||"";roomVerifier=state.passwordVerifier||"";roomMessageCount=Number(state.messageCount)||0;if(roomEncrypted)await unlockRoom();syncLock()}}
    async function loadHistory(){await loadRoomState();const r=await fetch(api("/history"),{cache:"no-store"});if(!r.ok)throw new Error("history failed");applyMessages(await decryptMessages(await r.json()))}
    themeToggle.addEventListener("click",()=>{document.body.classList.add("theme-wash");setTimeout(()=>{root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";localStorage.setItem("localtalk-theme",root.dataset.theme);syncText()},90);setTimeout(()=>document.body.classList.remove("theme-wash"),330)});
    quoteClear.addEventListener("click",clearQuote);
    notifyToggle.addEventListener("click",enableNotifications);
    window.addEventListener("pointerdown",askNotificationsOnce,{once:true});
    window.addEventListener("keydown",askNotificationsOnce,{once:true});
    file.closest(".file-button")?.addEventListener("pointerdown",()=>{filePickUntil=Date.now()+4000});
    file.addEventListener("click",event=>{event.stopPropagation();filePickUntil=Date.now()+4000});
    async function handleForbidden(r){const data=await r.clone().json().catch(()=>({}));if(data.error==="not_allowed"){status.textContent=t("notAllowed");return}publicBanned=true;publicBanReason=data.error||"";syncLock()}
    encryptRoomButton.addEventListener("click",async()=>{if(roomEncrypted||roomMessageCount!==0||!roomPath)return;const password=prompt(t("passwordPrompt"));if(!password||password.length<8)return;const again=prompt(t("passwordAgain"));if(password!==again){status.textContent=t("passwordMismatch");return}const saltText=bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));const secret=await deriveRoomSecret(password,saltText);const r=await fetch(api("/encrypt-room"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({salt:saltText,passwordVerifier:secret.verifier})});if(!r.ok){status.textContent=t("encryptFailed");return}roomKey=secret.key;await loadHistory()});
    form.addEventListener("submit",async e=>{e.preventDefault();if(sendBusy||uploadBusy||Date.now()<filePickUntil)return;if(publicBanned){status.textContent=banStatus(publicBanReason);return}const text=input.value.trim();if(!text)return;if(roomEncrypted&&!await unlockRoom())return;sendBusy=true;input.value="";try{const payload=roomEncrypted?await encryptPayload({text,quoteText:quote?.quoteText||"",quoteName:quote?.quoteName||""}):text;const r=await fetch(api("/send"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:payload,deviceId:deviceId(),passwordVerifier:roomEncrypted?roomVerifier:"",quoteText:roomEncrypted?"":quote?.quoteText||"",quoteName:roomEncrypted?"":quote?.quoteName||""})});if(r.status===403){await handleForbidden(r);return}if(!r.ok){status.textContent=t("sendFailed");input.value=text;return}clearQuote();await loadHistory();input.focus()}finally{sendBusy=false}});
    file.addEventListener("change",async()=>{filePickUntil=Date.now()+4000;if(uploadBusy)return;if(publicBanned){status.textContent=banStatus(publicBanReason);file.value="";return}const f=file.files[0];if(!f)return;uploadBusy=true;input.value="";status.textContent=t("uploading");const reader=new FileReader();reader.onload=async()=>{try{const r=await fetch(api("/upload"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({deviceId:deviceId(),name:f.name,mime:f.type||"application/octet-stream",dataUrl:reader.result,quoteText:quote?.quoteText||"",quoteName:quote?.quoteName||""})});file.value="";if(r.status===403){await handleForbidden(r);return}if(!r.ok){status.textContent=t("uploadFailed");return}clearQuote();await loadHistory()}finally{uploadBusy=false;filePickUntil=Date.now()+1200}};reader.onerror=()=>{uploadBusy=false;filePickUntil=Date.now()+1200;file.value="";status.textContent=t("uploadFailed")};reader.readAsDataURL(f)});
    syncText();loadMySenderKey().then(loadHistory).catch(()=>{status.textContent=t("dbError")});
    setInterval(()=>loadHistory().catch(()=>{}),3000);
  </script>
  <script src="/assets/site-footer.js?v=1"></script>
</body>
</html>`;

const adminHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Local Talk Admin</title>
  <link rel="stylesheet" href="/assets/site-footer.css?v=1">
  <style>
    :root{--panel:#f8fbf9;--text:#101a14;--muted:#637169;--line:#d8e4dc;--accent:#16734d;--danger:#bd2f3a;--blue:#2f65d1}*{box-sizing:border-box}body{margin:0;min-height:100vh;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:linear-gradient(135deg,#101513,#20332a);color:var(--text);padding:18px}main{width:min(980px,100%);margin:0 auto;background:var(--panel);border-radius:8px;overflow:hidden;border:1px solid var(--line);box-shadow:0 22px 70px rgba(0,0,0,.28)}header{padding:18px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;gap:12px;align-items:center}h1{margin:0;font-size:22px}.muted{color:var(--muted);font-size:13px;margin-top:4px}section{padding:18px}.login,.composer{display:grid;gap:10px;max-width:620px}.composer{display:none;margin-bottom:14px}input,select{height:46px;border:1px solid var(--line);border-radius:8px;padding:0 14px;font:inherit}button,a,label{height:42px;border-radius:8px;border:0;padding:0 14px;font:inherit;font-weight:750;background:var(--accent);color:#fff;cursor:pointer;text-decoration:none;display:inline-grid;place-items:center;transition:transform .18s ease,filter .18s ease}button:hover,a:hover,label:hover{transform:translateY(-1px);filter:brightness(.95)}.secondary{color:var(--text);background:#edf4f0;border:1px solid var(--line)}.danger{background:var(--danger)}.blue{background:var(--blue)}.toolbar{display:none;gap:8px;flex-wrap:wrap;margin-bottom:14px}.bulk{display:none;grid-template-columns:minmax(160px,1fr) auto minmax(160px,1fr) auto;gap:8px;margin-bottom:14px}.ip-tools{display:none;grid-template-columns:minmax(180px,1fr) auto;gap:8px;margin-bottom:14px;max-width:420px}#admin-file{display:none}#room-list,#list,#signed-list,#private-list,#bans{display:grid;gap:10px}.room-head{display:none;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--line);border-radius:8px;background:#fff}.row{border:1px solid var(--line);border-radius:8px;padding:12px;display:grid;grid-template-columns:1fr auto;gap:12px;align-items:start;background:#fff;animation:rowIn .24s ease both}.room-row{cursor:pointer}.room-row strong{overflow-wrap:anywhere}.text{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.35}.text a{color:var(--blue);font-weight:800}.time{color:var(--muted);font-size:12px;margin-top:5px}.actions{display:flex;gap:8px;flex-wrap:wrap}#notice{color:var(--muted);font-size:13px;min-height:18px}.tabs{display:none;gap:8px;margin-bottom:14px}@keyframes rowIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}@media(max-width:620px){body{padding:0}main{min-height:100vh;border-radius:0}.row{grid-template-columns:1fr}.room-head{align-items:stretch}.actions,.bulk,.ip-tools{display:grid;grid-template-columns:1fr}} 
  </style>
</head>
<body>
  <main>
    <header><div><h1 id="admin-title">Local Talk Admin / 本地聊天管理</h1><div class="muted" id="admin-sub">manage messages and bans / 管理消息和封禁</div></div><div class="actions"><a class="secondary" href="/" id="home">Home / 主页</a><a class="secondary" href="/talk/" id="back">Back / 返回</a></div></header>
    <section>
      <div class="login" id="login"><input id="password" type="password" placeholder="Admin password / 管理密码" autofocus><button id="login-button" type="button">Enter Admin / 进入管理</button><div id="notice"></div></div>
      <div class="toolbar" id="toolbar"><button id="refresh" type="button">Refresh / 刷新</button><button class="blue" id="ipv6-ban" type="button">Ban IPv6 / 封禁 IPv6</button><button class="blue" id="fast-spam-master" type="button">Fast Spam Ban On / 快速刷屏封禁开</button><a class="secondary" href="/talk/export">Download All / 下载全部</a><button class="danger" id="clear" type="button">Clear All / 清空全部</button></div>
      <div class="composer" id="composer"><input id="admin-text" placeholder="Admin message / 管理员消息" maxlength="1024"><div class="actions"><button id="admin-send" type="button">Send Here / 发送到本房间</button><button class="blue" id="admin-master-send" type="button">Send Master / 发送到所有房间</button><label class="secondary" id="admin-file-here-label">File Here / 文件发本房间<input id="admin-file" type="file"></label><label class="secondary" id="admin-file-master-label">File Master / 文件发所有房间<input id="admin-master-file" type="file"></label></div></div>
      <div class="bulk" id="bulk"><select id="bulk-user"><option value="">Select user / 选择用户</option></select><button class="blue" id="master-device-ban" type="button">Ban Device Master / 全局封禁设备</button><button class="blue" id="room-device-ban" type="button">Ban Device Here / 本房间封禁设备</button><button class="danger" id="bulk-user-delete" type="button">Delete User Master / 全局删除用户消息</button><button class="danger" id="room-user-delete" type="button">Delete User Here / 本房间删除用户消息</button><input id="bulk-text" placeholder="Exact text / 精确文字"><button class="blue" id="master-word-ban" type="button">Ban Word Master / 全局封禁文字</button><button class="blue" id="room-word-ban" type="button">Ban Word Here / 本房间封禁文字</button><button class="danger" id="bulk-text-delete" type="button">Delete Text Master / 全局删除文字</button><button class="danger" id="room-text-delete" type="button">Delete Text Here / 本房间删除文字</button><button class="danger" id="bulk-text-contains-delete" type="button">Delete Has Text Master / 全局删除包含文字</button><button class="danger" id="room-text-contains-delete" type="button">Delete Has Text Here / 本房间删除包含文字</button></div>
      <div class="ip-tools" id="ip-tools"><input id="ip-prefix" placeholder="IP or IP prefix / IP 或 IP 前缀"><button class="blue" id="ip-prefix-ban" type="button">Ban IP Prefix / 封禁 IP 前缀</button></div>
      <div class="ip-tools" id="text-tools"><input id="banned-text" placeholder="Text to ban / 要封禁的文字"><button class="blue" id="banned-text-ban" type="button">Ban Text / 封禁文字</button><input id="allowed-text" placeholder="Text to allow / 要允许的文字"><button class="secondary" id="allowed-text-add" type="button">Allow Text / 允许文字</button></div>
      <div class="ip-tools" id="room-tools"><input id="room-name" placeholder="Room name / 房间名"><button class="secondary" id="room-create" type="button">Create Room / 创建房间</button></div>
      <div class="tabs" id="tabs"><button class="secondary" id="show-messages" type="button">Messages / 消息</button><button class="secondary" id="show-signed" type="button">Signed / 登录房间</button><button class="secondary" id="show-private" type="button">Private / 私聊</button><button class="secondary" id="show-bans" type="button">Bans / 封禁</button></div>
      <div class="room-head" id="room-head"><strong id="room-title"></strong><button class="secondary" id="room-back" type="button">Rooms / 房间</button></div><div id="room-list"></div><div id="list"></div><div id="signed-list" style="display:none"></div><div id="private-list" style="display:none"></div><div id="bans" style="display:none"></div>
    </section>
  </main>
  <script>
    const dict={en:{title:"Local Talk Admin",sub:"manage messages and bans",home:"Home",back:"Back",enter:"Enter Admin",refresh:"Refresh",banIpv6:"Ban IPv6",allowIpv6:"Allow IPv6",fastSpamOn:"Fast Spam Ban On",fastSpamOff:"Fast Spam Ban Off",roomSpamOn:"Fast ban: on",roomSpamOff:"Fast ban: off",download:"Download All",clear:"Clear All",adminMsg:"Admin message",sendAdmin:"Send Here",sendMaster:"Send Master",fileHere:"File Here",fileMaster:"File Master",messages:"Messages",signed:"Signed",private:"Private",bans:"Bans",wrong:"wrong password",failed:"admin load failed",deleteFailed:"delete failed",clearAsk:"Clear all messages in this tab?",clearBansBlocked:"Choose Messages, Signed, or Private first.",deleteUserAsk:"Delete all messages by",deleteUserAskTail:"in this tab?",deleteTextAsk:"Delete all messages exactly equal to",deleteTextContainsAsk:"Delete all messages containing",deleteRoomTextAsk:"Delete messages in this room exactly equal to",deleteRoomTextContainsAsk:"Delete messages in this room containing",ban:"Ban Device",banMasterDevice:"Ban Device Master",banRoomDevice:"Ban Device Here",banMasterWord:"Ban Word Master",banRoomWord:"Ban Word Here",banIp:"Ban IP",banIpPrefix:"Ban IP Prefix",ipPrefix:"IP or IP prefix",banText:"Ban Text",allowText:"Allow Text",textBan:"Text to ban",textAllow:"Text to allow",roomName:"Room name",room:"Room",rooms:"Rooms",openRoom:"Open",mainRoom:"main",createRoom:"Create Room",roomCreated:"room created",roomFailed:"room failed",text:"Text",allowedText:"Allowed Text",autoBan:"Auto-ban",messageSpam:"7 messages / 5s",uploadSpam:"upload spam",banSigned:"Ban Signed User",unban:"Unban",delete:"Delete",selectUser:"Select user",deleteUserMaster:"Delete User Master",deleteUserHere:"Delete User Here",exactText:"Exact text",deleteTextMaster:"Delete Text Master",deleteTextHere:"Delete Text Here",deleteTextContainsMaster:"Delete Has Text Master",deleteRoomTextContains:"Delete Has Text Here",name:"Name",namePrompt:"Name this device. Leave empty to clear the name.",noMessages:"No messages.",noBans:"No bans.",device:"Device",ip:"IP",signedUser:"Signed User",user:"User"},zh:{title:"本地聊天管理",sub:"管理消息和封禁",home:"主页",back:"返回",enter:"进入管理",refresh:"刷新",banIpv6:"封禁 IPv6",allowIpv6:"允许 IPv6",fastSpamOn:"快速刷屏封禁开",fastSpamOff:"快速刷屏封禁关",roomSpamOn:"快速封禁：开",roomSpamOff:"快速封禁：关",download:"下载全部",clear:"清空全部",adminMsg:"管理员消息",sendAdmin:"发送到本房间",sendMaster:"发送到所有房间",fileHere:"文件发本房间",fileMaster:"文件发所有房间",messages:"消息",signed:"登录房间",private:"私聊",bans:"封禁",wrong:"密码错误",failed:"管理加载失败",deleteFailed:"删除失败",clearAsk:"清空当前标签里的所有消息？",clearBansBlocked:"请先选择消息、登录房间或私聊。",deleteUserAsk:"删除这个用户的所有消息：",deleteUserAskTail:"在当前标签中？",deleteTextAsk:"删除所有完全等于这段文字的消息：",deleteTextContainsAsk:"删除所有包含这段文字的消息：",deleteRoomTextAsk:"删除本房间完全等于这段文字的消息：",deleteRoomTextContainsAsk:"删除本房间包含这段文字的消息：",ban:"封禁设备",banMasterDevice:"全局封禁设备",banRoomDevice:"只在本房间封禁设备",banMasterWord:"全局封禁文字",banRoomWord:"只在本房间封禁文字",banIp:"封禁 IP",banIpPrefix:"封禁 IP 前缀",ipPrefix:"IP 或 IP 前缀",banText:"封禁文字",allowText:"允许文字",textBan:"要封禁的文字",textAllow:"要允许的文字",roomName:"房间名",room:"房间",rooms:"房间",openRoom:"打开",mainRoom:"主页",createRoom:"创建房间",roomCreated:"房间已创建",roomFailed:"创建房间失败",text:"文字",allowedText:"允许文字",autoBan:"自动封禁",messageSpam:"5 秒 7 条消息",uploadSpam:"上传刷屏",banSigned:"封禁登录用户",unban:"解封",delete:"删除",selectUser:"选择用户",deleteUserMaster:"全局删除用户消息",deleteUserHere:"本房间删除用户消息",exactText:"精确文字",deleteTextMaster:"全局删除文字",deleteTextHere:"本房间删除文字",deleteTextContainsMaster:"全局删除包含文字",deleteRoomTextContains:"本房间删除包含文字",name:"命名",namePrompt:"给这个设备起名。留空可以清除名字。",noMessages:"没有消息。",noBans:"没有封禁。",device:"设备",ip:"IP",signedUser:"登录用户",user:"用户"}};
    ["ja","ko","es","fr","de","pt","ru","ar"].forEach(code=>{dict[code]=dict.en});
    Object.assign(dict.en,{deleteRoom:"Delete Room",deleteRoomAsk:"Delete this room and all of its public messages?",roomDeleted:"room deleted",roomDeleteFailed:"room delete failed"});
    Object.assign(dict.zh,{deleteRoom:"删除房间",deleteRoomAsk:"删除这个房间及其中所有公开消息？",roomDeleted:"房间已删除",roomDeleteFailed:"删除房间失败"});
    let lang=dict[localStorage.getItem("muye-lang")]?localStorage.getItem("muye-lang"):(localStorage.getItem("localtalk-lang")==="zh"?"zh":"en");let password="";let tab="messages";let selectedRoom=null;let messageRows=[];let roomRows=[];let signedRows=[];let privateRows=[];let ipv6Banned=false;let fastSpamMaster=true;let roomFastSpam={};
    const login=document.querySelector("#login"),toolbar=document.querySelector("#toolbar"),composer=document.querySelector("#composer"),tabs=document.querySelector("#tabs"),bulk=document.querySelector("#bulk"),ipTools=document.querySelector("#ip-tools"),textTools=document.querySelector("#text-tools"),roomTools=document.querySelector("#room-tools"),ipPrefix=document.querySelector("#ip-prefix"),ipPrefixBan=document.querySelector("#ip-prefix-ban"),bannedText=document.querySelector("#banned-text"),bannedTextBan=document.querySelector("#banned-text-ban"),allowedText=document.querySelector("#allowed-text"),allowedTextAdd=document.querySelector("#allowed-text-add"),roomName=document.querySelector("#room-name"),roomCreate=document.querySelector("#room-create"),bulkUser=document.querySelector("#bulk-user"),masterDeviceBan=document.querySelector("#master-device-ban"),roomDeviceBan=document.querySelector("#room-device-ban"),bulkUserDelete=document.querySelector("#bulk-user-delete"),roomUserDelete=document.querySelector("#room-user-delete"),bulkText=document.querySelector("#bulk-text"),masterWordBan=document.querySelector("#master-word-ban"),roomWordBan=document.querySelector("#room-word-ban"),bulkTextDelete=document.querySelector("#bulk-text-delete"),roomTextDelete=document.querySelector("#room-text-delete"),bulkTextContainsDelete=document.querySelector("#bulk-text-contains-delete"),roomTextContainsDelete=document.querySelector("#room-text-contains-delete"),passwordInput=document.querySelector("#password"),loginButton=document.querySelector("#login-button"),notice=document.querySelector("#notice"),roomHead=document.querySelector("#room-head"),roomTitle=document.querySelector("#room-title"),roomBack=document.querySelector("#room-back"),roomList=document.querySelector("#room-list"),list=document.querySelector("#list"),signedList=document.querySelector("#signed-list"),privateList=document.querySelector("#private-list"),bans=document.querySelector("#bans"),refresh=document.querySelector("#refresh"),ipv6Ban=document.querySelector("#ipv6-ban"),fastSpamMasterButton=document.querySelector("#fast-spam-master"),clear=document.querySelector("#clear"),adminText=document.querySelector("#admin-text"),adminSend=document.querySelector("#admin-send"),adminMasterSend=document.querySelector("#admin-master-send"),adminFile=document.querySelector("#admin-file"),adminMasterFile=document.querySelector("#admin-master-file"),showMessages=document.querySelector("#show-messages"),showSigned=document.querySelector("#show-signed"),showPrivate=document.querySelector("#show-private"),showBans=document.querySelector("#show-bans");
    function t(k){return dict[lang][k]||dict.en[k]||k}
    function syncText(){document.querySelector("#admin-title").textContent=t("title");document.querySelector("#admin-sub").textContent=t("sub");document.querySelector("#home").textContent=t("home");document.querySelector("#back").textContent=t("back");passwordInput.placeholder=lang==="zh"?"管理密码":"Admin password";loginButton.textContent=t("enter");refresh.textContent=t("refresh");ipv6Ban.textContent=ipv6Banned?t("allowIpv6"):t("banIpv6");fastSpamMasterButton.textContent=fastSpamMaster?t("fastSpamOn"):t("fastSpamOff");document.querySelector('a[href="/talk/export"]').textContent=t("download");clear.textContent=t("clear");adminText.placeholder=t("adminMsg");adminSend.textContent=t("sendAdmin");adminMasterSend.textContent=t("sendMaster");ipPrefix.placeholder=t("ipPrefix");ipPrefixBan.textContent=t("banIpPrefix");bannedText.placeholder=t("textBan");bannedTextBan.textContent=t("banText");allowedText.placeholder=t("textAllow");allowedTextAdd.textContent=t("allowText");roomName.placeholder=t("roomName");roomCreate.textContent=t("createRoom");bulkText.placeholder=t("exactText");masterDeviceBan.textContent=t("banMasterDevice");roomDeviceBan.textContent=t("banRoomDevice");bulkUserDelete.textContent=t("deleteUserMaster");roomUserDelete.textContent=t("deleteUserHere");masterWordBan.textContent=t("banMasterWord");roomWordBan.textContent=t("banRoomWord");bulkTextDelete.textContent=t("deleteTextMaster");roomTextDelete.textContent=t("deleteTextHere");bulkTextContainsDelete.textContent=t("deleteTextContainsMaster");roomTextContainsDelete.textContent=t("deleteRoomTextContains");roomBack.textContent=t("rooms");document.querySelector("#admin-file-here-label").childNodes[0].nodeValue=t("fileHere");document.querySelector("#admin-file-master-label").childNodes[0].nodeValue=t("fileMaster");showMessages.textContent=t("messages");showSigned.textContent=t("signed");showPrivate.textContent=t("private");showBans.textContent=t("bans")}
    function showAdmin(){login.style.display="none";toolbar.style.display="flex";composer.style.display="grid";tabs.style.display="flex";bulk.style.display="grid";ipTools.style.display="grid";textTools.style.display="grid";roomTools.style.display="grid"}
    async function adminFetch(path,body={}){return fetch("/talk"+path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password,...body})})}
    function displayText(value){return String(value||"").replace(/(?:\\\\b|\u0008)[\s\S]*/g,"").replace(/\\\\n/g,"\\n").replace(/\\\\\\\\/g,"\\\\")}
    function linkHref(value){return value.startsWith("https://")?value:"https://"+value}
    function appendLinkedText(node,value){const text=displayText(value);const re=/((?:https:\\/\\/|localtalk\\.muye\\.dev\\/)[^\\s<>"'\\\\]+)/g;let last=0;for(const match of text.matchAll(re)){if(match.index>last)node.append(document.createTextNode(text.slice(last,match.index)));const a=document.createElement("a");a.href=linkHref(match[0]);a.target="_blank";a.rel="noopener noreferrer";a.textContent=match[0];node.appendChild(a);last=match.index+match[0].length}if(last<text.length)node.append(document.createTextNode(text.slice(last)))}
    function addQuote(content,row){if(!row.quoteText)return;const q=document.createElement("div");q.className="time";q.textContent="> "+(row.quoteName||"")+" "+row.quoteText;content.appendChild(q)}
    function makeButton(label,className,handler){const btn=document.createElement("button");btn.className=className;btn.type="button";btn.textContent=label;btn.onclick=handler;return btn}
    function ipPrefixDefault(ip){const value=String(ip||"");if(value.includes(":")){const parts=value.split(":");return parts.slice(0,4).join(":")+":"}const parts=value.split(".");return parts.length>=3?parts.slice(0,3).join(".")+".":value}
    async function banIpPrefix(ip){const value=prompt(t("ipPrefix"),ipPrefixDefault(ip));if(value===null)return;const clean=value.trim();if(!clean)return;await adminFetch("/admin/ban-ip",{ip:clean});await load()}
    function roomPathLabel(room){return room==="master"?"master":(room?"www.muye.dev/talk/"+room:"www.muye.dev/talk/")}
    function visibleMessageRows(){return selectedRoom===null?messageRows:messageRows.filter(row=>row.isMaster||(row.room||"")===selectedRoom)}
    async function toggleRoomFastSpam(room){const enabled=roomFastSpam[room]!==false;await adminFetch("/admin/room-fast-spam",{room,enabled:!enabled});await load()}
    async function deleteRoomFromAdmin(room){if(!room||!confirm(t("deleteRoomAsk")+" "+roomPathLabel(room)))return;const r=await adminFetch("/admin/delete-room",{room});if(!r.ok){notice.textContent=t("roomDeleteFailed");return}selectedRoom=null;await load();notice.textContent=t("roomDeleted")}
    function renderRoomList(rows){roomList.textContent="";const map=new Map();const registeredRooms=new Set(roomRows.map(row=>row.room));for(const row of roomRows){map.set(row.room,{room:row.room,count:Number(row.messageCount)||0,last:row.lastMessageAt||""})}for(const row of rows){if(row.isMaster)continue;const key=row.room||"";const data=map.get(key)||{room:key,count:0,last:""};if(!registeredRooms.has(key))data.count++;data.last=row.time||data.last;map.set(key,data)}const rooms=[...map.values()].sort((a,b)=>roomPathLabel(a.room).localeCompare(roomPathLabel(b.room)));if(!rooms.length){roomList.textContent=t("noMessages");return}for(const room of rooms){const item=document.createElement("article");item.className="row room-row";const content=document.createElement("div");const title=document.createElement("strong");title.textContent=roomPathLabel(room.room);const meta=document.createElement("div");meta.className="time";meta.textContent=room.count+" "+t("messages")+" · "+(room.last||"");content.append(title,meta);const actions=document.createElement("div");actions.className="actions";actions.appendChild(makeButton(roomFastSpam[room.room]===false?t("roomSpamOff"):t("roomSpamOn"),"blue",()=>toggleRoomFastSpam(room.room)));actions.appendChild(makeButton(t("openRoom"),"secondary",()=>{selectedRoom=room.room;renderMessages(messageRows);syncTabs()}));if(room.room)actions.appendChild(makeButton(t("deleteRoom"),"danger",()=>deleteRoomFromAdmin(room.room)));item.onclick=event=>{if(event.target.tagName!=="BUTTON"){selectedRoom=room.room;renderMessages(messageRows);syncTabs()}};item.append(content,actions);roomList.appendChild(item)}}
    function renderMessages(rows){list.textContent="";if(selectedRoom===null){roomHead.style.display="none";roomList.style.display=tab==="messages"?"grid":"none";renderRoomList(rows);return}roomList.style.display="none";roomHead.style.display=tab==="messages"?"flex":"none";roomTitle.textContent=roomPathLabel(selectedRoom);const roomRows=visibleMessageRows();if(!roomRows.length){list.textContent=t("noMessages");return}for(const row of roomRows){const item=document.createElement("article");item.className="row";const content=document.createElement("div");addQuote(content,row);const text=document.createElement("div");text.className="text";const roomPrefix=row.room?"/"+row.room:"";if(row.kind==="file"){const a=document.createElement("a");a.href="/talk"+roomPrefix+"/file/"+encodeURIComponent(row.id);a.textContent=row.name||"file";a.download=row.name||"file";text.append(t("file")+": ",a)}else{appendLinkedText(text,row.text)}const time=document.createElement("div");time.className="time";time.textContent=t("room")+": "+(row.room||t("mainRoom"))+" · "+(row.displayName?row.displayName+" · ":"")+(row.isAdmin?"Admin · ":"")+(row.time||"")+" · "+t("device")+": "+(row.deviceId||"none")+" · "+t("ip")+": "+(row.ip||"none");content.append(text,time);const actions=document.createElement("div");actions.className="actions";actions.appendChild(makeButton(t("delete"),"danger",async()=>{const r=await adminFetch("/admin/delete",{id:row.id});if(!r.ok){notice.textContent=t("deleteFailed");return}await load()}));if(row.ip&&!row.isAdmin)actions.appendChild(makeButton(t("name"),"secondary",async()=>{const value=prompt(t("namePrompt"),row.displayName||"");if(value===null)return;await adminFetch("/admin/name",{ip:row.ip,name:value});await load()}));if(row.deviceId&&!row.isAdmin)actions.appendChild(makeButton(t("ban"),"blue",async()=>{await adminFetch("/admin/ban",{deviceId:row.deviceId});await load()}));if(row.ip&&!row.isAdmin)actions.appendChild(makeButton(t("banIp"),"blue",async()=>{await adminFetch("/admin/ban-ip",{ip:row.ip});await load()}));if(row.ip&&!row.isAdmin)actions.appendChild(makeButton(t("banIpPrefix"),"blue",async()=>banIpPrefix(row.ip)));item.append(content,actions);list.appendChild(item)}}
    function renderSignedMessages(rows){signedList.textContent="";if(!rows.length){signedList.textContent=t("noMessages");return}for(const row of rows){const item=document.createElement("article");item.className="row";const content=document.createElement("div");addQuote(content,row);const text=document.createElement("div");text.className="text";if(row.kind==="file"){text.textContent=t("file")+": "+(row.name||"file")}else{appendLinkedText(text,row.text)}const time=document.createElement("div");time.className="time";time.textContent=(row.displayName||t("signedUser"))+" · "+(row.time||"")+" · "+t("signedUser")+": "+row.userId+" · "+t("ip")+": "+(row.ip||"none");content.append(text,time);const actions=document.createElement("div");actions.className="actions";actions.appendChild(makeButton(t("delete"),"danger",async()=>{const r=await adminFetch("/admin/signed-delete",{id:row.id});if(!r.ok){notice.textContent=t("deleteFailed");return}await load()}));actions.appendChild(makeButton(t("banSigned"),"blue",async()=>{await adminFetch("/admin/ban-signed",{userId:row.userId,displayName:row.displayName});await load()}));if(row.ip)actions.appendChild(makeButton(t("banIp"),"blue",async()=>{await adminFetch("/admin/ban-ip",{ip:row.ip});await load()}));if(row.ip)actions.appendChild(makeButton(t("banIpPrefix"),"blue",async()=>banIpPrefix(row.ip)));item.append(content,actions);signedList.appendChild(item)}}
    function renderPrivateMessages(rows){privateList.textContent="";if(!rows.length){privateList.textContent=t("noMessages");return}for(const row of rows){const item=document.createElement("article");item.className="row";const content=document.createElement("div");const text=document.createElement("div");text.className="text";appendLinkedText(text,row.text);const time=document.createElement("div");time.className="time";time.textContent=(row.fromName||t("signedUser"))+" -> "+(row.toName||t("signedUser"))+" · "+(row.time||"")+" · "+(lang==="zh"?"来自":"from")+": "+row.fromId+" · "+(lang==="zh"?"发送给":"to")+": "+row.toId;content.append(text,time);item.append(content);privateList.appendChild(item)}}
    function renderBans(rows){bans.textContent="";if(!rows.length){bans.textContent=t("noBans");return}for(const row of rows){const item=document.createElement("article");item.className="row";const label=row.kind==="ip"||row.kind==="ipv6"?t("ip"):(row.kind==="signed"?t("signedUser"):(row.kind==="allow"?t("allowedText"):(row.kind==="roomDevice"?t("room")+" "+t("device"):(row.kind==="roomText"?t("room")+" "+t("text"):(row.kind==="text"?t("text"):t("device"))))));const value=row.value||row.deviceId||row.ip||row.userId||row.text||"";const reason=row.reason==="auto_message_spam"?t("autoBan")+": "+t("messageSpam"):(row.reason==="auto_upload_spam"?t("autoBan")+": "+t("uploadSpam"):"");const room=row.room!==undefined?t("room")+": "+(row.room||t("mainRoom"))+" · ":"";const content=document.createElement("div");content.innerHTML="<strong>"+label+": "+value+"</strong><div class='time'>"+room+(row.displayName?row.displayName+" · ":"")+(reason?reason+" · ":"")+(row.createdAt||"")+"</div>";const btn=document.createElement("button");btn.className="danger";btn.type="button";btn.textContent=(row.kind==="allow"||row.kind==="text"||row.kind==="roomText")?t("delete"):t("unban");btn.onclick=async()=>{const path=row.kind==="ip"?"/admin/unban-ip":(row.kind==="ipv6"?"/admin/unban-ipv6":(row.kind==="signed"?"/admin/unban-signed":(row.kind==="allow"?"/admin/unallow-text":(row.kind==="text"?"/admin/unban-text":(row.kind==="roomDevice"?"/admin/unban-room-device":(row.kind==="roomText"?"/admin/unban-room-text":"/admin/unban"))))));const body=row.kind==="ip"?{ip:value}:(row.kind==="signed"?{userId:value}:(row.kind==="allow"?{text:value}:(row.kind==="text"?{text:value}:(row.kind==="roomDevice"?{room:row.room||"",deviceId:value}:(row.kind==="roomText"?{room:row.room||"",text:value}:{deviceId:value})))));await adminFetch(path,body);await load()};item.append(content,btn);bans.appendChild(item)}}
    function populateBulkUsers(){const rows=tab==="signed"?signedRows:visibleMessageRows();const current=bulkUser.value;bulkUser.textContent="";const empty=document.createElement("option");empty.value="";empty.textContent=t("selectUser");bulkUser.appendChild(empty);const seen=new Set();for(const row of rows){const id=tab==="signed"?(row.userId||""):(row.deviceId||row.ip||"");if(!id||seen.has(id)||id==="admin")continue;seen.add(id);const option=document.createElement("option");option.value=id;option.textContent=(row.displayName||row.userId||row.ip||row.deviceId||t("user"))+" · "+id;bulkUser.appendChild(option)}bulkUser.value=[...bulkUser.options].some(option=>option.value===current)?current:""}
    function syncTabs(){const showingMessages=tab==="messages";const inRoom=showingMessages&&selectedRoom!==null;list.style.display=inRoom?"grid":"none";roomList.style.display=showingMessages&&selectedRoom===null?"grid":"none";roomHead.style.display=inRoom?"flex":"none";signedList.style.display=tab==="signed"?"grid":"none";privateList.style.display=tab==="private"?"grid":"none";bans.style.display=tab==="bans"?"grid":"none";bulk.style.display=tab==="bans"||tab==="private"?"none":"grid";adminSend.style.display=inRoom?"inline-grid":"none";document.querySelector("#admin-file-here-label").style.display=inRoom?"inline-grid":"none";roomDeviceBan.style.display=inRoom?"inline-grid":"none";roomUserDelete.style.display=inRoom?"inline-grid":"none";roomWordBan.style.display=inRoom?"inline-grid":"none";roomTextDelete.style.display=inRoom?"inline-grid":"none";roomTextContainsDelete.style.display=inRoom?"inline-grid":"none";populateBulkUsers()}
    async function load(){const [m,s,p,b,state,roomsResponse]=await Promise.all([adminFetch("/admin/messages"),adminFetch("/admin/signed-messages"),adminFetch("/admin/private-messages"),adminFetch("/admin/bans"),adminFetch("/admin/state"),adminFetch("/admin/rooms")]);if(m.status===403||s.status===403||p.status===403||b.status===403||state.status===403||roomsResponse.status===403){password="";notice.textContent=t("wrong");return}if(!m.ok||!s.ok||!p.ok||!b.ok||!state.ok||!roomsResponse.ok){notice.textContent=t("failed");return}showAdmin();messageRows=await m.json();roomRows=await roomsResponse.json();signedRows=await s.json();privateRows=await p.json();const stateData=await state.json();ipv6Banned=stateData.ipv6Banned;fastSpamMaster=stateData.fastSpamMaster!==false;roomFastSpam=stateData.roomFastSpam||{};syncText();renderMessages(messageRows);renderSignedMessages(signedRows);renderPrivateMessages(privateRows);renderBans(await b.json());notice.textContent="";syncTabs()}
    loginButton.onclick=async()=>{password=passwordInput.value;await load()};passwordInput.onkeydown=e=>{if(e.key==="Enter")loginButton.click()};refresh.onclick=load;roomBack.onclick=()=>{selectedRoom=null;renderMessages(messageRows);syncTabs()};clear.onclick=async()=>{if(tab==="bans"||tab==="private"){notice.textContent=t("clearBansBlocked");return}if(!confirm(t("clearAsk")))return;const path=tab==="signed"?"/admin/signed-clear":"/admin/clear";await adminFetch(path);selectedRoom=null;await load();tab=tab==="signed"?"signed":"messages";syncTabs()};showMessages.onclick=()=>{tab="messages";renderMessages(messageRows);syncTabs()};showSigned.onclick=()=>{tab="signed";syncTabs()};showPrivate.onclick=()=>{tab="private";syncTabs()};showBans.onclick=()=>{tab="bans";syncTabs()};
    ipv6Ban.onclick=async()=>{await adminFetch("/admin/ban-ipv6",{banned:!ipv6Banned});await load()};
    fastSpamMasterButton.onclick=async()=>{await adminFetch("/admin/fast-spam-master",{enabled:!fastSpamMaster});await load()};
    ipPrefixBan.onclick=async()=>{const ip=ipPrefix.value.trim();if(!ip)return;await adminFetch("/admin/ban-ip",{ip});ipPrefix.value="";await load()};
    bannedTextBan.onclick=async()=>{const text=bannedText.value.trim();if(!text)return;await adminFetch("/admin/ban-text",{text});bannedText.value="";await load()};
    allowedTextAdd.onclick=async()=>{const text=allowedText.value.trim();if(!text)return;await adminFetch("/admin/allow-text",{text});allowedText.value="";await load()};
    roomCreate.onclick=async()=>{const room=roomName.value.trim();if(!room)return;const r=await adminFetch("/admin/create-room",{room});if(!r.ok){notice.textContent=t("roomFailed");return}roomName.value="";await load();notice.textContent=t("roomCreated")};
    masterDeviceBan.onclick=async()=>{if(tab==="bans"||tab==="private"){notice.textContent=t("clearBansBlocked");return}const value=bulkUser.value;if(!value)return;if(tab==="signed")await adminFetch("/admin/ban-signed",{userId:value,displayName:bulkUser.selectedOptions[0]?.textContent||""});else await adminFetch("/admin/ban",{deviceId:value});await load()};
    roomDeviceBan.onclick=async()=>{if(tab!=="messages"||selectedRoom===null)return;const value=bulkUser.value;if(!value)return;await adminFetch("/admin/room-ban-device",{room:selectedRoom,deviceId:value});await load()};
    masterWordBan.onclick=async()=>{const text=bulkText.value.trim();if(!text)return;await adminFetch("/admin/ban-text",{text});bulkText.value="";await load()};
    roomWordBan.onclick=async()=>{if(tab!=="messages"||selectedRoom===null)return;const text=bulkText.value.trim();if(!text)return;await adminFetch("/admin/room-ban-text",{room:selectedRoom,text});bulkText.value="";await load()};
    adminSend.onclick=async()=>{const text=adminText.value.trim();if(!text||selectedRoom===null)return;adminText.value="";await adminFetch("/admin/send",{text,room:selectedRoom});await load()};
    adminMasterSend.onclick=async()=>{const text=adminText.value.trim();if(!text)return;adminText.value="";await adminFetch("/admin/send",{text,master:true});await load()};
    bulkUserDelete.onclick=async()=>{if(tab==="bans"||tab==="private"){notice.textContent=t("clearBansBlocked");return}const value=bulkUser.value;if(!value)return;const label=bulkUser.selectedOptions[0]?.textContent||value;if(!confirm(t("deleteUserAsk")+" "+label+" "+t("deleteUserAskTail")))return;const path=tab==="signed"?"/admin/signed-delete-user":"/admin/delete-user";await adminFetch(path,{value});await load();syncTabs()};
    roomUserDelete.onclick=async()=>{if(tab!=="messages"||selectedRoom===null)return;const value=bulkUser.value;if(!value)return;const label=bulkUser.selectedOptions[0]?.textContent||value;if(!confirm(t("deleteUserAsk")+" "+label+" "+t("deleteUserAskTail")))return;await adminFetch("/admin/delete-room-user",{room:selectedRoom,value});await load();syncTabs()};
    bulkTextDelete.onclick=async()=>{if(tab==="bans"||tab==="private"){notice.textContent=t("clearBansBlocked");return}const text=bulkText.value.trim();if(!text)return;if(!confirm(t("deleteTextAsk")+' "'+text+'"'))return;const path=tab==="signed"?"/admin/signed-delete-text":"/admin/delete-text";await adminFetch(path,{text});bulkText.value="";await load();syncTabs()};
    roomTextDelete.onclick=async()=>{if(tab!=="messages"||selectedRoom===null)return;const text=bulkText.value.trim();if(!text)return;if(!confirm(t("deleteRoomTextAsk")+' "'+text+'"'))return;await adminFetch("/admin/delete-room-text",{room:selectedRoom,text});bulkText.value="";await load();syncTabs()};
    bulkTextContainsDelete.onclick=async()=>{if(tab==="bans"||tab==="private"){notice.textContent=t("clearBansBlocked");return}const text=bulkText.value.trim();if(!text)return;if(!confirm(t("deleteTextContainsAsk")+' "'+text+'"'))return;const path=tab==="signed"?"/admin/signed-delete-text-contains":"/admin/delete-text-contains";await adminFetch(path,{text});bulkText.value="";await load();syncTabs()};
    roomTextContainsDelete.onclick=async()=>{if(tab!=="messages"||selectedRoom===null){return}const text=bulkText.value.trim();if(!text)return;if(!confirm(t("deleteRoomTextContainsAsk")+' "'+text+'"'))return;await adminFetch("/admin/delete-room-text-contains",{room:selectedRoom,text});bulkText.value="";await load();syncTabs()};
    function uploadAdminFile(input,master=false){const f=input.files[0];if(!f)return;const reader=new FileReader();reader.onload=async()=>{await adminFetch("/admin/upload",{name:f.name,mime:f.type||"application/octet-stream",dataUrl:reader.result,room:selectedRoom||"",master});input.value="";await load()};reader.readAsDataURL(f)}
    adminFile.onchange=()=>uploadAdminFile(adminFile,false);
    adminMasterFile.onchange=()=>uploadAdminFile(adminMasterFile,true);
    syncText();
  </script>
  <script src="/assets/site-footer.js?v=1"></script>
</body>
</html>`;

const downloadHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#050505">
  <link rel="manifest" href="/talk/manifest.webmanifest">
  <link rel="apple-touch-icon" href="/assets/icon-localtalk.svg">
  <link rel="stylesheet" href="/assets/site-footer.css?v=1">
  <title>Download LocalTalk</title>
  <style>
    :root{color-scheme:dark;--bg:#050606;--panel:#101512;--text:#f7f5ed;--muted:#a9b2ac;--line:#26332c;--accent:#61d693;--accent2:#82b7ff}
    *{box-sizing:border-box}body{margin:0;min-height:100vh;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:radial-gradient(circle at 20% 10%,rgba(97,214,147,.16),transparent 28rem),#050606;color:var(--text);display:grid;grid-template-rows:1fr auto}
    main{width:min(860px,calc(100% - 28px));margin:40px auto;display:grid;gap:22px}.top{display:flex;justify-content:space-between;align-items:center;gap:12px}.back{color:var(--accent2);font-weight:800;text-decoration:none}h1{margin:0;font-size:clamp(38px,8vw,82px);letter-spacing:0;line-height:.95}p{margin:0;color:var(--muted);font-size:17px;line-height:1.55}.downloads{display:flex;gap:10px;flex-wrap:wrap}.download-button,.copy-button{height:46px;padding:0 16px;border:1px solid var(--line);border-radius:8px;color:var(--text);background:var(--panel);font:inherit;font-weight:850;cursor:pointer}.download-button:hover,.copy-button:hover{border-color:var(--accent);color:var(--accent)}.download-button:disabled{opacity:.62;cursor:progress}.help{display:grid;gap:12px;padding:18px;border:1px solid var(--line);border-radius:8px;background:var(--panel)}h2{margin:0;font-size:24px}.steps{margin:0;padding-left:22px;color:var(--muted);line-height:1.65}.steps strong{color:var(--text)}.command-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:6px}code{padding:8px 10px;border:1px solid var(--line);border-radius:6px;background:#050606;color:var(--text);overflow-wrap:anywhere}.copy-button{height:34px;padding:0 11px;font-size:13px}.status{min-height:22px;color:var(--accent);font-weight:800}@media(max-width:620px){main{margin:24px auto}.top{align-items:flex-start;flex-direction:column}.download-button{width:100%}.command-row{align-items:stretch}.copy-button{width:100%}code{width:100%}}
  </style>
</head>
<body>
  <main>
    <div class="top">
      <a class="back" href="/talk/">Back to LocalTalk</a>
      <a class="back" href="/">Home</a>
    </div>
    <section>
      <h1>Download LocalTalk</h1>
      <p>Choose the app for your computer. The browser will save one ZIP file.</p>
    </section>
    <section class="downloads" aria-label="LocalTalk app downloads">
      <button class="download-button" type="button" data-download-app="macos">MacOS ZIP</button>
      <button class="download-button" type="button" data-download-app="windows">Windows ZIP</button>
    </section>
    <p class="status" id="status" role="status" aria-live="polite"></p>
    <section class="help">
      <h2>Mac blocked it?</h2>
      <p>LocalTalk is not Apple-notarized yet, so macOS may say Apple could not verify it. To open it:</p>
      <ol class="steps">
        <li>Open the ZIP, then right-click <strong>Localtalk.app</strong>.</li>
        <li>Choose <strong>Open</strong>, then approve it if macOS asks again.</li>
        <li>To open Terminal, press <strong>⌘ Command</strong> + <strong>Space</strong>, type <strong>Terminal</strong>, press <strong>Enter</strong>, then paste one command below.</li>
        <li>If it is in Downloads, run:
          <span class="command-row">
            <code id="downloads-command">xattr -dr com.apple.quarantine ~/Downloads/Localtalk.app</code>
            <button class="copy-button" type="button" data-copy-command="downloads-command">Copy</button>
          </span>
        </li>
        <li>If it is on Desktop, run:
          <span class="command-row">
            <code id="desktop-command">xattr -dr com.apple.quarantine ~/Desktop/Localtalk.app</code>
            <button class="copy-button" type="button" data-copy-command="desktop-command">Copy</button>
          </span>
        </li>
        <li>Or type <code>xattr -dr com.apple.quarantine </code>, drag <strong>Localtalk.app</strong> into Terminal, then press Enter.</li>
      </ol>
    </section>
  </main>
  <footer>
    <p>© <span id="year"></span> Muye. Built for Cloudflare Pages.</p>
    <a href="mailto:muye@muye.dev">muye@muye.dev</a>
  </footer>
  <script>
    document.querySelector("#year").textContent = new Date().getFullYear();
    const status=document.querySelector("#status");
    const appDownloads={macos:{name:"Localtalk MacOS.zip",parts:["/downloads/localtalk/localtalk-macos.zip.part-aa","/downloads/localtalk/localtalk-macos.zip.part-ab"]},windows:{name:"Localtalk Windows.zip",parts:["/downloads/localtalk/localtalk-windows.zip.part-aa","/downloads/localtalk/localtalk-windows.zip.part-ab"]}};
    async function downloadApp(kind,button){const app=appDownloads[kind];if(!app)return;const label=button.textContent;button.disabled=true;button.textContent="Downloading...";status.textContent="Preparing "+app.name;try{const blobs=[];for(const part of app.parts){const r=await fetch(part,{cache:"force-cache"});if(!r.ok)throw new Error("download failed");blobs.push(await r.blob())}const url=URL.createObjectURL(new Blob(blobs,{type:"application/zip"}));const a=document.createElement("a");a.href=url;a.download=app.name;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);status.textContent="Saved "+app.name}catch(error){status.textContent="Download failed."}finally{button.disabled=false;button.textContent=label}}
    async function copyCommand(button){const text=document.querySelector("#"+button.dataset.copyCommand).textContent;try{await navigator.clipboard.writeText(text)}catch(error){const area=document.createElement("textarea");area.value=text;area.style.position="fixed";area.style.opacity="0";document.body.appendChild(area);area.select();document.execCommand("copy");area.remove()}button.textContent="Copied";setTimeout(()=>{button.textContent="Copy"},1400)}
    document.querySelectorAll("[data-download-app]").forEach(button=>button.addEventListener("click",()=>downloadApp(button.dataset.downloadApp,button)));
    document.querySelectorAll("[data-copy-command]").forEach(button=>button.addEventListener("click",()=>copyCommand(button)));
  </script>
  <script src="/assets/site-footer.js?v=1"></script>
</body>
</html>`;

function signedHtml(publishableKey) {
  const safeKey = JSON.stringify(publishableKey || "");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#050505">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="apple-mobile-web-app-title" content="LocalTalk">
  <link rel="manifest" href="/talk/manifest.webmanifest">
  <link rel="apple-touch-icon" href="/assets/icon-localtalk.svg">
  <link rel="stylesheet" href="/assets/site-footer.css?v=1">
  <title>Signed Room</title>
  <style>
    :root{color-scheme:light;--bg:#edf2f8;--panel:#fbfcff;--text:#111827;--muted:#667085;--line:#d9e2ef;--accent:#315ec8;--bubble:#e9f0ff;--shadow:0 18px 58px rgba(20,38,70,.15)}
    [data-theme=dark]{color-scheme:dark;--bg:#0e1117;--panel:#171b24;--text:#f4f7fb;--muted:#a2acbc;--line:#2a3344;--accent:#82a7ff;--bubble:#202b42;--shadow:0 18px 70px rgba(0,0,0,.38)}
    *{box-sizing:border-box}body{margin:0;min-height:100vh;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:radial-gradient(circle at 22% 10%,color-mix(in srgb,var(--accent) 18%,transparent),transparent 28rem),var(--bg);color:var(--text);display:grid;place-items:stretch}
    main{width:min(920px,calc(100% - 24px));height:calc(100vh - 24px);margin:12px auto;display:grid;grid-template-rows:auto 1fr auto auto;background:var(--panel);border:1px solid var(--line);border-radius:8px;box-shadow:var(--shadow);overflow:hidden}
    header{padding:18px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;gap:12px}h1{margin:0;font-size:21px}.sub{margin-top:2px;color:var(--muted);font-size:13px}.side{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.status{color:var(--muted);font-size:13px}
    #auth{padding:22px;display:grid;place-items:center;overflow:auto}#room{display:none;min-height:0;grid-template-rows:1fr auto}#messages{padding:18px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}.message{align-self:flex-start;max-width:min(700px,88%);padding:11px 13px;border-radius:8px;background:var(--bubble);border:1px solid color-mix(in srgb,var(--accent) 15%,transparent);overflow-wrap:anywhere;line-height:1.38}.message.new{animation:messageIn .38s cubic-bezier(.16,1,.3,1)}.message pre{max-width:100%;margin:8px 0;padding:10px 12px;border:1px solid var(--line);border-radius:8px;background:#050505;color:#f8f4ea;overflow:auto;white-space:pre;font:13px/1.45 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.message code{font:inherit}.html-frame{display:block;width:min(520px,100%);height:260px;margin:8px 0;border:1px solid var(--line);border-radius:8px;background:#fff}.sender{display:block;margin-bottom:4px;color:var(--accent);font-size:12px;font-weight:800}.time{display:block;margin-top:6px;color:var(--muted);font-size:12px}.file-link{color:var(--accent);font-weight:800;text-decoration:none}.file-link:hover{text-decoration:underline}.quote{margin:0 0 8px;padding:7px 9px;border-left:3px solid var(--accent);border-radius:6px;background:color-mix(in srgb,var(--panel) 70%,transparent);color:var(--muted);font-size:12px}.mini-actions{display:flex;gap:6px;margin-top:8px}.mini-button{height:28px;padding:0 9px;border-radius:7px;font-size:12px;color:var(--text);background:color-mix(in srgb,var(--panel) 76%,transparent);border:1px solid var(--line)}
    form{border-top:1px solid var(--line);padding:12px;display:grid;grid-template-columns:auto 1fr auto;gap:10px}.quote-bar{grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:color-mix(in srgb,var(--bubble) 76%,transparent);color:var(--muted);font-size:13px}.quote-bar[hidden]{display:none}.quote-clear{height:26px;width:26px;padding:0;border-radius:7px;color:var(--text);background:transparent;border:1px solid var(--line)}input,select{min-width:0;height:46px;border:1px solid var(--line);border-radius:8px;padding:0 14px;font:inherit;background:var(--panel);color:var(--text)}button,.button-link,.file-button{height:46px;border:0;border-radius:8px;padding:0 16px;font:inherit;font-weight:750;color:#fff;background:var(--accent);cursor:pointer;text-decoration:none;display:inline-grid;place-items:center}.mini-button{height:28px;padding:0 9px;color:var(--text);background:color-mix(in srgb,var(--panel) 76%,transparent);border:1px solid var(--line);border-radius:7px;font-size:12px}.secondary{height:36px;color:var(--text);background:transparent;border:1px solid var(--line)}.attach-wrap{position:relative}.file-button{width:46px;padding:0;color:var(--text);background:transparent;border:1px solid var(--line);font-size:24px}.attach-menu{position:absolute;left:0;bottom:54px;z-index:10;display:grid;gap:6px;width:220px;padding:8px;border:1px solid var(--line);border-radius:8px;background:var(--panel);box-shadow:0 18px 40px rgba(0,0,0,.22)}.attach-menu[hidden]{display:none}.attach-menu button,.attach-menu label{width:100%;height:38px;justify-content:start;color:var(--text);background:transparent;border:1px solid var(--line);font-size:13px}#file{display:none}.setup{max-width:620px;padding:18px;border:1px solid var(--line);border-radius:8px;background:var(--panel);line-height:1.45}.profile-panel{border-top:1px solid var(--line);padding:10px 12px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;background:color-mix(in srgb,var(--panel) 94%,var(--accent))}.profile-panel strong{font-size:13px;color:var(--muted)}.private-panel{border-top:1px solid var(--line);padding:10px 12px;background:color-mix(in srgb,var(--panel) 88%,var(--accent));display:grid;gap:8px}.private-head{display:grid;grid-template-columns:auto minmax(160px,1fr) auto;align-items:center;gap:8px;color:var(--muted);font-size:13px}.private-list{max-height:120px;overflow:auto;display:grid;gap:6px}.private-msg{display:flex;gap:8px;align-items:flex-start;padding:7px 8px;border:1px solid var(--line);border-radius:8px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:13px}.private-msg.mine{margin-left:24px}.private-msg span{overflow-wrap:anywhere}.private-form{border:0;padding:0;grid-template-columns:1fr auto;background:transparent}
    @keyframes messageIn{from{opacity:0;transform:translateY(18px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}@media(max-width:620px){main{width:100%;height:100vh;margin:0;border:0;border-radius:0}form{grid-template-columns:1fr}.file-button,form button{width:100%}}
  </style>
</head>
<body>
  <main>
    <header>
      <div><h1 id="signed-title">Signed Room</h1><div class="sub" id="signed-sub">sign up / log in required</div></div>
      <div class="side"><a class="button-link secondary" href="/" id="home-link">Home</a><a class="button-link secondary" href="/talk/" id="normal-link">Back</a><button class="secondary" id="notify" type="button">Notify</button><button class="secondary" id="theme" type="button">Dark</button><div id="user"></div><div class="status" id="status">loading...</div></div>
    </header>
    <section id="auth"></section>
    <section id="room"><div id="messages"></div><section class="profile-panel"><strong id="profile-label">My name</strong><input id="profile-name" autocomplete="off" placeholder="Name shown by default" maxlength="80"><button class="secondary" id="profile-save" type="button">Save</button></section><section class="private-panel" id="private-panel"><div class="private-head"><strong id="private-label">Private</strong><select id="private-user"><option value="">choose a user</option></select><button class="mini-button" id="private-clear" type="button">Clear All</button></div><div class="private-list" id="private-list"></div><form class="private-form" id="private-form"><input id="private-text" autocomplete="off" placeholder="Private message" maxlength="1024"><button type="submit" id="private-send">Send</button></form></section><form id="form"><div class="quote-bar" id="quote-bar" hidden><span id="quote-text"></span><button class="quote-clear" id="quote-clear" type="button">x</button></div><div class="attach-wrap"><button class="file-button" id="attach-open" type="button" aria-haspopup="menu" aria-expanded="false">+</button><div class="attach-menu" id="attach-menu" hidden><label id="file-pick-label">File<input id="file" type="file"></label><button id="record-pick" type="button">Game record</button></div></div><input id="text" autocomplete="off" placeholder="Message" maxlength="1024"><button type="submit" id="signed-send">Send</button></form></section>
  </main>
  <script>
    if("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(()=>{});
    const publishableKey=${safeKey};
    const signedDict={en:{title:"Signed Room",sub:"sign up / log in required",home:"Home",normal:"Back",notify:"Notify",notificationsOn:"Notifications On",dark:"Dark",light:"Light",loading:"loading...",online:"online",profile:"My name",namePlaceholder:"Name shown by default",save:"Save",private:"Private",chooseUser:"choose a user",noUsers:"no users yet",clear:"Clear All",privateMsg:"Private message",newMessage:"New message",send:"Send",message:"Message",signedUser:"Signed user",you:"You",file:"File",gameRecord:"Game record",noGameRecords:"No game records yet",shareRecord:"Game record: {game} - {label}",quote:"Quote",name:"Name",downloadFailed:"download failed",notificationsUnavailable:"notifications unavailable",notificationsOnStatus:"notifications on",notificationsBlocked:"notifications blocked",users:"users",local:"local",noUsersStatus:"no users",usersLoadFailed:"users load failed",nameSaveFailed:"name save failed",nameSaved:"name saved",namePrompt:"Name this user for your page only.",notAllowed:"this message is not allowed",banned:"banned",loginNeeded:"login needed",setupNeeded:"setup needed",setupTitle:"Clerk is not set up yet.",setupBody:"Set CLERK_PUBLISHABLE_KEY and CLERK_JWKS_URL in the Worker first.",signedOut:"signed out",sendFailed:"send failed",clearAsk:"Clear all private messages?",clearFailed:"clear failed",privateCleared:"private cleared",uploading:"uploading...",uploadFailed:"upload failed",clerkLoadFailed:"Clerk load failed"},zh:{title:"登录房间",sub:"需要注册或登录",home:"主页",normal:"返回",notify:"通知",notificationsOn:"通知已开启",dark:"深色",light:"浅色",loading:"加载中...",online:"在线",profile:"我的名字",namePlaceholder:"默认显示的名字",save:"保存",private:"私聊",chooseUser:"选择用户",noUsers:"暂无用户",clear:"清空全部",privateMsg:"私聊消息",newMessage:"新消息",send:"发送",message:"消息",signedUser:"登录用户",you:"你",file:"文件",gameRecord:"游戏记录",noGameRecords:"还没有游戏记录",shareRecord:"游戏记录：{game} - {label}",quote:"引用",name:"命名",downloadFailed:"下载失败",notificationsUnavailable:"通知不可用",notificationsOnStatus:"通知已开启",notificationsBlocked:"通知已阻止",users:"用户",local:"本地",noUsersStatus:"暂无用户",usersLoadFailed:"用户加载失败",nameSaveFailed:"名字保存失败",nameSaved:"名字已保存",namePrompt:"只在你的页面给这个用户命名。",notAllowed:"这条消息不允许发送",banned:"已封禁",loginNeeded:"需要登录",setupNeeded:"需要设置",setupTitle:"Clerk 还没有设置。",setupBody:"请先在 Worker 里设置 CLERK_PUBLISHABLE_KEY 和 CLERK_JWKS_URL。",signedOut:"已登出",sendFailed:"发送失败",clearAsk:"清空所有私聊消息？",clearFailed:"清空失败",privateCleared:"私聊已清空",uploading:"上传中...",uploadFailed:"上传失败",clerkLoadFailed:"Clerk 加载失败"}};
    const root=document.documentElement;root.dataset.theme=localStorage.getItem("signed-theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
    ["ja","ko","es","fr","de","pt","ru","ar"].forEach(code=>{signedDict[code]=signedDict.en});
    const lang=signedDict[localStorage.getItem("muye-lang")]?localStorage.getItem("muye-lang"):(localStorage.getItem("localtalk-lang")==="zh"?"zh":"en");
    const status=document.querySelector("#status"),auth=document.querySelector("#auth"),room=document.querySelector("#room"),messages=document.querySelector("#messages"),form=document.querySelector("#form"),input=document.querySelector("#text"),file=document.querySelector("#file"),theme=document.querySelector("#theme"),notify=document.querySelector("#notify"),user=document.querySelector("#user"),quoteBar=document.querySelector("#quote-bar"),quoteText=document.querySelector("#quote-text"),quoteClear=document.querySelector("#quote-clear"),profileName=document.querySelector("#profile-name"),profileSave=document.querySelector("#profile-save"),privateUser=document.querySelector("#private-user"),privateList=document.querySelector("#private-list"),privateForm=document.querySelector("#private-form"),privateText=document.querySelector("#private-text"),privateClear=document.querySelector("#private-clear"),attachOpen=document.querySelector("#attach-open"),attachMenu=document.querySelector("#attach-menu"),filePickLabel=document.querySelector("#file-pick-label"),recordPick=document.querySelector("#record-pick");
    let currentMessages=[];let quote=null;let privateTarget=null;let privateSeen=new Set();let privateReady=false;let myProfile={name:"",email:""};let uploadBusy=false;let sendBusy=false;let filePickUntil=0;
    function t(k){return signedDict[lang][k]||signedDict.en[k]||k}
    function api(path){return "/api/talk"+path}
    function syncSignedText(){document.querySelector("#signed-title").textContent=t("title");document.querySelector("#signed-sub").textContent=t("sub");document.querySelector("#home-link").textContent=t("home");document.querySelector("#normal-link").textContent=t("normal");document.querySelector("#profile-label").textContent=t("profile");document.querySelector("#private-label").textContent=t("private");profileName.placeholder=t("namePlaceholder");profileSave.textContent=t("save");privateClear.textContent=t("clear");privateText.placeholder=t("privateMsg");document.querySelector("#private-send").textContent=t("send");input.placeholder=t("message");document.querySelector("#signed-send").textContent=t("send");filePickLabel.childNodes[0].nodeValue=t("file");recordPick.textContent=t("gameRecord");theme.textContent=root.dataset.theme==="dark"?t("light"):t("dark");syncNotify()}
    theme.textContent=root.dataset.theme==="dark"?t("light"):t("dark");theme.onclick=()=>{root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";localStorage.setItem("signed-theme",root.dataset.theme);theme.textContent=root.dataset.theme==="dark"?t("light"):t("dark")};
    function clerkDomain(){try{return atob(publishableKey.split("_")[2]).slice(0,-1)}catch{return ""}}
    function displayText(value){return String(value||"").replace(/(?:\\\\b|\u0008)[\s\S]*/g,"").replace(/\\\\n/g,"\\n").replace(/\\\\\\\\/g,"\\\\")}
    function linkHref(value){return value.startsWith("https://")?value:"https://"+value}
    function appendLinkedText(node,value){const text=displayText(value);const re=/((?:https:\\/\\/|localtalk\\.muye\\.dev\\/)[^\\s<>"'\\\\]+)/g;let last=0;for(const match of text.matchAll(re)){if(match.index>last)node.append(document.createTextNode(text.slice(last,match.index)));const a=document.createElement("a");a.className="file-link";a.href=linkHref(match[0]);a.target="_blank";a.rel="noopener noreferrer";a.textContent=match[0];node.appendChild(a);last=match.index+match[0].length}if(last<text.length)node.append(document.createTextNode(text.slice(last)))}
    function appendRichText(node,value){const text=displayText(value);const parts=text.split("\`\`\`");for(let i=0;i<parts.length;i++){if(!parts[i])continue;if(i%2){let block=parts[i].replace(/^\\n/,"").replace(/\\n$/,"");const isHtml=/^html\\s/i.test(block)||/^<!doctype html/i.test(block)||/^<html[\\s>]/i.test(block);if(isHtml){block=block.replace(/^html\\s*/i,"");const frame=document.createElement("iframe");frame.className="html-frame";frame.sandbox="";frame.referrerPolicy="no-referrer";frame.srcdoc=block;node.appendChild(frame)}else{const pre=document.createElement("pre");const code=document.createElement("code");code.textContent=block;pre.appendChild(code);node.appendChild(pre)}}else appendLinkedText(node,parts[i])}}
    function authEmail(){const u=Clerk.user;return (u&&u.primaryEmailAddress&&u.primaryEmailAddress.emailAddress)||""}
    function authName(){const u=Clerk.user;return (u&&((u.fullName)||(u.username)||(u.primaryEmailAddress&&u.primaryEmailAddress.emailAddress)))||t("signedUser")}
    function displayName(){return myProfile.name||authName()}
    async function token(){return Clerk.session ? Clerk.session.getToken() : ""}
    async function downloadFile(message){const r=await fetch(api("/file/"+encodeURIComponent(message.id)),{headers:{Authorization:"Bearer "+await token()}});if(!r.ok){status.textContent=t("downloadFailed");return}const blob=await r.blob();const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=message.name||"file";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url)}
    function detailLabel(message){const parts=[];if(message.selfName)parts.push(message.selfName);if(message.email)parts.push(message.email);return parts.length?"("+parts.join(", ")+")":""}
    function senderLabel(message){return message.userId===Clerk.user.id?t("you")+detailLabel(message):(message.displayName||t("signedUser"))+detailLabel(message)}
    function syncNotify(){notify.textContent=("Notification" in window&&Notification.permission==="granted")?t("notificationsOn"):t("notify")}
    async function enableNotifications(){if(!("Notification" in window)){status.textContent=t("notificationsUnavailable");return}const value=Notification.permission==="default"?await Notification.requestPermission():Notification.permission;syncNotify();status.textContent=value==="granted"?t("notificationsOnStatus"):t("notificationsBlocked")}
    function showPrivateNotification(msg){if(!("Notification" in window)||Notification.permission!=="granted")return;const title=t("privateMsg")+" - "+(msg.fromName||t("signedUser"));const body=displayText(msg.text).slice(0,120);const note=new Notification(title,{body,tag:"localtalk-private-"+msg.id});note.onclick=()=>{window.focus();note.close()}}
    function askNotificationsOnce(){if(!("Notification" in window)||Notification.permission!=="default")return;Notification.requestPermission().then(syncNotify).catch(()=>{})}
    function showMessageNotification(message){if(!("Notification" in window)||Notification.permission!=="granted")return;if(window.Clerk&&Clerk.user&&message.userId===Clerk.user.id)return;const body=message.kind==="file"?t("file")+": "+(message.name||"file"):displayText(message.text).slice(0,120);const note=new Notification(t("newMessage")+" - "+senderLabel(message),{body,tag:"localtalk-signed-message-"+message.id});note.onclick=()=>{window.focus();note.close()}}
    function setQuote(message){quote={quoteName:senderLabel(message),quoteText:message.kind==="file"?t("file")+": "+(message.name||"file"):displayText(message.text).slice(0,180)};quoteText.textContent=quote.quoteName+": "+quote.quoteText;quoteBar.hidden=false;input.focus()}
    function clearQuote(){quote=null;quoteText.textContent="";quoteBar.hidden=true}
    function formatText(template,data){return Object.entries(data).reduce((text,[key,value])=>text.replace("{"+key+"}",value),template)}
    function localGameRecordKeys(){return Object.keys(localStorage).filter(key=>key.startsWith("muye-game-records:"))}
    function localGameRecords(){return localGameRecordKeys().flatMap(key=>{try{return JSON.parse(localStorage.getItem(key)||"[]")}catch{return[]}}).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0))}
    function closeAttachMenu(){attachMenu.hidden=true;attachOpen.setAttribute("aria-expanded","false")}
    function chooseGameRecord(){const records=localGameRecords();if(!records.length){status.textContent=t("noGameRecords");closeAttachMenu();return}const choices=records.slice(0,10).map((record,index)=>String(index+1)+". "+(record.gameTitle||record.gameId)+": "+(record.label||record.value)).join("\\n");const picked=Number(prompt(t("gameRecord")+"\\n"+choices,"1"))-1;const record=records[picked];if(!record)return;input.value=formatText(t("shareRecord"),{game:record.gameTitle||record.gameId,label:record.label||record.value});closeAttachMenu();input.focus()}
    function setPrivateTarget(id,name,focus=false){privateTarget=id?{id,name:name||t("signedUser")}:null;if(focus)privateText.focus()}
    function renderPrivateUsers(users){const selected=privateTarget?.id||privateUser.value;privateUser.textContent="";const empty=document.createElement("option");empty.value="";empty.textContent=users.length?t("chooseUser"):t("noUsers");privateUser.appendChild(empty);for(const item of users){const option=document.createElement("option");option.value=item.userId;option.textContent=item.label;privateUser.appendChild(option)}privateUser.value=[...privateUser.options].some(option=>option.value===selected)?selected:"";if(privateUser.value){const option=privateUser.selectedOptions[0];setPrivateTarget(option.value,option.textContent)}else privateTarget=null}
    function renderPrivate(list){privateList.textContent="";for(const msg of list){const row=document.createElement("div");row.className="private-msg"+(msg.mine?" mine":"");const text=document.createElement("span");text.style.whiteSpace="pre-wrap";text.textContent=(msg.mine?t("you"):msg.fromName)+" -> "+(msg.mine?msg.toName:t("you"))+": "+displayText(msg.text)+" · "+(msg.time||"");row.append(text);privateList.appendChild(row)}privateList.scrollTop=privateList.scrollHeight}
    function applyPrivate(list){for(const msg of list){const id=String(msg.id);if(privateReady&&!privateSeen.has(id)&&!msg.mine)showPrivateNotification(msg);privateSeen.add(id)}privateReady=true;renderPrivate(list)}
    async function loadPrivate(){const r=await fetch(api("/private/history"),{headers:{Authorization:"Bearer "+await token()},cache:"no-store"});if(r.ok)applyPrivate(await r.json())}
    async function loadPrivateUsers(){const r=await fetch(api("/users"),{headers:{Authorization:"Bearer "+await token()},cache:"no-store"});if(r.ok){const payload=await r.json();const users=Array.isArray(payload)?payload:(payload.users||[]);renderPrivateUsers(users);const source=(payload.source==="local"||!payload.source)?t("local"):payload.source;const text=users.length?t("users")+": "+source+" "+users.length:source+": "+t("noUsersStatus");status.textContent=text;return text}status.textContent=t("usersLoadFailed");return t("usersLoadFailed")}
    async function loadProfile(){const r=await fetch(api("/profile"),{headers:{Authorization:"Bearer "+await token()},cache:"no-store"});if(!r.ok)return;myProfile=await r.json();profileName.value=myProfile.name||""}
    async function saveProfile(){const name=profileName.value.trim();const r=await fetch(api("/profile"),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+await token()},body:JSON.stringify({name,email:authEmail()})});if(!r.ok){status.textContent=t("nameSaveFailed");return}await loadProfile();await loadHistory();status.textContent=t("nameSaved")}
    async function nameSignedUser(message){if(message.userId===Clerk.user.id)return;const value=prompt(t("namePrompt"),message.aliasName||"");if(value===null)return;const r=await fetch(api("/alias"),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+await token()},body:JSON.stringify({targetId:message.userId,name:value})});if(!r.ok){status.textContent=t("nameSaveFailed");return}await loadHistory();status.textContent=t("nameSaved")}
    function makeMessageEl(message,animate=false){const item=document.createElement("article");item.className="message"+(animate?" new":"");item.dataset.id=message.id;const sender=document.createElement("span");sender.className="sender";sender.textContent=senderLabel(message);item.appendChild(sender);if(message.quoteText){const q=document.createElement("div");q.className="quote";q.textContent=(message.quoteName||t("signedUser"))+": "+message.quoteText;item.appendChild(q)}if(message.kind==="file"){const link=document.createElement("a");link.className="file-link";link.href="#";link.textContent=message.name||"file";link.addEventListener("click",event=>{event.preventDefault();downloadFile(message)});item.append(t("file")+": ",link)}else{const p=document.createElement("p");p.style.margin="0";p.style.whiteSpace="pre-wrap";appendRichText(p,message.text);item.appendChild(p)}const time=document.createElement("span");time.className="time";time.textContent=message.time||"";item.appendChild(time);const actions=document.createElement("div");actions.className="mini-actions";const quoteButton=document.createElement("button");quoteButton.className="mini-button";quoteButton.type="button";quoteButton.textContent=t("quote");quoteButton.onclick=()=>setQuote(message);actions.appendChild(quoteButton);if(message.userId!==Clerk.user.id){const nameButton=document.createElement("button");nameButton.className="mini-button";nameButton.type="button";nameButton.textContent=t("name");nameButton.onclick=()=>nameSignedUser(message);actions.appendChild(nameButton)}item.appendChild(actions);return item}
    function render(list){currentMessages=list;messages.textContent="";for(const msg of list)messages.appendChild(makeMessageEl(msg,false));messages.scrollTop=messages.scrollHeight}
    function apply(list){if(!currentMessages.length){render(list);return}const known=new Set(currentMessages.map(msg=>String(msg.id)));const fresh=list.filter(msg=>!known.has(String(msg.id)));currentMessages=list;if(!fresh.length)return;for(const msg of fresh){messages.appendChild(makeMessageEl(msg,true));showMessageNotification(msg)}messages.scrollTo({top:messages.scrollHeight,behavior:"smooth"})}
    async function forbiddenText(r){const data=await r.clone().json().catch(()=>({}));return data.error==="not_allowed"?t("notAllowed"):t("banned")}
    async function loadHistory(){const sessionToken=await token();const r=await fetch(api("/history"),{headers:{Authorization:"Bearer "+sessionToken},cache:"no-store"});if(r.status===403){status.textContent=t("banned");form.style.display="none";privateForm.style.display="none";return}if(!r.ok){const data=await r.clone().json().catch(()=>({}));status.textContent=window.Clerk&&Clerk.isSignedIn?("auth "+r.status+" "+(data.reason||data.error||"failed")):t("loginNeeded");return}form.style.display="grid";privateForm.style.display="grid";apply(await r.json());const userStatus=await loadPrivateUsers();await loadPrivate();status.textContent=userStatus||t("online")}
    function loadScript(src,attrs={}){return new Promise((resolve,reject)=>{const s=document.createElement("script");s.src=src;s.defer=true;s.crossOrigin="anonymous";for(const [key,value] of Object.entries(attrs))s.setAttribute(key,value);s.onload=resolve;s.onerror=()=>reject(new Error("script: "+src));document.head.appendChild(s)})}
    async function boot(){syncSignedText();if(!publishableKey){auth.innerHTML='<div class="setup"><strong>'+t("setupTitle")+'</strong><br>'+t("setupBody")+'</div>';status.textContent=t("setupNeeded");return}const domain=clerkDomain();await loadScript("https://"+domain+"/npm/@clerk/ui@1/dist/ui.browser.js");await loadScript("https://"+domain+"/npm/@clerk/clerk-js@6/dist/clerk.browser.js",{"data-clerk-publishable-key":publishableKey});await Clerk.load({ui:{ClerkUI:window.__internal_ClerkUICtor}});const returnUrl=location.pathname;if(!Clerk.isSignedIn){room.style.display="none";auth.style.display="grid";auth.innerHTML='<div id="sign-in"></div>';Clerk.mountSignIn(document.querySelector("#sign-in"),{forceRedirectUrl:returnUrl,signUpForceRedirectUrl:returnUrl});status.textContent=t("signedOut");return}if(returnUrl==="/talk/signed/secret"||returnUrl==="/talk/signed/secret/"){const access=await fetch("/api/secret?status=1",{headers:{Authorization:"Bearer "+await token()},cache:"no-store"});const result=await access.json().catch(()=>({}));if(!access.ok||!result.solved){location.replace("/secret/");return}}auth.style.display="none";room.style.display="grid";status.textContent=t("online");Clerk.mountUserButton(user);await loadProfile().catch(()=>{});if(!profileName.value.trim())profileName.value=authName();await loadHistory().catch(()=>{status.textContent=t("online")})}
    quoteClear.addEventListener("click",clearQuote);
    notify.addEventListener("click",enableNotifications);
    window.addEventListener("pointerdown",askNotificationsOnce,{once:true});
    window.addEventListener("keydown",askNotificationsOnce,{once:true});
    profileSave.addEventListener("click",saveProfile);
    privateUser.addEventListener("change",()=>{const option=privateUser.selectedOptions[0];setPrivateTarget(privateUser.value,option?option.textContent:"",true)});
    attachOpen.addEventListener("click",()=>{const open=attachMenu.hidden;attachMenu.hidden=!open;attachOpen.setAttribute("aria-expanded",open?"true":"false")});
    recordPick.addEventListener("click",chooseGameRecord);
    document.addEventListener("click",event=>{if(!event.target.closest(".attach-wrap"))closeAttachMenu()});
    filePickLabel.addEventListener("pointerdown",()=>{filePickUntil=Date.now()+4000});
    file.addEventListener("click",event=>{event.stopPropagation();filePickUntil=Date.now()+4000});
    form.addEventListener("submit",async e=>{e.preventDefault();if(sendBusy||uploadBusy||Date.now()<filePickUntil)return;const text=input.value.trim();if(!text)return;sendBusy=true;input.value="";try{const r=await fetch(api("/send"),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+await token()},body:JSON.stringify({text,displayName:displayName(),email:authEmail(),quoteText:quote?.quoteText||"",quoteName:quote?.quoteName||""})});if(r.status===403){status.textContent=await forbiddenText(r);return}if(!r.ok){const data=await r.clone().json().catch(()=>({}));status.textContent=t("sendFailed")+": "+(data.error||r.status);input.value=text;return}clearQuote();await loadHistory();input.focus()}finally{sendBusy=false}});
    privateForm.addEventListener("submit",async e=>{e.preventDefault();const text=privateText.value.trim();if(!text||!privateTarget)return;privateText.value="";const r=await fetch(api("/private/send"),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+await token()},body:JSON.stringify({toId:privateTarget.id,toName:privateTarget.name,text,displayName:displayName(),email:authEmail()})});if(r.status===403){status.textContent=await forbiddenText(r);return}if(!r.ok){status.textContent=t("sendFailed");return}await loadPrivate();privateText.focus()});
    privateClear.addEventListener("click",async()=>{if(!confirm(t("clearAsk")))return;const r=await fetch(api("/private/clear"),{method:"POST",headers:{Authorization:"Bearer "+await token()}});if(r.status===403){status.textContent=t("banned");return}if(!r.ok){status.textContent=t("clearFailed");return}privateSeen=new Set();privateReady=false;await loadPrivate();status.textContent=t("privateCleared")});
    file.addEventListener("change",async()=>{filePickUntil=Date.now()+4000;if(uploadBusy)return;const f=file.files[0];if(!f)return;uploadBusy=true;input.value="";status.textContent=t("uploading");const reader=new FileReader();reader.onload=async()=>{try{const r=await fetch(api("/upload"),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+await token()},body:JSON.stringify({name:f.name,mime:f.type||"application/octet-stream",dataUrl:reader.result,displayName:displayName(),email:authEmail(),quoteText:quote?.quoteText||"",quoteName:quote?.quoteName||""})});file.value="";if(r.status===403){status.textContent=await forbiddenText(r);return}if(!r.ok){status.textContent=t("uploadFailed");return}clearQuote();await loadHistory()}finally{uploadBusy=false;filePickUntil=Date.now()+1200}};reader.onerror=()=>{uploadBusy=false;filePickUntil=Date.now()+1200;file.value="";status.textContent=t("uploadFailed")};reader.readAsDataURL(f)});
    syncSignedText();setInterval(()=>{if(window.Clerk&&Clerk.isSignedIn)loadPrivate().catch(()=>{})},4000);setInterval(()=>{if(window.Clerk&&Clerk.isSignedIn)loadHistory().catch(()=>{})},3000);boot().catch(error=>{console.error(error);status.textContent=String(error&&error.message||t("clerkLoadFailed")).slice(0,120)});
  </script>
  <script src="/assets/site-footer.js?v=1"></script>
</body>
</html>`;
}

function json(data, init = {}) {
  return Response.json(data, { headers: { "Cache-Control": "no-store", ...init.headers }, status: init.status || 200 });
}

function notAllowed() {
  return json({ ok: false, error: "not_allowed" }, { status: 403 });
}

function forbidden(reason = "banned") {
  return json({ ok: false, error: reason }, { status: 403 });
}

function makeTime(timeZone = "Asia/Shanghai") {
  return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone });
}

function dataUrlParts(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;,]+)?;base64,(.+)$/);
  if (!match) return null;
  return { mime: match[1] || "application/octet-stream", base64: match[2] };
}

function bytesFromBase64(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function ensureTables(sql) {
  await sql`
    create table if not exists localtalk_messages (
      id bigserial primary key,
      text text,
      time_text text not null,
      created_at timestamptz not null default now()
    )
  `;
  await sql`alter table localtalk_messages add column if not exists kind text not null default 'text'`;
  await sql`alter table localtalk_messages add column if not exists name text`;
  await sql`alter table localtalk_messages add column if not exists mime text`;
  await sql`alter table localtalk_messages add column if not exists file_data text`;
  await sql`alter table localtalk_messages add column if not exists device_id text`;
  await sql`alter table localtalk_messages add column if not exists is_admin boolean not null default false`;
  await sql`alter table localtalk_messages add column if not exists ip text`;
  await sql`alter table localtalk_messages add column if not exists quote_text text`;
  await sql`alter table localtalk_messages add column if not exists quote_name text`;
  await sql`alter table localtalk_messages add column if not exists room text not null default ''`;
  await sql`alter table localtalk_messages add column if not exists is_master boolean not null default false`;
  await sql`
    create table if not exists localtalk_rooms (
      room text primary key,
      creator_ip text not null,
      is_admin boolean not null default false,
      created_at timestamptz not null default now()
    )
  `;
  await sql`alter table localtalk_rooms add column if not exists is_encrypted boolean not null default false`;
  await sql`alter table localtalk_rooms add column if not exists encryption_salt text`;
  await sql`alter table localtalk_rooms add column if not exists password_verifier text`;
  await sql`
    create table if not exists localtalk_bans (
      device_id text primary key,
      created_at timestamptz not null default now()
    )
  `;
  await sql`alter table localtalk_bans add column if not exists reason text not null default 'manual'`;
  await sql`
    create table if not exists localtalk_ip_bans (
      ip text primary key,
      created_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists localtalk_text_bans (
      text text primary key,
      created_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists localtalk_device_upload_rate (
      device_id text primary key,
      window_start timestamptz not null default now(),
      count integer not null default 0
    )
  `;
  await sql`
    create table if not exists localtalk_device_message_rate (
      device_id text primary key,
      window_start timestamptz not null default now(),
      count integer not null default 0
    )
  `;
  await sql`
    create table if not exists localtalk_signed_messages (
      id bigserial primary key,
      clerk_user_id text not null,
      display_name text not null,
      text text,
      time_text text not null,
      created_at timestamptz not null default now(),
      kind text not null default 'text',
      name text,
      mime text,
      file_data text,
      ip text
    )
  `;
  await sql`alter table localtalk_signed_messages add column if not exists quote_text text`;
  await sql`alter table localtalk_signed_messages add column if not exists quote_name text`;
  await sql`alter table localtalk_signed_messages add column if not exists email text`;
  await sql`alter table localtalk_signed_messages add column if not exists room text not null default ''`;
  await sql`
    create table if not exists localtalk_signed_bans (
      clerk_user_id text primary key,
      display_name text,
      created_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists localtalk_private_messages (
      id bigserial primary key,
      room text not null,
      from_id text not null,
      from_name text not null,
      to_id text not null,
      to_name text not null,
      text text not null,
      time_text text not null,
      created_at timestamptz not null default now()
    )
  `;
  await sql`alter table localtalk_private_messages add column if not exists room text not null default 'signed'`;
  await sql`
    create table if not exists localtalk_signed_profiles (
      clerk_user_id text primary key,
      self_name text,
      email text,
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists localtalk_signed_aliases (
      owner_user_id text not null,
      target_user_id text not null,
      alias_name text not null,
      updated_at timestamptz not null default now(),
      primary key (owner_user_id, target_user_id)
    )
  `;
  await sql`
    create table if not exists muye_game_records (
      game_id text not null,
      user_id text not null,
      display_name text,
      metric text not null,
      value integer not null,
      higher_is_better boolean not null default true,
      label text,
      updated_at timestamptz not null default now(),
      primary key (game_id, user_id, metric)
    )
  `;
  await sql`
    create table if not exists localtalk_settings (
      key text primary key,
      value text not null,
      updated_at timestamptz not null default now()
    )
  `;
	  await sql`
	    create table if not exists localtalk_text_allows (
	      text text primary key,
	      created_at timestamptz not null default now()
	    )
	  `;
	  await sql`
	    create table if not exists localtalk_room_device_bans (
	      room text not null,
	      device_id text not null,
	      created_at timestamptz not null default now(),
	      primary key (room, device_id)
	    )
	  `;
	  await sql`
	    create table if not exists localtalk_room_text_bans (
	      room text not null,
	      text text not null,
	      created_at timestamptz not null default now(),
	      primary key (room, text)
	    )
	  `;
  await sql`
    insert into localtalk_signed_profiles (clerk_user_id, self_name, email, updated_at)
    select distinct on (clerk_user_id) clerk_user_id, display_name, email, created_at
    from localtalk_signed_messages
    order by clerk_user_id, created_at desc
    on conflict (clerk_user_id) do nothing
  `;
  await sql`
    create table if not exists localtalk_names (
      device_id text primary key,
      display_name text not null,
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists localtalk_ip_names (
      ip text primary key,
      display_name text not null,
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    insert into localtalk_ip_names (ip, display_name, updated_at)
    select distinct on (m.ip) m.ip, n.display_name, n.updated_at
    from localtalk_names n
    join localtalk_messages m on m.device_id = n.device_id
    where m.ip is not null and m.ip <> ''
    order by m.ip, n.updated_at desc
    on conflict (ip) do nothing
  `;
}

function ensureSetup(sql) {
  if (!setupPromise) setupPromise = ensureTables(sql);
  return setupPromise;
}

async function isBanned(sql, deviceId) {
  if (!deviceId) return false;
  const rows = await sql`select device_id from localtalk_bans where device_id = ${deviceId} limit 1`;
  return rows.length > 0;
}

async function isRoomDeviceBanned(sql, room, deviceId) {
  const clean = cleanRoom(room);
  if (!deviceId) return false;
  const rows = await sql`select device_id from localtalk_room_device_bans where room = ${clean} and device_id = ${deviceId} limit 1`;
  return rows.length > 0;
}

async function publicBanReason(sql, room, deviceId, ip) {
  if (await isBanned(sql, deviceId)) return "device_banned";
  if (await isRoomDeviceBanned(sql, room, deviceId)) return "room_device_banned";
  if (await isIpBanned(sql, ip)) return ip.includes(":") ? "ipv6_banned" : "ip_banned";
  return "";
}

async function isIpBanned(sql, ip) {
  if (!ip) return false;
  if (ip.includes(":") && await isIpv6Banned(sql)) return true;
  const rows = await sql`select ip from localtalk_ip_bans where ${ip} like ip || '%' limit 1`;
  return rows.length > 0;
}

async function hasBannedText(sql, value) {
  let text = cleanText(value).toLocaleLowerCase("en-US");
  if (!text) return false;
  const [allowRows, banRows] = await Promise.all([
    sql`select text from localtalk_text_allows`,
    sql`select text from localtalk_text_bans`,
  ]);
  const allowed = allowRows
    .map((row) => cleanText(row.text).toLocaleLowerCase("en-US"))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  let compact = text.replace(/\s+/g, "");
  for (const word of allowed) {
    text = text.split(word).join("");
    const compactWord = word.replace(/\s+/g, "");
    if (compactWord) compact = compact.split(compactWord).join("");
  }
  for (const row of banRows) {
    const banned = cleanText(row.text).toLocaleLowerCase("en-US");
    if (!banned) continue;
    if (text.includes(banned)) return true;
    const compactBanned = banned.replace(/\s+/g, "");
    if (compactBanned && compact.includes(compactBanned)) return true;
  }
  return false;
}

async function hasRoomBannedText(sql, room, value) {
  const clean = cleanRoom(room);
  let text = cleanText(value).toLocaleLowerCase("en-US");
  if (!text) return false;
  const rows = await sql`select text from localtalk_room_text_bans where room = ${clean}`;
  const compact = text.replace(/\s+/g, "");
  for (const row of rows) {
    const banned = cleanText(row.text).toLocaleLowerCase("en-US");
    if (!banned) continue;
    if (text.includes(banned)) return true;
    const compactBanned = banned.replace(/\s+/g, "");
    if (compactBanned && compact.includes(compactBanned)) return true;
  }
  return false;
}

async function hasBannedAnyText(sql, ...values) {
  for (const value of values) {
    if (await hasBannedText(sql, value)) return true;
  }
  return false;
}

async function hasRoomBannedAnyText(sql, room, ...values) {
  for (const value of values) {
    if (await hasRoomBannedText(sql, room, value)) return true;
  }
  return false;
}

async function isSignedBanned(sql, userId) {
  if (!userId) return false;
  const rows = await sql`select clerk_user_id from localtalk_signed_bans where clerk_user_id = ${userId} limit 1`;
  return rows.length > 0;
}

async function isIpv6Banned(sql) {
  const rows = await sql`select value from localtalk_settings where key = 'ipv6_banned' limit 1`;
  return rows[0]?.value === "1";
}

async function isFastSpamMasterEnabled(sql) {
  const rows = await sql`select value from localtalk_settings where key = 'fast_spam_master' limit 1`;
  return rows[0]?.value !== "0";
}

async function isRoomFastSpamEnabled(sql, room) {
  const key = `fast_spam_room:${cleanRoom(room)}`;
  const rows = await sql`select value from localtalk_settings where key = ${key} limit 1`;
  return rows[0]?.value !== "0";
}

async function roomFastSpamSettings(sql) {
  const rows = await sql`select key, value from localtalk_settings where key like 'fast_spam_room:%'`;
  const settings = {};
  for (const row of rows) settings[row.key.slice("fast_spam_room:".length)] = row.value !== "0";
  return settings;
}

async function checkUploadSpamAndAutoBan(sql, deviceId) {
  if (!deviceId || deviceId === "admin") return false;
  const rows = await sql`
    insert into localtalk_device_upload_rate (device_id, window_start, count)
    values (${deviceId}, now(), 1)
    on conflict (device_id) do update set
      window_start = case when localtalk_device_upload_rate.window_start < now() - interval '1 second' then now() else localtalk_device_upload_rate.window_start end,
      count = case when localtalk_device_upload_rate.window_start < now() - interval '1 second' then 1 else localtalk_device_upload_rate.count + 1 end
    returning count
  `;
  if ((Number(rows[0]?.count) || 0) <= 3) return false;
  await sql`
    insert into localtalk_bans (device_id, reason)
    values (${deviceId}, 'auto_upload_spam')
    on conflict (device_id) do update set reason = 'auto_upload_spam'
  `;
  return true;
}

async function checkMessageSpamAndAutoBan(sql, deviceId) {
  if (!deviceId || deviceId === "admin") return false;
  const rows = await sql`
    insert into localtalk_device_message_rate (device_id, window_start, count)
    values (${deviceId}, now(), 1)
    on conflict (device_id) do update set
      window_start = case when localtalk_device_message_rate.window_start < now() - interval '5 seconds' then now() else localtalk_device_message_rate.window_start end,
      count = case when localtalk_device_message_rate.window_start < now() - interval '5 seconds' then 1 else localtalk_device_message_rate.count + 1 end
    returning count
  `;
  if ((Number(rows[0]?.count) || 0) < 7) return false;
  await sql`
    insert into localtalk_bans (device_id, reason)
    values (${deviceId}, 'auto_message_spam')
    on conflict (device_id) do update set reason = 'auto_message_spam'
  `;
  return true;
}

function clientIp(request) {
  return String(request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "").split(",")[0].trim().slice(0, 80);
}

function clientTimeZone() {
  return "Asia/Shanghai";
}

function cleanRoom(value) {
  const room = String(value || "").trim().toLowerCase();
  return /^[a-z0-9_-]{1,40}$/.test(room) ? room : "";
}

function signedPrivateRoom(room = "") {
  const clean = cleanRoom(room);
  return clean ? `signed:${clean}` : "signed";
}

function publicRoomPath(pathname) {
  const match = String(pathname || "").match(/^\/([a-zA-Z0-9_-]{1,40})(?:\/(history|room-state|encrypt-room|file\/\d+|send|upload|sender-key|name-sender))?\/?$/);
  if (!match) return null;
  if (["admin", "signed", "download", "history", "room-state", "encrypt-room", "file", "send", "upload", "sender-key", "name-sender", "export"].includes(match[1].toLowerCase())) return null;
  return { room: cleanRoom(match[1]), action: match[2] ? "/" + match[2] : "/" };
}

function signedRoomPath(pathname) {
  const parts = String(pathname || "").replace(/^\/+|\/+$/g, "").split("/");
  if (parts[0] !== "signed") return null;
  if (parts.length === 1) return { room: "", action: "/" };
  const actions = new Set(["history", "users", "send", "upload", "profile", "alias", "game-records"]);
  if (parts[1] === "api") {
    if (parts.length === 2) return { room: "", action: "/" };
    if (actions.has(parts[2])) return parts.length === 3 ? { room: "", action: "/" + parts[2] } : null;
    if (parts[2] === "file" && /^\d+$/.test(parts[3] || "")) return parts.length === 4 ? { room: "", action: `/file/${parts[3]}` } : null;
    if (parts[2] === "private" && ["history", "send", "clear"].includes(parts[3] || "")) return parts.length === 4 ? { room: "", action: `/private/${parts[3]}` } : null;
    return null;
  }
  if (actions.has(parts[1])) return parts.length === 2 ? { room: "", action: "/" + parts[1] } : null;
  if (parts[1] === "file" && /^\d+$/.test(parts[2] || "")) return parts.length === 3 ? { room: "", action: `/file/${parts[2]}` } : null;
  if (parts[1] === "private" && ["history", "send", "clear"].includes(parts[2] || "")) return parts.length === 3 ? { room: "", action: `/private/${parts[2]}` } : null;
  const room = cleanRoom(parts[1]);
  if (!room) return null;
  if (parts.length === 2) return { room, action: "/" };
  if (parts[2] === "api") {
    if (parts.length === 3) return { room, action: "/" };
    if (actions.has(parts[3])) return parts.length === 4 ? { room, action: "/" + parts[3] } : null;
    if (parts[3] === "file" && /^\d+$/.test(parts[4] || "")) return parts.length === 5 ? { room, action: `/file/${parts[4]}` } : null;
    if (parts[3] === "private" && ["history", "send", "clear"].includes(parts[4] || "")) return parts.length === 5 ? { room, action: `/private/${parts[4]}` } : null;
    return null;
  }
  if (actions.has(parts[2])) return parts.length === 3 ? { room, action: "/" + parts[2] } : null;
  if (parts[2] === "file" && /^\d+$/.test(parts[3] || "")) return parts.length === 4 ? { room, action: `/file/${parts[3]}` } : null;
  if (parts[2] === "private" && ["history", "send", "clear"].includes(parts[3] || "")) return parts.length === 4 ? { room, action: `/private/${parts[3]}` } : null;
  return null;
}

export async function ensureRoomAccess(sql, room, ip, isAdmin = false) {
  const clean = cleanRoom(room);
  if (!clean) return true;
  const existing = await sql`select room from localtalk_rooms where room = ${clean} limit 1`;
  if (existing.length) return true;
  await sql`
    insert into localtalk_rooms (room, creator_ip, is_admin)
    values (${clean}, ${ip || ""}, ${isAdmin})
    on conflict (room) do nothing
  `;
  return true;
}

async function encryptedRoomState(sql, room) {
  const clean = cleanRoom(room);
  if (!clean) return { encrypted: false, encryptionSalt: "", passwordVerifier: "", messageCount: 0 };
  const rows = await sql`
    select r.is_encrypted, r.encryption_salt, r.password_verifier, count(m.id)::int as message_count
    from localtalk_rooms r
    left join localtalk_messages m on m.room = r.room and m.is_master = false
    where r.room = ${clean}
    group by r.room, r.is_encrypted, r.encryption_salt, r.password_verifier
    limit 1
  `;
  return {
    encrypted: Boolean(rows[0]?.is_encrypted),
    encryptionSalt: rows[0]?.encryption_salt || "",
    passwordVerifier: rows[0]?.password_verifier || "",
    messageCount: Number(rows[0]?.message_count) || 0,
  };
}

export function validEncryptedPayload(value) {
  return /^e2ee:v1:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+$/.test(String(value || ""));
}

export async function enableRoomEncryption(sql, room, salt, passwordVerifier) {
  const clean = cleanRoom(room);
  const safeSalt = String(salt || "");
  const safeVerifier = String(passwordVerifier || "");
  if (!clean || !/^[A-Za-z0-9+/=]{20,64}$/.test(safeSalt) || !/^[A-Za-z0-9+/=]{40,64}$/.test(safeVerifier)) return false;
  const rows = await sql`
    update localtalk_rooms r
    set is_encrypted = true, encryption_salt = ${safeSalt}, password_verifier = ${safeVerifier}
    where r.room = ${clean}
      and r.is_encrypted = false
      and not exists (select 1 from localtalk_messages m where m.room = r.room and m.is_master = false)
    returning r.room
  `;
  return rows.length > 0;
}

async function getRooms(sql) {
  await deleteEmptyTalkRooms(sql);
  const rows = await sql`
    select
      r.room,
      r.creator_ip,
      r.is_admin,
      r.is_encrypted,
      r.created_at,
      count(m.id)::int as message_count,
      max(m.created_at) as last_message_at
    from localtalk_rooms r
    left join localtalk_messages m on m.room = r.room and m.is_master = false
    group by r.room, r.creator_ip, r.is_admin, r.is_encrypted, r.created_at
    order by r.room asc
  `;
  return rows.map((row) => ({
    room: row.room,
    creatorIp: row.creator_ip,
    isAdmin: Boolean(row.is_admin),
    encrypted: Boolean(row.is_encrypted),
    createdAt: row.created_at,
    messageCount: Number(row.message_count) || 0,
    lastMessageAt: row.last_message_at,
  }));
}

export async function deleteEmptyTalkRooms(sql) {
  const rows = await sql`
    select r.room
    from localtalk_rooms r
    where not exists (
      select 1 from localtalk_messages m
      where m.room = r.room and m.is_master = false
    )
  `;
  for (const row of rows) await deleteTalkRoom(sql, row.room);
  return rows.map((row) => row.room);
}

export async function deleteTalkRoom(sql, value) {
  const room = cleanRoom(value);
  if (!room) return false;
  await sql`
    with deleted_messages as (
      delete from localtalk_messages where room = ${room} returning id
    ), deleted_device_bans as (
      delete from localtalk_room_device_bans where room = ${room} returning room
    ), deleted_text_bans as (
      delete from localtalk_room_text_bans where room = ${room} returning room
    ), deleted_settings as (
      delete from localtalk_settings where key = ${`fast_spam_room:${room}`} returning key
    )
    delete from localtalk_rooms where room = ${room}
  `;
  return true;
}

function hexFromBytes(bytes) {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function base64UrlToBytes(value) {
  const base64 = String(value || "").replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return bytesFromBase64(padded);
}

function base64UrlJson(value) {
  return JSON.parse(new TextDecoder().decode(base64UrlToBytes(value)));
}

function pemToArrayBuffer(pem) {
  const body = String(pem || "").replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s/g, "");
  return base64UrlToBytes(body);
}

function normalizeIssuer(value) {
  return String(value || "").replace(/\/+$/g, "");
}

async function verifyClerkToken(request, env) {
  const result = await verifyClerkTokenDebug(request, env);
  return result.user;
}

async function isSecretSolver(env, userId) {
  if (!env.muye_mailboxes || !userId) return false;
  try {
    const row = await env.muye_mailboxes
      .prepare("SELECT user_id FROM secret_solvers WHERE user_id = ? LIMIT 1")
      .bind(userId)
      .first();
    return Boolean(row);
  } catch {
    return false;
  }
}

async function verifyClerkTokenDebug(request, env) {
  const token = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return { user: null, reason: "no token" };
  if (!env.CLERK_JWKS_URL) return { user: null, reason: "no jwks url" };
  const parts = token.split(".");
  if (parts.length !== 3) return { user: null, reason: "bad token shape" };
  const header = base64UrlJson(parts[0]);
  const payload = base64UrlJson(parts[1]);
  if (!payload.sub) return { user: null, reason: "missing user" };
  if (Number(payload.exp || 0) <= Math.floor(Date.now() / 1000)) return { user: null, reason: "expired token" };
  const allowedIssuers = [env.CLERK_ISSUER, clerkIssuer].map(normalizeIssuer).filter(Boolean);
  if (payload.iss && allowedIssuers.length && !allowedIssuers.includes(normalizeIssuer(payload.iss))) return { user: null, reason: `wrong issuer ${normalizeIssuer(payload.iss)}` };
  const jwksUrls = [env.CLERK_JWKS_URL].filter(Boolean);
  for (const jwksUrl of jwksUrls) {
    const jwksResponse = await fetch(jwksUrl, { headers: { Accept: "application/json" } });
    if (!jwksResponse.ok) continue;
    const jwks = await jwksResponse.json();
    const jwk = (jwks.keys || []).find((key) => key.kid === header.kid);
    if (!jwk) continue;
    const key = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, base64UrlToBytes(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
    if (valid) return { user: payload, reason: "ok" };
  }
  return { user: null, reason: "unknown key or bad signature" };
}

function adminPassword(env) {
  return String(env.ADMIN_PASSWD || "");
}

function senderKeySecret(env) {
  return String(env.SENDER_KEY_SECRET || env.ADMIN_PASSWD || "");
}

async function senderKeyFor(deviceId, env) {
  if (!deviceId) return "";
  const data = new TextEncoder().encode(`${senderKeySecret(env)}:${deviceId}`);
  return hexFromBytes(await crypto.subtle.digest("SHA-256", data));
}

async function findSenderBySenderKey(sql, senderKey, env) {
  const key = String(senderKey || "");
  if (!key) return "";
  const rows = await sql`
    select distinct device_id, ip
    from localtalk_messages
    where device_id is not null and device_id <> ''
    limit 500
  `;
  for (const row of rows) {
    if ((await senderKeyFor(row.device_id, env)) === key) return { deviceId: row.device_id, ip: row.ip || "" };
  }
  return { deviceId: "", ip: "" };
}

async function saveIpName(sql, ip, name) {
  const safeName = cleanText(name).slice(0, 40);
  if (!ip) return false;
  if (!safeName) {
    await sql`delete from localtalk_ip_names where ip = ${ip}`;
    return true;
  }
  await sql`
    insert into localtalk_ip_names (ip, display_name, updated_at)
    values (${ip}, ${safeName}, now())
    on conflict (ip) do update set display_name = excluded.display_name, updated_at = now()
  `;
  return true;
}

async function getMessages(sql, options = {}) {
  const includeDeviceId = Boolean(options.includeDeviceId);
  const allRooms = Boolean(options.allRooms);
  const room = cleanRoom(options.room);
  const rows = await sql`
    select m.id, m.text, m.time_text as time, m.created_at, m.kind, m.name, m.mime, m.device_id, m.ip, m.is_admin, m.is_master, m.quote_text, m.quote_name, m.room, n.display_name
    from localtalk_messages m
    left join localtalk_ip_names n on n.ip = m.ip
    where (${allRooms} or m.room = ${room} or m.is_master = true)
    order by m.id desc
    limit 200
  `;
  const messages = [];
  for (const row of rows.reverse()) {
    const deviceId = row.device_id || "";
    const message = {
      id: Number(row.id),
      text: row.text || "",
      time: row.time,
      createdAt: row.created_at,
      kind: row.kind || "text",
      name: row.name || "",
      mime: row.mime || "",
      quoteText: row.quote_text || "",
      quoteName: row.quote_name || "",
      room: row.room || "",
      isMaster: Boolean(row.is_master),
      senderKey: await senderKeyFor(deviceId, options.env),
      displayName: row.is_admin ? "Admin" : row.display_name || "",
      isAdmin: Boolean(row.is_admin),
    };
    if (includeDeviceId) message.deviceId = deviceId;
    if (includeDeviceId) message.ip = row.ip || "";
    messages.push(message);
  }
  return messages;
}

async function getBans(sql) {
  const [deviceRows, roomDeviceRows, ipRows, textRows, roomTextRows, allowRows, signedRows, ipv6Banned] = await Promise.all([
    sql`select device_id, reason, created_at from localtalk_bans order by created_at desc`,
    sql`select room, device_id, created_at from localtalk_room_device_bans order by created_at desc`,
    sql`select ip, created_at from localtalk_ip_bans order by created_at desc`,
    sql`select text, created_at from localtalk_text_bans order by created_at desc`,
    sql`select room, text, created_at from localtalk_room_text_bans order by created_at desc`,
    sql`select text, created_at from localtalk_text_allows order by created_at desc`,
    sql`select clerk_user_id, display_name, created_at from localtalk_signed_bans order by created_at desc`,
    isIpv6Banned(sql),
  ]);
  return [
    ...(ipv6Banned ? [{ kind: "ipv6", value: "IPv6", createdAt: new Date().toISOString() }] : []),
    ...deviceRows.map((row) => ({ kind: "device", value: row.device_id, deviceId: row.device_id, reason: row.reason || "manual", createdAt: row.created_at })),
    ...roomDeviceRows.map((row) => ({ kind: "roomDevice", value: row.device_id, deviceId: row.device_id, room: row.room || "", createdAt: row.created_at })),
    ...ipRows.map((row) => ({ kind: "ip", value: row.ip, ip: row.ip, createdAt: row.created_at })),
    ...textRows.map((row) => ({ kind: "text", value: row.text, text: row.text, createdAt: row.created_at })),
    ...roomTextRows.map((row) => ({ kind: "roomText", value: row.text, text: row.text, room: row.room || "", createdAt: row.created_at })),
    ...allowRows.map((row) => ({ kind: "allow", value: row.text, text: row.text, createdAt: row.created_at })),
    ...signedRows.map((row) => ({ kind: "signed", value: row.clerk_user_id, userId: row.clerk_user_id, displayName: row.display_name || "Signed user", createdAt: row.created_at })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function getNames(sql) {
  const rows = await sql`select ip, display_name, updated_at from localtalk_ip_names order by updated_at desc`;
  return rows.map((row) => ({ ip: row.ip, displayName: row.display_name, updatedAt: row.updated_at }));
}

function labelForSigned(row, fallback = "Signed user") {
  const selfName = row.self_name || row.display_name || fallback;
  const email = row.email || "";
  const alias = row.alias_name || "";
  const base = alias || selfName;
  const parts = [];
  if (selfName) parts.push(selfName);
  if (email) parts.push(email);
  return {
    displayName: base || fallback,
    selfName,
    aliasName: alias,
    email,
    label: (base || fallback) + (parts.length ? `(${parts.join(", ")})` : ""),
  };
}

async function getSignedMessages(sql, viewerUserId = "", room = "") {
  const signedRoom = cleanRoom(room);
  const rows = await sql`
    select m.id, m.clerk_user_id, m.display_name, m.text, m.time_text as time, m.created_at, m.kind, m.name, m.mime, m.ip, m.quote_text, m.quote_name,
      p.self_name, coalesce(p.email, m.email) as email, a.alias_name
    from localtalk_signed_messages m
    left join localtalk_signed_profiles p on p.clerk_user_id = m.clerk_user_id
    left join localtalk_signed_aliases a on a.owner_user_id = ${viewerUserId || ""} and a.target_user_id = m.clerk_user_id
    where m.room = ${signedRoom}
    order by m.id desc
    limit 200
  `;
  return rows.reverse().map((row) => ({
    ...labelForSigned(row),
    id: Number(row.id),
    userId: row.clerk_user_id,
    text: row.text || "",
    time: row.time,
    createdAt: row.created_at,
    kind: row.kind || "text",
    name: row.name || "",
    mime: row.mime || "",
    ip: row.ip || "",
    quoteText: row.quote_text || "",
    quoteName: row.quote_name || "",
  }));
}

async function getSignedUsers(sql, currentUserId, room = "") {
  const signedRoom = cleanRoom(room);
  const rows = await sql`
    with message_users as (
      select distinct on (clerk_user_id) clerk_user_id, display_name, email, created_at
      from localtalk_signed_messages
      where clerk_user_id <> ${currentUserId} and room = ${signedRoom}
      order by clerk_user_id, created_at desc
    ),
    profile_users as (
      select clerk_user_id, self_name as display_name, email, updated_at as created_at
      from localtalk_signed_profiles
      where clerk_user_id <> ${currentUserId}
    ),
    private_users as (
      select from_id as clerk_user_id, from_name as display_name, '' as email, created_at
      from localtalk_private_messages
      where room = ${signedPrivateRoom(signedRoom)} and from_id <> ${currentUserId}
      union
      select to_id as clerk_user_id, to_name as display_name, '' as email, created_at
      from localtalk_private_messages
      where room = ${signedPrivateRoom(signedRoom)} and to_id <> ${currentUserId}
    ),
    users as (
      select * from message_users
      union
      select * from profile_users
      union
      select * from private_users
    )
    select distinct on (u.clerk_user_id) u.clerk_user_id, u.display_name, u.created_at, p.self_name, coalesce(p.email, u.email) as email, a.alias_name
    from users u
    left join localtalk_signed_profiles p on p.clerk_user_id = u.clerk_user_id
    left join localtalk_signed_aliases a on a.owner_user_id = ${currentUserId} and a.target_user_id = u.clerk_user_id
    order by u.clerk_user_id, u.created_at desc
    limit 200
  `;
  return rows
    .map((row) => ({ userId: row.clerk_user_id, createdAt: row.created_at, ...labelForSigned(row) }))
    .sort((a, b) => String(a.label).localeCompare(String(b.label)));
}

function clerkUserName(user) {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  const email = (user.email_addresses || []).find((item) => item.id === user.primary_email_address_id)?.email_address || user.email_addresses?.[0]?.email_address || "";
  return { selfName: fullName || user.username || email || "Signed user", email };
}

async function getClerkUsers(env, sql, currentUserId) {
  try {
    if (!env.CLERK_SECRET_KEY) return { users: null, debug: "no Clerk secret" };
    const response = await fetch("https://api.clerk.com/v1/users?limit=500", {
      headers: {
        Authorization: `Bearer ${env.CLERK_SECRET_KEY}`,
        Accept: "application/json",
      },
    });
    if (!response.ok) return { users: null, debug: `Clerk ${response.status}` };
    const payload = await response.json();
    const users = (Array.isArray(payload) ? payload : (Array.isArray(payload.data) ? payload.data : [])).filter((user) => user.id && user.id !== currentUserId);
    if (!users.length) return { users: [], debug: "Clerk" };
    const [profileRows, aliasRows] = await Promise.all([
      sql`select clerk_user_id, self_name, email from localtalk_signed_profiles limit 500`,
      sql`select target_user_id, alias_name from localtalk_signed_aliases where owner_user_id = ${currentUserId} limit 500`,
    ]);
    const profiles = new Map(profileRows.map((row) => [row.clerk_user_id, row]));
    const aliases = new Map(aliasRows.map((row) => [row.target_user_id, row.alias_name]));
    return { users: users
      .map((user) => {
        const clerkName = clerkUserName(user);
        const profile = profiles.get(user.id) || {};
        return {
          userId: user.id,
          ...labelForSigned({
            display_name: clerkName.selfName,
            self_name: profile.self_name || clerkName.selfName,
            email: profile.email || clerkName.email,
            alias_name: aliases.get(user.id) || "",
          }),
        };
      })
      .sort((a, b) => String(a.label).localeCompare(String(b.label))), debug: "Clerk" };
  } catch (error) {
    return { users: null, debug: "Clerk error" };
  }
}

async function getPrivateMessages(sql, room, identity) {
  if (!identity) return [];
  if (room === "signed") {
    const rows = await sql`
      select pm.id, pm.room, pm.from_id, pm.from_name, pm.to_id, pm.to_name, pm.text, pm.time_text as time, pm.created_at,
        fp.self_name as from_self_name, fp.email as from_email, fa.alias_name as from_alias_name,
        tp.self_name as to_self_name, tp.email as to_email, ta.alias_name as to_alias_name
      from localtalk_private_messages pm
      left join localtalk_signed_profiles fp on fp.clerk_user_id = pm.from_id
      left join localtalk_signed_aliases fa on fa.owner_user_id = ${identity} and fa.target_user_id = pm.from_id
      left join localtalk_signed_profiles tp on tp.clerk_user_id = pm.to_id
      left join localtalk_signed_aliases ta on ta.owner_user_id = ${identity} and ta.target_user_id = pm.to_id
      where pm.room = ${room} and (pm.from_id = ${identity} or pm.to_id = ${identity})
      order by pm.id desc
      limit 100
    `;
    return rows.reverse().map((row) => {
      const fromLabel = labelForSigned({ display_name: row.from_name, self_name: row.from_self_name, email: row.from_email, alias_name: row.from_alias_name }).label;
      const toLabel = labelForSigned({ display_name: row.to_name, self_name: row.to_self_name, email: row.to_email, alias_name: row.to_alias_name }).label;
      return {
        id: Number(row.id),
        room: row.room,
        fromName: fromLabel,
        toName: toLabel,
        text: row.text || "",
        time: row.time,
        createdAt: row.created_at,
        mine: row.from_id === identity,
      };
    });
  }
  const rows = await sql`
    select id, room, from_id, from_name, to_id, to_name, text, time_text as time, created_at
    from localtalk_private_messages
    where room = ${room} and (from_id = ${identity} or to_id = ${identity})
    order by id desc
    limit 100
  `;
  return rows.reverse().map((row) => ({
    id: Number(row.id),
    room: row.room,
    fromName: row.from_name || "Someone",
    toName: row.to_name || "Someone",
    text: row.text || "",
    time: row.time,
    createdAt: row.created_at,
    mine: row.from_id === identity,
  }));
}

async function getAdminPrivateMessages(sql) {
  const rows = await sql`
    select pm.id, pm.room, pm.from_id, pm.from_name, pm.to_id, pm.to_name, pm.text, pm.time_text as time, pm.created_at,
      fp.self_name as from_self_name, fp.email as from_email,
      tp.self_name as to_self_name, tp.email as to_email
    from localtalk_private_messages pm
    left join localtalk_signed_profiles fp on fp.clerk_user_id = pm.from_id
    left join localtalk_signed_profiles tp on tp.clerk_user_id = pm.to_id
    order by pm.id desc
    limit 200
  `;
  return rows.reverse().map((row) => ({
    id: Number(row.id),
    room: row.room,
    fromId: row.from_id,
    fromName: labelForSigned({ display_name: row.from_name, self_name: row.from_self_name, email: row.from_email }).label,
    toId: row.to_id,
    toName: labelForSigned({ display_name: row.to_name, self_name: row.to_self_name, email: row.to_email }).label,
    text: row.text || "",
    time: row.time,
    createdAt: row.created_at,
  }));
}

async function addPrivateMessage(sql, room, fromId, fromName, toId, toName, text, timeZone = "Asia/Shanghai") {
  await sql`
    insert into localtalk_private_messages (room, from_id, from_name, to_id, to_name, text, time_text)
    values (${room}, ${fromId}, ${fromName}, ${toId}, ${toName}, ${text}, ${makeTime(timeZone)})
  `;
}

async function readBody(request) {
  return request.json().catch(() => ({}));
}

function hasAdmin(body, env) {
  const password = adminPassword(env);
  return !!password && String(body.password || "") === password;
}

function requireAdmin(body, env) {
  const password = adminPassword(env);
  if (!password) return json({ ok: false, error: "ADMIN_PASSWD is not configured in muye-dev" }, { status: 500 });
  if (String(body.password || "") !== password) return json({ ok: false, error: "wrong password" }, { status: 403 });
  return null;
}

function cleanText(value) {
  return String(value || "")
    .replace(/(?:\\b|\u0008)[\s\S]*/g, "")
    .replace(combiningMarkPattern, "")
    .normalize("NFKC")
    .replace(hiddenControlPattern, "")
    .replace(combiningMarkPattern, "")
    .trim();
}

function compactText(value) {
  return cleanText(value).replace(/\s+/g, "");
}

function quoteFromBody(body) {
  return {
    quoteText: cleanText(body.quoteText).slice(0, 180),
    quoteName: cleanText(body.quoteName).slice(0, 80),
  };
}

function textFromBody(body) {
  const text = cleanText(body.text);
  if (!text) return { ok: true, text: "" };
  if (new TextEncoder().encode(text).length > maxTextBytes) return { ok: false, text: "" };
  return { ok: true, text };
}

async function addText(sql, text, deviceId, isAdmin = false, ip = "", timeZone = "Asia/Shanghai", quote = {}, room = "", isMaster = false) {
  const targetRoom = isMaster ? "master" : cleanRoom(room);
  const duplicate = await sql`
    select id from localtalk_messages
    where kind = 'text'
      and text = ${text}
      and coalesce(device_id, '') = ${deviceId || ""}
      and coalesce(quote_text, '') = ${quote.quoteText || ""}
      and coalesce(quote_name, '') = ${quote.quoteName || ""}
      and room = ${targetRoom}
      and created_at > now() - interval '5 seconds'
    limit 1
  `;
  if (duplicate.length) return;
  await sql`
    insert into localtalk_messages (text, time_text, kind, device_id, is_admin, ip, quote_text, quote_name, room, is_master)
    values (${text}, ${makeTime(timeZone)}, 'text', ${deviceId || null}, ${isAdmin}, ${ip || null}, ${quote.quoteText || null}, ${quote.quoteName || null}, ${targetRoom}, ${isMaster})
  `;
}

async function addFile(sql, body, isAdmin = false, ip = "", timeZone = "Asia/Shanghai", quote = {}, room = "", isMaster = false) {
  const parts = dataUrlParts(body.dataUrl);
  if (!parts) return { ok: false, status: 400, error: "Bad file" };
  const size = Math.floor((parts.base64.length * 3) / 4);
  if (size > maxFileBytes) return { ok: false, status: 413, error: "File too large" };
  const name = cleanText(body.name || "file").slice(0, 180) || "file";
  const mime = String(body.mime || parts.mime || "application/octet-stream").slice(0, 120);
  await sql`
    insert into localtalk_messages (text, time_text, kind, name, mime, file_data, device_id, is_admin, ip, quote_text, quote_name, room, is_master)
    values ('', ${makeTime(timeZone)}, 'file', ${name}, ${mime}, ${parts.base64}, ${body.deviceId || null}, ${isAdmin}, ${ip || null}, ${quote.quoteText || null}, ${quote.quoteName || null}, ${isMaster ? "master" : cleanRoom(room)}, ${isMaster})
  `;
  return { ok: true };
}

async function saveSignedProfile(sql, userId, name, email) {
  const safeName = cleanText(name).slice(0, 80);
  const safeEmail = String(email || "").trim().slice(0, 160);
  await sql`
    insert into localtalk_signed_profiles (clerk_user_id, self_name, email, updated_at)
    values (${userId}, ${safeName || null}, ${safeEmail || null}, now())
    on conflict (clerk_user_id) do update set self_name = excluded.self_name, email = excluded.email, updated_at = now()
  `;
}

async function addSignedText(sql, userId, displayName, email, text, ip = "", timeZone = "Asia/Shanghai", quote = {}, room = "") {
  await saveSignedProfile(sql, userId, displayName, email);
  const targetRoom = cleanRoom(room);
  const duplicate = await sql`
    select id from localtalk_signed_messages
    where kind = 'text'
      and text = ${text}
      and clerk_user_id = ${userId}
      and coalesce(quote_text, '') = ${quote.quoteText || ""}
      and coalesce(quote_name, '') = ${quote.quoteName || ""}
      and room = ${targetRoom}
      and created_at > now() - interval '5 seconds'
    limit 1
  `;
  if (duplicate.length) return;
  await sql`
    insert into localtalk_signed_messages (clerk_user_id, display_name, email, text, time_text, kind, ip, quote_text, quote_name, room)
    values (${userId}, ${displayName}, ${email || null}, ${text}, ${makeTime(timeZone)}, 'text', ${ip || null}, ${quote.quoteText || null}, ${quote.quoteName || null}, ${targetRoom})
  `;
}

async function addSignedFile(sql, userId, displayName, email, body, ip = "", timeZone = "Asia/Shanghai", quote = {}, room = "") {
  await saveSignedProfile(sql, userId, displayName, email);
  const parts = dataUrlParts(body.dataUrl);
  if (!parts) return { ok: false, status: 400, error: "Bad file" };
  const size = Math.floor((parts.base64.length * 3) / 4);
  if (size > maxFileBytes) return { ok: false, status: 413, error: "File too large" };
  const name = cleanText(body.name || "file").slice(0, 180) || "file";
  const mime = String(body.mime || parts.mime || "application/octet-stream").slice(0, 120);
  await sql`
    insert into localtalk_signed_messages (clerk_user_id, display_name, email, text, time_text, kind, name, mime, file_data, ip, quote_text, quote_name, room)
    values (${userId}, ${displayName}, ${email || null}, '', ${makeTime(timeZone)}, 'file', ${name}, ${mime}, ${parts.base64}, ${ip || null}, ${quote.quoteText || null}, ${quote.quoteName || null}, ${cleanRoom(room)})
  `;
  return { ok: true };
}

function cleanGameId(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 60);
}

async function gameRecords(sql, userId = "") {
  const mine = userId ? await sql`
    select game_id, metric, value, higher_is_better, label, updated_at
    from muye_game_records
    where user_id = ${userId}
    order by updated_at desc
    limit 100
  ` : [];
  const global = await sql`
    select distinct on (game_id, metric)
      game_id, metric, value, higher_is_better, label, display_name, updated_at
    from muye_game_records
    order by game_id, metric,
      case when higher_is_better then -value else value end,
      updated_at asc
  `;
  return { mine: mine.map(gameRecordRow), global: global.map(gameRecordRow) };
}

function gameRecordRow(row) {
  return {
    gameId: row.game_id,
    metric: row.metric,
    value: Number(row.value),
    higherIsBetter: Boolean(row.higher_is_better),
    label: row.label || "",
    displayName: row.display_name || "",
    updatedAt: row.updated_at,
  };
}

async function saveGameRecord(sql, userId, body) {
  const gameId = cleanGameId(body.gameId);
  const metric = cleanGameId(body.metric || "best");
  const value = Number(body.value);
  const higher = body.higherIsBetter !== false;
  const displayName = cleanText(body.displayName || "Signed user").slice(0, 80) || "Signed user";
  const label = cleanText(body.label || "").slice(0, 160);
  if (!gameId || !metric || !Number.isFinite(value)) return { ok: false, status: 400, error: "bad_record" };
  const oldMine = await sql`select value from muye_game_records where game_id = ${gameId} and user_id = ${userId} and metric = ${metric} limit 1`;
  const oldGlobal = await sql`
    select value from muye_game_records
    where game_id = ${gameId} and metric = ${metric}
    order by case when higher_is_better then -value else value end, updated_at asc
    limit 1
  `;
  const beats = (oldValue) => oldValue == null || (higher ? value > oldValue : value < oldValue);
  const brokePersonal = beats(oldMine[0]?.value == null ? null : Number(oldMine[0].value));
  const brokeGlobal = beats(oldGlobal[0]?.value == null ? null : Number(oldGlobal[0].value));
  if (brokePersonal) {
    await sql`
      insert into muye_game_records (game_id, user_id, display_name, metric, value, higher_is_better, label, updated_at)
      values (${gameId}, ${userId}, ${displayName}, ${metric}, ${Math.round(value)}, ${higher}, ${label || null}, now())
      on conflict (game_id, user_id, metric) do update
      set display_name = excluded.display_name, value = excluded.value, higher_is_better = excluded.higher_is_better, label = excluded.label, updated_at = now()
    `;
  }
  return { ok: true, brokePersonal, brokeGlobal, record: { gameId, metric, value: Math.round(value), higherIsBetter: higher, label } };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/talk") {
      url.pathname = "/signed/api";
    } else if (url.pathname.startsWith("/api/talk/")) {
      url.pathname = "/signed/api" + url.pathname.slice("/api/talk".length);
    } else if (url.pathname === "/talk") {
      url.pathname = "/";
    } else if (url.pathname.startsWith("/talk/")) {
      url.pathname = url.pathname.slice("/talk".length) || "/";
    }
    if (!env.DATABASE_URL) return json({ ok: false, error: "DATABASE_URL is missing" }, { status: 500 });
    const sql = neon(env.DATABASE_URL);
    try {
      await ensureSetup(sql);
      const roomRoute = publicRoomPath(url.pathname);
      const signedRoute = signedRoomPath(url.pathname);
      if (signedRoute?.room === "secret" && signedRoute.action !== "/") {
        const user = await verifyClerkToken(request, env);
        if (!user) return new Response("Unauthorized", { status: 401 });
        if (!(await isSecretSolver(env, user.sub))) return new Response("Solve required", { status: 403 });
      }
      if (request.method === "GET" && url.pathname === "/") return new Response(appHtml, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
  if (request.method === "GET" && url.pathname === "/download") return Response.redirect(new URL("/download/#localtalk", request.url), 302);
      if (request.method === "GET" && roomRoute?.action === "/") {
        await ensureRoomAccess(sql, roomRoute.room, clientIp(request), false);
        return new Response(appHtml, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
      }
      if (request.method === "GET" && (url.pathname === "/signed" || signedRoute?.action === "/")) return new Response(signedHtml(env.CLERK_PUBLISHABLE_KEY || ""), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
      if (request.method === "GET" && url.pathname === "/admin") return new Response(adminHtml, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
      if (roomRoute?.room) await ensureRoomAccess(sql, roomRoute.room, clientIp(request), false);
      if (request.method === "GET" && (url.pathname === "/history" || roomRoute?.action === "/history")) return json(await getMessages(sql, { room: roomRoute?.room || "", env }));
	      if (request.method === "GET" && (url.pathname === "/room-state" || roomRoute?.action === "/room-state")) {
	        const deviceId = String(url.searchParams.get("deviceId") || "").slice(0, 80);
	        const currentRoom = roomRoute?.room || "";
	        const banReason = await publicBanReason(sql, currentRoom, deviceId, clientIp(request));
	        const encryption = await encryptedRoomState(sql, currentRoom);
	        return json({ banned: Boolean(banReason), banReason, ...encryption });
	      }
	      if (request.method === "POST" && roomRoute?.action === "/encrypt-room") {
	        const body = await readBody(request);
	        const enabled = await enableRoomEncryption(sql, roomRoute.room, body.salt, body.passwordVerifier);
	        return enabled ? new Response(null, { status: 204 }) : json({ ok: false, error: "room_not_empty_or_already_encrypted" }, { status: 409 });
	      }
      if (request.method === "GET" && url.pathname === "/export") {
        const messages = await getMessages(sql, { includeDeviceId: true, env });
        const signedMessages = await getSignedMessages(sql);
        const bans = await getBans(sql);
        const names = await getNames(sql);
        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        return new Response(JSON.stringify({ exportedAt: new Date().toISOString(), count: messages.length + signedMessages.length, messages, signedMessages, bans, names }, null, 2), {
          headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "Content-Disposition": `attachment; filename="localtalk-${stamp}.json"` },
        });
      }
      if (request.method === "GET" && (url.pathname.startsWith("/file/") || roomRoute?.action.startsWith("/file/"))) {
        const filePath = roomRoute?.action || url.pathname;
        const id = Number(filePath.slice("/file/".length)) || 0;
        const rows = await sql`select name, mime, file_data from localtalk_messages where id = ${id} and room = ${roomRoute?.room || ""} and kind = 'file' limit 1`;
        if (!rows.length) return new Response("File not found", { status: 404 });
        return new Response(bytesFromBase64(rows[0].file_data || ""), {
          headers: { "Content-Type": rows[0].mime || "application/octet-stream", "Content-Disposition": `attachment; filename="${String(rows[0].name || "file").replaceAll('"', "_")}"` },
        });
      }
      if (request.method === "GET" && (url.pathname.startsWith("/signed/file/") || signedRoute?.action.startsWith("/file/"))) {
        const user = await verifyClerkToken(request, env);
        if (!user) return new Response("Unauthorized", { status: 401 });
        if (await isSignedBanned(sql, user.sub)) return new Response("Forbidden", { status: 403 });
        const filePath = signedRoute?.action || url.pathname.slice("/signed".length);
        const id = Number(filePath.slice("/file/".length)) || 0;
        const rows = await sql`select name, mime, file_data from localtalk_signed_messages where id = ${id} and room = ${signedRoute?.room || ""} and kind = 'file' limit 1`;
        if (!rows.length) return new Response("File not found", { status: 404 });
        return new Response(bytesFromBase64(rows[0].file_data || ""), {
          headers: { "Content-Type": rows[0].mime || "application/octet-stream", "Content-Disposition": `attachment; filename="${String(rows[0].name || "file").replaceAll('"', "_")}"` },
        });
      }
      if (request.method === "GET" && (url.pathname === "/signed/history" || signedRoute?.action === "/history")) {
        const auth = await verifyClerkTokenDebug(request, env);
        const user = auth.user;
        if (!user) return json({ ok: false, error: "unauthorized", reason: auth.reason }, { status: 401 });
        if (await isSignedBanned(sql, user.sub)) return new Response("Forbidden", { status: 403 });
        return json(await getSignedMessages(sql, user.sub, signedRoute?.room || ""));
      }
      if (request.method === "GET" && (url.pathname === "/signed/profile" || signedRoute?.action === "/profile")) {
        const user = await verifyClerkToken(request, env);
        if (!user) return new Response("Unauthorized", { status: 401 });
        if (await isSignedBanned(sql, user.sub)) return new Response("Forbidden", { status: 403 });
        const rows = await sql`select self_name, email from localtalk_signed_profiles where clerk_user_id = ${user.sub} limit 1`;
        return json({ name: rows[0]?.self_name || "", email: rows[0]?.email || "" });
      }
      if (request.method === "GET" && (url.pathname === "/signed/users" || signedRoute?.action === "/users")) {
        const user = await verifyClerkToken(request, env);
        if (!user) return new Response("Unauthorized", { status: 401 });
        if (await isSignedBanned(sql, user.sub)) return new Response("Forbidden", { status: 403 });
        const clerkResult = await getClerkUsers(env, sql, user.sub);
        const localUsers = clerkResult.users ? [] : await getSignedUsers(sql, user.sub, signedRoute?.room || "");
        return json({
          source: clerkResult.users ? "clerk" : "local",
          debug: clerkResult.debug || "",
          users: clerkResult.users || localUsers,
        });
      }
      if (request.method === "GET" && (url.pathname === "/signed/game-records" || signedRoute?.action === "/game-records")) {
        const user = await verifyClerkToken(request, env);
        if (!user) return new Response("Unauthorized", { status: 401 });
        if (await isSignedBanned(sql, user.sub)) return new Response("Forbidden", { status: 403 });
        return json(await gameRecords(sql, user.sub));
      }
      if (request.method === "POST" && (url.pathname === "/signed/game-records" || signedRoute?.action === "/game-records")) {
        const user = await verifyClerkToken(request, env);
        if (!user) return new Response("Unauthorized", { status: 401 });
        const ip = clientIp(request);
        if ((await isIpBanned(sql, ip)) || (await isSignedBanned(sql, user.sub))) return new Response("Forbidden", { status: 403 });
        const body = await readBody(request);
        const result = await saveGameRecord(sql, user.sub, body);
        if (!result.ok) return json(result, { status: result.status || 400 });
        return json(result);
      }
      if (request.method === "GET" && (url.pathname === "/signed/private/history" || signedRoute?.action === "/private/history")) {
        const user = await verifyClerkToken(request, env);
        if (!user) return new Response("Unauthorized", { status: 401 });
        if (await isSignedBanned(sql, user.sub)) return new Response("Forbidden", { status: 403 });
        return json(await getPrivateMessages(sql, signedPrivateRoom(signedRoute?.room || ""), user.sub));
      }
      if (request.method === "POST" && (url.pathname === "/send" || roomRoute?.action === "/send")) {
        const body = await readBody(request);
	        const ip = clientIp(request);
	        const timeZone = clientTimeZone(request);
	        const deviceId = String(body.deviceId || "").slice(0, 80);
	        const currentRoom = roomRoute?.room || "";
	        const encryption = await encryptedRoomState(sql, currentRoom);
	        if (encryption.encrypted && (body.passwordVerifier !== encryption.passwordVerifier || !validEncryptedPayload(body.text))) return new Response("Forbidden", { status: 403 });
	        const banReason = await publicBanReason(sql, currentRoom, deviceId, ip);
	        if (banReason) return forbidden(banReason);
	        const message = encryption.encrypted
	          ? { ok: new TextEncoder().encode(String(body.text || "")).length <= 8192, text: String(body.text || "") }
	          : textFromBody(body);
	        const quote = quoteFromBody(body);
	        if (!message.ok) return json({ ok: false, error: "Message too large" }, { status: 413 });
	        if (!encryption.encrypted && await hasBannedAnyText(sql, message.text, quote.quoteText, quote.quoteName)) return notAllowed();
	        if (!encryption.encrypted && await hasRoomBannedAnyText(sql, currentRoom, message.text, quote.quoteText, quote.quoteName)) return notAllowed();
	        if (message.text && await isFastSpamMasterEnabled(sql) && await isRoomFastSpamEnabled(sql, currentRoom) && await checkMessageSpamAndAutoBan(sql, deviceId)) return forbidden("auto_message_spam");
	        if (message.text) await addText(sql, message.text, deviceId, false, ip, timeZone, quote, currentRoom);
        return new Response(null, { status: 204 });
      }
      if (request.method === "POST" && (url.pathname === "/upload" || roomRoute?.action === "/upload")) {
        const body = await readBody(request);
	        const ip = clientIp(request);
	        const timeZone = clientTimeZone(request);
	        const deviceId = String(body.deviceId || "").slice(0, 80);
	        const currentRoom = roomRoute?.room || "";
	        if ((await encryptedRoomState(sql, currentRoom)).encrypted) return json({ ok: false, error: "encrypted_rooms_do_not_accept_files" }, { status: 409 });
	        const banReason = await publicBanReason(sql, currentRoom, deviceId, ip);
	        if (banReason) return forbidden(banReason);
	        if (await checkUploadSpamAndAutoBan(sql, deviceId)) return forbidden("auto_upload_spam");
	        const quote = quoteFromBody(body);
	        if (await hasBannedAnyText(sql, body.name, quote.quoteText, quote.quoteName)) return notAllowed();
	        if (await hasRoomBannedAnyText(sql, currentRoom, body.name, quote.quoteText, quote.quoteName)) return notAllowed();
	        const result = await addFile(sql, { ...body, deviceId }, false, ip, timeZone, quote, currentRoom);
        return result.ok ? new Response(null, { status: 204 }) : json({ ok: false, error: result.error }, { status: result.status });
      }
      if (request.method === "POST" && (url.pathname === "/sender-key" || roomRoute?.action === "/sender-key")) {
        const body = await readBody(request);
        const deviceId = String(body.deviceId || "").slice(0, 80);
        return json({ senderKey: await senderKeyFor(deviceId, env) });
      }
      if (request.method === "POST" && (url.pathname === "/name-sender" || roomRoute?.action === "/name-sender")) {
        const body = await readBody(request);
        const sender = await findSenderBySenderKey(sql, body.senderKey, env);
        if (!sender.deviceId || sender.deviceId === "admin" || !sender.ip) return new Response("Not found", { status: 404 });
        if (await hasBannedText(sql, body.name)) return notAllowed();
        await saveIpName(sql, sender.ip, body.name);
        return new Response(null, { status: 204 });
      }
      if (request.method === "POST" && (url.pathname === "/signed/send" || signedRoute?.action === "/send")) {
        const user = await verifyClerkToken(request, env);
        if (!user) return new Response("Unauthorized", { status: 401 });
        const body = await readBody(request);
        const ip = clientIp(request);
        const timeZone = clientTimeZone(request);
        if ((await isIpBanned(sql, ip)) || (await isSignedBanned(sql, user.sub))) return new Response("Forbidden", { status: 403 });
        const message = textFromBody(body);
        const quote = quoteFromBody(body);
        if (!message.ok) return json({ ok: false, error: "Message too large" }, { status: 413 });
        const displayName = cleanText(body.displayName || "Signed user").slice(0, 80) || "Signed user";
        const email = String(body.email || "").trim().slice(0, 160);
        if (await hasBannedAnyText(sql, message.text, displayName, quote.quoteText, quote.quoteName)) return notAllowed();
        if (message.text) await addSignedText(sql, user.sub, displayName, email, message.text, ip, timeZone, quote, signedRoute?.room || "");
        return new Response(null, { status: 204 });
      }
      if (request.method === "POST" && (url.pathname === "/signed/profile" || signedRoute?.action === "/profile")) {
        const user = await verifyClerkToken(request, env);
        if (!user) return new Response("Unauthorized", { status: 401 });
        const body = await readBody(request);
        const ip = clientIp(request);
        if ((await isIpBanned(sql, ip)) || (await isSignedBanned(sql, user.sub))) return new Response("Forbidden", { status: 403 });
        if (await hasBannedText(sql, body.name)) return notAllowed();
        await saveSignedProfile(sql, user.sub, body.name, body.email);
        return new Response(null, { status: 204 });
      }
      if (request.method === "POST" && (url.pathname === "/signed/alias" || signedRoute?.action === "/alias")) {
        const user = await verifyClerkToken(request, env);
        if (!user) return new Response("Unauthorized", { status: 401 });
        const body = await readBody(request);
        const ip = clientIp(request);
        if ((await isIpBanned(sql, ip)) || (await isSignedBanned(sql, user.sub))) return new Response("Forbidden", { status: 403 });
        const targetId = String(body.targetId || "").slice(0, 160);
        const name = cleanText(body.name).slice(0, 80);
        if (!targetId || targetId === user.sub) return new Response("Bad request", { status: 400 });
        if (await hasBannedText(sql, name)) return notAllowed();
        if (!name) {
          await sql`delete from localtalk_signed_aliases where owner_user_id = ${user.sub} and target_user_id = ${targetId}`;
        } else {
          await sql`
            insert into localtalk_signed_aliases (owner_user_id, target_user_id, alias_name, updated_at)
            values (${user.sub}, ${targetId}, ${name}, now())
            on conflict (owner_user_id, target_user_id) do update set alias_name = excluded.alias_name, updated_at = now()
          `;
        }
        return new Response(null, { status: 204 });
      }
      if (request.method === "POST" && (url.pathname === "/signed/upload" || signedRoute?.action === "/upload")) {
        const user = await verifyClerkToken(request, env);
        if (!user) return new Response("Unauthorized", { status: 401 });
        const body = await readBody(request);
        const ip = clientIp(request);
        const timeZone = clientTimeZone(request);
        if ((await isIpBanned(sql, ip)) || (await isSignedBanned(sql, user.sub))) return new Response("Forbidden", { status: 403 });
        const displayName = cleanText(body.displayName || "Signed user").slice(0, 80) || "Signed user";
        const email = String(body.email || "").trim().slice(0, 160);
        const quote = quoteFromBody(body);
        if (await hasBannedAnyText(sql, displayName, body.name, quote.quoteText, quote.quoteName)) return notAllowed();
        const result = await addSignedFile(sql, user.sub, displayName, email, body, ip, timeZone, quote, signedRoute?.room || "");
        return result.ok ? new Response(null, { status: 204 }) : json({ ok: false, error: result.error }, { status: result.status });
      }
      if (request.method === "POST" && (url.pathname === "/signed/private/send" || signedRoute?.action === "/private/send")) {
        const user = await verifyClerkToken(request, env);
        if (!user) return new Response("Unauthorized", { status: 401 });
        const body = await readBody(request);
        const ip = clientIp(request);
        const timeZone = clientTimeZone(request);
        if ((await isIpBanned(sql, ip)) || (await isSignedBanned(sql, user.sub))) return new Response("Forbidden", { status: 403 });
        const toId = String(body.toId || "").slice(0, 160);
        const message = textFromBody(body);
        const quote = quoteFromBody(body);
        if (!message.ok) return json({ ok: false, error: "Message too large" }, { status: 413 });
        if (!toId || toId === user.sub || !message.text) return new Response("Bad request", { status: 400 });
        const displayName = cleanText(body.displayName || "Signed user").slice(0, 80) || "Signed user";
        const email = String(body.email || "").trim().slice(0, 160);
        if (await hasBannedAnyText(sql, message.text, displayName, body.toName, quote.quoteText, quote.quoteName)) return notAllowed();
        await saveSignedProfile(sql, user.sub, displayName, email);
        let recipientRows = await sql`
          select display_name
          from localtalk_signed_messages
          where clerk_user_id = ${toId} and clerk_user_id <> ${user.sub} and room = ${signedRoute?.room || ""}
          order by id desc
          limit 1
        `;
        if (!recipientRows.length && env.CLERK_SECRET_KEY) {
          const response = await fetch(`https://api.clerk.com/v1/users/${encodeURIComponent(toId)}`, {
            headers: { Authorization: `Bearer ${env.CLERK_SECRET_KEY}`, Accept: "application/json" },
          });
          if (response.ok) {
            const clerkUser = await response.json();
            const clerkName = clerkUserName(clerkUser);
            recipientRows = [{ display_name: clerkName.selfName }];
            await saveSignedProfile(sql, toId, clerkName.selfName, clerkName.email);
          }
        }
        if (!recipientRows.length) return new Response("Recipient not found", { status: 404 });
        const toName = cleanText(recipientRows[0]?.display_name || body.toName || "Signed user").slice(0, 80) || "Signed user";
        await addPrivateMessage(sql, signedPrivateRoom(signedRoute?.room || ""), user.sub, displayName, toId, toName, message.text, timeZone);
        return new Response(null, { status: 204 });
      }
      if (request.method === "POST" && (url.pathname === "/signed/private/clear" || signedRoute?.action === "/private/clear")) {
        const user = await verifyClerkToken(request, env);
        if (!user) return new Response("Unauthorized", { status: 401 });
        const ip = clientIp(request);
        if ((await isIpBanned(sql, ip)) || (await isSignedBanned(sql, user.sub))) return new Response("Forbidden", { status: 403 });
        await sql`
          delete from localtalk_private_messages
          where room = ${signedPrivateRoom(signedRoute?.room || "")} and (from_id = ${user.sub} or to_id = ${user.sub})
        `;
        return new Response(null, { status: 204 });
      }
      if (signedRoute && signedRoute.action !== "/") {
        return json({ ok: false, error: "method_not_allowed", path: `/signed/api${signedRoute.action}` }, { status: 405 });
      }
      if (request.method === "POST" && url.pathname.startsWith("/admin/")) {
        const body = await readBody(request);
        const adminError = requireAdmin(body, env);
        if (adminError) return adminError;
	        if (url.pathname === "/admin/state") return json({ ipv6Banned: await isIpv6Banned(sql), fastSpamMaster: await isFastSpamMasterEnabled(sql), roomFastSpam: await roomFastSpamSettings(sql) });
	        if (url.pathname === "/admin/rooms") return json(await getRooms(sql));
	        if (url.pathname === "/admin/ban-ipv6") {
	          const value = body.banned ? "1" : "0";
	          await sql`
	            insert into localtalk_settings (key, value, updated_at)
	            values ('ipv6_banned', ${value}, now())
	            on conflict (key) do update set value = excluded.value, updated_at = now()
	          `;
	          return new Response(null, { status: 204 });
	        }
	        if (url.pathname === "/admin/fast-spam-master") {
	          const value = body.enabled ? "1" : "0";
	          await sql`
	            insert into localtalk_settings (key, value, updated_at)
	            values ('fast_spam_master', ${value}, now())
	            on conflict (key) do update set value = excluded.value, updated_at = now()
	          `;
	          return new Response(null, { status: 204 });
	        }
	        if (url.pathname === "/admin/room-fast-spam") {
	          const room = cleanRoom(body.room || "");
	          const key = `fast_spam_room:${room}`;
	          const value = body.enabled ? "1" : "0";
	          await sql`
	            insert into localtalk_settings (key, value, updated_at)
	            values (${key}, ${value}, now())
	            on conflict (key) do update set value = excluded.value, updated_at = now()
	          `;
	          return new Response(null, { status: 204 });
	        }
        if (url.pathname === "/admin/messages") return json(await getMessages(sql, { includeDeviceId: true, allRooms: true, env }));
        if (url.pathname === "/admin/signed-messages") return json(await getSignedMessages(sql));
        if (url.pathname === "/admin/private-messages") return json(await getAdminPrivateMessages(sql));
        if (url.pathname === "/admin/bans") return json(await getBans(sql));
	        if (url.pathname === "/admin/send") {
	          const message = textFromBody(body);
	          if (!message.ok) return json({ ok: false, error: "Message too large" }, { status: 413 });
	          if (await hasBannedText(sql, message.text)) return new Response("Forbidden", { status: 403 });
	          if (message.text) await addText(sql, message.text, "admin", true, clientIp(request), clientTimeZone(request), {}, body.master ? "master" : cleanRoom(body.room || ""), Boolean(body.master));
	          return new Response(null, { status: 204 });
	        }
        if (url.pathname === "/admin/upload") {
          if (await hasBannedText(sql, body.name)) return new Response("Forbidden", { status: 403 });
          const result = await addFile(sql, { ...body, deviceId: "admin" }, true, clientIp(request), clientTimeZone(request), {}, body.master ? "master" : cleanRoom(body.room || ""), Boolean(body.master));
          return result.ok ? new Response(null, { status: 204 }) : json({ ok: false, error: result.error }, { status: result.status });
        }
        if (url.pathname === "/admin/name") {
          if (await hasBannedText(sql, body.name)) return new Response("Forbidden", { status: 403 });
          await saveIpName(sql, String(body.ip || "").slice(0, 80), body.name);
          return new Response(null, { status: 204 });
        }
        if (url.pathname === "/admin/delete") {
          await sql`delete from localtalk_messages where id = ${Number(body.id) || 0}`;
          return new Response(null, { status: 204 });
        }
        if (url.pathname === "/admin/delete-user") {
          const value = String(body.value || "").slice(0, 160);
          if (value) await sql`delete from localtalk_messages where ip = ${value} or device_id = ${value}`;
          return new Response(null, { status: 204 });
        }
	        if (url.pathname === "/admin/delete-room-user") {
	          const room = cleanRoom(body.room || "");
	          const value = String(body.value || "").slice(0, 160);
	          if (value) await sql`delete from localtalk_messages where room = ${room} and (ip = ${value} or device_id = ${value})`;
	          return new Response(null, { status: 204 });
	        }
	        if (url.pathname === "/admin/delete-text") {
	          const text = String(body.text || "").trim().slice(0, 1024);
	          if (text) await sql`delete from localtalk_messages where text = ${text}`;
	          return new Response(null, { status: 204 });
	        }
	        if (url.pathname === "/admin/delete-room-text") {
	          const room = cleanRoom(body.room || "");
	          const text = String(body.text || "").trim().slice(0, 1024);
	          if (text) await sql`delete from localtalk_messages where room = ${room} and text = ${text}`;
	          return new Response(null, { status: 204 });
	        }
	        if (url.pathname === "/admin/delete-text-contains") {
	          const text = String(body.text || "").trim().slice(0, 1024);
	          if (text) await sql`delete from localtalk_messages where text ilike ${`%${text}%`}`;
	          return new Response(null, { status: 204 });
	        }
	        if (url.pathname === "/admin/delete-room-text-contains") {
	          const room = cleanRoom(body.room || "");
	          const text = String(body.text || "").trim().slice(0, 1024);
	          if (text) await sql`delete from localtalk_messages where room = ${room} and text ilike ${`%${text}%`}`;
	          return new Response(null, { status: 204 });
	        }
        if (url.pathname === "/admin/signed-delete") {
          await sql`delete from localtalk_signed_messages where id = ${Number(body.id) || 0}`;
          return new Response(null, { status: 204 });
        }
        if (url.pathname === "/admin/signed-delete-user") {
          const value = String(body.value || "").slice(0, 160);
          if (value) await sql`delete from localtalk_signed_messages where clerk_user_id = ${value}`;
          return new Response(null, { status: 204 });
        }
	        if (url.pathname === "/admin/signed-delete-text") {
	          const text = String(body.text || "").trim().slice(0, 1024);
	          if (text) await sql`delete from localtalk_signed_messages where text = ${text}`;
	          return new Response(null, { status: 204 });
	        }
	        if (url.pathname === "/admin/signed-delete-text-contains") {
	          const text = String(body.text || "").trim().slice(0, 1024);
	          if (text) await sql`delete from localtalk_signed_messages where text ilike ${`%${text}%`}`;
	          return new Response(null, { status: 204 });
	        }
        if (url.pathname === "/admin/clear") {
          await sql`delete from localtalk_messages`;
          return new Response(null, { status: 204 });
        }
        if (url.pathname === "/admin/signed-clear") {
          await sql`delete from localtalk_signed_messages`;
          return new Response(null, { status: 204 });
        }
	        if (url.pathname === "/admin/ban") {
	          const deviceId = String(body.deviceId || "").slice(0, 80);
	          if (deviceId && deviceId !== "admin") await sql`
	            insert into localtalk_bans (device_id, reason)
	            values (${deviceId}, 'manual')
	            on conflict (device_id) do update set reason = 'manual'
	          `;
	          return new Response(null, { status: 204 });
	        }
	        if (url.pathname === "/admin/room-ban-device") {
	          const room = cleanRoom(body.room || "");
	          const deviceId = String(body.deviceId || "").slice(0, 80);
	          if (deviceId && deviceId !== "admin") await sql`
	            insert into localtalk_room_device_bans (room, device_id)
	            values (${room}, ${deviceId})
	            on conflict (room, device_id) do nothing
	          `;
	          return new Response(null, { status: 204 });
	        }
        if (url.pathname === "/admin/ban-ip") {
          const ip = String(body.ip || "").slice(0, 80);
          if (ip) await sql`insert into localtalk_ip_bans (ip) values (${ip}) on conflict (ip) do nothing`;
          return new Response(null, { status: 204 });
        }
	        if (url.pathname === "/admin/ban-text") {
	          const text = cleanText(body.text).slice(0, 160);
	          if (text) await sql`insert into localtalk_text_bans (text) values (${text}) on conflict (text) do nothing`;
	          return new Response(null, { status: 204 });
	        }
	        if (url.pathname === "/admin/room-ban-text") {
	          const room = cleanRoom(body.room || "");
	          const text = cleanText(body.text).slice(0, 160);
	          if (text) await sql`insert into localtalk_room_text_bans (room, text) values (${room}, ${text}) on conflict (room, text) do nothing`;
	          return new Response(null, { status: 204 });
	        }
        if (url.pathname === "/admin/allow-text") {
          const text = cleanText(body.text).slice(0, 160);
          if (text) await sql`insert into localtalk_text_allows (text) values (${text}) on conflict (text) do nothing`;
          return new Response(null, { status: 204 });
        }
        if (url.pathname === "/admin/create-room") {
          const room = cleanRoom(body.room);
          if (!room) return new Response("Bad request", { status: 400 });
          await sql`
            insert into localtalk_rooms (room, creator_ip, is_admin)
            values (${room}, ${clientIp(request)}, true)
            on conflict (room) do update set is_admin = true
          `;
          return new Response(null, { status: 204 });
        }
        if (url.pathname === "/admin/delete-room") {
          if (!(await deleteTalkRoom(sql, body.room))) return json({ ok: false, error: "Choose a named room." }, { status: 400 });
          return new Response(null, { status: 204 });
        }
        if (url.pathname === "/admin/ban-signed") {
          const userId = String(body.userId || "").slice(0, 160);
          const displayName = cleanText(body.displayName || "Signed user").slice(0, 80);
          if (userId) {
            await sql`
              insert into localtalk_signed_bans (clerk_user_id, display_name)
              values (${userId}, ${displayName})
              on conflict (clerk_user_id) do update set display_name = excluded.display_name
            `;
          }
          return new Response(null, { status: 204 });
        }
        if (url.pathname === "/admin/unban") {
          await sql`delete from localtalk_bans where device_id = ${String(body.deviceId || "").slice(0, 80)}`;
          return new Response(null, { status: 204 });
        }
        if (url.pathname === "/admin/unban-room-device") {
          await sql`delete from localtalk_room_device_bans where room = ${cleanRoom(body.room || "")} and device_id = ${String(body.deviceId || "").slice(0, 80)}`;
          return new Response(null, { status: 204 });
        }
        if (url.pathname === "/admin/unban-ip") {
          await sql`delete from localtalk_ip_bans where ip = ${String(body.ip || "").slice(0, 80)}`;
          return new Response(null, { status: 204 });
        }
        if (url.pathname === "/admin/unban-ipv6") {
          await sql`
            insert into localtalk_settings (key, value, updated_at)
            values ('ipv6_banned', '0', now())
            on conflict (key) do update set value = '0', updated_at = now()
          `;
          return new Response(null, { status: 204 });
        }
        if (url.pathname === "/admin/unban-text") {
          await sql`delete from localtalk_text_bans where text = ${cleanText(body.text).slice(0, 160)}`;
          return new Response(null, { status: 204 });
        }
        if (url.pathname === "/admin/unban-room-text") {
          await sql`delete from localtalk_room_text_bans where room = ${cleanRoom(body.room || "")} and text = ${cleanText(body.text).slice(0, 160)}`;
          return new Response(null, { status: 204 });
        }
        if (url.pathname === "/admin/unallow-text") {
          await sql`delete from localtalk_text_allows where text = ${cleanText(body.text).slice(0, 160)}`;
          return new Response(null, { status: 204 });
        }
        if (url.pathname === "/admin/unban-signed") {
          await sql`delete from localtalk_signed_bans where clerk_user_id = ${String(body.userId || "").slice(0, 160)}`;
          return new Response(null, { status: 204 });
        }
      }
      return new Response("Not found", { status: 404 });
    } catch (error) {
      return json({ ok: false, error: error.message || "Database error" }, { status: 500 });
    }
  },
};
