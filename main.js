// Maps a danger weight (0.0 to 1.0) to a gradient optimized for Light Maps: Deep Blue -> Orange -> Red
const colorInterpolator = t => {
    if (t < 0.5) return `rgba(20, 100, 255, 0.9)`;  // Safe: Blue
    else if (t < 0.8) return `rgba(255, 140, 0, 0.9)`; // Caution: Orange
    else return `rgba(255, 30, 30, 0.9)`;           // Danger: Red
};

const spriteColorInterpolator = t => {
    if (t < 0.5) return `rgb(20, 100, 255)`;
    else if (t < 0.8) return `rgb(255, 140, 0)`;
    else return `rgb(255, 30, 30)`;
};

// Initialize Leaflet Map (Centered on Taiwan)
const map = L.map('globeViz', {
    center: [23.7, 121.0],
    zoom: 8,
    zoomControl: false // Cleaner UI
});

// Add Light Mode Base Map (CartoDB Light All) - Much brighter and cleaner
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Serverless Data Engine (Balanced: Exactly 1 Wave per Station)
function generateServerlessData() {
    const points = [];
    const arcs = [];
    
    // Coastal Epicenters tightly wrapping the Taiwan Island
    const coastalEpicenters = [
        [25.15, 121.75], // Keelung
        [25.05, 121.1],  // Taoyuan
        [24.8, 120.9],   // Hsinchu
        [24.6, 120.7],   // Miaoli
        [24.3, 120.5],   // Taichung
        [24.0, 120.3],   // Changhua
        [23.7, 120.15],  // Yunlin
        [23.45, 120.1],  // Chiayi
        [23.0, 120.1],   // Tainan
        [22.6, 120.25],  // Kaohsiung
        [22.4, 120.5],   // Pingtung
        [21.9, 120.8],   // Kenting
        [22.3, 120.9],   // Taitung S
        [22.75, 121.15], // Taitung
        [23.5, 121.5],   // Hualien S
        [24.0, 121.6],   // Hualien
        [24.75, 121.85]  // Yilan
    ];

    coastalEpicenters.forEach(center => {
        // Place exactly one wave per station to perfectly balance the map and instantly eliminate DOM lag
        const lat = center[0];
        const lng = center[1];
        
        // Slightly random intensity for realism
        const intensity = 0.5 + Math.random() * 0.5;
        
        const wave_height = 0.5 + (Math.random() * 4.0 * intensity) + (intensity * 6.0);
        const wind_speed = 5.0 + (Math.random() * 15.0 * intensity) + (intensity * 20.0);
        const weight = Math.min(wave_height / 12.0, 1.0);
        
        // Arc distance scaled for local 2D view
        const arc_dist = 0.2 + (wind_speed * 0.01);
        const angle = Math.random() * Math.PI * 2;
        const end_lat = lat + (Math.sin(angle) * arc_dist);
        const end_lng = lng + (Math.cos(angle) * arc_dist);
        
        const color = colorInterpolator(weight); // Use alpha version for arcs
        
        points.push({ lat, lng, wave_height, wind_speed, weight, direction: "N" });
        arcs.push({ start_lat: lat, start_lng: lng, end_lat, end_lng, color });
    });
    
    return { points, arcs };
}

// Render Data to Leaflet
const data = generateServerlessData();

data.points.forEach(d => {
    const size = 20 + (d.wave_height * 4); // Pixel size of the wave image
    const color = spriteColorInterpolator(d.weight);
    
    // Fluid Animated SVG - Genuine Wave Shape with smooth bobbing
    const heaveSpeed = 1.0 + Math.abs((d.lng % 2)); // Dynamic CSS heave speed
    
    const svgHtml = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: heave ${heaveSpeed}s infinite alternate ease-in-out; filter: drop-shadow(0 0 4px ${color}); opacity: 0.95;">
            <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
            <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
            <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
        </svg>
    `;

    // Create a Custom Leaflet Icon using our exact SVG
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

// Render Wind Arcs as Leaflet Polylines
data.arcs.forEach(arc => {
    L.polyline([
        [arc.start_lat, arc.start_lng],
        [arc.end_lat, arc.end_lng]
    ], {
        color: arc.color,
        weight: 2,
        opacity: 0.8,
        dashArray: '4, 6', // Simulated dashed wind lines
        lineCap: 'round'
    }).addTo(map);
});
