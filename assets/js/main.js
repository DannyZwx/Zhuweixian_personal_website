/* 朱炜贤 HR 个人网站 V5：网站脚本，不包含编辑器 */
const STORAGE_KEY = "zw_portfolio_site_data_v6";
document.addEventListener("DOMContentLoaded", () => {
  const data = loadData();
  window.APP_DATA = data;
  renderBindings(data);
  renderComponents(data);
  initTheme();
  initScratchEntry();
  initCursorGlow();
  initReveal();
  initTiltCards();
  initMusic(data);
  initAwards();
  initModals(data);
  initGameMagnet();
  initCopyContact(data);
  initActiveNav();
});
function loadData(){const base=JSON.parse(JSON.stringify(window.SITE_DATA||{}));try{const local=localStorage.getItem(STORAGE_KEY);if(local)return merge(base,JSON.parse(local));}catch(e){}return base}
function merge(t,s){if(Array.isArray(s))return s;if(s&&typeof s==="object"){Object.keys(s).forEach(k=>{if(s[k]&&typeof s[k]==="object"&&!Array.isArray(s[k]))t[k]=merge(t[k]||{},s[k]);else t[k]=s[k]})}return t}
function get(o,p){return p.split(".").reduce((a,k)=>a&&a[k],o)}
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function isPage(){return location.pathname.includes("/pages/")}
function asset(path){if(!path)return"";if(path.startsWith("http")||path.startsWith("//")||path.startsWith("data:"))return path;if(path.startsWith("../")||path.startsWith("./"))return path;return (isPage()?"../":"./")+path}
function link(path){if(path.startsWith("#"))return isPage()?"../home.html"+path:path;if(path.startsWith("pages/"))return isPage()?"./"+path.replace("pages/",""):"./"+path;if(path==="index.html")return isPage()?"../index.html":"./index.html";return path}
function renderBindings(d){
 document.querySelectorAll("[data-text]").forEach(el=>{const v=get(d,el.dataset.text);if(v!==undefined)el.textContent=v});
 document.querySelectorAll("[data-rich-title]").forEach(el=>{const title=get(d,el.dataset.richTitle)||"",hi=get(d,el.dataset.highlight)||"";el.innerHTML=hi&&title.includes(hi)?esc(title).replace(esc(hi),`<span class="gradient-text">${esc(hi)}</span>`):esc(title)});
 document.querySelectorAll("[data-audio]").forEach(el=>{const src=get(d,el.dataset.audio);if(src)el.src=asset(src)});
 document.querySelectorAll("[data-image]").forEach(el=>{const src=get(d,el.dataset.image),cls=el.dataset.class||"",pc=el.dataset.placeholderClass||"blue-placeholder",ph=el.dataset.placeholder||d.ui.imagePlaceholder;if(src)el.outerHTML=`<img class="${cls}" src="${asset(src)}" alt="${esc(ph)}">`;else el.outerHTML=`<div class="${pc}">${esc(ph)}</div>`});
}
function renderComponents(d){
 document.querySelectorAll("[data-render]").forEach(n=>{
  const t=n.dataset.render;
  if(t==="header")n.innerHTML=renderHeader(d);
  if(t==="heroButtons")n.innerHTML=d.hero.buttons.map(b=>`<a class="btn ${b.style==="primary"?"primary":"ghost"} magnetic" href="${link(b.href)}">${esc(b.label)}</a>`).join("");
  if(t==="heroStats")n.innerHTML=d.hero.stats.map(s=>`<div><strong>${esc(s.num)}</strong><span>${esc(s.label)}</span></div>`).join("");
  if(t==="heroTags")n.innerHTML=d.hero.tags.map((x,i)=>`<div class="floating-tag tag-${["a","b","c"][i]||"a"}">${esc(x)}</div>`).join("");
  if(t==="identity")n.innerHTML=d.identity.map(i=>`<div><span>${esc(i.label)}</span><strong>${esc(i.value)}</strong></div>`).join("");
  if(t==="portfolioCategoriesHome")n.innerHTML=renderPortfolioCats(d,false);
  if(t==="portfolioHub")n.innerHTML=`<div class="portfolio-hub-grid">${renderPortfolioCats(d,true)}</div>`;
  if(t==="experienceCards")n.innerHTML=d.experienceCards.map(c=>`<a class="experience-choice-card reveal-up tilt-card" href="${link(c.href)}"><span>${esc(c.type)}</span><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p><b class="card-link">${esc(d.ui.experienceEnter)} →</b></a>`).join("");
  if(t==="skills")n.innerHTML=renderSkills(d);
  if(t==="games")n.innerHTML=renderGames(d);
  if(t==="awards")n.innerHTML=renderAwards(d);
  if(t==="contact")n.innerHTML=`<button class="copy-link" data-copy="${esc(d.site.phone)}">${esc(d.ui.copyPhone)}：${esc(d.site.phone)}</button><button class="copy-link" data-copy="${esc(d.site.email)}">${esc(d.ui.copyEmail)}：${esc(d.site.email)}</button>`;
  if(t==="modalRoot")n.innerHTML=renderModalRoot(d);
  if(t==="pageHero")n.innerHTML=renderPageHero(d,document.body.dataset.page);
  if(t==="videoWorks")n.innerHTML=`<div class="video-list">${renderVideoWorks(d)}</div>`;
  if(t==="graphicWorks")n.innerHTML=`<div class="pinterest-wall">${renderGraphicWorks(d)}</div>`;
  if(t==="musicWorks")n.innerHTML=`<div class="music-grid">${renderMusicWorks(d)}</div>`;
  if(t==="miniGames")n.innerHTML=renderMiniGames(d);
  if(t==="campusExperiences")n.innerHTML=renderExperienceList(d,d.campusExperiences);
  if(t==="projectExperiences")n.innerHTML=renderExperienceList(d,d.projectExperiences);
  if(t==="eggyDetail")n.innerHTML=renderEggyDetail(d);
 });
}
function renderHeader(d){
 return `<div class="nav-inner"><a class="brand" href="${isPage()?'../home.html':'./home.html'}"><span class="brand-mark">ZW</span><span>${esc(d.site.brand)}</span></a><button class="nav-toggle" id="navToggle" type="button">菜单</button><nav class="nav-links">${d.ui.nav.map(a=>`<a href="${link(a.href)}">${esc(a.label)}</a>`).join("")}</nav><button class="theme-toggle" id="themeToggle" type="button" aria-label="切换白天黑夜模式"></button></div>`;
}
function renderPortfolioCats(d,fromPage){
 return d.portfolioCategories.map(c=>`<a class="orb-card reveal-up tilt-card" href="${fromPage?c.href:link('pages/'+c.href)}"><div class="orb-card-content"><span>${esc(c.type)}</span><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p><b class="card-link">${esc(d.ui.portfolioEnter)} →</b></div></a>`).join("");
}
function imageOr(src,cls,text){return src?`<img class="${cls}" src="${asset(src)}" alt="${esc(text)}">`:`<div class="blue-placeholder ${cls}">${esc(text)}</div>`}
function renderSkills(d){
 return d.skills.map(g=>`<article class="skill-level-card tone-${esc(g.tone)}"><div class="level-head"><span>${esc(g.level)}</span><p>${esc(g.desc)}</p></div><div class="tool-icon-grid">${g.items.map(it=>{const icon=it.icon?`<img class="tool-icon-img" src="${asset(it.icon)}" alt="${esc(it.name)}">`:`<div class="tool-icon-placeholder">${esc(it.short)}</div>`;return `<button class="tool-chip" type="button" data-software="${esc(it.name)}">${icon}<strong>${esc(it.name)}</strong></button>`}).join("")}</div></article>`).join("");
}
function renderGames(d){
 return d.games.map((g,i)=>{const icon=g.icon?`<img class="game-thumb-img" src="${asset(g.icon)}" alt="${esc(g.name)}">`:`<div class="game-thumb-placeholder">${esc(d.ui.iconPlaceholder)}</div>`;return `<article class="game-card" data-game-card data-x="${g.x}" data-y="${g.y}" style="--x:${g.x}%;--y:${g.y}%;--s:${g.size}px;--dur:${5+i%5}s;--delay:${-(i%7)}s"><div class="game-inner">${icon}<span>${esc(g.name)}<br>${esc(g.time)}</span></div></article>`}).join("");
}
function renderAwards(d){
 const arr=d.awards.map((a,i)=>`<button class="award-item" type="button" data-award-index="${i}"><b>${esc(a.year)}</b>${esc(a.title)}<em>${esc(a.level)}</em></button>`);
 return arr.join("")+arr.map(x=>x.replace("award-item","award-item is-duplicate")).join("");
}
function renderPageHero(d,key){const p=d.pages[key]||d.pages.portfolio;return `<p class="eyebrow">${esc(p.eyebrow)}</p><h1>${esc(p.title)}</h1><p>${esc(p.desc)}</p>`}
function renderVideoWorks(d){return d.videoWorks.map((v,i)=>`<article class="video-work-card reveal-up tilt-card">${imageOr(v.cover,"video-cover",v.title)}<div class="video-work-copy"><span>${esc(v.tag)}</span><h2>${esc(v.title)}</h2><p>${esc(v.desc)}</p><button class="btn primary" type="button" data-video-index="${i}">${esc(d.ui.play)}</button></div></article>`).join("")}
function renderGraphicWorks(d){return d.graphicWorks.map(g=>{const img=g.image?`<img src="${asset(g.image)}" alt="${esc(g.title)}">`:`<div class="image-placeholder">${esc(g.title)}</div>`;return `<article class="graphic-card ${esc(g.span||"")}">${img}<h3>${esc(g.title)}</h3><p>${esc(g.desc)}</p></article>`}).join("")}
function renderMusicWorks(d){return d.musicWorks.map(m=>`<article class="music-card reveal-up">${imageOr(m.cover,"music-cover",m.title)}<h2>${esc(m.title)}</h2><p>${esc(m.desc)}</p>${m.audio?`<audio class="music-player" src="${asset(m.audio)}" controls></audio>`:`<button class="btn ghost" disabled>未添加音频</button>`}</article>`).join("")}
function renderMiniGames(d){return `<div class="steam-library"><aside><h2>小游戏库</h2><p>点击右侧封面，在弹窗中运行Godot Web游戏。</p></aside><div class="steam-shelf">${d.miniGames.map((g,i)=>`<article class="steam-card" data-game-index="${i}">${imageOr(g.cover,"game-cover",g.title)}<h2>${esc(g.title)}</h2><p>${esc(g.desc)}</p><b class="card-link">${esc(d.ui.runGame)} →</b></article>`).join("")}</div></div>`}
function renderExperienceList(d,arr){return `<div class="experience-list">${arr.map(x=>`<article class="experience-item reveal-up"><div><time>${esc(x.date)}</time><p class="experience-role">${esc(x.role)}</p></div><div><h2>${esc(x.title)}</h2><p>${esc(x.desc)}</p></div></article>`).join("")}</div>`}
function renderEggyDetail(d){return `<section class="eggy-detail-layout"><aside class="eggy-detail-visual reveal-up">${imageOr(d.eggy.image,"eggy-png-placeholder big",d.eggy.title)}</aside><article class="eggy-detail-content reveal-up"><h2>${esc(d.eggy.title)}</h2><p>${esc(d.eggy.detailIntro)}</p><div class="eggy-ability-grid">${d.eggy.abilities.map(a=>`<div><h3>${esc(a.title)}</h3><p>${esc(a.desc)}</p></div>`).join("")}</div></article></section><section class="screenshot-grid">${d.eggy.slots.map(s=>s.image?`<img class="blue-placeholder" src="${asset(s.image)}" alt="${esc(s.title)}">`:`<div class="blue-placeholder">${esc(s.title)}</div>`).join("")}</section>`}
function renderModalRoot(d){return `<div class="modal" id="genericModal" aria-hidden="true"><div class="modal-backdrop" data-close-modal></div><div class="modal-panel" id="modalPanel"><button class="modal-close" data-close-modal type="button">×</button><div id="modalContent"></div></div></div>`}

/* init */
function initTheme(){const root=document.documentElement;const saved=localStorage.getItem("zw-theme")||(((window.SITE_DATA&&window.SITE_DATA.site&&window.SITE_DATA.site.defaultTheme)==='dark')?'dark':'light');root.dataset.theme=saved;document.addEventListener("click",e=>{const b=e.target.closest("#themeToggle");if(b){const next=root.dataset.theme==="light"?"dark":"light";root.dataset.theme=next;localStorage.setItem("zw-theme",next);setThemeBtn()}});function setThemeBtn(){const b=document.getElementById("themeToggle");if(b)b.dataset.mode=root.dataset.theme}setThemeBtn()}
function initScratchEntry(){const canvas=document.getElementById("scratchCanvas");if(!canvas)return;const ctx=canvas.getContext("2d",{alpha:true});const meter=document.getElementById("scratchMeterFill");const fallback=document.getElementById("entryFallback");let w,h,dpr,last=null,energy=0,entering=false;function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+"px";canvas.style.height=h+"px";ctx.setTransform(dpr,0,0,dpr,0,0);draw()}function draw(){ctx.globalCompositeOperation="source-over";const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(232,238,242,.88)");g.addColorStop(.48,"rgba(220,229,238,.78)");g.addColorStop(1,"rgba(248,236,210,.78)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.fillStyle="rgba(7,17,31,.04)";for(let i=0;i<220;i++)ctx.fillRect((i*97)%w,(i*53)%h,1,1)}function restore(){ctx.globalCompositeOperation="source-over";ctx.fillStyle="rgba(232,239,247,.052)";ctx.fillRect(0,0,w,h)}function hole(x,y,r,s){ctx.globalCompositeOperation="destination-out";const g=ctx.createRadialGradient(x,y,r*.08,x,y,r);g.addColorStop(0,"rgba(0,0,0,1)");g.addColorStop(.62,"rgba(0,0,0,.82)");g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();const count=Math.min(9,3+Math.floor(s/260));for(let i=0;i<count;i++){const a=Math.PI*2*i/count+s*.003,d=r*(.55+(i%3)*.18);ctx.beginPath();ctx.arc(x+Math.cos(a)*d,y+Math.sin(a)*d,r*(.13+(i%2)*.055),0,Math.PI*2);ctx.fill()}}function enter(){if(entering)return;entering=true;document.body.classList.add("is-entering");setTimeout(()=>location.href="./home.html",560)}function move(e){if(entering)return;const now=performance.now(),x=e.clientX,y=e.clientY;if(last){const dx=x-last.x,dy=y-last.y,dt=Math.max(now-last.t,16),dist=Math.hypot(dx,dy),speed=dist/dt*1000;if(speed>800)energy+=dist*Math.min(speed/1200,2);else energy*=.94;hole(x,y,Math.max(54,Math.min(136,42+speed*.047)),speed);if(meter)meter.style.width=Math.max(0,Math.min(100,energy/2700*100))+"%";if(energy>2700)enter()}else hole(x,y,72,0);last={x,y,t:now}}function loop(){if(!entering){restore();energy*=.989;if(meter&&energy<2700)meter.style.width=Math.max(0,Math.min(100,energy/2700*100))+"%"}requestAnimationFrame(loop)}addEventListener("resize",resize,{passive:true});addEventListener("pointermove",move,{passive:true});fallback&&fallback.addEventListener("click",e=>{e.preventDefault();enter()});resize();requestAnimationFrame(loop)}
function initCursorGlow(){const g=document.getElementById("cursorGlow");if(!g||matchMedia("(pointer:coarse)").matches)return;let x=0,y=0,t=false;addEventListener("mousemove",e=>{x=e.clientX;y=e.clientY;if(!t){requestAnimationFrame(()=>{g.style.opacity="1";g.style.left=x+"px";g.style.top=y+"px";t=false});t=true}},{passive:true});addEventListener("mouseleave",()=>g.style.opacity="0")}
function initReveal(){const items=document.querySelectorAll(".reveal-up");if(!("IntersectionObserver"in window)){items.forEach(i=>i.classList.add("is-visible"));return}const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");ob.unobserve(e.target)}}),{threshold:.12});items.forEach(i=>ob.observe(i))}
function initTiltCards(){if(matchMedia("(pointer:coarse)").matches)return;document.querySelectorAll(".tilt-card").forEach(card=>{let r=null,t=false,mx=0,my=0;card.addEventListener("mouseenter",()=>r=card.getBoundingClientRect());card.addEventListener("mousemove",e=>{if(!r)r=card.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;if(!t){requestAnimationFrame(()=>{card.style.transform=`perspective(900px) rotateX(${(.5-my/r.height)*7}deg) rotateY(${(mx/r.width-.5)*7}deg) translateY(-3px)`;t=false});t=true}},{passive:true});card.addEventListener("mouseleave",()=>{card.style.transform="";r=null})})}
function initMusic(d){const bgm=document.getElementById("bgm"),btn=document.getElementById("musicBtn");if(!bgm||!btn)return;async function play(){try{await bgm.play();btn.classList.add("is-playing")}catch(e){btn.classList.remove("is-playing")}}btn.addEventListener("click",()=>{if(bgm.paused)play();else{bgm.pause();btn.classList.remove("is-playing")}});document.addEventListener("click",()=>{if(bgm.paused)play()},{once:true})}
function initAwards(){const rail=document.getElementById("awardRail"),toggle=document.getElementById("awardToggle");if(!rail||!toggle)return;toggle.addEventListener("click",()=>{const open=rail.classList.toggle("is-expanded");toggle.setAttribute("aria-expanded",String(open))})}
function openModal(html,red=false){const modal=document.getElementById("genericModal"),content=document.getElementById("modalContent"),panel=document.getElementById("modalPanel");if(!modal||!content)return;content.innerHTML=html;panel.classList.toggle("modal-red",red);modal.classList.add("is-open");modal.setAttribute("aria-hidden","false")}function closeModal(){document.querySelectorAll(".modal.is-open").forEach(m=>{m.classList.remove("is-open");m.setAttribute("aria-hidden","true");const frame=m.querySelector(".frame-wrap");if(frame)frame.innerHTML='<div class="empty-tip">播放器已关闭。</div>'})}
function initModals(d){document.addEventListener("click",e=>{if(e.target.closest("[data-close-modal]")){closeModal();return}const skill=e.target.closest("[data-software]");if(skill){const item=d.skills.flatMap(g=>g.items).find(i=>i.name===skill.dataset.software);if(item){const icon=item.icon?`<img src="${asset(item.icon)}" alt="${esc(item.name)}">`:`<div class="tool-icon-placeholder">${esc(item.short)}</div>`;openModal(`<div class="software-modal-icon">${icon}</div><h2>${esc(item.name)}</h2><p>${esc(item.detail)}</p>`)}return}const aw=e.target.closest("[data-award-index]");if(aw){const a=d.awards[Number(aw.dataset.awardIndex)];if(a){const img=a.image?`<img src="${asset(a.image)}" alt="${esc(a.title)}">`:`<div class="blue-placeholder modal-image">奖项图片占位</div>`;openModal(`<h2>${esc(a.title)}</h2><p class="eyebrow award-eyebrow">${esc(a.year)} · ${esc(a.level)}</p><div class="modal-image">${img}</div><p>${esc(a.detail)}</p>`,true)}return}const v=e.target.closest("[data-video-index]");if(v){const item=d.videoWorks[Number(v.dataset.videoIndex)];openModal(`<h2>${esc(item.title)}</h2><div class="frame-wrap">${item.biliSrc?`<iframe src="${normalize(item.biliSrc)}" title="${esc(item.title)}" allowfullscreen allow="fullscreen; autoplay"></iframe>`:`<div class="empty-tip">未添加Bilibili iframe地址。</div>`}</div>`);return}const g=e.target.closest("[data-game-index]");if(g){const item=d.miniGames[Number(g.dataset.gameIndex)];openModal(`<h2>${esc(item.title)}</h2><p>${esc(item.detail)}</p><div class="frame-wrap">${item.iframe?`<iframe src="${normalize(item.iframe)}" title="${esc(item.title)}" allowfullscreen></iframe>`:`<div class="empty-tip">未添加Godot Web index.html路径。</div>`}</div>`);return}const nav=e.target.closest("#navToggle");if(nav)document.querySelector(".site-header").classList.toggle("is-open")});addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()})}
function normalize(src){src=src.trim();return src.startsWith("//")?"https:"+src:asset(src)}
function initGameMagnet(){const cards=[...document.querySelectorAll("[data-game-card]")];if(!cards.length)return;cards.forEach(card=>{card.addEventListener("mouseenter",()=>{const hx=Number(card.dataset.x),hy=Number(card.dataset.y);card.classList.add("is-hover");cards.forEach(other=>{if(other===card)return;const ox=Number(other.dataset.x),oy=Number(other.dataset.y),dx=ox-hx,dy=oy-hy,dist=Math.hypot(dx,dy);if(dist<18){const power=(18-dist)/18*24,ang=Math.atan2(dy,dx);other.style.setProperty("--push-x",Math.cos(ang)*power+"px");other.style.setProperty("--push-y",Math.sin(ang)*power+"px")}})});card.addEventListener("mouseleave",()=>{card.classList.remove("is-hover");cards.forEach(c=>{c.style.setProperty("--push-x","0px");c.style.setProperty("--push-y","0px")})})})}
function initCopyContact(d){document.addEventListener("click",async e=>{const b=e.target.closest("[data-copy]");if(!b)return;const text=b.dataset.copy;try{await navigator.clipboard.writeText(text)}catch(err){const t=document.createElement("textarea");t.value=text;document.body.appendChild(t);t.select();document.execCommand("copy");t.remove()}const old=b.textContent;b.textContent=d.ui.copied+"："+text;setTimeout(()=>b.textContent=old,1100)})}
function initActiveNav(){const links=[...document.querySelectorAll(".nav-links a[href^='#']")];if(!links.length||!("IntersectionObserver"in window))return;const map=new Map();links.forEach(l=>{const t=document.querySelector(l.getAttribute("href"));if(t)map.set(t,l)});const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.remove("is-active"));map.get(e.target)?.classList.add("is-active")}}),{threshold:.25,rootMargin:"-18% 0px -58% 0px"});map.forEach((_,s)=>ob.observe(s))}


/* ================= V6 overrides ================= */
function renderHeader(d){
 const items=d.ui.nav.map(a=>{const isMaking=a.label.includes("花絮"),isEntry=a.label.includes("前页");const cls=[isMaking?"nav-making":"",isEntry?"nav-entry":""].filter(Boolean).join(" ");return `<a class="${cls}" href="${link(a.href)}" data-nav-label="${esc(a.label)}">${esc(a.label)}</a>`}).join("");
 return `<div class="nav-inner"><a class="brand" href="${isPage()?'../home.html':'./home.html'}"><span class="brand-name">${esc(d.site.brand)}</span></a><button class="nav-toggle" id="navToggle" type="button">菜单</button><nav class="nav-links">${items}</nav><button class="theme-toggle" id="themeToggle" type="button" aria-label="切换白天黑夜模式"><span class="sun">☀</span><span class="moon">☾</span></button></div>`;
}
function renderGames(d){
 const sorted=[...d.games].sort((a,b)=>(b.size||0)-(a.size||0));
 const positions=[];positions.push([50,50,150]);
 for(let i=0;i<6;i++){const a=-Math.PI/2+i*Math.PI*2/6;positions.push([50+22*Math.cos(a),50+24*Math.sin(a),118])}
 for(let i=0;i<12;i++){const a=-Math.PI/2+i*Math.PI*2/12;positions.push([50+39*Math.cos(a),50+38*Math.sin(a),82])}
 return sorted.map((g,i)=>{const p=positions[i]||[50,50,76];const size=i===0?Math.max(140,Math.min(152,g.size||150)):i<7?Math.max(96,Math.min(122,g.size||112)):Math.max(66,Math.min(86,g.size||76));const icon=g.icon?`<img class="game-thumb-img" src="${asset(g.icon)}" alt="${esc(g.name)}">`:`<div class="game-thumb-placeholder">${esc(d.ui.iconPlaceholder)}</div>`;return `<article class="game-card" data-game-card data-x="${p[0].toFixed(1)}" data-y="${p[1].toFixed(1)}" style="--x:${p[0].toFixed(1)}%;--y:${p[1].toFixed(1)}%;--s:${size}px;--dur:${6+i%5}s;--delay:${-(i%7)}s"><div class="game-inner">${icon}<span>${esc(g.name)}<br>${esc(g.time)}</span></div></article>`}).join("");
}
function initTheme(){
 const root=document.documentElement;const saved=localStorage.getItem("zw-theme")||(((window.SITE_DATA&&window.SITE_DATA.site&&window.SITE_DATA.site.defaultTheme)==='dark')?'dark':'light');root.dataset.theme=saved;
 function setThemeBtn(){const b=document.getElementById("themeToggle");if(b)b.dataset.mode=root.dataset.theme}
 setThemeBtn();
 document.addEventListener("click",e=>{const b=e.target.closest("#themeToggle");if(!b)return;const next=root.dataset.theme==="light"?"dark":"light";root.dataset.theme=next;localStorage.setItem("zw-theme",next);setThemeBtn()});
}
function initTiltCards(){
 if(matchMedia("(pointer:coarse)").matches)return;
 document.querySelectorAll(".tilt-card").forEach(card=>{let r=null,t=false,mx=0,my=0;card.addEventListener("mouseenter",()=>{r=card.getBoundingClientRect();card.classList.add("is-tilting")});card.addEventListener("mousemove",e=>{if(!r)r=card.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;if(!t){requestAnimationFrame(()=>{card.style.transform=`perspective(900px) rotateX(${(.5-my/r.height)*7}deg) rotateY(${(mx/r.width-.5)*7}deg) translateY(-3px)`;t=false});t=true}},{passive:true});card.addEventListener("mouseleave",()=>{card.classList.remove("is-tilting");card.style.transform="perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";setTimeout(()=>{if(!card.classList.contains("is-tilting"))card.style.transform=""},780);r=null})});
}
function initGameMagnet(){
 const cards=[...document.querySelectorAll("[data-game-card]")];if(!cards.length)return;
 cards.forEach(card=>{card.addEventListener("mouseenter",()=>{const hx=Number(card.dataset.x),hy=Number(card.dataset.y);card.classList.add("is-hover");cards.forEach(other=>{if(other===card)return;const ox=Number(other.dataset.x),oy=Number(other.dataset.y),dx=ox-hx,dy=oy-hy,dist=Math.hypot(dx,dy);if(dist<27){const power=(27-dist)/27*34,ang=Math.atan2(dy,dx);other.style.setProperty("--push-x",Math.cos(ang)*power+"px");other.style.setProperty("--push-y",Math.sin(ang)*power+"px");other.classList.add("is-neighbor")}})});card.addEventListener("mouseleave",()=>{card.classList.remove("is-hover");cards.forEach(c=>{c.style.setProperty("--push-x","0px");c.style.setProperty("--push-y","0px");c.classList.remove("is-neighbor")})})});
}
function initActiveNav(){
 const navLinks=[...document.querySelectorAll(".nav-links a")];if(!navLinks.length)return;
 const sectionLinks=navLinks.filter(l=>l.getAttribute("href")&&l.getAttribute("href").startsWith("#"));
 const sections=sectionLinks.map(l=>({link:l,section:document.querySelector(l.getAttribute("href"))})).filter(x=>x.section);
 function activate(){
  if(!sections.length)return;let best=sections[0],bestScore=Infinity;
  sections.forEach(item=>{const r=item.section.getBoundingClientRect();const score=Math.abs(r.top-110);if(r.top<innerHeight*.62&&r.bottom>120&&score<bestScore){best=item;bestScore=score}});
  navLinks.forEach(l=>l.classList.remove("is-active"));best.link.classList.add("is-active");
 }
 let ticking=false;addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(()=>{activate();ticking=false});ticking=true}},{passive:true});activate();
}
function renderMakingCards(d){const b=d.behindScenes;return `<article class="making-card" data-making="process"><span class="making-type">Process</span><h2>${esc(b.processTitle)}</h2><p>${esc(b.processDesc)}</p><b class="card-link">点击查看导图 →</b></article><article class="making-card" data-making="tools"><span class="making-type">Tools</span><h2>${esc(b.toolsTitle)}</h2><p>${esc(b.toolsDesc)}</p><b class="card-link">点击查看工具 →</b></article><article class="making-card duration-card" data-duration="${esc(b.durationValue)}"><span class="making-type">Duration</span><h2>${esc(b.durationTitle)}</h2><p>${esc(b.durationDesc)}</p><b class="card-link">悬停显示耗时</b></article>`}
function renderComponents(d){
 document.querySelectorAll("[data-render]").forEach(n=>{const t=n.dataset.render;
  if(t==="header")n.innerHTML=renderHeader(d);
  if(t==="heroButtons")n.innerHTML=d.hero.buttons.map(b=>`<a class="btn ${b.style==="primary"?"primary":"ghost"} magnetic" href="${link(b.href)}">${esc(b.label)}</a>`).join("");
  if(t==="heroStats")n.innerHTML=d.hero.stats.map(s=>`<div><strong>${esc(s.num)}</strong><span>${esc(s.label)}</span></div>`).join("");
  if(t==="heroTags")n.innerHTML=d.hero.tags.map((x,i)=>`<div class="floating-tag tag-${["a","b","c"][i]||"a"}">${esc(x)}</div>`).join("");
  if(t==="identity")n.innerHTML=d.identity.map(i=>`<div><span>${esc(i.label)}</span><strong>${esc(i.value)}</strong></div>`).join("");
  if(t==="portfolioCategoriesHome")n.innerHTML=renderPortfolioCats(d,false);
  if(t==="portfolioHub")n.innerHTML=`<div class="portfolio-hub-grid">${renderPortfolioCats(d,true)}</div>`;
  if(t==="experienceCards")n.innerHTML=d.experienceCards.map(c=>`<a class="experience-choice-card reveal-up tilt-card" href="${link(c.href)}"><span>${esc(c.type)}</span><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p><b class="card-link">${esc(d.ui.experienceEnter)} →</b></a>`).join("");
  if(t==="skills")n.innerHTML=renderSkills(d); if(t==="games")n.innerHTML=renderGames(d); if(t==="awards")n.innerHTML=renderAwards(d);
  if(t==="contact")n.innerHTML=`<button class="copy-link" data-copy="${esc(d.site.phone)}">${esc(d.ui.copyPhone)}：${esc(d.site.phone)}</button><button class="copy-link" data-copy="${esc(d.site.email)}">${esc(d.ui.copyEmail)}：${esc(d.site.email)}</button>`;
  if(t==="modalRoot")n.innerHTML=renderModalRoot(d); if(t==="pageHero")n.innerHTML=renderPageHero(d,document.body.dataset.page);
  if(t==="videoWorks")n.innerHTML=`<div class="video-list">${renderVideoWorks(d)}</div>`; if(t==="graphicWorks")n.innerHTML=`<div class="pinterest-wall">${renderGraphicWorks(d)}</div>`; if(t==="musicWorks")n.innerHTML=`<div class="music-grid">${renderMusicWorks(d)}</div>`; if(t==="miniGames")n.innerHTML=renderMiniGames(d);
  if(t==="campusExperiences")n.innerHTML=renderExperienceList(d,d.campusExperiences); if(t==="projectExperiences")n.innerHTML=renderExperienceList(d,d.projectExperiences); if(t==="eggyDetail")n.innerHTML=renderEggyDetail(d); if(t==="makingCards")n.innerHTML=renderMakingCards(d);
 });
}
function initMakingModals(d){document.addEventListener("click",e=>{const card=e.target.closest("[data-making]");if(!card)return;const b=d.behindScenes;if(card.dataset.making==="process"){openModal(`<div class="making-modal"><h2>${esc(b.processTitle)}</h2><p>${esc(b.processDesc)}</p><div class="process-map">${b.processNodes.map((n,i)=>{const img=n.image?`<img src="${asset(n.image)}" alt="${esc(n.title)}">`:`<div class="blue-placeholder process-node-image">流程图片占位</div>`;return `<article class="process-node"><span class="eyebrow">0${i+1}</span><h3>${esc(n.title)}</h3><p>${esc(n.desc)}</p><div class="process-preview">${img}</div></article>`}).join("")}</div></div>`);return}if(card.dataset.making==="tools"){openModal(`<div class="making-modal"><h2>${esc(b.toolsTitle)}</h2><p>${esc(b.toolsDesc)}</p><div class="tool-modal-grid">${b.tools.map(t=>{const icon=t.icon?`<img src="${asset(t.icon)}" alt="${esc(t.name)}">`:`<div class="blue-placeholder tool-modal-icon">${esc(t.name)}</div>`;return `<article class="tool-modal-card"><div class="tool-modal-icon">${icon}</div><h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p></article>`}).join("")}</div></div>`);return}})}
const __oldReady = document.readyState;
document.addEventListener("DOMContentLoaded",()=>{if(window.APP_DATA)initMakingModals(window.APP_DATA)});

/* V6.1 active nav page fallback */
function initActiveNav(){
 const navLinks=[...document.querySelectorAll('.nav-links a')];if(!navLinks.length)return;
 const sectionLinks=navLinks.filter(l=>l.getAttribute('href')&&l.getAttribute('href').startsWith('#'));
 const sections=sectionLinks.map(l=>({link:l,section:document.querySelector(l.getAttribute('href'))})).filter(x=>x.section);
 const current=location.pathname.split('/').pop()||'home.html';
 let matchedPage=false;
 navLinks.forEach(l=>{const href=l.getAttribute('href')||'';const end=href.split('#')[0].split('/').pop();if(end&&end===current){l.classList.add('is-active');matchedPage=true}});
 function activate(){if(!sections.length)return;let best=null,bestScore=Infinity;sections.forEach(item=>{const r=item.section.getBoundingClientRect();if(r.bottom>120&&r.top<innerHeight*.65){const score=Math.abs(r.top-100);if(score<bestScore){best=item;bestScore=score}}});if(best){navLinks.forEach(l=>l.classList.remove('is-active'));best.link.classList.add('is-active')}}
 if(sections.length){let ticking=false;addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{activate();ticking=false});ticking=true}},{passive:true});activate()}
}


/* ================= V7 overrides ================= */

/* 作品集分类去圆圈 */
function renderPortfolioCats(d, fromPage){
  return d.portfolioCategories.map(c=>`<a class="orb-card portfolio-card-v7 reveal-up tilt-card" href="${fromPage?c.href:link('pages/'+c.href)}">
    <div class="orb-card-content">
      <span>${esc(c.type)}</span>
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.desc)}</p>
      <b class="card-link">${esc(d.ui.portfolioEnter)} →</b>
    </div>
  </a>`).join("");
}

/* 图片占位默认可放大，但图标类不加 */
function imageOr(src, cls, text){
  const zoomableClass = /tool-icon|game-thumb|icon/i.test(cls) ? "" : " zoomable-image-slot";
  return src
    ? `<img class="${cls}${zoomableClass}" src="${asset(src)}" alt="${esc(text)}" data-zoomable-image data-zoom-title="${esc(text)}">`
    : `<div class="blue-placeholder ${cls}${zoomableClass}" data-zoom-placeholder="${esc(text)}">${esc(text)}</div>`;
}

/* Apple Watch 式游戏阅历 */
function renderGames(d){
  const sorted=[...d.games].sort((a,b)=>(b.size||0)-(a.size||0));
  const positions=[
    [50,50,124],
    [50,31,100],[66.5,40,98],[66.5,60,96],[50,69,96],[33.5,60,96],[33.5,40,96],
    [50,14,76],[68,20,76],[82,34,74],[87,50,74],[82,66,74],[68,80,74],
    [50,86,72],[32,80,72],[18,66,72],[13,50,72],[18,34,70],[32,20,70]
  ];
  return sorted.map((g,i)=>{
    const p=positions[i]||[50,50,70];
    const icon=g.icon?`<img class="game-thumb-img" src="${asset(g.icon)}" alt="${esc(g.name)}">`:`<div class="game-thumb-placeholder">${esc(d.ui.iconPlaceholder)}</div>`;
    return `<article class="game-card apple-watch-app" data-game-card data-x="${p[0]}" data-y="${p[1]}" style="--x:${p[0]}%;--y:${p[1]}%;--s:${p[2]}px;--dur:${6+i%4}s;--delay:${-(i%7)}s">
      <div class="game-inner">${icon}<span>${esc(g.name)}<br>${esc(g.time)}</span></div>
    </article>`;
  }).join("");
}

/* 校园 / 项目经历列表：悬停 + 弹窗 + 对方入口 */
function renderExperienceList(d, arr){
  const isCampus = arr === d.campusExperiences;
  const otherHref = isCampus ? "./project-experience.html" : "./campus-experience.html";
  const otherText = isCampus ? (d.ui.campusToProject || "查看项目经历") : (d.ui.projectToCampus || "查看校园经历");
  const kind = isCampus ? "campus" : "project";
  return `<div class="experience-switcher"><a href="${otherHref}">${esc(otherText)} →</a></div>
  <div class="experience-list">${arr.map((x,i)=>`<article class="experience-item reveal-up" data-experience-kind="${kind}" data-experience-index="${i}">
    <div><time>${esc(x.date)}</time><p class="experience-role">${esc(x.role)}</p></div>
    <div><h2>${esc(x.title)}</h2><p>${esc(x.desc)}</p><span class="experience-detail-hint">${esc(d.ui.experienceDetail || "查看详情")} →</span></div>
  </article>`).join("")}</div>`;
}

/* 重新渲染组件：确保新 render 函数生效 */
function renderComponents(d){
 document.querySelectorAll("[data-render]").forEach(n=>{const t=n.dataset.render;
  if(t==="header")n.innerHTML=renderHeader(d);
  if(t==="heroButtons")n.innerHTML=d.hero.buttons.map(b=>`<a class="btn ${b.style==="primary"?"primary":"ghost"} magnetic" href="${link(b.href)}">${esc(b.label)}</a>`).join("");
  if(t==="heroStats")n.innerHTML=d.hero.stats.map(s=>`<div><strong>${esc(s.num)}</strong><span>${esc(s.label)}</span></div>`).join("");
  if(t==="heroTags")n.innerHTML=d.hero.tags.map((x,i)=>`<div class="floating-tag tag-${["a","b","c"][i]||"a"}">${esc(x)}</div>`).join("");
  if(t==="identity")n.innerHTML=d.identity.map(i=>`<div><span>${esc(i.label)}</span><strong>${esc(i.value)}</strong></div>`).join("");
  if(t==="portfolioCategoriesHome")n.innerHTML=`<div class="orb-category-grid">${renderPortfolioCats(d,false)}</div>`;
  if(t==="portfolioHub")n.innerHTML=`<div class="portfolio-hub-grid">${renderPortfolioCats(d,true)}</div>`;
  if(t==="experienceCards")n.innerHTML=d.experienceCards.map(c=>`<a class="experience-choice-card reveal-up tilt-card" href="${link(c.href)}"><span>${esc(c.type)}</span><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p><b class="card-link">${esc(d.ui.experienceEnter)} →</b></a>`).join("");
  if(t==="skills")n.innerHTML=renderSkills(d);
  if(t==="games")n.innerHTML=renderGames(d);
  if(t==="awards")n.innerHTML=renderAwards(d);
  if(t==="contact")n.innerHTML=`<button class="copy-link" data-copy="${esc(d.site.phone)}">${esc(d.ui.copyPhone)}：${esc(d.site.phone)}</button><button class="copy-link" data-copy="${esc(d.site.email)}">${esc(d.ui.copyEmail)}：${esc(d.site.email)}</button>`;
  if(t==="modalRoot")n.innerHTML=renderModalRoot(d);
  if(t==="pageHero")n.innerHTML=renderPageHero(d,document.body.dataset.page);
  if(t==="videoWorks")n.innerHTML=`<div class="video-list">${renderVideoWorks(d)}</div>`;
  if(t==="graphicWorks")n.innerHTML=`<div class="pinterest-wall">${renderGraphicWorks(d)}</div>`;
  if(t==="musicWorks")n.innerHTML=`<div class="music-grid">${renderMusicWorks(d)}</div>`;
  if(t==="miniGames")n.innerHTML=renderMiniGames(d);
  if(t==="campusExperiences")n.innerHTML=renderExperienceList(d,d.campusExperiences);
  if(t==="projectExperiences")n.innerHTML=renderExperienceList(d,d.projectExperiences);
  if(t==="eggyDetail")n.innerHTML=renderEggyDetail(d);
  if(t==="makingCards")n.innerHTML=renderMakingCards(d);
 });
}

/* Apple Watch 邻近图标避让，改用像素距离，避免百分比误判 */
function initGameMagnet(){
  const cards=[...document.querySelectorAll("[data-game-card]")];
  if(!cards.length)return;
  function center(el){
    const r=el.getBoundingClientRect();
    return {x:r.left+r.width/2,y:r.top+r.height/2};
  }
  cards.forEach(card=>{
    card.addEventListener("mouseenter",()=>{
      const hc=center(card);
      card.classList.add("is-hover");
      cards.forEach(other=>{
        if(other===card)return;
        const oc=center(other);
        const dx=oc.x-hc.x, dy=oc.y-hc.y, dist=Math.hypot(dx,dy);
        if(dist<190){
          const power=(190-dist)/190*34;
          const ang=Math.atan2(dy,dx);
          other.style.setProperty("--push-x",Math.cos(ang)*power+"px");
          other.style.setProperty("--push-y",Math.sin(ang)*power+"px");
          other.classList.add("is-neighbor");
        }
      });
    });
    card.addEventListener("mouseleave",()=>{
      card.classList.remove("is-hover");
      cards.forEach(c=>{
        c.style.setProperty("--push-x","0px");
        c.style.setProperty("--push-y","0px");
        c.classList.remove("is-neighbor");
      });
    });
  });
}

/* 二级页返回上一级按钮 */
function injectPageBackButton(d){
  if(!document.body.classList.contains("sub-page"))return;
  if(document.querySelector(".page-back-btn"))return;
  const page=document.body.dataset.page || "";
  const map={
    portfolio:"../home.html#portfolio-entry",
    video:"./portfolio.html",
    graphic:"./portfolio.html",
    music:"./portfolio.html",
    game:"./portfolio.html",
    campus:"../home.html#experience",
    project:"../home.html#experience",
    eggy:"../home.html#eggy",
    making:"../home.html"
  };
  const a=document.createElement("a");
  a.className="page-back-btn";
  a.href=map[page] || "../home.html";
  a.textContent="← " + (d.ui.backUpper || "返回上一级");
  document.body.appendChild(a);
}

/* V7 弹窗：经历详情、图片放大、原有软件/奖项/视频/小游戏 */
function initModals(d){
  document.addEventListener("click",e=>{
    if(e.target.closest("[data-close-modal]")){closeModal();return}

    const exp=e.target.closest("[data-experience-kind]");
    if(exp){
      const arr=exp.dataset.experienceKind==="campus"?d.campusExperiences:d.projectExperiences;
      const item=arr[Number(exp.dataset.experienceIndex)];
      if(item){
        const imgs=(item.images&&item.images.length?item.images:["","","",""]).slice(0,4);
        const gallery=imgs.map((src,i)=>src
          ? `<img class="zoomable-image-slot" data-zoomable-image data-zoom-title="${esc(item.title)} 图片 ${i+1}" src="${asset(src)}" alt="${esc(item.title)} 图片 ${i+1}">`
          : `<div class="blue-placeholder zoomable-image-slot" data-zoom-placeholder="${esc(item.title)} 图片占位 ${i+1}">${esc(item.title)}<br>图片占位 ${i+1}</div>`
        ).join("");
        openModal(`<h2>${esc(item.title)}</h2><p class="eyebrow">${esc(item.date)} · ${esc(item.role)}</p><div class="experience-modal-gallery">${gallery}</div><p>${esc(item.detail || item.desc)}</p>`);
      }
      return;
    }

    const zoomTarget=e.target.closest("[data-zoomable-image], [data-zoom-placeholder], .image-placeholder");
    if(zoomTarget && !zoomTarget.closest(".tool-chip,.game-card,.tool-modal-card,.theme-toggle,.music-btn")){
      e.preventDefault();
      e.stopPropagation();
      const img=zoomTarget.matches("img")?zoomTarget:zoomTarget.querySelector("img");
      const title=zoomTarget.dataset.zoomTitle || zoomTarget.dataset.zoomPlaceholder || zoomTarget.textContent.trim() || "图片素材位";
      const visual=img
        ? `<div class="zoom-modal-visual"><img src="${img.src}" alt="${esc(title)}"></div>`
        : `<div class="zoom-modal-visual"><div class="blue-placeholder">${esc(title)}</div></div>`;
      openModal(`<h2>${esc(title)}</h2>${visual}<p>这是图片类型素材位的放大预览。你可以在编辑器中填写对应图片路径进行替换。</p>`);
      return;
    }

    const skill=e.target.closest("[data-software]");
    if(skill){
      const item=d.skills.flatMap(g=>g.items).find(i=>i.name===skill.dataset.software);
      if(item){
        const icon=item.icon?`<img src="${asset(item.icon)}" alt="${esc(item.name)}">`:`<div class="tool-icon-placeholder">${esc(item.short)}</div>`;
        openModal(`<div class="software-modal-icon">${icon}</div><h2>${esc(item.name)}</h2><p>${esc(item.detail)}</p>`);
      }
      return;
    }

    const aw=e.target.closest("[data-award-index]");
    if(aw){
      const a=d.awards[Number(aw.dataset.awardIndex)];
      if(a){
        const img=a.image?`<img class="zoomable-image-slot" data-zoomable-image data-zoom-title="${esc(a.title)}" src="${asset(a.image)}" alt="${esc(a.title)}">`:`<div class="blue-placeholder modal-image zoomable-image-slot" data-zoom-placeholder="奖项图片占位">奖项图片占位</div>`;
        openModal(`<h2>${esc(a.title)}</h2><p class="eyebrow award-eyebrow">${esc(a.year)} · ${esc(a.level)}</p><div class="modal-image">${img}</div><p>${esc(a.detail)}</p>`,true);
      }
      return;
    }

    const v=e.target.closest("[data-video-index]");
    if(v){
      const item=d.videoWorks[Number(v.dataset.videoIndex)];
      openModal(`<h2>${esc(item.title)}</h2><div class="frame-wrap">${item.biliSrc?`<iframe src="${normalize(item.biliSrc)}" title="${esc(item.title)}" allowfullscreen allow="fullscreen; autoplay"></iframe>`:`<div class="empty-tip">未添加Bilibili iframe地址。</div>`}</div>`);
      return;
    }

    const g=e.target.closest("[data-game-index]");
    if(g){
      const item=d.miniGames[Number(g.dataset.gameIndex)];
      openModal(`<h2>${esc(item.title)}</h2><p>${esc(item.detail)}</p><div class="frame-wrap">${item.iframe?`<iframe src="${normalize(item.iframe)}" title="${esc(item.title)}" allowfullscreen></iframe>`:`<div class="empty-tip">未添加Godot Web index.html路径。</div>`}</div>`);
      return;
    }

    const nav=e.target.closest("#navToggle");
    if(nav)document.querySelector(".site-header").classList.toggle("is-open");
  });
  addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
}

/* DOM 渲染后再加返回按钮 */
document.addEventListener("DOMContentLoaded",()=>{
  if(window.APP_DATA)injectPageBackButton(window.APP_DATA);
});


/* ================= V8 overrides ================= */

/* 内容绑定：让 data-image 占位也支持放大，不包含图标 */
function renderBindings(d){
 document.querySelectorAll("[data-text]").forEach(el=>{const v=get(d,el.dataset.text);if(v!==undefined)el.textContent=v});
 document.querySelectorAll("[data-rich-title]").forEach(el=>{const title=get(d,el.dataset.richTitle)||"",hi=get(d,el.dataset.highlight)||"";el.innerHTML=hi&&title.includes(hi)?esc(title).replace(esc(hi),`<span class="gradient-text">${esc(hi)}</span>`):esc(title)});
 document.querySelectorAll("[data-audio]").forEach(el=>{const src=get(d,el.dataset.audio);if(src)el.src=asset(src)});
 document.querySelectorAll("[data-image]").forEach(el=>{
   const src=get(d,el.dataset.image),cls=el.dataset.class||"",pc=el.dataset.placeholderClass||"blue-placeholder",ph=el.dataset.placeholder||d.ui.imagePlaceholder;
   const isIcon=/icon|game-thumb|tool/i.test(cls);
   if(src)el.outerHTML=`<img class="${cls}${isIcon?'':' zoomable-image-slot'}" ${isIcon?'':'data-zoomable-image'} data-zoom-title="${esc(ph)}" src="${asset(src)}" alt="${esc(ph)}">`;
   else el.outerHTML=`<div class="${pc}${isIcon?'':' zoomable-image-slot'}" ${isIcon?'':'data-zoom-placeholder="'+esc(ph)+'"'}>${esc(ph)}</div>`;
 });
}

/* 修复作品集分类入口 */
function renderPortfolioCats(d, fromPage){
  return d.portfolioCategories.map(c=>`<a class="orb-card portfolio-card-v8 reveal-up tilt-card" href="${fromPage?c.href:link('pages/'+c.href)}">
    <div class="orb-card-content">
      <span>${esc(c.type)}</span>
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.desc)}</p>
      <b class="card-link">${esc(d.ui.portfolioEnter)} →</b>
    </div>
  </a>`).join("");
}

function imageOr(src, cls, text){
  const isIcon=/tool-icon|game-thumb|icon/i.test(cls);
  return src
    ? `<img class="${cls}${isIcon?'':' zoomable-image-slot'}" ${isIcon?'':'data-zoomable-image'} data-zoom-title="${esc(text)}" src="${asset(src)}" alt="${esc(text)}">`
    : `<div class="blue-placeholder ${cls}${isIcon?'':' zoomable-image-slot'}" ${isIcon?'':'data-zoom-placeholder="'+esc(text)+'"'}>${esc(text)}</div>`;
}

/* Apple Watch 式：均匀蜂窝间距，长时长在中心，短时长在外层 */
function renderGames(d){
  const sorted=[...d.games].sort((a,b)=>(b.size||0)-(a.size||0));
  const points=[
    [0,0],
    [0,-84],[73,-42],[73,42],[0,84],[-73,42],[-73,-42],
    [0,-168],[73,-126],[146,-84],[146,0],[146,84],[73,126],
    [0,168],[-73,126],[-146,84],[-146,0],[-146,-84],[-73,-126]
  ];
  return sorted.map((g,i)=>{
    const [x,y]=points[i]||[0,0];
    const icon=g.icon?`<img class="game-thumb-img" src="${asset(g.icon)}" alt="${esc(g.name)}">`:`<div class="game-thumb-placeholder">${esc(d.ui.iconPlaceholder)}</div>`;
    return `<article class="game-card apple-watch-app" data-game-card data-home-x="${x}" data-home-y="${y}" style="--home-x:${x}px;--home-y:${y}px;--s:76px;--dur:${6+i%4}s;--delay:${-(i%7)}s">
      <div class="game-inner">${icon}<span>${esc(g.name)}<br>${esc(g.time)}</span></div>
    </article>`;
  }).join("");
}

/* 作品集分类等组件重新渲染 */
function renderComponents(d){
 document.querySelectorAll("[data-render]").forEach(n=>{const t=n.dataset.render;
  if(t==="header")n.innerHTML=renderHeader(d);
  if(t==="heroButtons")n.innerHTML=d.hero.buttons.map(b=>`<a class="btn ${b.style==="primary"?"primary":"ghost"} magnetic" href="${link(b.href)}">${esc(b.label)}</a>`).join("");
  if(t==="heroStats")n.innerHTML=d.hero.stats.map(s=>`<div><strong>${esc(s.num)}</strong><span>${esc(s.label)}</span></div>`).join("");
  if(t==="heroTags")n.innerHTML=d.hero.tags.map((x,i)=>`<div class="floating-tag tag-${["a","b","c"][i]||"a"}">${esc(x)}</div>`).join("");
  if(t==="identity")n.innerHTML=d.identity.map(i=>`<div><span>${esc(i.label)}</span><strong>${esc(i.value)}</strong></div>`).join("");
  if(t==="portfolioCategoriesHome")n.innerHTML=renderPortfolioCats(d,false);
  if(t==="portfolioHub")n.innerHTML=`<div class="portfolio-hub-grid">${renderPortfolioCats(d,true)}</div>`;
  if(t==="experienceCards")n.innerHTML=d.experienceCards.map(c=>`<a class="experience-choice-card reveal-up tilt-card" href="${link(c.href)}"><span>${esc(c.type)}</span><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p><b class="card-link">${esc(d.ui.experienceEnter)} →</b></a>`).join("");
  if(t==="skills")n.innerHTML=renderSkills(d);
  if(t==="games")n.innerHTML=renderGames(d);
  if(t==="awards")n.innerHTML=renderAwards(d);
  if(t==="contact")n.innerHTML=`<button class="copy-link" data-copy="${esc(d.site.phone)}">${esc(d.ui.copyPhone)}：${esc(d.site.phone)}</button><button class="copy-link" data-copy="${esc(d.site.email)}">${esc(d.ui.copyEmail)}：${esc(d.site.email)}</button>`;
  if(t==="modalRoot")n.innerHTML=renderModalRoot(d);
  if(t==="pageHero")n.innerHTML=renderPageHero(d,document.body.dataset.page);
  if(t==="videoWorks")n.innerHTML=`<div class="video-list">${renderVideoWorks(d)}</div>`;
  if(t==="graphicWorks")n.innerHTML=`<div class="pinterest-wall">${renderGraphicWorks(d)}</div>`;
  if(t==="musicWorks")n.innerHTML=`<div class="music-grid">${renderMusicWorks(d)}</div>`;
  if(t==="miniGames")n.innerHTML=renderMiniGames(d);
  if(t==="campusExperiences")n.innerHTML=renderExperienceList(d,d.campusExperiences);
  if(t==="projectExperiences")n.innerHTML=renderExperienceList(d,d.projectExperiences);
  if(t==="eggyDetail")n.innerHTML=renderEggyDetail(d);
  if(t==="makingCards")n.innerHTML=renderMakingCards(d);
 });
}

/* 蛋仔详情页素材位支持放大 */
function renderEggyDetail(d){
  return `<section class="eggy-detail-layout">
    <aside class="eggy-detail-visual reveal-up">${imageOr(d.eggy.image,"eggy-png-placeholder big",d.eggy.title)}</aside>
    <article class="eggy-detail-content reveal-up"><h2>${esc(d.eggy.title)}</h2><p>${esc(d.eggy.detailIntro)}</p><div class="eggy-ability-grid">${d.eggy.abilities.map(a=>`<div><h3>${esc(a.title)}</h3><p>${esc(a.desc)}</p></div>`).join("")}</div></article>
  </section>
  <section class="screenshot-grid">${d.eggy.slots.map(s=>s.image?`<img class="blue-placeholder zoomable-image-slot" data-zoomable-image data-zoom-title="${esc(s.title)}" src="${asset(s.image)}" alt="${esc(s.title)}">`:`<div class="blue-placeholder zoomable-image-slot" data-zoom-placeholder="${esc(s.title)}">${esc(s.title)}</div>`).join("")}</section>`;
}

/* 游戏拖拽与挤开 */
function initGameMagnet(){
  const cards=[...document.querySelectorAll("[data-game-card]")];
  if(!cards.length)return;
  let active=null, startX=0, startY=0, dx=0, dy=0;

  function pushFrom(card, px, py, strength=42){
    cards.forEach(other=>{
      if(other===card)return;
      const ox=Number(other.dataset.homeX||0), oy=Number(other.dataset.homeY||0);
      const vx=ox-px, vy=oy-py;
      const dist=Math.max(1,Math.hypot(vx,vy));
      if(dist<190){
        const power=(190-dist)/190*strength;
        const ang=Math.atan2(vy,vx);
        other.style.setProperty("--push-x",Math.cos(ang)*power+"px");
        other.style.setProperty("--push-y",Math.sin(ang)*power+"px");
        other.classList.add("is-neighbor");
      }
    });
  }

  function resetPush(){
    cards.forEach(c=>{
      c.style.setProperty("--push-x","0px");
      c.style.setProperty("--push-y","0px");
      c.classList.remove("is-neighbor","is-hover");
    });
  }

  cards.forEach(card=>{
    card.addEventListener("pointerdown",e=>{
      active=card;
      startX=e.clientX;
      startY=e.clientY;
      dx=0; dy=0;
      card.classList.add("is-dragging","is-hover");
      card.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    card.addEventListener("pointermove",e=>{
      if(active!==card)return;
      dx=e.clientX-startX;
      dy=e.clientY-startY;
      card.style.setProperty("--drag-x",dx+"px");
      card.style.setProperty("--drag-y",dy+"px");
      resetPush();
      const hx=Number(card.dataset.homeX||0)+dx;
      const hy=Number(card.dataset.homeY||0)+dy;
      pushFrom(card,hx,hy,58);
    });

    function endDrag(e){
      if(active!==card)return;
      active=null;
      card.classList.remove("is-dragging","is-hover");
      card.style.setProperty("--drag-x","0px");
      card.style.setProperty("--drag-y","0px");
      resetPush();
    }
    card.addEventListener("pointerup",endDrag);
    card.addEventListener("pointercancel",endDrag);

    card.addEventListener("mouseenter",()=>{
      if(active)return;
      card.classList.add("is-hover");
      resetPush();
      pushFrom(card,Number(card.dataset.homeX||0),Number(card.dataset.homeY||0),32);
    });
    card.addEventListener("mouseleave",()=>{
      if(active)return;
      resetPush();
    });
  });
}

/* 返回按钮：名称改为返回 */
function injectPageBackButton(d){
  if(!document.body.classList.contains("sub-page"))return;
  if(document.querySelector(".page-back-btn"))return;
  const page=document.body.dataset.page || "";
  const map={
    portfolio:"../home.html#portfolio-entry",
    video:"./portfolio.html",
    graphic:"./portfolio.html",
    music:"./portfolio.html",
    game:"./portfolio.html",
    campus:"../home.html#experience",
    project:"../home.html#experience",
    eggy:"../home.html#eggy",
    making:"../home.html"
  };
  const a=document.createElement("a");
  a.className="page-back-btn";
  a.href=map[page] || "../home.html";
  a.textContent="← 返回";
  document.body.appendChild(a);
}

/* 独立图片放大层：关闭后返回原弹窗 */
function openZoomLayer(title, visual){
  document.querySelectorAll(".zoom-overlay").forEach(x=>x.remove());
  const div=document.createElement("div");
  div.className="zoom-overlay";
  div.innerHTML=`<div class="zoom-overlay-backdrop" data-close-zoom></div>
    <div class="zoom-overlay-panel">
      <button class="zoom-overlay-close" type="button" data-close-zoom>×</button>
      <h2>${esc(title)}</h2>
      ${visual}
    </div>`;
  document.body.appendChild(div);
}

/* 软件弹窗视觉优化、图片放大不退出父弹窗 */
function initModals(d){
  document.addEventListener("click",e=>{
    if(e.target.closest("[data-close-zoom]")){
      document.querySelectorAll(".zoom-overlay").forEach(x=>x.remove());
      return;
    }
    if(e.target.closest("[data-close-modal]")){closeModal();return}

    const exp=e.target.closest("[data-experience-kind]");
    if(exp){
      const arr=exp.dataset.experienceKind==="campus"?d.campusExperiences:d.projectExperiences;
      const item=arr[Number(exp.dataset.experienceIndex)];
      if(item){
        const imgs=(item.images&&item.images.length?item.images:["","","",""]).slice(0,4);
        const gallery=imgs.map((src,i)=>src
          ? `<img class="zoomable-image-slot" data-zoomable-image data-zoom-title="${esc(item.title)} 图片 ${i+1}" src="${asset(src)}" alt="${esc(item.title)} 图片 ${i+1}">`
          : `<div class="blue-placeholder zoomable-image-slot" data-zoom-placeholder="${esc(item.title)} 图片占位 ${i+1}">${esc(item.title)}<br>图片占位 ${i+1}</div>`
        ).join("");
        openModal(`<h2>${esc(item.title)}</h2><p class="eyebrow">${esc(item.date)} · ${esc(item.role)}</p><div class="experience-modal-gallery">${gallery}</div><p>${esc(item.detail || item.desc)}</p>`);
      }
      return;
    }

    const zoomTarget=e.target.closest("[data-zoomable-image], [data-zoom-placeholder], .image-placeholder");
    if(zoomTarget && !zoomTarget.closest(".tool-chip,.game-card,.tool-modal-card,.theme-toggle,.music-btn")){
      e.preventDefault();
      e.stopPropagation();
      const img=zoomTarget.matches("img")?zoomTarget:zoomTarget.querySelector("img");
      const title=zoomTarget.dataset.zoomTitle || zoomTarget.dataset.zoomPlaceholder || zoomTarget.textContent.trim() || "图片素材位";
      const visual=img
        ? `<div class="zoom-modal-visual"><img src="${img.src}" alt="${esc(title)}"></div>`
        : `<div class="zoom-modal-visual"><div class="blue-placeholder">${esc(title)}</div></div>`;
      openZoomLayer(title, visual);
      return;
    }

    const skill=e.target.closest("[data-software]");
    if(skill){
      const item=d.skills.flatMap(g=>g.items).find(i=>i.name===skill.dataset.software);
      const group=d.skills.find(g=>g.items.some(i=>i.name===skill.dataset.software));
      if(item){
        const icon=item.icon?`<img src="${asset(item.icon)}" alt="${esc(item.name)}">`:`<div class="tool-icon-placeholder">${esc(item.short)}</div>`;
        openModal(`<div class="software-modal-card"><div class="software-modal-icon">${icon}</div><div class="software-modal-copy"><span class="software-level-pill">${esc(group?.level || "技能")}</span><h2>${esc(item.name)}</h2><p>${esc(item.detail)}</p></div></div>`);
      }
      return;
    }

    const aw=e.target.closest("[data-award-index]");
    if(aw){
      const a=d.awards[Number(aw.dataset.awardIndex)];
      if(a){
        const img=a.image?`<img class="zoomable-image-slot" data-zoomable-image data-zoom-title="${esc(a.title)}" src="${asset(a.image)}" alt="${esc(a.title)}">`:`<div class="blue-placeholder modal-image zoomable-image-slot" data-zoom-placeholder="奖项图片占位">奖项图片占位</div>`;
        openModal(`<h2>${esc(a.title)}</h2><p class="eyebrow award-eyebrow">${esc(a.year)} · ${esc(a.level)}</p><div class="modal-image">${img}</div><p>${esc(a.detail)}</p>`,true);
      }
      return;
    }

    const v=e.target.closest("[data-video-index]");
    if(v){
      const item=d.videoWorks[Number(v.dataset.videoIndex)];
      openModal(`<h2>${esc(item.title)}</h2><div class="frame-wrap">${item.biliSrc?`<iframe src="${normalize(item.biliSrc)}" title="${esc(item.title)}" allowfullscreen allow="fullscreen; autoplay"></iframe>`:`<div class="empty-tip">未添加Bilibili iframe地址。</div>`}</div>`);
      return;
    }

    const g=e.target.closest("[data-game-index]");
    if(g){
      const item=d.miniGames[Number(g.dataset.gameIndex)];
      openModal(`<h2>${esc(item.title)}</h2><p>${esc(item.detail)}</p><div class="frame-wrap">${item.iframe?`<iframe src="${normalize(item.iframe)}" title="${esc(item.title)}" allowfullscreen></iframe>`:`<div class="empty-tip">未添加Godot Web index.html路径。</div>`}</div>`);
      return;
    }

    const nav=e.target.closest("#navToggle");
    if(nav)document.querySelector(".site-header").classList.toggle("is-open");
  });

  addEventListener("keydown",e=>{
    if(e.key==="Escape"){
      const zoom=document.querySelector(".zoom-overlay");
      if(zoom){zoom.remove();return}
      closeModal();
    }
  });
}


/* ================= V9 overrides ================= */

function cleanLabel(text){
  return String(text || "")
    .replace(/素材位/g,"")
    .replace(/占位/g,"")
    .replace(/未添加/g,"")
    .replace(/路径/g,"")
    .replace(/可替换/g,"")
    .replace(/\s+/g," ")
    .trim() || "视觉展示";
}

function renderBindings(d){
 document.querySelectorAll("[data-text]").forEach(el=>{const v=get(d,el.dataset.text);if(v!==undefined)el.textContent=v});
 document.querySelectorAll("[data-rich-title]").forEach(el=>{const title=get(d,el.dataset.richTitle)||"",hi=get(d,el.dataset.highlight)||"";el.innerHTML=hi&&title.includes(hi)?esc(title).replace(esc(hi),`<span class="gradient-text">${esc(hi)}</span>`):esc(title)});
 document.querySelectorAll("[data-audio]").forEach(el=>{const src=get(d,el.dataset.audio);if(src)el.src=asset(src)});
 document.querySelectorAll("[data-image]").forEach(el=>{
   const path=el.dataset.image;
   const src=get(d,path), cls=el.dataset.class||"", pc=el.dataset.placeholderClass||"blue-placeholder", ph=cleanLabel(el.dataset.placeholder||d.ui.imagePlaceholder);
   const isIcon=/icon|game-thumb|tool/i.test(cls);
   const isEggy=path==="eggy.image" || /eggy-png/.test(cls);
   if(src) el.outerHTML=`<img class="${cls}${(!isIcon&&!isEggy)?' zoomable-image-slot':''}" ${(!isIcon&&!isEggy)?'data-zoomable-image':''} data-zoom-title="${esc(ph)}" src="${asset(src)}" alt="${esc(ph)}">`;
   else el.outerHTML=`<div class="${pc}${(!isIcon&&!isEggy)?' zoomable-image-slot':''}" ${(!isIcon&&!isEggy)?'data-zoom-placeholder="'+esc(ph)+'"':''}>${esc(isEggy?'形象展示':ph)}</div>`;
 });
}

function imageOr(src, cls, text){
  const isIcon=/tool-icon|game-thumb|icon/i.test(cls);
  const isEggy=/eggy-png/.test(cls);
  const label=cleanLabel(text);
  return src
    ? `<img class="${cls}${(!isIcon&&!isEggy)?' zoomable-image-slot':''}" ${(!isIcon&&!isEggy)?'data-zoomable-image':''} data-zoom-title="${esc(label)}" src="${asset(src)}" alt="${esc(label)}">`
    : `<div class="blue-placeholder ${cls}${(!isIcon&&!isEggy)?' zoomable-image-slot':''}" ${(!isIcon&&!isEggy)?'data-zoom-placeholder="'+esc(label)+'"':''}>${esc(isEggy?'形象展示':label)}</div>`;
}

/* 游戏阅历：中心向外大到小，安全间距 + 整体放大 */
function renderGames(d){
  const sorted=[...d.games].sort((a,b)=>(b.size||0)-(a.size||0));
  const points=[
    [0,0,104],
    [0,-118,88],[102,-59,88],[102,59,88],[0,118,88],[-102,59,88],[-102,-59,88],
    [0,-238,74],[103,-178,74],[206,-119,74],[206,0,74],[206,119,74],[103,178,74],
    [0,238,74],[-103,178,72],[-206,119,72],[-206,0,72],[-206,-119,72],[-103,-178,72]
  ];
  return sorted.map((g,i)=>{
    const [x,y,s]=points[i]||[0,0,72];
    const icon=g.icon?`<img class="game-thumb-img" src="${asset(g.icon)}" alt="${esc(g.name)}">`:`<div class="game-thumb-placeholder">${esc(d.ui.iconPlaceholder)}</div>`;
    return `<article class="game-card apple-watch-app" data-game-card data-home-x="${x}" data-home-y="${y}" style="--home-x:${x}px;--home-y:${y}px;--s:${s}px;--dur:${6+i%4}s;--delay:${-(i%7)}s">
      <div class="game-inner">${icon}<span>${esc(g.name)}<br>${esc(g.time)}</span></div>
    </article>`;
  }).join("");
}

/* 组件重新渲染：作品集分类保持正常结构 */
function renderPortfolioCats(d, fromPage){
  return d.portfolioCategories.map(c=>`<a class="orb-card portfolio-card-v8 reveal-up tilt-card" href="${fromPage?c.href:link('pages/'+c.href)}">
    <div class="orb-card-content">
      <span>${esc(c.type)}</span>
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.desc)}</p>
      <b class="card-link">${esc(d.ui.portfolioEnter)} →</b>
    </div>
  </a>`).join("");
}

function renderComponents(d){
 document.querySelectorAll("[data-render]").forEach(n=>{const t=n.dataset.render;
  if(t==="header")n.innerHTML=renderHeader(d);
  if(t==="heroButtons")n.innerHTML=d.hero.buttons.map(b=>`<a class="btn ${b.style==="primary"?"primary":"ghost"} magnetic" href="${link(b.href)}">${esc(b.label)}</a>`).join("");
  if(t==="heroStats")n.innerHTML=d.hero.stats.map(s=>`<div><strong>${esc(s.num)}</strong><span>${esc(s.label)}</span></div>`).join("");
  if(t==="heroTags")n.innerHTML=d.hero.tags.map((x,i)=>`<div class="floating-tag tag-${["a","b","c"][i]||"a"}">${esc(x)}</div>`).join("");
  if(t==="identity")n.innerHTML=d.identity.map(i=>`<div><span>${esc(i.label)}</span><strong>${esc(i.value)}</strong></div>`).join("");
  if(t==="portfolioCategoriesHome")n.innerHTML=renderPortfolioCats(d,false);
  if(t==="portfolioHub")n.innerHTML=`<div class="portfolio-hub-grid">${renderPortfolioCats(d,true)}</div>`;
  if(t==="experienceCards")n.innerHTML=d.experienceCards.map(c=>`<a class="experience-choice-card reveal-up tilt-card" href="${link(c.href)}"><span>${esc(c.type)}</span><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p><b class="card-link">${esc(d.ui.experienceEnter)} →</b></a>`).join("");
  if(t==="skills")n.innerHTML=renderSkills(d);
  if(t==="games")n.innerHTML=renderGames(d);
  if(t==="awards")n.innerHTML=renderAwards(d);
  if(t==="contact")n.innerHTML=`<button class="copy-link" data-copy="${esc(d.site.phone)}">${esc(d.ui.copyPhone)}：${esc(d.site.phone)}</button><button class="copy-link" data-copy="${esc(d.site.email)}">${esc(d.ui.copyEmail)}：${esc(d.site.email)}</button>`;
  if(t==="modalRoot")n.innerHTML=renderModalRoot(d);
  if(t==="pageHero")n.innerHTML=renderPageHero(d,document.body.dataset.page);
  if(t==="videoWorks")n.innerHTML=`<div class="video-list">${renderVideoWorks(d)}</div>`;
  if(t==="graphicWorks")n.innerHTML=`<div class="pinterest-wall">${renderGraphicWorks(d)}</div>`;
  if(t==="musicWorks")n.innerHTML=`<div class="music-grid">${renderMusicWorks(d)}</div>`;
  if(t==="miniGames")n.innerHTML=renderMiniGames(d);
  if(t==="campusExperiences")n.innerHTML=renderExperienceList(d,d.campusExperiences);
  if(t==="projectExperiences")n.innerHTML=renderExperienceList(d,d.projectExperiences);
  if(t==="eggyDetail")n.innerHTML=renderEggyDetail(d);
  if(t==="makingCards")n.innerHTML=renderMakingCards(d);
 });
}

/* 视频/音乐/游戏空状态去编辑提示 */
function renderVideoWorks(d){
  return d.videoWorks.map((v,i)=>`<article class="video-work-card reveal-up tilt-card">${imageOr(v.cover,"video-cover",v.title)}<div class="video-work-copy"><span>${esc(v.tag)}</span><h2>${esc(v.title)}</h2><p>${esc(v.desc)}</p><button class="btn primary" type="button" data-video-index="${i}">${esc(d.ui.play)}</button></div></article>`).join("");
}
function renderMusicWorks(d){
  return d.musicWorks.map(m=>`<article class="music-card reveal-up">${imageOr(m.cover,"music-cover",m.title)}<h2>${esc(m.title)}</h2><p>${esc(m.desc)}</p>${m.audio?`<audio class="music-player" src="${asset(m.audio)}" controls></audio>`:`<button class="btn ghost" disabled>音乐作品整理中</button>`}</article>`).join("");
}
function renderMiniGames(d){
  return `<div class="steam-library"><aside><h2>小游戏库</h2><p>点击右侧封面，在弹窗中运行游戏 Demo。</p></aside><div class="steam-shelf">${d.miniGames.map((g,i)=>`<article class="steam-card" data-game-index="${i}">${imageOr(g.cover,"game-cover",g.title)}<h2>${esc(g.title)}</h2><p>${esc(g.desc)}</p><b class="card-link">${esc(d.ui.runGame)} →</b></article>`).join("")}</div></div>`;
}

/* 蛋仔透明 PNG 不放大；下面三个作品位保留放大 */
function renderEggyDetail(d){
  return `<section class="eggy-detail-layout">
    <aside class="eggy-detail-visual reveal-up">${d.eggy.image?`<img class="eggy-png big" src="${asset(d.eggy.image)}" alt="${esc(d.eggy.title)}">`:`<div class="eggy-png-placeholder big">形象展示</div>`}</aside>
    <article class="eggy-detail-content reveal-up"><h2>${esc(d.eggy.title)}</h2><p>${esc(d.eggy.detailIntro)}</p><div class="eggy-ability-grid">${d.eggy.abilities.map(a=>`<div><h3>${esc(a.title)}</h3><p>${esc(a.desc)}</p></div>`).join("")}</div></article>
  </section>
  <section class="screenshot-grid">${d.eggy.slots.map(s=>s.image?`<img class="blue-placeholder zoomable-image-slot" data-zoomable-image data-zoom-title="${esc(cleanLabel(s.title))}" src="${asset(s.image)}" alt="${esc(cleanLabel(s.title))}">`:`<div class="blue-placeholder zoomable-image-slot" data-zoom-placeholder="${esc(cleanLabel(s.title))}">${esc(cleanLabel(s.title))}</div>`).join("")}</section>`;
}

/* 游戏拖拽和悬停影响范围扩大 */
function initGameMagnet(){
  const cards=[...document.querySelectorAll("[data-game-card]")];
  if(!cards.length)return;
  let active=null,startX=0,startY=0,dx=0,dy=0;

  function pushFrom(card, px, py, strength=58, range=292){
    cards.forEach(other=>{
      if(other===card)return;
      const ox=Number(other.dataset.homeX||0), oy=Number(other.dataset.homeY||0);
      const vx=ox-px, vy=oy-py;
      const dist=Math.max(1,Math.hypot(vx,vy));
      if(dist<range){
        const power=(range-dist)/range*strength;
        const ang=Math.atan2(vy,vx);
        other.style.setProperty("--push-x",Math.cos(ang)*power+"px");
        other.style.setProperty("--push-y",Math.sin(ang)*power+"px");
        other.classList.add("is-neighbor");
      }
    });
  }
  function resetPush(){
    cards.forEach(c=>{c.style.setProperty("--push-x","0px");c.style.setProperty("--push-y","0px");c.classList.remove("is-neighbor","is-hover")});
  }
  cards.forEach(card=>{
    card.addEventListener("pointerdown",e=>{
      active=card;startX=e.clientX;startY=e.clientY;dx=0;dy=0;
      card.classList.add("is-dragging","is-hover");
      card.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    card.addEventListener("pointermove",e=>{
      if(active!==card)return;
      dx=e.clientX-startX;dy=e.clientY-startY;
      const max=110; const len=Math.hypot(dx,dy); if(len>max){dx=dx/len*max;dy=dy/len*max}
      card.style.setProperty("--drag-x",dx+"px");card.style.setProperty("--drag-y",dy+"px");
      resetPush();
      pushFrom(card,Number(card.dataset.homeX||0)+dx,Number(card.dataset.homeY||0)+dy,78,320);
    });
    function endDrag(){
      if(active!==card)return;
      active=null;card.classList.remove("is-dragging","is-hover");
      card.style.setProperty("--drag-x","0px");card.style.setProperty("--drag-y","0px");
      resetPush();
    }
    card.addEventListener("pointerup",endDrag);
    card.addEventListener("pointercancel",endDrag);
    card.addEventListener("mouseenter",()=>{if(active)return;resetPush();card.classList.add("is-hover");pushFrom(card,Number(card.dataset.homeX||0),Number(card.dataset.homeY||0),46,292)});
    card.addEventListener("mouseleave",()=>{if(active)return;resetPush()});
  });
}

/* 二级页面返回主页对应入口：使用 query 参数瞬间定位，避免平滑滚动过程 */
function injectPageBackButton(d){
  if(!document.body.classList.contains("sub-page"))return;
  if(document.querySelector(".page-back-btn"))return;
  const page=document.body.dataset.page || "";
  const map={
    portfolio:"portfolio-entry",
    video:"portfolio-entry",
    graphic:"portfolio-entry",
    music:"portfolio-entry",
    game:"portfolio-entry",
    campus:"experience",
    project:"experience",
    eggy:"eggy",
    making:"profile"
  };
  const section=map[page] || "profile";
  const a=document.createElement("a");
  a.className="page-back-btn";
  a.href=`../home.html?section=${encodeURIComponent(section)}`;
  a.textContent="← 返回";
  document.body.appendChild(a);
}
function initSectionQueryJump(){
  if(!document.body.classList.contains("home-page"))return;
  const params=new URLSearchParams(location.search);
  const section=params.get("section");
  if(!section)return;
  const target=document.getElementById(section);
  if(target){
    requestAnimationFrame(()=> {
      const top=target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({top:Math.max(0,top),behavior:"auto"});
      history.replaceState(null,"",location.pathname);
    });
  }
}

/* 制作流程弹窗：节点放大并把文字切换为图片 */
function initMakingModals(d){
  document.addEventListener("click",e=>{
    const card=e.target.closest("[data-making]");
    if(!card)return;
    const b=d.behindScenes;
    if(card.dataset.making==="process"){
      const nodes=b.processNodes.map((n,i)=>{
        const visual=n.image
          ? `<img src="${asset(n.image)}" alt="${esc(n.title)}">`
          : `<div class="image-placeholder">${esc(n.title)}视觉</div>`;
        return `<article class="process-node-v9">
          <div class="process-node-copy"><span>0${i+1}</span><h3>${esc(n.title)}</h3><p>${esc(n.desc)}</p></div>
          <div class="process-node-visual">${visual}</div>
        </article>`;
      }).join("");
      openModal(`<h2>${esc(b.processTitle)}</h2><p>${esc(b.processDesc)}</p><div class="process-map-v9">${nodes}</div>`);
    }
    if(card.dataset.making==="tools"){
      const tools=b.tools.map(t=>`<div class="tool-modal-card">${t.icon?`<img src="${asset(t.icon)}" alt="${esc(t.name)}">`:`<div class="tool-icon-placeholder">${esc(t.name.slice(0,2))}</div>`}<h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p></div>`).join("");
      openModal(`<h2>${esc(b.toolsTitle)}</h2><p>${esc(b.toolsDesc)}</p><div class="tool-modal-grid">${tools}</div>`);
    }
  });
}

/* 图片放大弹层：空位显示更自然的陈列视觉 */
function openZoomLayer(title, visual){
  document.querySelectorAll(".zoom-overlay").forEach(x=>x.remove());
  const div=document.createElement("div");
  div.className="zoom-overlay";
  div.innerHTML=`<div class="zoom-overlay-backdrop" data-close-zoom></div>
    <div class="zoom-overlay-panel">
      <button class="zoom-overlay-close" type="button" data-close-zoom>×</button>
      <h2>${esc(cleanLabel(title))}</h2>
      ${visual}
    </div>`;
  document.body.appendChild(div);
}

/* 覆盖弹窗空状态文本 */
function initModals(d){
  document.addEventListener("click",e=>{
    if(e.target.closest("[data-close-zoom]")){document.querySelectorAll(".zoom-overlay").forEach(x=>x.remove());return}
    if(e.target.closest("[data-close-modal]")){closeModal();return}

    const exp=e.target.closest("[data-experience-kind]");
    if(exp){
      const arr=exp.dataset.experienceKind==="campus"?d.campusExperiences:d.projectExperiences;
      const item=arr[Number(exp.dataset.experienceIndex)];
      if(item){
        const imgs=(item.images&&item.images.length?item.images:["","","",""]).slice(0,4);
        const gallery=imgs.map((src,i)=>src
          ? `<img class="zoomable-image-slot" data-zoomable-image data-zoom-title="${esc(item.title)} ${i+1}" src="${asset(src)}" alt="${esc(item.title)} ${i+1}">`
          : `<div class="blue-placeholder zoomable-image-slot" data-zoom-placeholder="${esc(item.title)} ${i+1}">${esc(item.title)} ${i+1}</div>`
        ).join("");
        openModal(`<h2>${esc(item.title)}</h2><p class="eyebrow">${esc(item.date)} · ${esc(item.role)}</p><div class="experience-modal-gallery">${gallery}</div><p>${esc(item.detail || item.desc)}</p>`);
      }
      return;
    }

    const zoomTarget=e.target.closest("[data-zoomable-image], [data-zoom-placeholder], .image-placeholder");
    if(zoomTarget && !zoomTarget.closest(".tool-chip,.game-card,.tool-modal-card,.theme-toggle,.music-btn,.eggy-asset-panel,.eggy-detail-visual")){
      e.preventDefault(); e.stopPropagation();
      const img=zoomTarget.matches("img")?zoomTarget:zoomTarget.querySelector("img");
      const title=cleanLabel(zoomTarget.dataset.zoomTitle || zoomTarget.dataset.zoomPlaceholder || zoomTarget.textContent.trim() || "视觉展示");
      const visual=img
        ? `<div class="zoom-modal-visual"><img src="${img.src}" alt="${esc(title)}"></div>`
        : `<div class="zoom-modal-visual"><div class="blue-placeholder">${esc(title)}</div></div>`;
      openZoomLayer(title, visual);
      return;
    }

    const skill=e.target.closest("[data-software]");
    if(skill){
      const item=d.skills.flatMap(g=>g.items).find(i=>i.name===skill.dataset.software);
      const group=d.skills.find(g=>g.items.some(i=>i.name===skill.dataset.software));
      if(item){
        const icon=item.icon?`<img src="${asset(item.icon)}" alt="${esc(item.name)}">`:`<div class="tool-icon-placeholder">${esc(item.short)}</div>`;
        openModal(`<div class="software-modal-card"><div class="software-modal-icon">${icon}</div><div class="software-modal-copy"><span class="software-level-pill">${esc(group?.level || "技能")}</span><h2>${esc(item.name)}</h2><p>${esc(item.detail)}</p></div></div>`);
      }
      return;
    }

    const aw=e.target.closest("[data-award-index]");
    if(aw){
      const a=d.awards[Number(aw.dataset.awardIndex)];
      if(a){
        const img=a.image?`<img class="zoomable-image-slot" data-zoomable-image data-zoom-title="${esc(a.title)}" src="${asset(a.image)}" alt="${esc(a.title)}">`:`<div class="blue-placeholder modal-image zoomable-image-slot" data-zoom-placeholder="${esc(a.title)}">${esc(a.title)}</div>`;
        openModal(`<h2>${esc(a.title)}</h2><p class="eyebrow award-eyebrow">${esc(a.year)} · ${esc(a.level)}</p><div class="modal-image">${img}</div><p>${esc(a.detail)}</p>`,true);
      }
      return;
    }

    const v=e.target.closest("[data-video-index]");
    if(v){
      const item=d.videoWorks[Number(v.dataset.videoIndex)];
      openModal(`<h2>${esc(item.title)}</h2><div class="frame-wrap">${item.biliSrc?`<iframe src="${normalize(item.biliSrc)}" title="${esc(item.title)}" allowfullscreen allow="fullscreen; autoplay"></iframe>`:`<div class="empty-tip">视频作品整理中</div>`}</div>`);
      return;
    }

    const g=e.target.closest("[data-game-index]");
    if(g){
      const item=d.miniGames[Number(g.dataset.gameIndex)];
      openModal(`<h2>${esc(item.title)}</h2><p>${esc(item.detail)}</p><div class="frame-wrap">${item.iframe?`<iframe src="${normalize(item.iframe)}" title="${esc(item.title)}" allowfullscreen></iframe>`:`<div class="empty-tip">互动内容准备中</div>`}</div>`);
      return;
    }

    const nav=e.target.closest("#navToggle");
    if(nav)document.querySelector(".site-header").classList.toggle("is-open");
  });
  addEventListener("keydown",e=>{
    if(e.key==="Escape"){
      const zoom=document.querySelector(".zoom-overlay");
      if(zoom){zoom.remove();return}
      closeModal();
    }
  });
}

/* DOM 渲染后加入直接定位 */
document.addEventListener("DOMContentLoaded",()=>{
  setTimeout(initSectionQueryJump, 0);
});


/* ================= V10 overrides ================= */

/* 白天黑夜按钮无文字图案，仅同步 data-mode */
function initTheme(d){
  const root=document.documentElement;
  const btn=document.getElementById("themeToggle");
  const saved=localStorage.getItem("zw-theme")||(((window.SITE_DATA&&window.SITE_DATA.site&&window.SITE_DATA.site.defaultTheme)==='dark')?'dark':'light');
  root.setAttribute("data-theme",saved);
  if(btn){
    btn.setAttribute("data-mode",saved);
    btn.setAttribute("aria-label", saved==="dark" ? "切换为白天模式" : "切换为黑夜模式");
    btn.innerHTML="<span></span>";
    btn.onclick=()=>{
      const next=root.getAttribute("data-theme")==="dark"?"light":"dark";
      root.setAttribute("data-theme",next);
      localStorage.setItem("zw-theme",next);
      btn.setAttribute("data-mode",next);
      btn.setAttribute("aria-label", next==="dark" ? "切换为白天模式" : "切换为黑夜模式");
    };
  }
}

/* 前页擦除：改为光刷/雾面玻璃擦除，移动越快越明显 */
function initScratchEntry(d){
  const canvas=document.getElementById("scratchCanvas");
  if(!canvas)return;
  const ctx=canvas.getContext("2d",{alpha:true});
  const meter=document.getElementById("scratchMeterFill");
  const fallback=document.getElementById("entryFallback");
  const card=document.querySelector(".entry-minimal-card");
  let w=0,h=0,dpr=1,last=null,energy=0,entering=false,raf=0;

  function resize(){
    w=innerWidth; h=innerHeight; dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.floor(w*dpr); canvas.height=Math.floor(h*dpr);
    canvas.style.width=w+"px"; canvas.style.height=h+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    drawLayer();
  }
  function drawLayer(){
    ctx.globalCompositeOperation="source-over";
    const g=ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,"rgba(248,250,252,.92)");
    g.addColorStop(.45,"rgba(225,235,245,.90)");
    g.addColorStop(1,"rgba(248,236,204,.88)");
    ctx.fillStyle=g;
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle="rgba(7,17,31,.045)";
    for(let i=0;i<260;i++){
      const x=(i*131)%w, y=(i*71)%h;
      ctx.fillRect(x,y,1.2,1.2);
    }
  }
  function restore(){
    ctx.globalCompositeOperation="source-over";
    ctx.fillStyle="rgba(238,244,250,.030)";
    ctx.fillRect(0,0,w,h);
  }
  function brush(x,y,r,speed){
    ctx.globalCompositeOperation="destination-out";
    const grad=ctx.createRadialGradient(x,y,0,x,y,r);
    grad.addColorStop(0,"rgba(0,0,0,.92)");
    grad.addColorStop(.42,"rgba(0,0,0,.62)");
    grad.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=grad;
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();

    ctx.globalCompositeOperation="lighter";
    const glow=ctx.createRadialGradient(x,y,0,x,y,r*1.35);
    glow.addColorStop(0,"rgba(126,232,255,.18)");
    glow.addColorStop(1,"rgba(126,232,255,0)");
    ctx.fillStyle=glow;
    ctx.beginPath();ctx.arc(x,y,r*1.35,0,Math.PI*2);ctx.fill();
  }
  function enter(){
    if(entering)return;
    entering=true;
    document.body.classList.add("is-entering");
    setTimeout(()=>location.href="./home.html",560);
  }
  function move(e){
    if(entering)return;
    const now=performance.now(), x=e.clientX, y=e.clientY;
    if(card){
      const r=card.getBoundingClientRect();
      const cx=r.left+r.width/2, cy=r.top+r.height/2;
      const rx=(y-cy)/r.height*-5, ry=(x-cx)/r.width*5;
      card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
    }
    if(last){
      const dx=x-last.x,dy=y-last.y,dt=Math.max(16,now-last.t);
      const dist=Math.hypot(dx,dy), speed=dist/dt*1000;
      const r=Math.max(68,Math.min(170,64+speed*.052));
      brush(x,y,r,speed);
      if(speed>650)energy+=dist*Math.min(speed/900,2.5); else energy*=.965;
      if(meter)meter.style.width=Math.max(0,Math.min(100,energy/2600*100))+"%";
      if(energy>2600)enter();
    }else{
      brush(x,y,86,0);
    }
    last={x,y,t:now};
  }
  function leave(){
    if(card)card.style.transform="";
  }
  function loop(){
    if(!entering){
      restore();
      energy*=.992;
      if(meter)meter.style.width=Math.max(0,Math.min(100,energy/2600*100))+"%";
    }
    raf=requestAnimationFrame(loop);
  }
  addEventListener("resize",resize,{passive:true});
  addEventListener("pointermove",move,{passive:true});
  addEventListener("pointerleave",leave,{passive:true});
  if(fallback)fallback.addEventListener("click",e=>{e.preventDefault();enter()});
  resize(); loop();
}

/* 头像素材不作为可放大图处理 */
function renderBindings(d){
 document.querySelectorAll("[data-text]").forEach(el=>{const v=get(d,el.dataset.text);if(v!==undefined)el.textContent=v});
 document.querySelectorAll("[data-rich-title]").forEach(el=>{const title=get(d,el.dataset.richTitle)||"",hi=get(d,el.dataset.highlight)||"";el.innerHTML=hi&&title.includes(hi)?esc(title).replace(esc(hi),`<span class="gradient-text">${esc(hi)}</span>`):esc(title)});
 document.querySelectorAll("[data-audio]").forEach(el=>{const src=get(d,el.dataset.audio);if(src)el.src=asset(src)});
 document.querySelectorAll("[data-image]").forEach(el=>{
   const path=el.dataset.image;
   const src=get(d,path), cls=el.dataset.class||"", pc=el.dataset.placeholderClass||"blue-placeholder", ph=cleanLabel(el.dataset.placeholder||d.ui.imagePlaceholder);
   const isIcon=/icon|game-thumb|tool/i.test(cls);
   const isEggy=path==="eggy.image" || /eggy-png/.test(cls);
   const isPortrait=path==="hero.avatar" || /portrait/.test(cls);
   const zoomable=(!isIcon&&!isEggy&&!isPortrait);
   if(src) el.outerHTML=`<img class="${cls}${zoomable?' zoomable-image-slot':''}" ${zoomable?'data-zoomable-image':''} data-zoom-title="${esc(ph)}" src="${asset(src)}" alt="${esc(ph)}">`;
   else el.outerHTML=`<div class="${pc}${zoomable?' zoomable-image-slot':''}" ${zoomable?'data-zoom-placeholder="'+esc(ph)+'"':''}>${esc(isEggy?'形象展示':ph)}</div>`;
 });
}

/* 游戏图标可拖拽到任意位置，松手后回弹 */
function initGameMagnet(){
  const cards=[...document.querySelectorAll("[data-game-card]")];
  if(!cards.length)return;
  let active=null,startX=0,startY=0,dx=0,dy=0;

  function pushFrom(card, px, py, strength=80, range=340){
    cards.forEach(other=>{
      if(other===card)return;
      const ox=Number(other.dataset.homeX||0), oy=Number(other.dataset.homeY||0);
      const vx=ox-px, vy=oy-py;
      const dist=Math.max(1,Math.hypot(vx,vy));
      if(dist<range){
        const power=(range-dist)/range*strength;
        const ang=Math.atan2(vy,vx);
        other.style.setProperty("--push-x",Math.cos(ang)*power+"px");
        other.style.setProperty("--push-y",Math.sin(ang)*power+"px");
        other.classList.add("is-neighbor");
      }
    });
  }
  function resetPush(){
    cards.forEach(c=>{
      c.style.setProperty("--push-x","0px");
      c.style.setProperty("--push-y","0px");
      c.classList.remove("is-neighbor","is-hover");
    });
  }
  cards.forEach(card=>{
    card.addEventListener("pointerdown",e=>{
      active=card;
      startX=e.clientX; startY=e.clientY;
      dx=0; dy=0;
      card.classList.add("is-dragging","is-hover");
      card.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    card.addEventListener("pointermove",e=>{
      if(active!==card)return;
      dx=e.clientX-startX;
      dy=e.clientY-startY;
      card.style.setProperty("--drag-x",dx+"px");
      card.style.setProperty("--drag-y",dy+"px");
      resetPush();
      pushFrom(card,Number(card.dataset.homeX||0)+dx,Number(card.dataset.homeY||0)+dy,92,380);
    });
    function endDrag(){
      if(active!==card)return;
      active=null;
      card.classList.remove("is-dragging","is-hover");
      card.style.setProperty("--drag-x","0px");
      card.style.setProperty("--drag-y","0px");
      resetPush();
    }
    card.addEventListener("pointerup",endDrag);
    card.addEventListener("pointercancel",endDrag);
    card.addEventListener("mouseenter",()=>{if(active)return;resetPush();card.classList.add("is-hover");pushFrom(card,Number(card.dataset.homeX||0),Number(card.dataset.homeY||0),54,320)});
    card.addEventListener("mouseleave",()=>{if(active)return;resetPush()});
  });
}

/* 弹窗关闭按钮修复：优先捕获关闭动作，避免被其他委托覆盖 */
document.addEventListener("click", function(e){
  const close = e.target.closest(".modal-close,[data-close-modal]");
  if(close){
    e.preventDefault();
    e.stopPropagation();
    if(typeof closeModal === "function") closeModal();
    document.querySelectorAll(".zoom-overlay").forEach(x=>x.remove());
  }
}, true);

/* 弹窗逻辑补丁：叉叉关闭稳定，技能弹窗不影响关闭 */
function closeModal(){
  document.querySelectorAll(".modal.is-open").forEach(modal=>{
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden","true");
    const c=modal.querySelector("#modalContent");
    if(c)c.innerHTML="";
  });
}

/* 展示素材建议：在控制台可读；README 中也已写明 */
window.ZHUWEIXIAN_MATERIAL_GUIDE = window.APP_DATA?.materialGuide || null;


/* ================= V11 overrides：游戏性能优化、花絮交互、前页门槛、Contact ================= */

function renderGames(d){
  const sorted=[...d.games].sort((a,b)=>(b.size||0)-(a.size||0));
  const points=[
    [0,0,112],
    [0,-132,94],[114,-66,94],[114,66,92],[0,132,92],[-114,66,92],[-114,-66,92],
    [0,-264,78],[114,-198,78],[228,-132,76],[228,0,76],[228,132,76],[114,198,74],
    [0,264,74],[-114,198,74],[-228,132,72],[-228,0,72],[-228,-132,72],[-114,-198,72]
  ];
  const played = sorted.map((g,i)=>{
    const [x,y,s]=points[i]||[0,0,72];
    const icon=g.icon?`<img class="game-thumb-img" src="${asset(g.icon)}" alt="${esc(g.name)}">`:`<div class="game-thumb-placeholder">${esc(d.ui.iconPlaceholder)}</div>`;
    return `<article class="game-card apple-watch-app" data-game-card data-played="1" data-home-x="${x}" data-home-y="${y}" style="--home-x:${x}px;--home-y:${y}px;--s:${s}px;--float-range:${14 + (i%4)*4}px;--float-duration:${8 + (i%5)*1.3}s;--float-delay:${-(i%7)}s">
      <div class="game-inner">${icon}<span>${esc(g.name)}<br>${esc(g.time)}</span></div>
    </article>`;
  }).join("");

  const amb = d.ambientGameIcons || [];
  const sidePositions = makeAmbientPositions(amb.length);
  const ambient = amb.map((g,i)=>{
    const [x,y,s]=sidePositions[i];
    const icon=g.icon?`<img class="ambient-game-thumb" src="${asset(g.icon)}" alt="">`:`<div class="ambient-game-placeholder"></div>`;
    return `<article class="ambient-game-card" data-game-card data-ambient="1" data-home-x="${x}" data-home-y="${y}" style="--home-x:${x}px;--home-y:${y}px;--s:${s}px;--float-range:${10 + (i%5)*3}px;--float-duration:${9 + (i%6)*1.2}s;--float-delay:${-(i%9)}s">
      <div class="ambient-game-inner">${icon}</div>
    </article>`;
  }).join("");

  return ambient + played;
}

function makeAmbientPositions(n){
  const base = [
    [-520,-280,50],[-440,-220,44],[-560,-120,46],[-470,-40,54],[-610,30,42],[-500,125,50],[-570,235,44],[-420,290,48],
    [-350,-310,42],[-325,-145,48],[-330,70,44],[-360,210,52],[-650,-220,40],[-690,-40,42],[-670,160,40],[-270,310,42],
    [520,-280,50],[440,-220,44],[560,-120,46],[470,-40,54],[610,30,42],[500,125,50],[570,235,44],[420,290,48],
    [350,-310,42],[325,-145,48],[330,70,44],[360,210,52],[650,-220,40],[690,-40,42],[670,160,40],[270,310,42],
    [-720,300,38],[-730,-300,38],[720,300,38],[730,-300,38]
  ];
  const out=[];
  for(let i=0;i<n;i++) out.push(base[i%base.length]);
  return out;
}

function initGameMagnet(){
  const cards=[...document.querySelectorAll("[data-game-card]")];
  if(!cards.length)return;

  const state = cards.map(el=>({
    el,
    x:Number(el.dataset.homeX||0),
    y:Number(el.dataset.homeY||0),
    pushX:0,
    pushY:0,
    dragX:0,
    dragY:0,
    affected:false
  }));
  const byEl = new Map(state.map(s=>[s.el,s]));
  let active=null,startX=0,startY=0,raf=0,hovered=null;

  function apply(){
    raf=0;
    for(const s of state){
      s.el.style.setProperty("--push-x",s.pushX.toFixed(1)+"px");
      s.el.style.setProperty("--push-y",s.pushY.toFixed(1)+"px");
      s.el.style.setProperty("--drag-x",s.dragX.toFixed(1)+"px");
      s.el.style.setProperty("--drag-y",s.dragY.toFixed(1)+"px");
      s.el.classList.toggle("is-neighbor",s.affected);
    }
  }
  function schedule(){
    if(!raf) raf=requestAnimationFrame(apply);
  }
  function reset(){
    for(const s of state){
      s.pushX=0;s.pushY=0;s.affected=false;
      s.el.classList.remove("is-hover");
    }
    schedule();
  }
  function pushFrom(source, px, py, strength=60, range=330){
    for(const s of state){
      if(s===source) continue;
      const vx=s.x-px, vy=s.y-py;
      const dist=Math.max(1,Math.hypot(vx,vy));
      if(dist<range){
        const power=(range-dist)/range*strength;
        const ang=Math.atan2(vy,vx);
        s.pushX=Math.cos(ang)*power;
        s.pushY=Math.sin(ang)*power;
        s.affected=true;
      }else{
        s.pushX=0;s.pushY=0;s.affected=false;
      }
    }
    schedule();
  }

  for(const card of cards){
    const s=byEl.get(card);
    card.addEventListener("pointerdown",e=>{
      active=s;hovered=null;startX=e.clientX;startY=e.clientY;
      s.el.classList.add("is-dragging","is-hover");
      s.el.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    card.addEventListener("pointermove",e=>{
      if(active!==s)return;
      s.dragX=e.clientX-startX;
      s.dragY=e.clientY-startY;
      pushFrom(s,s.x+s.dragX,s.y+s.dragY,88,390);
      schedule();
    });
    function release(){
      if(active!==s)return;
      active=null;
      s.el.classList.remove("is-dragging","is-hover");
      s.dragX=0;s.dragY=0;
      reset();
    }
    card.addEventListener("pointerup",release);
    card.addEventListener("pointercancel",release);
    card.addEventListener("mouseenter",()=>{
      if(active)return;
      hovered=s;
      reset();
      s.el.classList.add("is-hover");
      pushFrom(s,s.x,s.y,s.el.dataset.ambient?40:56,s.el.dataset.ambient?240:350);
    });
    card.addEventListener("mouseleave",()=>{
      if(active)return;
      if(hovered===s) hovered=null;
      reset();
    });
  }
}

function renderMakingCards(d){
  const b=d.behindScenes;
  return `<article class="making-card" data-making="process"><span class="making-type">Process</span><h2>${esc(b.processTitle)}</h2><p>${esc(b.processDesc)}</p><b class="card-link">点击查看导图 →</b></article>
  <article class="making-card" data-making="tools"><span class="making-type">Tools</span><h2>${esc(b.toolsTitle)}</h2><p>${esc(b.toolsDesc)}</p><b class="card-link">点击查看工具 →</b></article>
  <article class="making-card duration-card" data-making="duration"><span class="making-type">Duration</span><h2>${esc(b.durationTitle)}</h2><p>${esc(b.durationDesc)}</p><b class="card-link">点击查看耗时 →</b></article>`;
}

function initMakingModals(d){
  document.addEventListener("click",e=>{
    const card=e.target.closest("[data-making]");
    if(!card)return;
    const b=d.behindScenes;

    if(card.dataset.making==="process"){
      const nodes=b.processNodes.map((n,i)=>{
        const visual=n.image
          ? `<img class="zoomable-image-slot" data-zoomable-image data-zoom-title="${esc(n.title)}" src="${asset(n.image)}" alt="${esc(n.title)}">`
          : `<div class="image-placeholder zoomable-image-slot" data-zoom-placeholder="${esc(n.title)}">${esc(n.title)}</div>`;
        return `<article class="process-node-v9">
          <div class="process-node-copy"><span>0${i+1}</span><h3>${esc(n.title)}</h3><p>${esc(n.desc)}</p></div>
          <div class="process-node-visual">${visual}</div>
        </article>`;
      }).join("");
      openModal(`<h2>${esc(b.processTitle)}</h2><p>${esc(b.processDesc)}</p><div class="process-map-v9">${nodes}</div>`);
    }

    if(card.dataset.making==="tools"){
      const tools=b.tools.map(t=>`<div class="tool-modal-card">${t.icon?`<img src="${asset(t.icon)}" alt="${esc(t.name)}">`:`<div class="tool-icon-placeholder">${esc(t.name.slice(0,2))}</div>`}<h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p></div>`).join("");
      openModal(`<h2>${esc(b.toolsTitle)}</h2><p>${esc(b.toolsDesc)}</p><div class="tool-modal-grid">${tools}</div>`);
    }

    if(card.dataset.making==="duration"){
      openDurationWall();
    }
  });
}

function openDurationWall(){
  document.querySelectorAll(".duration-marquee-wall").forEach(x=>x.remove());
  const words=["三天","3 DAYS","THREE DAYS","三日","3日","72 HOURS","SEVENTY-TWO HOURS","三天"];
  const row = () => `<div class="duration-marquee-row">${Array(3).fill(words.map(w=>`<span>${w}</span>`).join("")).join("")}</div>`;
  const div=document.createElement("div");
  div.className="duration-marquee-wall";
  div.innerHTML=`<button class="duration-marquee-close" type="button" aria-label="关闭">×</button>${row()}${row()}${row()}${row()}${row()}`;
  document.body.appendChild(div);
  div.querySelector(".duration-marquee-close").onclick=()=>div.remove();
  div.addEventListener("click",e=>{if(e.target===div)div.remove()});
}

/* Contact 输出增强：让复制按钮在结构上更清晰 */
function renderComponents(d){
 document.querySelectorAll("[data-render]").forEach(n=>{const t=n.dataset.render;
  if(t==="header")n.innerHTML=renderHeader(d);
  if(t==="heroButtons")n.innerHTML=d.hero.buttons.map(b=>`<a class="btn ${b.style==="primary"?"primary":"ghost"} magnetic" href="${link(b.href)}">${esc(b.label)}</a>`).join("");
  if(t==="heroStats")n.innerHTML=d.hero.stats.map(s=>`<div><strong>${esc(s.num)}</strong><span>${esc(s.label)}</span></div>`).join("");
  if(t==="heroTags")n.innerHTML=d.hero.tags.map((x,i)=>`<div class="floating-tag tag-${["a","b","c"][i]||"a"}">${esc(x)}</div>`).join("");
  if(t==="identity")n.innerHTML=d.identity.map(i=>`<div><span>${esc(i.label)}</span><strong>${esc(i.value)}</strong></div>`).join("");
  if(t==="portfolioCategoriesHome")n.innerHTML=renderPortfolioCats(d,false);
  if(t==="portfolioHub")n.innerHTML=`<div class="portfolio-hub-grid">${renderPortfolioCats(d,true)}</div>`;
  if(t==="experienceCards")n.innerHTML=d.experienceCards.map(c=>`<a class="experience-choice-card reveal-up tilt-card" href="${link(c.href)}"><span>${esc(c.type)}</span><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p><b class="card-link">${esc(d.ui.experienceEnter)} →</b></a>`).join("");
  if(t==="skills")n.innerHTML=renderSkills(d);
  if(t==="games")n.innerHTML=renderGames(d);
  if(t==="awards")n.innerHTML=renderAwards(d);
  if(t==="contact")n.innerHTML=`<button class="copy-link contact-phone" data-copy="${esc(d.site.phone)}"><small>${esc(d.ui.copyPhone)}</small><strong>${esc(d.site.phone)}</strong><em>点击复制</em></button><button class="copy-link contact-mail" data-copy="${esc(d.site.email)}"><small>${esc(d.ui.copyEmail)}</small><strong>${esc(d.site.email)}</strong><em>点击复制</em></button>`;
  if(t==="modalRoot")n.innerHTML=renderModalRoot(d);
  if(t==="pageHero")n.innerHTML=renderPageHero(d,document.body.dataset.page);
  if(t==="videoWorks")n.innerHTML=`<div class="video-list">${renderVideoWorks(d)}</div>`;
  if(t==="graphicWorks")n.innerHTML=`<div class="pinterest-wall">${renderGraphicWorks(d)}</div>`;
  if(t==="musicWorks")n.innerHTML=`<div class="music-grid">${renderMusicWorks(d)}</div>`;
  if(t==="miniGames")n.innerHTML=renderMiniGames(d);
  if(t==="campusExperiences")n.innerHTML=renderExperienceList(d,d.campusExperiences);
  if(t==="projectExperiences")n.innerHTML=renderExperienceList(d,d.projectExperiences);
  if(t==="eggyDetail")n.innerHTML=renderEggyDetail(d);
  if(t==="makingCards")n.innerHTML=renderMakingCards(d);
 });
}

/* 前页擦除门槛再加长，需要快速重复滑动 */
function initScratchEntry(d){
  const canvas=document.getElementById("scratchCanvas");
  if(!canvas)return;
  const ctx=canvas.getContext("2d",{alpha:true});
  const meter=document.getElementById("scratchMeterFill");
  const fallback=document.getElementById("entryFallback");
  const card=document.querySelector(".entry-minimal-card");
  let w=0,h=0,dpr=1,last=null,energy=0,entering=false;

  function resize(){
    w=innerWidth; h=innerHeight; dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.floor(w*dpr); canvas.height=Math.floor(h*dpr);
    canvas.style.width=w+"px"; canvas.style.height=h+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    drawLayer();
  }
  function drawLayer(){
    ctx.globalCompositeOperation="source-over";
    const g=ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,"rgba(248,250,252,.94)");
    g.addColorStop(.45,"rgba(225,235,245,.92)");
    g.addColorStop(1,"rgba(248,236,204,.90)");
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    ctx.fillStyle="rgba(7,17,31,.045)";
    for(let i=0;i<280;i++)ctx.fillRect((i*131)%w,(i*71)%h,1.2,1.2);
  }
  function restore(){
    ctx.globalCompositeOperation="source-over";
    ctx.fillStyle="rgba(238,244,250,.038)";
    ctx.fillRect(0,0,w,h);
  }
  function brush(x,y,r){
    ctx.globalCompositeOperation="destination-out";
    const grad=ctx.createRadialGradient(x,y,0,x,y,r);
    grad.addColorStop(0,"rgba(0,0,0,.90)");
    grad.addColorStop(.42,"rgba(0,0,0,.54)");
    grad.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=grad;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  }
  function enter(){
    if(entering)return;
    entering=true;
    document.body.classList.add("is-entering");
    setTimeout(()=>location.href="./home.html",560);
  }
  function move(e){
    if(entering)return;
    const now=performance.now(), x=e.clientX, y=e.clientY;
    if(card){
      const r=card.getBoundingClientRect();
      const cx=r.left+r.width/2, cy=r.top+r.height/2;
      card.style.transform=`perspective(900px) rotateX(${(y-cy)/r.height*-5}deg) rotateY(${(x-cx)/r.width*5}deg) translateY(-5px)`;
    }
    if(last){
      const dx=x-last.x,dy=y-last.y,dt=Math.max(16,now-last.t);
      const dist=Math.hypot(dx,dy), speed=dist/dt*1000;
      brush(x,y,Math.max(58,Math.min(150,58+speed*.040)));
      if(speed>1180 && dist>18) energy+=dist*Math.min(speed/1200,2.3);
      else energy*=.955;
      if(meter)meter.style.width=Math.max(0,Math.min(100,energy/7600*100))+"%";
      if(energy>7600)enter();
    }else brush(x,y,76);
    last={x,y,t:now};
  }
  function loop(){
    if(!entering){
      restore();
      energy*=.987;
      if(meter)meter.style.width=Math.max(0,Math.min(100,energy/7600*100))+"%";
    }
    requestAnimationFrame(loop);
  }
  addEventListener("resize",resize,{passive:true});
  addEventListener("pointermove",move,{passive:true});
  addEventListener("pointerleave",()=>{if(card)card.style.transform=""},{passive:true});
  if(fallback)fallback.addEventListener("click",e=>{e.preventDefault();enter()});
  resize();loop();
}


/* ================= V12 overrides：制作流程图片点击、游戏阅历轻量拖拽 ================= */

/* 制作流程图片点击大图：用捕获阶段优先处理，避免被制作流程弹窗父级点击逻辑吞掉 */
document.addEventListener("click", function(e){
  const target = e.target.closest(".process-node-visual [data-zoomable-image], .process-node-visual [data-zoom-placeholder], .process-node-visual .image-placeholder");
  if(!target) return;
  e.preventDefault();
  e.stopPropagation();

  const img = target.matches("img") ? target : target.querySelector("img");
  const title = (target.dataset.zoomTitle || target.dataset.zoomPlaceholder || target.textContent || "流程图片").trim();
  const visual = img
    ? `<div class="zoom-modal-visual"><img src="${img.src}" alt="${esc(title)}"></div>`
    : `<div class="zoom-modal-visual"><div class="blue-placeholder">${esc(title)}</div></div>`;

  if(typeof openZoomLayer === "function") openZoomLayer(title, visual);
}, true);

/* 更轻量的游戏布局：中心体验游戏 + 两侧氛围图标 */
function renderGames(d){
  const sorted=[...d.games].sort((a,b)=>(b.size||0)-(a.size||0));
  const points=[
    [0,0,112],
    [0,-132,94],[114,-66,94],[114,66,92],[0,132,92],[-114,66,92],[-114,-66,92],
    [0,-264,78],[114,-198,78],[228,-132,76],[228,0,76],[228,132,76],[114,198,74],
    [0,264,74],[-114,198,74],[-228,132,72],[-228,0,72],[-228,-132,72],[-114,-198,72]
  ];
  const played = sorted.map((g,i)=>{
    const [x,y,s]=points[i]||[0,0,72];
    const icon=g.icon?`<img class="game-thumb-img" src="${asset(g.icon)}" alt="${esc(g.name)}">`:`<div class="game-thumb-placeholder">${esc(d.ui.iconPlaceholder)}</div>`;
    return `<article class="game-card" data-game-card data-played="1" data-home-x="${x}" data-home-y="${y}" style="--home-x:${x}px;--home-y:${y}px;--s:${s}px">
      <div class="game-inner">${icon}<span>${esc(g.name)}<br>${esc(g.time)}</span></div>
    </article>`;
  }).join("");

  const amb = d.ambientGameIcons || [];
  const sidePositions = makeAmbientPositionsV12(amb.length);
  const ambient = amb.map((g,i)=>{
    const [x,y,s]=sidePositions[i];
    const icon=g.icon?`<img class="ambient-game-thumb" src="${asset(g.icon)}" alt="">`:`<div class="ambient-game-placeholder"></div>`;
    return `<article class="ambient-game-card" data-game-card data-ambient="1" data-home-x="${x}" data-home-y="${y}" style="--home-x:${x}px;--home-y:${y}px;--s:${s}px">
      <div class="ambient-game-inner">${icon}</div>
    </article>`;
  }).join("");

  return ambient + played;
}

function makeAmbientPositionsV12(n){
  const base = [
    [-520,-280,50],[-440,-220,44],[-560,-120,46],[-470,-40,54],[-610,30,42],[-500,125,50],[-570,235,44],[-420,290,48],
    [-350,-310,42],[-325,-145,48],[-330,70,44],[-360,210,52],[-650,-220,40],[-690,-40,42],[-670,160,40],[-270,310,42],
    [520,-280,50],[440,-220,44],[560,-120,46],[470,-40,54],[610,30,42],[500,125,50],[570,235,44],[420,290,48],
    [350,-310,42],[325,-145,48],[330,70,44],[360,210,52],[650,-220,40],[690,-40,42],[670,160,40],[270,310,42],
    [-720,300,38],[-730,-300,38],[720,300,38],[730,-300,38]
  ];
  return Array.from({length:n},(_,i)=>base[i%base.length]);
}

/* 游戏交互重写：无随机浮动；只在 hover / drag 时计算少量变换 */
function initGameMagnet(){
  const els=[...document.querySelectorAll("[data-game-card]")];
  if(!els.length) return;

  const items=els.map(el=>({
    el,
    x:Number(el.dataset.homeX||0),
    y:Number(el.dataset.homeY||0),
    pushX:0,
    pushY:0,
    dragX:0,
    dragY:0,
    active:false,
    neighbor:false
  }));
  const map=new Map(items.map(i=>[i.el,i]));
  let dragging=null, startX=0, startY=0, raf=0;

  function schedule(){
    if(raf) return;
    raf=requestAnimationFrame(()=>{
      raf=0;
      for(const it of items){
        it.el.style.setProperty("--push-x",it.pushX.toFixed(1)+"px");
        it.el.style.setProperty("--push-y",it.pushY.toFixed(1)+"px");
        it.el.style.setProperty("--drag-x",it.dragX.toFixed(1)+"px");
        it.el.style.setProperty("--drag-y",it.dragY.toFixed(1)+"px");
        it.el.classList.toggle("is-neighbor",it.neighbor);
      }
    });
  }

  function clearEffects(){
    for(const it of items){
      it.pushX=0;
      it.pushY=0;
      it.neighbor=false;
    }
  }

  function resetAll(){
    for(const it of items){
      it.pushX=0;
      it.pushY=0;
      it.dragX=0;
      it.dragY=0;
      it.neighbor=false;
      it.el.classList.remove("is-hover","is-neighbor","is-dragging");
    }
    schedule();
  }

  function repel(source, px, py, range, strength){
    for(const it of items){
      if(it===source){
        it.neighbor=false;
        continue;
      }
      const vx=it.x-px;
      const vy=it.y-py;
      const dist=Math.max(1,Math.hypot(vx,vy));
      if(dist<range){
        const power=(1-dist/range)*strength;
        const a=Math.atan2(vy,vx);
        it.pushX=Math.cos(a)*power;
        it.pushY=Math.sin(a)*power;
        it.neighbor=true;
      }else{
        it.pushX=0;
        it.pushY=0;
        it.neighbor=false;
      }
    }
    schedule();
  }

  for(const el of els){
    const it=map.get(el);
    el.addEventListener("pointerdown",e=>{
      dragging=it;
      startX=e.clientX;
      startY=e.clientY;
      el.classList.add("is-dragging","is-hover");
      el.setPointerCapture(e.pointerId);
      e.preventDefault();
    }, {passive:false});

    el.addEventListener("pointermove",e=>{
      if(dragging!==it) return;
      it.dragX=e.clientX-startX;
      it.dragY=e.clientY-startY;
      repel(it,it.x+it.dragX,it.y+it.dragY,it.el.dataset.ambient?240:340,it.el.dataset.ambient?38:68);
    }, {passive:true});

    function release(){
      if(dragging!==it) return;
      dragging=null;
      resetAll();
    }
    el.addEventListener("pointerup",release,{passive:true});
    el.addEventListener("pointercancel",release,{passive:true});

    el.addEventListener("mouseenter",()=>{
      if(dragging) return;
      resetAll();
      el.classList.add("is-hover");
      repel(it,it.x,it.y,it.el.dataset.ambient?180:280,it.el.dataset.ambient?26:42);
    }, {passive:true});

    el.addEventListener("mouseleave",()=>{
      if(dragging) return;
      resetAll();
    }, {passive:true});
  }
}


/* ================= V13 overrides：简历页、小游戏页、Contact复制、可拖拽缩放大图、导航简历 ================= */

function renderHeader(d){
  const inPage=location.pathname.includes("/pages/");
  const home=inPage?"../home.html":"./home.html";
  const page=p=>inPage?`./${p}`:`./pages/${p}`;
  const section=id=>inPage?`../home.html?section=${id}`:`#${id}`;
  const entries=[
    ["首页",section("profile"),"home-nav"],
    ["作品集",page("portfolio.html"),""],
    ["经历",section("experience"),""],
    ["技能",section("skills"),""],
    ["游戏阅历",section("games"),""],
    ["获奖",section("awards"),""],
    ["简历",page("resume.html"),"resume-nav"],
    ["网站制作花絮",page("making-of.html"),"making-nav"],
    ["回到前页",inPage?"../index.html":"./index.html","back-entry"]
  ];
  return `<div class="nav-inner">
    <a class="brand" href="${home}"><span class="brand-text">ZHU WEIXIAN</span></a>
    <button class="nav-toggle" type="button" id="navToggle">菜单</button>
    <nav class="nav-links">${entries.map(([label,href,cls])=>`<a class="${cls}" href="${href}">${label}</a>`).join("")}</nav>
    <button class="theme-toggle" id="themeToggle" type="button" aria-label="切换白天或黑夜模式"></button>
  </div>`;
}

function renderComponents(d){
 document.querySelectorAll("[data-render]").forEach(n=>{const t=n.dataset.render;
  if(t==="header")n.innerHTML=renderHeader(d);
  if(t==="heroButtons")n.innerHTML=d.hero.buttons.map(b=>`<a class="btn ${b.style==="primary"?"primary":"ghost"} magnetic" href="${link(b.href)}">${esc(b.label)}</a>`).join("");
  if(t==="heroStats")n.innerHTML=d.hero.stats.map(s=>`<div><strong>${esc(s.num)}</strong><span>${esc(s.label)}</span></div>`).join("");
  if(t==="heroTags")n.innerHTML=d.hero.tags.map((x,i)=>`<div class="floating-tag tag-${["a","b","c"][i]||"a"}">${esc(x)}</div>`).join("");
  if(t==="identity")n.innerHTML=d.identity.map(i=>`<div><span>${esc(i.label)}</span><strong>${esc(i.value)}</strong></div>`).join("");
  if(t==="portfolioCategoriesHome")n.innerHTML=renderPortfolioCats(d,false);
  if(t==="portfolioHub")n.innerHTML=`<div class="portfolio-hub-grid">${renderPortfolioCats(d,true)}</div>`;
  if(t==="experienceCards")n.innerHTML=d.experienceCards.map(c=>`<a class="experience-choice-card reveal-up tilt-card" href="${link(c.href)}"><span>${esc(c.type)}</span><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p><b class="card-link">${esc(d.ui.experienceEnter)} →</b></a>`).join("");
  if(t==="skills")n.innerHTML=renderSkills(d);
  if(t==="games")n.innerHTML=renderGames(d);
  if(t==="awards")n.innerHTML=renderAwards(d);
  if(t==="contact")n.innerHTML=`<button class="copy-link contact-phone" data-copy="${esc(d.site.phone)}"><small>${esc(d.ui.copyPhone||"电话")}</small><strong>${esc(d.site.phone)}</strong><em>点击复制</em></button><button class="copy-link contact-mail" data-copy="${esc(d.site.email)}"><small>${esc(d.ui.copyEmail||"邮箱")}</small><strong>${esc(d.site.email)}</strong><em>点击复制</em></button>`;
  if(t==="modalRoot")n.innerHTML=renderModalRoot(d);
  if(t==="pageHero")n.innerHTML=renderPageHero(d,document.body.dataset.page);
  if(t==="videoWorks")n.innerHTML=`<div class="video-list">${renderVideoWorks(d)}</div>`;
  if(t==="graphicWorks")n.innerHTML=`<div class="pinterest-wall">${renderGraphicWorks(d)}</div>`;
  if(t==="musicWorks")n.innerHTML=`<div class="music-grid">${renderMusicWorks(d)}</div>`;
  if(t==="miniGames")n.innerHTML=renderMiniGames(d);
  if(t==="campusExperiences")n.innerHTML=renderExperienceList(d,d.campusExperiences);
  if(t==="projectExperiences")n.innerHTML=renderExperienceList(d,d.projectExperiences);
  if(t==="eggyDetail")n.innerHTML=renderEggyDetail(d);
  if(t==="makingCards")n.innerHTML=renderMakingCards(d);
  if(t==="resumePage")n.innerHTML=renderResumePage(d);
 });
}

function renderMiniGames(d){
  const games=d.miniGames||[];
  const first=games[0];
  const rest=games.slice(1);
  const feature=first?`<article class="game-work-feature">
    ${imageOr(first.cover,"game-cover",first.title)}
    <div class="game-work-copy">
      <p class="eyebrow">Godot Web Demo</p>
      <h2>${esc(first.title)}</h2>
      <p>${esc(first.desc)}</p>
      <button class="run-game-btn" type="button" data-game-index="0"><span>运行游戏</span></button>
    </div>
  </article>`:"";
  const cards=rest.map((g,i)=>`<article class="game-work-card">
    ${imageOr(g.cover,"game-cover",g.title)}
    <h2>${esc(g.title)}</h2>
    <p>${esc(g.desc)}</p>
    <button class="run-game-btn" type="button" data-game-index="${i+1}"><span>运行游戏</span></button>
  </article>`).join("");
  return `<div class="game-works-v13">${feature}${cards?`<div class="game-work-grid">${cards}</div>`:""}</div>`;
}

function renderResumePage(d){
  const r=d.resume||{};
  const img=r.image?`<img class="resume-img zoomable-image-slot" data-zoomable-image data-zoom-title="${esc(r.title||"个人简历")}" src="${asset(r.image)}" alt="${esc(r.title||"个人简历")}">`:`<div class="blue-placeholder resume-img-placeholder zoomable-image-slot" data-zoom-placeholder="个人简历">个人简历</div>`;
  const imgHref=r.image?asset(r.image):"#";
  const pdfHref=r.pdf?asset(r.pdf):"#";
  return `<div class="resume-image-card">${img}</div>
  <aside class="resume-action-card">
    <p class="eyebrow">Resume File</p>
    <h2>${esc(r.title||"个人简历")}</h2>
    <p>${esc(r.desc||"点击简历图片可放大查看，也可以下载图片或 PDF 版本。")}</p>
    <div class="resume-downloads">
      <a class="primary ${r.image?"":"is-disabled"}" href="${imgHref}" ${r.image?`download="${esc(r.imageFileName||"resume.png")}"`:""}>下载简历图片</a>
      <a class="${r.pdf?"":"is-disabled"}" href="${pdfHref}" ${r.pdf?`download="${esc(r.pdfFileName||"resume.pdf")}"`:""}>下载 PDF 文件</a>
    </div>
  </aside>`;
}

/* Contact复制：不改按钮文字，避免走位 */
document.addEventListener("click", function(e){
  const btn=e.target.closest(".copy-link[data-copy]");
  if(!btn)return;
  e.preventDefault();
  e.stopImmediatePropagation();
  const text=btn.dataset.copy||"";
  navigator.clipboard?.writeText(text).catch(()=>{});
  btn.classList.add("is-copied");
  clearTimeout(btn._copyTimer);
  btn._copyTimer=setTimeout(()=>btn.classList.remove("is-copied"),1200);
}, true);

/* 放大查看：滚轮缩放 + 拖拽 + 边缘阻力 + 松手回弹 */
function openZoomLayer(title, visual){
  document.querySelectorAll(".zoom-overlay").forEach(x=>x.remove());

  const tmp=document.createElement("div");
  tmp.innerHTML=visual;
  const img=tmp.querySelector("img");
  const content=img
    ? `<div class="zoom-stage"><img src="${img.src}" alt="${esc(title)}" draggable="false"></div><div class="zoom-hint">滚轮缩放，按住拖拽移动，松手后会自动回弹到边界内。</div>`
    : `<div class="zoom-stage">${visual}</div>`;

  const div=document.createElement("div");
  div.className="zoom-overlay";
  div.innerHTML=`<div class="zoom-overlay-backdrop" data-close-zoom></div>
    <div class="zoom-overlay-panel">
      <button class="zoom-overlay-close" type="button" data-close-zoom>×</button>
      <h2>${esc(cleanLabel ? cleanLabel(title) : title)}</h2>
      ${content}
    </div>`;
  document.body.appendChild(div);

  const stage=div.querySelector(".zoom-stage");
  const image=stage?.querySelector("img");
  if(image) initZoomPan(stage,image);
}

function initZoomPan(stage,img){
  let scale=1, x=0, y=0, dragging=false, sx=0, sy=0, ox=0, oy=0;
  function baseSize(){
    const old=img.style.transform;
    img.style.transform="translate3d(0,0,0) scale(1)";
    const r=img.getBoundingClientRect();
    img.style.transform=old;
    return {w:r.width,h:r.height};
  }
  function bounds(){
    const s=baseSize();
    const sr=stage.getBoundingClientRect();
    return {
      maxX:Math.max(0,(s.w*scale-sr.width)/2),
      maxY:Math.max(0,(s.h*scale-sr.height)/2)
    };
  }
  function resist(v,max){
    if(max<=0)return v*.18;
    if(v>max)return max+(v-max)*.22;
    if(v<-max)return -max+(v+max)*.22;
    return v;
  }
  function clamp(){
    const b=bounds();
    x=Math.max(-b.maxX,Math.min(b.maxX,x));
    y=Math.max(-b.maxY,Math.min(b.maxY,y));
  }
  function apply(smooth=False){
    img.style.transition=smooth?"transform .28s cubic-bezier(.2,.9,.2,1)":"none";
    img.style.setProperty("--zoom-scale",scale);
    img.style.setProperty("--zoom-x",x+"px");
    img.style.setProperty("--zoom-y",y+"px");
  }
  stage.addEventListener("wheel",e=>{
    e.preventDefault();
    const old=scale;
    const delta=e.deltaY<0?1.12:.88;
    scale=Math.max(1,Math.min(4,scale*delta));
    const rect=stage.getBoundingClientRect();
    const cx=e.clientX-rect.left-rect.width/2;
    const cy=e.clientY-rect.top-rect.height/2;
    const ratio=scale/old;
    x = x - (cx-x)*(ratio-1);
    y = y - (cy-y)*(ratio-1);
    clamp();
    apply(false);
  },{passive:false});

  stage.addEventListener("pointerdown",e=>{
    dragging=true;
    stage.classList.add("is-dragging");
    sx=e.clientX; sy=e.clientY; ox=x; oy=y;
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener("pointermove",e=>{
    if(!dragging)return;
    const b=bounds();
    x=resist(ox+e.clientX-sx,b.maxX);
    y=resist(oy+e.clientY-sy,b.maxY);
    apply(false);
  });

  function release(){
    if(!dragging)return;
    dragging=false;
    stage.classList.remove("is-dragging");
    clamp();
    apply(true);
  }
  stage.addEventListener("pointerup",release);
  stage.addEventListener("pointercancel",release);
  stage.addEventListener("dblclick",()=>{
    scale=1;x=0;y=0;apply(true);
  });
  apply(false);
}

/* 返回按钮增加简历页映射 */
function injectPageBackButton(d){
  if(!document.body.classList.contains("sub-page"))return;
  if(document.querySelector(".page-back-btn"))return;
  const page=document.body.dataset.page || "";
  const map={
    portfolio:"portfolio-entry",
    video:"portfolio-entry",
    graphic:"portfolio-entry",
    music:"portfolio-entry",
    game:"portfolio-entry",
    resume:"portfolio-entry",
    campus:"experience",
    project:"experience",
    eggy:"eggy",
    making:"profile"
  };
  const section=map[page] || "profile";
  const a=document.createElement("a");
  a.className="page-back-btn";
  a.href=`../home.html?section=${encodeURIComponent(section)}`;
  a.textContent="← 返回";
  document.body.appendChild(a);
}


/* ================= V15 overrides：分类子页互跳、导航选中、交互音效、制作耗时 ================= */
function currentPortfolioCategoryKey(){
  const page=(document.body.dataset.page||"").toLowerCase();
  const map={video:"video-works.html",graphic:"graphic-works.html",music:"music-works.html",game:"game-works.html"};
  return map[page]||"";
}
function renderPortfolioSubnav(d){
  const current=currentPortfolioCategoryKey();
  if(!current) return "";
  const others=(d.portfolioCategories||[]).filter(c=>c.href!==current);
  if(!others.length) return "";
  return `<section class="section-shell portfolio-subnav-v15 reveal-up" aria-label="其他作品分类入口">
    <div class="portfolio-subnav-title"><span>Other Categories</span><small>继续浏览另外三个作品分类</small></div>
    <div class="portfolio-subnav-grid">${others.map(c=>`<a class="portfolio-subnav-card" href="./${esc(c.href)}"><span>${esc(c.type||"Category")}</span><strong>${esc(c.title)}</strong><em>${esc(c.desc||"")}</em></a>`).join("")}</div>
  </section>`;
}
function injectPortfolioSubnav(d){
  if(!currentPortfolioCategoryKey()) return;
  if(document.querySelector(".portfolio-subnav-v15")) return;
  const hero=document.querySelector(".page-hero");
  if(!hero) return;
  hero.insertAdjacentHTML("afterend",renderPortfolioSubnav(d));
}
function renderMakingCards(d){
  const b=d.behindScenes||{};
  const value=b.durationValue||"累死了";
  return `<article class="making-card" data-making="process"><span class="making-type">Process</span><h2>${esc(b.processTitle||"制作流程")}</h2><p>${esc(b.processDesc||"")}</p><b class="card-link">点击查看导图 →</b></article>
  <article class="making-card" data-making="tools"><span class="making-type">Tools</span><h2>${esc(b.toolsTitle||"使用工具")}</h2><p>${esc(b.toolsDesc||"")}</p><b class="card-link">点击查看工具 →</b></article>
  <article class="making-card duration-card" data-making="duration" data-duration="${esc(value)}"><span class="making-type">Duration</span><h2>${esc(b.durationTitle||"制作耗时")}</h2><p>${esc(b.durationDesc||"")}</p><strong class="duration-hover-value">${esc(value)}</strong></article>`;
}
function openDurationWall(){
  document.querySelectorAll(".duration-marquee-wall").forEach(x=>x.remove());
  const word="累死了";
  const row = () => `<div class="duration-marquee-row">${Array(18).fill(`<span>${word}</span>`).join("")}</div>`;
  const div=document.createElement("div");
  div.className="duration-marquee-wall";
  div.innerHTML=`<button class="duration-marquee-close" type="button" aria-label="关闭">×</button>${row()}${row()}${row()}${row()}${row()}`;
  document.body.appendChild(div);
  div.querySelector(".duration-marquee-close").onclick=()=>div.remove();
  div.addEventListener("click",e=>{if(e.target===div)div.remove()});
}
function renderComponents(d){
 document.querySelectorAll("[data-render]").forEach(n=>{const t=n.dataset.render;
  if(t==="header")n.innerHTML=renderHeader(d);
  if(t==="heroButtons")n.innerHTML=d.hero.buttons.map(b=>`<a class="btn ${b.style==="primary"?"primary":"ghost"} magnetic" href="${link(b.href)}">${esc(b.label)}</a>`).join("");
  if(t==="heroStats")n.innerHTML=d.hero.stats.map(s=>`<div><strong>${esc(s.num)}</strong><span>${esc(s.label)}</span></div>`).join("");
  if(t==="heroTags")n.innerHTML=d.hero.tags.map((x,i)=>`<div class="floating-tag tag-${["a","b","c"][i]||"a"}">${esc(x)}</div>`).join("");
  if(t==="identity")n.innerHTML=d.identity.map(i=>`<div><span>${esc(i.label)}</span><strong>${esc(i.value)}</strong></div>`).join("");
  if(t==="portfolioCategoriesHome")n.innerHTML=renderPortfolioCats(d,false);
  if(t==="portfolioHub")n.innerHTML=`<div class="portfolio-hub-grid">${renderPortfolioCats(d,true)}</div>`;
  if(t==="experienceCards")n.innerHTML=d.experienceCards.map(c=>`<a class="experience-choice-card reveal-up tilt-card" href="${link(c.href)}"><span>${esc(c.type)}</span><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p><b class="card-link">${esc(d.ui.experienceEnter)} →</b></a>`).join("");
  if(t==="skills")n.innerHTML=renderSkills(d);
  if(t==="games")n.innerHTML=renderGames(d);
  if(t==="awards")n.innerHTML=renderAwards(d);
  if(t==="contact")n.innerHTML=`<button class="copy-link contact-phone" data-copy="${esc(d.site.phone)}"><small>${esc(d.ui.copyPhone||"电话")}</small><strong>${esc(d.site.phone)}</strong><em>点击复制</em></button><button class="copy-link contact-mail" data-copy="${esc(d.site.email)}"><small>${esc(d.ui.copyEmail||"邮箱")}</small><strong>${esc(d.site.email)}</strong><em>点击复制</em></button>`;
  if(t==="modalRoot")n.innerHTML=renderModalRoot(d);
  if(t==="pageHero")n.innerHTML=renderPageHero(d,document.body.dataset.page);
  if(t==="videoWorks")n.innerHTML=`<div class="video-list">${renderVideoWorks(d)}</div>`;
  if(t==="graphicWorks")n.innerHTML=`<div class="pinterest-wall">${renderGraphicWorks(d)}</div>`;
  if(t==="musicWorks")n.innerHTML=`<div class="music-grid">${renderMusicWorks(d)}</div>`;
  if(t==="miniGames")n.innerHTML=renderMiniGames(d);
  if(t==="campusExperiences")n.innerHTML=renderExperienceList(d,d.campusExperiences);
  if(t==="projectExperiences")n.innerHTML=renderExperienceList(d,d.projectExperiences);
  if(t==="eggyDetail")n.innerHTML=renderEggyDetail(d);
  if(t==="makingCards")n.innerHTML=renderMakingCards(d);
  if(t==="resumePage")n.innerHTML=renderResumePage(d);
 });
 injectPortfolioSubnav(d);
}
function initNavSelection(){
  const links=[...document.querySelectorAll(".nav-links a")];
  if(!links.length) return;
  const path=location.pathname;
  const page=document.body.dataset.page||"";
  links.forEach(a=>a.classList.remove("is-active"));
  let active=null;
  if(path.endsWith("/home.html")||path.endsWith("/website/")||path.endsWith("/website")) active=links.find(a=>a.classList.contains("home-nav"));
  if(page==="resume") active=links.find(a=>a.classList.contains("resume-nav"));
  if(page==="making") active=links.find(a=>a.classList.contains("making-nav"));
  if(active) active.classList.add("is-active");
}
function initInteractionSounds(d){
  const hoverSrc=d?.site?.hoverSound;
  const clickSrc=d?.site?.clickSound;
  if(!hoverSrc && !clickSrc) return;
  const hoverAudio=hoverSrc?new Audio(asset(hoverSrc)):null;
  const clickAudio=clickSrc?new Audio(asset(clickSrc)):null;
  if(hoverAudio) hoverAudio.preload="auto";
  if(clickAudio) clickAudio.preload="auto";
  const hoverSelector="a,button,.tilt-card,.orb-card,.portfolio-card-v8,.portfolio-subnav-card,.experience-choice-card,.experience-item,.tool-chip,.award-item,.making-card,.game-card,.ambient-game-card,.graphic-card,.music-card,.video-work-card,.game-work-card,.game-work-feature,.steam-card,.copy-link";
  const clickSelector="a,button,[data-award-index],[data-video-index],[data-game-index],[data-software],[data-making],.copy-link,.graphic-card,.music-card,.portfolio-subnav-card";
  let lastHover=null,lastHoverTime=0;
  function play(audio,volume){
    if(!audio) return;
    try{
      audio.pause();audio.currentTime=0;audio.volume=volume;audio.play().catch(()=>{});
    }catch(e){}
  }
  document.addEventListener("pointerover",e=>{
    const el=e.target.closest(hoverSelector);
    if(!el || el.disabled || el.getAttribute("aria-disabled")==="true") return;
    const now=performance.now();
    if(el===lastHover && now-lastHoverTime<450) return;
    lastHover=el;lastHoverTime=now;
    play(hoverAudio,.34);
  },{passive:true});
  document.addEventListener("pointerout",e=>{
    if(lastHover && !lastHover.contains(e.relatedTarget)) lastHover=null;
  },{passive:true});
  document.addEventListener("click",e=>{
    const el=e.target.closest(clickSelector);
    if(!el || el.disabled || el.getAttribute("aria-disabled")==="true") return;
    play(clickAudio,.55);
  },true);
}
document.addEventListener("DOMContentLoaded",()=>{
  if(window.APP_DATA){
    initNavSelection();
    initInteractionSounds(window.APP_DATA);
  }
});

/* ================= V16 overrides：作品集导航归位、分类音效、游戏靠近排斥、耗时提示去重 ================= */
function normalizedHomeSectionLink(id){
  return isPage() ? `../home.html?section=${encodeURIComponent(id)}` : `#${id}`;
}
function renderHeader(d){
  const inPage=location.pathname.includes('/pages/');
  const home=inPage?'../home.html':'./home.html';
  const page=p=>inPage?`./${p}`:`./pages/${p}`;
  const entries=[
    ['首页',normalizedHomeSectionLink('profile'),'home-nav'],
    ['作品集',normalizedHomeSectionLink('portfolio-entry'),'portfolio-nav'],
    ['经历',normalizedHomeSectionLink('experience'),''],
    ['技能',normalizedHomeSectionLink('skills'),''],
    ['游戏阅历',normalizedHomeSectionLink('games'),''],
    ['获奖',normalizedHomeSectionLink('awards'),''],
    ['简历',page('resume.html'),'resume-nav'],
    ['网站制作花絮',page('making-of.html'),'making-nav'],
    ['回到前页',inPage?'../index.html':'./index.html','back-entry']
  ];
  return `<div class="nav-inner">
    <a class="brand" href="${home}"><span class="brand-text">ZHU WEIXIAN</span></a>
    <button class="nav-toggle" type="button" id="navToggle">菜单</button>
    <nav class="nav-links">${entries.map(([label,href,cls])=>`<a class="${cls}" href="${href}">${esc(label)}</a>`).join('')}</nav>
    <button class="theme-toggle" id="themeToggle" type="button" aria-label="切换白天或黑夜模式"></button>
  </div>`;
}
function normalizeHeroHref(href){
  if(!href) return href;
  if(/portfolio\.html/i.test(href)) return normalizedHomeSectionLink('portfolio-entry');
  return link(href);
}
function renderComponents(d){
 document.querySelectorAll('[data-render]').forEach(n=>{const t=n.dataset.render;
  if(t==='header')n.innerHTML=renderHeader(d);
  if(t==='heroButtons')n.innerHTML=(d.hero.buttons||[]).map(b=>`<a class="btn ${b.style==='primary'?'primary':'ghost'} magnetic" href="${normalizeHeroHref(b.href)}">${esc(b.label)}</a>`).join('');
  if(t==='heroStats')n.innerHTML=(d.hero.stats||[]).map(s=>`<div><strong>${esc(s.num)}</strong><span>${esc(s.label)}</span></div>`).join('');
  if(t==='heroTags')n.innerHTML=(d.hero.tags||[]).map((x,i)=>`<div class="floating-tag tag-${['a','b','c'][i]||'a'}">${esc(x)}</div>`).join('');
  if(t==='identity')n.innerHTML=(d.identity||[]).map(i=>`<div><span>${esc(i.label)}</span><strong>${esc(i.value)}</strong></div>`).join('');
  if(t==='portfolioCategoriesHome')n.innerHTML=renderPortfolioCats(d,false);
  if(t==='portfolioHub')n.innerHTML=`<div class="portfolio-hub-grid">${renderPortfolioCats(d,true)}</div>`;
  if(t==='experienceCards')n.innerHTML=(d.experienceCards||[]).map(c=>`<a class="experience-choice-card reveal-up tilt-card" href="${link(c.href)}"><span>${esc(c.type)}</span><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p><b class="card-link">${esc(d.ui.experienceEnter)} →</b></a>`).join('');
  if(t==='skills')n.innerHTML=renderSkills(d);
  if(t==='games')n.innerHTML=renderGames(d);
  if(t==='awards')n.innerHTML=renderAwards(d);
  if(t==='contact')n.innerHTML=`<button class="copy-link contact-phone" data-copy="${esc(d.site.phone)}"><small>${esc(d.ui.copyPhone||'电话')}</small><strong>${esc(d.site.phone)}</strong><em>点击复制</em></button><button class="copy-link contact-mail" data-copy="${esc(d.site.email)}"><small>${esc(d.ui.copyEmail||'邮箱')}</small><strong>${esc(d.site.email)}</strong><em>点击复制</em></button>`;
  if(t==='modalRoot')n.innerHTML=renderModalRoot(d);
  if(t==='pageHero')n.innerHTML=renderPageHero(d,document.body.dataset.page);
  if(t==='videoWorks')n.innerHTML=`<div class="video-list">${renderVideoWorks(d)}</div>`;
  if(t==='graphicWorks')n.innerHTML=`<div class="pinterest-wall">${renderGraphicWorks(d)}</div>`;
  if(t==='musicWorks')n.innerHTML=`<div class="music-grid">${renderMusicWorks(d)}</div>`;
  if(t==='miniGames')n.innerHTML=renderMiniGames(d);
  if(t==='campusExperiences')n.innerHTML=renderExperienceList(d,d.campusExperiences);
  if(t==='projectExperiences')n.innerHTML=renderExperienceList(d,d.projectExperiences);
  if(t==='eggyDetail')n.innerHTML=renderEggyDetail(d);
  if(t==='makingCards')n.innerHTML=renderMakingCards(d);
  if(t==='resumePage')n.innerHTML=renderResumePage(d);
 });
 injectPortfolioSubnav(d);
}
function injectPageBackButton(d){
  if(!document.body.classList.contains('sub-page'))return;
  if(document.querySelector('.page-back-btn'))return;
  const page=document.body.dataset.page || '';
  const map={portfolio:'portfolio-entry',video:'portfolio-entry',graphic:'portfolio-entry',music:'portfolio-entry',game:'portfolio-entry',resume:'portfolio-entry',campus:'experience',project:'experience',eggy:'eggy',making:'profile'};
  const section=map[page] || 'profile';
  const a=document.createElement('a');
  a.className='page-back-btn';
  a.href=`../home.html?section=${encodeURIComponent(section)}`;
  a.textContent='← 返回';
  document.body.appendChild(a);
}
function renderMakingCards(d){
  const b=d.behindScenes||{};
  const value=b.durationValue||'累死了';
  const desc=String(b.durationDesc||'').includes('鼠标悬停即可查看完整制作耗时') ? '' : (b.durationDesc||'');
  return `<article class="making-card" data-making="process"><span class="making-type">Process</span><h2>${esc(b.processTitle||'制作流程')}</h2><p>${esc(b.processDesc||'')}</p><b class="card-link">点击查看导图 →</b></article>
  <article class="making-card" data-making="tools"><span class="making-type">Tools</span><h2>${esc(b.toolsTitle||'使用工具')}</h2><p>${esc(b.toolsDesc||'')}</p><b class="card-link">点击查看工具 →</b></article>
  <article class="making-card duration-card" data-making="duration" data-duration="${esc(value)}"><span class="making-type">Duration</span><h2>${esc(b.durationTitle||'制作耗时')}</h2>${desc?`<p>${esc(desc)}</p>`:''}</article>`;
}
function initNavSelection(){
  const links=[...document.querySelectorAll('.nav-links a')];
  if(!links.length) return;
  const path=location.pathname;
  const page=document.body.dataset.page||'';
  links.forEach(a=>a.classList.remove('is-active'));
  let active=null;
  if(path.endsWith('/home.html')||path.endsWith('/website/')||path.endsWith('/website')) active=links.find(a=>a.classList.contains('home-nav'));
  if(page==='resume') active=links.find(a=>a.classList.contains('resume-nav'));
  if(page==='making') active=links.find(a=>a.classList.contains('making-nav'));
  if(active) active.classList.add('is-active');
}
function initInteractionSounds(d){
  const s=d?.sounds||{};
  const fallbackHover=d?.site?.hoverSound||'assets/audio/hover.wav';
  const fallbackClick=d?.site?.clickSound||'assets/audio/click.wav';
  const config={
    navHover:s.navHover||fallbackHover, navClick:s.navClick||fallbackClick,
    buttonHover:s.buttonHover||fallbackHover, buttonClick:s.buttonClick||fallbackClick,
    cardHover:s.cardHover||fallbackHover, cardClick:s.cardClick||fallbackClick,
    gameHover:s.gameHover||fallbackHover, gameClick:s.gameClick||fallbackClick, gameDrag:s.gameDrag||s.gameClick||fallbackClick,
    modalHover:s.modalHover||fallbackHover, modalClick:s.modalClick||fallbackClick,
    mediaHover:s.mediaHover||fallbackHover, mediaClick:s.mediaClick||fallbackClick,
    copyClick:s.copyClick||fallbackClick, themeClick:s.themeClick||fallbackClick
  };
  const cache={};
  function audioFor(key){
    const src=config[key];
    if(!src) return null;
    if(!cache[key]){ cache[key]=new Audio(asset(src)); cache[key].preload='auto'; }
    return cache[key];
  }
  function play(key,vol=.42){
    const a=audioFor(key); if(!a) return;
    try{a.pause();a.currentTime=0;a.volume=vol;a.play().catch(()=>{});}catch(e){}
  }
  function category(el,kind){
    if(el.closest('.nav-links a,.page-back-btn,.brand')) return kind==='hover'?'navHover':'navClick';
    if(el.closest('.game-card,.ambient-game-card,[data-game-card]')) return kind==='hover'?'gameHover':'gameClick';
    if(el.closest('.modal-close,[data-close-modal],[data-close-zoom],.zoom-overlay-close,.duration-marquee-close')) return kind==='hover'?'modalHover':'modalClick';
    if(el.closest('[data-video-index],[data-game-index],.run-game-btn,.music-player,.music-btn,.video-work-card,.music-card,.steam-card,.game-work-card,.game-work-feature')) return kind==='hover'?'mediaHover':'mediaClick';
    if(el.closest('.copy-link,[data-copy]')) return kind==='hover'?'buttonHover':'copyClick';
    if(el.closest('.theme-toggle')) return kind==='hover'?'buttonHover':'themeClick';
    if(el.closest('.tilt-card,.orb-card,.portfolio-card-v8,.portfolio-subnav-card,.experience-choice-card,.experience-item,.tool-chip,.award-item,.making-card,.graphic-card')) return kind==='hover'?'cardHover':'cardClick';
    if(el.closest('a,button,.btn')) return kind==='hover'?'buttonHover':'buttonClick';
    return null;
  }
  const hoverSelector='a,button,.btn,.tilt-card,.orb-card,.portfolio-card-v8,.portfolio-subnav-card,.experience-choice-card,.experience-item,.tool-chip,.award-item,.making-card,.game-card,.ambient-game-card,.graphic-card,.music-card,.video-work-card,.game-work-card,.game-work-feature,.steam-card,.copy-link,.modal-close,.zoom-overlay-close,.music-player';
  const clickSelector='a,button,.btn,[data-award-index],[data-video-index],[data-game-index],[data-software],[data-making],.copy-link,.graphic-card,.music-card,.portfolio-subnav-card,.steam-card,.run-game-btn,.music-player,.theme-toggle';
  let lastHover=null,lastHoverTime=0;
  document.addEventListener('pointerover',e=>{
    const el=e.target.closest(hoverSelector);
    if(!el || el.disabled || el.getAttribute('aria-disabled')==='true') return;
    const now=performance.now();
    if(el===lastHover && now-lastHoverTime<420) return;
    lastHover=el;lastHoverTime=now;
    const key=category(el,'hover'); if(key) play(key,.32);
  },{passive:true});
  document.addEventListener('pointerout',e=>{ if(lastHover && !lastHover.contains(e.relatedTarget)) lastHover=null; },{passive:true});
  document.addEventListener('click',e=>{
    const el=e.target.closest(clickSelector);
    if(!el || el.disabled || el.getAttribute('aria-disabled')==='true') return;
    const key=category(el,'click'); if(key) play(key,.50);
  },true);
  document.addEventListener('pointerdown',e=>{
    if(e.target.closest('[data-game-card],.zoom-stage')) play('gameDrag',.34);
  },true);
}
function initGameMagnet(){
  const wall=document.querySelector('.game-orbit-wall');
  const els=[...document.querySelectorAll('[data-game-card]')];
  if(!wall || !els.length) return;
  const items=els.map(el=>({el,x:Number(el.dataset.homeX||0),y:Number(el.dataset.homeY||0),pushX:0,pushY:0,dragX:0,dragY:0,neighbor:false}));
  const map=new Map(items.map(i=>[i.el,i]));
  let dragging=null,startX=0,startY=0,raf=0,near=null;
  function schedule(){
    if(raf) return;
    raf=requestAnimationFrame(()=>{raf=0;for(const it of items){it.el.style.setProperty('--push-x',it.pushX.toFixed(1)+'px');it.el.style.setProperty('--push-y',it.pushY.toFixed(1)+'px');it.el.style.setProperty('--drag-x',it.dragX.toFixed(1)+'px');it.el.style.setProperty('--drag-y',it.dragY.toFixed(1)+'px');it.el.classList.toggle('is-neighbor',it.neighbor);}});
  }
  function reset(keepDrag=false){for(const it of items){it.pushX=0;it.pushY=0;it.neighbor=false;if(!keepDrag){it.dragX=0;it.dragY=0;it.el.classList.remove('is-hover','is-neighbor','is-dragging');}}schedule();}
  function repel(source,px,py,range,strength){
    for(const it of items){
      if(source && it===source){it.neighbor=false;continue;}
      const vx=it.x-px,vy=it.y-py,dist=Math.max(1,Math.hypot(vx,vy));
      if(dist<range){const power=(1-dist/range)*strength;const a=Math.atan2(vy,vx);it.pushX=Math.cos(a)*power;it.pushY=Math.sin(a)*power;it.neighbor=true;}else{it.pushX=0;it.pushY=0;it.neighbor=false;}
    }
    schedule();
  }
  function localPoint(e){const r=wall.getBoundingClientRect();return {x:e.clientX-r.left-r.width/2,y:e.clientY-r.top-r.height/2};}
  wall.addEventListener('pointermove',e=>{
    if(dragging) return;
    const p=localPoint(e);
    let nearest=null,dist=Infinity;
    for(const it of items){const d=Math.hypot(it.x-p.x,it.y-p.y); if(d<dist){dist=d;nearest=it;}}
    if(nearest && dist<150){
      if(near!==nearest){ if(near) near.el.classList.remove('is-hover'); near=nearest; near.el.classList.add('is-hover'); }
      repel(null,p.x,p.y,nearest.el.dataset.ambient?165:220,nearest.el.dataset.ambient?18:28);
    }else{
      if(near){near.el.classList.remove('is-hover');near=null;}
      reset();
    }
  },{passive:true});
  wall.addEventListener('pointerleave',()=>{if(!dragging){near=null;reset();}},{passive:true});
  for(const el of els){
    const it=map.get(el);
    el.addEventListener('pointerdown',e=>{dragging=it;near=null;startX=e.clientX;startY=e.clientY;el.classList.add('is-dragging','is-hover');el.setPointerCapture(e.pointerId);e.preventDefault();},{passive:false});
    el.addEventListener('pointermove',e=>{if(dragging!==it)return;it.dragX=e.clientX-startX;it.dragY=e.clientY-startY;repel(it,it.x+it.dragX,it.y+it.dragY,it.el.dataset.ambient?245:350,it.el.dataset.ambient?38:70);},{passive:true});
    function release(){if(dragging!==it)return;dragging=null;reset();}
    el.addEventListener('pointerup',release,{passive:true});
    el.addEventListener('pointercancel',release,{passive:true});
  }
}


/* ================= V17：游戏交互丝滑化、头像长按跳转、耗时文案最终去重 ================= */
function renderGames(d){
  const sorted=[...(d.games||[])].sort((a,b)=>(b.size||0)-(a.size||0));
  const points=[
    [0,0,112],[0,-132,94],[114,-66,94],[114,66,92],[0,132,92],[-114,66,92],[-114,-66,92],
    [0,-264,78],[114,-198,78],[228,-132,76],[228,0,76],[228,132,76],[114,198,74],
    [0,264,74],[-114,198,74],[-228,132,72],[-228,0,72],[-228,-132,72],[-114,-198,72]
  ];
  const played = sorted.map((g,i)=>{
    const [x,y,s]=points[i]||[0,0,72];
    const icon=g.icon?`<img class="game-thumb-img" src="${asset(g.icon)}" alt="${esc(g.name)}">`:`<div class="game-thumb-placeholder">${esc(d.ui.iconPlaceholder)}</div>`;
    return `<article class="game-card" data-game-card data-played="1" data-home-x="${x}" data-home-y="${y}" style="--home-x:${x}px;--home-y:${y}px;--s:${s}px">
      <div class="game-inner"><div class="game-glass-layer"></div>${icon}<span>${esc(g.name)}<br>${esc(g.time)}</span></div>
    </article>`;
  }).join('');
  const amb=d.ambientGameIcons||[];
  const sidePositions=makeAmbientPositionsV12 ? makeAmbientPositionsV12(amb.length) : [];
  const ambient=amb.map((g,i)=>{
    const [x,y,s]=sidePositions[i]||[0,0,44];
    const icon=g.icon?`<img class="ambient-game-thumb" src="${asset(g.icon)}" alt="">`:`<div class="ambient-game-placeholder"></div>`;
    return `<article class="ambient-game-card" data-game-card data-ambient="1" data-home-x="${x}" data-home-y="${y}" style="--home-x:${x}px;--home-y:${y}px;--s:${s}px"><div class="ambient-game-inner">${icon}</div></article>`;
  }).join('');
  return ambient + played;
}

function renderMakingCards(d){
  const b=d.behindScenes||{};
  const value=b.durationValue||'累死了';
  return `<article class="making-card" data-making="process"><span class="making-type">Process</span><h2>${esc(b.processTitle||'制作流程')}</h2><p>${esc(b.processDesc||'')}</p><b class="card-link">点击查看导图 →</b></article>
  <article class="making-card" data-making="tools"><span class="making-type">Tools</span><h2>${esc(b.toolsTitle||'使用工具')}</h2><p>${esc(b.toolsDesc||'')}</p><b class="card-link">点击查看工具 →</b></article>
  <article class="making-card duration-card" data-making="duration" data-duration="${esc(value)}"><span class="making-type">Duration</span><h2>${esc(b.durationTitle||'制作耗时')}</h2></article>`;
}

function openDurationWall(){
  document.querySelectorAll('.duration-marquee-wall').forEach(x=>x.remove());
  const words=['累死了','累死了','累死了','累死了','累死了','累死了'];
  const row=()=>`<div class="duration-marquee-row">${Array(4).fill(words.map(w=>`<span>${esc(w)}</span>`).join('')).join('')}</div>`;
  const div=document.createElement('div');
  div.className='duration-marquee-wall';
  div.innerHTML=`<button class="duration-marquee-close" type="button" aria-label="关闭">×</button>${row()}${row()}${row()}${row()}${row()}`;
  document.body.appendChild(div);
  div.querySelector('.duration-marquee-close').onclick=()=>div.remove();
  div.addEventListener('click',e=>{if(e.target===div)div.remove()});
}

function initGameMagnet(){
  const wall=document.querySelector('.game-orbit-wall');
  const els=[...document.querySelectorAll('[data-game-card]')];
  if(!wall || !els.length) return;
  const items=els.map(el=>({
    el,x:Number(el.dataset.homeX||0),y:Number(el.dataset.homeY||0),
    tx:0,ty:0,cx:0,cy:0,dragX:0,dragY:0,hover:false,neighbor:false,ambient:!!el.dataset.ambient
  }));
  const map=new Map(items.map(i=>[i.el,i]));
  let raf=0,pointerInside=false,dragging=null,startX=0,startY=0,lastPointer=null;
  function apply(){
    raf=0;
    let keepAnimating=false;
    for(const it of items){
      it.cx += (it.tx - it.cx) * .22;
      it.cy += (it.ty - it.cy) * .22;
      if(Math.abs(it.tx-it.cx)>0.08 || Math.abs(it.ty-it.cy)>0.08) keepAnimating=true;
      it.el.style.setProperty('--push-x', it.cx.toFixed(2)+'px');
      it.el.style.setProperty('--push-y', it.cy.toFixed(2)+'px');
      it.el.style.setProperty('--drag-x', it.dragX.toFixed(2)+'px');
      it.el.style.setProperty('--drag-y', it.dragY.toFixed(2)+'px');
      it.el.classList.toggle('is-hover', it.hover);
      it.el.classList.toggle('is-neighbor', it.neighbor);
    }
    if(keepAnimating) schedule();
  }
  function schedule(){ if(!raf) raf=requestAnimationFrame(apply); }
  function clearTargets(keepDrag=false){
    for(const it of items){it.tx=0;it.ty=0;it.hover=false;it.neighbor=false;if(!keepDrag){it.dragX=0;it.dragY=0;it.el.classList.remove('is-dragging');}}
    schedule();
  }
  function localPoint(e){const r=wall.getBoundingClientRect();return {x:e.clientX-r.left-r.width/2,y:e.clientY-r.top-r.height/2};}
  function repel(px,py,source=null,range=250,strength=36){
    let nearest=null,nearestDist=Infinity;
    for(const it of items){
      const baseX=it.x + (it===source?it.dragX:0);
      const baseY=it.y + (it===source?it.dragY:0);
      const d=Math.hypot(baseX-px,baseY-py);
      if(d<nearestDist){nearestDist=d;nearest=it;}
    }
    for(const it of items){
      if(it===source){it.hover=true;it.neighbor=false;it.tx=0;it.ty=0;continue;}
      const vx=it.x-px, vy=it.y-py, dist=Math.max(1,Math.hypot(vx,vy));
      const localRange=it.ambient?range*.78:range;
      if(dist<localRange){
        const power=Math.pow(1-dist/localRange,1.45)*(it.ambient?strength*.54:strength);
        const ang=Math.atan2(vy,vx);
        it.tx=Math.cos(ang)*power; it.ty=Math.sin(ang)*power; it.neighbor=true;
      }else{it.tx=0;it.ty=0;it.neighbor=false;}
      it.hover = !dragging && it===nearest && nearestDist < (it.ambient?66:92);
    }
    schedule();
  }
  wall.addEventListener('pointermove',e=>{
    pointerInside=true;
    lastPointer=e;
    if(dragging) return;
    const p=localPoint(e);
    repel(p.x,p.y,null,260,34);
  },{passive:true});
  wall.addEventListener('pointerleave',()=>{pointerInside=false;if(!dragging) clearTargets();},{passive:true});
  for(const el of els){
    const it=map.get(el);
    el.addEventListener('pointerdown',e=>{
      dragging=it;startX=e.clientX;startY=e.clientY;it.hover=true;el.classList.add('is-dragging');el.setPointerCapture(e.pointerId);e.preventDefault();
    },{passive:false});
    el.addEventListener('pointermove',e=>{
      if(dragging!==it) return;
      it.dragX=e.clientX-startX;it.dragY=e.clientY-startY;
      repel(it.x+it.dragX,it.y+it.dragY,it,it.ambient?260:360,it.ambient?42:76);
    },{passive:true});
    function release(){
      if(dragging!==it) return;
      dragging=null;it.dragX=0;it.dragY=0;el.classList.remove('is-dragging');
      if(pointerInside && lastPointer){const p=localPoint(lastPointer);repel(p.x,p.y,null,260,34);}else clearTargets();
    }
    el.addEventListener('pointerup',release,{passive:true});
    el.addEventListener('pointercancel',release,{passive:true});
  }
}

function initAvatarLongPress(){
  const frame=document.querySelector('.portrait-frame');
  if(!frame) return;
  let ring=null,holding=false,start=0,raf=0,last={x:0,y:0};
  const duration=620;
  function ensureRing(){
    if(ring) return ring;
    ring=document.createElement('div');
    ring.className='avatar-hold-ring';
    ring.innerHTML='<span></span>';
    document.body.appendChild(ring);
    return ring;
  }
  function setRing(x,y,p){
    const r=ensureRing();
    r.style.left=x+'px';r.style.top=y+'px';r.style.setProperty('--p',Math.max(0,Math.min(100,p))+'%');
  }
  function cancel(){
    if(!holding) return;
    holding=false;cancelAnimationFrame(raf);
    if(ring) ring.classList.remove('is-active');
  }
  function tick(){
    if(!holding) return;
    const t=Math.min(1,(performance.now()-start)/duration);
    const eased=Math.pow(t,1.85);
    setRing(last.x,last.y,eased*100);
    if(t>=1){
      holding=false;
      if(ring) ring.classList.remove('is-active');
      location.href='./pages/avatar-secret.html';
      return;
    }
    raf=requestAnimationFrame(tick);
  }
  frame.addEventListener('pointerdown',e=>{
    if(e.button !== 0) return;
    holding=true;start=performance.now();last={x:e.clientX,y:e.clientY};
    ensureRing().classList.add('is-active');
    setRing(last.x,last.y,0);
    raf=requestAnimationFrame(tick);
  },{passive:true});
  frame.addEventListener('pointermove',e=>{if(!holding)return;last={x:e.clientX,y:e.clientY};setRing(last.x,last.y,0);},{passive:true});
  ['pointerup','pointercancel','pointerleave'].forEach(type=>frame.addEventListener(type,cancel,{passive:true}));
  window.addEventListener('blur',cancel);
}

document.addEventListener('DOMContentLoaded',()=>{
  initAvatarLongPress();
});

/* ================= V18：游戏已阅历取消靠近排斥、头像长按进度与获奖按钮点击动效 ================= */
function initAwards(){
  const rail=document.getElementById('awardRail');
  const toggle=document.getElementById('awardToggle');
  if(!rail || !toggle) return;
  toggle.addEventListener('click',()=>{
    const open=rail.classList.toggle('is-expanded');
    toggle.setAttribute('aria-expanded',String(open));
    toggle.classList.remove('is-click-pop');
    void toggle.offsetWidth;
    toggle.classList.add('is-click-pop');
    window.setTimeout(()=>toggle.classList.remove('is-click-pop'),420);
  });
}

function initGameMagnet(){
  const wall=document.querySelector('.game-orbit-wall');
  const els=[...document.querySelectorAll('[data-game-card]')];
  if(!wall || !els.length) return;
  const items=els.map(el=>({
    el,
    x:Number(el.dataset.homeX||el.dataset.x||0),
    y:Number(el.dataset.homeY||el.dataset.y||0),
    tx:0,ty:0,cx:0,cy:0,dragX:0,dragY:0,
    hover:false,neighbor:false,
    ambient:!!el.dataset.ambient,
    played:!!el.dataset.played
  }));
  const map=new Map(items.map(i=>[i.el,i]));
  let raf=0,dragging=null,startX=0,startY=0,pointerInside=false,lastPointer=null;
  function schedule(){ if(!raf) raf=requestAnimationFrame(apply); }
  function apply(){
    raf=0;
    let keep=false;
    for(const it of items){
      if(it.played){it.tx=0;it.ty=0;it.neighbor=false;}
      it.cx+=(it.tx-it.cx)*.22;
      it.cy+=(it.ty-it.cy)*.22;
      if(Math.abs(it.tx-it.cx)>0.08 || Math.abs(it.ty-it.cy)>0.08) keep=true;
      it.el.style.setProperty('--push-x',it.cx.toFixed(2)+'px');
      it.el.style.setProperty('--push-y',it.cy.toFixed(2)+'px');
      it.el.style.setProperty('--drag-x',it.dragX.toFixed(2)+'px');
      it.el.style.setProperty('--drag-y',it.dragY.toFixed(2)+'px');
      it.el.classList.toggle('is-hover',it.hover);
      it.el.classList.toggle('is-neighbor',it.neighbor && it.ambient);
    }
    if(keep) schedule();
  }
  function localPoint(e){
    const r=wall.getBoundingClientRect();
    return {x:e.clientX-r.left-r.width/2,y:e.clientY-r.top-r.height/2};
  }
  function clearTargets(keepDrag=false){
    for(const it of items){
      it.tx=0;it.ty=0;it.hover=false;it.neighbor=false;
      if(!keepDrag){it.dragX=0;it.dragY=0;it.el.classList.remove('is-dragging');}
    }
    schedule();
  }
  function updateHover(px,py){
    let nearest=null,nearestDist=Infinity;
    for(const it of items){
      const baseX=it.x+(it===dragging?it.dragX:0);
      const baseY=it.y+(it===dragging?it.dragY:0);
      const d=Math.hypot(baseX-px,baseY-py);
      const limit=it.ambient?70:95;
      if(d<limit && d<nearestDist){nearest=it;nearestDist=d;}
    }
    for(const it of items){it.hover=!dragging && it===nearest;}
  }
  function repelAmbient(px,py,source=null,range=255,strength=34){
    updateHover(px,py);
    for(const it of items){
      if(!it.ambient){it.tx=0;it.ty=0;it.neighbor=false;continue;}
      if(it===source){it.tx=0;it.ty=0;it.neighbor=false;it.hover=true;continue;}
      const vx=it.x-px,vy=it.y-py,dist=Math.max(1,Math.hypot(vx,vy));
      const localRange=range*.82;
      if(dist<localRange){
        const power=Math.pow(1-dist/localRange,1.42)*strength*.58;
        const ang=Math.atan2(vy,vx);
        it.tx=Math.cos(ang)*power;
        it.ty=Math.sin(ang)*power;
        it.neighbor=true;
      }else{
        it.tx=0;it.ty=0;it.neighbor=false;
      }
    }
    schedule();
  }
  wall.addEventListener('pointermove',e=>{
    pointerInside=true;
    lastPointer=e;
    if(dragging) return;
    const p=localPoint(e);
    repelAmbient(p.x,p.y,null,255,34);
  },{passive:true});
  wall.addEventListener('pointerleave',()=>{pointerInside=false;if(!dragging) clearTargets();},{passive:true});
  for(const el of els){
    const it=map.get(el);
    el.addEventListener('pointerdown',e=>{
      dragging=it;
      startX=e.clientX;
      startY=e.clientY;
      it.hover=true;
      el.classList.add('is-dragging');
      el.setPointerCapture(e.pointerId);
      e.preventDefault();
    },{passive:false});
    el.addEventListener('pointermove',e=>{
      if(dragging!==it) return;
      it.dragX=e.clientX-startX;
      it.dragY=e.clientY-startY;
      repelAmbient(it.x+it.dragX,it.y+it.dragY,it,it.ambient?270:330,it.ambient?46:64);
      schedule();
    },{passive:true});
    function release(){
      if(dragging!==it) return;
      dragging=null;
      it.dragX=0;it.dragY=0;it.hover=false;
      el.classList.remove('is-dragging');
      if(pointerInside && lastPointer){const p=localPoint(lastPointer);repelAmbient(p.x,p.y,null,255,34);}else clearTargets();
    }
    el.addEventListener('pointerup',release,{passive:true});
    el.addEventListener('pointercancel',release,{passive:true});
  }
}

function initAvatarLongPress(){
  const frame=document.querySelector('.portrait-frame');
  if(!frame) return;
  let ring=null,holding=false,start=0,raf=0,last={x:0,y:0},progress=0;
  const duration=620;
  function ensureRing(){
    if(ring) return ring;
    ring=document.createElement('div');
    ring.className='avatar-hold-ring';
    ring.innerHTML='<span></span>';
    document.body.appendChild(ring);
    return ring;
  }
  function setRing(x,y,p){
    progress=Math.max(0,Math.min(100,p));
    const r=ensureRing();
    r.style.left=x+'px';
    r.style.top=y+'px';
    r.style.setProperty('--p',progress+'%');
  }
  function cancel(){
    if(!holding) return;
    holding=false;
    cancelAnimationFrame(raf);
    progress=0;
    if(ring){ring.style.setProperty('--p','0%');ring.classList.remove('is-active');}
  }
  function tick(){
    if(!holding) return;
    const t=Math.min(1,(performance.now()-start)/duration);
    const eased=Math.pow(t,1.85);
    setRing(last.x,last.y,eased*100);
    if(t>=1){
      holding=false;
      if(ring) ring.classList.remove('is-active');
      location.href=isPage()?'./avatar-secret.html':'./pages/avatar-secret.html';
      return;
    }
    raf=requestAnimationFrame(tick);
  }
  frame.addEventListener('pointerdown',e=>{
    if(e.button!==0) return;
    holding=true;
    start=performance.now();
    last={x:e.clientX,y:e.clientY};
    progress=0;
    ensureRing().classList.add('is-active');
    setRing(last.x,last.y,0);
    raf=requestAnimationFrame(tick);
  },{passive:true});
  frame.addEventListener('pointermove',e=>{
    if(!holding) return;
    last={x:e.clientX,y:e.clientY};
    setRing(last.x,last.y,progress);
  },{passive:true});
  ['pointerup','pointercancel','pointerleave'].forEach(type=>frame.addEventListener(type,cancel,{passive:true}));
  window.addEventListener('blur',cancel);
}


/* ================= V19：返回按钮统一与简历按钮最终渲染 ================= */
function renderHeader(d){
  const inPage=location.pathname.includes('/pages/');
  const home=inPage?'../home.html':'./home.html';
  const page=p=>inPage?`./${p}`:`./pages/${p}`;
  const entries=[
    ['首页',normalizedHomeSectionLink('profile'),'home-nav'],
    ['作品集',normalizedHomeSectionLink('portfolio-entry'),'portfolio-nav'],
    ['经历',normalizedHomeSectionLink('experience'),''],
    ['技能',normalizedHomeSectionLink('skills'),''],
    ['游戏阅历',normalizedHomeSectionLink('games'),''],
    ['获奖',normalizedHomeSectionLink('awards'),''],
    ['简历',page('resume.html'),'resume-nav'],
    ['网站制作花絮',page('making-of.html'),'making-nav'],
    ['返回',inPage?'../index.html':'./index.html','back-entry']
  ];
  return `<div class="nav-inner">
    <a class="brand" href="${home}"><span class="brand-text">ZHU WEIXIAN</span></a>
    <button class="nav-toggle" type="button" id="navToggle">菜单</button>
    <nav class="nav-links">${entries.map(([label,href,cls])=>`<a class="${cls}" href="${href}">${esc(label)}</a>`).join('')}</nav>
    <button class="theme-toggle" id="themeToggle" type="button" aria-label="切换白天或黑夜模式"></button>
  </div>`;
}

function renderResumePage(d){
  const r=d.resume||{};
  const title=r.title||'个人简历';
  const img=r.image?`<img class="resume-img zoomable-image-slot" data-zoomable-image data-zoom-title="${esc(title)}" src="${asset(r.image)}" alt="${esc(title)}">`:`<div class="blue-placeholder resume-img-placeholder zoomable-image-slot" data-zoom-placeholder="个人简历">个人简历</div>`;
  const imgHref=r.image?asset(r.image):'#';
  const pdfHref=r.pdf?asset(r.pdf):'#';
  return `<div class="resume-image-card">${img}</div>
  <aside class="resume-action-card">
    <p class="eyebrow">Resume File</p>
    <h2>${esc(title)}</h2>
    <p>${esc(r.desc||'点击简历图片可放大查看，也可以下载图片或 PDF 版本。')}</p>
    <div class="resume-downloads">
      <a class="resume-download-image primary ${r.image?'':'is-disabled'}" href="${imgHref}" ${r.image?`download="${esc(r.imageFileName||'resume.png')}"`:''}>下载简历图片</a>
      <a class="resume-download-pdf ${r.pdf?'':'is-disabled'}" href="${pdfHref}" ${r.pdf?`download="${esc(r.pdfFileName||'resume.pdf')}"`:''}>下载 PDF 文件</a>
    </div>
  </aside>`;
}

function injectPageBackButton(d){
  if(!document.body.classList.contains('sub-page'))return;
  if(document.querySelector('.page-back-btn'))return;
  const page=document.body.dataset.page || '';
  const map={portfolio:'portfolio-entry',video:'portfolio-entry',graphic:'portfolio-entry',music:'portfolio-entry',game:'portfolio-entry',resume:'portfolio-entry',campus:'experience',project:'experience',eggy:'eggy',making:'profile'};
  const section=map[page] || 'profile';
  const a=document.createElement('a');
  a.className='page-back-btn';
  a.href=`../home.html?section=${encodeURIComponent(section)}`;
  a.textContent='返回';
  document.body.appendChild(a);
}

function normalizeReturnButtonsV19(){
  document.querySelectorAll('.page-back-btn,.avatar-secret-back,.nav-links a.back-entry').forEach(el=>{el.textContent='返回';});
  document.querySelectorAll('.site-footer a').forEach(el=>{ if(/返回/.test(el.textContent||'')) el.textContent='返回'; });
}

document.addEventListener('DOMContentLoaded',()=>{
  normalizeReturnButtonsV19();
  setTimeout(normalizeReturnButtonsV19,0);
});

/* ================= V20：前页导航、返回按钮稳定、获奖按钮固定尺寸 ================= */
function renderHeader(d){
  const inPage=location.pathname.includes('/pages/');
  const home=inPage?'../home.html':'./home.html';
  const page=p=>inPage?`./${p}`:`./pages/${p}`;
  const entries=[
    ['首页',normalizedHomeSectionLink('profile'),'home-nav'],
    ['作品集',normalizedHomeSectionLink('portfolio-entry'),'portfolio-nav'],
    ['经历',normalizedHomeSectionLink('experience'),''],
    ['技能',normalizedHomeSectionLink('skills'),''],
    ['游戏阅历',normalizedHomeSectionLink('games'),''],
    ['获奖',normalizedHomeSectionLink('awards'),''],
    ['简历',page('resume.html'),'resume-nav'],
    ['网站制作花絮',page('making-of.html'),'making-nav'],
    ['前页',inPage?'../index.html':'./index.html','back-entry']
  ];
  return `<div class="nav-inner">
    <a class="brand" href="${home}"><span class="brand-text">ZHU WEIXIAN</span></a>
    <button class="nav-toggle" type="button" id="navToggle">菜单</button>
    <nav class="nav-links">${entries.map(([label,href,cls])=>`<a class="${cls}" href="${href}">${esc(label)}</a>`).join('')}</nav>
    <button class="theme-toggle" id="themeToggle" type="button" aria-label="切换白天或黑夜模式"></button>
  </div>`;
}

function injectPageBackButton(d){
  if(!document.body.classList.contains('sub-page')) return;
  document.querySelectorAll('.page-back-btn').forEach((el,i)=>{ if(i>0) el.remove(); });
  if(document.querySelector('.page-back-btn')) return;
  const page=document.body.dataset.page || '';
  const map={portfolio:'portfolio-entry',video:'portfolio-entry',graphic:'portfolio-entry',music:'portfolio-entry',game:'portfolio-entry',resume:'portfolio-entry',campus:'experience',project:'experience',eggy:'eggy',making:'profile'};
  const section=map[page] || 'profile';
  const a=document.createElement('a');
  a.className='page-back-btn';
  a.href=`../home.html?section=${encodeURIComponent(section)}`;
  a.textContent='返回';
  a.setAttribute('aria-label','返回');
  document.body.appendChild(a);
}

function normalizeReturnButtonsV20(){
  const navBack=document.querySelector('.nav-links a.back-entry');
  if(navBack) navBack.textContent='前页';
  document.querySelectorAll('.page-back-btn,.avatar-secret-back').forEach(el=>{el.textContent='返回';});
  document.querySelectorAll('.page-back-btn').forEach((el,i)=>{ if(i>0) el.remove(); });
  if(document.body.classList.contains('sub-page')){
    document.querySelectorAll('.site-footer a').forEach(el=>{el.setAttribute('aria-hidden','true');el.tabIndex=-1;});
  }
}

function initAwards(){
  const rail=document.getElementById('awardRail');
  const toggle=document.getElementById('awardToggle');
  if(!rail || !toggle || toggle.dataset.v20Bound==='1') return;
  toggle.dataset.v20Bound='1';
  toggle.style.width='58px';
  toggle.style.height='72px';
  toggle.addEventListener('click',()=>{
    const open=rail.classList.toggle('is-expanded');
    toggle.setAttribute('aria-expanded',String(open));
    toggle.style.width='58px';
    toggle.style.height='72px';
    toggle.classList.remove('is-click-pop');
    void toggle.offsetWidth;
    toggle.classList.add('is-click-pop');
    window.setTimeout(()=>{
      toggle.classList.remove('is-click-pop');
      toggle.style.width='58px';
      toggle.style.height='72px';
    },360);
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  if(window.APP_DATA) injectPageBackButton(window.APP_DATA);
  normalizeReturnButtonsV20();
  requestAnimationFrame(normalizeReturnButtonsV20);
  setTimeout(normalizeReturnButtonsV20,80);
});

/* ================= V24：固定导航激活、经历显示安全、头像隐藏页排除导航 ================= */
function initNavSelection(){
  const links=[...document.querySelectorAll('.nav-links a')];
  if(!links.length || document.body.classList.contains('avatar-secret-page')) return;
  const page=document.body.dataset.page||'';
  const pageMap={
    resume:'.resume-nav',
    making:'.making-nav',
    portfolio:'.portfolio-nav',
    video:'.portfolio-nav',
    graphic:'.portfolio-nav',
    music:'.portfolio-nav',
    game:'.portfolio-nav',
    campus:'a[href*="experience"]',
    project:'a[href*="experience"]',
    eggy:'a[href*="eggy"]'
  };
  const sectionItems=links.map(a=>{
    const href=a.getAttribute('href')||'';
    let id='';
    if(href.startsWith('#')) id=href.slice(1);
    else if(href.includes('?section=')) id=decodeURIComponent(href.split('?section=')[1].split('&')[0]||'');
    return {a,id,section:id?document.getElementById(id):null};
  }).filter(x=>x.section);
  function clear(){links.forEach(a=>a.classList.remove('is-active'));}
  function setActive(a){if(!a)return;clear();a.classList.add('is-active');}
  function pageActive(){
    if(pageMap[page]){
      const target=document.querySelector('.nav-links '+pageMap[page]);
      if(target){setActive(target);return true;}
    }
    return false;
  }
  function activateByScroll(){
    if(document.body.classList.contains('home-page') && sectionItems.length){
      const header=document.querySelector('.site-header');
      const headerH=header?header.getBoundingClientRect().height:72;
      let best=null,bestScore=Infinity;
      sectionItems.forEach(item=>{
        const r=item.section.getBoundingClientRect();
        if(r.bottom>headerH+42 && r.top<innerHeight*.62){
          const score=Math.abs(r.top-headerH-28);
          if(score<bestScore){best=item;bestScore=score;}
        }
      });
      if(best){setActive(best.a);return;}
      const home=links.find(a=>a.classList.contains('home-nav'));
      if(scrollY<120 && home) setActive(home);
      return;
    }
    pageActive();
  }
  let ticking=false;
  window.addEventListener('scroll',()=>{
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(()=>{activateByScroll();ticking=false;});
  },{passive:true});
  window.addEventListener('resize',()=>requestAnimationFrame(activateByScroll),{passive:true});
  links.forEach(a=>{
    a.addEventListener('click',()=>{
      const href=a.getAttribute('href')||'';
      if(href.startsWith('#')) setTimeout(activateByScroll,120);
    });
  });
  activateByScroll();
  setTimeout(activateByScroll,120);
  setTimeout(activateByScroll,420);
}

function initSectionQueryJump(){
  if(!document.body.classList.contains('home-page')) return;
  const params=new URLSearchParams(location.search);
  const section=params.get('section');
  if(!section) return;
  const target=document.getElementById(section);
  if(target){
    requestAnimationFrame(()=>{
      const header=document.querySelector('.site-header');
      const offset=(header?header.getBoundingClientRect().height:72)+18;
      const top=target.getBoundingClientRect().top+window.scrollY-offset;
      window.scrollTo({top:Math.max(0,top),behavior:'auto'});
      history.replaceState(null,'',location.pathname);
      setTimeout(()=>{try{initNavSelection();}catch(e){}},80);
    });
  }
}

function normalizeReturnButtonsV20(){
  const navBack=document.querySelector('.nav-links a.back-entry');
  if(navBack) navBack.textContent='前页';
  document.querySelectorAll('.page-back-btn,.avatar-secret-back').forEach(el=>{el.textContent='返回';});
  document.querySelectorAll('.page-back-btn').forEach((el,i)=>{ if(i>0) el.remove(); });
  if(document.body.classList.contains('sub-page')){
    document.querySelectorAll('.site-footer a').forEach(el=>{el.setAttribute('aria-hidden','true');el.tabIndex=-1;});
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  requestAnimationFrame(()=>{
    normalizeReturnButtonsV20();
    initNavSelection();
  });
  setTimeout(()=>{
    normalizeReturnButtonsV20();
    initNavSelection();
  },180);
});

/* V24.2：固定导航下的同页锚点跳转，避免板块标题被导航栏遮挡 */
document.addEventListener('click',e=>{
  const a=e.target.closest('.nav-links a[href^="#"]');
  if(!a) return;
  const id=(a.getAttribute('href')||'').slice(1);
  const target=document.getElementById(id);
  if(!target) return;
  e.preventDefault();
  const header=document.querySelector('.site-header');
  const offset=(header?header.getBoundingClientRect().height:72)+18;
  const top=target.getBoundingClientRect().top+window.scrollY-offset;
  window.scrollTo({top:Math.max(0,top),behavior:'smooth'});
  history.replaceState(null,'','#'+id);
  setTimeout(()=>{try{initNavSelection();}catch(err){}},160);
},true);

/* ================= V28：主站与隐藏页背景对调 - 主站丝绸极光背景 ================= */
(function initSiteAuroraBackgroundV28(){
  'use strict';
  function boot(){
    const body=document.body;
    if(!body || body.classList.contains('entry-page') || body.classList.contains('avatar-secret-page')) return;
    if(document.getElementById('siteAuroraBgV28')) return;
    const canvas=document.createElement('canvas');
    canvas.id='siteAuroraBgV28';
    canvas.className='site-aurora-bg-v28';
    canvas.setAttribute('aria-hidden','true');
    body.insertBefore(canvas, body.firstChild);
    const fallback=document.createElement('div');
    fallback.className='site-aurora-fallback-v28';
    fallback.setAttribute('aria-hidden','true');
    body.insertBefore(fallback, canvas.nextSibling);

    const gl=canvas.getContext('webgl',{antialias:false,alpha:false});
    if(!gl){ canvas.remove(); fallback.classList.add('is-visible'); return; }

    const vertexSource='attribute vec2 position;void main(){gl_Position=vec4(position,0.0,1.0);}';
    const fragmentSource=`
precision highp float;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_speed;
uniform float u_intensity;
uniform float u_grain;
uniform float u_vignette;
uniform float u_mouseInfluence;
uniform vec3 u_base;
uniform vec3 u_mid;
uniform vec3 u_sheen;
uniform vec3 u_accent;
float hash(vec2 p){return fract(sin(dot(p,vec2(41.93,289.17)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f);float a=hash(i);float b=hash(i+vec2(1.0,0.0));float c=hash(i+vec2(0.0,1.0));float d=hash(i+vec2(1.0,1.0));return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float value=0.0;float amp=0.5;mat2 rot=mat2(0.82,0.57,-0.57,0.82);for(int i=0;i<5;i++){value+=amp*noise(p);p=rot*p*2.03;amp*=0.5;}return value;}
float ribbon(vec2 p,float offset,float width,float softness){float y=p.y+sin(p.x*1.8+offset)*0.18;y+=sin(p.x*4.2-offset*0.7)*0.045;return smoothstep(width+softness,width,abs(y));}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  float aspect=u_res.x/max(u_res.y,1.0);
  vec2 p=(uv-0.5)*vec2(aspect,1.0);
  vec2 mouse=(u_mouse-0.5)*vec2(aspect,1.0);
  float t=u_time*0.12*u_speed;
  float pointerFalloff=smoothstep(1.05,0.0,length(p-mouse));
  p+=(mouse-p)*pointerFalloff*0.038*u_mouseInfluence;
  vec2 silk=p;
  silk.x+=fbm(p*1.6+vec2(t*0.8,-t*0.35))*0.16;
  silk.y+=fbm(p*2.2+vec2(-t*0.25,t*0.7))*0.10;
  float veilA=ribbon(silk+vec2(-0.18,0.08),t*2.1,0.055,0.22);
  float veilB=ribbon(silk*vec2(0.86,1.18)+vec2(0.2,-0.14),-t*2.8+1.7,0.038,0.18);
  float veilC=ribbon(silk*vec2(1.18,0.9)+vec2(-0.08,0.24),t*1.4-2.1,0.03,0.16);
  float atmosphere=fbm(p*1.35+vec2(t*0.22,-t*0.1));
  float pearlescent=pow(max(0.0,sin((p.x-p.y)*7.5+atmosphere*4.0-t*2.5)),5.0);
  float glint=pow(max(0.0,noise(gl_FragCoord.xy*0.065+t*18.0)-0.72),5.0);
  vec3 col=u_base;
  col=mix(col,u_mid,smoothstep(-0.45,0.75,p.y+atmosphere*0.75));
  col+=u_accent*veilA*0.72*u_intensity;
  col+=u_sheen*veilB*0.64*u_intensity;
  col+=mix(u_sheen,u_accent,0.35)*veilC*0.42*u_intensity;
  col+=u_sheen*pearlescent*0.075*u_intensity;
  col+=vec3(0.84,0.74,1.0)*glint*0.18*u_intensity;
  col+=mix(u_sheen,u_accent,0.35)*pointerFalloff*0.14*u_mouseInfluence;
  float vignette=smoothstep(1.25,0.22,length(p));
  col*=mix(1.0-u_vignette*0.42,1.06,vignette);
  float grain=(hash(gl_FragCoord.xy+t*90.0)-0.5)*0.08*u_grain;
  col+=grain;
  gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);
}`;
    function compile(type,source){
      const shader=gl.createShader(type); if(!shader) return null;
      gl.shaderSource(shader,source); gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}
      return shader;
    }
    const vertex=compile(gl.VERTEX_SHADER,vertexSource);
    const fragment=compile(gl.FRAGMENT_SHADER,fragmentSource);
    if(!vertex || !fragment){ canvas.remove(); fallback.classList.add('is-visible'); return; }
    const program=gl.createProgram();
    if(!program){ canvas.remove(); fallback.classList.add('is-visible'); return; }
    gl.attachShader(program,vertex); gl.attachShader(program,fragment); gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){ canvas.remove(); fallback.classList.add('is-visible'); return; }
    gl.useProgram(program);
    const position=gl.getAttribLocation(program,'position');
    const buffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const u={
      res:gl.getUniformLocation(program,'u_res'), mouse:gl.getUniformLocation(program,'u_mouse'), time:gl.getUniformLocation(program,'u_time'),
      speed:gl.getUniformLocation(program,'u_speed'), intensity:gl.getUniformLocation(program,'u_intensity'), grain:gl.getUniformLocation(program,'u_grain'),
      vignette:gl.getUniformLocation(program,'u_vignette'), mouseInfluence:gl.getUniformLocation(program,'u_mouseInfluence'), base:gl.getUniformLocation(program,'u_base'),
      mid:gl.getUniformLocation(program,'u_mid'), sheen:gl.getUniformLocation(program,'u_sheen'), accent:gl.getUniformLocation(program,'u_accent')
    };
    function hexToRgb(hex){const v=hex.replace('#','');return [parseInt(v.slice(0,2),16)/255,parseInt(v.slice(2,4),16)/255,parseInt(v.slice(4,6),16)/255];}
    let currentTheme='';
    function themeSettings(){
      const light=document.documentElement.getAttribute('data-theme')==='light';
      return light
        ? {base:'#d9c8ff',mid:'#b7eef6',sheen:'#ffd36f',accent:'#a987ff',speed:1.10,intensity:1.48,grain:.12,vignette:.12,mouse:.72}
        : {base:'#01030a',mid:'#08101d',sheen:'#70533a',accent:'#1b837c',speed:.62,intensity:.32,grain:.20,vignette:1.10,mouse:.36};
    }
    function applyTheme(){
      const key=document.documentElement.getAttribute('data-theme')||'dark';
      if(key===currentTheme) return;
      currentTheme=key;
      const s=themeSettings();
      const base=hexToRgb(s.base), mid=hexToRgb(s.mid), sheen=hexToRgb(s.sheen), accent=hexToRgb(s.accent);
      gl.uniform3f(u.base,base[0],base[1],base[2]);
      gl.uniform3f(u.mid,mid[0],mid[1],mid[2]);
      gl.uniform3f(u.sheen,sheen[0],sheen[1],sheen[2]);
      gl.uniform3f(u.accent,accent[0],accent[1],accent[2]);
    }
    const reduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target={x:.5,y:.5};
    const mouse={x:.5,y:.5};
    const start=performance.now();
    let raf=0;
    function resize(){
      const dpr=Math.min(window.devicePixelRatio||1,1.35);
      const w=Math.max(1,window.innerWidth), h=Math.max(1,window.innerHeight);
      canvas.width=Math.floor(w*dpr); canvas.height=Math.floor(h*dpr);
      gl.viewport(0,0,canvas.width,canvas.height); gl.uniform2f(u.res,canvas.width,canvas.height);
    }
    function onPointerMove(e){target.x=e.clientX/Math.max(1,window.innerWidth);target.y=1-e.clientY/Math.max(1,window.innerHeight);}
    function onPointerLeave(){target.x=.5;target.y=.5;}
    function render(now){
      applyTheme();
      const s=themeSettings();
      mouse.x+=(target.x-mouse.x)*.045; mouse.y+=(target.y-mouse.y)*.045;
      const elapsed=reduced?8:(now-start)/1000;
      gl.uniform2f(u.mouse,mouse.x,mouse.y);
      gl.uniform1f(u.time,elapsed);
      gl.uniform1f(u.speed,reduced?0:s.speed);
      gl.uniform1f(u.intensity,s.intensity);
      gl.uniform1f(u.grain,s.grain);
      gl.uniform1f(u.vignette,s.vignette);
      gl.uniform1f(u.mouseInfluence,reduced?0:s.mouse);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      raf=requestAnimationFrame(render);
    }
    window.addEventListener('resize',resize,{passive:true});
    window.addEventListener('pointermove',onPointerMove,{passive:true});
    window.addEventListener('pointerleave',onPointerLeave,{passive:true});
    resize(); applyTheme(); raf=requestAnimationFrame(render);
    window.addEventListener('pagehide',()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener('resize',resize);
      window.removeEventListener('pointermove',onPointerMove);
      window.removeEventListener('pointerleave',onPointerLeave);
      gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment);
    },{once:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();


/* ================= V35：光晕性能修复 ================= */
(function repairCursorGlowV30(){
  'use strict';
  // V35：禁用旧的 V30 光晕监听器，避免与新版 transform 光晕重复绑定造成延迟。
  return;
})();


/* ================= V31：覆盖 BGM 状态与鼠标照射逻辑 ================= */
function initMusic(d){
  const bgm=document.getElementById('bgm');
  const btn=document.getElementById('musicBtn');
  if(!bgm||!btn) return;
  btn.setAttribute('aria-pressed','false');
  btn.dataset.state='paused';
  if(!btn.title) btn.title='播放 / 暂停 BGM';
  const sync=()=>{
    const playing=!bgm.paused && !bgm.ended;
    btn.classList.toggle('is-playing',playing);
    btn.dataset.state=playing?'playing':'paused';
    btn.setAttribute('aria-pressed',String(playing));
  };
  async function play(){
    try{await bgm.play();}catch(e){}
    sync();
  }
  btn.addEventListener('click',ev=>{
    ev.stopPropagation();
    if(bgm.paused) play();
    else{ bgm.pause(); sync(); }
  });
  bgm.addEventListener('play',sync);
  bgm.addEventListener('pause',sync);
  bgm.addEventListener('ended',sync);
  document.addEventListener('click',()=>{ if(bgm.paused) play(); },{once:true});
  sync();
}

function initCursorGlow(){
  const glow=document.getElementById('cursorGlow');
  if(!glow || matchMedia('(pointer:coarse)').matches) return;
  let spot=document.getElementById('cursorSpotlightV31');
  if(!spot){
    spot=document.createElement('div');
    spot.id='cursorSpotlightV31';
    spot.className='cursor-spotlight-v31';
    spot.setAttribute('aria-hidden','true');
    document.body.appendChild(spot);
  }
  let x=window.innerWidth/2, y=window.innerHeight/2;
  let visible=false;
  let raf=0;
  const apply=()=>{
    const tr=`translate3d(${Math.round(x)}px,${Math.round(y)}px,0) translate3d(-50%,-50%,0)`;
    glow.style.setProperty('left','0','important');
    glow.style.setProperty('top','0','important');
    glow.style.setProperty('transform',tr,'important');
    spot.style.setProperty('left','0','important');
    spot.style.setProperty('top','0','important');
    spot.style.setProperty('transform',tr,'important');
    const op=visible?'1':'0';
    glow.style.opacity=op;
    spot.style.opacity=op;
    document.documentElement.style.setProperty('--cursor-x',Math.round(x)+'px');
    document.documentElement.style.setProperty('--cursor-y',Math.round(y)+'px');
    raf=0;
  };
  const schedule=()=>{ if(!raf) raf=requestAnimationFrame(apply); };
  const move=ev=>{ x=ev.clientX; y=ev.clientY; visible=true; schedule(); };
  const hide=()=>{ visible=false; schedule(); };
  window.addEventListener('pointermove',move,{passive:true});
  window.addEventListener('pointerleave',hide,{passive:true});
  window.addEventListener('blur',hide,{passive:true});
}



/* ================= V33：主题切换提示与白天背景可见性补丁 ================= */
(function initThemeToggleTipV33(){
  'use strict';
  function boot(){
    const btn=document.getElementById('themeToggle');
    if(!btn || btn.closest('.theme-toggle-wrap-v33')) return;
    const wrap=document.createElement('span');
    wrap.className='theme-toggle-wrap-v33';
    btn.parentNode.insertBefore(wrap,btn);
    wrap.appendChild(btn);
    const tip=document.createElement('div');
    tip.className='theme-tip-v33';
    tip.setAttribute('role','note');
    tip.innerHTML='<span>点击这里可以切换白天 / 黑夜模式</span><button class="theme-tip-close-v33" type="button" aria-label="关闭提示">×</button>';
    wrap.appendChild(tip);
    const close=tip.querySelector('.theme-tip-close-v33');
    close.addEventListener('click',ev=>{
      ev.preventDefault();
      ev.stopPropagation();
      tip.style.opacity='0';
      tip.style.transform='translate3d(0,-6px,0) scale(.96)';
      setTimeout(()=>tip.remove(),180);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});
  else setTimeout(boot,0);
})();

/* ================= V34：制作耗时弹出页重构 - 浅色模式、返回按钮、低卡顿跑马灯 ================= */
function openDurationWall(){
  document.querySelectorAll('.duration-marquee-wall').forEach(x=>x.remove());
  const word='累死了';
  const row=(i)=>`<div class="duration-marquee-row duration-row-${i}">${Array(10).fill(`<span>${esc(word)}</span>`).join('')}</div>`;
  const div=document.createElement('div');
  div.className='duration-marquee-wall duration-wall-v34';
  div.setAttribute('role','dialog');
  div.setAttribute('aria-label','制作耗时');
  div.innerHTML=`<button class="duration-marquee-close duration-wall-back-v34" type="button" aria-label="返回">返回</button><div class="duration-wall-stage-v34">${row(1)}${row(2)}${row(3)}${row(4)}</div>`;
  document.body.appendChild(div);
  const close=()=>div.remove();
  div.querySelector('.duration-marquee-close').addEventListener('click',close);
  div.addEventListener('click',e=>{if(e.target===div) close();});
  document.addEventListener('keydown',function escClose(e){
    if(e.key==='Escape'){close();document.removeEventListener('keydown',escClose);}
  });
}


/* ================= V36：浅色背景修复、主题提示每次进站显示、头像长按加速 ================= */
(function v36ThemeTipEveryVisit(){
  'use strict';
  function boot(){
    // V37 接管主题提示显示频率，避免 V36 每次进站都弹出造成打扰。
    return;
    const btn=document.getElementById('themeToggle');
    if(!btn) return;
    let wrap=btn.closest('.theme-toggle-wrap-v33');
    if(!wrap){
      wrap=document.createElement('span');
      wrap.className='theme-toggle-wrap-v33';
      btn.parentNode.insertBefore(wrap,btn);
      wrap.appendChild(btn);
    }
    wrap.querySelectorAll('.theme-tip-v33').forEach(el=>el.remove());
    const tip=document.createElement('div');
    tip.className='theme-tip-v33 theme-tip-v36';
    tip.setAttribute('role','note');
    tip.innerHTML='<span>点击这里切换白天 / 黑夜</span><button class="theme-tip-close-v33" type="button" aria-label="关闭提示">×</button>';
    wrap.appendChild(tip);
    const close=tip.querySelector('.theme-tip-close-v33');
    close.addEventListener('click',ev=>{
      ev.preventDefault();
      ev.stopPropagation();
      tip.classList.add('is-closing');
      window.setTimeout(()=>tip.remove(),180);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,30),{once:true});
  else setTimeout(boot,30);
})();


/* ================= V37：主题提示降频 + 制作耗时文字随机游动碰撞 ================= */
(function initThemeTipV37(){
  'use strict';
  const TIP_SEEN_KEY='zhuweixian_theme_tip_seen_v37';
  const TIP_CLOSED_KEY='zhuweixian_theme_tip_closed_v37';
  const TIP_TEXT='点击这里可以切换白天 / 黑夜模式';

  function safeSessionGet(key){
    try{return window.sessionStorage.getItem(key);}catch{return null;}
  }
  function safeSessionSet(key,value){
    try{window.sessionStorage.setItem(key,value);}catch{}
  }
  function removeOldTips(wrap){
    document.querySelectorAll('.theme-tip-v33,.theme-tip-v36,.theme-tip-v37').forEach(el=>{
      if(el && el.parentNode) el.parentNode.removeChild(el);
    });
    if(wrap){wrap.querySelectorAll('.theme-tip-v33,.theme-tip-v36,.theme-tip-v37').forEach(el=>el.remove());}
  }
  function boot(){
    const btn=document.getElementById('themeToggle');
    if(!btn) return;
    let wrap=btn.closest('.theme-toggle-wrap-v33');
    if(!wrap){
      wrap=document.createElement('span');
      wrap.className='theme-toggle-wrap-v33 theme-toggle-wrap-v37';
      btn.parentNode.insertBefore(wrap,btn);
      wrap.appendChild(btn);
    }else{
      wrap.classList.add('theme-toggle-wrap-v37');
    }

    removeOldTips(wrap);

    const alreadySeen=safeSessionGet(TIP_SEEN_KEY)==='1';
    const alreadyClosed=safeSessionGet(TIP_CLOSED_KEY)==='1';
    if(alreadySeen || alreadyClosed) return;

    const tip=document.createElement('div');
    tip.className='theme-tip-v33 theme-tip-v37';
    tip.setAttribute('role','note');
    tip.innerHTML='<span>'+TIP_TEXT+'</span><button class="theme-tip-close-v33 theme-tip-close-v37" type="button" aria-label="关闭提示">×</button>';
    wrap.appendChild(tip);
    safeSessionSet(TIP_SEEN_KEY,'1');

    const close=()=>{
      tip.classList.add('is-closing');
      safeSessionSet(TIP_CLOSED_KEY,'1');
      window.setTimeout(()=>tip.remove(),180);
    };
    const closeBtn=tip.querySelector('.theme-tip-close-v37');
    if(closeBtn){
      closeBtn.addEventListener('click',ev=>{
        ev.preventDefault();
        ev.stopPropagation();
        close();
      });
    }
    // 自动停留一段时间后收起，减少视觉打扰；本次会话不再重复弹出。
    window.setTimeout(()=>{
      if(tip.isConnected) close();
    },8200);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>window.setTimeout(boot,90),{once:true});
  else window.setTimeout(boot,90);
})();

function openDurationWall(){
  document.querySelectorAll('.duration-marquee-wall').forEach(x=>x.remove());
  const reduceMotion=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const word='累死了';
  const count=reduceMotion?18:42;
  const div=document.createElement('div');
  div.className='duration-marquee-wall duration-wall-v34 duration-wall-v37';
  div.setAttribute('role','dialog');
  div.setAttribute('aria-label','制作耗时');
  div.innerHTML=`<button class="duration-marquee-close duration-wall-back-v34 duration-wall-back-v37" type="button" aria-label="返回">返回</button><div class="duration-physics-stage-v37" aria-hidden="true"></div>`;
  document.body.appendChild(div);

  const stage=div.querySelector('.duration-physics-stage-v37');
  const closeBtn=div.querySelector('.duration-marquee-close');
  const nodes=[];
  for(let i=0;i<count;i++){
    const span=document.createElement('span');
    span.className='duration-physics-word-v37';
    span.textContent=word;
    span.style.setProperty('--hue',String((i*37)%360));
    span.style.setProperty('--delay',`${-(i%7)*0.13}s`);
    stage.appendChild(span);
    nodes.push(span);
  }

  const state=[];
  let rafId=0;
  let running=true;
  let bounds={w:1,h:1};
  let last=performance.now();

  function rand(min,max){return min+Math.random()*(max-min);}
  function resize(){
    const rect=stage.getBoundingClientRect();
    bounds={w:Math.max(1,rect.width),h:Math.max(1,rect.height)};
    for(const p of state){
      p.x=Math.min(Math.max(p.r,p.x),bounds.w-p.r);
      p.y=Math.min(Math.max(p.r,p.y),bounds.h-p.r);
    }
  }
  function initState(){
    resize();
    state.length=0;
    nodes.forEach((el,i)=>{
      const rect=el.getBoundingClientRect();
      const r=Math.max(rect.width,rect.height)*0.52;
      const angle=rand(0,Math.PI*2);
      const speed=reduceMotion?0:rand(14,38);
      state.push({
        el,
        r,
        w:rect.width,
        h:rect.height,
        x:rand(r,Math.max(r+1,bounds.w-r)),
        y:rand(r,Math.max(r+1,bounds.h-r)),
        vx:Math.cos(angle)*speed,
        vy:Math.sin(angle)*speed,
        phase:rand(0,Math.PI*2),
        spin:rand(-2.4,2.4),
        rot:rand(-10,10),
        mass:r*r,
        index:i
      });
    });
  }
  function resolveCollisions(){
    for(let i=0;i<state.length;i++){
      const a=state[i];
      for(let j=i+1;j<state.length;j++){
        const b=state[j];
        let dx=b.x-a.x;
        let dy=b.y-a.y;
        let dist=Math.hypot(dx,dy) || 0.0001;
        const minDist=a.r+b.r+2;
        if(dist<minDist){
          const nx=dx/dist;
          const ny=dy/dist;
          const overlap=(minDist-dist)*0.52;
          a.x-=nx*overlap;
          a.y-=ny*overlap;
          b.x+=nx*overlap;
          b.y+=ny*overlap;

          const rel=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;
          if(rel<0){
            const impulse=-(1.02)*rel/(1/a.mass+1/b.mass);
            a.vx-=impulse*nx/a.mass;
            a.vy-=impulse*ny/a.mass;
            b.vx+=impulse*nx/b.mass;
            b.vy+=impulse*ny/b.mass;
          }
        }
      }
    }
  }
  function tick(now){
    if(!running) return;
    const dt=Math.min(0.032,(now-last)/1000 || 0.016);
    last=now;
    if(!reduceMotion){
      for(const p of state){
        p.phase+=dt*0.9;
        p.vx+=Math.cos(p.phase*1.7+p.index)*3.8*dt;
        p.vy+=Math.sin(p.phase*1.3-p.index)*3.8*dt;
        p.vx*=0.996;
        p.vy*=0.996;
        p.x+=p.vx*dt;
        p.y+=p.vy*dt;
        p.rot+=p.spin*dt;

        if(p.x<p.r){p.x=p.r;p.vx=Math.abs(p.vx)*0.92;}
        if(p.x>bounds.w-p.r){p.x=bounds.w-p.r;p.vx=-Math.abs(p.vx)*0.92;}
        if(p.y<p.r){p.y=p.r;p.vy=Math.abs(p.vy)*0.92;}
        if(p.y>bounds.h-p.r){p.y=bounds.h-p.r;p.vy=-Math.abs(p.vy)*0.92;}
      }
      resolveCollisions();
    }
    for(const p of state){
      p.el.style.transform=`translate3d(${(p.x-p.w/2).toFixed(2)}px,${(p.y-p.h/2).toFixed(2)}px,0) rotate(${p.rot.toFixed(2)}deg)`;
    }
    rafId=requestAnimationFrame(tick);
  }

  function close(){
    running=false;
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize',resize);
    div.remove();
  }
  closeBtn.addEventListener('click',close);
  div.addEventListener('click',e=>{if(e.target===div) close();});
  function escClose(e){
    if(e.key==='Escape'){
      close();
      document.removeEventListener('keydown',escClose);
    }
  }
  document.addEventListener('keydown',escClose);
  window.addEventListener('resize',resize,{passive:true});

  requestAnimationFrame(()=>{
    initState();
    if(reduceMotion){
      state.forEach((p,i)=>{
        const cols=6;
        const row=Math.floor(i/cols);
        const col=i%cols;
        p.x=(col+0.5)*bounds.w/cols;
        p.y=(row+0.5)*bounds.h/Math.ceil(state.length/cols);
      });
    }
    last=performance.now();
    rafId=requestAnimationFrame(tick);
  });
}


/* ================= V38：多设备适配辅助逻辑 ================= */
(function initDeviceAdaptV38(){
  const root=document.documentElement;
  let lastKey="";
  function apply(){
    const w=window.innerWidth||document.documentElement.clientWidth||0;
    const h=window.innerHeight||document.documentElement.clientHeight||0;
    root.style.setProperty('--app-vh', `${Math.max(1,h)*0.01}px`);
    root.dataset.device = w < 560 ? 'phone' : w < 1040 ? 'tablet' : w < 1440 ? 'laptop' : 'desktop';
    root.dataset.orientation = w >= h ? 'landscape' : 'portrait';
    root.dataset.touch = (matchMedia('(hover:none) and (pointer:coarse)').matches ? '1' : '0');
    const key=`${root.dataset.device}-${root.dataset.orientation}`;
    if(key!==lastKey){
      lastKey=key;
      document.querySelectorAll('.site-header.is-open').forEach(hd=>hd.classList.remove('is-open'));
    }
  }
  let raf=0;
  function schedule(){
    if(raf) return;
    raf=requestAnimationFrame(()=>{raf=0;apply();});
  }
  apply();
  addEventListener('resize',schedule,{passive:true});
  addEventListener('orientationchange',()=>setTimeout(apply,180),{passive:true});
  document.addEventListener('click',e=>{
    const header=document.querySelector('.site-header');
    if(!header) return;
    const link=e.target.closest('.nav-links a');
    if(link) header.classList.remove('is-open');
    const toggle=e.target.closest('#navToggle,.nav-toggle');
    if(!toggle && header.classList.contains('is-open') && !e.target.closest('.site-header')) header.classList.remove('is-open');
  },true);
})();


/* ================= V39：主题切换提示弹窗最终修复 ================= */
(function initThemeTipV39(){
  'use strict';
  const TIP_SEEN_KEY='zhuweixian_theme_tip_seen_v39';
  const TIP_TEXT='点击这里切换白天 / 黑夜模式';
  let booted=false;
  let autoTimer=0;

  function getSession(key){
    try{return window.sessionStorage.getItem(key);}catch(err){return window.__ZW_THEME_TIP_V39_SEEN__?'1':null;}
  }
  function setSession(key,value){
    try{window.sessionStorage.setItem(key,value);}catch(err){window.__ZW_THEME_TIP_V39_SEEN__=true;}
  }
  function cleanOldTips(){
    document.querySelectorAll('.theme-tip-v33,.theme-tip-v36,.theme-tip-v37,.theme-tip-v39').forEach(el=>{
      if(el && el.parentNode) el.parentNode.removeChild(el);
    });
  }
  function ensureWrap(btn){
    let wrap=btn.closest('.theme-toggle-wrap-v39');
    if(wrap) return wrap;
    const oldWrap=btn.closest('.theme-toggle-wrap-v33,.theme-toggle-wrap-v37');
    if(oldWrap){
      oldWrap.classList.add('theme-toggle-wrap-v39');
      oldWrap.classList.remove('theme-toggle-wrap-v37');
      return oldWrap;
    }
    wrap=document.createElement('span');
    wrap.className='theme-toggle-wrap-v39';
    if(btn.parentNode){
      btn.parentNode.insertBefore(wrap,btn);
      wrap.appendChild(btn);
    }
    return wrap;
  }
  function closeTip(tip,markSeen=true){
    if(!tip || !tip.isConnected) return;
    if(markSeen) setSession(TIP_SEEN_KEY,'1');
    if(autoTimer){window.clearTimeout(autoTimer);autoTimer=0;}
    tip.classList.add('is-closing');
    window.setTimeout(()=>{ if(tip && tip.parentNode) tip.parentNode.removeChild(tip); },180);
  }
  function boot(){
    const btn=document.getElementById('themeToggle');
    if(!btn) return;
    const wrap=ensureWrap(btn);
    cleanOldTips();

    // 始终保证点击主题切换时会收起当前提示，避免提示遮挡按钮或切换后残留。
    if(!btn.dataset.themeTipV39Bound){
      btn.dataset.themeTipV39Bound='1';
      btn.addEventListener('click',()=>{
        const tip=document.querySelector('.theme-tip-v39');
        if(tip) closeTip(tip,true);
      },{capture:true});
    }

    if(booted || getSession(TIP_SEEN_KEY)==='1') return;
    booted=true;

    const tip=document.createElement('div');
    tip.className='theme-tip-v39';
    tip.id='themeTipV39';
    tip.setAttribute('role','note');
    tip.innerHTML='<span>'+TIP_TEXT+'</span><button class="theme-tip-close-v39" type="button" aria-label="关闭提示">×</button>';
    wrap.appendChild(tip);

    const closeBtn=tip.querySelector('.theme-tip-close-v39');
    if(closeBtn){
      closeBtn.addEventListener('click',ev=>{
        ev.preventDefault();
        ev.stopPropagation();
        closeTip(tip,true);
      });
    }
    autoTimer=window.setTimeout(()=>closeTip(tip,true),6800);
  }

  // 等旧版提示的 setTimeout 执行完再接管，配合 CSS 隐藏旧提示，彻底避免“先闪一下”。
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>window.setTimeout(boot,180),{once:true});
  }else{
    window.setTimeout(boot,180);
  }
})();


/* ================= V40：修复制作耗时点击页 - 多文字物理游动与稳定碰撞 ================= */
function openDurationWall(){
  document.querySelectorAll('.duration-marquee-wall,.duration-wall-v40').forEach(x=>x.remove());
  const reduceMotion=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const word='累死了';
  const vw=Math.max(320, window.innerWidth || document.documentElement.clientWidth || 1200);
  const vh=Math.max(420, window.innerHeight || document.documentElement.clientHeight || 760);
  const count=reduceMotion ? 14 : (vw < 560 ? 16 : vw < 960 ? 22 : 30);
  const div=document.createElement('div');
  div.className='duration-marquee-wall duration-wall-v40';
  div.setAttribute('role','dialog');
  div.setAttribute('aria-label','制作耗时：累死了');
  div.innerHTML='<button class="duration-wall-back-v40" type="button" aria-label="返回">返回</button><div class="duration-physics-stage-v40" aria-hidden="true"></div>';
  document.body.appendChild(div);

  const stage=div.querySelector('.duration-physics-stage-v40');
  const closeBtn=div.querySelector('.duration-wall-back-v40');
  const nodes=[];
  for(let i=0;i<count;i++){
    const el=document.createElement('span');
    el.className='duration-physics-word-v40';
    el.textContent=word;
    el.style.setProperty('--tone', String(i%6));
    el.style.setProperty('--pulse-delay', `${-(i%9)*0.17}s`);
    stage.appendChild(el);
    nodes.push(el);
  }

  let items=[];
  let bounds={w:1,h:1};
  let rafId=0;
  let running=true;
  let last=performance.now();
  let resizeTimer=0;

  function rand(min,max){return min+Math.random()*(max-min);}
  function rect(){
    const r=stage.getBoundingClientRect();
    bounds={w:Math.max(1,r.width),h:Math.max(1,r.height)};
  }
  function placeItems(){
    rect();
    items=[];
    const aspect=bounds.w/Math.max(1,bounds.h);
    const cols=Math.max(3, Math.ceil(Math.sqrt(nodes.length*aspect)));
    const rows=Math.max(3, Math.ceil(nodes.length/cols));
    const cellW=bounds.w/cols;
    const cellH=bounds.h/rows;
    const order=nodes.map((_,i)=>i).sort(()=>Math.random()-.5);
    nodes.forEach((el,idx)=>{
      const box=el.getBoundingClientRect();
      const w=Math.max(44, box.width);
      const h=Math.max(24, box.height);
      const pos=order[idx];
      const col=pos%cols;
      const row=Math.floor(pos/cols);
      const x=Math.min(Math.max(0, col*cellW + (cellW-w)*0.5 + rand(-cellW*.18, cellW*.18)), Math.max(0,bounds.w-w));
      const y=Math.min(Math.max(0, row*cellH + (cellH-h)*0.5 + rand(-cellH*.18, cellH*.18)), Math.max(0,bounds.h-h));
      const angle=rand(0,Math.PI*2);
      const speed=reduceMotion ? 0 : rand(10,26);
      items.push({
        el,w,h,x,y,
        vx:Math.cos(angle)*speed,
        vy:Math.sin(angle)*speed,
        rot:rand(-5,5),
        spin:rand(-1.1,1.1),
        phase:rand(0,Math.PI*2),
        tone:idx
      });
    });
    paint();
  }
  function clamp(p){
    if(p.x<0){p.x=0;p.vx=Math.abs(p.vx)*0.92;}
    if(p.y<0){p.y=0;p.vy=Math.abs(p.vy)*0.92;}
    if(p.x+p.w>bounds.w){p.x=bounds.w-p.w;p.vx=-Math.abs(p.vx)*0.92;}
    if(p.y+p.h>bounds.h){p.y=bounds.h-p.h;p.vy=-Math.abs(p.vy)*0.92;}
  }
  function collide(){
    // AABB 矩形碰撞，比早期圆形半径碰撞更适合文字块，避免大量文字被挤出屏幕。
    for(let i=0;i<items.length;i++){
      const a=items[i];
      for(let j=i+1;j<items.length;j++){
        const b=items[j];
        const ax=a.x+a.w/2, ay=a.y+a.h/2;
        const bx=b.x+b.w/2, by=b.y+b.h/2;
        const overlapX=(a.w+b.w)/2+8-Math.abs(bx-ax);
        const overlapY=(a.h+b.h)/2+8-Math.abs(by-ay);
        if(overlapX>0 && overlapY>0){
          if(overlapX<overlapY){
            const dir=bx>=ax?1:-1;
            const push=overlapX*.52;
            a.x-=dir*push;
            b.x+=dir*push;
            const av=a.vx, bv=b.vx;
            a.vx=bv*.88;
            b.vx=av*.88;
          }else{
            const dir=by>=ay?1:-1;
            const push=overlapY*.52;
            a.y-=dir*push;
            b.y+=dir*push;
            const av=a.vy, bv=b.vy;
            a.vy=bv*.88;
            b.vy=av*.88;
          }
          clamp(a); clamp(b);
        }
      }
    }
  }
  function paint(){
    for(const p of items){
      p.el.style.transform=`translate3d(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px,0) rotate(${p.rot.toFixed(2)}deg)`;
    }
  }
  function tick(now){
    if(!running) return;
    const dt=Math.min(0.034, (now-last)/1000 || 0.016);
    last=now;
    if(!reduceMotion){
      for(const p of items){
        p.phase += dt*(0.7 + (p.tone%5)*0.035);
        p.vx += Math.cos(p.phase*1.41 + p.tone)*2.6*dt;
        p.vy += Math.sin(p.phase*1.23 - p.tone)*2.6*dt;
        p.vx *= 0.997;
        p.vy *= 0.997;
        p.x += p.vx*dt;
        p.y += p.vy*dt;
        p.rot += p.spin*dt;
        clamp(p);
      }
      collide();
    }
    paint();
    rafId=requestAnimationFrame(tick);
  }
  function close(){
    running=false;
    cancelAnimationFrame(rafId);
    clearTimeout(resizeTimer);
    window.removeEventListener('resize',onResize);
    document.removeEventListener('keydown',onKey);
    div.classList.add('is-closing');
    window.setTimeout(()=>div.remove(),160);
  }
  function onKey(e){if(e.key==='Escape') close();}
  function onResize(){
    clearTimeout(resizeTimer);
    resizeTimer=window.setTimeout(()=>{
      if(!running) return;
      placeItems();
    },120);
  }
  closeBtn.addEventListener('click',close);
  div.addEventListener('click',e=>{if(e.target===div) close();});
  document.addEventListener('keydown',onKey);
  window.addEventListener('resize',onResize,{passive:true});
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    placeItems();
    last=performance.now();
    rafId=requestAnimationFrame(tick);
  }));
}


/* ================= V41：制作耗时页轻量动态修复 + 全站性能降载 ================= */
(function(){
  'use strict';

  // 轻量性能优化：用 class 控制降载样式，避免反复执行重动画。
  document.documentElement.classList.add('v41-performance-ready');
  if (window.matchMedia && (matchMedia('(pointer:coarse)').matches || matchMedia('(max-width: 820px)').matches)) {
    document.documentElement.classList.add('v41-low-interaction');
  }

  // 替换之前的“碰撞物理”版本，避免不同浏览器里 transform!important 覆盖导致只显示一个字块。
  window.openDurationWall = function openDurationWallV41(){
    document.querySelectorAll('.duration-marquee-wall,.duration-wall-v37,.duration-wall-v40,.duration-wall-v41').forEach(el=>el.remove());
    const reduceMotion=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const vw=Math.max(320, window.innerWidth || document.documentElement.clientWidth || 1200);
    const vh=Math.max(420, window.innerHeight || document.documentElement.clientHeight || 760);
    const count=reduceMotion ? 16 : (vw < 520 ? 18 : vw < 900 ? 28 : 42);
    const div=document.createElement('div');
    div.className='duration-marquee-wall duration-wall-v41';
    div.setAttribute('role','dialog');
    div.setAttribute('aria-label','制作耗时：累死了');
    div.innerHTML='<button class="duration-wall-back-v41" type="button" aria-label="返回">返回</button><div class="duration-drift-stage-v41" aria-hidden="true"></div>';
    document.body.appendChild(div);

    const stage=div.querySelector('.duration-drift-stage-v41');
    const closeBtn=div.querySelector('.duration-wall-back-v41');
    const rand=(min,max)=>min+Math.random()*(max-min);
    const cols=Math.max(3, Math.ceil(Math.sqrt(count*(vw/Math.max(vh,1)))));
    const rows=Math.max(3, Math.ceil(count/cols));
    const order=Array.from({length:count},(_,i)=>i).sort(()=>Math.random()-.5);

    for(let i=0;i<count;i++){
      const cell=order[i];
      const col=cell%cols;
      const row=Math.floor(cell/cols);
      const el=document.createElement('span');
      el.className='duration-drift-word-v41';
      el.textContent='累死了';
      const left=((col+.5)/cols*100)+rand(-4,4);
      const top=((row+.5)/rows*100)+rand(-5,5);
      el.style.setProperty('--left', Math.max(3,Math.min(94,left)).toFixed(2)+'%');
      el.style.setProperty('--top', Math.max(9,Math.min(92,top)).toFixed(2)+'%');
      el.style.setProperty('--dx', rand(-28,28).toFixed(1)+'px');
      el.style.setProperty('--dy', rand(-22,22).toFixed(1)+'px');
      el.style.setProperty('--rot', rand(-7,7).toFixed(1)+'deg');
      el.style.setProperty('--rot2', rand(-10,10).toFixed(1)+'deg');
      el.style.setProperty('--dur', rand(5.8,10.6).toFixed(2)+'s');
      el.style.setProperty('--delay', (-rand(0,7)).toFixed(2)+'s');
      el.style.setProperty('--tone', String(i%6));
      stage.appendChild(el);
    }

    function close(){
      div.classList.add('is-closing');
      document.removeEventListener('keydown',onKey);
      window.setTimeout(()=>div.remove(),180);
    }
    function onKey(e){ if(e.key==='Escape') close(); }
    closeBtn.addEventListener('click',close,{once:true});
    div.addEventListener('click',e=>{ if(e.target===div) close(); });
    document.addEventListener('keydown',onKey);
  };

  // 委托点击，确保后追加的 openDurationWallV41 一定接管“制作耗时”卡片。
  if(!document.documentElement.dataset.durationV41Bound){
    document.documentElement.dataset.durationV41Bound='1';
    document.addEventListener('click',function(ev){
      const card=ev.target && ev.target.closest && ev.target.closest('[data-making="duration"],.duration-card');
      if(!card) return;
      ev.preventDefault();
      ev.stopPropagation();
      window.openDurationWall();
    },true);
  }
})();


/* ================= V43：移动端前页滑动进入修复 + 全站交互性能降载 ================= */
function initScratchEntry(){
  const canvas=document.getElementById('scratchCanvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d',{alpha:true,desynchronized:true}) || canvas.getContext('2d',{alpha:true});
  const meter=document.getElementById('scratchMeterFill');
  const fallback=document.getElementById('entryFallback');
  const card=document.querySelector('.entry-minimal-card');
  const coarse=window.matchMedia && matchMedia('(pointer:coarse)').matches;
  const reduceMotion=window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w=1,h=1,dpr=1,last=null,energy=0,entering=false,raf=0,drawSeed=0;
  let active=false,restoreFrame=0,cardRaf=0,cardX=0,cardY=0;
  const targetEnergy=coarse ? 2100 : 6200;
  const minSpeed=coarse ? 180 : 940;

  canvas.style.touchAction='none';
  canvas.style.webkitUserSelect='none';
  canvas.style.userSelect='none';
  document.body.classList.add('entry-v43-ready');

  function resize(){
    w=Math.max(1,window.innerWidth||document.documentElement.clientWidth||360);
    h=Math.max(1,window.innerHeight||document.documentElement.clientHeight||640);
    dpr=Math.min(window.devicePixelRatio||1, coarse ? 1.35 : 1.75);
    canvas.width=Math.floor(w*dpr);
    canvas.height=Math.floor(h*dpr);
    canvas.style.width=w+'px';
    canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    drawLayer();
    last=null;
  }
  function drawLayer(){
    ctx.globalCompositeOperation='source-over';
    ctx.clearRect(0,0,w,h);
    const g=ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,'rgba(244,238,255,.92)');
    g.addColorStop(.42,'rgba(218,236,250,.88)');
    g.addColorStop(.72,'rgba(234,224,255,.86)');
    g.addColorStop(1,'rgba(247,225,191,.84)');
    ctx.fillStyle=g;
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle='rgba(7,17,31,.038)';
    const dots=coarse?80:150;
    for(let i=0;i<dots;i++){
      const x=(i*131 + drawSeed*17)%w;
      const y=(i*71 + drawSeed*11)%h;
      ctx.fillRect(x,y,1,1);
    }
    drawSeed=(drawSeed+1)%997;
  }
  function restore(){
    if(entering || reduceMotion) return;
    ctx.globalCompositeOperation='source-over';
    ctx.fillStyle=coarse?'rgba(235,230,250,.018)':'rgba(238,244,250,.024)';
    ctx.fillRect(0,0,w,h);
  }
  function brush(x,y,r){
    ctx.globalCompositeOperation='destination-out';
    const grad=ctx.createRadialGradient(x,y,0,x,y,r);
    grad.addColorStop(0,'rgba(0,0,0,.96)');
    grad.addColorStop(.48,'rgba(0,0,0,.62)');
    grad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=grad;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
  }
  function updateMeter(){
    if(!meter) return;
    meter.style.width=Math.max(0,Math.min(100,energy/targetEnergy*100)).toFixed(1)+'%';
  }
  function enter(){
    if(entering) return;
    entering=true;
    cancelAnimationFrame(raf);
    document.body.classList.add('is-entering');
    window.setTimeout(()=>{ location.href='./home.html'; },420);
  }
  function tilt(x,y){
    if(!card || coarse || reduceMotion) return;
    cardX=x; cardY=y;
    if(cardRaf) return;
    cardRaf=requestAnimationFrame(()=>{
      const r=card.getBoundingClientRect();
      const cx=r.left+r.width/2, cy=r.top+r.height/2;
      card.style.transform=`perspective(900px) rotateX(${(cardY-cy)/r.height*-4.8}deg) rotateY(${(cardX-cx)/r.width*4.8}deg) translateY(-4px)`;
      cardRaf=0;
    });
  }
  function handlePoint(x,y,forceActive=false){
    if(entering) return;
    const now=performance.now();
    if(forceActive) active=true;
    tilt(x,y);
    if(last){
      const dx=x-last.x,dy=y-last.y,dt=Math.max(10,now-last.t);
      const dist=Math.hypot(dx,dy);
      const speed=dist/dt*1000;
      const r=coarse?Math.max(62,Math.min(168,52+dist*.72+speed*.018)):Math.max(56,Math.min(146,54+speed*.038));
      brush(x,y,r);
      if(active || speed>minSpeed){
        const gain=coarse ? dist*(1.65+Math.min(speed/900,1.6)) : dist*Math.min(speed/1250,2.1);
        energy+=gain;
      }else{
        energy*=0.965;
      }
      updateMeter();
      if(energy>=targetEnergy) enter();
    }else{
      brush(x,y,coarse?88:74);
      if(coarse) energy+=80;
      updateMeter();
    }
    last={x,y,t:now};
  }
  function onPointerDown(e){
    active=true;
    if(e.pointerType==='touch') e.preventDefault();
    try{ canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); }catch(_){}
    handlePoint(e.clientX,e.clientY,true);
  }
  function onPointerMove(e){
    if(e.pointerType==='touch' || active) e.preventDefault();
    if(e.pointerType==='touch' && !active) active=true;
    handlePoint(e.clientX,e.clientY,active || e.pointerType==='touch');
  }
  function onPointerEnd(){
    active=false;
    last=null;
    if(card && !coarse) card.style.transform='';
  }
  function onTouchStart(e){
    if(!e.touches || !e.touches[0]) return;
    active=true;
    e.preventDefault();
    const t=e.touches[0];
    handlePoint(t.clientX,t.clientY,true);
  }
  function onTouchMove(e){
    if(!e.touches || !e.touches[0]) return;
    e.preventDefault();
    const t=e.touches[0];
    handlePoint(t.clientX,t.clientY,true);
  }
  function loop(){
    if(!entering){
      restoreFrame++;
      if(restoreFrame%2===0) restore();
      energy*=coarse?0.994:0.988;
      updateMeter();
      raf=requestAnimationFrame(loop);
    }
  }
  const reset=()=>{ active=false; last=null; if(card && !coarse) card.style.transform=''; };
  window.addEventListener('resize',resize,{passive:true});
  canvas.addEventListener('pointerdown',onPointerDown,{passive:false});
  canvas.addEventListener('pointermove',onPointerMove,{passive:false});
  canvas.addEventListener('pointerup',onPointerEnd,{passive:true});
  canvas.addEventListener('pointercancel',onPointerEnd,{passive:true});
  canvas.addEventListener('touchstart',onTouchStart,{passive:false});
  canvas.addEventListener('touchmove',onTouchMove,{passive:false});
  canvas.addEventListener('touchend',reset,{passive:true});
  window.addEventListener('pointerleave',reset,{passive:true});
  if(fallback) fallback.addEventListener('click',e=>{e.preventDefault();enter();});
  resize();
  raf=requestAnimationFrame(loop);
}

function initCursorGlow(){
  const glow=document.getElementById('cursorGlow');
  if(!glow || (window.matchMedia && matchMedia('(pointer:coarse)').matches)) return;
  let spot=document.getElementById('cursorSpotlightV31');
  if(!spot){
    spot=document.createElement('div');
    spot.id='cursorSpotlightV31';
    spot.className='cursor-spotlight-v31';
    spot.setAttribute('aria-hidden','true');
    document.body.appendChild(spot);
  }
  let x=window.innerWidth/2,y=window.innerHeight/2,visible=false,raf=0;
  const apply=()=>{
    const tr=`translate3d(${x|0}px,${y|0}px,0) translate3d(-50%,-50%,0)`;
    glow.style.cssText += ';left:0!important;top:0!important;transform:'+tr+'!important;opacity:'+(visible?'1':'0')+';';
    spot.style.cssText += ';left:0!important;top:0!important;transform:'+tr+'!important;opacity:'+(visible?'1':'0')+';';
    raf=0;
  };
  const schedule=()=>{ if(!raf) raf=requestAnimationFrame(apply); };
  window.addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;visible=true;schedule();},{passive:true});
  window.addEventListener('pointerleave',()=>{visible=false;schedule();},{passive:true});
  window.addEventListener('blur',()=>{visible=false;schedule();},{passive:true});
}

(function initV43DevicePerformance(){
  const root=document.documentElement;
  const coarse=window.matchMedia && matchMedia('(pointer:coarse)').matches;
  const small=window.matchMedia && matchMedia('(max-width: 760px)').matches;
  if(coarse) root.classList.add('v43-touch-device');
  if(small) root.classList.add('v43-small-screen');
  if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) root.classList.add('v43-reduced-motion');
})();


/* ================= V44：网站前页文案与触屏交互微调 ================= */
(function initEntryFrontV44(){
  function apply(){
    const body=document.body;
    if(!body || !body.classList.contains('entry-page')) return;
    body.classList.add('entry-v44-layout');
    const hint=document.querySelector('.entry-motion-hint');
    if(hint){ const d=window.APP_DATA||window.SITE_DATA||{}; hint.textContent=(d.site&&d.site.entryHint)||'滑动进入'; }
    const fallback=document.getElementById('entryFallback');
    if(fallback) fallback.textContent='进入';
    const meter=document.querySelector('.scratch-meter');
    if(meter) meter.setAttribute('aria-hidden','true');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();

/* V44：多端性能标记补充，避免触屏前页加载过重动画。 */
(function initV44DeviceFlags(){
  const root=document.documentElement;
  const coarse=window.matchMedia && matchMedia('(hover:none) and (pointer:coarse)').matches;
  const small=window.matchMedia && matchMedia('(max-width: 720px)').matches;
  if(coarse) root.classList.add('v44-touch');
  if(small) root.classList.add('v44-small');
})();


/* ================= V45：默认白天模式 + 前页引导最终优化 ================= */
function initTheme(){
  const root=document.documentElement;
  const data=window.APP_DATA||window.SITE_DATA||{};
  const defaultTheme=(data.site&&data.site.defaultTheme)||'light';
  const migrationKey='zw-theme-default-v45-applied';
  try{
    if(!localStorage.getItem(migrationKey)){
      localStorage.setItem('zw-theme', defaultTheme);
      localStorage.setItem(migrationKey,'1');
    }
  }catch(_){ }
  let saved=defaultTheme;
  try{ saved=localStorage.getItem('zw-theme')||defaultTheme; }catch(_){ }
  if(saved!=='dark' && saved!=='light') saved='light';
  root.setAttribute('data-theme', saved);
  const setBtn=()=>{
    const btn=document.getElementById('themeToggle');
    if(!btn) return;
    const mode=root.getAttribute('data-theme')||'light';
    btn.setAttribute('data-mode', mode);
    btn.setAttribute('aria-label', mode==='dark'?'切换为白天模式':'切换为黑夜模式');
    if(!btn.querySelector('span')) btn.innerHTML='<span></span>';
  };
  setBtn();
  document.addEventListener('click', e=>{
    const btn=e.target.closest('#themeToggle');
    if(!btn) return;
    const next=(root.getAttribute('data-theme')==='light')?'dark':'light';
    root.setAttribute('data-theme', next);
    try{localStorage.setItem('zw-theme',next);}catch(_){ }
    setBtn();
  }, true);
}

(function initEntryFrontV45(){
  function apply(){
    const body=document.body;
    if(!body || !body.classList.contains('entry-page')) return;
    body.classList.add('entry-v45-layout');
    const data=window.APP_DATA||window.SITE_DATA||{};
    const hint=document.querySelector('.entry-motion-hint');
    if(hint){
      hint.textContent=(data.site&&data.site.entryHint)||'滑动进入';
      hint.setAttribute('aria-label','滑动进入主页');
    }
    const fallback=document.getElementById('entryFallback');
    if(fallback){
      fallback.textContent='进入';
      fallback.setAttribute('aria-label','点击进入主页，建议优先滑动进入');
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();


/* ================= V46：前页右侧箭头入口、卡片交互与多端滑动补充 ================= */
(function initEntryFrontV46(){
  function apply(){
    const body=document.body;
    if(!body || !body.classList.contains('entry-page')) return;
    body.classList.add('entry-v46-layout');
    const data=window.APP_DATA||window.SITE_DATA||{};
    const hint=document.querySelector('.entry-motion-hint');
    if(hint){
      hint.textContent=(data.site&&data.site.entryHint)||'滑动进入';
      hint.setAttribute('aria-label','滑动或快速移动进入主页');
      hint.title='滑动或快速移动进入主页';
    }
    const fallback=document.getElementById('entryFallback');
    if(fallback){
      fallback.textContent='';
      fallback.setAttribute('aria-label','点击卡片右侧进入主页');
      fallback.title='点击进入主页';
    }
    const card=document.querySelector('.entry-minimal-card');
    if(!card || card.dataset.v46Bound==='1') return;
    card.dataset.v46Bound='1';
    const go=()=>{
      if(body.classList.contains('is-entering')) return;
      body.classList.add('is-entering');
      window.setTimeout(()=>{ location.href='./home.html'; },360);
    };
    const isSmall=()=>window.matchMedia && matchMedia('(max-width:760px)').matches;
    card.addEventListener('pointerenter',()=>card.classList.add('is-entry-hover'),{passive:true});
    card.addEventListener('pointerleave',()=>card.classList.remove('is-entry-hover'),{passive:true});
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      if(!r.width || !r.height) return;
      card.style.setProperty('--entry-mx',((e.clientX-r.left)/r.width*100).toFixed(2)+'%');
      card.style.setProperty('--entry-my',((e.clientY-r.top)/r.height*100).toFixed(2)+'%');
    },{passive:true});
    card.addEventListener('click',e=>{
      const target=e.target;
      if(target && target.closest && target.closest('#entryFallback')){e.preventDefault();go();return;}
      const r=card.getBoundingClientRect();
      const ratio=(e.clientX-r.left)/Math.max(1,r.width);
      if(ratio>(isSmall()?0.58:0.66)){
        e.preventDefault();
        go();
      }
    });
    let start=null,last=null,total=0;
    const reset=()=>{start=null;last=null;total=0;};
    card.addEventListener('pointerdown',e=>{
      start={x:e.clientX,y:e.clientY,t:performance.now()};
      last=start; total=0;
    },{passive:true});
    card.addEventListener('pointermove',e=>{
      if(!start || !last) return;
      const now=performance.now();
      const dx=e.clientX-last.x,dy=e.clientY-last.y;
      const step=Math.hypot(dx,dy);
      total+=step;
      const elapsed=Math.max(1,now-start.t);
      const fromStart=Math.hypot(e.clientX-start.x,e.clientY-start.y);
      const speed=fromStart/elapsed*1000;
      const coarse=window.matchMedia && matchMedia('(pointer:coarse)').matches;
      if((coarse && total>120) || (!coarse && (total>280 || speed>1400))){
        reset();
        go();
        return;
      }
      last={x:e.clientX,y:e.clientY,t:now};
    },{passive:true});
    ['pointerup','pointercancel','lostpointercapture'].forEach(type=>card.addEventListener(type,reset,{passive:true}));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();


/* ================= V47：前页全局滑动进入修复 + 弹窗层级状态同步 ================= */
function initScratchEntry(){
  const canvas=document.getElementById('scratchCanvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d',{alpha:true,desynchronized:true}) || canvas.getContext('2d',{alpha:true});
  const meter=document.getElementById('scratchMeterFill');
  const fallback=document.getElementById('entryFallback');
  const card=document.querySelector('.entry-minimal-card');
  const coarse=window.matchMedia && matchMedia('(pointer:coarse)').matches;
  const reduceMotion=window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w=1,h=1,dpr=1,last=null,energy=0,entering=false,raf=0,restoreFrame=0;
  let active=false,cardRaf=0,cardX=0,cardY=0;
  const targetEnergy=coarse ? 1750 : 5600;
  const minSpeed=coarse ? 160 : 880;
  document.body.classList.add('entry-v43-ready','entry-v47-layout');
  if(canvas){
    canvas.style.touchAction='none';
    canvas.style.webkitUserSelect='none';
    canvas.style.userSelect='none';
  }
  function resize(){
    w=Math.max(1,window.innerWidth||document.documentElement.clientWidth||360);
    h=Math.max(1,window.innerHeight||document.documentElement.clientHeight||640);
    dpr=Math.min(window.devicePixelRatio||1,coarse?1.25:1.6);
    canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);
    canvas.style.width=w+'px';canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);drawLayer();last=null;updateMeter();
  }
  function drawLayer(){
    ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,w,h);
    const g=ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,'rgba(244,238,255,.92)');
    g.addColorStop(.44,'rgba(221,236,252,.88)');
    g.addColorStop(.72,'rgba(236,225,255,.86)');
    g.addColorStop(1,'rgba(248,226,196,.84)');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    ctx.fillStyle='rgba(7,17,31,.034)';
    const dots=coarse?70:128;
    for(let i=0;i<dots;i++) ctx.fillRect((i*131)%w,(i*71)%h,1,1);
  }
  function restore(){
    if(entering||reduceMotion) return;
    ctx.globalCompositeOperation='source-over';
    ctx.fillStyle=coarse?'rgba(235,230,250,.014)':'rgba(238,244,250,.020)';
    ctx.fillRect(0,0,w,h);
  }
  function brush(x,y,r){
    ctx.globalCompositeOperation='destination-out';
    const grad=ctx.createRadialGradient(x,y,0,x,y,r);
    grad.addColorStop(0,'rgba(0,0,0,.96)');grad.addColorStop(.48,'rgba(0,0,0,.62)');grad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=grad;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  }
  function updateMeter(){if(meter) meter.style.width=Math.max(0,Math.min(100,energy/targetEnergy*100)).toFixed(1)+'%';}
  function enter(){
    if(entering) return;entering=true;cancelAnimationFrame(raf);document.body.classList.add('is-entering');
    window.setTimeout(()=>{ location.href='./home.html'; },380);
  }
  function tilt(x,y){
    if(!card||coarse||reduceMotion) return;cardX=x;cardY=y;if(cardRaf) return;
    cardRaf=requestAnimationFrame(()=>{const r=card.getBoundingClientRect();if(r.width&&r.height){const cx=r.left+r.width/2,cy=r.top+r.height/2;card.style.setProperty('--entry-mx',((cardX-r.left)/r.width*100).toFixed(2)+'%');card.style.setProperty('--entry-my',((cardY-r.top)/r.height*100).toFixed(2)+'%');card.style.transform=`perspective(900px) rotateX(${(cardY-cy)/r.height*-3.6}deg) rotateY(${(cardX-cx)/r.width*3.6}deg) translateY(-4px)`;}cardRaf=0;});
  }
  function pointFromEvent(e){
    if(e.touches && e.touches[0]) return {x:e.touches[0].clientX,y:e.touches[0].clientY};
    if(e.changedTouches && e.changedTouches[0]) return {x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};
    return {x:e.clientX,y:e.clientY};
  }
  function handlePoint(x,y,forceActive=false){
    if(entering) return;const now=performance.now();if(forceActive) active=true;tilt(x,y);
    if(last){
      const dx=x-last.x,dy=y-last.y,dt=Math.max(10,now-last.t),dist=Math.hypot(dx,dy),speed=dist/dt*1000;
      const r=coarse?Math.max(60,Math.min(150,50+dist*.68+speed*.016)):Math.max(56,Math.min(138,52+speed*.035));
      brush(x,y,r);
      if(active || speed>minSpeed){energy += coarse ? dist*(1.7+Math.min(speed/900,1.45)) : dist*Math.min(speed/1220,2.0);} else energy*=.965;
      updateMeter();if(energy>=targetEnergy) enter();
    }else{brush(x,y,coarse?86:72);if(coarse) energy+=70;updateMeter();}
    last={x,y,t:now};
  }
  function start(e){
    if(entering) return;
    const clickable=e.target&&e.target.closest&&e.target.closest('#entryFallback,.entry-right-hotzone');
    if(clickable && e.pointerType!=='touch') return;
    active=true;const p=pointFromEvent(e);
    if(e.cancelable && !clickable) e.preventDefault();
    handlePoint(p.x,p.y,true);
  }
  function move(e){
    if(entering) return;const p=pointFromEvent(e);
    const clickable=e.target&&e.target.closest&&e.target.closest('#entryFallback,.entry-right-hotzone');
    if((active||e.type.indexOf('touch')===0) && e.cancelable && !clickable) e.preventDefault();
    handlePoint(p.x,p.y,active || e.type.indexOf('touch')===0 || (e.pointerType==='touch'));
  }
  function end(){active=false;last=null;if(card && !coarse) card.style.transform='';}
  function loop(){if(!entering){restoreFrame++;if(restoreFrame%2===0) restore();energy*=coarse?.994:.988;updateMeter();raf=requestAnimationFrame(loop);}}
  window.addEventListener('resize',resize,{passive:true});
  /* 关键修复：监听 window 捕获阶段，而不是只监听 canvas，卡片不再挡住鼠标/触屏滑动。 */
  window.addEventListener('pointerdown',start,{capture:true,passive:false});
  window.addEventListener('pointermove',move,{capture:true,passive:false});
  window.addEventListener('pointerup',end,{capture:true,passive:true});
  window.addEventListener('pointercancel',end,{capture:true,passive:true});
  window.addEventListener('touchstart',start,{capture:true,passive:false});
  window.addEventListener('touchmove',move,{capture:true,passive:false});
  window.addEventListener('touchend',end,{capture:true,passive:true});
  window.addEventListener('pointerleave',end,{passive:true});
  if(fallback) fallback.addEventListener('click',e=>{e.preventDefault();enter();});
  resize();raf=requestAnimationFrame(loop);
}

(function initEntryV47RightArrow(){
  function apply(){
    if(!document.body || !document.body.classList.contains('entry-page')) return;
    document.body.classList.add('entry-v47-layout');
    const card=document.querySelector('.entry-minimal-card');
    const fallback=document.getElementById('entryFallback');
    if(!card) return;
    if(!card.querySelector('.entry-right-hotzone')){
      const btn=document.createElement('button');
      btn.type='button';btn.className='entry-right-hotzone';
      btn.setAttribute('aria-label','点击卡片右侧进入主页');
      btn.title='点击卡片右侧进入主页';
      btn.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation(); if(fallback) fallback.click(); else location.href='./home.html';});
      card.appendChild(btn);
    }
    if(fallback){fallback.textContent='';fallback.setAttribute('aria-label','点击卡片右侧进入主页');fallback.title='点击卡片右侧进入主页';}
    const hint=document.querySelector('.entry-motion-hint');
    if(hint){hint.textContent=(window.APP_DATA&&window.APP_DATA.site&&window.APP_DATA.site.entryHint)||'滑动进入';hint.title='滑动或快速移动进入主页';}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
})();

(function initModalLayerV47(){
  function sync(){
    const has=!!document.querySelector('.modal.is-open,.zoom-overlay,.duration-wall-overlay-v41,.duration-wall-overlay-v40');
    document.body.classList.toggle('modal-open-v47',has);
  }
  const oldOpen=window.openModal;
  window.openModal=function(html,red=false){
    const modal=document.getElementById('genericModal'),content=document.getElementById('modalContent'),panel=document.getElementById('modalPanel');
    if(!modal||!content) return;
    content.innerHTML=html;
    if(panel) panel.classList.toggle('modal-red',!!red);
    modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');
    sync();
  };
  const oldClose=window.closeModal;
  window.closeModal=function(){
    document.querySelectorAll('.modal.is-open').forEach(modal=>{modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');const c=modal.querySelector('#modalContent');if(c)c.innerHTML='';});
    document.querySelectorAll('.zoom-overlay,.duration-wall-overlay-v40,.duration-wall-overlay-v41').forEach(el=>el.remove());
    sync();
  };
  document.addEventListener('click',()=>setTimeout(sync,0),true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape') setTimeout(sync,0);},true);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',sync,{once:true}); else sync();
  try{new MutationObserver(sync).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});}catch(_){ }
})();

/* ================= V48：前页倾斜卡片与边缘箭头最终交互 ================= */
(function initEntryV48CardInteraction(){
  function apply(){
    const body=document.body;
    if(!body || !body.classList.contains('entry-page')) return;
    body.classList.add('entry-v48-layout');
    const card=document.querySelector('.entry-minimal-card');
    if(!card || card.dataset.v48CardBound==='1') return;
    card.dataset.v48CardBound='1';
    const hotzone=card.querySelector('.entry-right-hotzone');
    const coarse=window.matchMedia && matchMedia('(hover:none), (pointer:coarse)').matches;
    const reduce=window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function resetTilt(){
      card.classList.remove('is-entry-hover');
      if(!coarse) card.style.transform='';
    }
    function tiltAt(x,y){
      if(coarse || reduce) return;
      const r=card.getBoundingClientRect();
      if(!r.width || !r.height) return;
      const px=Math.max(0,Math.min(1,(x-r.left)/r.width));
      const py=Math.max(0,Math.min(1,(y-r.top)/r.height));
      const rotY=(px-.5)*8.5;
      const rotX=(.5-py)*7.2;
      card.style.setProperty('--entry-mx',(px*100).toFixed(2)+'%');
      card.style.setProperty('--entry-my',(py*100).toFixed(2)+'%');
      card.style.transform=`perspective(920px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-5px)`;
      card.classList.add('is-entry-hover');
    }
    card.addEventListener('pointermove',ev=>tiltAt(ev.clientX,ev.clientY),{passive:true});
    card.addEventListener('pointerleave',resetTilt,{passive:true});
    if(hotzone){
      hotzone.addEventListener('pointerenter',()=>card.classList.add('is-entry-arrow-hover'),{passive:true});
      hotzone.addEventListener('pointerleave',()=>card.classList.remove('is-entry-arrow-hover'),{passive:true});
      hotzone.addEventListener('focus',()=>card.classList.add('is-entry-arrow-hover'));
      hotzone.addEventListener('blur',()=>card.classList.remove('is-entry-arrow-hover'));
    }
    /* 修正 V47 全局滑动逻辑给卡片写入的 transform：只有鼠标位于卡片范围内时才保留倾斜。 */
    window.addEventListener('pointermove',ev=>{
      if(coarse || reduce || !body.classList.contains('entry-page')) return;
      const r=card.getBoundingClientRect();
      const inside=ev.clientX>=r.left && ev.clientX<=r.right && ev.clientY>=r.top && ev.clientY<=r.bottom;
      if(inside) tiltAt(ev.clientX,ev.clientY);
      else if(!card.classList.contains('is-entry-arrow-hover')) resetTilt();
    },{capture:true,passive:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
})();

/* V48：兼容实际点击层 entryFallback 覆盖右侧区域时的箭头选中态。 */
(function initEntryV48FallbackHover(){
  function apply(){
    const body=document.body;
    if(!body || !body.classList.contains('entry-page')) return;
    const card=document.querySelector('.entry-minimal-card');
    const fallback=document.getElementById('entryFallback');
    if(!card || !fallback || fallback.dataset.v48HoverBound==='1') return;
    fallback.dataset.v48HoverBound='1';
    fallback.addEventListener('pointerenter',()=>card.classList.add('is-entry-arrow-hover'),{passive:true});
    fallback.addEventListener('pointerleave',()=>card.classList.remove('is-entry-arrow-hover'),{passive:true});
    fallback.addEventListener('focus',()=>card.classList.add('is-entry-arrow-hover'));
    fallback.addEventListener('blur',()=>card.classList.remove('is-entry-arrow-hover'));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
})();


/* ================= V49：修复前页卡片 3D 倾斜未生效 + 金黄色箭头渐变选中 ================= */
(function initEntryV49CardTiltAndGoldArrow(){
  function apply(){
    const body=document.body;
    if(!body || !body.classList.contains('entry-page')) return;
    body.classList.add('entry-v49-layout');
    const card=document.querySelector('.entry-minimal-card');
    const fallback=document.getElementById('entryFallback');
    if(!card || card.dataset.v49Bound==='1') return;
    card.dataset.v49Bound='1';
    let hotzone=card.querySelector('.entry-right-hotzone');
    if(!hotzone){
      hotzone=document.createElement('button');
      hotzone.type='button';
      hotzone.className='entry-right-hotzone';
      hotzone.setAttribute('aria-label','点击卡片右侧进入主页');
      hotzone.title='点击卡片右侧进入主页';
      card.appendChild(hotzone);
    }
    if(fallback){
      fallback.textContent='';
      fallback.setAttribute('aria-label','点击卡片右侧进入主页');
      fallback.title='点击卡片右侧进入主页';
    }
    const canTilt=!(window.matchMedia && (matchMedia('(hover:none)').matches || matchMedia('(pointer:coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches));
    let raf=0;
    let lastX=0,lastY=0;
    let arrowLocked=false;
    function enterHome(ev){
      if(ev){ev.preventDefault();ev.stopPropagation();}
      if(body.classList.contains('is-entering')) return;
      body.classList.add('is-entering');
      window.setTimeout(()=>{ location.href='./home.html'; },360);
    }
    function resetTilt(){
      card.classList.remove('is-v49-tilting','is-entry-hover');
      if(!arrowLocked) card.classList.remove('is-entry-arrow-hover');
      card.style.setProperty('--entry-rx','0deg');
      card.style.setProperty('--entry-ry','0deg');
      card.style.setProperty('--entry-lift','0px');
    }
    function updateTilt(){
      raf=0;
      if(!canTilt) return;
      const r=card.getBoundingClientRect();
      if(!r.width || !r.height) return;
      const px=Math.max(0,Math.min(1,(lastX-r.left)/r.width));
      const py=Math.max(0,Math.min(1,(lastY-r.top)/r.height));
      const rotY=(px-.5)*10.5;
      const rotX=(.5-py)*8.4;
      card.style.setProperty('--entry-mx',(px*100).toFixed(2)+'%');
      card.style.setProperty('--entry-my',(py*100).toFixed(2)+'%');
      card.style.setProperty('--entry-rx',rotX.toFixed(2)+'deg');
      card.style.setProperty('--entry-ry',rotY.toFixed(2)+'deg');
      card.style.setProperty('--entry-lift','-6px');
      card.style.transform='';
      card.classList.add('is-v49-tilting','is-entry-hover');
      if(px>.82) card.classList.add('is-entry-arrow-hover');
      else if(!arrowLocked) card.classList.remove('is-entry-arrow-hover');
    }
    function handleMove(ev){
      if(!canTilt) return;
      lastX=ev.clientX; lastY=ev.clientY;
      if(!raf) raf=requestAnimationFrame(updateTilt);
    }
    card.addEventListener('pointermove',handleMove,{passive:true});
    card.addEventListener('pointerleave',()=>{arrowLocked=false; resetTilt();},{passive:true});
    [hotzone,fallback].filter(Boolean).forEach(el=>{
      el.addEventListener('pointerenter',()=>{arrowLocked=true; card.classList.add('is-entry-arrow-hover','is-entry-hover');},{passive:true});
      el.addEventListener('pointerleave',()=>{arrowLocked=false; card.classList.remove('is-entry-arrow-hover');},{passive:true});
      el.addEventListener('focus',()=>{arrowLocked=true; card.classList.add('is-entry-arrow-hover','is-entry-hover');});
      el.addEventListener('blur',()=>{arrowLocked=false; card.classList.remove('is-entry-arrow-hover');});
    });
    hotzone.addEventListener('click',enterHome);
    if(fallback) fallback.addEventListener('click',enterHome);
    /* 兜底：V47 的全局滑动监听会写入 inline transform，这里用最后执行的捕获监听清理它，并由 CSS 变量接管实际变换。 */
    window.addEventListener('pointermove',ev=>{
      if(!canTilt || !body.classList.contains('entry-page')) return;
      const r=card.getBoundingClientRect();
      const inside=ev.clientX>=r.left && ev.clientX<=r.right && ev.clientY>=r.top && ev.clientY<=r.bottom;
      if(inside){lastX=ev.clientX;lastY=ev.clientY;if(!raf) raf=requestAnimationFrame(updateTilt);} 
      else if(!arrowLocked) resetTilt();
    },{capture:true,passive:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();


/* ================= V50：最终修复前页卡片倾斜、箭头错位与黑夜前页卡片变黑 ================= */
(function initEntryV50FinalTilt(){
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); }
  ready(function(){
    var body=document.body;
    if(!body || !body.classList.contains('entry-page')) return;
    body.classList.add('entry-v50-layout');
    var card=document.querySelector('.entry-minimal-card');
    var fallback=document.getElementById('entryFallback');
    if(!card || card.dataset.v50FinalBound==='1') return;
    card.dataset.v50FinalBound='1';

    var hotzone=card.querySelector('.entry-right-hotzone');
    if(!hotzone){
      hotzone=document.createElement('button');
      hotzone.type='button';
      hotzone.className='entry-right-hotzone';
      card.appendChild(hotzone);
    }
    hotzone.setAttribute('aria-label','进入主页');
    hotzone.title='进入主页';
    if(fallback){
      fallback.textContent='';
      fallback.setAttribute('aria-label','进入主页');
      fallback.title='进入主页';
    }

    var reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var coarse=window.matchMedia && (window.matchMedia('(hover:none)').matches || window.matchMedia('(pointer:coarse)').matches);
    var canTilt=!reduce && !coarse;
    var raf=0, latest=null, arrowHover=false;

    function enter(ev){
      if(ev){ ev.preventDefault(); ev.stopPropagation(); }
      if(body.classList.contains('is-entering')) return;
      body.classList.add('is-entering');
      window.setTimeout(function(){ window.location.href='./home.html'; }, 340);
    }

    function setTransform(rx,ry,lift){
      var v='perspective(1050px) rotateX('+rx+'deg) rotateY('+ry+'deg) translate3d(0,'+lift+'px,0)';
      card.style.setProperty('transform',v,'important');
    }

    function reset(){
      raf=0; latest=null; arrowHover=false;
      card.classList.remove('is-v50-tilting','is-v50-arrow-hover','is-v49-tilting','is-entry-arrow-hover','is-entry-hover');
      card.style.setProperty('--v50-rx','0deg');
      card.style.setProperty('--v50-ry','0deg');
      card.style.setProperty('--v50-y','0px');
      card.style.setProperty('--entry-rx','0deg');
      card.style.setProperty('--entry-ry','0deg');
      card.style.setProperty('--entry-lift','0px');
      setTransform(0,0,0);
    }

    function render(){
      raf=0;
      if(!latest || !canTilt) return;
      var r=card.getBoundingClientRect();
      if(!r.width || !r.height) return;
      var px=Math.max(0,Math.min(1,(latest.x-r.left)/r.width));
      var py=Math.max(0,Math.min(1,(latest.y-r.top)/r.height));
      var rotY=(px-.5)*13.5;
      var rotX=(.5-py)*10.2;
      var lift=-7;
      var arrowWidth=Math.min(Math.max(58,r.width*.14),96);
      arrowHover=latest.x >= (r.right-arrowWidth);
      card.style.setProperty('--v50-mx',(px*100).toFixed(2)+'%');
      card.style.setProperty('--v50-my',(py*100).toFixed(2)+'%');
      card.style.setProperty('--v50-rx',rotX.toFixed(2)+'deg');
      card.style.setProperty('--v50-ry',rotY.toFixed(2)+'deg');
      card.style.setProperty('--v50-y',lift+'px');
      setTransform(rotX.toFixed(2),rotY.toFixed(2),lift);
      card.classList.add('is-v50-tilting');
      card.classList.toggle('is-v50-arrow-hover',arrowHover);
    }

    function insideCard(ev){
      var r=card.getBoundingClientRect();
      return ev.clientX>=r.left && ev.clientX<=r.right && ev.clientY>=r.top && ev.clientY<=r.bottom;
    }

    function move(ev){
      if(!body.classList.contains('entry-page')) return;
      if(!canTilt) return;
      if(insideCard(ev)){
        latest={x:ev.clientX,y:ev.clientY};
        if(!raf) raf=requestAnimationFrame(render);
      }else{
        reset();
      }
    }

    function arrowOn(){ card.classList.add('is-v50-arrow-hover'); }
    function arrowOff(){ if(!arrowHover) card.classList.remove('is-v50-arrow-hover'); }
    hotzone.addEventListener('pointerenter',arrowOn,{passive:true});
    hotzone.addEventListener('pointerleave',arrowOff,{passive:true});
    hotzone.addEventListener('focus',arrowOn);
    hotzone.addEventListener('blur',arrowOff);
    hotzone.addEventListener('click',enter,true);
    if(fallback){
      fallback.addEventListener('pointerenter',arrowOn,{passive:true});
      fallback.addEventListener('pointerleave',arrowOff,{passive:true});
      fallback.addEventListener('focus',arrowOn);
      fallback.addEventListener('blur',arrowOff);
      fallback.addEventListener('click',enter,true);
    }
    card.addEventListener('pointermove',move,{capture:true,passive:true});
    card.addEventListener('pointerleave',reset,{passive:true});
    window.addEventListener('pointermove',move,{capture:true,passive:true});
    window.addEventListener('blur',reset,{passive:true});
    reset();
  });
})();


/* ================= V51：前页卡片离开后平滑回弹 ================= */
(function initEntryV51SmoothReturn(){
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); }
  ready(function(){
    var body=document.body;
    if(!body || !body.classList.contains('entry-page')) return;
    body.classList.add('entry-v51-layout');
    var card=document.querySelector('.entry-minimal-card');
    if(!card || card.dataset.v51SmoothBound==='1') return;
    card.dataset.v51SmoothBound='1';
    var timer=0;
    function markActive(){
      if(timer){ clearTimeout(timer); timer=0; }
      card.classList.remove('is-v51-returning');
      if(card.classList.contains('is-v50-tilting')) card.classList.add('is-v51-tilting');
    }
    function markReturn(){
      if(timer){ clearTimeout(timer); }
      card.classList.remove('is-v51-tilting');
      card.classList.add('is-v51-returning');
      timer=setTimeout(function(){ card.classList.remove('is-v51-returning'); timer=0; }, 920);
    }
    card.addEventListener('pointermove',markActive,{capture:true,passive:true});
    card.addEventListener('pointerenter',markActive,{capture:true,passive:true});
    card.addEventListener('pointerleave',markReturn,{capture:true,passive:true});
    window.addEventListener('blur',markReturn,{passive:true});
  });
})();

/* ================= V52：前页卡片离开后真实缓慢回弹修复 ================= */
(function initEntryV52TrueSmoothReturn(){
  'use strict';
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); }
  ready(function(){
    var body=document.body;
    if(!body || !body.classList.contains('entry-page')) return;
    var card=document.querySelector('.entry-minimal-card');
    if(!card || card.dataset.v52TrueReturnBound==='1') return;
    body.classList.add('entry-v52-layout');
    card.dataset.v52TrueReturnBound='1';

    var reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var coarse=window.matchMedia && (window.matchMedia('(hover:none)').matches || window.matchMedia('(pointer:coarse)').matches);
    var canTilt=!reduce && !coarse;
    if(!canTilt) return;

    var moveRaf=0;
    var returnRaf=0;
    var latest=null;
    var current={rx:0, ry:0, y:0};
    var lastPainted={rx:0, ry:0, y:0};
    var returning=false;
    var returnStartedAt=0;
    var returnFrom={rx:0, ry:0, y:0};
    var returnDuration=1050;

    function setImportant(name,value){ card.style.setProperty(name,value,'important'); }
    function applyTransform(rx,ry,y){
      lastPainted.rx=rx; lastPainted.ry=ry; lastPainted.y=y;
      setImportant('--v50-rx',rx.toFixed(3)+'deg');
      setImportant('--v50-ry',ry.toFixed(3)+'deg');
      setImportant('--v50-y',y.toFixed(3)+'px');
      setImportant('transform','perspective(1050px) rotateX('+rx.toFixed(3)+'deg) rotateY('+ry.toFixed(3)+'deg) translate3d(0,'+y.toFixed(3)+'px,0)');
    }
    function easeOutCubic(t){ return 1-Math.pow(1-t,3); }
    function inside(ev){
      var r=card.getBoundingClientRect();
      return ev.clientX>=r.left && ev.clientX<=r.right && ev.clientY>=r.top && ev.clientY<=r.bottom;
    }
    function cancelReturn(){
      returning=false;
      if(returnRaf){ cancelAnimationFrame(returnRaf); returnRaf=0; }
      card.classList.remove('is-v52-returning','is-v51-returning');
    }
    function renderMove(){
      moveRaf=0;
      if(!latest) return;
      var r=card.getBoundingClientRect();
      if(!r.width || !r.height) return;
      var px=Math.max(0,Math.min(1,(latest.x-r.left)/r.width));
      var py=Math.max(0,Math.min(1,(latest.y-r.top)/r.height));
      var rx=(.5-py)*10.2;
      var ry=(px-.5)*13.5;
      var y=-7;
      var arrowWidth=Math.min(Math.max(58,r.width*.14),96);
      var arrowHover=latest.x >= (r.right-arrowWidth);
      current.rx=rx; current.ry=ry; current.y=y;
      setImportant('--v50-mx',(px*100).toFixed(2)+'%');
      setImportant('--v50-my',(py*100).toFixed(2)+'%');
      card.classList.add('is-v50-tilting','is-v52-tilting');
      card.classList.remove('is-v52-returning','is-v51-returning');
      card.classList.toggle('is-v50-arrow-hover',arrowHover);
      applyTransform(rx,ry,y);
    }
    function handleMove(ev){
      if(!inside(ev)) return;
      cancelReturn();
      latest={x:ev.clientX,y:ev.clientY};
      if(!moveRaf) moveRaf=requestAnimationFrame(renderMove);
    }
    function returnStep(now){
      if(!returning) return;
      var t=Math.min(1,(now-returnStartedAt)/returnDuration);
      var k=1-easeOutCubic(t); // 先明显回弹，再慢慢收尾
      var rx=returnFrom.rx*k;
      var ry=returnFrom.ry*k;
      var y=returnFrom.y*k;
      applyTransform(rx,ry,y);
      if(t<1){
        returnRaf=requestAnimationFrame(returnStep);
      }else{
        returning=false;
        returnRaf=0;
        current={rx:0,ry:0,y:0};
        lastPainted={rx:0,ry:0,y:0};
        card.classList.remove('is-v50-tilting','is-v52-tilting','is-v52-returning','is-v51-returning');
        setImportant('--v50-rx','0deg');
        setImportant('--v50-ry','0deg');
        setImportant('--v50-y','0px');
        setImportant('transform','perspective(1050px) rotateX(0deg) rotateY(0deg) translate3d(0,0px,0)');
      }
    }
    function startReturn(){
      if(moveRaf){ cancelAnimationFrame(moveRaf); moveRaf=0; }
      latest=null;
      card.classList.remove('is-v52-tilting');
      card.classList.add('is-v52-returning');
      card.classList.remove('is-v50-arrow-hover');
      // 旧版本监听器会在 pointerleave 时立即把 transform 置零。
      // 这里使用最后一次真实倾斜值重新接管，再用 RAF 逐帧回正，确保视觉上不是瞬间归位。
      returnFrom={
        rx:Math.abs(lastPainted.rx)>0.01 ? lastPainted.rx : current.rx,
        ry:Math.abs(lastPainted.ry)>0.01 ? lastPainted.ry : current.ry,
        y:Math.abs(lastPainted.y)>0.01 ? lastPainted.y : current.y
      };
      if(Math.abs(returnFrom.rx)+Math.abs(returnFrom.ry)+Math.abs(returnFrom.y)<0.05) return;
      returning=true;
      returnStartedAt=performance.now();
      if(returnRaf) cancelAnimationFrame(returnRaf);
      applyTransform(returnFrom.rx,returnFrom.ry,returnFrom.y);
      returnRaf=requestAnimationFrame(returnStep);
    }
    function keepReturnPainted(){
      // 鼠标离开卡片后，旧版全局 pointermove reset 仍可能写入 transform=0。
      // 当回弹进行中时，用最后一帧值重新覆盖，避免移动鼠标时被旧逻辑打断。
      if(returning){ applyTransform(lastPainted.rx,lastPainted.ry,lastPainted.y); }
    }

    card.addEventListener('pointermove',handleMove,{capture:false,passive:true});
    card.addEventListener('pointerenter',handleMove,{capture:false,passive:true});
    card.addEventListener('pointerleave',startReturn,{capture:false,passive:true});
    window.addEventListener('pointermove',keepReturnPainted,{capture:false,passive:true});
    window.addEventListener('blur',startReturn,{passive:true});
  });
})();

/* ================= V53：前页卡片稳定悬停、缩小右侧入口判定区 + 进度条丝滑修复 ================= */
(function initEntryV53StableFrontCard(){
  'use strict';
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); }
  ready(function(){
    var body=document.body;
    if(!body || !body.classList.contains('entry-page')) return;
    body.classList.add('entry-v53-layout');

    var oldCard=document.querySelector('.entry-minimal-card');
    if(!oldCard || oldCard.dataset.v53StableBound==='1') return;

    /* 关键处理：克隆前页卡片，移除 V47-V52 在旧卡片上累积的匿名监听。
       全局滑动进入逻辑仍然保留；新卡片只由 V53 控制倾斜、回弹和右侧入口。 */
    var card=oldCard.cloneNode(true);
    oldCard.replaceWith(card);
    card.dataset.v53StableBound='1';
    card.classList.remove(
      'is-entry-hover','is-entry-arrow-hover','is-v49-tilting','is-v50-tilting','is-v50-arrow-hover',
      'is-v51-tilting','is-v51-returning','is-v52-tilting','is-v52-returning'
    );
    card.removeAttribute('style');

    var fallback=card.querySelector('#entryFallback');
    if(fallback){
      fallback.textContent='';
      fallback.setAttribute('aria-label','进入主页');
      fallback.title='进入主页';
      fallback.tabIndex=-1;
    }
    var hotzone=card.querySelector('.entry-right-hotzone');
    if(!hotzone){
      hotzone=document.createElement('button');
      hotzone.type='button';
      hotzone.className='entry-right-hotzone';
      card.appendChild(hotzone);
    }
    hotzone.setAttribute('aria-label','进入主页');
    hotzone.title='点击卡片最右侧进入主页';

    var reduce=window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var coarse=window.matchMedia && (matchMedia('(hover:none)').matches || matchMedia('(pointer:coarse)').matches);
    var canTilt=!reduce && !coarse;
    var entering=false;
    var active=false;
    var returning=false;
    var raf=0;
    var lastPointer={x:0,y:0};
    var baseRect=null;
    var target={rx:0,ry:0,y:0};
    var current={rx:0,ry:0,y:0};
    var arrowActive=false;
    var lastRectAt=0;
    var rightZonePx=44;

    function enterHome(ev){
      if(ev){ ev.preventDefault(); ev.stopPropagation(); }
      if(entering || body.classList.contains('is-entering')) return;
      entering=true;
      body.classList.add('is-entering');
      /* 不在点击时强制回正，保留点击瞬间的卡片姿态，让过渡不突兀。 */
      window.setTimeout(function(){ window.location.href='./home.html'; },340);
    }

    function readBaseRect(force){
      var now=performance.now();
      if(!force && baseRect && now-lastRectAt<300) return baseRect;
      /* V53 自己的变换只用 transform 合成层；这里用当前外框并留出迟滞边界，避免边缘抖动。 */
      var r=card.getBoundingClientRect();
      baseRect={left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height};
      lastRectAt=now;
      rightZonePx=Math.max(30,Math.min(52,baseRect.width*0.065));
      return baseRect;
    }
    function inStableRect(x,y,margin){
      var r=readBaseRect(false);
      margin=margin==null?20:margin;
      return x>=r.left-margin && x<=r.right+margin && y>=r.top-margin && y<=r.bottom+margin;
    }
    function setVars(px,py){
      card.style.setProperty('--v53-mx',(px*100).toFixed(2)+'%');
      card.style.setProperty('--v53-my',(py*100).toFixed(2)+'%');
      card.style.setProperty('--v50-mx',(px*100).toFixed(2)+'%');
      card.style.setProperty('--v50-my',(py*100).toFixed(2)+'%');
    }
    function apply(){
      raf=0;
      if(!canTilt){ return; }
      var ease=active ? 0.18 : 0.075;
      current.rx += (target.rx-current.rx)*ease;
      current.ry += (target.ry-current.ry)*ease;
      current.y += (target.y-current.y)*ease;
      var nearZero=Math.abs(current.rx)+Math.abs(current.ry)+Math.abs(current.y)<0.025;
      if(!active && nearZero){
        current.rx=current.ry=current.y=0;
        returning=false;
        card.classList.remove('is-v53-tilting','is-v53-returning','is-v50-tilting','is-v50-arrow-hover','is-v52-returning','is-v51-returning');
      }
      card.style.setProperty('transform','perspective(1100px) rotateX('+current.rx.toFixed(3)+'deg) rotateY('+current.ry.toFixed(3)+'deg) translate3d(0,'+current.y.toFixed(3)+'px,0)','important');
      if(active || returning || !nearZero){ raf=requestAnimationFrame(apply); }
    }
    function schedule(){ if(!raf) raf=requestAnimationFrame(apply); }
    function updateTarget(x,y){
      var r=readBaseRect(false);
      if(!r.width || !r.height) return;
      var px=Math.max(0,Math.min(1,(x-r.left)/r.width));
      var py=Math.max(0,Math.min(1,(y-r.top)/r.height));
      setVars(px,py);
      target.ry=(px-.5)*11.2;
      target.rx=(.5-py)*8.6;
      target.y=-6;
      var nextArrow=x>=r.right-rightZonePx && x<=r.right+10 && y>=r.top-8 && y<=r.bottom+8;
      arrowActive=nextArrow;
      card.classList.toggle('is-v53-arrow-hover',nextArrow);
      card.classList.toggle('is-v50-arrow-hover',nextArrow);
      card.classList.add('is-v53-tilting','is-v50-tilting');
      card.classList.remove('is-v53-returning','is-v52-returning','is-v51-returning');
      schedule();
    }
    function handleMove(ev){
      if(entering || !canTilt) return;
      lastPointer.x=ev.clientX; lastPointer.y=ev.clientY;
      if(inStableRect(ev.clientX,ev.clientY,active?30:0)){
        if(!active){ readBaseRect(true); }
        active=true; returning=false;
        updateTarget(ev.clientX,ev.clientY);
      }else if(active){
        startReturn();
      }
    }
    function startReturn(){
      if(entering || !canTilt) return;
      active=false; returning=true; arrowActive=false;
      target.rx=0; target.ry=0; target.y=0;
      card.classList.remove('is-v53-arrow-hover','is-v50-arrow-hover');
      card.classList.add('is-v53-returning');
      schedule();
    }
    function refreshRect(){ baseRect=null; readBaseRect(true); }

    card.addEventListener('pointerenter',function(ev){ readBaseRect(true); handleMove(ev); },{passive:true});
    card.addEventListener('pointermove',handleMove,{passive:true});
    card.addEventListener('pointerleave',function(ev){
      /* 留出迟滞区域，鼠标在边缘附近移动时不立即回正，避免卡片抽搐。 */
      if(inStableRect(ev.clientX,ev.clientY,30)) return;
      startReturn();
    },{passive:true});
    hotzone.addEventListener('pointerenter',function(){ card.classList.add('is-v53-arrow-hover','is-v50-arrow-hover'); },{passive:true});
    hotzone.addEventListener('pointerleave',function(){ if(!arrowActive){card.classList.remove('is-v53-arrow-hover','is-v50-arrow-hover');} },{passive:true});
    hotzone.addEventListener('click',enterHome,true);
    if(fallback){ fallback.addEventListener('click',enterHome,true); }
    window.addEventListener('pointermove',handleMove,{passive:true});
    window.addEventListener('resize',refreshRect,{passive:true});
    window.addEventListener('scroll',refreshRect,{passive:true});
    window.addEventListener('blur',startReturn,{passive:true});
    refreshRect();
  });
})();

(function initEntryV53SmoothMeter(){
  'use strict';
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); }
  ready(function(){
    var body=document.body;
    if(!body || !body.classList.contains('entry-page')) return;
    var meter=document.querySelector('.scratch-meter');
    var oldFill=document.getElementById('scratchMeterFill');
    if(!meter || !oldFill || meter.dataset.v53SmoothMeter==='1') return;
    meter.dataset.v53SmoothMeter='1';
    var fill=document.createElement('span');
    fill.className='entry-meter-smooth-v53';
    fill.setAttribute('aria-hidden','true');
    meter.appendChild(fill);
    oldFill.classList.add('entry-meter-source-v53');
    var target=0,current=0,raf=0,lastTarget=0;
    function readTarget(){
      var raw=oldFill.style.width || oldFill.getAttribute('style') || '0';
      var m=String(raw).match(/width:\s*([0-9.]+)%|^\s*([0-9.]+)%\s*$/i);
      var v=m ? parseFloat(m[1]||m[2]) : parseFloat(oldFill.style.width)||0;
      if(!isFinite(v)) v=0;
      target=Math.max(0,Math.min(100,v));
      lastTarget=performance.now();
      if(!raf) raf=requestAnimationFrame(step);
    }
    function step(){
      var speed=0.16;
      current += (target-current)*speed;
      if(Math.abs(target-current)<0.08) current=target;
      fill.style.transform='scaleX('+(current/100).toFixed(4)+')';
      fill.style.opacity=(current>1 || target>1) ? '1' : '0.48';
      if(Math.abs(target-current)>0.08 || performance.now()-lastTarget<220){
        raf=requestAnimationFrame(step);
      }else{
        raf=0;
      }
    }
    try{ new MutationObserver(readTarget).observe(oldFill,{attributes:true,attributeFilter:['style']}); }catch(_){ }
    readTarget();
  });
})();


/* ================= V54：前页返回闪帧、入口判定与终端进入逻辑最终修复 ================= */
(function initEntryV54FrontStability(){
  'use strict';
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); }
  ready(function(){
    var body=document.body;
    if(!body || !body.classList.contains('entry-page')) return;
    body.classList.add('entry-v54-layout');
    var oldCard=document.querySelector('.entry-minimal-card');
    if(!oldCard || oldCard.dataset.v54StableBound==='1') return;

    /* 重新克隆卡片，移除 V49-V53 在卡片上的匿名监听，避免边缘抖动和点击时被旧逻辑强制回正。 */
    var card=oldCard.cloneNode(true);
    oldCard.replaceWith(card);
    card.dataset.v54StableBound='1';
    card.removeAttribute('style');
    card.className=card.className.replace(/\bis-[^\s]+/g,'').trim() || 'entry-minimal-card';

    var fallback=card.querySelector('#entryFallback');
    if(fallback){
      fallback.textContent='';
      fallback.setAttribute('aria-label','进入主页');
      fallback.title='点击卡片右侧进入主页';
      fallback.tabIndex=-1;
    }
    var hotzone=card.querySelector('.entry-right-hotzone');
    if(!hotzone){
      hotzone=document.createElement('button');
      hotzone.type='button';
      hotzone.className='entry-right-hotzone';
      card.appendChild(hotzone);
    }
    hotzone.setAttribute('aria-label','进入主页');
    hotzone.title='点击卡片右侧进入主页';

    var reduce=window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var coarse=window.matchMedia && (matchMedia('(hover:none)').matches || matchMedia('(pointer:coarse)').matches);
    var canTilt=!reduce && !coarse;
    var active=false, returning=false, entering=false, raf=0, rect=null;
    var target={rx:0,ry:0,y:0}, current={rx:0,ry:0,y:0};
    var rightZone=56;

    function enterHome(ev){
      if(ev){ ev.preventDefault(); ev.stopPropagation(); }
      if(entering || body.classList.contains('is-entering')) return;
      entering=true;
      body.classList.add('is-entering');
      window.setTimeout(function(){ window.location.href='./home.html'; },340);
    }
    function stableRect(force){
      if(rect && !force) return rect;
      var prev=card.style.transform;
      card.style.setProperty('transform','none','important');
      var r=card.getBoundingClientRect();
      rect={left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height};
      card.style.setProperty('transform',prev||'perspective(1100px) rotateX(0deg) rotateY(0deg) translate3d(0,0,0)','important');
      rightZone=Math.max(42,Math.min(68,rect.width*0.085));
      return rect;
    }
    function inside(x,y,margin){
      var r=stableRect(false); margin=margin||0;
      return x>=r.left-margin && x<=r.right+margin && y>=r.top-margin && y<=r.bottom+margin;
    }
    function setVars(px,py){
      card.style.setProperty('--v53-mx',(px*100).toFixed(2)+'%');
      card.style.setProperty('--v53-my',(py*100).toFixed(2)+'%');
      card.style.setProperty('--v50-mx',(px*100).toFixed(2)+'%');
      card.style.setProperty('--v50-my',(py*100).toFixed(2)+'%');
    }
    function paint(){
      raf=0;
      if(!canTilt) return;
      var ease=active ? 0.20 : 0.070;
      current.rx += (target.rx-current.rx)*ease;
      current.ry += (target.ry-current.ry)*ease;
      current.y += (target.y-current.y)*ease;
      var near=Math.abs(current.rx)+Math.abs(current.ry)+Math.abs(current.y)<0.022;
      if(!active && near){
        current.rx=0; current.ry=0; current.y=0; returning=false;
        card.classList.remove('is-v54-tilting','is-v54-returning','is-v54-arrow-hover','is-v53-tilting','is-v53-returning','is-v53-arrow-hover','is-v50-tilting','is-v50-arrow-hover');
      }
      card.style.setProperty('transform','perspective(1120px) rotateX('+current.rx.toFixed(3)+'deg) rotateY('+current.ry.toFixed(3)+'deg) translate3d(0,'+current.y.toFixed(3)+'px,0)','important');
      if(active || returning || !near) raf=requestAnimationFrame(paint);
    }
    function schedule(){ if(!raf) raf=requestAnimationFrame(paint); }
    function update(x,y){
      var r=stableRect(false); if(!r.width || !r.height) return;
      var px=Math.max(0,Math.min(1,(x-r.left)/r.width));
      var py=Math.max(0,Math.min(1,(y-r.top)/r.height));
      setVars(px,py);
      target.ry=(px-.5)*10.8;
      target.rx=(.5-py)*8.2;
      target.y=-6;
      var isArrow=x>=r.right-rightZone && x<=r.right+12 && y>=r.top-10 && y<=r.bottom+10;
      card.classList.toggle('is-v54-arrow-hover',isArrow);
      card.classList.toggle('is-v53-arrow-hover',isArrow);
      card.classList.toggle('is-v50-arrow-hover',isArrow);
      card.classList.add('is-v54-tilting','is-v53-tilting','is-v50-tilting');
      card.classList.remove('is-v54-returning','is-v53-returning','is-v52-returning','is-v51-returning');
      schedule();
    }
    function startReturn(){
      if(entering || !canTilt) return;
      active=false; returning=true;
      target.rx=0; target.ry=0; target.y=0;
      card.classList.remove('is-v54-arrow-hover','is-v53-arrow-hover','is-v50-arrow-hover');
      card.classList.add('is-v54-returning','is-v53-returning');
      schedule();
    }
    function move(ev){
      if(entering || !canTilt) return;
      if(inside(ev.clientX,ev.clientY,active?34:0)){
        if(!active){ stableRect(true); }
        active=true; returning=false;
        update(ev.clientX,ev.clientY);
      }else if(active){
        startReturn();
      }
    }
    function refresh(){ rect=null; if(canTilt) stableRect(true); }

    card.addEventListener('pointerenter',function(ev){ refresh(); move(ev); },{passive:true});
    card.addEventListener('pointermove',move,{passive:true});
    card.addEventListener('pointerleave',function(ev){
      if(inside(ev.clientX,ev.clientY,36)) return;
      startReturn();
    },{passive:true});
    hotzone.addEventListener('pointerenter',function(){ card.classList.add('is-v54-arrow-hover','is-v53-arrow-hover','is-v50-arrow-hover'); },{passive:true});
    hotzone.addEventListener('pointerleave',function(){ if(!active){card.classList.remove('is-v54-arrow-hover','is-v53-arrow-hover','is-v50-arrow-hover');} },{passive:true});
    hotzone.addEventListener('click',enterHome,true);
    if(fallback){ fallback.addEventListener('click',enterHome,true); }
    window.addEventListener('pointermove',move,{passive:true});
    window.addEventListener('resize',refresh,{passive:true});
    window.addEventListener('orientationchange',function(){ setTimeout(refresh,160); },{passive:true});
    window.addEventListener('blur',startReturn,{passive:true});
    refresh();
    document.documentElement.classList.remove('entry-prepaint-v54');
  });
})();

(function initEntryV54TerminalSafety(){
  'use strict';
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); }
  ready(function(){
    var body=document.body;
    if(!body || !body.classList.contains('entry-page')) return;
    var coarse=window.matchMedia && (matchMedia('(pointer:coarse)').matches || matchMedia('(hover:none)').matches);
    var canvas=document.getElementById('scratchCanvas');
    var iframe=document.querySelector('.entry-underpage');
    if(coarse){
      body.classList.add('entry-touch-v54');
      if(canvas){ canvas.style.touchAction='none'; }
      if(iframe){ iframe.setAttribute('loading','lazy'); }
    }
    var lastTouch=null,total=0;
    function go(){ if(body.classList.contains('is-entering')) return; body.classList.add('is-entering'); setTimeout(function(){location.href='./home.html';},340); }
    body.addEventListener('touchstart',function(e){
      if(!e.touches || !e.touches[0]) return;
      lastTouch={x:e.touches[0].clientX,y:e.touches[0].clientY,t:performance.now()}; total=0;
    },{passive:true});
    body.addEventListener('touchmove',function(e){
      if(!lastTouch || !e.touches || !e.touches[0]) return;
      var x=e.touches[0].clientX,y=e.touches[0].clientY;
      total+=Math.hypot(x-lastTouch.x,y-lastTouch.y);
      lastTouch={x:x,y:y,t:performance.now()};
      if(total>150) go();
    },{passive:true});
  });
})();


/* ================= V55：编辑器可配置默认进入主题 ================= */
(function initDefaultThemeFromSiteDataV55(){
  'use strict';
  function safeDefaultTheme(){
    try{
      var v=window.SITE_DATA && window.SITE_DATA.site && window.SITE_DATA.site.defaultTheme;
      return v === 'dark' ? 'dark' : 'light';
    }catch(_){ return 'light'; }
  }
  function storedTheme(){
    try{
      var manual=localStorage.getItem('zw-theme-manual-choice-v55')==='1';
      var v=localStorage.getItem('zw-theme');
      return manual && (v === 'dark' || v === 'light') ? v : '';
    }catch(_){ return ''; }
  }
  function applyTheme(){
    var theme=storedTheme() || safeDefaultTheme();
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.dataset.theme = theme;
    var btn=document.getElementById('themeToggle');
    if(btn){
      btn.dataset.mode=theme;
      btn.setAttribute('aria-label', theme === 'dark' ? '切换为白天模式' : '切换为黑夜模式');
    }
  }
  document.addEventListener('click',function(e){
    var btn=e.target && e.target.closest && e.target.closest('#themeToggle');
    if(!btn) return;
    try{ localStorage.setItem('zw-theme-manual-choice-v55','1'); }catch(_){ }
    setTimeout(applyTheme,0);
  },false);
  applyTheme();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',applyTheme,{once:true});
  else applyTheme();
  window.addEventListener('storage',function(e){ if(e && (e.key==='zw-theme' || e.key==='zw-theme-manual-choice-v55')) applyTheme(); });
})();
