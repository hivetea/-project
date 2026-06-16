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
        { val: 0.0, color: [255, 255, 255] },   // 0: White (Safe)
        { val: 5.0, color: [255, 165, 0] },     // 5: Orange (Caution)
        { val: 10.0, color: [139, 0, 0] }       // 10: Dark Red (Extreme Danger)
    ];
    
    let s = Math.max(0, Math.min(10, score));
    let lower = stops[0], upper = stops[stops.length - 1];
    
    for (let i = 0; i < stops.length - 1; i++) {
        if (s >= stops[i].val && s <= stops[i+1].val) {
            lower = stops[i];
            upper = stops[i+1];
            break;
        }
    }
    
    let t = (upper.val === lower.val) ? 0 : (s - lower.val) / (upper.val - lower.val);
    let rgb = lerpColor(lower.color, upper.color, t);
    
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

// Initialize Leaflet Map
const map = L.map('globeViz', {
    center: [23.7, 121.0],
    zoom: 7,
    zoomControl: false
});

// Reverting to Dark Map so White is highly visible
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

function generateServerlessData() {
    const points = [];
    
    // Scattered Coastal Coordinates Engine (Not a Matrix)
    const coastalEpicenters = [
        [25.15, 121.75], [25.05, 121.1], [24.8, 120.9], [24.6, 120.7],
        [24.3, 120.5], [24.0, 120.3], [23.7, 120.15], [23.45, 120.1],
        [23.0, 120.1], [22.6, 120.25], [22.4, 120.5], [21.9, 120.8],
        [22.3, 120.9], [22.75, 121.15], [23.5, 121.5], [24.0, 121.6], [24.75, 121.85]
    ];
    const radius = 0.25;

    for (let i = 0; i < 120; i++) {
        const center = coastalEpicenters[Math.floor(Math.random() * coastalEpicenters.length)];
        const r = Math.random() * radius;
        const theta = Math.random() * Math.PI * 2;
        
        // Calculate exact coordinates clustered around stations
        const lat = center[0] + r * Math.sin(theta);
        const lng = center[1] + r * Math.cos(theta);

        // Simple exclusion to prevent hitting the central mountain range
        if (lat > 22.5 && lat < 24.5 && lng > 120.4 && lng < 121.3) continue;
        
        const intensity = 1.0 - (r / radius);
        const wave_height = 0.5 + (Math.random() * 4.0 * intensity) + (intensity * 6.0);
        const wind_speed = 5.0 + (Math.random() * 15.0 * intensity) + (intensity * 20.0);
        
        // Map weight (0-1) to Danger Score (0-10)
        const weight = Math.min(wave_height / 12.0, 1.0);
        const danger_score = weight * 10.0;
        
        // Kuroshio Current flows North/Northeast (20 to 60 degrees)
        const wind_angle = 20 + Math.random() * 40; 
        
        let directionLabel = "NE";
        if (wind_angle < 30) directionLabel = "NNE";
        if (wind_angle > 50) directionLabel = "ENE";
        
        points.push({ lat, lng, wave_height, wind_speed, danger_score, direction: directionLabel, angle: wind_angle });
    }
    return { points };
}

const data = generateServerlessData();
const markers = []; // Store markers for dynamic scaling

data.points.forEach(d => {
    const baseSize = 35 + (d.wave_height * 3); 
    const color = getDangerColor(d.danger_score, 1.0);
    const borderColor = getDangerColor(d.danger_score, 0.8);
    
    const flowSpeed = Math.max(0.3, 2.5 - (d.wind_speed * 0.05));
    
    // Rotate <div> so SVG flows toward wind angle
    const rotation = d.angle - 90;
    
    // Calculate initial scale size based on starting zoom (7)
    const currentScale = Math.pow(1.5, map.getZoom() - 7);
    const size = baseSize * currentScale;
    
    // Using 100% reliable <animateTransform> for SVG flow animation
    const svgHtml = `
        <div class="wave-container" style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; transform: rotate(${rotation}deg); background: rgba(0,0,0,0.5); border: 1px solid ${borderColor}; box-shadow: 0 0 8px ${borderColor};">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
                <g stroke="${color}" stroke-width="8" fill="none">
                    <animateTransform attributeName="transform" type="translate" from="0,0" to="100,0" dur="${flowSpeed}s" repeatCount="indefinite" />
                    <path d="M-100 30 Q -75 10, -50 30 T 0 30 T 50 30 T 100 30 T 150 30 T 200 30" />
                    <path d="M-100 50 Q -75 30, -50 50 T 0 50 T 50 50 T 100 50 T 150 50 T 200 50" />
                    <path d="M-100 70 Q -75 50, -50 70 T 0 70 T 50 70 T 100 70 T 150 70 T 200 70" />
                </g>
            </svg>
        </div>
    `;

    const waveIcon = L.divIcon({
        html: svgHtml,
        className: 'custom-wave-icon',
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
        popupAnchor: [0, -size/2]
    });

    const popupHtml = `
        <div style="font-size: 13px;">
            <b style="color: #0ff;">Maritime Sector Analysis</b><br/>
            Danger Score: <span style="color:${color}; font-weight: bold; font-size: 16px;">${d.danger_score.toFixed(1)} / 10</span><br/><br/>
            📍 Coord: <b>Lat ${d.lat.toFixed(4)}, Lng ${d.lng.toFixed(4)}</b><br/>
            🌊 Wave Height: <b>${d.wave_height.toFixed(1)} m</b><br/>
            💨 Wind Speed: <b>${d.wind_speed.toFixed(1)} m/s (${d.direction})</b>
        </div>
    `;

    const marker = L.marker([d.lat, d.lng], { icon: waveIcon })
        .addTo(map)
        .bindPopup(popupHtml);
        
    markers.push({ layer: marker, baseSize: baseSize });
});

// STRCIT SCALING ENGINE:
// Recalculates pixel width/height when zooming so waves shrink dynamically!
map.on('zoom', () => {
    // 1.5 multiplier per zoom level (zooming out shrinks icon size geographically)
    const scale = Math.pow(1.5, map.getZoom() - 7);
    markers.forEach(m => {
        const icon = m.layer._icon;
        if (icon) {
            const newSize = m.baseSize * scale;
            icon.style.width = newSize + 'px';
            icon.style.height = newSize + 'px';
            icon.style.marginLeft = -(newSize/2) + 'px';
            icon.style.marginTop = -(newSize/2) + 'px';
        }
    });
});
