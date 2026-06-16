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

// Light Map for standard daytime visibility
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd', maxZoom: 20
}).addTo(map);

// The 17 Core CWA Stations
const baseEpicenters = [
    { lat: 25.15, lng: 121.75, name: "Keelung Sector" }, { lat: 25.05, lng: 121.1, name: "Taoyuan Sector" }, 
    { lat: 24.8, lng: 120.9, name: "Hsinchu Sector" }, { lat: 24.6, lng: 120.7, name: "Miaoli Sector" },
    { lat: 24.3, lng: 120.5, name: "Taichung Sector" }, { lat: 24.0, lng: 120.3, name: "Changhua Sector" }, 
    { lat: 23.7, lng: 120.15, name: "Yunlin Sector" }, { lat: 23.45, lng: 120.1, name: "Chiayi Sector" },
    { lat: 23.0, lng: 120.1, name: "Tainan Sector" }, { lat: 22.6, lng: 120.25, name: "Kaohsiung Sector" }, 
    { lat: 22.4, lng: 120.5, name: "Pingtung Sector" }, { lat: 21.9, lng: 120.8, name: "Eluanbi Sector" },
    { lat: 22.3, lng: 120.9, name: "South-East Sector" }, { lat: 22.75, lng: 121.15, name: "Taitung Sector" }, 
    { lat: 23.5, lng: 121.5, name: "East-Coast Sector" }, { lat: 24.0, lng: 121.6, name: "Hualien Sector" }, 
    { lat: 24.75, lng: 121.85, name: "Yilan Sector" }
];

// Pre-generate live data for the 17 base stations
baseEpicenters.forEach(ep => {
    const intensity = 0.5 + Math.random() * 0.5;
    ep.wave_height = 0.5 + (Math.random() * 4.0 * intensity) + (intensity * 6.0);
    ep.wind_speed = 5.0 + (Math.random() * 15.0 * intensity) + (intensity * 20.0);
    ep.weight = Math.min(ep.wave_height / 12.0, 1.0);
    ep.danger_score = ep.weight * 10.0;
});

// Inverse Distance Weighting (IDW) Spatial Simulation AI
// Continuously blends marine conditions across all 17 stations for a perfectly smooth geographic gradient
function simulateMarineConditionsIDW(lat, lng) {
    let sumWeight = 0;
    let sumWaveHeight = 0;
    let sumWindSpeed = 0;
    let sumDanger = 0;
    
    // We use a power parameter of 2 for standard spatial interpolation
    const p = 2;
    
    for (let i = 0; i < baseEpicenters.length; i++) {
        const ep = baseEpicenters[i];
        const distSq = Math.pow(ep.lat - lat, 2) + Math.pow(ep.lng - lng, 2);
        
        // Exact geographic match
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
    
    return {
        wave_height: sumWaveHeight / sumWeight,
        wind_speed: sumWindSpeed / sumWeight,
        danger_score: sumDanger / sumWeight
    };
}

const markers = [];

async function renderTrueCoastline() {
    try {
        // Fetch actual physical geographic boundaries of Taiwan!
        const res = await fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries/TWN.geo.json');
        const geojson = await res.json();
        
        let mainRing = [];
        const geom = geojson.features[0].geometry;
        
        // Find the main island polygon (longest coordinates ring)
        if (geom.type === 'Polygon') {
            mainRing = geom.coordinates[0];
        } else if (geom.type === 'MultiPolygon') {
            let maxPoints = 0;
            geom.coordinates.forEach(polygon => {
                const ring = polygon[0];
                if (ring.length > maxPoints) {
                    maxPoints = ring.length;
                    mainRing = ring;
                }
            });
        }
        
        // Downsample geojson to roughly 300 points to prevent DOM lag while tracing the exact curve
        const maxAllowed = 300;
        const step = Math.max(1, Math.ceil(mainRing.length / maxAllowed));
        
        const sampledRing = [];
        for (let i = 0; i < mainRing.length; i += step) {
            sampledRing.push(mainRing[i]);
        }
        
        sampledRing.forEach((coord, i) => {
            // GeoJSON provides [lng, lat]
            const lng = coord[0];
            const lat = coord[1];
            
            // Mathematically calculate the exact physical tangent of the local beach!
            const prev = sampledRing[i === 0 ? sampledRing.length - 1 : i - 1];
            const next = sampledRing[(i + 1) % sampledRing.length];
            
            const dy = next[1] - prev[1];
            const dx = next[0] - prev[0];
            const tangentAngleRad = Math.atan2(dy, dx);
            
            // Normal (perpendicular) angle pointing INLAND
            let normalRad = tangentAngleRad + (Math.PI / 2);
            
            const centerDy = 23.7 - lat;
            const centerDx = 121.0 - lng;
            const centerAngleRad = Math.atan2(centerDy, centerDx);
            
            // Ensure the normal vector strictly points toward the center of the island
            const dotProduct = Math.cos(normalRad)*Math.cos(centerAngleRad) + Math.sin(normalRad)*Math.sin(centerAngleRad);
            if (dotProduct < 0) {
                normalRad -= Math.PI;
            }
            
            // TIGHT BORDER ANALYSIS
            // Push gently offshore so waves sit tightly on the exact physical border without clipping bays
            const offshoreOffset = 0.005; // Tight fit
            const finalLat = lat - (Math.sin(normalRad) * offshoreOffset);
            const finalLng = lng - (Math.cos(normalRad) * offshoreOffset);
            
            // Rotate the SVG native Y-axis (crashing wave flow) to align exactly with the inland normal vector
            const rotation = -(normalRad * 180 / Math.PI) - 90;
            
            // Simulate the continuous marine condition at this exact border coordinate using IDW!
            const sim = simulateMarineConditionsIDW(finalLat, finalLng);
            
            // MICRO-SIZING: Extremely small, highly detailed delicate foam arcs perfectly tracing the border
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
                    <b style="color: #0ff;">Simulated Border Analysis</b><br/>
                    Status: <b style="color: #0ff;">IDW Live Tracking</b><br/>
                    Danger Score: <span style="color:${color}; font-weight: bold; font-size: 16px;">${sim.danger_score.toFixed(1)} / 10</span><br/><br/>
                    📍 Sector Coord: <b>Lat ${finalLat.toFixed(4)}, Lng ${finalLng.toFixed(4)}</b><br/>
                    🌊 Predicted Wave: <b>${sim.wave_height.toFixed(1)} m</b><br/>
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

// Boot the physical tracing engine
renderTrueCoastline();

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
