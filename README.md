# A3 海象地圖 (Maritime Safety Intel)

A3 海象地圖是一個專為台灣海岸設計的「即時海洋物理模擬與危險預測系統」。本專案結合了台灣中央氣象署 (CWA) 的局部觀測數據，以及哥白尼計畫 (Copernicus) 衛星的深海洋流數據，建立出一個雙因子 (Two-Factor) 綜合物理碰撞引擎，以視覺化呈現台灣周遭海域的波浪流向與潛在危險指數。

🔗 **[即時網頁展示 (Live Demo)](https://hivetea.github.io/-project/)**

---

## 🏗️ 系統架構 (System Architecture)

本專案分為「資料前處理」、「雙因子物理引擎」以及「前端視覺化」三個主要部分。

### 1. 資料管道 (Data Pipeline)
*   **沿海觀測資料擷取 (Python)**:
    *   使用 Python 腳本 (`filter_coast.py`) 串接**中央氣象署 (CWA) Opendata API**。
    *   針對全台 115 個觀測站進行幾何空間過濾，剔除內陸站點，精準抓取沿海觀測站的即時風速與風向資料。
    *   資料清洗後匯出為輕量化的 `frontend/coastal_stations.json` 供前端快速讀取。
*   **深海衛星資料批次請求 (JavaScript)**:
    *   前端引擎啟動時，動態生成涵蓋台灣周遭 30 公里高密度的六角形矩陣 (Hex Grid)。
    *   透過非同步 (Promise.all) 批次向 **Open-Meteo Marine API (Copernicus 衛星)** 請求深海浪高、洋流流速與流向資料。

### 2. 雙因子綜合物理引擎 (Two-Factor Unified Physics Engine)
本專案不依賴單一資料源，而是首創將近海風浪與深海湧浪進行物理碰撞運算：

*   **第一因子：局部風浪 (Local Wind Wave)**
    *   利用**反距離權重插值法 (Inverse Distance Weighting, IDW)** 結合 115 個測站資料，推算出海岸線任意一點的無縫風速。
    *   套用 **Pierson-Moskowitz 頻譜模型**，將風速 (Wind Speed) 轉換為物理浪高 (Wave Height)，計算出基礎海岸危險指數。
*   **第二因子：外海湧浪碰撞 (Offshore Swell Collision)**
    *   **射線投射算法 (Ray-casting / Point-in-Polygon)**：導入台灣 GeoJSON 邊界，判斷並過濾陸地座標。
    *   **向量內積碰撞運算 (Vector Dot Product)**：系統會自動掃描海岸線外圍 40 公里內的深海衛星節點。若偵測到強烈洋流的向量 (Flow Vector) 垂直撞擊海岸的法向量 (Inland Normal)，引擎會將深海的動能轉移至海岸，瞬間將該區段的浪高與危險指數大幅提升，並發出「⚠️ 偵測到外海湧浪碰撞」的警報。
    *   **海岸線偏折 (Coastal Deflection)**：當深海洋流撞擊台灣陸地邊界時，物理引擎會強制將洋流向量偏折，使其沿著海岸線平行流動 (Tangent Flow)。

### 3. 前端動態視覺化 (Frontend Visualization)
*   **純前端技術棧**: 100% 使用 Vanilla JavaScript, HTML5 與 CSS3 開發，無需複雜的前端框架即可達到極高能效。
*   **地圖引擎**: 底層採用 `Leaflet.js`，並客製化覆寫深色模式 (Dark Theme) 與無縫平移體驗。
*   **SVG 微型動態粒子 (SVG Animation Nodes)**:
    *   將物理引擎的參數 (浪高、流速、碰撞狀態) 直接映射到 SVG 標籤的 CSS 屬性上。
    *   使用 `<animateTransform>` 實作基於真實流速 (Ocean Current Velocity) 的不間斷推進動畫。
    *   色彩梯度 (Color Gradients)：依據 0~10 的綜合危險指數，渲染從安全的霓虹藍到極度危險的警示紅。

---

## 🛠️ 技術棧 (Technologies Used)

### Backend / Data Processing
*   **Python 3**
*   **Requests** (HTTP Library)
*   **CWA API** (Taiwan Central Weather Administration Open Data)

### Frontend / WebGL
*   **Vanilla JavaScript (ES6+)**
*   **HTML5 / CSS3** (Keyframe Animations, SVG rendering)
*   **Leaflet.js** (Web Mapping Library)
*   **Open-Meteo Marine API** (Copernicus Marine Environment Monitoring Service)

---

## 🚀 本地端執行 (Local Development)

1. 克隆此專案後，先執行 Python 腳本抓取最新的氣象署資料：
    ```bash
    python filter_coast.py
    ```
2. 使用任何本地端伺服器 (Local Web Server) 運行 `frontend` 資料夾。例如使用 Python 內建的 HTTP Server：
    ```bash
    cd frontend
    python -m http.server 8000
    ```
3. 打開瀏覽器訪問 `http://localhost:8000` 即可檢視即時的海象模擬引擎。
