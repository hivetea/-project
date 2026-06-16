// Detailed 0 to 10 Danger Color Scale Interpolator
function lerpColor(c1, c2, t) {
    return [
        Math.round(c1[0] + (c2[0] - c1[0]) * t),
        Math.round(c1[1] + (c2[1] - c1[1]) * t),
        Math.round(c1[2] + (c2[2] - c1[2]) * t)
    ];
}

function getDangerColor(score, alpha = 1.0) {
    const stops = [
        { val: 0.0, color: [20, 100, 255] },
        { val: 2.5, color: [0, 255, 255] },
        { val: 5.0, color: [255, 255, 0] },
        { val: 7.5, color: [255, 140, 0] },
        { val: 10.0, color: [255, 30, 30] }
    ];
    let s = Math.max(0, Math.min(10, score));
    let lower = stops[0], upper = stops[stops.length - 1];
    for (let i = 0; i < stops.length - 1; i++) {
        if (s >= stops[i].val && s <= stops[i+1].val) {
            lower = stops[i]; upper = stops[i+1]; break;
        }
    }
    let t = (upper.val === lower.val) ? 0 : (s - lower.val) / (upper.val - lower.val);
    let rgb = lerpColor(lower.color, upper.color, t);
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

// Point-in-Polygon algorithm
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

// Initialize Leaflet Map
const map = L.map('globeViz', {
    center: [23.7, 121.0], zoom: 7, zoomControl: false
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    subdomains: 'abcd', maxZoom: 20
}).addTo(map);

const markers = [];
const baseEpicenters = [];
let trueCoastlineRing = [];
let globalDeepSeaNodes = [];

// IDW Wind Simulation
function simulateMarineConditionsIDW(lat, lng) {
    let sumWeight = 0;
    let sumWaveHeight = 0;
    let sumWindSpeed = 0;
    let sumDanger = 0;
    
    const p = 2;
    for (let i = 0; i < baseEpicenters.length; i++) {
        const ep = baseEpicenters[i];
        const distSq = Math.pow(ep.lat - lat, 2) + Math.pow(ep.lng - lng, 2);
        
        if (distSq < 0.0000001) return { wave_height: ep.wave_height, wind_speed: ep.wind_speed, danger_score: ep.danger_score };
        
        const dist = Math.sqrt(distSq);
        const w = 1.0 / Math.pow(dist, p);
        
        sumWeight += w;
        sumWaveHeight += ep.wave_height * w;
        sumWindSpeed += ep.wind_speed * w;
        sumDanger += ep.danger_score * w;
    }
    if (sumWeight === 0) return { wave_height: 0, wind_speed: 0, danger_score: 0 };
    return {
        wave_height: sumWaveHeight / sumWeight,
        wind_speed: sumWindSpeed / sumWeight,
        danger_score: sumDanger / sumWeight
    };
}

// BOOT SEQ 1: Load true polygon
async function loadCoastlinePolygon() {
    try {
        const res = await fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries/TWN.geo.json');
        const geojson = await res.json();
        const geom = geojson.features[0].geometry;
        
        if (geom.type === 'Polygon') {
            trueCoastlineRing = geom.coordinates[0];
        } else if (geom.type === 'MultiPolygon') {
            let maxPoints = 0;
            geom.coordinates.forEach(polygon => {
                const ring = polygon[0];
                if (ring.length > maxPoints) {
                    maxPoints = ring.length;
                    trueCoastlineRing = ring;
                }
            });
        }
    } catch (err) { console.error("Failed to load geo boundary", err); }
}

// BOOT SEQ 2: Fetch Satellite Data into Memory
async function fetchDeepOceanData() {
    const lats = [];
    const lngs = [];
    
    // Dense 0.15 step
    for (let lat = 21.0; lat <= 26.0; lat += 0.15) {
        for (let lng = 119.0; lng <= 123.0; lng += 0.15) {
            let minDistSq = Infinity;
            if (trueCoastlineRing.length > 0) {
                trueCoastlineRing.forEach(coord => {
                    const distSq = Math.pow(coord[1] - lat, 2) + Math.pow(coord[0] - lng, 2);
                    if (distSq < minDistSq) minDistSq = distSq;
                });
            } else {
                minDistSq = Math.pow(lat - 23.7, 2) + Math.pow(lng - 121.0, 2);
            }

            const hexOffset = (Math.round(lat / 0.15) % 2 === 0) ? 0 : 0.075;
            const finalLng = lng + hexOffset;

            const insideLand = trueCoastlineRing.length > 0 && isPointInPolygon([finalLng, lat], trueCoastlineRing);

            if (!insideLand && minDistSq > 0.005) {
                lats.push(lat.toFixed(3));
                lngs.push(finalLng.toFixed(3));
            }
        }
    }
    
    if (lats.length === 0) return;
    
    const chunkSize = 90;
    const fetchPromises = [];
    for (let i = 0; i < lats.length; i += chunkSize) {
        const batchLats = lats.slice(i, i + chunkSize);
        const batchLngs = lngs.slice(i, i + chunkSize);
        const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${batchLats.join(',')}&longitude=${batchLngs.join(',')}&current=wave_height,wave_direction,ocean_current_velocity,ocean_current_direction`;
        fetchPromises.push(
            fetch(url).then(res => res.json()).then(data => ({ data, batchLats, batchLngs }))
        );
    }
    
    try {
        const responses = await Promise.all(fetchPromises);
        responses.forEach(({ data, batchLats, batchLngs }) => {
            const dataArray = Array.isArray(data) ? data : [data];
            dataArray.forEach((ocean, i) => {
                const current = ocean.current;
                if (!current) return;
                
                globalDeepSeaNodes.push({
                    lat: parseFloat(batchLats[i]),
                    lng: parseFloat(batchLngs[i]),
                    wh: current.wave_height || 1.0,
                    wd: current.wave_direction || 0,
                    cv: current.ocean_current_velocity || 0
                });
            });
        });
    } catch(err) { console.error("Open-Meteo fetch failed", err); }
}

// BOOT SEQ 3: Unified Coastline Physics Draw
function drawUnifiedCoastline() {
    if (trueCoastlineRing.length === 0) return;
    
    const maxAllowed = 300;
    const step = Math.max(1, Math.ceil(trueCoastlineRing.length / maxAllowed));
    
    const sampledRing = [];
    for (let i = 0; i < trueCoastlineRing.length; i += step) {
        sampledRing.push(trueCoastlineRing[i]);
    }
    
    sampledRing.forEach((coord, i) => {
        const lng = coord[0];
        const lat = coord[1];
        
        const prev = sampledRing[i === 0 ? sampledRing.length - 1 : i - 1];
        const next = sampledRing[(i + 1) % sampledRing.length];
        
        const dy = next[1] - prev[1];
        const dx = next[0] - prev[0];
        const tangentAngleRad = Math.atan2(dy, dx);
        
        let normalRad = tangentAngleRad + (Math.PI / 2);
        
        // Ensure inland normal
        const centerDy = 23.7 - lat;
        const centerDx = 121.0 - lng;
        const centerAngleRad = Math.atan2(centerDy, centerDx);
        if (Math.cos(normalRad)*Math.cos(centerAngleRad) + Math.sin(normalRad)*Math.sin(centerAngleRad) < 0) {
            normalRad -= Math.PI;
        }
        
        const offshoreOffset = 0.005; 
        const finalLat = lat - (Math.sin(normalRad) * offshoreOffset);
        const finalLng = lng - (Math.cos(normalRad) * offshoreOffset);
        
        // --- UNIFIED PHYSICS CALCULATION ---
        
        // 1. Local Wind Wave (Pierson-Moskowitz IDW)
        const sim = simulateMarineConditionsIDW(finalLat, finalLng);
        let finalWaveHeight = sim.wave_height;
        let finalDangerScore = sim.danger_score;
        let collisionSwell = 0;
        let highestCollisionImpact = 0;
        
        // 2. Scan for offshore satellite swells crashing into this sector
        globalDeepSeaNodes.forEach(node => {
            const distSq = Math.pow(node.lat - finalLat, 2) + Math.pow(node.lng - finalLng, 2);
            // Search radius ~40km (distSq < 0.15)
            if (distSq < 0.15) {
                // Ocean Flow vector in math radians
                const mathFlowRad = (90 - (node.wd + 180)) * Math.PI / 180;
                // Dot product of flow vs. coastal normal
                const dotProduct = Math.cos(mathFlowRad)*Math.cos(normalRad) + Math.sin(mathFlowRad)*Math.sin(normalRad);
                
                // If dotProduct > 0.4, it is a highly perpendicular crashing wave!
                if (dotProduct > 0.4) {
                    const impact = node.wh * dotProduct;
                    if (impact > highestCollisionImpact) {
                        highestCollisionImpact = impact;
                        collisionSwell = impact; // Add this extra surge height
                    }
                }
            }
        });
        
        let statusHtml = `Status: <b style="color: #0ff;">Local Wind Track</b>`;
        
        if (collisionSwell > 0) {
            finalWaveHeight += (collisionSwell * 0.8); // 80% physical energy transfer
            finalDangerScore += (collisionSwell * 4.0); // Spikes danger massively
            statusHtml = `Status: <b style="color: #ff3300;">⚠️ Offshore Swell Collision Detected</b>`;
        }
        
        // ------------------------------------
        
        const rotation = -(normalRad * 180 / Math.PI) - 90;
        const baseWidth = 5 + (finalWaveHeight * 0.2);
        const baseHeight = 5 + (finalWaveHeight * 0.2);
        
        const color = getDangerColor(finalDangerScore, 0.95);
        const flowSpeed = Math.max(0.6, 2.5 - (sim.wind_speed * 0.05));
        
        const currentScale = Math.pow(2, map.getZoom() - 7);
        const w = baseWidth * currentScale;
        const h = baseHeight * currentScale;
        
        const svgHtml = `
            <div style="width: 100%; height: 100%; transform: rotate(${rotation}deg); display: flex; align-items: center; justify-content: center;">
                <svg width="100%" height="100%" viewBox="-50 -50 100 100">
                    <g stroke="${color}" stroke-width="15" stroke-linecap="round" fill="none">
                        <path d="M-40 0 Q -20 -15, 0 0 T 40 0">
                            <animateTransform attributeName="transform" type="translate" from="0, -30" to="0, 30" dur="${flowSpeed}s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0; 1; 1; 0" keyTimes="0; 0.2; 0.8; 1" dur="${flowSpeed}s" repeatCount="indefinite" />
                        </path>
                        <path d="M-40 0 Q -20 -15, 0 0 T 40 0">
                            <animateTransform attributeName="transform" type="translate" from="0, -30" to="0, 30" dur="${flowSpeed}s" begin="${flowSpeed/2}s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0; 1; 1; 0" keyTimes="0; 0.2; 0.8; 1" dur="${flowSpeed}s" begin="${flowSpeed/2}s" repeatCount="indefinite" />
                        </path>
                    </g>
                </svg>
            </div>
        `;

        const waveIcon = L.divIcon({
            html: svgHtml,
            className: 'custom-wave-icon',
            iconSize: [w, h],
            iconAnchor: [w/2, h/2],
            popupAnchor: [0, -h/2]
        });

        const popupHtml = `
            <div style="font-size: 13px;">
                <b style="color: #0ff;">Simulated Coastal Sector</b><br/>
                ${statusHtml}<br/>
                Unified Danger Score: <span style="color:${color}; font-weight: bold; font-size: 16px;">${Math.min(10.0, finalDangerScore).toFixed(1)} / 10</span><br/><br/>
                🌊 Net Wave Swell: <b>${finalWaveHeight.toFixed(1)} m</b><br/>
                💨 IDW Local Wind: <b>${sim.wind_speed.toFixed(1)} m/s</b>
            </div>
        `;

        const marker = L.marker([finalLat, finalLng], { icon: waveIcon })
            .addTo(map)
            .bindPopup(popupHtml);
            
        markers.push({ layer: marker, baseWidth, baseHeight });
    });
}

// BOOT SEQ 4: Draw the Deep Ocean Matrix
function drawDeepOceanGrid() {
    globalDeepSeaNodes.forEach(node => {
        let rotation = node.wd; 
        let physicsStatus = "Free Flowing";
        
        let closestCoastPoint = null;
        let minDistSq = Infinity;
        let closestIndex = -1;
        
        trueCoastlineRing.forEach((coord, idx) => {
            const dist = Math.pow(coord[1] - node.lat, 2) + Math.pow(coord[0] - node.lng, 2);
            if (dist < minDistSq) {
                minDistSq = dist;
                closestCoastPoint = coord;
                closestIndex = idx;
            }
        });
        
        if (minDistSq < 0.3) {
            const prev = trueCoastlineRing[closestIndex === 0 ? trueCoastlineRing.length - 1 : closestIndex - 1];
            const next = trueCoastlineRing[(closestIndex + 1) % trueCoastlineRing.length];
            const tangentRad = Math.atan2(next[1] - prev[1], next[0] - prev[0]);
            let normalRad = tangentRad + (Math.PI / 2);
            
            const centerAngleRad = Math.atan2(23.7 - closestCoastPoint[1], 121.0 - closestCoastPoint[0]);
            if (Math.cos(normalRad)*Math.cos(centerAngleRad) + Math.sin(normalRad)*Math.sin(centerAngleRad) < 0) {
                normalRad -= Math.PI;
            }
            
            const mathFlowRad = (90 - (node.wd + 180)) * Math.PI / 180;
            const dotProduct = Math.cos(mathFlowRad)*Math.cos(normalRad) + Math.sin(mathFlowRad)*Math.sin(normalRad);
            
            if (dotProduct > 0.15) {
                physicsStatus = "Deflected by Coastline";
                const dotT1 = Math.cos(mathFlowRad)*Math.cos(tangentRad) + Math.sin(mathFlowRad)*Math.sin(tangentRad);
                const dotT2 = Math.cos(mathFlowRad)*Math.cos(tangentRad + Math.PI) + Math.sin(mathFlowRad)*Math.sin(tangentRad + Math.PI);
                const finalMathFlow = dotT1 > dotT2 ? tangentRad : (tangentRad + Math.PI);
                rotation = -(finalMathFlow * 180 / Math.PI) - 90;
            }
        }
        
        const baseWidth = 5 + (node.wh * 1.5);
        const baseHeight = 5 + (node.wh * 1.5);
        
        let color = getDangerColor(Math.min(10, node.wh * 3.0), 0.65); 
        if (physicsStatus === "Deflected by Coastline") {
            color = getDangerColor(Math.min(10, node.wh * 3.0 + 2.0), 0.85);
        }

        const flowSpeed = Math.max(0.6, 5.0 - (node.cv * 2));
        const currentScale = Math.pow(2, map.getZoom() - 7);
        const w = baseWidth * currentScale;
        const h = baseHeight * currentScale;
        
        const svgHtml = `
            <div style="width: 100%; height: 100%; transform: rotate(${rotation}deg); display: flex; align-items: center; justify-content: center;">
                <svg width="100%" height="100%" viewBox="-50 -50 100 100">
                    <g stroke="${color}" stroke-width="2" stroke-linecap="round" fill="none">
                        <path d="M-40 0 Q -20 -15, 0 0 T 40 0">
                            <animateTransform attributeName="transform" type="translate" from="0, -30" to="0, 30" dur="${flowSpeed}s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0; 1; 1; 0" keyTimes="0; 0.2; 0.8; 1" dur="${flowSpeed}s" repeatCount="indefinite" />
                        </path>
                    </g>
                </svg>
            </div>
        `;
        
        const waveIcon = L.divIcon({ html: svgHtml, className: 'custom-wave-icon', iconSize: [w, h], iconAnchor: [w/2, h/2] });
        
        const marker = L.marker([node.lat, node.lng], { icon: waveIcon })
            .addTo(map)
            .bindPopup(`
                <div style="font-size: 13px;">
                    <b style="color:#0ff">Copernicus Satellite Node</b><br/>
                    Physics: <b style="color:#ffaa00">${physicsStatus}</b><br/>
                    🌊 Deep Sea Wave Height: <b>${node.wh.toFixed(1)} m</b><br/>
                    💨 Ocean Current Velocity: <b>${node.cv.toFixed(1)} km/h</b><br/>
                    🧭 Flow Direction: <b>${node.wd.toFixed(0)}°</b>
                </div>
            `);
            
        markers.push({ layer: marker, baseWidth, baseHeight });
    });
}

// Master Boot Engine
async function bootEngine() {
    try {
        // Load CWA Local Stations
        const res = await fetch('coastal_stations.json');
        const rawStations = await res.json();
        rawStations.forEach(s => {
            try {
                const coords = s.GeoInfo.Coordinates.find(c => c.CoordinateName === 'WGS84');
                const lat = parseFloat(coords.StationLatitude);
                const lng = parseFloat(coords.StationLongitude);
                const name = s.StationName;
                let wind_speed = parseFloat(s.WeatherElement.WindSpeed);
                if (isNaN(wind_speed) || wind_speed < 0) wind_speed = 3.0;
                
                const g = 9.81;
                let wave_height = 0.22 * (Math.pow(wind_speed, 2) / g);
                if (wave_height < 0.2) wave_height = 0.2; 
                
                const danger_score = Math.min(10.0, wave_height * 3.5);
                baseEpicenters.push({ lat, lng, name, wind_speed, wave_height, danger_score });
            } catch(e) {}
        });
        
        await loadCoastlinePolygon();     // 1. Get exact bounds
        await fetchDeepOceanData();       // 2. Fetch Open-Meteo
        drawUnifiedCoastline();           // 3. Draw coast with IDW + Open-Meteo Collision Physics
        drawDeepOceanGrid();              // 4. Draw Open-Meteo
        
    } catch(err) {
        console.error("Boot sequence failed:", err);
    }
}

// Start Engine
bootEngine();

// STRICT SCALING ENGINE
map.on('zoom', () => {
    const scale = Math.pow(2, map.getZoom() - 7);
    markers.forEach(m => {
        const icon = m.layer._icon;
        if (icon) {
            const newW = m.baseWidth * scale;
            const newH = m.baseHeight * scale;
            icon.style.width = newW + 'px';
            icon.style.height = newH + 'px';
            icon.style.marginLeft = -(newW/2) + 'px';
            icon.style.marginTop = -(newH/2) + 'px';
        }
    });
});
