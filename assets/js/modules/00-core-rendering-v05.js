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


