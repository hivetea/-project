# A3 海象地圖與 RAG 智慧決策系統 (Production-ready POC)

本專案旨在建構一個「A3 智慧海況判讀與 RAG 決策支援微服務」。作為基隆港灣數位服務平台（SBIR 計畫）的底層核心大腦，這是一個具備「企業級架構」的概念驗證原型。

目前專案為了在 GitHub Pages 上進行無伺服器 (Serverless) 展示，已將原先 Python Backend 的 Geofencing 與 RAG 推論邏輯移植至純前端 JavaScript 實作 (`mockApi.js`)。

🔗 **[即時網頁展示 (Live Demo)](https://hivetea.github.io/-project/)**

---

## 🏗️ 系統特點 (v1.0 POC)

本專案結合多源數據聚合與 RAG 技術，自動產出具備推論依據的風險評估。
*   **多源數據聚合**: 整合中央氣象署與 Windy 等級的即時海象 API 數據（風速、風向、浪高、潮汐）。
*   **領域知識轉譯 (RAG)**: 將在地老船長的「非結構化航海經驗」建置為推論規則（目前由 `mockApi.js` 模擬規則檢索）。
*   **動態風險評估**: 交叉比對即時氣象與歷史經驗，產出「風險等級 (Risk Level)」與「活動建議 (Navigational Advice)」。

### 📱 前端展示端功能
*   **RWD 與 PWA 支援**: 響應式介面設計，完美支援手機與平板展示，並可加入行動裝置主畫面。
*   **自訂座標分析**: 提供經緯度手動輸入（例如 `25.1, 121.7`）進行特定海域風險分析。
*   **動態地圖縮放 (FlyTo)**: 分析完成後，地圖視角將自動飛躍 (FlyTo) 至目標座標。

---

## 🛠️ 技術棧 (Technologies Used)

### Frontend (Static POC)
*   **Vanilla JavaScript (ES6+), React (Babel Standalone)**
*   **HTML5 / CSS3**
*   **Leaflet.js** (Web Mapping Library)
*   `mockApi.js` (模擬 RAG 決策引擎與座標過濾)

### Backend (Reference Architecture - API Mode)
*   **Python 3, FastAPI, Pytest** (保留供未來實體化參考)

---

## 🚀 本地開發與運行

本系統的 Frontend POC 為純靜態檔案，不需要任何 Node.js 建置流程，只需要一個 HTTP Server 即可執行：

```bash
cd frontend
# 若使用 Python 內建伺服器:
python -m http.server 3000
```
打開瀏覽器訪問 `http://localhost:3000` 即可檢視。

---

## 👥 GitHub 協作與權限管理 (給開發團隊與 PM)

本專案的 Repository 設定為私有或需要特定權限，必須將合作夥伴加入 **collaborators** 才能讓他們參與開發與推送程式碼。

### 如何將 `plauvvnn` 或其他成員加入權限：
1. 專案管理員進入本專案的 GitHub Repository 頁面。
2. 點擊上方的 **Settings** 標籤。
3. 在左側選單選擇 **Collaborators**。
4. 點擊 **Add people** 按鈕。
5. 輸入 `plauvvnn`（或其他 GitHub 帳號）並送出邀請。
6. 被邀請人 (`plauvvnn`) 需至其 GitHub 註冊信箱收取邀請信，點擊 **Accept Invitation** 後，即取得推播與開發權限。

---
*A3 Maritime Intelligence Design System*
