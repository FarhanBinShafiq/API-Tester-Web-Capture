# 🚀 API Tester & Web Capture 
![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build](https://img.shields.io/badge/build-PowerShell-yellow.svg)

> A premium, high-performance browser extension delivering a professional API testing workspace and powerful full-page screenshot utilities—integrated seamlessly into your Chrome Side Panel or Firefox Sidebar.

---

## 🔥 Key Features

### 📡 API Development Workspace
- **Full REST Support**: Execute `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` requests with ease.
- **Header Management**: Full control over custom HTTP headers for complex authentication (JWT, OAuth, etc.).
- **Dynamic Payloads**: Built-in JSON formatting with live "Prettify" and "Minify" capabilities.
- **Smart History**: Auto-saves your last 50 requests locally for instant recall and re-execution.
- **Detailed Metrics**: Real-time tracking of HTTP status codes, response times (ms), and payload sizes.

### 📸 Premium Capture Engine
- **Pixel-Perfect Full Page**: Deep-scans the DOM to capture the entire document, regardless of length, with zero structural overlap.
- **Viewport Snapping**: High-quality PNG capture of the visible screen area.
- **Smart Stitching**: Dynamically calculates viewport height and scrolls programmatically to ensure a seamless final image.

### 🖼️ Seamless Sidebar Integration
- **Persistent View**: Keep the tester open in the Side Panel while you browse, allowing for real-time API experiments without leaving the context of your page.

---

## 🛠️ Installation (Developer Mode)

### 🔵 Chromium Browsers (Chrome, Brave, Edge)
1. Clone this repository locally.
2. Open extensions settings via `chrome://extensions/`.
3. Enable **Developer Mode** (top-right).
4. Click **Load unpacked** and select the root directory.

### 🦊 Mozilla Firefox
1. Clone this repository locally.
2. Visit `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on...** and select `manifest.json`.
4. The extension will appear in your Firefox Sidebar automatically.

---

## 🚦 Usage Guide
1. **API Testing**: Select the **Workspace** tab. Configure your endpoint and method, then click **Send**.
2. **Historial Review**: Switch to the **History** tab to reload past requests.
3. **Web Elements**: Use the **Tools** tab for screenshots.
   - *Note*: During a full-page scan, do not switch tabs for best results!

---

## 🏗️ Building for Production
This project includes a PowerShell build script to generate browser-optimized ZIP archives for store submission.

Run the following in PowerShell:
```powershell
./build.ps1
```
The output will be generated in the `build/` directory:
- `build/chrome_extension.zip` (Standard Manifest V3 bundle)
- `build/firefox_extension.zip` (Firefox-specific manifest fixes and Polyfills)

---

## 💻 Tech Stack
- **Engine**: Pure JavaScript (ES6+ Vanilla)
- **Architecture**: Manifest V3 (Cross-Browser Compatible)
- **APIs**: `chrome.sidePanel`, `chrome.scripting`, `chrome.downloads`, `chrome.storage`
- **Processing**: HTML5 Canvas for real-time image processing and stitching.

---

> **Note**: For Full-Page captures, the extension programmatically traverses the website by injecting a coordinate mapping script to ensure zero structural overlap. Do not click away or close the popup during a deep scan for best results!

