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

/* ================= V56：作品分类底部互跳、首页动态加载、移动端适配与耗时悬停修复 ================= */
(function initV56Patches(){
  'use strict';

  function onReady(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true});
    else fn();
  }

  function safeEsc(value){
    try{ return typeof esc === 'function' ? esc(value) : String(value == null ? '' : value).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];}); }
    catch(_){ return String(value == null ? '' : value); }
  }

  function categoryKeyV56(){
    var page=(document.body && document.body.dataset && document.body.dataset.page || '').toLowerCase();
    var map={video:'video-works.html',graphic:'graphic-works.html',music:'music-works.html',game:'game-works.html'};
    return map[page] || '';
  }

  window.renderPortfolioSubnav = function renderPortfolioSubnavV56(d){
    var current=categoryKeyV56();
    if(!current) return '';
    var categories=(d && d.portfolioCategories) || [];
    var others=categories.filter(function(c){return c && c.href !== current;});
    if(!others.length) return '';
    return '<section class="section-shell portfolio-subnav-v15 portfolio-subnav-v56 reveal-up" aria-label="继续浏览其他作品分类">'
      + '<div class="portfolio-subnav-title"><span>继续浏览</span><small>另外三个作品分类</small></div>'
      + '<div class="portfolio-subnav-grid">'
      + others.map(function(c){
          return '<a class="portfolio-subnav-card" href="./'+safeEsc(c.href || '#')+'"><span>'+safeEsc(c.type || 'Category')+'</span><strong>'+safeEsc(c.title || '')+'</strong><em>'+safeEsc(c.desc || '')+'</em></a>';
        }).join('')
      + '</div></section>';
  };

  window.injectPortfolioSubnav = function injectPortfolioSubnavV56(d){
    if(!categoryKeyV56()) return;
    var main=document.querySelector('main');
    if(!main) return;
    var subnav=document.querySelector('.portfolio-subnav-v15');
    if(!subnav){
      var html=window.renderPortfolioSubnav ? window.renderPortfolioSubnav(d || window.APP_DATA || window.SITE_DATA || {}) : '';
      if(!html) return;
      var wrap=document.createElement('div');
      wrap.innerHTML=html.trim();
      subnav=wrap.firstElementChild;
    }
    subnav.classList.add('portfolio-subnav-v56');
    var sections=[].slice.call(main.querySelectorAll(':scope > section:not(.portfolio-subnav-v15):not(.portfolio-subnav-v56)'));
    var target=sections[sections.length-1] || main.lastElementChild;
    if(target && target !== subnav) target.insertAdjacentElement('afterend', subnav);
    else main.appendChild(subnav);
  };

  window.renderMakingCards = function renderMakingCardsV56(d){
    var b=(d && d.behindScenes) || {};
    var desc=String(b.durationDesc || '').replace(/鼠标悬停即可查看完整制作耗时/g,'').trim();
    return '<article class="making-card" data-making="process"><span class="making-type">Process</span><h2>'+safeEsc(b.processTitle || '制作流程')+'</h2><p>'+safeEsc(b.processDesc || '')+'</p><b class="card-link">点击查看导图 →</b></article>'
      + '<article class="making-card" data-making="tools"><span class="making-type">Tools</span><h2>'+safeEsc(b.toolsTitle || '使用工具')+'</h2><p>'+safeEsc(b.toolsDesc || '')+'</p><b class="card-link">点击查看工具 →</b></article>'
      + '<article class="making-card duration-card duration-card-v56" data-making="duration" data-duration="3天"><span class="making-type">Duration</span><h2>'+safeEsc(b.durationTitle || '制作耗时')+'</h2>'+(desc?'<p>'+safeEsc(desc)+'</p>':'')+'<strong class="duration-hover-value-v56" aria-hidden="true">3天</strong></article>';
  };

  function relocatePortfolioSubnav(){
    try{ if(window.injectPortfolioSubnav) window.injectPortfolioSubnav(window.APP_DATA || window.SITE_DATA || {}); }
    catch(_){ }
  }

  function initHomeDynamicLoading(){
    var body=document.body;
    if(!body || !body.classList.contains('home-page')) return;
    var sections=[].slice.call(document.querySelectorAll('main > section'));
    if(!sections.length) return;
    sections.forEach(function(sec,idx){
      sec.classList.add('home-dynamic-v56');
      sec.style.setProperty('--load-index', String(Math.min(idx, 6)));
      sec.querySelectorAll('img').forEach(function(img){
        if(!img.hasAttribute('loading')) img.setAttribute('loading','lazy');
        if(!img.hasAttribute('decoding')) img.setAttribute('decoding','async');
      });
      if(idx < 2) sec.classList.add('is-loaded-v56');
    });
    if(!('IntersectionObserver' in window)){
      sections.forEach(function(sec){ sec.classList.add('is-loaded-v56'); });
      return;
    }
    var ob=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-loaded-v56');
          ob.unobserve(entry.target);
        }
      });
    },{rootMargin:'18% 0px 16% 0px', threshold:0.02});
    sections.forEach(function(sec){ if(!sec.classList.contains('is-loaded-v56')) ob.observe(sec); });
  }

  function initMobileTerminalGuards(){
    var coarse=window.matchMedia && (matchMedia('(pointer:coarse)').matches || matchMedia('(hover:none)').matches);
    var narrow=window.matchMedia && matchMedia('(max-width: 760px)').matches;
    if(coarse) document.documentElement.classList.add('terminal-touch-v56');
    if(narrow) document.documentElement.classList.add('terminal-narrow-v56');
    if(coarse || narrow){
      document.querySelectorAll('iframe').forEach(function(ifr){ if(!ifr.hasAttribute('loading')) ifr.setAttribute('loading','lazy'); });
      document.querySelectorAll('.tilt-card,.entry-minimal-card').forEach(function(el){ el.classList.add('touch-static-v56'); });
    }
  }

  onReady(function(){
    relocatePortfolioSubnav();
    setTimeout(relocatePortfolioSubnav,80);
    setTimeout(relocatePortfolioSubnav,280);
    initHomeDynamicLoading();
    initMobileTerminalGuards();
  });
})();

/* V56 global renderer overrides：确保 renderComponents 调用最终版本 */
function currentPortfolioCategoryKeyV56(){
  var page=(document.body && document.body.dataset && document.body.dataset.page || '').toLowerCase();
  var map={video:'video-works.html',graphic:'graphic-works.html',music:'music-works.html',game:'game-works.html'};
  return map[page] || '';
}
function renderPortfolioSubnav(d){
  var current=currentPortfolioCategoryKeyV56();
  if(!current) return '';
  var categories=(d && d.portfolioCategories) || [];
  var others=categories.filter(function(c){return c && c.href !== current;});
  if(!others.length) return '';
  var e=(typeof esc==='function') ? esc : function(v){return String(v == null ? '' : v).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});};
  return '<section class="section-shell portfolio-subnav-v15 portfolio-subnav-v56 reveal-up" aria-label="继续浏览其他作品分类"><div class="portfolio-subnav-title"><span>继续浏览</span><small>另外三个作品分类</small></div><div class="portfolio-subnav-grid">'+others.map(function(c){return '<a class="portfolio-subnav-card" href="./'+e(c.href||'#')+'"><span>'+e(c.type||'Category')+'</span><strong>'+e(c.title||'')+'</strong><em>'+e(c.desc||'')+'</em></a>';}).join('')+'</div></section>';
}
function injectPortfolioSubnav(d){
  if(!currentPortfolioCategoryKeyV56()) return;
  var main=document.querySelector('main');
  if(!main) return;
  var subnav=document.querySelector('.portfolio-subnav-v15');
  if(!subnav){
    var html=renderPortfolioSubnav(d || window.APP_DATA || window.SITE_DATA || {});
    if(!html) return;
    var wrap=document.createElement('div');
    wrap.innerHTML=html.trim();
    subnav=wrap.firstElementChild;
  }
  subnav.classList.add('portfolio-subnav-v56');
  var sections=[].slice.call(main.querySelectorAll(':scope > section:not(.portfolio-subnav-v15):not(.portfolio-subnav-v56)'));
  var target=sections[sections.length-1] || main.lastElementChild;
  if(target && target !== subnav) target.insertAdjacentElement('afterend',subnav);
  else main.appendChild(subnav);
}
function renderMakingCards(d){
  var b=(d && d.behindScenes) || {};
  var e=(typeof esc==='function') ? esc : function(v){return String(v == null ? '' : v).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});};
  var desc=String(b.durationDesc || '').replace(/鼠标悬停即可查看完整制作耗时/g,'').trim();
  return '<article class="making-card" data-making="process"><span class="making-type">Process</span><h2>'+e(b.processTitle||'制作流程')+'</h2><p>'+e(b.processDesc||'')+'</p><b class="card-link">点击查看导图 →</b></article>'
    + '<article class="making-card" data-making="tools"><span class="making-type">Tools</span><h2>'+e(b.toolsTitle||'使用工具')+'</h2><p>'+e(b.toolsDesc||'')+'</p><b class="card-link">点击查看工具 →</b></article>'
    + '<article class="making-card duration-card duration-card-v56" data-making="duration" data-duration="3天"><span class="making-type">Duration</span><h2>'+e(b.durationTitle||'制作耗时')+'</h2>'+(desc?'<p>'+e(desc)+'</p>':'')+'<strong class="duration-hover-value-v56" aria-hidden="true">3天</strong></article>';
}


