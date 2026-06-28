/* ================= V76：可见文字总表、布局控制和性能兜底（基于 V73） ================= */
(function initV76VisibleTextLayoutAndPerformance(){
  'use strict';
  function onReady(fn){ if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true}); else fn(); }
  function data(){ return window.APP_DATA || window.SITE_DATA || {}; }
  function g(path, fallback){
    var cur = data();
    String(path || '').split('.').forEach(function(k){ if(cur && Object.prototype.hasOwnProperty.call(cur,k)) cur = cur[k]; else cur = undefined; });
    return (cur === undefined || cur === null || cur === '') ? fallback : cur;
  }
  function htmlEsc(v){ return (typeof esc === 'function' ? esc(v) : String(v == null ? '' : v).replace(/[&<>"']/g,function(s){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s];})); }
  function cleanNumber(v, fallback, min, max){
    var n = Number(v);
    if(!isFinite(n)) n = fallback;
    if(typeof min === 'number') n = Math.max(min, n);
    if(typeof max === 'number') n = Math.min(max, n);
    return n;
  }
  function pageKey(){
    var body = document.body;
    if(!body) return 'home';
    if(body.classList.contains('entry-page')) return 'entry';
    if(body.classList.contains('avatar-secret-page')) return 'avatarSecret';
    return body.dataset.page || (body.classList.contains('home-page') ? 'home' : 'home');
  }
  function applyVisibleText(){
    var key = pageKey();
    document.title = g('visibleText.documentTitles.'+key, document.title);
    document.querySelectorAll('.music-btn .music-icon').forEach(function(el){ el.textContent = g('visibleText.common.musicIcon','♪'); });
    document.querySelectorAll('.music-btn .music-text').forEach(function(el){ el.textContent = g('visibleText.common.musicLabel','BGM'); });
    document.querySelectorAll('#navToggle').forEach(function(el){ el.textContent = g('visibleText.common.menu','菜单'); });
    document.querySelectorAll('#themeToggle').forEach(function(el){ el.setAttribute('aria-label', g('visibleText.common.themeAria','切换白天黑夜模式')); });
    document.querySelectorAll('[data-close-modal], .drawer-close, .avatar-secret-back').forEach(function(el){ if(el.classList.contains('avatar-secret-back')) el.textContent = g('visibleText.common.back','返回'); });
    document.querySelectorAll('.eggy-link-text').forEach(function(el){ el.textContent = g('visibleText.home.eggyEnter','点击进入专项能力详情页'); });
    var awardToggle = document.getElementById('awardToggle');
    if(awardToggle) awardToggle.setAttribute('aria-label', g('visibleText.home.awardToggleLabel','展开或收起获奖证书'));
    var entryMain = document.querySelector('.scratch-entry-ui');
    if(entryMain) entryMain.setAttribute('aria-label', g('visibleText.entry.ariaLabel','朱炜贤个人网站入口'));
    var under = document.querySelector('.entry-underpage');
    if(under) under.setAttribute('title', g('visibleText.entry.underpageTitle','朱炜贤个人网站主页预览'));
    document.querySelectorAll('#entryFallback,.entry-right-hotzone').forEach(function(el){
      el.setAttribute('aria-label', g('visibleText.entry.rightAria','点击卡片右侧进入主页'));
      el.setAttribute('title', g('visibleText.entry.rightTitle','点击卡片右侧进入主页'));
    });
    var godot = document.querySelector('.godot-help');
    if(godot){
      var h2 = godot.querySelector('h2'); if(h2) h2.textContent = g('visibleText.miniGameHelp.title','Godot 小游戏嵌入方法');
      var p = godot.querySelector('p'); if(p) p.textContent = g('visibleText.miniGameHelp.desc','在 Godot 中选择 Web 导出，把导出的整个文件夹放进 website/assets/godot/你的游戏名/。保证里面有 index.html，再在编辑器中填写 assets/godot/你的游戏名/index.html。');
    }
    var footer = document.querySelector('.site-footer');
    if(footer){
      if(document.body.classList.contains('home-page')){
        var spans = footer.querySelectorAll('span');
        if(spans[0]) spans[0].textContent = g('visibleText.common.footerCopy','© 2027 Zhu Weixian Portfolio');
        if(spans[1]) spans[1].textContent = g('visibleText.common.footerTagline','Designed for Game HR Review');
      }else if(document.body.classList.contains('making-page')){
        var mk = footer.querySelector('span'); if(mk) mk.textContent = g('visibleText.making.footerLabel','Behind The Website');
        footer.querySelectorAll('a').forEach(function(a){ a.textContent = g('visibleText.common.back','返回'); });
      }else if(document.body.classList.contains('resume-page')){
        var links = footer.querySelectorAll('a');
        if(links[0]) links[0].textContent = g('visibleText.common.portfolio','作品集');
        if(links[1]) links[1].textContent = g('visibleText.common.back','返回');
      }else{
        footer.querySelectorAll('a').forEach(function(a){ a.textContent = g('visibleText.common.back','返回'); });
      }
    }
    if(document.body.dataset.page === 'portfolio'){
      var hero = document.querySelector('.page-hero, main');
      var e = document.querySelector('.page-hero .eyebrow, main .eyebrow'); if(e) e.textContent = g('visibleText.portfolioRedirect.eyebrow','Portfolio Categories');
      var t = document.querySelector('.page-hero h1, main h1'); if(t) t.textContent = g('visibleText.portfolioRedirect.title','作品集分类已移到首页');
      var p2 = document.querySelector('.page-hero p:not(.eyebrow), main p:not(.eyebrow)'); if(p2) p2.textContent = g('visibleText.portfolioRedirect.desc','正在跳转到首页作品集分类板块。');
      var a = document.querySelector('main a, .page-hero a'); if(a) a.textContent = g('visibleText.portfolioRedirect.button','立即前往');
    }
  }

  var previousRenderHeader = (typeof renderHeader === 'function') ? renderHeader : null;
  if(previousRenderHeader){
    window.renderHeader = renderHeader = function(d){
      var inPage = (typeof isPage === 'function') ? isPage() : location.pathname.indexOf('/pages/') >= 0;
      var nav = (d.ui && d.ui.nav) || [];
      var items = nav.map(function(a){
        var isMaking = String(a.label||'').indexOf('花絮') >= 0;
        var isEntry = String(a.label||'').indexOf('前页') >= 0 || String(a.label||'').indexOf('回到前面') >= 0 || String(a.label||'').indexOf('返回') >= 0;
        var cls = [isMaking?'nav-making':'', isEntry?'nav-entry':''].filter(Boolean).join(' ');
        return '<a class="'+cls+'" href="'+link(a.href)+'" data-nav-label="'+htmlEsc(a.label)+'">'+htmlEsc(a.label)+'</a>';
      }).join('');
      return '<div class="nav-inner"><a class="brand" href="'+(inPage?'../home.html':'./home.html')+'"><span class="brand-name">'+htmlEsc(d.site && d.site.brand || 'ZHU WEIXIAN')+'</span></a><button class="nav-toggle" id="navToggle" type="button">'+htmlEsc(g('visibleText.common.menu','菜单'))+'</button><nav class="nav-links">'+items+'</nav><button class="theme-toggle" id="themeToggle" type="button" aria-label="'+htmlEsc(g('visibleText.common.themeAria','切换白天黑夜模式'))+'"><span class="sun">☀</span><span class="moon">☾</span></button></div>';
    };
  }

  if(typeof renderMiniGames === 'function'){
    window.renderMiniGames = renderMiniGames = function(d){
      return '<div class="steam-library"><aside><h2>'+htmlEsc(g('visibleText.miniGameHelp.libraryTitle','小游戏库'))+'</h2><p>'+htmlEsc(g('visibleText.miniGameHelp.libraryDesc','点击右侧封面，在弹窗中运行 Godot Web 游戏。'))+'</p></aside><div class="steam-shelf">'+(d.miniGames||[]).map(function(item,i){return '<article class="steam-card" data-game-index="'+i+'">'+imageOr(item.cover,'game-cover',item.title)+'<h2>'+htmlEsc(item.title)+'</h2><p>'+htmlEsc(item.desc)+'</p><b class="card-link">'+htmlEsc(d.ui.runGame || '运行游戏')+' →</b></article>';}).join('')+'</div></div>';
    };
  }
  if(typeof renderMakingCards === 'function'){
    window.renderMakingCards = renderMakingCards = function(d){
      var b = d.behindScenes || {};
      return '<article class="making-card" data-making="process"><span class="making-type">'+htmlEsc(g('visibleText.making.processType','Process'))+'</span><h2>'+htmlEsc(b.processTitle)+'</h2><p>'+htmlEsc(b.processDesc)+'</p><b class="card-link">'+htmlEsc(g('visibleText.making.processLink','点击查看导图 →'))+'</b></article>'+
        '<article class="making-card" data-making="tools"><span class="making-type">'+htmlEsc(g('visibleText.making.toolsType','Tools'))+'</span><h2>'+htmlEsc(b.toolsTitle)+'</h2><p>'+htmlEsc(b.toolsDesc)+'</p><b class="card-link">'+htmlEsc(g('visibleText.making.toolsLink','点击查看工具 →'))+'</b></article>'+
        '<article class="making-card duration-card" data-duration="'+htmlEsc(b.durationValue || '3天')+'"><span class="making-type">'+htmlEsc(g('visibleText.making.durationType','Duration'))+'</span><h2>'+htmlEsc(b.durationTitle)+'</h2><p>'+htmlEsc(b.durationDesc)+'</p><b class="card-link">'+htmlEsc(g('visibleText.making.durationLink','悬停显示耗时'))+'</b></article>';
    };
  }
  // 捕获层处理制作花絮弹窗文案，避免旧 hardcode 覆盖。保留旧弹窗结构，只补全文案可配置。
  onReady(function(){
    document.addEventListener('click', function(ev){
      var card = ev.target && ev.target.closest && ev.target.closest('[data-making]');
      if(!card) return;
      var d = data(); var b = d.behindScenes || {};
      if(card.dataset.making === 'process'){
        ev.preventDefault(); ev.stopPropagation(); if(ev.stopImmediatePropagation) ev.stopImmediatePropagation();
        openModal('<div class="making-modal"><h2>'+htmlEsc(b.processTitle)+'</h2><p>'+htmlEsc(b.processDesc)+'</p><div class="process-map-v9 process-map-v78">'+(b.processNodes||[]).map(function(n,i){var visual=n.image?'<img data-zoomable-image data-zoom-title="'+htmlEsc(n.title)+'" src="'+asset(n.image)+'" alt="'+htmlEsc(n.title)+'">':'<div class="blue-placeholder image-placeholder process-node-image" data-zoom-placeholder="'+htmlEsc(g('visibleText.making.processImagePlaceholder','流程图片占位'))+'">'+htmlEsc(g('visibleText.making.processImagePlaceholder','流程图片占位'))+'</div>';return '<article class="process-node-v9 process-node-v78"><div class="process-node-copy"><span>0'+(i+1)+'</span><h3>'+htmlEsc(n.title)+'</h3><p>'+htmlEsc(n.desc)+'</p></div><div class="process-node-visual">'+visual+'</div></article>';}).join('')+'</div></div>');
      }else if(card.dataset.making === 'tools'){
        ev.preventDefault(); ev.stopPropagation(); if(ev.stopImmediatePropagation) ev.stopImmediatePropagation();
        openModal('<div class="making-modal"><h2>'+htmlEsc(b.toolsTitle)+'</h2><p>'+htmlEsc(b.toolsDesc)+'</p><div class="tool-modal-grid">'+(b.tools||[]).map(function(t){var icon=t.icon?'<img src="'+asset(t.icon)+'" alt="'+htmlEsc(t.name)+'">':'<div class="blue-placeholder tool-modal-icon">'+htmlEsc(t.name || g('visibleText.making.toolsIconPlaceholder','工具图标'))+'</div>';return '<article class="tool-modal-card"><div class="tool-modal-icon">'+icon+'</div><h3>'+htmlEsc(t.name)+'</h3><p>'+htmlEsc(t.desc)+'</p></article>';}).join('')+'</div></div>');
      }
    }, true);
  });

  if(typeof renderResumePage === 'function'){
    window.renderResumePage = renderResumePage = function(d){
      var r = (d && d.resume) || {};
      var title = r.title || g('visibleText.resume.missingImage','个人简历');
      var imgUrl = r.image ? asset(r.image) : '#';
      var pdfUrl = r.pdf ? asset(r.pdf) : '#';
      var imgFile = r.imageFileName || 'resume.png';
      var pdfFile = r.pdfFileName || 'resume.pdf';
      var img = r.image ? '<img class="resume-img zoomable-image-slot" data-zoomable-image data-zoom-title="'+htmlEsc(title)+'" src="'+imgUrl+'" alt="'+htmlEsc(title)+'">' : '<div class="blue-placeholder resume-img-placeholder zoomable-image-slot" data-zoom-placeholder="'+htmlEsc(g('visibleText.resume.missingImage','个人简历'))+'">'+htmlEsc(g('visibleText.resume.missingImage','个人简历'))+'</div>';
      return '<div class="resume-image-card">'+img+'</div><aside class="resume-action-card"><p class="eyebrow">'+htmlEsc(g('visibleText.resume.fileEyebrow','Resume File'))+'</p><h2>'+htmlEsc(title)+'</h2><p>'+htmlEsc(r.desc || g('visibleText.resume.defaultDesc','点击简历图片可放大查看，也可以下载图片或 PDF 版本。'))+'</p><div class="resume-downloads"><a class="resume-download-image primary '+(r.image?'':'is-disabled')+'" href="'+imgUrl+'" data-download-url="'+imgUrl+'" download="'+htmlEsc(imgFile)+'" role="button">'+htmlEsc(g('visibleText.resume.downloadImage','下载简历图片'))+'</a><a class="resume-download-pdf '+(r.pdf?'':'is-disabled')+'" href="'+pdfUrl+'" data-download-url="'+pdfUrl+'" download="'+htmlEsc(pdfFile)+'" role="button">'+htmlEsc(g('visibleText.resume.downloadPdf','下载 PDF 文件'))+'</a></div></aside>';
    };
  }

  function applyLayout(){
    var d = data(), l = d.layout || {}, root = document.documentElement;
    var vars = {
      '--entry-card-w': cleanNumber(l.entryCardWidth,680,420,1120)+'px',
      '--entry-card-h': cleanNumber(l.entryCardHeight,360,240,720)+'px',
      '--entry-card-x': cleanNumber(l.entryCardOffsetX,0,-240,240)+'px',
      '--entry-card-y': cleanNumber(l.entryCardOffsetY,0,-160,160)+'px',
      '--entry-hotzone-w': cleanNumber(l.entryHotzoneWidth,72,32,160)+'px',
      '--entry-tilt-strength': cleanNumber(l.entryTiltStrength,3.8,0,12),
      '--entry-hover-speed': cleanNumber(l.entryHoverSpeed,.18,.05,.55)+'s',
      '--home-section-gap': cleanNumber(l.homeSectionGap,94,36,180)+'px',
      '--home-module-opacity': cleanNumber(l.homeModuleOpacity,1,.25,1),
      '--hero-avatar-scale': cleanNumber(l.heroAvatarScale,1,.72,1.35),
      '--hero-avatar-x': cleanNumber(l.heroAvatarOffsetX,0,-160,160)+'px',
      '--hero-avatar-y': cleanNumber(l.heroAvatarOffsetY,0,-160,160)+'px',
      '--portfolio-card-scale': cleanNumber(l.portfolioCardScale,1,.75,1.35),
      '--experience-card-scale': cleanNumber(l.experienceCardScale,1,.75,1.35),
      '--skill-card-scale': cleanNumber(l.skillCardScale,1,.75,1.35),
      '--eggy-card-scale': cleanNumber(l.eggyCardScale,1,.75,1.35),
      '--game-wall-scale': cleanNumber(l.gameWallScale,1,.65,1.35),
      '--award-scale': cleanNumber(l.awardScale,1,.75,1.35),
      '--making-card-scale': cleanNumber(l.makingCardScale,1,.75,1.35),
      '--card-hover-lift': cleanNumber(l.cardHoverLift,4,0,18)+'px',
      '--card-hover-tilt': cleanNumber(l.cardHoverTilt,1,0,3),
      '--card-glass-opacity': cleanNumber(l.cardGlassOpacity,.78,.25,1),
      '--main-bg-speed-day': cleanNumber(l.backgroundSpeedDay,1.08,.2,3),
      '--main-bg-speed-night': cleanNumber(l.backgroundSpeedNight,1.55,.2,4)
    };
    Object.keys(vars).forEach(function(k){ root.style.setProperty(k, vars[k]); });
    document.body.classList.toggle('cursor-glow-disabled-v76', String(l.enableCursorGlow || 'on') === 'off');
    if(matchMedia('(pointer:coarse)').matches && String(l.reduceMotionOnMobile || 'on') === 'on') document.body.classList.add('mobile-reduced-motion-v76');
    if(document.body.classList.contains('home-page')){
      var order = String(l.homeSectionOrder || '').split(',').map(function(s){return s.trim();}).filter(Boolean);
      var hidden = new Set(String(l.hiddenHomeSections || '').split(',').map(function(s){return s.trim();}).filter(Boolean));
      var main = document.querySelector('main');
      if(main && order.length){
        order.forEach(function(id){ var el = id === 'identity' ? document.querySelector('.identity-bar') : document.getElementById(id); if(el && el.parentNode === main) main.appendChild(el); });
      }
      ['profile','identity','portfolio-entry','experience','skills','eggy','games','awards','contact'].forEach(function(id){
        var el = id === 'identity' ? document.querySelector('.identity-bar') : document.getElementById(id);
        if(el) el.hidden = hidden.has(id);
      });
    }
  }
  onReady(function(){ applyVisibleText(); applyLayout(); setTimeout(function(){ applyVisibleText(); applyLayout(); }, 80); });
})();


/* ================= V77：克制型微交互音效引擎与固定文案兜底 ================= */
function initInteractionSounds(d){
  if(document.documentElement.dataset.soundEngineV77 === '1') return;
  document.documentElement.dataset.soundEngineV77 = '1';
  const s=(d && d.sounds) || {};
  const fallbackHover=(d && d.site && d.site.hoverSound) || 'assets/audio/hover.wav';
  const fallbackClick=(d && d.site && d.site.clickSound) || 'assets/audio/click.wav';
  const config={
    navHover:s.navHover||fallbackHover, navClick:s.navClick||fallbackClick,
    buttonHover:s.buttonHover||fallbackHover, buttonClick:s.buttonClick||fallbackClick,
    cardHover:s.cardHover||fallbackHover, cardClick:s.cardClick||fallbackClick,
    gameHover:s.gameHover||fallbackHover, gameClick:s.gameClick||fallbackClick, gameDrag:s.gameDrag||s.gameClick||fallbackClick,
    modalHover:s.modalHover||fallbackHover, modalClick:s.modalClick||fallbackClick,
    mediaHover:s.mediaHover||fallbackHover, mediaClick:s.mediaClick||fallbackClick,
    copyClick:s.copyClick||fallbackClick, themeClick:s.themeClick||fallbackClick
  };
  const baseVolume={navHover:.18,buttonHover:.16,cardHover:.14,gameHover:.18,modalHover:.14,mediaHover:.16,navClick:.32,buttonClick:.30,cardClick:.28,gameClick:.34,gameDrag:.22,modalClick:.28,mediaClick:.32,copyClick:.30,themeClick:.32};
  const cache={};
  function getAudio(key){
    const src=config[key]; if(!src) return null;
    if(!cache[key]){ const a=new Audio(asset(src)); a.preload='auto'; cache[key]=a; }
    return cache[key];
  }
  function play(key,scale=1){
    const a=getAudio(key); if(!a) return;
    try{ a.pause(); a.currentTime=0; a.volume=Math.max(0,Math.min(.55,(baseVolume[key]||.25)*scale)); const p=a.play(); if(p && p.catch) p.catch(()=>{}); }catch(_e){}
  }
  function category(el,kind){
    if(el.closest('.nav-links a,.page-back-btn,.brand')) return kind==='hover'?'navHover':'navClick';
    if(el.closest('.theme-toggle')) return kind==='hover'?'buttonHover':'themeClick';
    if(el.closest('.game-card,.ambient-game-card,[data-game-card]')) return kind==='hover'?'gameHover':'gameClick';
    if(el.closest('.modal-close,[data-close-modal],[data-close-zoom],.zoom-overlay-close,.duration-marquee-close,.drawer-close')) return kind==='hover'?'modalHover':'modalClick';
    if(el.closest('[data-video-index],[data-game-index],.run-game-btn,.music-player,.music-btn,.video-work-card,.music-card,.steam-card,.game-work-card,.game-work-feature')) return kind==='hover'?'mediaHover':'mediaClick';
    if(el.closest('.copy-link,[data-copy]')) return kind==='hover'?'buttonHover':'copyClick';
    if(el.closest('.tilt-card,.orb-card,.portfolio-card-v8,.portfolio-card-v7,.portfolio-subnav-card,.experience-choice-card,.experience-item,.tool-chip,.award-item,.making-card,.graphic-card,.skill-level,.software-card')) return kind==='hover'?'cardHover':'cardClick';
    if(el.closest('a,button,.btn')) return kind==='hover'?'buttonHover':'buttonClick';
    return null;
  }
  const hoverSelector='a,button,.btn,.tilt-card,.orb-card,.portfolio-card-v8,.portfolio-card-v7,.portfolio-subnav-card,.experience-choice-card,.experience-item,.tool-chip,.award-item,.making-card,.game-card,.ambient-game-card,.graphic-card,.music-card,.video-work-card,.game-work-card,.game-work-feature,.steam-card,.copy-link,.modal-close,.zoom-overlay-close,.music-player,.skill-level,.software-card';
  const clickSelector='a,button,.btn,[data-award-index],[data-video-index],[data-game-index],[data-software],[data-making],.copy-link,.graphic-card,.music-card,.portfolio-subnav-card,.steam-card,.run-game-btn,.music-player,.theme-toggle,.skill-level,.software-card';
  let lastEl=null,lastAt=0,lastKey='';
  document.addEventListener('pointerover',function(ev){
    const el=ev.target && ev.target.closest && ev.target.closest(hoverSelector);
    if(!el || el.disabled || el.getAttribute('aria-disabled')==='true') return;
    const key=category(el,'hover'); if(!key) return;
    const now=performance.now(); if(el===lastEl && key===lastKey && now-lastAt<520) return;
    lastEl=el; lastKey=key; lastAt=now; play(key,1);
  },{passive:true});
  document.addEventListener('pointerout',function(ev){ if(lastEl && !lastEl.contains(ev.relatedTarget)) lastEl=null; },{passive:true});
  document.addEventListener('click',function(ev){
    const el=ev.target && ev.target.closest && ev.target.closest(clickSelector);
    if(!el || el.disabled || el.getAttribute('aria-disabled')==='true') return;
    const key=category(el,'click'); if(key) play(key,1);
  },true);
  document.addEventListener('pointerdown',function(ev){ if(ev.target && ev.target.closest && ev.target.closest('[data-game-card],.zoom-stage')) play('gameDrag',1); },true);
}
(function initV77VisibleTextFallback(){
  function read(path,def){ try{ var cur=window.APP_DATA || window.SITE_DATA || {}; path.split('.').forEach(function(k){ cur = cur && cur[k]; }); return cur == null ? def : cur; }catch(_){ return def; } }
  function apply(){
    document.querySelectorAll('.music-btn').forEach(function(btn){ btn.setAttribute('aria-label', read('visibleText.common.musicAria','播放或暂停背景音乐')); });
    document.querySelectorAll('.copy-link em').forEach(function(el){ el.textContent = read('visibleText.common.copyHint','点击复制'); });
    document.querySelectorAll('.site-footer span:first-child').forEach(function(el){ if(/Weijian/i.test(el.textContent) || /Zhu Wei/i.test(el.textContent)) el.textContent = read('visibleText.common.footerCopy','© 2027 Zhu Weixian Portfolio'); });
    document.querySelectorAll('.site-footer span:nth-child(2)').forEach(function(el){ if(el.textContent.trim()) el.textContent = read('visibleText.common.footerTagline','Game Design / UI Motion / Visual Portfolio'); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){ apply(); setTimeout(apply,120); },{once:true}); else { apply(); setTimeout(apply,120); }
})();


/* ================= V78：前页进入主页丝滑切换 + 制作流程悬停收口 ================= */
function initScratchEntry(){
  const canvas=document.getElementById('scratchCanvas');
  if(!canvas) return;
  if(document.documentElement.dataset.entryV78Bound==='1') return;
  document.documentElement.dataset.entryV78Bound='1';
  const ctx=canvas.getContext('2d',{alpha:true,desynchronized:true}) || canvas.getContext('2d',{alpha:true});
  const meter=document.getElementById('scratchMeterFill');
  const fallback=document.getElementById('entryFallback');
  const hotzone=document.querySelector('.entry-right-hotzone');
  const card=document.querySelector('.entry-minimal-card');
  const coarse=window.matchMedia && matchMedia('(pointer:coarse)').matches;
  const reduceMotion=window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w=1,h=1,dpr=1,last=null,energy=0,entering=false,raf=0,restoreFrame=0,active=false,cardRaf=0,cardX=0,cardY=0;
  const targetEnergy=coarse ? 1450 : 5000;
  const minSpeed=coarse ? 140 : 760;
  document.body.classList.add('entry-v78-layout');
  canvas.style.touchAction='none';
  canvas.style.webkitUserSelect='none';
  canvas.style.userSelect='none';

  function resize(){
    w=Math.max(1,window.innerWidth||document.documentElement.clientWidth||360);
    h=Math.max(1,window.innerHeight||document.documentElement.clientHeight||640);
    dpr=Math.min(window.devicePixelRatio||1,coarse?1.2:1.55);
    canvas.width=Math.floor(w*dpr); canvas.height=Math.floor(h*dpr);
    canvas.style.width=w+'px'; canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0); drawLayer(); last=null; updateMeter();
  }
  function drawLayer(){
    ctx.globalCompositeOperation='source-over'; ctx.clearRect(0,0,w,h);
    const g=ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,'rgba(247,249,255,.90)');
    g.addColorStop(.42,'rgba(222,238,252,.84)');
    g.addColorStop(.74,'rgba(238,228,255,.80)');
    g.addColorStop(1,'rgba(250,230,198,.80)');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='rgba(7,17,31,.026)';
    const dots=coarse?54:108;
    for(let i=0;i<dots;i++) ctx.fillRect((i*137)%w,(i*79)%h,1,1);
  }
  function restore(){
    if(entering || reduceMotion) return;
    ctx.globalCompositeOperation='source-over';
    ctx.fillStyle=coarse?'rgba(239,237,250,.010)':'rgba(241,246,252,.016)';
    ctx.fillRect(0,0,w,h);
  }
  function brush(x,y,r){
    ctx.globalCompositeOperation='destination-out';
    const grad=ctx.createRadialGradient(x,y,0,x,y,r);
    grad.addColorStop(0,'rgba(0,0,0,.98)');
    grad.addColorStop(.46,'rgba(0,0,0,.66)');
    grad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }
  function updateMeter(){ if(meter) meter.style.width=Math.max(0,Math.min(100,energy/targetEnergy*100)).toFixed(1)+'%'; }
  function enter(){
    if(entering) return;
    entering=true; cancelAnimationFrame(raf); energy=targetEnergy; updateMeter();
    try{ sessionStorage.setItem('zw-entry-smooth-v78','1'); }catch(_e){}
    document.body.classList.add('is-entering','entry-v78-entering');
    window.setTimeout(()=>{ window.location.href='./home.html'; }, reduceMotion ? 80 : 760);
  }
  function tilt(x,y){
    if(!card || coarse || reduceMotion) return;
    cardX=x; cardY=y; if(cardRaf) return;
    cardRaf=requestAnimationFrame(()=>{
      const r=card.getBoundingClientRect();
      if(r.width&&r.height){
        const cx=r.left+r.width/2, cy=r.top+r.height/2;
        card.style.setProperty('--entry-mx',((cardX-r.left)/r.width*100).toFixed(2)+'%');
        card.style.setProperty('--entry-my',((cardY-r.top)/r.height*100).toFixed(2)+'%');
        card.style.transform=`translate3d(var(--entry-card-x,0px),var(--entry-card-y,0px),0) perspective(920px) rotateX(${(cardY-cy)/r.height*-3.2}deg) rotateY(${(cardX-cx)/r.width*3.2}deg) translateY(-3px)`;
      }
      cardRaf=0;
    });
  }
  function point(e){
    if(e.touches && e.touches[0]) return {x:e.touches[0].clientX,y:e.touches[0].clientY};
    if(e.changedTouches && e.changedTouches[0]) return {x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};
    return {x:e.clientX,y:e.clientY};
  }
  function handle(x,y,forceActive=false){
    if(entering) return;
    const now=performance.now(); if(forceActive) active=true; tilt(x,y);
    if(last){
      const dx=x-last.x,dy=y-last.y,dt=Math.max(10,now-last.t),dist=Math.hypot(dx,dy),speed=dist/dt*1000;
      const r=coarse?Math.max(64,Math.min(168,54+dist*.72+speed*.016)):Math.max(58,Math.min(154,56+speed*.039));
      brush(x,y,r);
      if(active || speed>minSpeed){ energy += coarse ? dist*(1.8+Math.min(speed/850,1.55)) : dist*Math.min(speed/1150,2.15); }
      else energy*=.972;
      updateMeter(); if(energy>=targetEnergy) enter();
    }else{ brush(x,y,coarse?92:76); if(coarse) energy+=90; updateMeter(); }
    last={x,y,t:now};
  }
  function start(e){
    if(entering) return;
    const clickable=e.target&&e.target.closest&&e.target.closest('#entryFallback,.entry-right-hotzone');
    if(clickable){ if(e.cancelable) e.preventDefault(); enter(); return; }
    active=true; const p=point(e); if(e.cancelable) e.preventDefault(); handle(p.x,p.y,true);
  }
  function move(e){
    if(entering) return;
    const p=point(e);
    if((active||e.type.indexOf('touch')===0) && e.cancelable) e.preventDefault();
    handle(p.x,p.y,active || e.type.indexOf('touch')===0 || e.pointerType==='touch');
  }
  function end(){ active=false; last=null; if(card && !coarse) card.style.transform=''; }
  function loop(){ if(!entering){ restoreFrame++; if(restoreFrame%2===0) restore(); energy*=coarse?.9945:.990; updateMeter(); raf=requestAnimationFrame(loop); } }
  window.addEventListener('resize',resize,{passive:true});
  window.addEventListener('pointerdown',start,{capture:true,passive:false});
  window.addEventListener('pointermove',move,{capture:true,passive:false});
  window.addEventListener('pointerup',end,{capture:true,passive:true});
  window.addEventListener('pointercancel',end,{capture:true,passive:true});
  window.addEventListener('touchstart',start,{capture:true,passive:false});
  window.addEventListener('touchmove',move,{capture:true,passive:false});
  window.addEventListener('touchend',end,{capture:true,passive:true});
  if(fallback) fallback.addEventListener('click',e=>{e.preventDefault(); enter();});
  if(hotzone) hotzone.addEventListener('click',e=>{e.preventDefault(); e.stopPropagation(); enter();});
  resize(); raf=requestAnimationFrame(loop);
}

(function initHomeArrivalV78(){
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); }
  ready(function(){
    if(!document.body || !document.body.classList.contains('home-page')) return;
    if(!document.documentElement.classList.contains('entry-from-v78')) return;
    try{ sessionStorage.removeItem('zw-entry-smooth-v78'); }catch(_e){}
    requestAnimationFrame(function(){ document.body.classList.add('entry-arrived-v78'); });
    setTimeout(function(){ document.documentElement.classList.remove('entry-from-v78'); document.body.classList.remove('entry-arrived-v78'); },980);
  });
})();


/* ================= V79：小游戏页、BGM、隐藏入口提示与终端适配最终覆盖 ================= */
function renderMiniGames(d){
  d = d || (window.APP_DATA || window.SITE_DATA || {});
  const games = Array.isArray(d.miniGames) ? d.miniGames : [];
  const vt = (d.visibleText && d.visibleText.miniGameHelp) || {};
  const title = vt.libraryTitle || '小游戏作品';
  const desc = vt.libraryDesc || '点击作品卡片即可打开运行窗口；有封面时优先展示封面，没有封面时显示占位信息。';
  const runText = (d.ui && d.ui.runGame) || '运行游戏';
  if(!games.length){
    return '<div class="game-works-v79"><section class="game-works-v79-head"><div><span>Godot Web Demo</span><h2>'+esc(title)+'</h2><p>'+esc(desc)+'</p></div><b class="game-works-v79-count">0</b></section><div class="empty-tip">暂未添加小游戏作品。</div></div>';
  }
  const first = games[0];
  const featureVisual = imageOr(first.cover,'game-cover',first.title || title);
  const pathText = first.iframe ? first.iframe : (vt.emptyIframe || '暂未填写 Godot Web index.html 路径。');
  const cards = games.map((g,i)=>{
    return '<article class="game-card-v79" data-game-index="'+i+'">'+
      imageOr(g.cover,'game-cover',g.title || ('小游戏作品 '+(i+1)))+
      '<div class="game-card-v79-body"><h3>'+esc(g.title || ('小游戏作品 '+(i+1)))+'</h3><p>'+esc(g.desc || g.detail || '')+'</p><b>'+esc(runText)+' →</b></div></article>';
  }).join('');
  return '<div class="game-works-v79">'+
    '<section class="game-works-v79-head"><div><span>Godot Web Demo</span><h2>'+esc(title)+'</h2><p>'+esc(desc)+'</p></div><b class="game-works-v79-count">'+games.length+'</b></section>'+
    '<section class="game-works-v79-feature" data-game-index="0"><div class="game-works-v79-visual">'+featureVisual+'</div><div class="game-works-v79-copy"><p class="eyebrow">Featured Demo</p><h3>'+esc(first.title || title)+'</h3><p>'+esc(first.detail || first.desc || '')+'</p><div class="game-works-v79-actions"><button class="game-open-btn-v79" type="button" data-game-index="0">'+esc(runText)+' →</button><span class="game-path-pill-v79">'+esc(pathText)+'</span></div></div></section>'+
    '<section class="game-works-v79-grid">'+cards+'</section></div>';
}

function initMusic(d){
  const bgm = document.getElementById('bgm');
  const btn = document.getElementById('musicBtn');
  if(!bgm || !btn || btn.dataset.v79MusicBound === '1') return;
  btn.dataset.v79MusicBound = '1';
  d = d || (window.APP_DATA || window.SITE_DATA || {});
  const vt = d.visibleText && d.visibleText.common ? d.visibleText.common : {};
  const src = bgm.getAttribute('src') || (d.site && d.site.bgm ? asset(d.site.bgm) : '');
  if(src && !bgm.getAttribute('src')) bgm.src = src;
  bgm.loop = true;
  bgm.preload = 'auto';
  bgm.volume = 0.46;
  btn.setAttribute('aria-label', vt.musicAria || '播放或暂停背景音乐');
  btn.setAttribute('aria-pressed','false');
  btn.dataset.state = 'paused';
  btn.dataset.tip = '点击播放';
  const text = btn.querySelector('.music-text');
  if(text) text.textContent = vt.musicLabel || 'BGM';

  function remember(){
    try{
      sessionStorage.setItem('zw-bgm-time-v79', String(Math.floor(bgm.currentTime || 0)));
      sessionStorage.setItem('zw-bgm-intent-v79', bgm.paused ? 'paused' : 'playing');
    }catch(_e){}
  }
  function restoreTime(){
    try{
      const t = Number(sessionStorage.getItem('zw-bgm-time-v79') || 0);
      if(Number.isFinite(t) && t > 0 && Number.isFinite(bgm.duration || 0)) bgm.currentTime = Math.min(t, Math.max(0, (bgm.duration || t + 1) - .25));
    }catch(_e){}
  }
  function sync(){
    const playing = !bgm.paused && !bgm.ended;
    btn.classList.toggle('is-playing', playing);
    btn.dataset.state = playing ? 'playing' : 'paused';
    btn.dataset.tip = playing ? '点击暂停' : '点击播放';
    btn.setAttribute('aria-pressed', String(playing));
    if(text) text.textContent = vt.musicLabel || 'BGM';
  }
  async function playByUser(){
    if(!bgm.src) return sync();
    try{
      if(!bgm.dataset.v79TimeRestored){ bgm.dataset.v79TimeRestored='1'; restoreTime(); }
      await bgm.play();
      try{ sessionStorage.setItem('zw-bgm-intent-v79','playing'); }catch(_e){}
    }catch(_e){
      btn.dataset.tip = '浏览器限制，请再点一次';
    }
    sync();
  }
  function pauseByUser(){
    bgm.pause();
    try{ sessionStorage.setItem('zw-bgm-intent-v79','paused'); }catch(_e){}
    remember();
    sync();
  }
  btn.addEventListener('click', function(ev){
    ev.preventDefault();
    ev.stopPropagation();
    if(ev.stopImmediatePropagation) ev.stopImmediatePropagation();
    if(bgm.paused || bgm.ended) playByUser(); else pauseByUser();
  }, true);
  btn.addEventListener('keydown', function(ev){
    if(ev.key === ' ' || ev.key === 'Enter'){
      ev.preventDefault();
      if(bgm.paused || bgm.ended) playByUser(); else pauseByUser();
    }
  });
  bgm.addEventListener('play', sync);
  bgm.addEventListener('pause', sync);
  bgm.addEventListener('ended', sync);
  bgm.addEventListener('timeupdate', function(){
    if(Math.floor((bgm.currentTime || 0)) % 5 === 0) remember();
  });
  window.addEventListener('pagehide', remember, {once:false});
  document.addEventListener('play', function(ev){
    const media = ev.target;
    if(media && media !== bgm && (media.tagName === 'AUDIO' || media.tagName === 'VIDEO' || media.tagName === 'IFRAME')){
      if(!bgm.paused) pauseByUser();
    }
  }, true);
  sync();
}

(function initV79HiddenEntryHintAndRerender(){
  function ready(fn){ if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true}); else fn(); }
  function getText(path, def){
    try{ let cur = window.APP_DATA || window.SITE_DATA || {}; path.split('.').forEach(k=>cur = cur && cur[k]); return cur == null ? def : cur; }catch(_e){ return def; }
  }
  function addHint(){
    const hv = document.querySelector('.home-page .hero-visual');
    const frame = document.querySelector('.home-page .portrait-frame');
    if(!hv || !frame || hv.querySelector('.avatar-secret-hint-v79')) return;
    if(getComputedStyle(hv).position === 'static') hv.style.position = 'relative';
    const hint = document.createElement('div');
    hint.className = 'avatar-secret-hint-v79';
    hint.textContent = getText('visibleText.home.secretHint','长按试试？');
    hv.appendChild(hint);
  }
  function rerenderGames(){
    const box = document.querySelector('[data-render="miniGames"]');
    if(box && typeof renderMiniGames === 'function') box.innerHTML = renderMiniGames(window.APP_DATA || window.SITE_DATA || {});
  }
  function markDevice(){
    const coarse = window.matchMedia && matchMedia('(pointer:coarse)').matches;
    document.documentElement.classList.toggle('is-coarse-v79', !!coarse);
    document.documentElement.classList.toggle('is-fine-v79', !coarse);
    document.documentElement.dataset.viewportV79 = window.innerWidth < 560 ? 'phone' : (window.innerWidth < 1024 ? 'tablet' : 'desktop');
  }
  ready(function(){ addHint(); rerenderGames(); markDevice(); setTimeout(addHint,180); });
  window.addEventListener('resize', function(){ requestAnimationFrame(markDevice); }, {passive:true});
})();

/* ================= V80：BGM提示清理、获奖证书重排、头像提示最终覆盖 ================= */
function renderAwards(d){
  const awards = (d && Array.isArray(d.awards)) ? d.awards : [];
  const items = awards.map((a,i)=>{
    const title = a && a.title ? a.title : ('获奖与证书 '+(i+1));
    const year = a && a.year ? a.year : '';
    const level = a && a.level ? a.level : '';
    const detail = a && a.detail ? a.detail : '点击查看证书或补充说明。';
    return '<button class="award-item award-item-v80" type="button" data-award-index="'+i+'">'+
      '<span class="award-card-meta-v80"><b>'+esc(year)+'</b><em class="award-card-level-v80">'+esc(level)+'</em></span>'+
      '<strong class="award-card-title-v80">'+esc(title)+'</strong>'+
      '<p class="award-card-detail-v80">'+esc(detail)+'</p>'+
    '</button>';
  });
  const dup = items.map(html => html.replace('award-item award-item-v80','award-item award-item-v80 is-duplicate'));
  return items.join('') + dup.join('');
}

function initAwards(){
  const rail = document.getElementById('awardRail');
  const toggle = document.getElementById('awardToggle');
  if(!rail || !toggle || toggle.dataset.v80Bound === '1') return;
  toggle.dataset.v80Bound = '1';
  toggle.removeAttribute('style');
  toggle.setAttribute('aria-expanded', String(rail.classList.contains('is-expanded')));
  try{
    const label = (((window.APP_DATA || window.SITE_DATA || {}).visibleText || {}).home || {}).awardToggleLabel || '展开或收起获奖证书';
    toggle.setAttribute('aria-label', label);
  }catch(_e){}
  toggle.addEventListener('click', function(ev){
    ev.preventDefault();
    const open = rail.classList.toggle('is-expanded');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.remove('is-click-pop');
    void toggle.offsetWidth;
    toggle.classList.add('is-click-pop');
    window.setTimeout(function(){ toggle.classList.remove('is-click-pop'); toggle.removeAttribute('style'); }, 420);
  });
}

(function initV80InteractionPolish(){
  function ready(fn){ if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true}); else fn(); }
  function scrubBgmTip(){
    document.querySelectorAll('.music-btn').forEach(function(btn){
      if(btn.getAttribute('title') !== null) btn.removeAttribute('title');
      if(btn.dataset.tip !== '') btn.dataset.tip = '';
      if(!btn.classList.contains('music-btn-no-tip-v80')) btn.classList.add('music-btn-no-tip-v80');
    });
  }
  function bindAvatarHint(){
    const hv = document.querySelector('.home-page .hero-visual');
    const frame = document.querySelector('.home-page .portrait-frame');
    if(!hv || !frame || hv.dataset.v80HintBound === '1') return;
    hv.dataset.v80HintBound = '1';
    const hint = hv.querySelector('.avatar-secret-hint-v79,.avatar-secret-hint-v80');
    if(hint) hint.classList.add('avatar-secret-hint-v80');
    frame.addEventListener('mouseenter', function(){ hv.classList.add('is-avatar-hover-v80'); }, {passive:true});
    frame.addEventListener('mouseleave', function(){ hv.classList.remove('is-avatar-hover-v80'); }, {passive:true});
    frame.addEventListener('focusin', function(){ hv.classList.add('is-avatar-hover-v80'); });
    frame.addEventListener('focusout', function(){ hv.classList.remove('is-avatar-hover-v80'); });
  }
  function rerenderAwardsOnce(){
    const box = document.querySelector('[data-render="awards"]');
    if(!box || box.dataset.v80Rendered === '1') return;
    if(window.APP_DATA || window.SITE_DATA){
      box.innerHTML = renderAwards(window.APP_DATA || window.SITE_DATA || {});
      box.dataset.v80Rendered = '1';
    }
  }
  ready(function(){
    scrubBgmTip();
    bindAvatarHint();
    rerenderAwardsOnce();
    setTimeout(function(){ scrubBgmTip(); bindAvatarHint(); rerenderAwardsOnce(); }, 160);
    setTimeout(function(){ scrubBgmTip(); bindAvatarHint(); }, 700);
    if(window.MutationObserver){
      let scheduled = false;
      const mo = new MutationObserver(function(){
        if(scheduled) return;
        scheduled = true;
        requestAnimationFrame(function(){ scheduled = false; scrubBgmTip(); bindAvatarHint(); });
      });
      mo.observe(document.documentElement, {subtree:true, childList:true, attributes:true, attributeFilter:['data-tip','title','class']});
    }
  });
})();


/* ================= V81：获奖证书展开按钮固定尺寸与红色主题状态同步 ================= */
function initAwards(){
  const rail = document.getElementById('awardRail');
  const toggle = document.getElementById('awardToggle');
  if(!rail || !toggle || toggle.dataset.v81Bound === '1') return;
  toggle.dataset.v81Bound = '1';
  toggle.dataset.v80Bound = '1';
  toggle.removeAttribute('style');
  toggle.setAttribute('aria-expanded', String(rail.classList.contains('is-expanded')));
  try{
    const label = (((window.APP_DATA || window.SITE_DATA || {}).visibleText || {}).home || {}).awardToggleLabel || '展开或收起获奖证书';
    toggle.setAttribute('aria-label', label);
  }catch(_e){}
  toggle.addEventListener('click', function(ev){
    ev.preventDefault();
    const open = rail.classList.toggle('is-expanded');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.remove('is-click-pop');
    void toggle.offsetWidth;
    toggle.classList.add('is-click-pop');
    window.setTimeout(function(){ toggle.classList.remove('is-click-pop'); toggle.removeAttribute('style'); }, 360);
  });
}
(function initV81AwardsPolish(){
  function ready(fn){ if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true}); else fn(); }
  function mark(){
    const section = document.getElementById('awards');
    const rail = document.getElementById('awardRail');
    const toggle = document.getElementById('awardToggle');
    if(section) section.classList.add('awards-section-v81-red');
    if(rail) rail.classList.add('award-rail-v81-fixed');
    if(toggle){
      toggle.classList.add('award-arrow-v81-fixed');
      toggle.removeAttribute('style');
      toggle.setAttribute('aria-expanded', String(rail && rail.classList.contains('is-expanded')));
    }
  }
  ready(function(){ mark(); setTimeout(mark,120); setTimeout(mark,520); });
})();


/* ================= V84：获奖证书重排、等级类型差异与日志同步 ================= */
(function initV84DataPatch(){
  'use strict';
  var notes = [
    '修复编辑器使用教程面板打开时偶发一帧旧排版闪动的问题。',
    '提高黑夜模式隐藏页背景网格可见度。',
    '重新排版获奖与证书板块，移除跑马灯下方白色矩形，展开按钮与跑马灯同高。',
    '白天模式获奖与证书板块改为红色主题，并优化白天导航栏选中状态。',
    '按奖项级别与类型自动增加细微显示差异，并同步网站与编辑器数据接口。'
  ];
  function patch(target){
    if(!target || typeof target !== 'object') return;
    target.maintenance = Object.assign({}, target.maintenance || {}, {version:'V84', updatedAt:'2026-06-28', notes: notes.slice()});
    target.awardDisplay = Object.assign({
      autoLevelTone:true,
      autoTypeTone:true,
      lightTheme:'red-harmonized',
      marqueeHeight:'same-as-toggle'
    }, target.awardDisplay || {});
  }
  patch(window.SITE_DATA);
})();

function awardToneV84(a){
  var text = [a && a.level, a && a.title, a && a.year].filter(Boolean).join(' ');
  var level = 'other';
  if(/国家|全国|国赛/.test(text)) level = 'national';
  else if(/省|广东|赛区/.test(text)) level = 'provincial';
  else if(/校|学院|学校/.test(text)) level = 'campus';
  else if(/证书|驾驶|普通话|级/.test(text)) level = 'certificate';
  var type = 'award';
  if(/证书|驾驶|普通话/.test(text)) type = 'certificate';
  else if(/吉他|音乐|弹唱|指弹/.test(text)) type = 'music';
  else if(/设计|广告|数字文化|CG|三维|动画|分镜|漫画/.test(text)) type = 'design';
  else if(/大赛|比赛|竞赛/.test(text)) type = 'competition';
  var rank = 'rank-normal';
  if(/一等|一等奖|冠军|金奖/.test(text)) rank = 'rank-first';
  else if(/二等|二等奖|亚军|银奖/.test(text)) rank = 'rank-second';
  else if(/三等|三等奖|季军|铜奖/.test(text)) rank = 'rank-third';
  else if(/优秀|优胜/.test(text)) rank = 'rank-honorable';
  return {level:level,type:type,rank:rank};
}

function awardLevelLabelV84(level){
  return {national:'国家级', provincial:'省级', campus:'校级', certificate:'证书', other:'荣誉'}[level] || '荣誉';
}

function renderAwards(d){
  const awards = (d && Array.isArray(d.awards)) ? d.awards : [];
  const items = awards.map((a,i)=>{
    const tone = awardToneV84(a || {});
    const title = a && a.title ? a.title : ('获奖与证书 '+(i+1));
    const year = a && a.year ? a.year : '';
    const level = a && a.level ? a.level : awardLevelLabelV84(tone.level);
    const detail = a && a.detail ? a.detail : '点击查看证书或补充说明。';
    return '<button class="award-item award-item-v84 level-'+esc(tone.level)+' type-'+esc(tone.type)+' '+esc(tone.rank)+'" type="button" data-award-index="'+i+'" data-award-level="'+esc(tone.level)+'" data-award-type="'+esc(tone.type)+'">'+
      '<span class="award-card-ribbon-v84" aria-hidden="true"></span>'+
      '<span class="award-card-top-v84"><span class="award-card-year-v84">'+esc(year)+'</span><em class="award-card-level-v84">'+esc(level)+'</em></span>'+ 
      '<strong class="award-card-title-v84">'+esc(title)+'</strong>'+ 
      '<span class="award-card-detail-v84">'+esc(detail)+'</span>'+ 
    '</button>';
  });
  const dup = items.map(html => html.replace('award-item award-item-v84','award-item award-item-v84 is-duplicate'));
  return items.join('') + dup.join('');
}

function initAwards(){
  const rail = document.getElementById('awardRail');
  const toggle = document.getElementById('awardToggle');
  if(!rail || !toggle || toggle.dataset.v84Bound === '1') return;
  toggle.dataset.v84Bound = '1';
  toggle.dataset.v81Bound = '1';
  toggle.dataset.v80Bound = '1';
  rail.classList.add('award-rail-v84');
  const section = document.getElementById('awards');
  if(section) section.classList.add('awards-section-v84-red');
  toggle.classList.add('award-arrow-v84-fixed');
  toggle.removeAttribute('style');
  toggle.setAttribute('aria-expanded', String(rail.classList.contains('is-expanded')));
  try{
    const label = (((window.APP_DATA || window.SITE_DATA || {}).visibleText || {}).home || {}).awardToggleLabel || '展开或收起获奖证书';
    toggle.setAttribute('aria-label', label);
  }catch(_e){}
  toggle.addEventListener('click', function(ev){
    ev.preventDefault();
    const open = rail.classList.toggle('is-expanded');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.remove('is-click-pop');
    void toggle.offsetWidth;
    toggle.classList.add('is-click-pop');
    window.setTimeout(function(){ toggle.classList.remove('is-click-pop'); toggle.removeAttribute('style'); }, 360);
  });
}

(function initV84AwardsFinalMark(){
  function ready(fn){ if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true}); else fn(); }
  function mark(){
    const data = window.APP_DATA || window.SITE_DATA || {};
    if(data && typeof data === 'object'){
      data.maintenance = Object.assign({}, data.maintenance || {}, {
        version:'V84',
        updatedAt:'2026-06-28',
        notes:[
          '修复编辑器使用教程面板打开时偶发一帧旧排版闪动的问题。',
          '提高黑夜模式隐藏页背景网格可见度。',
          '重新排版获奖与证书板块，移除跑马灯下方白色矩形，展开按钮与跑马灯同高。',
          '白天模式获奖与证书板块改为红色主题，并优化白天导航栏选中状态。',
          '按奖项级别与类型自动增加细微显示差异，并同步网站与编辑器数据接口。'
        ]
      });
      data.awardDisplay = Object.assign({autoLevelTone:true,autoTypeTone:true,lightTheme:'red-harmonized',marqueeHeight:'same-as-toggle'}, data.awardDisplay || {});
    }
    const box = document.querySelector('[data-render="awards"]');
    if(box && !box.dataset.v84Rendered && (window.APP_DATA || window.SITE_DATA)){
      box.innerHTML = renderAwards(window.APP_DATA || window.SITE_DATA || {});
      box.dataset.v84Rendered = '1';
    }
    const section = document.getElementById('awards');
    const rail = document.getElementById('awardRail');
    const toggle = document.getElementById('awardToggle');
    if(section) section.classList.add('awards-section-v84-red');
    if(rail) rail.classList.add('award-rail-v84');
    if(toggle){ toggle.classList.add('award-arrow-v84-fixed'); toggle.removeAttribute('style'); }
  }
  ready(function(){ mark(); setTimeout(mark,120); setTimeout(mark,480); });
})();


/* ================= V85：四类型获奖证书数据接口与渲染覆盖 ================= */
(function initV85AwardsAndNavigationPatch(){
  'use strict';
  var notes = [
    '获奖与证书视觉系统收敛为国家级、省级、校级、证书四种类型，一等奖在类型基础上额外高亮。',
    '重新协调黑夜模式获奖与证书板块配色，避免大板块、奖项卡片和展开按钮都使用同一种红色。',
    '重做白天模式导航栏普通选中态，改为低视觉重量的红色细线浮标。',
    '为“网站制作花絮”和“前页/回到前面”两个特殊导航按钮增加白天、黑夜差异化常态、悬停和选中效果。',
    '同步网站与编辑器数据接口，并更新 V85 日志文件。'
  ];
  function patchData(target){
    if(!target || typeof target !== 'object') return;
    target.maintenance = Object.assign({}, target.maintenance || {}, {version:'V85', updatedAt:'2026-06-28', notes:notes.slice()});
    target.awardDisplay = Object.assign({}, target.awardDisplay || {}, {
      visualVersion:'V85',
      typeSystem:['national','provincial','campus','certificate'],
      firstPrizeHighlight:true,
      darkTheme:'balanced-warm-dark',
      lightTheme:'soft-red-cream'
    });
  }
  function detectLevel(a){
    var text = [a && a.level, a && a.title, a && a.detail, a && a.year].filter(Boolean).join(' ');
    if(/证书|驾驶证|普通话|吉他|指弹|等级|级\s*$/.test(text)) return 'certificate';
    if(/国家|全国|国赛/.test(text)) return 'national';
    if(/省|广东|赛区/.test(text)) return 'provincial';
    if(/校|学院|学校|校园/.test(text)) return 'campus';
    return 'campus';
  }
  function label(level){
    return {national:'国家级',provincial:'省级',campus:'校级',certificate:'证书'}[level] || '校级';
  }
  window.awardToneV85 = function(a){
    var text = [a && a.level, a && a.title, a && a.detail].filter(Boolean).join(' ');
    var level = detectLevel(a || {});
    var rank = /一等|一等奖|冠军|金奖/.test(text) ? 'rank-first' : 'rank-normal';
    return {level:level,type:level,rank:rank};
  };
  window.renderAwards = function(d){
    var awards = (d && Array.isArray(d.awards)) ? d.awards : [];
    var items = awards.map(function(a,i){
      var tone = window.awardToneV85(a || {});
      var title = a && a.title ? a.title : ('获奖与证书 '+(i+1));
      var year = a && a.year ? a.year : '';
      var levelText = label(tone.level);
      var detail = a && a.detail ? a.detail : '点击查看证书或补充说明。';
      return '<button class="award-item award-item-v84 award-item-v85 level-'+esc(tone.level)+' type-'+esc(tone.type)+' '+esc(tone.rank)+'" type="button" data-award-index="'+i+'" data-award-level="'+esc(tone.level)+'" data-award-type="'+esc(tone.type)+'">'+
        '<span class="award-card-ribbon-v84" aria-hidden="true"></span>'+
        '<span class="award-card-top-v84"><span class="award-card-year-v84">'+esc(year)+'</span><em class="award-card-level-v84">'+esc(levelText)+'</em></span>'+ 
        '<strong class="award-card-title-v84">'+esc(title)+'</strong>'+ 
        '<span class="award-card-detail-v84">'+esc(detail)+'</span>'+ 
      '</button>';
    });
    var dup = items.map(function(html){ return html.replace('award-item award-item-v84 award-item-v85','award-item award-item-v84 award-item-v85 is-duplicate'); });
    return items.join('') + dup.join('');
  };
  function mark(){
    var data = window.APP_DATA || window.SITE_DATA || {};
    patchData(data);
    var section = document.getElementById('awards');
    var rail = document.getElementById('awardRail');
    var toggle = document.getElementById('awardToggle');
    var box = document.querySelector('[data-render="awards"]');
    if(section){ section.classList.add('awards-section-v84-red','awards-section-v85-balanced'); }
    if(rail){ rail.classList.add('award-rail-v84','award-rail-v85'); }
    if(toggle){ toggle.classList.add('award-arrow-v84-fixed','award-arrow-v85-fixed'); toggle.removeAttribute('style'); }
    if(box && data && !box.dataset.v85Rendered){
      box.innerHTML = window.renderAwards(data);
      box.dataset.v85Rendered = '1';
      box.dataset.v84Rendered = '1';
    }
  }
  patchData(window.SITE_DATA);
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ mark(); setTimeout(mark,120); setTimeout(mark,520); }, {once:true});
  else { mark(); setTimeout(mark,120); setTimeout(mark,520); }
})();
