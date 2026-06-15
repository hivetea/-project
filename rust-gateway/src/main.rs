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

/// Request parameters for the maritime analysis endpoint.
#[derive(Deserialize)]
pub struct LocationQuery {
    lat: f64,
    lon: f64,
}

/// Normalized weather data payload to be sent to the RAG engine.
#[derive(Serialize, Deserialize, Debug)]
pub struct NormalizedWeatherData {
    pub latitude: f64,
    pub longitude: f64,
    pub wind_speed: f64,
    pub wind_direction: String,
    pub wave_height: f64,
    pub tide_status: String,
}

/// Response format from the Python RAG microservice.
#[derive(Serialize, Deserialize)]
pub struct RagResponse {
    pub risk_level: String,
    pub matched_rules: Vec<String>,
    pub navigational_advice: String,
}

/// Custom Error type for API Gateway.
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

/// Mocks fetching meteorological data from the Central Weather Administration (CWA).
async fn fetch_cwa_data(_lat: f64, _lon: f64) -> Result<(f64, String), GatewayError> {
    // Simulate network delay
    tokio::time::sleep(std::time::Duration::from_millis(50)).await;
    // Mock data: Wind speed 8.5 m/s, direction NE
    Ok((8.5, "Northeast".to_string()))
}

/// Mocks fetching maritime data from the Windy API.
async fn fetch_windy_data(_lat: f64, _lon: f64) -> Result<(f64, String), GatewayError> {
    // Simulate network delay
    tokio::time::sleep(std::time::Duration::from_millis(40)).await;
    // Mock data: Wave height 3.2 meters, Ebbing tide
    Ok((3.2, "Ebbing".to_string()))
}

/// Sends normalized data to the Python RAG engine for analysis.
async fn query_rag_engine(data: &NormalizedWeatherData) -> Result<RagResponse, GatewayError> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:8000/api/v1/rag/analyze")
        .json(data)
        .send()
        .await
        .map_err(|e| GatewayError::RagEngineError(format!("Failed to connect to RAG engine: {}", e)))?;

    if res.status().is_success() {
        let rag_response = res.json::<RagResponse>().await
            .map_err(|e| GatewayError::RagEngineError(format!("Failed to parse RAG response: {}", e)))?;
        Ok(rag_response)
    } else {
        Err(GatewayError::RagEngineError(format!("RAG engine returned status: {}", res.status())))
    }
}

/// Handler for the /api/v1/maritime/analysis endpoint.
async fn analyze_maritime_condition(Query(params): Query<LocationQuery>) -> Result<Json<RagResponse>, GatewayError> {
    // Concurrently fetch data from multiple mock sources
    let (cwa_res, windy_res) = tokio::join!(
        fetch_cwa_data(params.lat, params.lon),
        fetch_windy_data(params.lat, params.lon)
    );

    let (wind_speed, wind_direction) = cwa_res?;
    let (wave_height, tide_status) = windy_res?;

    // Normalize and aggregate data
    let normalized_data = NormalizedWeatherData {
        latitude: params.lat,
        longitude: params.lon,
        wind_speed,
        wind_direction,
        wave_height,
        tide_status,
    };

    // Forward to RAG Engine
    let recommendation = query_rag_engine(&normalized_data).await?;

    Ok(Json(recommendation))
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/api/v1/maritime/analysis", get(analyze_maritime_condition));

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    println!("API Gateway running on http://{}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
