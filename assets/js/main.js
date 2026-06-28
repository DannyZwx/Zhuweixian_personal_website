/* Zhuweixian HR Website V85 bootstrap.
   保持旧版脚本执行顺序不变：此文件只负责按顺序加载拆分后的模块。 */
(function(){
  var parts = [
  "00-core-rendering-v05.js",
  "10-render-modal-games-v06-v24.js",
  "20-background-theme-duration-v28-v43.js",
  "30-entry-navigation-stability-v44-v56.js",
  "40-media-layout-resume-v60-v73.js",
  "50-configuration-audio-final-v76-v81.js"
];
  var current = document.currentScript;
  var base = current && current.src ? current.src.replace(/\/main\.js(?:\?.*)?$/, '/') : './assets/js/';
  var moduleBase = base + 'modules/';
  function safeSrc(name){ return moduleBase + encodeURI(name); }
  if (document.readyState === 'loading') {
    for (var i = 0; i < parts.length; i += 1) {
      document.write('<script src="' + safeSrc(parts[i]) + '"><\/script>');
    }
  } else {
    // 兜底：若未来被改成 async/defer，也按顺序串行加载，避免覆盖层乱序。
    parts.reduce(function(p, name){
      return p.then(function(){ return new Promise(function(resolve, reject){
        var s = document.createElement('script');
        s.src = safeSrc(name);
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      }); });
    }, Promise.resolve()).catch(function(err){ console.error('V85 module load failed', err); });
  }
})();
