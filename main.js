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

// Initialize Globe
const world = Globe()(document.getElementById('globeViz'))
    .backgroundColor('#050510')
    .showGlobe(true)
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-water.png')
    
    // Wave Image (HTML DOM Elements - 100% crash proof from WebGL conflicts)
    .htmlElementsData([])
    .htmlLat('lat')
    .htmlLng('lng')
    .htmlAltitude(0)
    .htmlElement(d => {
        const el = document.createElement('div');
        const size = 16 + (d.wave_height * 6); // Pixel size of the wave image
        const color = spriteColorInterpolator(d.weight);
        
        // Explicitly size the container so Globe.gl knows how to project it
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.pointerEvents = 'none'; // Let the invisible point below handle hover
        
        // Fluid Animated SVG - Dynamic Color, Perfect Transparency, Liquid Animation
        const duration = 1.0 + ((1.0 - d.weight) * 2.0); // Dangerous = 1s fast ripple. Calm = 3s slow swell.
        const heaveSpeed = 1.5 + Math.abs((d.lng % 2)); // Dynamic CSS heave speed
        
        // Note the transform: translate(-50%, -50%) to perfectly center the wave over the coordinate
        el.innerHTML = `
            <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="animation: heave ${heaveSpeed}s infinite alternate ease-in-out; filter: drop-shadow(0 0 12px ${color}); opacity: 0.9; transform: translate(-50%, -50%);">
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
        
        return el;
    })
    
    // Glowing Hover Cores (For precise Lat/Lng tooltips)
    .pointsData([])
    .pointColor(() => 'rgba(255, 255, 255, 0.01)') // Almost invisible
    .pointRadius(1.2)
    .pointAltitude(0.01)
    .pointLabel(d => {
        const risk = Math.min(d.weight, 1.0);
        let riskLabel = "Safe (Calm Waters)";
        if (risk > 0.5) riskLabel = "Caution (Heavy Weather)";
        if (risk > 0.8) riskLabel = "Danger (Rogue Waves)";

        return `
            <div class="globe-tooltip">
                <b>Maritime Sector Analysis</b><br/>
                Status: <span style="color:${colorInterpolator(risk)}">${riskLabel}</span><br/><br/>
                📍 Coord: <b>Lat ${d.lat.toFixed(4)}, Lng ${d.lng.toFixed(4)}</b><br/>
                🌊 Wave Height: ${d.wave_height.toFixed(1)} m<br/>
                💨 Wind Speed: ${d.wind_speed.toFixed(1)} m/s (${d.direction})
            </div>
        `;
    })
    
    // Wind Flow Animation (Arcs)
    .arcStartLat('start_lat')
    .arcStartLng('start_lng')
    .arcEndLat('end_lat')
    .arcEndLng('end_lng')
    .arcColor('color')
    .arcDashLength(0.1) // Shortened as requested
    .arcDashGap(1)      // Shortened gap
    .arcDashInitialGap(() => Math.random() * 2)
    .arcDashAnimateTime(1000)
    .arcAltitude(0.015)
    .arcStroke(0.3);

// Add custom white landmasses
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
    .then(res => res.json())
    .then(countries => {
        world.polygonsData(countries.features)
            .polygonCapColor(() => '#ffffff')
            .polygonSideColor(() => 'rgba(200, 200, 200, 0.1)')
            .polygonStrokeColor(() => 'rgba(150, 150, 150, 0.3)')
            .polygonAltitude(0.01);
    });

// Serverless Data Engine (Ported from Rust)
function generateServerlessData() {
    const points = [];
    const arcs = [];
    
    // Epicenters strictly in deep ocean (Tightened to avoid any land clipping)
    const epicenters = [
        [40.0, -40.0, 10.0],    // North Atlantic
        [0.0, -30.0, 15.0],     // Central Atlantic
        [-45.0, 0.0, 15.0],     // South Atlantic / Southern Ocean
        [-25.0, 80.0, 15.0],    // Indian Ocean
        [40.0, 175.0, 15.0],    // North Pacific (Moved East to avoid Russia/Japan)
        [0.0, -150.0, 25.0],    // Central Pacific
        [-40.0, -130.0, 20.0],  // South Pacific
        [-10.0, -100.0, 15.0],  // East Pacific
        [-55.0, 120.0, 10.0],   // Southern Ocean
    ];

    for (let i = 0; i < 350; i++) {
        const center = epicenters[Math.floor(Math.random() * epicenters.length)];
        
        const lat_offset = (Math.random() * 2 - 1) * center[2];
        const lng_offset = (Math.random() * 2 - 1) * center[2];
        
        const lat = center[0] + lat_offset;
        const lng = center[1] + lng_offset;
        
        const dist = Math.sqrt((lat_offset * lat_offset) + (lng_offset * lng_offset)) / center[2];
        const intensity = 1.0 - Math.min(dist, 1.0);
        
        const wave_height = 0.5 + (Math.random() * 4.0 * intensity) + (intensity * 6.0);
        const wind_speed = 5.0 + (Math.random() * 15.0 * intensity) + (intensity * 20.0);
        const weight = Math.min(wave_height / 12.0, 1.0);
        
        const arc_dist = 5.0 + (wind_speed * 0.1);
        const angle = Math.random() * Math.PI * 2;
        const end_lat = lat + (Math.sin(angle) * arc_dist);
        const end_lng = lng + (Math.cos(angle) * arc_dist);
        
        const color = `rgba(255, 255, 255, ${Math.min(weight, 0.8)})`;
        
        points.push({ lat, lng, wave_height, wind_speed, weight, direction: "N" });
        arcs.push({ start_lat: lat, start_lng: lng, end_lat, end_lng, color });
    }
    
    return { points, arcs };
}

// Initialize the Globe exactly ONCE to prevent 350 DOM elements from continuously crashing and respawning
setTimeout(() => {
    const data = generateServerlessData();
    world.htmlElementsData(data.points);
    world.pointsData(data.points);
    world.arcsData(data.arcs);
}, 500); // 500ms delay ensures the Globe.gl WebGL camera is fully locked and mounted before projection math runs!

// Auto-rotate majestically (Very slow speed requested by user)
world.controls().autoRotate = true;
world.controls().autoRotateSpeed = 0.05;
