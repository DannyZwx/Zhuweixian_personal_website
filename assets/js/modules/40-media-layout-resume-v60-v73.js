/* ================= V60：头像卡片悬浮标签恢复与安全布局修复 ================= */
(function initHeroFloatingTagsV60(){
  'use strict';
  var tagClasses=['a','b','c','d','e','f'];
  function escV60(v){
    return String(v == null ? '' : v).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});
  }
  function dataV60(){ return window.APP_DATA || window.SITE_DATA || {}; }
  function apply(){
    var d=dataV60();
    var raw=(d.hero && Array.isArray(d.hero.tags)) ? d.hero.tags : [];
    var tags=raw.map(function(x){return String(x == null ? '' : x).trim();}).filter(Boolean);
    if(!tags.length) return;
    document.querySelectorAll('[data-render="heroTags"], .hero-tags').forEach(function(box){
      box.innerHTML=tags.map(function(x,i){
        var cls=tagClasses[i] || ('x'+i);
        return '<div class="floating-tag tag-'+cls+'" data-tag-index="'+i+'">'+escV60(x)+'</div>';
      }).join('');
      box.setAttribute('data-tag-count', String(tags.length));
    });
  }
  function run(){ apply(); setTimeout(apply,60); setTimeout(apply,240); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
})();


/* ================= V61：头像悬浮标签左侧布局校正 ================= */
(function initHeroTagsLeftSideV61(){
  'use strict';
  function normalize(){
    var boxes=document.querySelectorAll('.home-page .hero-tags,[data-render="heroTags"]');
    boxes.forEach(function(box){
      box.querySelectorAll('.floating-tag').forEach(function(tag,i){
        tag.classList.remove('tag-a','tag-b','tag-c','tag-d','tag-e','tag-f');
        tag.classList.add('tag-'+(['a','b','c','d','e','f'][i] || 'd'));
        tag.style.right='auto';
      });
    });
  }
  function run(){normalize(); setTimeout(normalize,80); setTimeout(normalize,260);}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
})();

/* ================= V62：网站制作花絮重排数据修正 + 蛋仔展示图自由下排 ================= */
(function initV62MakingAndEggyFlexibleGallery(){
  function htmlEscV62(str){
    return String(str == null ? '' : str).replace(/[&<>"']/g,function(s){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s];});
  }
  function assetV62(path){
    if(!path) return '';
    if(typeof asset === 'function') return asset(path);
    return String(path).replace(/^website\//,'').replace(/\\/g,'/');
  }
  function stripTrailingStopV62(text){
    return String(text || '').replace(/鼠标悬停即可查看完整制作耗时/g,'').replace(/[。．.]+\s*$/,'').trim();
  }
  window.renderMakingCards = function(d){
    var b = (d && d.behindScenes) || {};
    var desc = stripTrailingStopV62(b.durationDesc || '');
    return '<article class="making-card making-card-v62" data-making="process"><span class="making-type">Process</span><h2>'+htmlEscV62(b.processTitle || '制作流程')+'</h2><p>'+htmlEscV62(b.processDesc || '')+'</p><b class="card-link">点击查看导图 →</b></article>'
      + '<article class="making-card making-card-v62" data-making="tools"><span class="making-type">Tools</span><h2>'+htmlEscV62(b.toolsTitle || '使用工具')+'</h2><p>'+htmlEscV62(b.toolsDesc || '')+'</p><b class="card-link">点击查看工具 →</b></article>'
      + '<article class="making-card making-card-v62 duration-card duration-card-v56" data-making="duration" data-duration="3天"><span class="making-type">Duration</span><h2>'+htmlEscV62(b.durationTitle || '制作耗时')+'</h2>'+(desc?'<p>'+htmlEscV62(desc)+'</p>':'')+'<strong class="duration-hover-value-v56" aria-hidden="true">3天</strong></article>';
  };
  window.renderEggyDetail = function(d){
    var eggy = (d && d.eggy) || {};
    var abilities = Array.isArray(eggy.abilities) ? eggy.abilities : [];
    var slots = Array.isArray(eggy.slots) ? eggy.slots : [];
    var visual = eggy.image
      ? '<img class="eggy-png big" src="'+htmlEscV62(assetV62(eggy.image))+'" alt="'+htmlEscV62(eggy.title || '蛋仔派对专项')+'">'
      : '<div class="eggy-png-placeholder big">形象展示</div>';
    var abilityHtml = abilities.map(function(a){
      return '<div><h3>'+htmlEscV62(a.title || '能力项')+'</h3><p>'+htmlEscV62(a.desc || '')+'</p></div>';
    }).join('');
    var slotHtml = slots.map(function(s,i){
      var title = (s && s.title) || ('展示图 '+(i+1));
      var img = s && s.image;
      if(img){
        return '<img class="blue-placeholder zoomable-image-slot" data-zoomable-image data-zoom-title="'+htmlEscV62(title)+'" src="'+htmlEscV62(assetV62(img))+'" alt="'+htmlEscV62(title)+'">';
      }
      return '<div class="blue-placeholder zoomable-image-slot" data-zoom-placeholder="'+htmlEscV62(title)+'">'+htmlEscV62(title)+'</div>';
    }).join('');
    return '<section class="eggy-detail-layout"><aside class="eggy-detail-visual reveal-up">'+visual+'</aside><article class="eggy-detail-content reveal-up"><h2>'+htmlEscV62(eggy.title || '特殊定向技能：蛋仔派对')+'</h2><p>'+htmlEscV62(eggy.detailIntro || '')+'</p><div class="eggy-ability-grid">'+abilityHtml+'</div></article></section><section class="screenshot-grid eggy-gallery-v62">'+slotHtml+'</section>';
  };
  try{
    var d = window.SITE_DATA || null;
    document.querySelectorAll('[data-render="makingCards"]').forEach(function(n){ n.innerHTML = window.renderMakingCards(d); });
    document.querySelectorAll('[data-render="eggyDetail"]').forEach(function(n){ n.innerHTML = window.renderEggyDetail(d); });
  }catch(e){}
})();
/* V62：确保旧渲染入口也指向最新函数。 */
try{ if(window.renderMakingCards) renderMakingCards = window.renderMakingCards; }catch(e){}
try{ if(window.renderEggyDetail) renderEggyDetail = window.renderEggyDetail; }catch(e){}


/* ================= V63：修复蛋仔专项展示图排列 bug ================= */
(function initV63EggyGalleryLayoutFix(){
  function esc63(str){
    return String(str == null ? '' : str).replace(/[&<>"']/g,function(s){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s];});
  }
  function asset63(path){
    if(!path) return '';
    try{ if(typeof asset === 'function') return asset(path); }catch(e){}
    return String(path).replace(/^website\//,'').replace(/\\/g,'/');
  }
  function normalizeSlots63(slots){
    if(!Array.isArray(slots)) return [];
    return slots.filter(function(s){ return s && (String(s.title||'').trim() || String(s.image||'').trim()); });
  }
  function galleryCard63(s,i){
    var title = (s && s.title) ? s.title : ('展示图 '+(i+1));
    var img = s && s.image;
    if(img){
      return '<article class="eggy-gallery-card-v63 zoomable-image-slot" data-zoomable-image data-zoom-title="'+esc63(title)+'" role="button" tabindex="0">'
        + '<img class="eggy-gallery-image-v63" src="'+esc63(asset63(img))+'" alt="'+esc63(title)+'" loading="lazy">'
        + '<span class="eggy-gallery-title-v63">'+esc63(title)+'</span>'
        + '</article>';
    }
    return '<article class="eggy-gallery-card-v63 zoomable-image-slot is-empty" data-zoom-placeholder="'+esc63(title)+'" role="button" tabindex="0">'
      + '<div class="eggy-gallery-empty-v63">'+esc63(title)+'</div>'
      + '<span class="eggy-gallery-title-v63">'+esc63(title)+'</span>'
      + '</article>';
  }
  window.renderEggyDetail = function(d){
    var eggy = (d && d.eggy) || {};
    var abilities = Array.isArray(eggy.abilities) ? eggy.abilities : [];
    var slots = normalizeSlots63(eggy.slots);
    if(!slots.length){
      slots = [{title:'展示图 1',image:''},{title:'展示图 2',image:''},{title:'展示图 3',image:''}];
    }
    var visual = eggy.image
      ? '<img class="eggy-png big" src="'+esc63(asset63(eggy.image))+'" alt="'+esc63(eggy.title || '蛋仔派对专项')+'">'
      : '<div class="eggy-png-placeholder big">形象展示</div>';
    var abilityHtml = abilities.map(function(a){
      return '<div><h3>'+esc63((a && a.title) || '能力项')+'</h3><p>'+esc63((a && a.desc) || '')+'</p></div>';
    }).join('');
    var slotHtml = slots.map(galleryCard63).join('');
    return '<section class="eggy-detail-layout"><aside class="eggy-detail-visual reveal-up">'+visual+'</aside><article class="eggy-detail-content reveal-up"><h2>'+esc63(eggy.title || '特殊定向技能：蛋仔派对')+'</h2><p>'+esc63(eggy.detailIntro || '')+'</p><div class="eggy-ability-grid">'+abilityHtml+'</div></article></section><section class="eggy-gallery-v63">'+slotHtml+'</section>';
  };
  try{
    var d = window.SITE_DATA || null;
    document.querySelectorAll('[data-render="eggyDetail"]').forEach(function(n){ n.innerHTML = window.renderEggyDetail(d); });
  }catch(e){}
})();
try{ if(window.renderEggyDetail) renderEggyDetail = window.renderEggyDetail; }catch(e){}

/* ================= V64：蛋仔展示图重排 + 图片放大拖拽边界修复 ================= */
(function initV64EggyGalleryAndZoomBounds(){
  function esc64(str){
    return String(str == null ? '' : str).replace(/[&<>"']/g,function(s){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s];});
  }
  function asset64(path){
    if(!path) return '';
    try{ if(typeof asset === 'function') return asset(path); }catch(e){}
    return String(path).replace(/^website\//,'').replace(/\\/g,'/');
  }
  function normalizeSlots64(slots){
    if(!Array.isArray(slots)) return [];
    return slots.filter(function(s){ return s && (String(s.title||'').trim() || String(s.image||'').trim()); });
  }
  function renderEggyShot64(s,i){
    var title=(s && String(s.title||'').trim()) || ('展示图 '+(i+1));
    var img=s && String(s.image||'').trim();
    if(img){
      return '<article class="eggy-shot-card-v64 zoomable-image-slot" data-zoomable-image data-zoom-title="'+esc64(title)+'" role="button" tabindex="0">'
        + '<img src="'+esc64(asset64(img))+'" alt="'+esc64(title)+'" loading="lazy" decoding="async">'
        + '<span class="eggy-shot-title-v64">'+esc64(title)+'</span>'
        + '</article>';
    }
    return '<article class="eggy-shot-card-v64 zoomable-image-slot is-empty" data-zoom-placeholder="'+esc64(title)+'" role="button" tabindex="0">'
      + '<div class="eggy-shot-empty-v64">'+esc64(title)+'</div>'
      + '<span class="eggy-shot-title-v64">'+esc64(title)+'</span>'
      + '</article>';
  }
  window.renderEggyDetail = function(d){
    var eggy=(d && d.eggy) || {};
    var abilities=Array.isArray(eggy.abilities)?eggy.abilities:[];
    var slots=normalizeSlots64(eggy.slots);
    if(!slots.length) slots=[{title:'展示图 1',image:''},{title:'展示图 2',image:''},{title:'展示图 3',image:''}];
    var visual=eggy.image
      ? '<img class="eggy-png big" src="'+esc64(asset64(eggy.image))+'" alt="'+esc64(eggy.title || '蛋仔派对专项')+'" loading="lazy" decoding="async">'
      : '<div class="eggy-png-placeholder big">形象展示</div>';
    var abilityHtml=abilities.map(function(a){
      return '<div><h3>'+esc64((a && a.title) || '能力项')+'</h3><p>'+esc64((a && a.desc) || '')+'</p></div>';
    }).join('');
    var gallery=slots.map(renderEggyShot64).join('');
    return '<section class="eggy-detail-layout"><aside class="eggy-detail-visual reveal-up">'+visual+'</aside><article class="eggy-detail-content reveal-up"><h2>'+esc64(eggy.title || '特殊定向技能：蛋仔派对')+'</h2><p>'+esc64(eggy.detailIntro || '')+'</p><div class="eggy-ability-grid">'+abilityHtml+'</div></article></section>'
      + '<section class="eggy-gallery-shell-v64 reveal-up"><div class="eggy-gallery-head-v64"><div><h2>展示图</h2><p>编辑器中新增的展示图会在这里自动向下排列。</p></div><span class="eggy-gallery-count-v64">'+slots.length+' 张</span></div><div class="eggy-gallery-v64">'+gallery+'</div></section>';
  };
  try{ if(window.renderEggyDetail) renderEggyDetail = window.renderEggyDetail; }catch(e){}
  try{
    var d=window.SITE_DATA || window.APP_DATA || null;
    document.querySelectorAll('[data-render="eggyDetail"]').forEach(function(n){ n.innerHTML=window.renderEggyDetail(d); });
  }catch(e){}

  /* 替换旧 initZoomPan：使用图片自然比例计算 object-contain 后的真实基础尺寸，修复竖图上下拖拽边界不对称。 */
  window.initZoomPan = function(stage,img){
    var scale=1, x=0, y=0, dragging=false, sx=0, sy=0, ox=0, oy=0;
    var raf=0;
    function stageSize(){
      var r=stage.getBoundingClientRect();
      return {w:Math.max(1,r.width), h:Math.max(1,r.height)};
    }
    function fitSize(){
      var s=stageSize();
      var nw=img.naturalWidth || img.width || s.w;
      var nh=img.naturalHeight || img.height || s.h;
      var ratio=Math.min(s.w/nw, s.h/nh, 1);
      return {w:nw*ratio, h:nh*ratio, sw:s.w, sh:s.h};
    }
    function bounds(){
      var f=fitSize();
      return {
        maxX:Math.max(0,(f.w*scale - f.sw)/2),
        maxY:Math.max(0,(f.h*scale - f.sh)/2)
      };
    }
    function clampVals(){
      var b=bounds();
      x=Math.max(-b.maxX,Math.min(b.maxX,x));
      y=Math.max(-b.maxY,Math.min(b.maxY,y));
    }
    function resist(v,max){
      if(max<=0) return v*.12;
      if(v>max) return max+(v-max)*.16;
      if(v<-max) return -max+(v+max)*.16;
      return v;
    }
    function apply(smooth){
      if(raf) cancelAnimationFrame(raf);
      raf=requestAnimationFrame(function(){
        img.style.transition=smooth?'transform .30s cubic-bezier(.2,.9,.2,1)':'none';
        img.style.setProperty('--zoom-scale',scale.toFixed(4));
        img.style.setProperty('--zoom-x',x.toFixed(2)+'px');
        img.style.setProperty('--zoom-y',y.toFixed(2)+'px');
      });
    }
    function resetIntoBounds(smooth){
      clampVals();
      apply(!!smooth);
    }
    img.addEventListener('load',function(){ resetIntoBounds(true); },{once:true});
    window.addEventListener('resize',function(){ resetIntoBounds(true); },{passive:true});
    stage.addEventListener('wheel',function(e){
      e.preventDefault();
      var old=scale;
      var delta=e.deltaY<0?1.12:.88;
      scale=Math.max(1,Math.min(4,scale*delta));
      var rect=stage.getBoundingClientRect();
      var cx=e.clientX-rect.left-rect.width/2;
      var cy=e.clientY-rect.top-rect.height/2;
      var ratio=scale/old;
      x=x-(cx-x)*(ratio-1);
      y=y-(cy-y)*(ratio-1);
      resetIntoBounds(false);
    },{passive:false});
    stage.addEventListener('pointerdown',function(e){
      dragging=true;
      stage.classList.add('is-dragging');
      sx=e.clientX; sy=e.clientY; ox=x; oy=y;
      try{ stage.setPointerCapture(e.pointerId); }catch(err){}
      e.preventDefault();
    },{passive:false});
    stage.addEventListener('pointermove',function(e){
      if(!dragging) return;
      var b=bounds();
      x=resist(ox+e.clientX-sx,b.maxX);
      y=resist(oy+e.clientY-sy,b.maxY);
      apply(false);
    },{passive:true});
    function release(){
      if(!dragging) return;
      dragging=false;
      stage.classList.remove('is-dragging');
      resetIntoBounds(true);
    }
    stage.addEventListener('pointerup',release,{passive:true});
    stage.addEventListener('pointercancel',release,{passive:true});
    stage.addEventListener('pointerleave',release,{passive:true});
    stage.addEventListener('dblclick',function(){
      scale=1; x=0; y=0; apply(true);
    });
    resetIntoBounds(false);
  };
})();
try{ if(window.initZoomPan) initZoomPan = window.initZoomPan; }catch(e){}

/* ================= V65：修复竖向图片放大查看拖拽边界 ================= */
(function initZoomPanV65Override(){
  function clampNumber(v,min,max){ return Math.max(min,Math.min(max,v)); }

  window.initZoomPan = function(stage,img){
    if(!stage || !img) return;
    stage.classList.add('zoom-stage-v65');
    img.classList.add('zoom-pan-image-v65');

    var scale=1;
    var x=0;
    var y=0;
    var dragging=false;
    var sx=0, sy=0, ox=0, oy=0;
    var base={w:0,h:0,sw:0,sh:0};
    var raf=0;
    var ro=null;

    function readStage(){
      var r=stage.getBoundingClientRect();
      return {w:Math.max(1,r.width),h:Math.max(1,r.height)};
    }

    function computeBaseSize(){
      var s=readStage();
      var nw=img.naturalWidth || img.width || s.w;
      var nh=img.naturalHeight || img.height || s.h;
      var imgRatio=nh/Math.max(1,nw);
      var stageRatio=s.h/Math.max(1,s.w);
      var ratio;

      /*
       * 竖向长图不再强制按高度 contain 到舞台里。
       * 改为按宽度显示，这样图片高度可以超过舞台，默认状态也能上下拖动查看。
       * 横图/普通图仍使用 contain，避免左右溢出。
       */
      if(imgRatio > stageRatio * 1.08){
        ratio=(s.w*0.92)/nw;
      }else{
        ratio=Math.min((s.w*0.94)/nw,(s.h*0.94)/nh);
      }
      ratio=Math.max(0.05,ratio);
      base={w:nw*ratio,h:nh*ratio,sw:s.w,sh:s.h};
      img.style.setProperty('--zoom-base-w',base.w.toFixed(2)+'px');
      img.style.setProperty('--zoom-base-h',base.h.toFixed(2)+'px');
    }

    function getBounds(){
      if(!base.w || !base.h) computeBaseSize();
      return {
        maxX:Math.max(0,(base.w*scale-base.sw)/2),
        maxY:Math.max(0,(base.h*scale-base.sh)/2)
      };
    }

    function clampPosition(){
      var b=getBounds();
      x=clampNumber(x,-b.maxX,b.maxX);
      y=clampNumber(y,-b.maxY,b.maxY);
    }

    function resist(v,max){
      if(max<=0) return v*0.16;
      if(v>max) return max+(v-max)*0.18;
      if(v<-max) return -max+(v+max)*0.18;
      return v;
    }

    function apply(smooth){
      if(raf) cancelAnimationFrame(raf);
      raf=requestAnimationFrame(function(){
        img.style.transition=smooth?'transform .32s cubic-bezier(.18,.9,.2,1)':'none';
        img.style.setProperty('--zoom-scale',scale.toFixed(4));
        img.style.setProperty('--zoom-x',x.toFixed(2)+'px');
        img.style.setProperty('--zoom-y',y.toFixed(2)+'px');
      });
    }

    function recalc(keepPosition){
      computeBaseSize();
      if(!keepPosition){ x=0; y=0; scale=1; }
      clampPosition();
      apply(true);
    }

    function startDrag(e){
      dragging=true;
      stage.classList.add('is-dragging');
      sx=e.clientX; sy=e.clientY; ox=x; oy=y;
      try{ stage.setPointerCapture(e.pointerId); }catch(err){}
      window.addEventListener('pointermove',moveDrag,{passive:false});
      window.addEventListener('pointerup',endDrag,{passive:true});
      window.addEventListener('pointercancel',endDrag,{passive:true});
      e.preventDefault();
    }

    function moveDrag(e){
      if(!dragging) return;
      var b=getBounds();
      x=resist(ox+e.clientX-sx,b.maxX);
      y=resist(oy+e.clientY-sy,b.maxY);
      apply(false);
      e.preventDefault();
    }

    function endDrag(){
      if(!dragging) return;
      dragging=false;
      stage.classList.remove('is-dragging');
      window.removeEventListener('pointermove',moveDrag);
      window.removeEventListener('pointerup',endDrag);
      window.removeEventListener('pointercancel',endDrag);
      clampPosition();
      apply(true);
    }

    stage.addEventListener('wheel',function(e){
      e.preventDefault();
      computeBaseSize();
      var old=scale;
      var delta=e.deltaY<0?1.12:0.88;
      scale=clampNumber(scale*delta,1,4.2);
      var rect=stage.getBoundingClientRect();
      var cx=e.clientX-rect.left-rect.width/2;
      var cy=e.clientY-rect.top-rect.height/2;
      var ratio=scale/old;
      x=x-(cx-x)*(ratio-1);
      y=y-(cy-y)*(ratio-1);
      clampPosition();
      apply(false);
    },{passive:false});

    stage.addEventListener('pointerdown',startDrag,{passive:false});
    stage.addEventListener('dblclick',function(){
      scale=1; x=0; y=0; computeBaseSize(); apply(true);
    });

    if('ResizeObserver' in window){
      ro=new ResizeObserver(function(){ recalc(true); });
      ro.observe(stage);
    }else{
      window.addEventListener('resize',function(){ recalc(true); },{passive:true});
    }

    if(img.complete && img.naturalWidth){
      recalc(false);
    }else{
      img.addEventListener('load',function(){ recalc(false); },{once:true});
      computeBaseSize();
      apply(false);
    }
  };

  try{ initZoomPan=window.initZoomPan; }catch(e){}
})();


/* ================= V66：图片放大查看默认完整显示全图 ================= */
(function initZoomFullImageV66(){
  function esc66(str){
    return String(str == null ? '' : str).replace(/[&<>"']/g,function(s){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s];});
  }
  function label66(str){
    try{ if(typeof cleanLabel === 'function') return cleanLabel(str); }catch(e){}
    return String(str == null ? '' : str);
  }
  function removeZoom66(){
    document.querySelectorAll('.zoom-overlay').forEach(function(x){ x.remove(); });
  }
  window.openZoomLayer = function(title, visual){
    removeZoom66();
    var tmp=document.createElement('div');
    tmp.innerHTML=visual || '';
    var srcImg=tmp.querySelector('img');
    var safeTitle=label66(title || '图片预览');
    var content;
    if(srcImg){
      var src=srcImg.currentSrc || srcImg.src || srcImg.getAttribute('src') || '';
      content='<div class="zoom-stage zoom-stage-v66"><img class="zoom-pan-image-v66" src="'+esc66(src)+'" alt="'+esc66(safeTitle)+'" draggable="false" decoding="async"></div>'+
        '<div class="zoom-hint zoom-hint-v66">默认完整显示全图；滚轮可放大，放大后可拖拽查看细节，双击还原。</div>';
    }else{
      content='<div class="zoom-stage zoom-stage-v66 zoom-stage-placeholder-v66">'+(visual || '')+'</div>';
    }
    var div=document.createElement('div');
    div.className='zoom-overlay zoom-overlay-v66';
    div.innerHTML='<div class="zoom-overlay-backdrop" data-close-zoom></div>'+
      '<div class="zoom-overlay-panel zoom-overlay-panel-v66">'+
      '<button class="zoom-overlay-close" type="button" data-close-zoom>×</button>'+
      '<h2>'+esc66(safeTitle)+'</h2>'+content+'</div>';
    document.body.appendChild(div);
    var stage=div.querySelector('.zoom-stage-v66');
    var image=stage && stage.querySelector('img');
    if(image) window.initZoomPan(stage,image);
  };

  window.initZoomPan = function(stage,img){
    if(!stage || !img) return;
    stage.classList.add('zoom-stage-v66');
    img.classList.add('zoom-pan-image-v66');
    var scale=1, x=0, y=0;
    var dragging=false, sx=0, sy=0, ox=0, oy=0;
    var base={w:1,h:1,sw:1,sh:1};
    var raf=0;
    function stageSize(){
      var r=stage.getBoundingClientRect();
      return {w:Math.max(1,r.width), h:Math.max(1,r.height)};
    }
    function computeBase(){
      var s=stageSize();
      var nw=img.naturalWidth || img.width || s.w;
      var nh=img.naturalHeight || img.height || s.h;
      /* V66 核心：始终按 contain 计算，默认完整显示全图，不再让竖图默认超过视口。 */
      var ratio=Math.min((s.w*0.96)/Math.max(1,nw),(s.h*0.96)/Math.max(1,nh));
      ratio=Math.max(0.04,ratio);
      base={w:nw*ratio,h:nh*ratio,sw:s.w,sh:s.h};
      img.style.setProperty('--zoom-base-w',base.w.toFixed(2)+'px');
      img.style.setProperty('--zoom-base-h',base.h.toFixed(2)+'px');
    }
    function bounds(){
      if(!base.w || !base.h) computeBase();
      return {
        maxX:Math.max(0,(base.w*scale-base.sw)/2),
        maxY:Math.max(0,(base.h*scale-base.sh)/2)
      };
    }
    function clamp(){
      var b=bounds();
      x=Math.max(-b.maxX,Math.min(b.maxX,x));
      y=Math.max(-b.maxY,Math.min(b.maxY,y));
    }
    function resist(v,max){
      if(max<=0) return 0;
      if(v>max) return max+(v-max)*0.14;
      if(v<-max) return -max+(v+max)*0.14;
      return v;
    }
    function paint(smooth){
      if(raf) cancelAnimationFrame(raf);
      raf=requestAnimationFrame(function(){
        img.style.transition=smooth?'transform .30s cubic-bezier(.2,.9,.18,1)':'none';
        img.style.setProperty('--zoom-scale',scale.toFixed(4));
        img.style.setProperty('--zoom-x',x.toFixed(2)+'px');
        img.style.setProperty('--zoom-y',y.toFixed(2)+'px');
      });
    }
    function recalc(reset){
      computeBase();
      if(reset){scale=1;x=0;y=0;}
      clamp();
      paint(true);
    }
    function zoomAt(clientX,clientY,nextScale){
      computeBase();
      var old=scale;
      scale=Math.max(1,Math.min(5,nextScale));
      var rect=stage.getBoundingClientRect();
      var cx=clientX-rect.left-rect.width/2;
      var cy=clientY-rect.top-rect.height/2;
      var ratio=scale/old;
      if(ratio!==1){
        x=x-(cx-x)*(ratio-1);
        y=y-(cy-y)*(ratio-1);
      }
      clamp();
      paint(false);
    }
    stage.addEventListener('wheel',function(e){
      e.preventDefault();
      zoomAt(e.clientX,e.clientY,scale*(e.deltaY<0?1.13:0.88));
    },{passive:false});
    function move(e){
      if(!dragging) return;
      var b=bounds();
      x=resist(ox+e.clientX-sx,b.maxX);
      y=resist(oy+e.clientY-sy,b.maxY);
      paint(false);
      e.preventDefault();
    }
    function end(){
      if(!dragging) return;
      dragging=false;
      stage.classList.remove('is-dragging');
      window.removeEventListener('pointermove',move);
      window.removeEventListener('pointerup',end);
      window.removeEventListener('pointercancel',end);
      clamp();
      paint(true);
    }
    stage.addEventListener('pointerdown',function(e){
      /* 完整显示状态下不需要拖拽；放大后才允许拖拽查看细节。 */
      if(scale<=1.001) return;
      dragging=true;
      stage.classList.add('is-dragging');
      sx=e.clientX; sy=e.clientY; ox=x; oy=y;
      try{ stage.setPointerCapture(e.pointerId); }catch(err){}
      window.addEventListener('pointermove',move,{passive:false});
      window.addEventListener('pointerup',end,{passive:true});
      window.addEventListener('pointercancel',end,{passive:true});
      e.preventDefault();
    },{passive:false});
    stage.addEventListener('dblclick',function(){scale=1;x=0;y=0;computeBase();paint(true);});
    if('ResizeObserver' in window){
      var ro=new ResizeObserver(function(){recalc(false);});
      ro.observe(stage);
    }else{
      window.addEventListener('resize',function(){recalc(false);},{passive:true});
    }
    if(img.complete && img.naturalWidth) recalc(true);
    else img.addEventListener('load',function(){recalc(true);},{once:true});
    computeBase();
    paint(false);
  };
  try{ openZoomLayer=window.openZoomLayer; initZoomPan=window.initZoomPan; }catch(e){}
})();

/* ================= V67：图片放大后高清渲染，避免滚轮放大模糊 ================= */
(function initHighQualityZoomV67(){
  function esc67(str){
    return String(str == null ? '' : str).replace(/[&<>"']/g,function(s){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s];});
  }
  function label67(str){
    try{ if(typeof cleanLabel === 'function') return cleanLabel(str); }catch(e){}
    return String(str == null ? '' : str);
  }
  function removeZoom67(){
    document.querySelectorAll('.zoom-overlay').forEach(function(x){ x.remove(); });
  }
  function getOriginalSrcFromVisual(visual){
    var tmp=document.createElement('div');
    tmp.innerHTML=visual || '';
    var img=tmp.querySelector('img');
    if(!img) return '';
    return img.getAttribute('data-full-src') || img.getAttribute('data-original-src') || img.getAttribute('src') || img.currentSrc || img.src || '';
  }
  window.openZoomLayer = function(title, visual){
    removeZoom67();
    var safeTitle=label67(title || '图片预览');
    var src=getOriginalSrcFromVisual(visual);
    var content='';
    if(src){
      content='<div class="zoom-stage zoom-stage-v66 zoom-stage-v67">'
        + '<img class="zoom-pan-image-v66 zoom-pan-image-v67" src="'+esc67(src)+'" alt="'+esc67(safeTitle)+'" draggable="false" decoding="sync" fetchpriority="high">'
        + '</div>'
        + '<div class="zoom-hint zoom-hint-v66 zoom-hint-v67">默认完整显示全图；滚轮放大后使用原图高清重绘，放大后可拖拽查看细节，双击还原。</div>';
    }else{
      content='<div class="zoom-stage zoom-stage-v66 zoom-stage-v67 zoom-stage-placeholder-v67">'+(visual || '')+'</div>';
    }
    var div=document.createElement('div');
    div.className='zoom-overlay zoom-overlay-v66 zoom-overlay-v67';
    div.innerHTML='<div class="zoom-overlay-backdrop" data-close-zoom></div>'+
      '<div class="zoom-overlay-panel zoom-overlay-panel-v66 zoom-overlay-panel-v67">'+
      '<button class="zoom-overlay-close" type="button" data-close-zoom>×</button>'+
      '<h2>'+esc67(safeTitle)+'</h2>'+content+'</div>';
    document.body.appendChild(div);
    var stage=div.querySelector('.zoom-stage-v67');
    var image=stage && stage.querySelector('img');
    if(image) window.initZoomPan(stage,image);
  };

  window.initZoomPan = function(stage,img){
    if(!stage || !img) return;
    stage.classList.add('zoom-stage-v67');
    img.classList.add('zoom-pan-image-v67');
    img.removeAttribute('srcset');
    img.sizes='100vw';

    var scale=1, x=0, y=0;
    var dragging=false, sx=0, sy=0, ox=0, oy=0;
    var base={w:1,h:1,sw:1,sh:1};
    var raf=0;

    function stageSize(){
      var r=stage.getBoundingClientRect();
      return {w:Math.max(1,r.width), h:Math.max(1,r.height)};
    }
    function computeBase(){
      var s=stageSize();
      var nw=img.naturalWidth || img.width || s.w;
      var nh=img.naturalHeight || img.height || s.h;
      var ratio=Math.min((s.w*0.96)/Math.max(1,nw),(s.h*0.96)/Math.max(1,nh));
      ratio=Math.max(0.04,ratio);
      base={w:nw*ratio,h:nh*ratio,sw:s.w,sh:s.h};
    }
    function currentSize(){
      return {w:base.w*scale,h:base.h*scale};
    }
    function bounds(){
      if(!base.w || !base.h) computeBase();
      var c=currentSize();
      return {maxX:Math.max(0,(c.w-base.sw)/2), maxY:Math.max(0,(c.h-base.sh)/2)};
    }
    function clamp(){
      var b=bounds();
      x=Math.max(-b.maxX,Math.min(b.maxX,x));
      y=Math.max(-b.maxY,Math.min(b.maxY,y));
    }
    function resist(v,max){
      if(max<=0) return 0;
      if(v>max) return max+(v-max)*0.14;
      if(v<-max) return -max+(v+max)*0.14;
      return v;
    }
    function paint(smooth){
      if(raf) cancelAnimationFrame(raf);
      raf=requestAnimationFrame(function(){
        var c=currentSize();
        img.style.transition=smooth?'transform .28s cubic-bezier(.2,.9,.18,1), width .18s ease, height .18s ease':'none';
        img.style.setProperty('--zoom-render-w',c.w.toFixed(2)+'px');
        img.style.setProperty('--zoom-render-h',c.h.toFixed(2)+'px');
        img.style.setProperty('--zoom-x',x.toFixed(2)+'px');
        img.style.setProperty('--zoom-y',y.toFixed(2)+'px');
      });
    }
    function recalc(reset){
      computeBase();
      if(reset){scale=1;x=0;y=0;}
      clamp();
      paint(true);
    }
    function zoomAt(clientX,clientY,nextScale){
      computeBase();
      var old=scale;
      scale=Math.max(1,Math.min(6,nextScale));
      var rect=stage.getBoundingClientRect();
      var cx=clientX-rect.left-rect.width/2;
      var cy=clientY-rect.top-rect.height/2;
      var ratio=scale/Math.max(0.0001,old);
      if(ratio!==1){
        x=x-(cx-x)*(ratio-1);
        y=y-(cy-y)*(ratio-1);
      }
      clamp();
      paint(false);
    }
    stage.addEventListener('wheel',function(e){
      e.preventDefault();
      zoomAt(e.clientX,e.clientY,scale*(e.deltaY<0?1.14:0.88));
    },{passive:false});
    function move(e){
      if(!dragging) return;
      var b=bounds();
      x=resist(ox+e.clientX-sx,b.maxX);
      y=resist(oy+e.clientY-sy,b.maxY);
      paint(false);
      e.preventDefault();
    }
    function end(){
      if(!dragging) return;
      dragging=false;
      stage.classList.remove('is-dragging');
      window.removeEventListener('pointermove',move);
      window.removeEventListener('pointerup',end);
      window.removeEventListener('pointercancel',end);
      clamp();
      paint(true);
    }
    stage.addEventListener('pointerdown',function(e){
      if(scale<=1.001) return;
      dragging=true;
      stage.classList.add('is-dragging');
      sx=e.clientX; sy=e.clientY; ox=x; oy=y;
      try{ stage.setPointerCapture(e.pointerId); }catch(err){}
      window.addEventListener('pointermove',move,{passive:false});
      window.addEventListener('pointerup',end,{passive:true});
      window.addEventListener('pointercancel',end,{passive:true});
      e.preventDefault();
    },{passive:false});
    stage.addEventListener('dblclick',function(){ scale=1; x=0; y=0; computeBase(); paint(true); });
    if('ResizeObserver' in window){
      var ro=new ResizeObserver(function(){ recalc(false); });
      ro.observe(stage);
    }else{
      window.addEventListener('resize',function(){ recalc(false); },{passive:true});
    }
    if(img.complete && img.naturalWidth) recalc(true);
    else img.addEventListener('load',function(){ recalc(true); },{once:true});
    computeBase();
    paint(false);
  };
  try{ openZoomLayer=window.openZoomLayer; initZoomPan=window.initZoomPan; }catch(e){}
})();

/* ================= V68：图片放大查看改为鼠标中心缩放 + 无边界限位 ================= */
(function initMouseCenteredFreeZoomV68(){
  function esc68(str){
    return String(str == null ? '' : str).replace(/[&<>"']/g,function(s){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s];});
  }
  function label68(str){
    try{ if(typeof cleanLabel === 'function') return cleanLabel(str); }catch(e){}
    return String(str == null ? '' : str);
  }
  function removeZoom68(){
    document.querySelectorAll('.zoom-overlay').forEach(function(x){ x.remove(); });
  }
  function getOriginalSrc68(visual){
    var tmp=document.createElement('div');
    tmp.innerHTML=visual || '';
    var img=tmp.querySelector('img');
    if(!img) return '';
    return img.getAttribute('data-full-src') || img.getAttribute('data-original-src') || img.getAttribute('src') || img.currentSrc || img.src || '';
  }
  window.openZoomLayer = function(title, visual){
    removeZoom68();
    var safeTitle=label68(title || '图片预览');
    var src=getOriginalSrc68(visual);
    var content='';
    if(src){
      content='<div class="zoom-stage zoom-stage-v66 zoom-stage-v67 zoom-stage-v68">'
        + '<img class="zoom-pan-image-v66 zoom-pan-image-v67 zoom-pan-image-v68" src="'+esc68(src)+'" alt="'+esc68(safeTitle)+'" draggable="false" decoding="sync" fetchpriority="high">'
        + '</div>'
        + '<div class="zoom-hint zoom-hint-v66 zoom-hint-v67 zoom-hint-v68">默认完整显示全图；滚轮以鼠标位置为中心缩放，按住可自由拖动，双击还原。</div>';
    }else{
      content='<div class="zoom-stage zoom-stage-v66 zoom-stage-v67 zoom-stage-v68 zoom-stage-placeholder-v68">'+(visual || '')+'</div>';
    }
    var div=document.createElement('div');
    div.className='zoom-overlay zoom-overlay-v66 zoom-overlay-v67 zoom-overlay-v68';
    div.innerHTML='<div class="zoom-overlay-backdrop" data-close-zoom></div>'+
      '<div class="zoom-overlay-panel zoom-overlay-panel-v66 zoom-overlay-panel-v67 zoom-overlay-panel-v68">'+
      '<button class="zoom-overlay-close" type="button" data-close-zoom>×</button>'+
      '<h2>'+esc68(safeTitle)+'</h2>'+content+'</div>';
    document.body.appendChild(div);
    var stage=div.querySelector('.zoom-stage-v68');
    var image=stage && stage.querySelector('img');
    if(image) window.initZoomPan(stage,image);
  };

  window.initZoomPan = function(stage,img){
    if(!stage || !img) return;
    stage.classList.add('zoom-stage-v68');
    img.classList.add('zoom-pan-image-v68');
    img.removeAttribute('srcset');
    img.sizes='100vw';

    var scale=1;
    var x=0;
    var y=0;
    var dragging=false;
    var sx=0, sy=0, ox=0, oy=0;
    var base={w:1,h:1,sw:1,sh:1};
    var raf=0;

    function stageSize(){
      var r=stage.getBoundingClientRect();
      return {w:Math.max(1,r.width), h:Math.max(1,r.height)};
    }
    function computeBase(){
      var s=stageSize();
      var nw=img.naturalWidth || img.width || s.w;
      var nh=img.naturalHeight || img.height || s.h;
      var ratio=Math.min((s.w*0.96)/Math.max(1,nw),(s.h*0.96)/Math.max(1,nh));
      ratio=Math.max(0.04,ratio);
      base={w:nw*ratio,h:nh*ratio,sw:s.w,sh:s.h};
    }
    function currentSize(){
      return {w:base.w*scale,h:base.h*scale};
    }
    function paint(smooth){
      if(raf) cancelAnimationFrame(raf);
      raf=requestAnimationFrame(function(){
        var c=currentSize();
        img.style.transition=smooth?'transform .22s ease, width .16s ease, height .16s ease':'none';
        img.style.setProperty('--zoom-render-w',c.w.toFixed(2)+'px');
        img.style.setProperty('--zoom-render-h',c.h.toFixed(2)+'px');
        img.style.setProperty('--zoom-x',x.toFixed(2)+'px');
        img.style.setProperty('--zoom-y',y.toFixed(2)+'px');
      });
    }
    function reset(){
      computeBase();
      scale=1;
      x=0;
      y=0;
      paint(true);
    }
    function zoomAt(clientX,clientY,nextScale){
      computeBase();
      var old=scale;
      var newScale=Math.max(0.45,Math.min(8,nextScale));
      var rect=stage.getBoundingClientRect();
      var px=clientX-rect.left-rect.width/2;
      var py=clientY-rect.top-rect.height/2;
      var ratio=newScale/Math.max(0.0001,old);
      /* 以鼠标所在点为缩放中心：保持鼠标下方对应的图片位置不漂移。 */
      x=px-(px-x)*ratio;
      y=py-(py-y)*ratio;
      scale=newScale;
      /* V68 按要求取消边界限位和回弹，不再 clamp。 */
      paint(false);
    }
    stage.addEventListener('wheel',function(e){
      e.preventDefault();
      zoomAt(e.clientX,e.clientY,scale*(e.deltaY<0?1.14:0.88));
    },{passive:false});
    function move(e){
      if(!dragging) return;
      x=ox+e.clientX-sx;
      y=oy+e.clientY-sy;
      paint(false);
      e.preventDefault();
    }
    function end(){
      if(!dragging) return;
      dragging=false;
      stage.classList.remove('is-dragging');
      window.removeEventListener('pointermove',move);
      window.removeEventListener('pointerup',end);
      window.removeEventListener('pointercancel',end);
      /* V68 无边界回弹：松手后保留当前位置。 */
      paint(false);
    }
    stage.addEventListener('pointerdown',function(e){
      dragging=true;
      stage.classList.add('is-dragging');
      sx=e.clientX; sy=e.clientY; ox=x; oy=y;
      try{ stage.setPointerCapture(e.pointerId); }catch(err){}
      window.addEventListener('pointermove',move,{passive:false});
      window.addEventListener('pointerup',end,{passive:true});
      window.addEventListener('pointercancel',end,{passive:true});
      e.preventDefault();
    },{passive:false});
    stage.addEventListener('dblclick',function(){ reset(); });
    if('ResizeObserver' in window){
      var ro=new ResizeObserver(function(){ computeBase(); paint(false); });
      ro.observe(stage);
    }else{
      window.addEventListener('resize',function(){ computeBase(); paint(false); },{passive:true});
    }
    if(img.complete && img.naturalWidth){ reset(); }
    else img.addEventListener('load',function(){ reset(); },{once:true});
    computeBase();
    paint(false);
  };
  try{ openZoomLayer=window.openZoomLayer; initZoomPan=window.initZoomPan; }catch(e){}
})();


/* ================= V69：修复简历图片 / PDF 下载按钮 ================= */
(function initResumeDownloadFixV69(){
  'use strict';
  function ready(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true});
    else fn();
  }
  function getFileNameFromPath(url, fallback){
    try{
      var clean = String(url || '').split('#')[0].split('?')[0];
      var last = clean.split('/').filter(Boolean).pop() || fallback;
      last = decodeURIComponent(last.replace(/\\/g, '/'));
      return last || fallback;
    }catch(_){ return fallback; }
  }
  function normalizeDownloadUrl(url){
    url = String(url || '').trim();
    if(!url || url === '#') return '';
    return url.replace(/\\/g, '/');
  }
  function triggerAnchorDownload(url, filename){
    var a = document.createElement('a');
    a.href = url;
    a.download = filename || getFileNameFromPath(url, 'download');
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ a.remove(); }, 0);
  }
  async function forceDownload(url, filename){
    url = normalizeDownloadUrl(url);
    if(!url) return false;
    filename = filename || getFileNameFromPath(url, 'download');

    // http/https 同源部署时，用 Blob 强制触发下载，避免浏览器直接预览图片/PDF。
    // file:// 本地预览或少数浏览器不允许 fetch 本地文件时，自动回退到 download 链接。
    try{
      var absolute = new URL(url, location.href);
      var canFetch = absolute.protocol === 'http:' || absolute.protocol === 'https:';
      if(canFetch){
        var res = await fetch(absolute.href, {cache:'no-store', credentials:'same-origin'});
        if(!res.ok) throw new Error('download status '+res.status);
        var blob = await res.blob();
        var objectUrl = URL.createObjectURL(blob);
        triggerAnchorDownload(objectUrl, filename);
        setTimeout(function(){ URL.revokeObjectURL(objectUrl); }, 3000);
        return true;
      }
    }catch(err){
      // 进入回退逻辑。
    }
    triggerAnchorDownload(url, filename);
    return true;
  }
  function flash(btn, ok){
    if(!btn) return;
    btn.classList.remove('is-downloading','is-download-ok','is-download-error');
    btn.classList.add(ok ? 'is-download-ok' : 'is-download-error');
    btn.dataset.downloadTip = ok ? '已开始下载' : '下载失败，请检查路径';
    clearTimeout(btn._resumeDownloadTimerV69);
    btn._resumeDownloadTimerV69 = setTimeout(function(){
      btn.classList.remove('is-download-ok','is-download-error');
      delete btn.dataset.downloadTip;
    }, 1300);
  }
  function attach(){
    document.addEventListener('click', async function(e){
      var btn = e.target && e.target.closest && e.target.closest('.resume-download-image, .resume-download-pdf');
      if(!btn) return;
      if(btn.classList.contains('is-disabled')){
        e.preventDefault();
        return;
      }
      var url = btn.getAttribute('href') || btn.dataset.downloadUrl || '';
      var filename = btn.getAttribute('download') || (btn.classList.contains('resume-download-pdf') ? 'resume.pdf' : 'resume.png');
      if(!url || url === '#'){
        e.preventDefault();
        flash(btn, false);
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      btn.classList.add('is-downloading');
      btn.dataset.downloadTip = '准备下载';
      try{
        var ok = await forceDownload(url, filename);
        btn.classList.remove('is-downloading');
        flash(btn, !!ok);
      }catch(err){
        btn.classList.remove('is-downloading');
        flash(btn, false);
      }
    }, true);
  }

  // 覆盖最终简历页面渲染，给两个按钮补充明确 class / data 属性。
  var previousRenderResumePage = (typeof renderResumePage === 'function') ? renderResumePage : null;
  window.renderResumePage = renderResumePage = function(d){
    var r = (d && d.resume) || {};
    var title = r.title || '个人简历';
    var imgUrl = r.image ? asset(r.image) : '#';
    var pdfUrl = r.pdf ? asset(r.pdf) : '#';
    var imgFile = r.imageFileName || getFileNameFromPath(r.image || imgUrl, 'resume.png');
    var pdfFile = r.pdfFileName || getFileNameFromPath(r.pdf || pdfUrl, 'resume.pdf');
    var img = r.image
      ? '<img class="resume-img zoomable-image-slot" data-zoomable-image data-zoom-title="'+esc(title)+'" src="'+imgUrl+'" alt="'+esc(title)+'">'
      : '<div class="blue-placeholder resume-img-placeholder zoomable-image-slot" data-zoom-placeholder="个人简历">个人简历</div>';
    return '<div class="resume-image-card">'+img+'</div>'+
      '<aside class="resume-action-card">'+
      '<p class="eyebrow">Resume File</p>'+
      '<h2>'+esc(title)+'</h2>'+
      '<p>'+esc(r.desc || '点击简历图片可放大查看，也可以下载图片或 PDF 版本。')+'</p>'+
      '<div class="resume-downloads">'+
      '<a class="resume-download-image primary '+(r.image?'':'is-disabled')+'" href="'+imgUrl+'" data-download-url="'+imgUrl+'" download="'+esc(imgFile)+'" role="button">下载简历图片</a>'+
      '<a class="resume-download-pdf '+(r.pdf?'':'is-disabled')+'" href="'+pdfUrl+'" data-download-url="'+pdfUrl+'" download="'+esc(pdfFile)+'" role="button">下载 PDF 文件</a>'+
      '</div></aside>';
  };

  ready(function(){
    attach();
    // 如果当前页面已被旧版 renderResumePage 渲染，补齐 class，避免旧按钮漏接修复逻辑。
    document.querySelectorAll('.resume-downloads a').forEach(function(a, idx){
      if(idx === 0) a.classList.add('resume-download-image','primary');
      if(idx === 1) a.classList.add('resume-download-pdf');
      if(!a.dataset.downloadUrl) a.dataset.downloadUrl = a.getAttribute('href') || '';
      if(!a.getAttribute('download') && !a.classList.contains('is-disabled')){
        a.setAttribute('download', idx === 1 ? 'resume.pdf' : 'resume.png');
      }
    });
  });
})();


/* ================= V70：最终修复简历图片 / PDF 强制下载 ================= */
(function initResumeDownloadFixV70(){
  'use strict';
  function getFileNameFromPath(url, fallback){
    try{
      var clean = String(url || '').split('#')[0].split('?')[0].replace(/\\/g, '/');
      var last = clean.split('/').filter(Boolean).pop() || fallback;
      return decodeURIComponent(last) || fallback;
    }catch(_){ return fallback; }
  }
  function normalizeDownloadUrl(url){
    url = String(url || '').trim().replace(/\\/g, '/');
    if(!url || url === '#') return '';
    return url;
  }
  function clickDownload(url, filename){
    var a = document.createElement('a');
    a.href = url;
    a.download = filename || getFileNameFromPath(url, 'download');
    a.rel = 'noopener';
    a.style.position = 'fixed';
    a.style.left = '-9999px';
    a.style.top = '-9999px';
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ a.remove(); }, 100);
  }
  function flash(btn, text, cls){
    if(!btn) return;
    btn.classList.remove('is-downloading','is-download-ok','is-download-error');
    if(cls) btn.classList.add(cls);
    btn.dataset.downloadTip = text;
    clearTimeout(btn._resumeDownloadTimerV70);
    btn._resumeDownloadTimerV70 = setTimeout(function(){
      btn.classList.remove('is-download-ok','is-download-error','is-downloading');
      delete btn.dataset.downloadTip;
    }, 1600);
  }
  function canvasImageDownload(url, filename){
    return new Promise(function(resolve, reject){
      var source = document.querySelector('.resume-img');
      var img = source && source.complete && source.naturalWidth ? source : new Image();
      var external = img !== source;
      if(external){
        img.onload = draw;
        img.onerror = reject;
        img.src = url;
      }else draw();
      function draw(){
        try{
          var canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          if(!canvas.width || !canvas.height) throw new Error('empty image');
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(function(blob){
            if(!blob) return reject(new Error('canvas blob failed'));
            var objectUrl = URL.createObjectURL(blob);
            clickDownload(objectUrl, filename || 'resume.png');
            setTimeout(function(){ URL.revokeObjectURL(objectUrl); }, 4000);
            resolve(true);
          }, 'image/png');
        }catch(err){ reject(err); }
      }
    });
  }
  async function blobDownload(url, filename){
    var absolute = new URL(url, location.href);
    var res = await fetch(absolute.href, {cache:'no-store', credentials:'same-origin'});
    if(!res.ok) throw new Error('download status '+res.status);
    var blob = await res.blob();
    var objectUrl = URL.createObjectURL(blob);
    clickDownload(objectUrl, filename);
    setTimeout(function(){ URL.revokeObjectURL(objectUrl); }, 4000);
    return true;
  }
  async function forceDownload(url, filename, kind){
    url = normalizeDownloadUrl(url);
    if(!url) throw new Error('empty url');
    filename = filename || getFileNameFromPath(url, kind === 'pdf' ? 'resume.pdf' : 'resume.png');
    // 图片优先使用原始文件 fetch；本地 file:// 预览下 fetch 不可用时，尝试 canvas 转 blob 强制下载。
    try{
      var absolute = new URL(url, location.href);
      if(absolute.protocol === 'http:' || absolute.protocol === 'https:') return await blobDownload(url, filename);
    }catch(_){ }
    if(kind === 'image'){
      try{ return await canvasImageDownload(url, filename); }catch(_){ }
    }
    clickDownload(url, filename);
    return true;
  }
  function enhanceExistingButtons(){
    document.querySelectorAll('.resume-downloads a').forEach(function(a, idx){
      var isPdf = idx === 1 || /pdf/i.test(a.textContent || '') || /\.pdf(\?|#|$)/i.test(a.getAttribute('href') || '');
      a.classList.add(isPdf ? 'resume-download-pdf' : 'resume-download-image');
      if(!isPdf) a.classList.add('primary');
      if(!a.dataset.downloadUrl) a.dataset.downloadUrl = a.getAttribute('href') || '';
      if(!a.getAttribute('download') && !a.classList.contains('is-disabled')) a.setAttribute('download', isPdf ? 'resume.pdf' : 'resume.png');
    });
  }
  // 用 window 捕获层拦截，优先于旧版 document 捕获下载逻辑，避免旧逻辑重复或阻止下载。
  window.addEventListener('click', function(e){
    var btn = e.target && e.target.closest && e.target.closest('.resume-download-image, .resume-download-pdf');
    if(!btn) return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation) e.stopImmediatePropagation();
    if(btn.classList.contains('is-disabled')){ flash(btn, '请先填写文件路径', 'is-download-error'); return; }
    var kind = btn.classList.contains('resume-download-pdf') ? 'pdf' : 'image';
    var url = btn.dataset.downloadUrl || btn.getAttribute('href') || '';
    var filename = btn.getAttribute('download') || getFileNameFromPath(url, kind === 'pdf' ? 'resume.pdf' : 'resume.png');
    if(!url || url === '#'){ flash(btn, '请先填写文件路径', 'is-download-error'); return; }
    btn.classList.add('is-downloading');
    btn.dataset.downloadTip = '正在下载';
    forceDownload(url, filename, kind).then(function(){
      btn.classList.remove('is-downloading');
      flash(btn, '已开始下载', 'is-download-ok');
    }).catch(function(){
      btn.classList.remove('is-downloading');
      // 最后再尝试一次同步 download 链接，部分本地预览场景只能依赖浏览器原生下载。
      try{ clickDownload(url, filename); flash(btn, '已触发下载', 'is-download-ok'); }
      catch(_){ flash(btn, '下载失败，请检查路径', 'is-download-error'); }
    });
  }, true);
  var prevRender = (typeof renderResumePage === 'function') ? renderResumePage : null;
  window.renderResumePage = renderResumePage = function(d){
    var r = (d && d.resume) || {};
    var title = r.title || '个人简历';
    var imgUrl = r.image ? asset(r.image) : '#';
    var pdfUrl = r.pdf ? asset(r.pdf) : '#';
    var imgFile = r.imageFileName || getFileNameFromPath(r.image || imgUrl, 'resume.png');
    var pdfFile = r.pdfFileName || getFileNameFromPath(r.pdf || pdfUrl, 'resume.pdf');
    var img = r.image
      ? '<img class="resume-img zoomable-image-slot" data-zoomable-image data-zoom-title="'+esc(title)+'" src="'+imgUrl+'" alt="'+esc(title)+'">'
      : '<div class="blue-placeholder resume-img-placeholder zoomable-image-slot" data-zoom-placeholder="个人简历">个人简历</div>';
    return '<div class="resume-image-card">'+img+'</div>'+
      '<aside class="resume-action-card">'+
      '<p class="eyebrow">Resume File</p>'+
      '<h2>'+esc(title)+'</h2>'+
      '<p>'+esc(r.desc || '点击简历图片可放大查看，也可以下载图片或 PDF 版本。')+'</p>'+
      '<div class="resume-downloads">'+
      '<a class="resume-download-image primary '+(r.image?'':'is-disabled')+'" href="'+imgUrl+'" data-download-url="'+imgUrl+'" download="'+esc(imgFile)+'" role="button">下载简历图片</a>'+
      '<a class="resume-download-pdf '+(r.pdf?'':'is-disabled')+'" href="'+pdfUrl+'" data-download-url="'+pdfUrl+'" download="'+esc(pdfFile)+'" role="button">下载 PDF 文件</a>'+
      '</div></aside>';
  };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhanceExistingButtons, {once:true});
  else enhanceExistingButtons();
})();


/* ================= V72：首页动态加载、进入逻辑兜底与背景速度同步 ================= */
(function initV72HomeAndTerminalPolish(){
  'use strict';
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); }
  ready(function(){
    var isHome=document.body.classList.contains('home-page');
    if(isHome){
      var sections=[].slice.call(document.querySelectorAll('main > section'));
      sections.forEach(function(sec,idx){
        sec.classList.add('home-dynamic-v72');
        if(idx<2) sec.classList.add('is-loaded-v72');
      });
      if('IntersectionObserver' in window){
        var ob=new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            if(entry.isIntersecting){ entry.target.classList.add('is-loaded-v72'); ob.unobserve(entry.target); }
          });
        },{rootMargin:'180px 0px', threshold:.05});
        sections.forEach(function(sec){ if(!sec.classList.contains('is-loaded-v72')) ob.observe(sec); });
      }else sections.forEach(function(sec){ sec.classList.add('is-loaded-v72'); });
    }
    // 多终端进入兜底：触屏设备保留滑动进入；桌面设备保留鼠标快速移动进入；右侧入口点击不互相遮挡。
    if(document.body.classList.contains('entry-page')){
      document.documentElement.classList.toggle('entry-touch-device-v72', matchMedia('(pointer:coarse)').matches);
      var card=document.querySelector('.entry-minimal-card,.entry-card,.scratch-card');
      if(card){ card.style.touchAction='pan-y'; }
    }
  });
})();


/* ================= V73：最终默认主题、性能与背景速度修复 ================= */
(function initV73ThemeAndPerformanceFinal(){
  'use strict';
  var root=document.documentElement;
  function configuredDefault(){
    try{
      var v=window.SITE_DATA && window.SITE_DATA.site && window.SITE_DATA.site.defaultTheme;
      return v === 'dark' ? 'dark' : 'light';
    }catch(_){ return 'light'; }
  }
  function readSession(){
    try{
      var v=sessionStorage.getItem('zw-theme-session-v73');
      return (v === 'dark' || v === 'light') ? v : '';
    }catch(_){ return ''; }
  }
  function applyThemeV73(theme){
    theme = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', theme);
    root.dataset.theme = theme;
    var btn=document.getElementById('themeToggle');
    if(btn){
      btn.dataset.mode=theme;
      btn.setAttribute('aria-label', theme === 'dark' ? '切换为白天模式' : '切换为黑夜模式');
    }
  }
  function initialApply(){ applyThemeV73(readSession() || configuredDefault()); }
  var downTheme='';
  document.addEventListener('pointerdown',function(e){
    if(e.target && e.target.closest && e.target.closest('#themeToggle')) downTheme=root.getAttribute('data-theme') || configuredDefault();
  },true);
  document.addEventListener('click',function(e){
    var btn=e.target && e.target.closest && e.target.closest('#themeToggle');
    if(!btn) return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation) e.stopImmediatePropagation();
    var start=(downTheme === 'dark' || downTheme === 'light') ? downTheme : (root.getAttribute('data-theme') || configuredDefault());
    var next=start === 'dark' ? 'light' : 'dark';
    try{ sessionStorage.setItem('zw-theme-session-v73', next); }catch(_){ }
    applyThemeV73(next);
    downTheme='';
  },true);
  initialApply();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initialApply,{once:true}); else setTimeout(initialApply,0);

  // 低性能/触屏环境降低高频效果，保留核心视觉。
  function applyPerfClass(){
    var touch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    var small = window.innerWidth < 760 || window.innerHeight < 520;
    root.classList.toggle('v73-low-motion', !!(touch || small));
  }
  applyPerfClass();
  window.addEventListener('resize',function(){ requestAnimationFrame(applyPerfClass); },{passive:true});
})();


