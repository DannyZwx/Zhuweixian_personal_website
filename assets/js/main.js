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
function initTheme(){const root=document.documentElement;const saved=localStorage.getItem("zw-theme")||"dark";root.dataset.theme=saved;document.addEventListener("click",e=>{const b=e.target.closest("#themeToggle");if(b){const next=root.dataset.theme==="light"?"dark":"light";root.dataset.theme=next;localStorage.setItem("zw-theme",next);setThemeBtn()}});function setThemeBtn(){const b=document.getElementById("themeToggle");if(b)b.dataset.mode=root.dataset.theme}setThemeBtn()}
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
 const root=document.documentElement;const saved=localStorage.getItem("zw-theme")||"dark";root.dataset.theme=saved;
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
  const saved=localStorage.getItem("zw-theme")||"dark";
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
