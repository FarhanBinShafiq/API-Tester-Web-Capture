# 🚀 API Tester & Web Capture 
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

> An all-in-one browser extension delivering a premium API testing workspace alongside powerful HD full-page screenshot and video capture utilities—all right in your Chrome sidebar or popup window.

---

## 🔥 Key Features

### 📡 Premium API Workspace
- **RESTful Capabilities**: Easily perform `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` requests directly from your browser.
- **Header Management**: Dynamically add and remove custom headers to simulate perfectly crafted payloads.
- **Request Body & JSON Formatting**: Built-in JSON request mapping with live beautify/minify utilities.
- **Persistent History**: Keeps track of up to 50 previous requests securely in your local storage so you can easily reload and re-run past configurations.
- **Instant Response Parsing**: See Status Codes, Response Times (ms), and beautifully formatted HTTP responses rendered natively.

### 📸 Next-Gen Capture Tools
- **Deep-Scan Full Page Screenshots**: Unlike ordinary tools, the Nexus deep-scanner temporarily disables browser smooth-scrolling, calculates true document depth, and scrolls down dynamically to capture the entire web page—from header perfectly to footer!
- **Visible Viewport Snapshots**: Quickly grab everything currently visible on your browser layer with the single click of a button.
- **1080p HD Video Recording**: Natively requests high-definition `1080p WebM` video capture with audio pipeline capabilities built-in, avoiding the typical blurry outputs.  

---

## 🛠️ Installation (Developer Mode)

To install this tool locally inside your Chromium based browser (Chrome, Edge, Brave, etc.):

1. Download or clone this repository to your local computer.
2. Open your browser and navigate to the Extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Enable **Developer Mode** using the toggle switch in the top right corner.
4. Click on **Load unpacked** (or "Load Unpacked Extension").
5. Select the `postman_extension` folder.
6. **Nexus DevSuite** will now be added to your browser! Pin the extension to your toolbar for instant access.

---

## 🚦 Usage Guide

1. **API Testing**: Open the extension and you'll see the **Workspace** tab. Enter any valid endpoint, configure headers, attach a JSON request body if needed, and hit *Send*.
2. **Reviewing Old Queries**: Click the **History** tab to see your historical requests. Clicking any item instantly populates the Workspace with that configuration.
3. **Screenshots & Videos**: Click the **Tools** tab. Choose either "Visible Part" or "Full Page" to initiate a screenshot. The PNG image will automatically be downloaded when the canvas finishes rendering. To record a video, click "Start HD Recording" and select the tab/screen to record, click stop when completed.

---

## 💻 Tech Stack
- Vanilla **JavaScript (ES6+)**
- Extension **Manifest V3** Architecture
- Advanced **Chrome APIs** (`chrome.tabs`, `chrome.scripting`, `chrome.storage`, `chrome.downloads`)
- **HTML5 Canvas** (for dynamic image stitching and multi-axis image processing)

<br/>

> **Note**: For Full-Page captures, the extension programmatically traverses the website by injecting a coordinate mapping script to ensure zero structural overlap. Do not click away or close the popup during a deep scan for best results!
