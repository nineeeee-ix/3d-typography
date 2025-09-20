const FALLBACKS = [
    'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/FlightHelmet/glTF-Binary/FlightHelmet.glb',
    'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/BoomBox/glTF-Binary/BoomBox.glb'
    ];
    
    
    function showStatus(msg, persistent = false){
    const el = document.getElementById('model-status');
    if(!el) return;
    el.textContent = msg;
    el.style.display = 'flex';
    if(!persistent){
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(()=>{ el.style.display = 'none'; }, 4000);
    }
    }
    
    
    function hideStatus(){
    const el = document.getElementById('model-status');
    if(el){ el.style.display = 'none'; }
    }
    
    
    function handleModelError(event){
    const mv = event.target;
    console.error('model-viewer error', event, event.detail);
    mv._attempts = (mv._attempts || 0) + 1;
    
    
    if(event.detail && event.detail?.message){
    showStatus('Model error: ' + event.detail.message);
    } else {
    showStatus('Model failed to load (texture or CORS issue). Attempting fallback...');
    }
    
    
    const fallback = FALLBACKS[mv._attempts - 1];
    if(fallback){
    console.warn(`Attempting fallback #${mv._attempts} -> ${fallback}`);
    mv.setAttribute('data-previous-src', mv.getAttribute('src') || '');
    mv.setAttribute('src', fallback);
    showStatus(`Attempting fallback model (${mv._attempts}/${FALLBACKS.length})...`);
    } else {
    console.error('All fallbacks exhausted for model-viewer', mv);
    showStatus('Could not load model textures. Displaying placeholder.', true);
    mv.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.className = 'model-placeholder';
    placeholder.innerHTML = `<div style="text-align:center;padding:18px"><strong style="display:block;margin-bottom:8px">Preview unavailable</strong><div style="color:var(--muted);font-size:13px;max-width:380px;margin:0 auto">The model referenced textures that couldn't be loaded (possible CORS or missing files). Provide a glb with embedded textures or allow CORS for external texture files. See the console for technical details.</div></div>`;
    mv.parentElement.appendChild(placeholder);
    }
    }
    
    
    function handleModelLoad(event){
    const mv = event.target;
    mv._attempts = 0;
    hideStatus();
    const placeholder = mv.parentElement.querySelector('.model-placeholder');
    if(placeholder){ placeholder.remove(); mv.style.display = ''; }
    }
    function safeSetModel(url){
        const main = document.getElementById('main-model');
        if(!main) return;
        main._attempts = 0;
        showStatus('Loading model...');
        main.setAttribute('src', url);
        try{ if(typeof main.play === 'function') main.play(); } catch(e){ }
        }
        
        
        window.addEventListener('load', ()=>{
        const viewers = document.querySelectorAll('model-viewer');
        viewers.forEach(mv => {
        mv.dataset.originalSrc = mv.getAttribute('src') || '';
        mv.addEventListener('error', handleModelError);
        mv.addEventListener('load', handleModelLoad);
        });
        
        
        const models = [
        'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
        'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
        'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb'
        ];
        let idx = 0;
        window.addEventListener('keydown', (e)=>{
        if(e.key === 'ArrowRight'){ idx = (idx+1)%models.length; safeSetModel(models[idx]); }
        if(e.key === 'ArrowLeft'){ idx = (idx-1+models.length)%models.length; safeSetModel(models[idx]); }
        });
        });