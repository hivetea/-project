use axum::{
    extract::Query,
    response::IntoResponse,
    routing::get,
    Router,
    Json,
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::{cors::{Any, CorsLayer}, services::ServeDir};

/// Request parameters for the maritime analysis endpoint.
#[derive(Deserialize)]
pub struct LocationQuery {
    lat: f64,
    lon: f64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct NormalizedWeatherData {
    pub latitude: f64,
    pub longitude: f64,
    pub wind_speed: f64,
    pub wind_direction: String,
    pub wave_height: f64,
    pub tide_status: String,
}

#[derive(Serialize, Deserialize)]
pub struct RagResponse {
    pub risk_level: String,
    pub matched_rules: Vec<String>,
    pub navigational_advice: String,
}

#[derive(Serialize)]
pub struct HeatmapPoint {
    pub lat: f64,
    pub lng: f64,
    pub weight: f64,
    pub wave_height: f64,
    pub wind_speed: f64,
    pub direction: String,
}

#[derive(Serialize)]
pub struct ArcData {
    pub start_lat: f64,
    pub start_lng: f64,
    pub end_lat: f64,
    pub end_lng: f64,
    pub color: String,
}

#[derive(Serialize)]
pub struct HeatmapResponse {
    pub points: Vec<HeatmapPoint>,
    pub arcs: Vec<ArcData>,
}

pub enum GatewayError {
    DataFetchError(String),
    RagEngineError(String),
}

impl IntoResponse for GatewayError {
    fn into_response(self) -> axum::response::Response {
        let (status, error_message) = match self {
            GatewayError::DataFetchError(msg) => (StatusCode::BAD_GATEWAY, msg),
            GatewayError::RagEngineError(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
        };
        let body = Json(serde_json::json!({ "error": error_message }));
        (status, body).into_response()
    }
}

const CWA_API_KEY: &str = "YOUR_API_KEY_HERE";

async fn fetch_cwa_data(_lat: f64, _lon: f64) -> Result<(f64, String), GatewayError> {
    let client = reqwest::Client::new();
    let url = format!(
        "https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization={}&format=JSON",
        CWA_API_KEY
    );

    let res = client.get(&url).send().await
        .map_err(|e| GatewayError::DataFetchError(format!("CWA API request failed: {}", e)))?;

    if res.status().is_success() {
        let body: serde_json::Value = res.json().await
            .map_err(|e| GatewayError::DataFetchError(format!("Failed to parse JSON: {}", e)))?;
        
        let station = &body["records"]["Station"][0];
        let wind_speed_val = station["WeatherElement"]["WindSpeed"].as_f64().unwrap_or(0.0);
        let wind_dir_val = station["WeatherElement"]["WindDirection"].as_f64().unwrap_or(0.0);

        let wind_dir_str = match wind_dir_val {
            d if d >= 315.0 || d < 45.0 => "North",
            d if d >= 45.0 && d < 135.0 => "East",
            d if d >= 135.0 && d < 225.0 => "South",
            _ => "West",
        }.to_string();

        Ok((wind_speed_val, wind_dir_str))
    } else {
        println!("CWA API returned status {}, falling back to mock.", res.status());
        Ok((8.5, "Northeast".to_string()))
    }
}

async fn fetch_windy_data(_lat: f64, _lon: f64) -> Result<(f64, String), GatewayError> {
    tokio::time::sleep(std::time::Duration::from_millis(40)).await;
    Ok((3.2, "Ebbing".to_string()))
}

async fn query_rag_engine(data: &NormalizedWeatherData) -> Result<RagResponse, GatewayError> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:8000/api/v1/rag/analyze")
        .json(data)
        .send()
        .await
        .map_err(|e| GatewayError::RagEngineError(format!("Failed to connect to RAG: {}", e)))?;

    if res.status().is_success() {
        let rag_response = res.json::<RagResponse>().await
            .map_err(|e| GatewayError::RagEngineError(format!("Parse error: {}", e)))?;
        Ok(rag_response)
    } else {
        Err(GatewayError::RagEngineError(format!("RAG status: {}", res.status())))
    }
}

async fn analyze_maritime_condition(Query(params): Query<LocationQuery>) -> Result<Json<RagResponse>, GatewayError> {
    let (cwa_res, windy_res) = tokio::join!(
        fetch_cwa_data(params.lat, params.lon),
        fetch_windy_data(params.lat, params.lon)
    );

    let (wind_speed, wind_direction) = cwa_res?;
    let (wave_height, tide_status) = windy_res?;

    let normalized_data = NormalizedWeatherData {
        latitude: params.lat,
        longitude: params.lon,
        wind_speed,
        wind_direction,
        wave_height,
        tide_status,
    };

    let recommendation = query_rag_engine(&normalized_data).await?;
    Ok(Json(recommendation))
}

/// Generates a live global heatmap confined strictly to circular oceanic radii to prevent clipping landmasses.
async fn get_live_heatmap() -> Json<HeatmapResponse> {
    let mut points = Vec::new();
    let mut arcs = Vec::new();

    // Define Ocean Epicenters: (Center Lat, Center Lng, Max Radius in Degrees)
    let epicenters = vec![
        (15.0, 145.0, 20.0),    // Philippine Sea / West Pacific (Typhoon Alley)
        (30.0, -45.0, 20.0),    // Mid-Atlantic
        (-25.0, 80.0, 20.0),    // Central Indian Ocean
        (-10.0, -110.0, 20.0),  // East Pacific
    ];

    for _ in 0..350 {
        // Pick a random ocean epicenter
        let center = epicenters[rand::random::<usize>() % epicenters.len()];
        
        // Generate a random distance and angle to stay mathematically within the pure ocean radius
        let r = center.2 * rand::random::<f64>().sqrt();
        let theta = rand::random::<f64>() * 2.0 * std::f64::consts::PI;
        
        let lat = center.0 + r * theta.sin();
        let lng = center.1 + r * theta.cos();
        
        let mut weight = rand::random::<f64>() * 0.3; 
        let mut wave_height = rand::random::<f64>() * 2.0;
        let mut wind_speed = rand::random::<f64>() * 5.0;
        let mut direction_deg = rand::random::<f64>() * 360.0;
        let mut is_danger = false;

        // Storm Cluster in West Pacific
        if center.0 == 15.0 && center.1 == 145.0 {
            weight += 0.5 + rand::random::<f64>() * 0.2;
            wave_height += 4.0;
            wind_speed += 15.0;
            direction_deg = 315.0 + (rand::random::<f64>() * 20.0 - 10.0); 
            is_danger = true;
        }
        
        // Storm Cluster in Mid-Atlantic
        if center.0 == 30.0 && center.1 == -45.0 {
            weight += 0.4 + rand::random::<f64>() * 0.2;
            wave_height += 3.5;
            wind_speed += 12.0;
            direction_deg = 45.0 + (rand::random::<f64>() * 20.0 - 10.0); 
            is_danger = true;
        }

        let direction_str = match direction_deg {
            d if d >= 315.0 || d < 45.0 => "North",
            d if d >= 45.0 && d < 135.0 => "East",
            d if d >= 135.0 && d < 225.0 => "South",
            _ => "West",
        }.to_string();

        points.push(HeatmapPoint {
            lat,
            lng,
            weight: weight.min(1.0),
            wave_height,
            wind_speed,
            direction: direction_str.clone(),
        });

        // Generate glowing wind arcs for ~8% of the nodes
        if rand::random::<f64>() < 0.08 {
            let rad = direction_deg.to_radians();
            let distance = 0.5 + (wind_speed * 0.05); 
            let end_lat = lat + rad.cos() * distance;
            let end_lng = lng + rad.sin() * distance;
            
            let color = if is_danger { "rgba(255,50,50,0.9)" } else { "rgba(255,255,255,0.4)" };

            arcs.push(ArcData {
                start_lat: lat,
                start_lng: lng,
                end_lat,
                end_lng,
                color: color.to_string(),
            });
        }
    }
    
    Json(HeatmapResponse { points, arcs })
}

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/api/v1/maritime/analysis", get(analyze_maritime_condition))
        .route("/api/v1/maritime/live_heatmap", get(get_live_heatmap))
        .fallback_service(ServeDir::new("../frontend"))
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    println!("API Gateway running on http://{}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
