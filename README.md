# 🚀 API Tester & Web Capture 
![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build](https://img.shields.io/badge/build-PowerShell-yellow.svg)
![Platform](https://img.shields.io/badge/platform-Chrome%20|%20Firefox-orange.svg)

> **API Tester & Web Capture** is a premium, high-performance browser extension designed for modern developers. It combines a professional REST API testing suite with powerful, full-page screenshot utilities—all integrated into your Chrome Side Panel or Firefox Sidebar.

---

## ✨ Why Choose API Tester & Web Capture?

- **Zero Tab-Switching**: Test your APIs directly in the Side Panel while keeping your active tab open.
- **Unified Workflow**: One tool for API debugging AND frontend visual capture.
- **Privacy First**: All history and data are stored locally in your browser.
- **Cross-Browser**: Fully optimized for Chromium (Chrome, Brave, Edge) and Mozilla Firefox.

---

## 🔥 Key Features

### 📡 Advanced API Development Workspace
*   **Full REST Support**: Execute `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` requests with surgical precision.
*   **Header Management**: Add, remove, and manage custom HTTP headers (JWT, OAuth, Cookies, etc.).
*   **Dynamic Payloads (v1.2.0)**:
    *   **JSON Engine**: Syntax-aware editor with "Beautify" and "Minify" toggles.
    *   **Form Data**: Direct support for `application/x-www-form-urlencoded` payloads with an intuitive key-value builder.
*   **Visual Response Decoding (v1.2.0)**:
    *   **Live Preview**: Sandbox iframe for rendering HTML responses (perfect for testing SSR pages).
    *   **Image Viewer**: Direct preview for binary image responses (PNG, JPEG, SVG).
    *   **Raw Output**: High-fidelity text viewer for JSON, XML, and plain text.
*   **Persistence**: Smart history keeps tracking of your last 50 requests for instant re-execution.
*   **Performance Metrics**: Real-time HTTP status colors, millisecond-accurate response timing, and payload size tracking.

### 📸 Pro Capture Engine (Nexus)
*   **Full-Page Deep Scan**: Programmatically scrolls and stitches the DOM to capture the entire document, no matter how long.
*   **Viewport Precision**: Instant high-quality PNG snap of your current screen area.
*   **HD Fidelity**: Intelligent canvas resolution handling (DPR) ensures no pixel data is lost.
*   **Auto-Scroll Correction**: Defeats "Smooth Scrolling" during capture to ensure zero stitching seams or overlap errors.

---

## 🛠️ Installation

### 🔵 Chromium Browsers (Chrome, Brave, Edge)
1.  **Clone** or download this repository.
2.  Navigate to `chrome://extensions/`.
3.  Toggle **Developer Mode** on (top-right).
4.  Click **Load unpacked** and select the project folder.

### 🦊 Mozilla Firefox
1.  Navigate to `about:debugging#/runtime/this-firefox`.
2.  Click **Load Temporary Add-on...**.
3.  Select the `manifest.json` from the project folder.
4.  Open the **Sidebar** (`Ctrl+B` or `Cmd+B`) and select the extension.

---

## 🚦 Daily Workflow

1.  **API Testing**:
    *   Open the extension in the **Side Panel** (`Ctrl+Shift+L` or click the icon).
    *   Configure your endpoint and method. Switch between **JSON** and **Form Data** tabs for the body.
    *   **Pro Tip**: Use `Ctrl + Enter` to fire requests instantly.
2.  **Visual Inspection**:
    *   After your request completes, toggle between the **Raw** and **Visual** tabs to inspect the result.
3.  **Site Capture**:
    *   Switch to the **Tools** tab. Click **Full Page** to start a deep scan.
    *   *Note*: Stay on the current tab until the download prompt appears for the best result.

---

## 🏗️ Build & Distribution
This project includes an automated PowerShell build script that optimizes the extension for store submission.

Run the script:
```powershell
./build.ps1
```
Output artifacts in `build/`:
- `build/chrome_extension.zip`
- `build/firefox_extension.zip`

---

## 💻 Technical Excellence
- **Frontend**: Pure Vanilla JavaScript (ES6+), Modern CSS (Variables, HSL).
- **Communication**: Manifest V3 compliant messaging and SidePanel APIs.
- **Graphics**: HTML5 Canvas multi-segment stitching engine.
- **Cross-Platform**: Unified codebase with dynamic Firefox compatibility patching in the build script.

---

## 📝 License & Attribution
Distributed under the **MIT License**. Created by [Farhan].

*Disclaimer: For full-page captures, the extension programmatically traverses the website based on DOM height. Results may vary on sites with extreme infinite scroll or virtual lists.*

---

