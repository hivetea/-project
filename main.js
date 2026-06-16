// Maps a danger weight (0.0 to 1.0) to a gradient: White -> Orange -> Dark Red
const colorInterpolator = t => {
    if (t < 0.5) {
        const ratio = t * 2.0;
        const r = 255;
        const g = Math.round(255 - (90 * ratio));
        const b = Math.round(255 - (255 * ratio));
        return `rgba(${r}, ${g}, ${b}, ${0.8})`; 
    } else {
        const ratio = (t - 0.5) * 2.0;
        const r = Math.round(255 - (75 * ratio));
        const g = Math.round(165 - (165 * ratio));
        const b = 0;
        return `rgba(${r}, ${g}, ${b}, ${0.9})`;
    }
};

const spriteColorInterpolator = t => {
    if (t < 0.5) {
        const ratio = t * 2.0;
        const r = 255;
        const g = Math.round(255 - (90 * ratio));
        const b = Math.round(255 - (255 * ratio));
        return `rgb(${r}, ${g}, ${b})`; 
    } else {
        const ratio = (t - 0.5) * 2.0;
        const r = Math.round(255 - (75 * ratio));
        const g = Math.round(165 - (165 * ratio));
        const b = 0;
        return `rgb(${r}, ${g}, ${b})`;
    }
};

// Initialize Leaflet Map (Centered on Taiwan)
const map = L.map('globeViz', {
    center: [23.7, 121.0],
    zoom: 8,
    zoomControl: false // Cleaner UI
});

// Add Dark Mode Base Map (CartoDB Dark Matter)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Serverless Data Engine (Focused on Taiwan Coast)
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

    // 0.18 mathematical degrees is roughly 20km!
    const radius = 0.18;

    for (let i = 0; i < 350; i++) {
        const center = coastalEpicenters[Math.floor(Math.random() * coastalEpicenters.length)];
        
        // Random polar coordinates within the 20km radius
        const r = Math.random() * radius;
        const theta = Math.random() * Math.PI * 2;
        
        const lat_offset = r * Math.sin(theta);
        const lng_offset = r * Math.cos(theta);
        
        const lat = center[0] + lat_offset;
        const lng = center[1] + lng_offset;
        
        const intensity = 1.0 - (r / radius); // Stronger near the coast
        
        const wave_height = 0.5 + (Math.random() * 4.0 * intensity) + (intensity * 6.0);
        const wind_speed = 5.0 + (Math.random() * 15.0 * intensity) + (intensity * 20.0);
        const weight = Math.min(wave_height / 12.0, 1.0);
        
        // Arc distance scaled for local 2D view
        const arc_dist = 0.05 + (wind_speed * 0.005);
        const angle = Math.random() * Math.PI * 2;
        const end_lat = lat + (Math.sin(angle) * arc_dist);
        const end_lng = lng + (Math.cos(angle) * arc_dist);
        
        const color = `rgba(255, 255, 255, ${Math.min(weight, 0.8)})`;
        
        points.push({ lat, lng, wave_height, wind_speed, weight, direction: "N" });
        arcs.push({ start_lat: lat, start_lng: lng, end_lat, end_lng, color });
    }
    
    return { points, arcs };
}

// Render Data to Leaflet
const data = generateServerlessData();

data.points.forEach(d => {
    const size = 16 + (d.wave_height * 6); // Pixel size of the wave image
    const color = spriteColorInterpolator(d.weight);
    
    // Fluid Animated SVG - Dynamic Color, Perfect Transparency, Liquid Animation
    const duration = 1.0 + ((1.0 - d.weight) * 2.0); // Dangerous = 1s fast ripple. Calm = 3s slow swell.
    const heaveSpeed = 1.5 + Math.abs((d.lng % 2)); // Dynamic CSS heave speed
    
    const svgHtml = `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="animation: heave ${heaveSpeed}s infinite alternate ease-in-out; filter: drop-shadow(0 0 12px ${color}); opacity: 0.9;">
          <path fill="${color}" d="M0 60 Q 25 40, 50 60 T 100 60 L 100 100 L 0 100 Z">
            <animate attributeName="d" 
              values="
                M0 60 Q 25 40, 50 60 T 100 60 L 100 100 L 0 100 Z;
                M0 60 Q 25 80, 50 60 T 100 60 L 100 100 L 0 100 Z;
                M0 60 Q 25 40, 50 60 T 100 60 L 100 100 L 0 100 Z" 
              dur="${duration}s" 
              repeatCount="indefinite" />
          </path>
        </svg>
    `;

    // Create a Custom Leaflet Icon using our SVG
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
        weight: 1.5,
        opacity: 0.6,
        dashArray: '4, 6', // Simulated dashed wind lines
        lineCap: 'round'
    }).addTo(map);
});
