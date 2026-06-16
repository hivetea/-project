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
let trueCoastlineRing = []; // Global access for deep sea physics deflections

// Inverse Distance Weighting (IDW) Spatial Simulation AI
function simulateMarineConditionsIDW(lat, lng) {
    let sumWeight = 0;
    let sumWaveHeight = 0;
    let sumWindSpeed = 0;
    let sumDanger = 0;
    
    const p = 2; // Power parameter
    
    for (let i = 0; i < baseEpicenters.length; i++) {
        const ep = baseEpicenters[i];
        const distSq = Math.pow(ep.lat - lat, 2) + Math.pow(ep.lng - lng, 2);
        
        if (distSq < 0.0000001) return {
            wave_height: ep.wave_height,
            wind_speed: ep.wind_speed,
            danger_score: ep.danger_score
        };
        
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

async function renderTrueCoastline() {
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
            
            const centerDy = 23.7 - lat;
            const centerDx = 121.0 - lng;
            const centerAngleRad = Math.atan2(centerDy, centerDx);
            
            const dotProduct = Math.cos(normalRad)*Math.cos(centerAngleRad) + Math.sin(normalRad)*Math.sin(centerAngleRad);
            if (dotProduct < 0) {
                normalRad -= Math.PI;
            }
            
            const offshoreOffset = 0.005; 
            const finalLat = lat - (Math.sin(normalRad) * offshoreOffset);
            const finalLng = lng - (Math.cos(normalRad) * offshoreOffset);
            
            const rotation = -(normalRad * 180 / Math.PI) - 90;
            
            const sim = simulateMarineConditionsIDW(finalLat, finalLng);
            
            const baseWidth = 5 + (sim.wave_height * 0.2);
            const baseHeight = 5 + (sim.wave_height * 0.2);
            
            const color = getDangerColor(sim.danger_score, 0.95);
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
                    Status: <b style="color: #0ff;">IDW Live Tracking</b><br/>
                    Danger Score: <span style="color:${color}; font-weight: bold; font-size: 16px;">${sim.danger_score.toFixed(1)} / 10</span><br/><br/>
                    🌊 Predicted Wave (Pierson-Moskowitz): <b>${sim.wave_height.toFixed(1)} m</b><br/>
                    💨 Predicted Wind: <b>${sim.wind_speed.toFixed(1)} m/s</b>
                </div>
            `;

            const marker = L.marker([finalLat, finalLng], { icon: waveIcon })
                .addTo(map)
                .bindPopup(popupHtml);
                
            markers.push({ layer: marker, baseWidth, baseHeight });
        });
        
    } catch (err) {
        console.error("Failed to load geographic boundary:", err);
    }
}

// Point-in-Polygon algorithm to strictly detect if a coordinate is on land
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

// Deep Ocean Matrix AI (Open-Meteo) with Coastal Deflection Physics
async function renderDeepOceanGrid() {
    const lats = [];
    const lngs = [];
    
    // Spawn dense hex grid over deep ocean (0.3 step = ~33km)
    for (let lat = 21.0; lat <= 26.0; lat += 0.3) {
        for (let lng = 119.0; lng <= 123.0; lng += 0.3) {
            
            // Check true distance to land using the geojson polygon
            let minDistSq = Infinity;
            if (trueCoastlineRing.length > 0) {
                trueCoastlineRing.forEach(coord => {
                    const distSq = Math.pow(coord[1] - lat, 2) + Math.pow(coord[0] - lng, 2);
                    if (distSq < minDistSq) minDistSq = distSq;
                });
            } else {
                minDistSq = Math.pow(lat - 23.7, 2) + Math.pow(lng - 121.0, 2);
            }

            // Hex staggered offset to create interlocking honeycomb grid
            const hexOffset = (Math.round(lat / 0.3) % 2 === 0) ? 0 : 0.15;
            const finalLng = lng + hexOffset;

            const insideLand = trueCoastlineRing.length > 0 && isPointInPolygon([finalLng, lat], trueCoastlineRing);

            // Exclude nodes that are physically inside land or too close to the beach (~15km)
            if (!insideLand && minDistSq > 0.02) {
                lats.push(lat.toFixed(2));
                lngs.push(finalLng.toFixed(2));
            }
        }
    }
    
    if (lats.length === 0) return;
    
    // Chunk requests to bypass Open-Meteo 100 point limit
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
                
                let wh = current.wave_height;
                if (wh === null) wh = 1.0;
                let wd = current.wave_direction;
                if (wd === null) wd = 0;
                let cv = current.ocean_current_velocity;
                if (cv === null) cv = 0;
                
                const lat = parseFloat(batchLats[i]);
                const lng = parseFloat(batchLngs[i]);
                
                let rotation = wd; 
                let physicsStatus = "Free Flowing";
                
                // ==========================================
                // PHYSICS ENGINE: Coastal Deflection System
                // ==========================================
                let closestCoastPoint = null;
                let minDistSq = Infinity;
                let closestIndex = -1;
                
                trueCoastlineRing.forEach((coord, idx) => {
                    const dist = Math.pow(coord[1] - lat, 2) + Math.pow(coord[0] - lng, 2);
                    if (dist < minDistSq) {
                        minDistSq = dist;
                        closestCoastPoint = coord;
                        closestIndex = idx;
                    }
                });
                
                // If the current is near the coast (within ~60km)
                if (minDistSq < 0.3) {
                    const prev = trueCoastlineRing[closestIndex === 0 ? trueCoastlineRing.length - 1 : closestIndex - 1];
                    const next = trueCoastlineRing[(closestIndex + 1) % trueCoastlineRing.length];
                    
                    const dy = next[1] - prev[1];
                    const dx = next[0] - prev[0];
                    const tangentRad = Math.atan2(dy, dx);
                    let normalRad = tangentRad + (Math.PI / 2);
                    
                    // Ensure normal points inland
                    const centerDy = 23.7 - closestCoastPoint[1];
                    const centerDx = 121.0 - closestCoastPoint[0];
                    const centerAngleRad = Math.atan2(centerDy, centerDx);
                    if (Math.cos(normalRad)*Math.cos(centerAngleRad) + Math.sin(normalRad)*Math.sin(centerAngleRad) < 0) {
                        normalRad -= Math.PI;
                    }
                    
                    // Calculate Ocean Flow vector in standard math radians
                    const mathFlowRad = (90 - (wd + 180)) * Math.PI / 180;
                    
                    // Dot product determines if it is hitting the landmass (>0 means hitting)
                    const dotProduct = Math.cos(mathFlowRad)*Math.cos(normalRad) + Math.sin(mathFlowRad)*Math.sin(normalRad);
                    
                    if (dotProduct > 0.15) {
                        physicsStatus = "Deflected by Coastline";
                        // It's crashing into Taiwan! Deflect it to run parallel to the beach.
                        const dotT1 = Math.cos(mathFlowRad)*Math.cos(tangentRad) + Math.sin(mathFlowRad)*Math.sin(tangentRad);
                        const dotT2 = Math.cos(mathFlowRad)*Math.cos(tangentRad + Math.PI) + Math.sin(mathFlowRad)*Math.sin(tangentRad + Math.PI);
                        
                        const finalMathFlow = dotT1 > dotT2 ? tangentRad : (tangentRad + Math.PI);
                        
                        // Translate math flow back to SVG rotation
                        rotation = -(finalMathFlow * 180 / Math.PI) - 90;
                    }
                }
                
                // Smaller, more reasonable dense sizing
                const baseWidth = 15 + (wh * 5);
                const baseHeight = 15 + (wh * 5);
                
                // 65% opacity, reasonable colors
                let color = getDangerColor(Math.min(10, wh * 3.0), 0.65); 
                if (physicsStatus === "Deflected by Coastline") {
                    color = getDangerColor(Math.min(10, wh * 3.0 + 2.0), 0.85); // Slightly brighter
                }

                // Thinner stroke for dense grid
                const flowSpeed = Math.max(0.6, 5.0 - (cv * 2));
                
                const currentScale = Math.pow(2, map.getZoom() - 7);
                const w = baseWidth * currentScale;
                const h = baseHeight * currentScale;
                
                const svgHtml = `
                    <div style="width: 100%; height: 100%; transform: rotate(${rotation}deg); display: flex; align-items: center; justify-content: center;">
                        <svg width="100%" height="100%" viewBox="-50 -50 100 100">
                            <g stroke="${color}" stroke-width="4" stroke-linecap="round" fill="none">
                                <path d="M-40 0 Q -20 -15, 0 0 T 40 0">
                                    <animateTransform attributeName="transform" type="translate" from="0, -30" to="0, 30" dur="${flowSpeed}s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0; 1; 1; 0" keyTimes="0; 0.2; 0.8; 1" dur="${flowSpeed}s" repeatCount="indefinite" />
                                </path>
                            </g>
                        </svg>
                    </div>
                `;
                
                const waveIcon = L.divIcon({
                    html: svgHtml,
                    className: 'custom-wave-icon',
                    iconSize: [w, h],
                    iconAnchor: [w/2, h/2]
                });
                
                const marker = L.marker([lat, lng], { icon: waveIcon })
                    .addTo(map)
                    .bindPopup(`
                        <div style="font-size: 13px;">
                            <b style="color:#0ff">Copernicus Satellite Node</b><br/>
                            Physics: <b style="color:#ffaa00">${physicsStatus}</b><br/>
                            🌊 Deep Sea Wave Height: <b>${wh.toFixed(1)} m</b><br/>
                            💨 Ocean Current Velocity: <b>${cv.toFixed(1)} km/h</b><br/>
                            🧭 Flow Direction: <b>${wd.toFixed(0)}°</b>
                        </div>
                    `);
                    
                markers.push({ layer: marker, baseWidth, baseHeight });
            });
        });
    } catch(err) {
        console.error("Open-Meteo failure", err);
    }
}

// Master Boot Sequence
async function bootEngine() {
    try {
        // 1. Load Live Coastal Stations
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
                
                // PIERSON-MOSKOWITZ WAVE PREDICTION ALGORITHM
                // Formula: WaveHeight = 0.22 * (U^2 / g)
                const g = 9.81;
                let wave_height = 0.22 * (Math.pow(wind_speed, 2) / g);
                if (wave_height < 0.2) wave_height = 0.2; 
                
                // Mathematical danger score mapping
                const danger_score = Math.min(10.0, wave_height * 3.5);
                
                baseEpicenters.push({ lat, lng, name, wind_speed, wave_height, danger_score });
            } catch(e) {}
        });
        
        // 2. Boot IDW Coastal Prediction Simulation
        await renderTrueCoastline();
        
        // 3. Boot Deep Sea Ocean Current Satellites
        await renderDeepOceanGrid();
        
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
