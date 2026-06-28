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
        ? {base:'#d9c8ff',mid:'#b7eef6',sheen:'#ffd36f',accent:'#a987ff',speed:1.55,intensity:1.52,grain:.12,vignette:.12,mouse:.72}
        : {base:'#01030a',mid:'#08101d',sheen:'#70533a',accent:'#1b837c',speed:1.42,intensity:.34,grain:.16,vignette:1.08,mouse:.30};
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
      const dpr=Math.min(window.devicePixelRatio||1,1.12);
      const w=Math.max(1,window.innerWidth), h=Math.max(1,window.innerHeight);
      canvas.width=Math.floor(w*dpr); canvas.height=Math.floor(h*dpr);
      gl.viewport(0,0,canvas.width,canvas.height); gl.uniform2f(u.res,canvas.width,canvas.height);
    }
    function onPointerMove(e){target.x=e.clientX/Math.max(1,window.innerWidth);target.y=1-e.clientY/Math.max(1,window.innerHeight);}
    function onPointerLeave(){target.x=.5;target.y=.5;}
    function render(now){
      if(document.hidden){raf=requestAnimationFrame(render);return;}
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


