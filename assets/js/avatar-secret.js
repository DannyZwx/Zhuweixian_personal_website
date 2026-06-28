(function(){
  'use strict';

  const body = document.body;
  if(!body || !body.classList.contains('avatar-secret-page')) return;

  /* V83：隐藏页主题修复。
     主站 V73 之后以 sessionStorage 保存当前会话主题；旧 localStorage 可能仍残留 light。
     隐藏页必须优先读取 sessionStorage，避免黑夜模式进入隐藏页后被旧缓存改回白天背景。 */
  try{
    const sessionTheme = sessionStorage.getItem('zw-theme-session-v73');
    const localTheme = localStorage.getItem('zw-theme');
    const configuredTheme = window.SITE_DATA && window.SITE_DATA.site && window.SITE_DATA.site.defaultTheme;
    const savedTheme = (sessionTheme === 'dark' || sessionTheme === 'light')
      ? sessionTheme
      : ((localTheme === 'dark' || localTheme === 'light')
          ? localTheme
          : (configuredTheme === 'light' ? 'light' : 'dark'));
    document.documentElement.setAttribute('data-theme', savedTheme === 'light' ? 'light' : 'dark');
    document.documentElement.dataset.theme = savedTheme === 'light' ? 'light' : 'dark';
  }catch(e){
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.dataset.theme = 'dark';
  }

  function appendBgCanvas(){
    let canvas = document.getElementById('avatarSecretAurora');
    if(!canvas){
      canvas = document.createElement('canvas');
      canvas.id = 'avatarSecretAurora';
      canvas.className = 'avatar-secret-aurora';
      canvas.setAttribute('aria-hidden','true');
      body.insertBefore(canvas, body.firstChild);
    }
    return canvas;
  }

  function createFallbackBg(){
    if(document.querySelector('.avatar-secret-bg-fallback')) return;
    const fallback = document.createElement('div');
    fallback.className = 'avatar-secret-bg-fallback';
    fallback.setAttribute('aria-hidden','true');
    body.insertBefore(fallback, body.firstChild);
  }

  function initSilkAurora(){
    const canvas = appendBgCanvas();
    const gl = canvas.getContext('webgl', { antialias:false, alpha:false });
    if(!gl){
      canvas.remove();
      createFallbackBg();
      return;
    }

    const vertexShaderSource = `
attribute vec2 position;
void main(){
  gl_Position=vec4(position,0.0,1.0);
}`;

    const fragmentShaderSource = `
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
float noise(vec2 p){
  vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f);
  float a=hash(i);float b=hash(i+vec2(1.0,0.0));float c=hash(i+vec2(0.0,1.0));float d=hash(i+vec2(1.0,1.0));
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p){
  float value=0.0;float amp=0.5;mat2 rot=mat2(0.82,0.57,-0.57,0.82);
  for(int i=0;i<5;i++){value+=amp*noise(p);p=rot*p*2.03;amp*=0.5;}
  return value;
}
float ribbon(vec2 p,float offset,float width,float softness){
  float y=p.y+sin(p.x*1.8+offset)*0.18;
  y+=sin(p.x*4.2-offset*0.7)*0.045;
  return smoothstep(width+softness,width,abs(y));
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  float aspect=u_res.x/max(u_res.y,1.0);
  vec2 p=(uv-0.5)*vec2(aspect,1.0);
  vec2 mouse=(u_mouse-0.5)*vec2(aspect,1.0);
  float t=u_time*0.12*u_speed;
  float pointerFalloff=smoothstep(0.72,0.0,length(p-mouse));
  p+=(mouse-p)*pointerFalloff*0.05*u_mouseInfluence;
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
  col+=vec3(1.0,0.93,0.82)*glint*0.22*u_intensity;
  col+=u_sheen*pointerFalloff*0.08*u_mouseInfluence;
  float vignette=smoothstep(1.25,0.22,length(p));
  col*=mix(1.0-u_vignette*0.42,1.06,vignette);
  float grain=(hash(gl_FragCoord.xy+t*90.0)-0.5)*0.08*u_grain;
  col+=grain;
  gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);
}`;

    function compile(type, source){
      const shader = gl.createShader(type);
      if(!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertex = compile(gl.VERTEX_SHADER, vertexShaderSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if(!vertex || !fragment){
      canvas.remove();
      createFallbackBg();
      return;
    }

    const program = gl.createProgram();
    if(!program){
      canvas.remove();
      createFallbackBg();
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
      canvas.remove();
      createFallbackBg();
      return;
    }
    gl.useProgram(program);

    const position = gl.getAttribLocation(program, 'position');
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      res: gl.getUniformLocation(program, 'u_res'),
      mouse: gl.getUniformLocation(program, 'u_mouse'),
      time: gl.getUniformLocation(program, 'u_time'),
      speed: gl.getUniformLocation(program, 'u_speed'),
      intensity: gl.getUniformLocation(program, 'u_intensity'),
      grain: gl.getUniformLocation(program, 'u_grain'),
      vignette: gl.getUniformLocation(program, 'u_vignette'),
      mouseInfluence: gl.getUniformLocation(program, 'u_mouseInfluence'),
      base: gl.getUniformLocation(program, 'u_base'),
      mid: gl.getUniformLocation(program, 'u_mid'),
      sheen: gl.getUniformLocation(program, 'u_sheen'),
      accent: gl.getUniformLocation(program, 'u_accent')
    };

    function hexToRgb(hex){
      const value = hex.replace('#','');
      return [parseInt(value.slice(0,2),16)/255, parseInt(value.slice(2,4),16)/255, parseInt(value.slice(4,6),16)/255];
    }

    const base = hexToRgb('#050507');
    const mid = hexToRgb('#14151d');
    const sheen = hexToRgb('#f4dfb8');
    const accent = hexToRgb('#6ed6c9');
    gl.uniform3f(uniforms.base, base[0], base[1], base[2]);
    gl.uniform3f(uniforms.mid, mid[0], mid[1], mid[2]);
    gl.uniform3f(uniforms.sheen, sheen[0], sheen[1], sheen[2]);
    gl.uniform3f(uniforms.accent, accent[0], accent[1], accent[2]);

    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targetMouse = { x:0.5, y:0.5 };
    const mouse = { x:0.5, y:0.5 };
    const start = performance.now();
    let rafId = 0;

    function resize(){
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, window.innerWidth);
      const height = Math.max(1, window.innerHeight);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.res, canvas.width, canvas.height);
    }

    function updatePointer(event){
      targetMouse.x = event.clientX / Math.max(1, window.innerWidth);
      targetMouse.y = 1 - event.clientY / Math.max(1, window.innerHeight);
    }

    function resetPointer(){
      targetMouse.x = 0.5;
      targetMouse.y = 0.5;
    }

    function render(now){
      mouse.x += (targetMouse.x - mouse.x) * 0.045;
      mouse.y += (targetMouse.y - mouse.y) * 0.045;
      const elapsed = reducedMotion ? 8 : (now - start) / 1000;
      gl.uniform2f(uniforms.mouse, mouse.x, mouse.y);
      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform1f(uniforms.speed, reducedMotion ? 0 : 1);
      gl.uniform1f(uniforms.intensity, 1);
      gl.uniform1f(uniforms.grain, 0.85);
      gl.uniform1f(uniforms.vignette, 1);
      gl.uniform1f(uniforms.mouseInfluence, reducedMotion ? 0 : 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    }

    window.addEventListener('resize', resize, { passive:true });
    window.addEventListener('pointermove', updatePointer, { passive:true });
    window.addEventListener('pointerleave', resetPointer, { passive:true });
    resize();
    rafId = requestAnimationFrame(render);

    window.addEventListener('pagehide', function(){
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('pointerleave', resetPointer);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    }, { once:true });
  }


  const SECRET_STORAGE_KEY_V42 = "zw_portfolio_site_data_v6";

  function secretCloneV42(value){
    try { return JSON.parse(JSON.stringify(value || {})); }
    catch(e){ return {}; }
  }

  function secretMergeV42(base, extra){
    if(!extra || typeof extra !== 'object') return base;
    Object.keys(extra).forEach(function(key){
      const value = extra[key];
      if(Array.isArray(value)){
        base[key] = value.slice();
      }else if(value && typeof value === 'object'){
        if(!base[key] || typeof base[key] !== 'object' || Array.isArray(base[key])) base[key] = {};
        secretMergeV42(base[key], value);
      }else{
        base[key] = value;
      }
    });
    return base;
  }

  function getSecretSiteDataV42(){
    const base = secretCloneV42(window.SITE_DATA || {});
    try{
      const local = localStorage.getItem(SECRET_STORAGE_KEY_V42);
      if(local){
        return secretMergeV42(base, JSON.parse(local));
      }
    }catch(e){}
    return base;
  }

  function svgTrailData(index){
    const palette = [
      ['#6ed6c9','#f4dfb8','#ffffff'],
      ['#7ee8ff','#fff36a','#ffffff'],
      ['#b78cff','#6ed6c9','#ffffff'],
      ['#ff9bd2','#f4dfb8','#ffffff'],
      ['#65e7ff','#a8ffdf','#ffffff']
    ][index % 5];
    const shapes = [
      `<circle cx="100" cy="100" r="56" fill="${palette[0]}" opacity=".78"/><circle cx="72" cy="76" r="18" fill="${palette[2]}" opacity=".65"/><path d="M100 34 L115 84 L166 100 L115 116 L100 166 L85 116 L34 100 L85 84 Z" fill="${palette[1]}" opacity=".68"/>`,
      `<rect x="38" y="38" width="124" height="124" rx="34" fill="${palette[0]}" opacity=".72"/><path d="M100 24 L176 100 L100 176 L24 100 Z" fill="${palette[1]}" opacity=".68"/><circle cx="100" cy="100" r="24" fill="${palette[2]}" opacity=".74"/>`,
      `<path d="M100 16 C138 46 170 60 184 100 C154 138 140 170 100 184 C62 154 30 140 16 100 C46 62 60 30 100 16Z" fill="${palette[0]}" opacity=".74"/><path d="M100 50 C124 68 134 76 150 100 C132 124 124 134 100 150 C76 132 66 124 50 100 C68 76 76 66 100 50Z" fill="${palette[1]}" opacity=".78"/>`,
      `<circle cx="100" cy="100" r="78" fill="none" stroke="${palette[0]}" stroke-width="18" opacity=".72"/><circle cx="100" cy="100" r="44" fill="${palette[1]}" opacity=".55"/><circle cx="100" cy="100" r="12" fill="${palette[2]}" opacity=".82"/>`,
      `<path d="M32 112 C48 48 98 14 156 44 C190 92 160 154 96 170 C52 158 24 148 32 112Z" fill="${palette[0]}" opacity=".72"/><path d="M69 74 C92 52 127 55 143 83 C128 118 98 135 62 119 C58 101 58 84 69 74Z" fill="${palette[1]}" opacity=".68"/>`
    ];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><filter id="g"><feGaussianBlur stdDeviation="2.2"/><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .68 0"/></filter></defs><g filter="url(#g)">${shapes[index % shapes.length]}</g>${shapes[index % shapes.length]}</svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  function normalizeSecretImagePath(value){
    if(typeof value !== 'string') return '';
    let src = value.trim();
    if(!src) return '';
    src = src.replace(/\\/g, '/');
    src = src.replace(/^file:\/\/\//i, '');
    const websiteAssetMatch = src.match(/(?:^|\/)website\/assets\/(.+)$/i);
    if(websiteAssetMatch) src = 'assets/' + websiteAssetMatch[1];
    const assetMatch = src.match(/(?:^|\/)assets\/(.+)$/i);
    if(assetMatch && !/^https?:\/\//i.test(src) && !src.startsWith('../')) src = 'assets/' + assetMatch[1];
    if(!/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(src)) return '';
    if(/^https?:\/\//i.test(src) || src.startsWith('data:')) return src;
    if(src.startsWith('../')) return src;
    if(src.startsWith('/assets/')) return '..' + src;
    if(src.startsWith('/')) return src;
    return '../' + src.replace(/^\.\//,'');
  }

  function collectTrailImages(){
    const data = getSecretSiteDataV42();
    const configured = data.secret && Array.isArray(data.secret.trailImages)
      ? data.secret.trailImages.map(normalizeSecretImagePath).filter(Boolean)
      : [];
    const unique = [...new Set(configured)].slice(0, 18);

    // 如果编辑器里的隐藏页拖尾素材还没填写，仍使用轻量 SVG 占位，避免隐藏页效果空白。
    if(!unique.length){
      while(unique.length < 10) unique.push(svgTrailData(unique.length));
    }
    return unique;
  }

  function initImageTrail(){
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layer = document.createElement('div');
    layer.className = 'avatar-secret-trail-layer';
    layer.setAttribute('aria-hidden','true');
    body.appendChild(layer);

    const images = collectTrailImages();
    const imageWidth = 168;
    const imageHeight = 168;
    const threshold = 50;
    const duration = 3000;
    const pool = images.map((src,index)=>{
      const img = document.createElement('img');
      img.className = 'avatar-secret-trail-img';
      img.src = src;
      img.alt = '';
      img.decoding = 'async';
      img.loading = 'eager';
      img.style.width = imageWidth + 'px';
      img.style.height = imageHeight + 'px';
      img.style.zIndex = String(index + 1);
      layer.appendChild(img);
      return img;
    });

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cache = { x: mouse.x, y: mouse.y };
    const last = { x: mouse.x, y: mouse.y };
    let z = 1;
    let index = 0;
    let rafId = 0;

    function lerp(a,b,n){ return (1 - n) * a + n * b; }
    function distance(){ return Math.hypot(mouse.x - last.x, mouse.y - last.y); }
    function showNextImage(){
      const img = pool[index];
      if(!img) return;
      img.getAnimations().forEach(a=>a.cancel());
      const startX = cache.x - imageWidth / 2;
      const startY = cache.y - imageHeight / 2;
      const endX = mouse.x - imageWidth / 2;
      const endY = mouse.y - imageHeight / 2;
      const rotate = ((z % 2 ? 1 : -1) * (8 + (z % 5) * 4));
      img.style.opacity = '1';
      img.style.zIndex = String(10 + z);
      const holdOffset = Math.min(0.76, 0.58 + (z % 7) * 0.025);
      const fallOffset = Math.min(0.90, holdOffset + 0.14);
      img.animate([
        { opacity: 0, offset: 0, transform: `translate3d(${startX}px,${startY}px,0) scale(.84) rotate(${rotate * -0.45}deg)` },
        { opacity: .95, offset: .13, transform: `translate3d(${startX}px,${startY}px,0) scale(.98) rotate(0deg)` },
        { opacity: .90, offset: holdOffset, transform: `translate3d(${endX}px,${endY}px,0) scale(1) rotate(${rotate * .18}deg)` },
        { opacity: .70, offset: fallOffset, transform: `translate3d(${endX}px,${endY + 46}px,0) scale(.98) rotate(${rotate * .36}deg)` },
        { opacity: 0, offset: 1, transform: `translate3d(${endX}px,${endY + window.innerHeight + imageHeight / 2}px,0) scale(.82) rotate(${rotate}deg)` }
      ], {
        duration: duration + (z % 7) * 120,
        easing: 'cubic-bezier(.19,1,.22,1)',
        fill: 'forwards'
      });
      z += 1;
      index = (index + 1) % pool.length;
      last.x = mouse.x;
      last.y = mouse.y;
    }
    function render(){
      cache.x = lerp(cache.x, mouse.x, 0.1);
      cache.y = lerp(cache.y, mouse.y, 0.1);
      if(distance() > threshold) showNextImage();
      rafId = requestAnimationFrame(render);
    }
    function onMove(event){
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    }
    window.addEventListener('pointermove', onMove, { passive:true });
    rafId = requestAnimationFrame(render);
    window.addEventListener('pagehide', function(){
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
    }, { once:true });
  }

  // V28：丝绸极光背景已与主站背景对调，隐藏页不再启动 WebGL 背景，只保留拖尾彩蛋。
  initImageTrail();
})();


/* ================= V79：隐藏页手机触控拖尾适配 ================= */
(function initAvatarSecretMobileTrailV79(){
  'use strict';
  const body = document.body;
  if(!body || !body.classList.contains('avatar-secret-page')) return;
  function ready(fn){ if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true}); else fn(); }
  ready(function(){
    body.classList.add('avatar-secret-mobile-v79');
    body.style.touchAction = 'none';
    body.style.overscrollBehavior = 'none';
    const coarse = window.matchMedia && matchMedia('(pointer:coarse)').matches;
    if(!coarse) return;
    let lastSynthetic = 0;
    function emitPointerLike(x,y){
      const now = performance.now();
      if(now - lastSynthetic < 42) return;
      lastSynthetic = now;
      try{
        window.dispatchEvent(new PointerEvent('pointermove', {clientX:x, clientY:y, pointerType:'touch', bubbles:true}));
      }catch(_e){
        const ev = new Event('pointermove'); ev.clientX = x; ev.clientY = y; window.dispatchEvent(ev);
      }
    }
    function fromTouch(ev){
      const t = ev.touches && ev.touches[0] || ev.changedTouches && ev.changedTouches[0];
      if(!t) return;
      if(ev.cancelable) ev.preventDefault();
      emitPointerLike(t.clientX, t.clientY);
    }
    body.addEventListener('touchstart', fromTouch, {passive:false});
    body.addEventListener('touchmove', fromTouch, {passive:false});
    body.addEventListener('pointerdown', function(ev){ emitPointerLike(ev.clientX, ev.clientY); }, {passive:true});
    body.addEventListener('pointermove', function(ev){ emitPointerLike(ev.clientX, ev.clientY); }, {passive:true});
  });
})();
