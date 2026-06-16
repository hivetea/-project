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
        { val: 0.0, color: [20, 100, 255] },   // 0: Deep Blue (Safe)
        { val: 2.5, color: [0, 255, 255] },    // 2.5: Cyan
        { val: 5.0, color: [255, 255, 0] },    // 5: Yellow
        { val: 7.5, color: [255, 140, 0] },    // 7.5: Orange
        { val: 10.0, color: [255, 30, 30] }    // 10: Red (Extreme Danger)
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

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

function generateServerlessData() {
    const points = [];
    
    // Strict Taiwan Bounding Polygon
    const taiwanPolygon = [
        [25.4, 121.7], [25.1, 120.8], [24.5, 120.1], [24.0, 119.8],
        [23.5, 119.7], [23.0, 119.8], [22.4, 120.0], [21.8, 120.6],
        [22.2, 121.2], [23.0, 121.5], [24.0, 121.8], [24.5, 122.1], [25.2, 122.2], [25.4, 121.7]
    ];

    function isPointInPolygon(lat, lng, vs) {
        let inside = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            let xi = vs[i][0], yi = vs[i][1], xj = vs[j][0], yj = vs[j][1];
            if (((yi > lng) != (yj > lng)) && (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi)) inside = !inside;
        }
        return inside;
    }

    // Generate grid
    for (let lat = 21.2; lat <= 26.0; lat += 0.35) {
        for (let lng = 119.0; lng <= 123.0; lng += 0.35) {
            const jLat = lat + (Math.random() * 0.1 - 0.05);
            const jLng = lng + (Math.random() * 0.1 - 0.05);

            if (isPointInPolygon(jLat, jLng, taiwanPolygon)) continue;
            
            const distLat = Math.abs(23.7 - jLat);
            const distLng = Math.abs(121.0 - jLng);
            const dist = Math.sqrt(distLat*distLat + distLng*distLng);
            const intensity = Math.max(0.2, 1.0 - (dist / 3.0));
            
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
            
            points.push({ lat: jLat, lng: jLng, wave_height, wind_speed, danger_score, direction: directionLabel, angle: wind_angle });
        }
    }
    return { points };
}

const data = generateServerlessData();

data.points.forEach(d => {
    const size = 35 + (d.wave_height * 3); 
    const color = getDangerColor(d.danger_score, 1.0);
    const borderColor = getDangerColor(d.danger_score, 0.8);
    
    const flowSpeed = Math.max(0.3, 2.5 - (d.wind_speed * 0.05));
    
    // Rotate <div> so SVG flows toward wind angle
    const rotation = d.angle - 90;
    
    // Using 100% reliable <animateTransform> instead of CSS @keyframes to guarantee SVG flow animation on all browsers
    const svgHtml = `
        <div style="width: ${size}px; height: ${size}px; border-radius: 50%; overflow: hidden; transform: rotate(${rotation}deg); background: rgba(0,0,0,0.02); border: 2px solid ${borderColor}; box-shadow: 0 0 8px ${borderColor};">
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

    L.marker([d.lat, d.lng], { icon: waveIcon })
        .addTo(map)
        .bindPopup(popupHtml);
});
