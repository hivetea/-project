/* ── Ref-based Lucide icon (avoids React reconciler conflict) ── */
function Ico({ n, s }) {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    if (!ref.current || !window.lucide) return;
    const wrap = document.createElement('div');
    const el = document.createElement('i');
    el.setAttribute('data-lucide', n);
    wrap.appendChild(el);
    lucide.createIcons({ nodes: [wrap] });
    const svg = wrap.querySelector('svg');
    if (svg) { ref.current.innerHTML = ''; ref.current.appendChild(svg); }
  }, [n]);
  return <span ref={ref} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...s }} />;
}




/**
 * A3 Header — responsive.
 * compact=true  → 48px mobile bar (logo + live dot + clock)
 * compact=false → 60px desktop bar (logo + nav + status + controls)
 */
function Header({ clock, compact = false }) {
  const { StatusBadge } = window.A3MaritimeIntelligenceDesignSystem_4ef093;

  /* ── Mobile / Compact ────────────────────────────────────── */
  if (compact) {
    return (
      <header style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 16px', height: 48, flexShrink: 0,
        background: 'var(--surface-panel)',
        borderBottom: '1px solid var(--border-subtle)',
        zIndex: 30,
      }}>
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            position: 'relative', width: 32, height: 32,
            borderRadius: 8,
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--glow-accent)',
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>A3</span>
            <span style={{ position: 'absolute', left: 4, right: 4, bottom: 4, height: 2, borderRadius: 2, background: 'var(--danger-scale)' }}></span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>海象情報</span>
        </div>

        {/* Right: live status + clock */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--ok)', display: 'inline-block',
              animation: 'a3-pulse 2s var(--ease-out) infinite',
            }}></span>
            <span style={{ fontSize: 11, color: 'var(--ok-text)', fontWeight: 600, letterSpacing: '0.04em' }}>即時</span>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 12,
            color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums',
          }}>{clock}</span>
        </div>
      </header>
    );
  }

  /* ── Desktop ─────────────────────────────────────────────── */
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '0 var(--space-6)', height: 60, flexShrink: 0,
      background: 'var(--surface-panel)',
      borderBottom: '1px solid var(--border-subtle)',
      zIndex: 30,
    }}>
      {/* Logo mark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          position: 'relative', width: 38, height: 38,
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface-raised)',
          border: '1px solid var(--border-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--glow-accent)',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>A3</span>
          <span style={{ position: 'absolute', left: 6, right: 6, bottom: 5, height: 2.5, borderRadius: 2, background: 'var(--danger-scale)' }}></span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.01em' }}>A3 海象 RAG 智慧情報</span>
          <span style={{ fontSize: 10, letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-faint)' }}>海象地圖 · Smart Maritime Intel</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 28 }}>
        {[['作業總覽', true], ['海象預報', false], ['規則庫', false], ['觀測站', false]].map(([t, active]) => (
          <span key={t} style={{
            padding: '7px 14px', fontSize: 'var(--text-sm)',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer',
            color: active ? 'var(--text-primary)' : 'var(--text-muted)',
            background: active ? 'var(--surface-raised)' : 'transparent',
            fontWeight: active ? 600 : 400,
            transition: 'all var(--dur-fast) var(--ease-out)',
          }}>{t}</span>
        ))}
      </nav>

      {/* Right controls */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums',
        }}>{clock} <span style={{ color: 'var(--text-faint)' }}>UTC+8</span></span>
        <StatusBadge label="AI 引擎" status="上線" tone="ok" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}>
            <Ico n="bell" s={{ width: 17, height: 17 }} />
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}>
            <Ico n="settings" s={{ width: 17, height: 17 }} />
          </button>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-default)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text-secondary)', fontWeight: 600,
          }}>OC</div>
        </div>
      </div>
    </header>
  );
}





/**
 * GeospatialCanvas — dark-grid tactical map.
 * Clicking / tapping a sector node selects it.
 * mobile=true  → larger tap targets (44px+), simplified legend
 */

/* ── PHYSICS ENGINE INJECTED FROM MAIN.JS ── */
window.physicsEngineBooted = false;
window.baseEpicenters = [];
window.trueCoastlineRing = [];
window.globalDeepSeaNodes = [];
window.physicsMarkers = [];

function isPointInPolygon(point, vs) {
    let x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i][0], yi = vs[i][1];
        let xj = vs[j][0], yj = vs[j][1];
        let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function simulateMarineConditionsIDW(lat, lng) {
    let sumWeight = 0; let sumWaveHeight = 0; let sumWindSpeed = 0; let sumDanger = 0;
    const p = 2;
    for (let i = 0; i < window.baseEpicenters.length; i++) {
        const ep = window.baseEpicenters[i];
        const distSq = Math.pow(ep.lat - lat, 2) + Math.pow(ep.lng - lng, 2);
        if (distSq < 0.0000001) return { wave_height: ep.wave_height, wind_speed: ep.wind_speed, danger_score: ep.danger_score };
        const dist = Math.sqrt(distSq); const w = 1.0 / Math.pow(dist, p);
        sumWeight += w; sumWaveHeight += ep.wave_height * w; sumWindSpeed += ep.wind_speed * w; sumDanger += ep.danger_score * w;
    }
    if (sumWeight === 0) return { wave_height: 0, wind_speed: 0, danger_score: 0 };
    return { wave_height: sumWaveHeight / sumWeight, wind_speed: sumWindSpeed / sumWeight, danger_score: sumDanger / sumWeight };
}

async function loadCoastlinePolygon() {
    try {
        const res = await fetch('taiwan_coastline.json');
        window.trueCoastlineRing = await res.json();
    } catch(err) { console.error("Coastline load failed", err); }
}

async function fetchDeepOceanData() {
    const lats = []; const lngs = [];
    for (let lat = 21.0; lat <= 26.0; lat += 0.08) {
        for (let lng = 119.0; lng <= 123.0; lng += 0.08) {
            let minDistSq = Infinity;
            if (window.trueCoastlineRing.length > 0) {
                window.trueCoastlineRing.forEach(c => {
                    const d = Math.pow(c[1]-lat, 2) + Math.pow(c[0]-lng, 2);
                    if (d < minDistSq) minDistSq = d;
                });
            } else { minDistSq = Math.pow(lat-23.7, 2)+Math.pow(lng-121.0, 2); }
            const hexOff = (Math.round(lat/0.08)%2 === 0)?0:0.04;
            const finalLng = lng+hexOff;
            const inside = window.trueCoastlineRing.length > 0 && isPointInPolygon([finalLng,lat], window.trueCoastlineRing);
            if (!inside && minDistSq > 0.0005) { lats.push(lat.toFixed(3)); lngs.push(finalLng.toFixed(3)); }
        }
    }
    if (lats.length===0) return;
    const chunkSize=90; const promises=[];
    for(let i=0; i<lats.length; i+=chunkSize){
        const bLat=lats.slice(i,i+chunkSize); const bLng=lngs.slice(i,i+chunkSize);
        const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${bLat.join(',')}&longitude=${bLng.join(',')}&current=wave_height,wave_direction,ocean_current_velocity,ocean_current_direction`;
        promises.push(fetch(url).then(r=>r.json()).then(data=>({data, bLat, bLng})));
    }
    try {
        const responses = await Promise.all(promises);
        responses.forEach(({data, bLat, bLng}) => {
            const arr = Array.isArray(data)?data:[data];
            arr.forEach((o,i)=>{
                if(!o.current)return;
                window.globalDeepSeaNodes.push({ lat:parseFloat(bLat[i]), lng:parseFloat(bLng[i]), wh:o.current.wave_height||1.0, wd:o.current.wave_direction||0, cv:o.current.ocean_current_velocity||0 });
            });
        });
    } catch(err) { console.error("OM Fetch failed", err); }
}

function drawUnifiedCoastline(map) {
    if(window.trueCoastlineRing.length===0)return;
    const step=Math.max(1,Math.ceil(window.trueCoastlineRing.length/600));
    const sampled=[];
    for(let i=0; i<window.trueCoastlineRing.length; i+=step) sampled.push(window.trueCoastlineRing[i]);
    sampled.forEach((coord, i)=>{
        const lng=coord[0]; const lat=coord[1];
        const prev = sampled[i===0?sampled.length-1:i-1];
        const next = sampled[(i+1)%sampled.length];
        const dy=next[1]-prev[1]; const dx=next[0]-prev[0];
        let normalRad = Math.atan2(dy, dx) + (Math.PI/2);
        const cDy=23.7-lat; const cDx=121.0-lng; const cRad=Math.atan2(cDy,cDx);
        if(Math.cos(normalRad)*Math.cos(cRad)+Math.sin(normalRad)*Math.sin(cRad)<0) normalRad-=Math.PI;
        
        const fLat = lat - Math.sin(normalRad)*0.005;
        const fLng = lng - Math.cos(normalRad)*0.005;
        
        const sim = simulateMarineConditionsIDW(fLat, fLng);
        let fWh = sim.wave_height; let fDs = sim.danger_score;
        let cSwell=0; let hImpact=0;
        window.globalDeepSeaNodes.forEach(node=>{
            const dSq = Math.pow(node.lat-fLat,2)+Math.pow(node.lng-fLng,2);
            if(dSq<0.15) {
                const mFr = (90-(node.wd+180))*Math.PI/180;
                const dp = Math.cos(mFr)*Math.cos(normalRad) + Math.sin(mFr)*Math.sin(normalRad);
                if(dp>0.4){
                    const impact = node.wh*dp;
                    if(impact>hImpact){ hImpact=impact; cSwell=impact; }
                }
            }
        });
        
        let st = `狀態: <b style="color: #0ff;">局部風浪</b>`;
        if(cSwell>0){ fWh+=(cSwell*0.8); fDs+=(cSwell*4.0); st=`狀態: <b style="color: #ff3300;">⚠️ 偵測到外海湧浪碰撞</b>`; }
        const rot = -(normalRad*180/Math.PI)-90;
        const bW=12+(fWh*2.5); const bH=12+(fWh*2.5);
        const color = window.dangerColor(fDs);
        const flow = Math.max(0.6, 2.5-(sim.wind_speed*0.05));
        
        const html = `
            <div style="width:100%; height:100%; transform:rotate(${rot}deg); display:flex; align-items:center; justify-content:center;">
                <svg width="100%" height="100%" viewBox="-50 -50 100 100">
                    <g stroke="${color}" stroke-width="0.5" stroke-linecap="round" fill="none">
                        <path d="M-40 0 Q -20 -15, 0 0 T 40 0">
                            <animateTransform attributeName="transform" type="translate" from="0,-30" to="0,30" dur="${flow}s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.55;0.55;0" keyTimes="0;0.2;0.8;1" dur="${flow}s" repeatCount="indefinite" />
                        </path>
                    </g>
                </svg>
            </div>
        `;
        const ic = L.divIcon({ html, className:'custom-wave-icon', iconSize:[bW,bH], iconAnchor:[bW/2,bH/2] });
        const m = L.marker([fLat,fLng], {icon:ic}).addTo(map);
        window.physicsMarkers.push({ layer:m, bW, bH });
    });
}

function drawDeepOceanGrid(map) {
    window.globalDeepSeaNodes.forEach(node => {
        let rot=node.wd; let pSt="自由流動";
        let cDist=Infinity; let cIdx=-1; let cPt=null;
        window.trueCoastlineRing.forEach((c,i)=>{
            const d=Math.pow(c[1]-node.lat,2)+Math.pow(c[0]-node.lng,2);
            if(d<cDist){ cDist=d; cPt=c; cIdx=i; }
        });
        if(cDist<0.3){
            const prev=window.trueCoastlineRing[cIdx===0?window.trueCoastlineRing.length-1:cIdx-1];
            const next=window.trueCoastlineRing[(cIdx+1)%window.trueCoastlineRing.length];
            const tR=Math.atan2(next[1]-prev[1], next[0]-prev[0]);
            let nR=tR+(Math.PI/2);
            const cR=Math.atan2(23.7-cPt[1], 121.0-cPt[0]);
            if(Math.cos(nR)*Math.cos(cR)+Math.sin(nR)*Math.sin(cR)<0) nR-=Math.PI;
            const mFr=(90-(node.wd+180))*Math.PI/180;
            const dp=Math.cos(mFr)*Math.cos(nR)+Math.sin(mFr)*Math.sin(nR);
            if(dp>0.15){
                pSt="受海岸線偏折";
                const d1=Math.cos(mFr)*Math.cos(tR)+Math.sin(mFr)*Math.sin(tR);
                const d2=Math.cos(mFr)*Math.cos(tR+Math.PI)+Math.sin(mFr)*Math.sin(tR+Math.PI);
                const fF = d1>d2?tR:(tR+Math.PI);
                rot=-(fF*180/Math.PI)-90;
            }
        }
        const bW=9+(node.wh*2.0); const bH=9+(node.wh*2.0);
        let color = window.dangerColor(node.wh*3.0);
        if(pSt!=="自由流動") color = window.dangerColor(node.wh*3.0+2.0);
        const flow=Math.max(0.6, 5.0-(node.cv*2));
        
        let fadeMult = 1.0;
        if (cDist < 0.015) { fadeMult = Math.max(0, (cDist - 0.0005) / 0.0145); }
        if (fadeMult <= 0.05) return;
        const opPeak = (0.55 * fadeMult).toFixed(2);
        
        const html = `
            <div style="width:100%; height:100%; transform:rotate(${rot}deg); display:flex; align-items:center; justify-content:center;">
                <svg width="100%" height="100%" viewBox="-50 -50 100 100">
                    <g stroke="${color}" stroke-width="0.25" stroke-linecap="round" fill="none">
                        <path d="M-40 0 Q -20 -15, 0 0 T 40 0">
                            <animateTransform attributeName="transform" type="translate" from="0,-30" to="0,30" dur="${flow}s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;${opPeak};${opPeak};0" keyTimes="0;0.2;0.8;1" dur="${flow}s" repeatCount="indefinite" />
                        </path>
                    </g>
                </svg>
            </div>
        `;
        const ic = L.divIcon({ html, className:'custom-wave-icon', iconSize:[bW,bH], iconAnchor:[bW/2,bH/2] });
        const m = L.marker([node.lat,node.lng], {icon:ic}).addTo(map);
        window.physicsMarkers.push({ layer:m, bW, bH });
    });
}

window.bootEngine = async function(map) {
    if(window.physicsEngineBooted) return;
    window.physicsEngineBooted = true;
    try {
        const res = await fetch('coastal_stations.json');
        const raw = await res.json();
        raw.forEach(s=>{
            try {
                const c = s.GeoInfo.Coordinates.find(x=>x.CoordinateName==='WGS84');
                const lat=parseFloat(c.StationLatitude); const lng=parseFloat(c.StationLongitude);
                let w = parseFloat(s.WeatherElement.WindSpeed); if(isNaN(w)||w<0)w=3.0;
                let wh = 0.22*(Math.pow(w,2)/9.81); if(wh<0.2)wh=0.2;
                const d = Math.min(10.0, wh*3.5);
                window.baseEpicenters.push({lat,lng,wind_speed:w, wave_height:wh, danger_score:d});
            } catch(e){}
        });
        await loadCoastlinePolygon();
        await fetchDeepOceanData();
        // drawUnifiedCoastline(map); // Faded out entirely near coast
        drawDeepOceanGrid(map);
        
        // Setup strict scaling
        map.on('zoom', () => {
            const scale = Math.pow(2, map.getZoom() - 7);
            window.physicsMarkers.forEach(m => {
                const icon = m.layer._icon;
                if(icon){
                    const nw = m.bW*scale; const nh = m.bH*scale;
                    icon.style.width=nw+'px'; icon.style.height=nh+'px';
                    icon.style.marginLeft=-(nw/2)+'px'; icon.style.marginTop=-(nh/2)+'px';
                }
            });
        });
    } catch(e){ console.error("Boot failed", e); }
};
/* ── END PHYSICS ENGINE ── */


function GeospatialCanvas({ sectors, selectedId, onSelect, scanning, mobile = false }) {
  const { Badge } = window.A3MaritimeIntelligenceDesignSystem_4ef093;
  const containerRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const markersRef = React.useRef({});
  const ringsRef = React.useRef(null);

  React.useEffect(() => {
    if (!containerRef.current || mapRef.current || !window.L) return;
    
    const map = L.map(containerRef.current, {
      center: [23.7, 121.0], zoom: 7, zoomControl: false, attributionControl: false
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 20 }).addTo(map);
    mapRef.current = map;
    
    window.bootEngine(map);
    
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  React.useEffect(() => {
    if (!mapRef.current || !window.L) return;
    const map = mapRef.current;
    
    sectors.forEach(s => {
       const mLat = s.coord.match(/([\d.]+)°N/);
       const mLng = s.coord.match(/([\d.]+)°E/);
       if(!mLat || !mLng) return;
       const lat = parseFloat(mLat[1]); const lng = parseFloat(mLng[1]);
       
       const isSel = s.id === selectedId;
       const DOT = mobile ? (isSel ? 22 : 18) : (isSel ? 18 : 13);
       const color = window.dangerColor(s.danger);
       
       const html = `
         <div style="position:relative; width:${DOT}px; height:${DOT}px; display:flex; align-items:center; justify-content:center;">
            <div style="
              width:${DOT}px; height:${DOT}px; border-radius:50%;
              background:${color}; box-shadow:0 0 ${isSel?20:10}px ${color};
              border: ${isSel ? '2.5px solid #020617' : '2px solid rgba(2,6,23,0.55)'};
              ${s.danger >= 7.5 ? 'animation: a3-breathe 1.8s ease-out infinite;' : ''}
            "></div>
            <div style="
              position:absolute; top:100%; margin-top:4px;
              font-family:monospace; font-size:${mobile?11:10}px;
              white-space:nowrap; padding:2px 6px; border-radius:4px;
              background:rgba(2,6,23,0.75); color:${isSel?'#fff':'#94a3b8'};
              border:1px solid ${isSel?'rgba(34,211,238,0.5)':'transparent'};
              backdrop-filter:blur(4px); pointer-events:none;
            ">${s.name}</div>
         </div>
       `;
       
       if (markersRef.current[s.id]) {
          const m = markersRef.current[s.id];
          m.setIcon(L.divIcon({ className: '', html, iconSize: [DOT, DOT], iconAnchor: [DOT/2, DOT/2] }));
          m.off('click');
          m.on('click', () => onSelect(s.id));
       } else {
          const m = L.marker([lat, lng], {
            icon: L.divIcon({ className: '', html, iconSize: [DOT, DOT], iconAnchor: [DOT/2, DOT/2] }),
            zIndexOffset: 1000
          }).addTo(map);
          m.on('click', () => onSelect(s.id));
          markersRef.current[s.id] = m;
       }
    });
  }, [sectors, selectedId, mobile]);

  // Radar Rings
  React.useEffect(() => {
    if(!mapRef.current || !window.L) return;
    const map = mapRef.current;
    if(scanning) {
       if(!ringsRef.current) {
         const html = `
           <div style="position:relative; width:0; height:0;">
             ${[0,1,2].map(i => `<span style="
               position:absolute; left:50%; top:50%; width:220px; height:220px; margin-left:-110px; margin-top:-110px;
               border-radius:50%; border:1.5px solid rgba(34,211,238,0.45);
               animation: a3-radar 3.6s ease-out ${i * 1.2}s infinite;
             "></span>`).join('')}
           </div>
         `;
         const m = L.marker([23.7, 121.0], {
           icon: L.divIcon({ className:'', html, iconSize:[0,0] }),
           interactive: false,
           zIndexOffset: -100
         }).addTo(map);
         ringsRef.current = m;
       }
    } else {
       if(ringsRef.current) { ringsRef.current.remove(); ringsRef.current = null; }
    }
  }, [scanning]);

  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 0, borderRadius: mobile ? 0 : 'var(--radius-lg)', overflow: 'hidden', border: mobile ? 'none' : '1px solid var(--border-subtle)' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', background: '#020617' }} />
      
      {/* Live scan badge */}
      <div style={{ position: 'absolute', left: 14, top: 14, zIndex: 400 }}>
        <Badge tone={scanning ? 'cyan' : 'accent'} dot uppercase>
          {scanning ? '掃描區段中…' : '即時 · 115 觀測站'}
        </Badge>
      </div>

      {/* Critical hazard callout */}
      <div style={{ position: 'absolute', right: 14, top: 14, zIndex: 400 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px',
          background: 'rgba(244,63,94,0.14)', border: '1px solid var(--crit-border)',
          borderRadius: 'var(--radius-full)', backdropFilter: 'blur(6px)', boxShadow: 'var(--glow-crit)'
        }}>
          <Ico n="triangle-alert" s={{ width: 13, height: 13, color: 'var(--crit-text)' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--crit-text)', whiteSpace: 'nowrap' }}>瘋狗浪危險區</span>
        </div>
      </div>

      {/* Zoom controls */}
      <div style={{ position: 'absolute', right: 14, bottom: mobile ? 14 : 80, display: 'flex', flexDirection: 'column', gap: 1, zIndex: 400 }}>
        <button aria-label="放大" onClick={() => mapRef.current?.zoomIn()} style={{
          width: mobile ? 40 : 32, height: mobile ? 40 : 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--glass-bg)', backdropFilter: 'blur(8px)', color: 'var(--text-secondary)',
          border: '1px solid var(--border-glass)', cursor: 'pointer', borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0'
        }}><Ico n="plus" s={{ width: 15, height: 15 }} /></button>
        <button aria-label="縮小" onClick={() => mapRef.current?.zoomOut()} style={{
          width: mobile ? 40 : 32, height: mobile ? 40 : 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--glass-bg)', backdropFilter: 'blur(8px)', color: 'var(--text-secondary)',
          border: '1px solid var(--border-glass)', cursor: 'pointer', borderRadius: '0 0 var(--radius-sm) var(--radius-sm)'
        }}><Ico n="minus" s={{ width: 15, height: 15 }} /></button>
      </div>

      {/* Danger legend */}
      {!mobile && (
        <div className="a3-glass" style={{
          position: 'absolute', left: 14, bottom: 14, padding: '12px 14px', width: 224, borderRadius: 'var(--radius-md)', zIndex: 400
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>危險指數 0–10</div>
          <div style={{ height: 8, borderRadius: 'var(--radius-full)', background: 'var(--danger-scale)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            {[0, 2.5, 5, 7.5, 10].map(n => <span key={n} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-faint)', fontVariantNumeric: 'tabular-nums' }}>{n.toFixed(1)}</span>)}
          </div>
        </div>
      )}

      {mobile && (
        <div style={{
          position: 'absolute', left: 14, bottom: 14, padding: '8px 12px', background: 'rgba(2,6,23,0.75)', backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-glass)', borderRadius: 10, zIndex: 400, display: 'flex', alignItems: 'center', gap: 10
        }}>
          <div style={{ width: 80, height: 6, borderRadius: 3, background: 'var(--danger-scale)' }}></div>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>危險 0–10</span>
        </div>
      )}
    </div>
  );
}






/**
 * TelemetryRail — real-time stats + sector watchlist.
 * mobile=true  → full-page vertical card layout (used in mobile panel view)
 * mobile=false → narrow sidebar column (desktop)
 */
function TelemetryRail({ sector, sectors, selectedId, onSelect, mobile = false }) {
  const { Card, TelemetryStat, RiskMeter, Badge } = window.A3MaritimeIntelligenceDesignSystem_4ef093;


  const waveWarn = parseFloat(sector.waves) >= 3;

  const containerStyle = mobile
    ? { display: 'flex', flexDirection: 'column', gap: 12 }
    : { display: 'flex', flexDirection: 'column', gap: 'var(--gap-grid)', width: 296, flexShrink: 0, overflowY: 'auto' };

  return (
    <div className={mobile ? '' : 'a3-scroll'} style={containerStyle}>

      {/* ── Live telemetry card ───────────────────────────── */}
      <Card eyebrow="即時遙測" title={sector.name} action={<Badge tone="ok" dot>即時</Badge>}>

        {/* Coordinate / station */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginTop: -4, marginBottom: 14,
          color: 'var(--text-faint)',
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
        }}>
          <Ico n="map-pin" />
          {sector.coord} · {sector.station}
        </div>

        {/* Stats 2-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: mobile ? 12 : 10 }}>
          <TelemetryStat
            label="風速"
            value={sector.wind}
            unit="節"
            detail={sector.windDir}
            icon={<Ico n="wind" />}
          />
          <TelemetryStat
            label="浪高"
            value={sector.waves}
            unit="公尺"
            tone={waveWarn ? 'warn' : 'cyan'}
            icon={<Ico n="waves" />}
          />
          <TelemetryStat
            label="潮汐"
            value={sector.tide}
            tone="plain"
            icon={<Ico n="activity" />}
          />
          <TelemetryStat
            label="洋流"
            value={sector.current}
            unit="節"
            tone="accent"
            icon={<Ico n="navigation" />}
          />
        </div>

        {/* Risk meter */}
        <div style={{ marginTop: 18 }}>
          <RiskMeter value={sector.danger} label="翻覆風險指數" />
        </div>
      </Card>

      {/* ── Sector watchlist ─────────────────────────────── */}
      <Card eyebrow="區段監視" title="海岸網格" padding="var(--pad-card)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? 10 : 8 }}>
          {sectors.map((s) => {
            const isSel = s.id === selectedId;
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', minHeight: mobile ? 52 : 44,
                  padding: mobile ? '12px 14px' : '9px 12px',
                  cursor: 'pointer', textAlign: 'left',
                  background: isSel ? 'var(--accent-soft)' : 'transparent',
                  border: `1px solid ${isSel ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--dur-fast) var(--ease-out)',
                }}
              >
                {/* Status dot */}
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: s.color,
                  boxShadow: `0 0 8px ${s.color}`,
                  flexShrink: 0,
                  animation: s.danger >= 7.5 ? 'a3-breathe 1.8s var(--ease-out) infinite' : 'none',
                }} />
                {/* Name */}
                <span style={{
                  flex: 1, minWidth: 0,
                  color: isSel ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: mobile ? 14 : 'var(--text-sm)',
                  fontWeight: isSel ? 600 : 400,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{s.name}</span>
                {/* Score */}
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: mobile ? 16 : 'var(--text-sm)',
                  fontWeight: 700,
                  color: s.color,
                  fontVariantNumeric: 'tabular-nums',
                }}>{s.danger.toFixed(1)}</span>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}





/**
 * RagFeed — RAG retrieval stream + AI recommendation.
 * mobile=true → full-page layout, recommendation first (most important info at top)
 */
function RagFeed({ sector, scanning, onRerun, mobile = false }) {
  const { Card, Alert, RuleMatch, Button, Badge } = window.A3MaritimeIntelligenceDesignSystem_4ef093;

  const rules = sector.rules || [];

  const recTone = sector.danger >= 7.5 ? 'crit' : sector.danger >= 5 ? 'warn' : 'recommend';

  const containerStyle = mobile
    ? { display: 'flex', flexDirection: 'column', gap: 12 }
    : { display: 'flex', flexDirection: 'column', gap: 'var(--gap-grid)', width: 352, flexShrink: 0, overflowY: 'auto' };

  return (
    <div className={mobile ? '' : 'a3-scroll'} style={containerStyle}>

      {/* ── On mobile: show AI recommendation FIRST (most actionable) ── */}
      {mobile && !scanning && (
        <Alert
          tone={recTone}
          eyebrow="AI 建議 · LLM 綜合研判"
          title={sector.rec.title}
          icon={<Ico n="navigation" />}
          action={<>
            <Button size="sm" variant="primary">確認</Button>
            <Button size="sm" variant="ghost">發布警報</Button>
          </>}
        >
          {sector.rec.body}
        </Alert>
      )}

      {/* ── RAG retrieval card ──────────────────────────────────── */}
      <Card
        eyebrow="航海日誌 · 向量檢索"
        title="RAG 推論串流"
        action={
          <Button
            size="sm"
            variant="secondary"
            icon={<Ico n="refresh-cw" s={{ width: 13, height: 13 }} />}
            onClick={onRerun}
          >
            重新檢索
          </Button>
        }
        bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        {/* Query echo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 12px',
          background: 'var(--surface-base)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
        }}>
          <Ico n="search" s={{ width: 13, height: 13, color: 'var(--data-cyan)' }} />
          <span style={{ color: 'var(--text-secondary)', marginRight: 4 }}>查詢:</span>
          風 {sector.windDir.split(' ')[0]} {sector.wind}節 · {sector.tide} · {sector.waves}公尺
        </div>

        {/* Scan sweep or stats row */}
        {scanning ? (
          <div style={{ position: 'relative', height: 3, borderRadius: 'var(--radius-full)', background: 'var(--surface-raised)', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, width: '33%',
              background: 'linear-gradient(90deg,transparent,var(--data-cyan),transparent)',
              animation: 'a3-sweep 1.1s linear infinite',
            }} />
          </div>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)',
          }}>
            <span>檢索到 {rules.length} 條規則</span>
            <span>top-k=3 · ef=128 · 0.18s</span>
          </div>
        )}

        {/* Matched rules */}
        {!scanning && rules.map((r, i) => (
          <RuleMatch
            key={r.id}
            ruleId={r.id}
            text={r.text}
            similarity={r.sim}
            tone={r.tone}
            source={r.src}
            index={i + 1}
            latency={r.latency}
          />
        ))}
      </Card>

      {/* ── Desktop: recommendation at bottom ───────────────────── */}
      {!mobile && !scanning && (
        <Alert
          tone={recTone}
          eyebrow="AI 建議 · LLM 綜合研判"
          title={sector.rec.title}
          icon={<Ico n="navigation" />}
          action={<>
            <Button size="sm" variant="primary">確認</Button>
            <Button size="sm" variant="ghost">發布警報</Button>
          </>}
        >
          {sector.rec.body}
        </Alert>
      )}
    </div>
  );
}



/* dangerColor — inline copy (camelCase not exposed on DS namespace) */
function dangerColor(score) {
  const stops = [
    { v: 0.0,  c: [20,  100, 255] },
    { v: 2.5,  c: [0,   255, 255] },
    { v: 5.0,  c: [255, 255,   0] },
    { v: 7.5,  c: [255, 140,   0] },
    { v: 10.0, c: [255,  30,  30] },
  ];
  const s = Math.max(0, Math.min(10, score));
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (s >= stops[i].v && s <= stops[i + 1].v) { lo = stops[i]; hi = stops[i + 1]; break; }
  }
  const t = hi.v === lo.v ? 0 : (s - lo.v) / (hi.v - lo.v);
  const ch = (k) => Math.round(lo.c[k] + (hi.c[k] - lo.c[k]) * t);
  return `rgb(${ch(0)},${ch(1)},${ch(2)})`;
}

/* ══════════════════════════════════════════════════════════
   SECTOR DATA — CWA coastal stations around Taiwan
   ══════════════════════════════════════════════════════════ */
const RAW_SECTORS = [
  {
    id: 'pengjia', name: '彭佳嶼', station: 'C0PJ01', coord: '25.63°N 122.08°E',
    x: 64, y: 24, danger: 7.4,
    wind: '8.5', windDir: '東北 · 陣風 11.2', waves: '3.2', tide: '退潮', current: '1.4',
    rules: [
      { id: '規則 #042', sim: 0.94, tone: 'crit', src: 'CWA-2019-PJ', latency: '0.18s', text: '東北風 > 7 節 + 退潮 = 12 公尺以下船舶翻覆風險偏高。' },
      { id: '規則 #017', sim: 0.88, tone: 'warn', src: 'CMS-SWELL-7', latency: '0.21s', text: '40 公里內偵測到外海湧浪碰撞 — 80% 動能轉移至海岸。' },
      { id: '規則 #103', sim: 0.79, tone: 'cyan', src: 'IDW-PM-SPEC', latency: '0.24s', text: 'Pierson-Moskowitz 頻譜推算：持續東北流場確認 3 公尺以上浪場。' },
    ],
    rec: { title: '延後出港 3–6 小時', body: '彭佳嶼外海東北湧浪與退潮洋流碰撞，使 12 公尺以下船舶翻覆風險升至「高」。建議小型船舶留港；於 18:00（UTC+8）重新評估。' },
  },
  {
    id: 'sandiao', name: '三貂角', station: 'C0A970', coord: '25.01°N 122.00°E',
    x: 58, y: 40, danger: 5.2,
    wind: '6.1', windDir: '東北東 · 陣風 8.4', waves: '2.4', tide: '平潮', current: '0.9',
    rules: [
      { id: '規則 #028', sim: 0.86, tone: 'warn', src: 'CWA-2021-SD', latency: '0.19s', text: '東北東 5–7 節 + 平潮 = 岬角附近中等浪群；持續監測波浪週期。' },
      { id: '規則 #061', sim: 0.74, tone: 'cyan', src: 'IDW-PM-SPEC', latency: '0.22s', text: '岬角繞射在三貂角聚集波浪能量。' },
    ],
    rec: { title: '岬角周邊注意', body: '三貂角岬角因繞射形成中等浪群。12 公尺以上船舶可通行；建議小型船舶與岬角保持 0.5 浬以上距離。' },
  },
  {
    id: 'tamsui', name: '淡水觀海', station: 'C0AJ30', coord: '25.18°N 121.41°E',
    x: 38, y: 30, danger: 6.2,
    wind: '4.4', windDir: '西南西 · 陣風 13.5', waves: '2.7', tide: '漲潮', current: '1.1',
    rules: [
      { id: '規則 #055', sim: 0.83, tone: 'warn', src: 'CWA-2020-TS', latency: '0.20s', text: '河口逕流 + 漲潮在出海口形成交錯亂浪。' },
      { id: '規則 #019', sim: 0.71, tone: 'cyan', src: 'GUST-MODEL', latency: '0.23s', text: '陣風係數 > 持續風速 3 倍，研判颮線不穩定。' },
    ],
    rec: { title: '注意河口亂浪', body: '漲潮頂托淡水河口逕流，在出海口形成短而陡的交錯亂浪。建議於平潮時段通過；實測陣風達 13.5 節。' },
  },
  {
    id: 'houbihu', name: '後壁湖', station: 'C0R880', coord: '21.95°N 120.75°E',
    x: 30, y: 82, danger: 2.1,
    wind: '3.6', windDir: '南 · 平靜', waves: '1.2', tide: '漲潮', current: '0.5',
    rules: [
      { id: '規則 #007', sim: 0.90, tone: 'ok', src: 'CWA-2022-HB', latency: '0.16s', text: '南風 < 5 節 + 遮蔽灣澳 = 條件正常；例行作業放行。' },
    ],
    rec: { title: '海況正常', body: '南部遮蔽灣澳，輕南風，浪高 1.2 公尺。後壁湖各級船舶均可正常作業。' },
  },
  {
    id: 'jialeshui', name: '佳樂水', station: 'C0R680', coord: '21.99°N 120.85°E',
    x: 44, y: 88, danger: 4.0,
    wind: '5.5', windDir: '東南 · 陣風 9.1', waves: '2.0', tide: '退潮', current: '0.8',
    rules: [
      { id: '規則 #034', sim: 0.80, tone: 'warn', src: 'CWA-2021-JL', latency: '0.21s', text: '東南湧浪於外露礁岸在低潮時形成捲浪。' },
    ],
    rec: { title: '礁岸碎浪警示', body: '東南湧浪於退潮時撞擊佳樂水外露礁岸，預期出現捲浪。請休閒船舶遠離礁線。' },
  },
];


/* ══════════════════════════════════════════════════════════
   BOTTOM NAVIGATION (mobile only)
   ══════════════════════════════════════════════════════════ */
function BottomNav({ view, onView, alertCount }) {
  const items = [
    { id: 'map',      icon: 'map',      label: '地圖' },
    { id: 'telemetry',icon: 'activity', label: '遙測' },
    { id: 'intel',    icon: 'cpu',      label: '情報' },
    { id: 'alerts',   icon: 'bell',     label: '警報', badge: alertCount },
  ];

  return (
    <nav style={{
      flexShrink: 0,
      background: 'var(--surface-panel)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {items.map((item) => {
        const active = view === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onView(item.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 5, padding: '10px 0 8px',
              minHeight: 56,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: active ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'color 140ms ease',
              position: 'relative',
            }}
          >
            <Ico n={item.icon} s={{ width: 22, height: 22 }} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.03em' }}>{item.label}</span>
            {item.badge > 0 && (
              <span style={{
                position: 'absolute', top: 8, right: '50%', marginRight: -20,
                width: 16, height: 16, borderRadius: '50%',
                background: 'var(--crit)',
                color: 'white', fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{item.badge}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTOR FLOAT CARD — shown on map view over selected sector
   ══════════════════════════════════════════════════════════ */
function SectorFloatCard({ sector, onTelemetry }) {
  const dangerTone = sector.danger >= 7.5 ? 'var(--crit-text)' : sector.danger >= 5 ? 'var(--warn-text)' : 'var(--ok-text)';
  const dangerBg   = sector.danger >= 7.5 ? 'var(--crit-soft)'  : sector.danger >= 5 ? 'var(--warn-soft)'  : 'var(--ok-soft)';
  const dangerBdr  = sector.danger >= 7.5 ? 'var(--crit-border)': sector.danger >= 5 ? 'var(--warn-border)': 'var(--ok-border)';

  return (
    <div style={{
      position: 'absolute', bottom: 12, left: 12, right: 12,
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: '1px solid var(--border-glass)',
      borderRadius: 16,
      padding: '14px 16px',
      zIndex: 20,
      display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: 'var(--shadow-glass)',
      animation: 'panelIn 220ms var(--ease-out)',
    }}>
      {/* Danger score badge */}
      <div style={{
        width: 52, height: 52, borderRadius: 13,
        background: dangerBg,
        border: `1.5px solid ${dangerBdr}`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, gap: 1,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700,
          color: dangerTone, lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}>{sector.danger.toFixed(1)}</span>
        <span style={{ fontSize: 9, fontWeight: 600, color: dangerTone, letterSpacing: '0.06em' }}>
          {sector.danger >= 7.5 ? '高' : sector.danger >= 5 ? '中' : '低'}
        </span>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 700, color: 'var(--text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{sector.name}</div>
        <div style={{
          fontSize: 12, color: 'var(--text-muted)', marginTop: 4,
          display: 'flex', gap: 10, flexWrap: 'wrap',
        }}>
          <span>🌊 {sector.waves}m</span>
          <span>💨 {sector.wind}節</span>
          <span>〽 {sector.tide}</span>
        </div>
      </div>

      {/* Detail button */}
      <button
        onClick={onTelemetry}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--accent-soft)',
          border: '1px solid var(--border-accent)',
          cursor: 'pointer', flexShrink: 0, color: 'var(--accent)',
        }}
      >
        <Ico n="chevron-right" s={{ width: 18, height: 18 }} />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ALERTS VIEW (mobile)
   ══════════════════════════════════════════════════════════ */
function AlertsView({ sectors, onSelect, onView }) {
  const critical = sectors.filter((s) => s.danger >= 7.5);
  const warning  = sectors.filter((s) => s.danger >= 5 && s.danger < 7.5);
  const normal   = sectors.filter((s) => s.danger < 5);

  const all = [
    ...critical.map((s) => ({ ...s, tier: 'crit' })),
    ...warning.map((s)  => ({ ...s, tier: 'warn' })),
    ...normal.map((s)   => ({ ...s, tier: 'ok' })),
  ];

  const tierStyle = {
    crit: { bg: 'var(--crit-soft)',  border: 'var(--crit-border)',  text: 'var(--crit-text)',  label: '緊急' },
    warn: { bg: 'var(--warn-soft)',  border: 'var(--warn-border)',  text: 'var(--warn-text)',  label: '警示' },
    ok:   { bg: 'var(--ok-soft)',    border: 'var(--ok-border)',    text: 'var(--ok-text)',    label: '正常' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Summary counts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { tier: 'crit', count: critical.length },
          { tier: 'warn', count: warning.length },
          { tier: 'ok',   count: normal.length },
        ].map(({ tier, count }) => {
          const ts = tierStyle[tier];
          return (
            <div key={tier} style={{
              background: ts.bg, border: `1px solid ${ts.border}`,
              borderRadius: 14, padding: '16px 0',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 34,
                fontWeight: 700, color: ts.text, lineHeight: 1,
              }}>{count}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: ts.text, marginTop: 6 }}>{ts.label}</div>
            </div>
          );
        })}
      </div>

      {/* Sector list */}
      {all.map((s) => {
        const ts = tierStyle[s.tier];
        return (
          <button
            key={s.id}
            onClick={() => { onSelect(s.id); onView('map'); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '16px', width: '100%',
              background: 'var(--surface-panel)',
              border: `1px solid ${s.tier === 'ok' ? 'var(--border-subtle)' : ts.border}`,
              borderRadius: 14, cursor: 'pointer', textAlign: 'left',
            }}
          >
            <span style={{
              width: 12, height: 12, borderRadius: '50%',
              background: s.color, boxShadow: `0 0 8px ${s.color}`,
              flexShrink: 0,
              animation: s.tier === 'crit' ? 'a3-breathe 1.8s ease infinite' : 'none',
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                浪高 {s.waves}m · 風速 {s.wind}節 · {s.tide}
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 24,
              fontWeight: 700, color: s.color,
              fontVariantNumeric: 'tabular-nums',
            }}>{s.danger.toFixed(1)}</div>
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MOBILE LAYOUT
   ══════════════════════════════════════════════════════════ */
function MobileApp({ sectors, sector, selectedId, scanning, clock, mobileView, setMobileView, runScan }) {
  const alertCount = sectors.filter((s) => s.danger >= 7.5).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--surface-base)' }}>
      <Header clock={clock} compact />

      {/* Content area — flex column so children can use flex:1 */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* MAP — always mounted, shown/hidden via display so GeospatialCanvas keeps state */}
        <div style={{
          display: mobileView === 'map' ? 'flex' : 'none',
          flexDirection: 'column',
          flex: 1, minHeight: 0,
          position: 'relative',
        }}>
          <GeospatialCanvas
            sectors={sectors} selectedId={selectedId}
            onSelect={(id) => { runScan(id); }}
            scanning={scanning} mobile
          />
          {!scanning && (
            <SectorFloatCard
              sector={sector}
              onTelemetry={() => setMobileView('telemetry')}
            />
          )}
        </div>

        {/* TELEMETRY */}
        {mobileView === 'telemetry' && (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 14, animation: 'panelIn 220ms var(--ease-out)' }} className="a3-scroll">
            <TelemetryRail
              sector={sector} sectors={sectors}
              selectedId={selectedId} onSelect={(id) => { runScan(id); setMobileView('map'); }}
              mobile
            />
          </div>
        )}

        {/* INTEL / RAG */}
        {mobileView === 'intel' && (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 14, animation: 'panelIn 220ms var(--ease-out)' }} className="a3-scroll">
            <RagFeed sector={sector} scanning={scanning} onRerun={() => runScan(selectedId)} mobile />
          </div>
        )}

        {/* ALERTS */}
        {mobileView === 'alerts' && (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 14, animation: 'panelIn 220ms var(--ease-out)' }} className="a3-scroll">
            <AlertsView sectors={sectors} onSelect={runScan} onView={setMobileView} />
          </div>
        )}
      </div>

      <BottomNav view={mobileView} onView={setMobileView} alertCount={alertCount} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TABLET LAYOUT (768–1199px)
   ══════════════════════════════════════════════════════════ */
function TabletApp({ sectors, sector, selectedId, scanning, clock, runScan }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--surface-base)' }}>
      <Header clock={clock} />
      <main style={{ flex: 1, minHeight: 0, display: 'flex', gap: 12, padding: 12 }}>
        <GeospatialCanvas sectors={sectors} selectedId={selectedId} onSelect={runScan} scanning={scanning} />
        <div style={{ width: 300, flexShrink: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }} className="a3-scroll">
          <RagFeed sector={sector} scanning={scanning} onRerun={() => runScan(selectedId)} />
        </div>
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DESKTOP LAYOUT (1200px+)
   ══════════════════════════════════════════════════════════ */
function DesktopApp({ sectors, sector, selectedId, scanning, clock, runScan }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--surface-base)' }}>
      <Header clock={clock} />
      <main style={{ flex: 1, minHeight: 0, display: 'flex', gap: 'var(--gap-grid)', padding: 'var(--gap-grid)' }}>
        <TelemetryRail sector={sector} sectors={sectors} selectedId={selectedId} onSelect={runScan} />
        <GeospatialCanvas sectors={sectors} selectedId={selectedId} onSelect={runScan} scanning={scanning} />
        <RagFeed sector={sector} scanning={scanning} onRerun={() => runScan(selectedId)} />
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOT APP — detects layout, delegates to sub-apps
   ══════════════════════════════════════════════════════════ */
function App() {
  const getLayout = () => {
    const w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1200) return 'tablet';
    return 'desktop';
  };

  const [selectedId,  setSelectedId]  = React.useState('pengjia');
  const [scanning,    setScanning]    = React.useState(false);
  const [clock,       setClock]       = React.useState('--:--:--');
  const [mobileView,  setMobileView]  = React.useState('map');
  const [layout,      setLayout]      = React.useState(getLayout);

  /* Restore last selected sector from localStorage */
  React.useEffect(() => {
    const saved = localStorage.getItem('a3-selected-sector');
    if (saved) setSelectedId(saved);
  }, []);

  /* Persist selected sector */
  React.useEffect(() => {
    localStorage.setItem('a3-selected-sector', selectedId);
  }, [selectedId]);

  /* Clock */
  React.useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(d.toLocaleTimeString('zh-TW', { hour12: false }));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  /* Responsive layout detection */
  React.useEffect(() => {
    const handle = () => setLayout(getLayout());
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);



  /* Enrich sectors with computed color */
  const sectors = React.useMemo(
    () => RAW_SECTORS.map((s) => ({ ...s, color: dangerColor(s.danger) })),
    []
  );
  const sector = sectors.find((s) => s.id === selectedId) || sectors[0];

  /* Scan handler */
  const runScan = React.useCallback((id) => {
    setSelectedId(id);
    setScanning(true);
    setTimeout(() => setScanning(false), 1100);
  }, []);

  const shared = { sectors, sector, selectedId, scanning, clock, runScan };

  if (layout === 'mobile')  return <MobileApp  {...shared} mobileView={mobileView} setMobileView={setMobileView} />;
  if (layout === 'tablet')  return <TabletApp  {...shared} />;
  return                           <DesktopApp {...shared} />;
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return <div style={{color:'#ff8080', background:'#111', padding:20, position:'absolute', inset:0, fontFamily:'monospace', overflow:'auto'}}>
        <h3>React Render Error</h3>
        <pre>{this.state.error.toString()}</pre>
        <pre>{this.state.error.stack}</pre>
      </div>;
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(<ErrorBoundary><App /></ErrorBoundary>);


