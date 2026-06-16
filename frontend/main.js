// Maps a danger weight (0.0 to 1.0) to a gradient optimized for Light Maps
const colorInterpolator = t => {
    if (t < 0.5) return `rgba(20, 100, 255, 0.95)`;  // Safe: Blue
    else if (t < 0.8) return `rgba(255, 140, 0, 0.95)`; // Caution: Orange
    else return `rgba(255, 30, 30, 0.95)`;           // Danger: Red
};

const spriteColorInterpolator = t => {
    if (t < 0.5) return `rgb(20, 100, 255)`;
    else if (t < 0.8) return `rgb(255, 140, 0)`;
    else return `rgb(255, 30, 30)`;
};

// Initialize Leaflet Map (Centered on Taiwan)
const map = L.map('globeViz', {
    center: [23.7, 121.0],
    zoom: 7,
    zoomControl: false // Cleaner UI
});

// Add Light Mode Base Map (CartoDB Light All)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Serverless Data Engine (Continuous Predictive Grid with Land Masking)
function generateServerlessData() {
    const points = [];
    
    // Strict Taiwan Bounding Polygon (With safety margin to prevent inland waves)
    const taiwanPolygon = [
        [25.4, 121.7], [25.1, 120.8], [24.5, 120.1], [24.0, 119.8],
        [23.5, 119.7], [23.0, 119.8], [22.4, 120.0], [21.8, 120.6],
        [22.2, 121.2], [23.0, 121.5], [24.0, 121.8], [24.5, 122.1], [25.2, 122.2], [25.4, 121.7]
    ];

    // Standard Ray-Casting algorithm for Point-In-Polygon
    function isPointInPolygon(lat, lng, vs) {
        let inside = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            let xi = vs[i][0], yi = vs[i][1];
            let xj = vs[j][0], yj = vs[j][1];
            let intersect = ((yi > lng) != (yj > lng)) && (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    // Generate dense ocean grid around Taiwan
    for (let lat = 21.2; lat <= 26.0; lat += 0.35) {
        for (let lng = 119.0; lng <= 123.0; lng += 0.35) {
            
            // Subtle organic jitter so it doesn't look like a robotic grid
            const jLat = lat + (Math.random() * 0.1 - 0.05);
            const jLng = lng + (Math.random() * 0.1 - 0.05);

            // Land Mask: Skip if point lands on Taiwan island
            if (isPointInPolygon(jLat, jLng, taiwanPolygon)) continue;
            
            // Calculate distance to center (Taiwan) to increase intensity near the coast
            const distLat = Math.abs(23.7 - jLat);
            const distLng = Math.abs(121.0 - jLng);
            const dist = Math.sqrt(distLat*distLat + distLng*distLng);
            const intensity = Math.max(0.2, 1.0 - (dist / 3.0));
            
            const wave_height = 0.5 + (Math.random() * 4.0 * intensity) + (intensity * 6.0);
            const wind_speed = 5.0 + (Math.random() * 15.0 * intensity) + (intensity * 20.0);
            const weight = Math.min(wave_height / 12.0, 1.0);
            
            // Kuroshio Current Vector Field (Flows continuously North/Northeast)
            const wind_angle = 20 + Math.random() * 40; // 20 to 60 degrees (Northeast)
            
            let directionLabel = "NE";
            if (wind_angle < 30) directionLabel = "NNE";
            if (wind_angle > 50) directionLabel = "ENE";
            
            points.push({ lat: jLat, lng: jLng, wave_height, wind_speed, weight, direction: directionLabel, angle: wind_angle });
        }
    }
    
    return { points };
}

// Render Data to Leaflet
const data = generateServerlessData();

data.points.forEach(d => {
    // Porthole size based on wave intensity
    const size = 35 + (d.wave_height * 3); 
    const color = spriteColorInterpolator(d.weight);
    
    // CSS flow animation speed based strictly on wind speed (faster wind = faster scroll)
    const flowSpeed = Math.max(0.3, 2.5 - (d.wind_speed * 0.05));
    
    // Rotate the entire porthole so the water flows towards the wind angle.
    // The SVG paths flow right (+X). 0 degrees = East. We rotate by (angle - 90) to align with North/Northeast.
    const rotation = d.angle - 90;
    
    // Generates a literal circular porthole filled with seamlessly flowing stacked sine waves
    const svgHtml = `
        <div style="width: ${size}px; height: ${size}px; border-radius: 50%; overflow: hidden; transform: rotate(${rotation}deg); background: rgba(0,0,0,0.02); border: 2px solid ${colorInterpolator(d.weight)}; box-shadow: 0 0 8px ${colorInterpolator(d.weight)};">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
                <g stroke="${color}" stroke-width="8" fill="none" style="animation: flow ${flowSpeed}s linear infinite;">
                    <path d="M-100 30 Q -75 10, -50 30 T 0 30 T 50 30 T 100 30 T 150 30 T 200 30" />
                    <path d="M-100 50 Q -75 30, -50 50 T 0 50 T 50 50 T 100 50 T 150 50 T 200 50" />
                    <path d="M-100 70 Q -75 50, -50 70 T 0 70 T 50 70 T 100 70 T 150 70 T 200 70" />
                </g>
            </svg>
        </div>
    `;

    // Create a Custom Leaflet Icon
    const waveIcon = L.divIcon({
        html: svgHtml,
        className: 'custom-wave-icon',
        iconSize: [size, size],
        iconAnchor: [size/2, size/2], // Center perfectly over the lat/lng
        popupAnchor: [0, -size/2]
    });

    const risk = Math.min(d.weight, 1.0);
    let riskLabel = "Safe (Calm Waters)";
    if (risk > 0.5) riskLabel = "Caution (Heavy Weather)";
    if (risk > 0.8) riskLabel = "Danger (Rogue Waves)";

    const popupHtml = `
        <div style="font-size: 13px;">
            <b style="color: #0ff;">Maritime Sector Analysis</b><br/>
            Status: <span style="color:${colorInterpolator(risk)}; font-weight: bold;">${riskLabel}</span><br/><br/>
            📍 Coord: <b>Lat ${d.lat.toFixed(4)}, Lng ${d.lng.toFixed(4)}</b><br/>
            🌊 Wave Height: <b>${d.wave_height.toFixed(1)} m</b><br/>
            💨 Wind Speed: <b>${d.wind_speed.toFixed(1)} m/s (${d.direction})</b>
        </div>
    `;

    // Add marker to map
    L.marker([d.lat, d.lng], { icon: waveIcon })
        .addTo(map)
        .bindPopup(popupHtml);
});
