// Detailed 0 to 10 Danger Color Scale Interpolator (Bright Map Optimized)
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

function generateServerlessData() {
    const points = [];
    
    // 17 Coastal Stations
    const baseEpicenters = [
        [25.15, 121.75], [25.05, 121.1], [24.8, 120.9], [24.6, 120.7],
        [24.3, 120.5], [24.0, 120.3], [23.7, 120.15], [23.45, 120.1],
        [23.0, 120.1], [22.6, 120.25], [22.4, 120.5], [21.9, 120.8],
        [22.3, 120.9], [22.75, 121.15], [23.5, 121.5], [24.0, 121.6], [24.75, 121.85]
    ];
    
    // Close the loop mathematically so we interpolate back to the start!
    const closedEpicenters = [...baseEpicenters, baseEpicenters[0]];
    const coastalEpicenters = [];
    
    const NUM_INTERPOLATIONS = 5; // Predict and fill 5 intermediate points between every station!

    for (let i = 0; i < closedEpicenters.length - 1; i++) {
        const p1 = closedEpicenters[i];
        const p2 = closedEpicenters[i+1];
        
        coastalEpicenters.push(p1);
        
        // Predict / Interpolate mathematically to fill the blank spaces
        for (let j = 1; j <= NUM_INTERPOLATIONS; j++) {
            const fraction = j / (NUM_INTERPOLATIONS + 1);
            const lat = p1[0] + (p2[0] - p1[0]) * fraction;
            const lng = p1[1] + (p2[1] - p1[1]) * fraction;
            coastalEpicenters.push([lat, lng]);
        }
    }

    coastalEpicenters.forEach(center => {
        let lat = center[0];
        let lng = center[1];
        
        // Mathematically calculate the tangent of the shoreline
        const dy = 23.7 - lat;
        const dx = 121.0 - lng;
        const angleToCenterRad = Math.atan2(dy, dx);
        
        // DEEP OFFSHORE PUSH (35km)
        // This guarantees the wave never visually overlaps the landmass, even in concave bays
        const offshoreOffset = 0.35; 
        lat = lat - (Math.sin(angleToCenterRad) * offshoreOffset);
        lng = lng - (Math.cos(angleToCenterRad) * offshoreOffset);

        const angleToCenterDeg = angleToCenterRad * 180 / Math.PI;
        const shorelineAngle = angleToCenterDeg + 90;
        
        // Randomize wave metrics slightly for natural variation
        const intensity = 0.5 + Math.random() * 0.5;
        const wave_height = 0.5 + (Math.random() * 4.0 * intensity) + (intensity * 6.0);
        const wind_speed = 5.0 + (Math.random() * 15.0 * intensity) + (intensity * 20.0);
        
        const weight = Math.min(wave_height / 12.0, 1.0);
        const danger_score = weight * 10.0;
        
        points.push({ lat, lng, wave_height, wind_speed, danger_score, direction: "Onshore", angle: shorelineAngle });
    });
    return { points };
}

const data = generateServerlessData();
const markers = [];

data.points.forEach(d => {
    // Micro-sizing: Waves are extremely tiny and sleek now
    const baseWidth = 20 + (d.wave_height * 0.5); 
    const baseHeight = 20 + (d.wave_height * 0.5);
    
    const color = getDangerColor(d.danger_score, 0.95);
    const flowSpeed = Math.max(0.6, 2.5 - (d.wind_speed * 0.05));
    
    const rotation = d.angle;
    const currentScale = Math.pow(2, map.getZoom() - 7);
    
    const w = baseWidth * currentScale;
    const h = baseHeight * currentScale;
    
    // CRASHING GIF ANIMATION:
    // Instead of moving sideways, the waves move forwards along the Y axis, fading out as they crash!
    const svgHtml = `
        <div style="width: 100%; height: 100%; transform: rotate(${rotation}deg); display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 0 2px ${color});">
            <svg width="100%" height="100%" viewBox="-50 -50 100 100">
                <g stroke="${color}" stroke-width="8" stroke-linecap="round" fill="none">
                    <!-- Crashing Wave 1 -->
                    <path d="M-40 0 Q -20 -15, 0 0 T 40 0">
                        <animateTransform attributeName="transform" type="translate" from="0, -30" to="0, 30" dur="${flowSpeed}s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0; 1; 1; 0" keyTimes="0; 0.2; 0.8; 1" dur="${flowSpeed}s" repeatCount="indefinite" />
                    </path>
                    <!-- Crashing Wave 2 (Staggered to create infinite GIF loop) -->
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
            <b style="color: #0ff;">Coastal Sector Analysis</b><br/>
            Danger Score: <span style="color:${color}; font-weight: bold; font-size: 16px;">${d.danger_score.toFixed(1)} / 10</span><br/><br/>
            📍 Coord: <b>Lat ${d.lat.toFixed(4)}, Lng ${d.lng.toFixed(4)}</b><br/>
            🌊 Wave Height: <b>${d.wave_height.toFixed(1)} m</b><br/>
            💨 Wind Speed: <b>${d.wind_speed.toFixed(1)} m/s (${d.direction})</b>
        </div>
    `;

    const marker = L.marker([d.lat, d.lng], { icon: waveIcon })
        .addTo(map)
        .bindPopup(popupHtml);
        
    markers.push({ layer: marker, baseWidth, baseHeight });
});

// STRICT SCALING ENGINE
map.on('zoom', () => {
    // Leaflet scales exactly 2x per zoom level
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
