// Cross-browser API Handler
const api = typeof browser !== 'undefined' ? browser : (typeof chrome !== 'undefined' ? chrome : null);

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const methodSelect = document.getElementById('method');
    const urlInput = document.getElementById('url');
    const addHeaderBtn = document.getElementById('add-header');
    const headersContainer = document.getElementById('headers-container');
    const bodySection = document.getElementById('body-section');
    const requestBody = document.getElementById('request-body');
    const sendBtn = document.getElementById('send-btn');
    const responseSection = document.getElementById('response-section');
    const statusCode = document.getElementById('status-code');
    const responseTime = document.getElementById('response-time');
    const responseBody = document.getElementById('response-body');
    const errorMessage = document.getElementById('error-message');
    const copyBtn = document.getElementById('copy-btn');
    const clearHistoryBtn = document.getElementById('clear-history');
    const historyList = document.getElementById('history-list');
    const formatBtn = document.getElementById('format-json');
    const feedback = document.getElementById('feedback');

    // Tool Buttons
    const captureVisibleBtn = document.getElementById('capture-visible-btn');
    const captureFullBtn = document.getElementById('capture-full-btn');
    const toolFormatJson = document.getElementById('tool-format-json');
    const toolMinifyJson = document.getElementById('tool-minify-json');

    // Tab Logic
    const tabs = document.querySelectorAll('.nav-tab');
    const views = {
        workspace: document.getElementById('workspace-view'),
        history: document.getElementById('history-view'),
        tools: document.getElementById('tools-view')
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.target;
            tabs.forEach(t => t.classList.toggle('active', t === tab));
            Object.keys(views).forEach(v => views[v].classList.toggle('hidden', v !== target));
            if (target === 'history') loadHistory();
        });
    });

    // --- JSON Logic ---
    function formatTextarea(minify = false) {
        try {
            const current = requestBody.value.trim();
            if (!current) return;
            const obj = JSON.parse(current);
            requestBody.value = JSON.stringify(obj, null, minify ? 0 : 2);
            showFeedback(minify ? 'Minified' : 'Beautified');
        } catch (e) {
            showError('Invalid JSON in Body');
        }
    }

    if (formatBtn) formatBtn.addEventListener('click', () => formatTextarea());
    if (toolFormatJson) toolFormatJson.addEventListener('click', () => formatTextarea());
    if (toolMinifyJson) toolMinifyJson.addEventListener('click', () => formatTextarea(true));

    // --- History Logic ---
    async function loadHistory() {
        const data = await api.storage.local.get(['history']);
        const history = data.history || [];
        historyList.replaceChildren();
        if (history.length === 0) {
            const noHistory = document.createElement('div');
            noHistory.style.cssText = 'color: var(--text-muted); font-size: 11px; text-align: center; margin-top: 20px;';
            noHistory.textContent = 'No history.';
            historyList.appendChild(noHistory);
            return;
        }
        history.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            
            const info = document.createElement('div');
            info.className = 'history-info';
            
            const method = document.createElement('span');
            method.className = `history-method method-${item.method}`;
            method.textContent = item.method;
            
            const url = document.createElement('span');
            url.className = 'history-url';
            url.textContent = item.url;
            
            const date = document.createElement('span');
            date.className = 'history-date';
            date.textContent = `${item.date} ${item.timestamp}`;
            
            info.appendChild(method);
            info.appendChild(url);
            info.appendChild(date);
            
            const loadBtn = document.createElement('button');
            loadBtn.className = 'btn-icon';
            loadBtn.textContent = 'Load';
            
            div.appendChild(info);
            div.appendChild(loadBtn);
            div.addEventListener('click', () => {
                methodSelect.value = item.method;
                urlInput.value = item.url;
                requestBody.value = item.body || '';
                headersContainer.replaceChildren();
                if (item.headers) Object.entries(item.headers).forEach(([k, v]) => addHeaderRow(k, v));
                document.querySelector('[data-target="workspace"]').click();
                methodSelect.dispatchEvent(new Event('change'));
            });
            historyList.appendChild(div);
        });
    }

    clearHistoryBtn.addEventListener('click', async () => {
        await api.storage.local.set({ history: [] });
        loadHistory();
    });

    // --- Screenshot Logic (Scroll & Capture) ---
    // Ultra-HD Multi-Axis Full-Page Capture (Vertical + Horizontal)
    async function captureFullPage() {
        try {
            captureFullBtn.disabled = true;
            captureFullBtn.replaceChildren();
            const loader = document.createElement('div');
            loader.className = 'loader';
            captureFullBtn.appendChild(loader);
            captureFullBtn.appendChild(document.createTextNode(' Calculating Canvas...'));
            
            const [tab] = await api.tabs.query({ active: true, currentWindow: true });
            if (!tab || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) {
                throw new Error('Screenshots disabled on system pages.');
            }

            // 1. Measure the entire page dimensions and disable smooth scroll
            const metrics = await api.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    const scrollState = {
                        htmlBehavior: document.documentElement.style.scrollBehavior,
                        bodyBehavior: document.body.style.scrollBehavior
                    };
                    // Defeat smooth scrolling so scrollTo is instant
                    document.documentElement.style.scrollBehavior = 'auto';
                    document.body.style.scrollBehavior = 'auto';

                    return {
                        totalW: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
                        totalH: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
                        viewW: window.innerWidth,
                        viewH: window.innerHeight,
                        dpr: window.devicePixelRatio || 1,
                        initX: window.scrollX,
                        initY: window.scrollY,
                        scrollState
                    };
                }
            });

            const { totalW, totalH, viewW, viewH, dpr, initX, initY, scrollState } = metrics[0].result;
            const segments = [];
            
            // 2. Multi-axis Scroll and Capture Loop
            for (let y = 0; y < totalH; y += viewH) {
                // Prevent capturing past the bottom
                const targetY = Math.min(y, totalH - viewH > 0 ? totalH - viewH : 0);
                
                for (let x = 0; x < totalW; x += viewW) {
                    // Prevent capturing past the right edge
                    const targetX = Math.min(x, totalW - viewW > 0 ? totalW - viewW : 0);
                    
                    // Move to specific coordinate and verify actual scroll position
                    const actualPos = await api.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: (tx, ty) => {
                            window.scrollTo(tx, ty);
                            return { sx: window.scrollX, sy: window.scrollY };
                        },
                        args: [targetX, targetY]
                    });

                    // Wait for render/stasis (400ms is stable against lazy-load components)
                    await new Promise(r => setTimeout(r, 400));

                    // Capture visible segment
                    const dataUrl = await api.tabs.captureVisibleTab(null, { format: 'png', quality: 100 });
                    segments.push({ dataUrl, x: actualPos[0].result.sx, y: actualPos[0].result.sy });

                    // Update Progress
                    const progress = Math.min(Math.round(((y * totalW + x) / (totalH * totalW)) * 100), 100);
                    captureFullBtn.replaceChildren();
                    const loaderProgress = document.createElement('div');
                    loaderProgress.className = 'loader';
                    captureFullBtn.appendChild(loaderProgress);
                    captureFullBtn.appendChild(document.createTextNode(` ${progress}% Scanned...`));
                    
                    if (targetX >= totalW - viewW) break; // Reached right edge
                }
                if (targetY >= totalH - viewH) break; // Reached bottom edge
            }

            // 3. Restore User's original scroll position and behaviors
            await api.scripting.executeScript({
                target: { tabId: tab.id },
                func: (ix, iy, state) => {
                    window.scrollTo(ix, iy);
                    document.documentElement.style.scrollBehavior = state.htmlBehavior;
                    document.body.style.scrollBehavior = state.bodyBehavior;
                },
                args: [initX, initY, scrollState]
            });

            // 4. Dynamic Stitching on HD Canvas
            const canvas = document.createElement('canvas');
            canvas.width = Math.min(totalW * dpr, 16384); // Max chrome canvas width
            canvas.height = Math.min(totalH * dpr, 16384); // Max chrome canvas height
            const ctx = canvas.getContext('2d');

            for (const seg of segments) {
                const img = new Image();
                img.src = seg.dataUrl;
                await new Promise((resolve, reject) => { 
                    img.onload = resolve; 
                    img.onerror = reject;
                });
                
                // Draw precisely at the queried scroll position to avoid gaps
                ctx.drawImage(img, seg.x * dpr, seg.y * dpr, img.width, img.height);
            }

            // 5. HD Final Output using Blob to prevent Data URL limits
            canvas.toBlob((blob) => {
                if (!blob) {
                    throw new Error("Canvas is too large to export. Try a smaller page.");
                }
                const blobUrl = URL.createObjectURL(blob);
                api.downloads.download({
                    url: blobUrl,
                    filename: `nexus_full_grid_${Date.now()}.png`,
                    saveAs: true
                }, () => {
                    URL.revokeObjectURL(blobUrl);
                    if (api.runtime.lastError) {
                        showError("Download failed: " + api.runtime.lastError.message);
                    } else {
                        showFeedback('Total Capture Ready!');
                    }
                });
                
                captureFullBtn.disabled = false;
                captureFullBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> Full Page';

            }, 'image/png');

        } catch (e) {
            showError(`Nexus Error: ${e.message}`);
            captureFullBtn.disabled = false;
            captureFullBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> Full Page';
        }
    }

    if (captureFullBtn) captureFullBtn.addEventListener('click', captureFullPage);

    // --- Visible Page Capture ---
    async function captureVisiblePage() {
        try {
            captureVisibleBtn.disabled = true;
            captureVisibleBtn.replaceChildren();
            const loaderVis = document.createElement('div');
            loaderVis.className = 'loader';
            captureVisibleBtn.appendChild(loaderVis);
            captureVisibleBtn.appendChild(document.createTextNode(' Capturing...'));

            const [tab] = await api.tabs.query({ active: true, currentWindow: true });
            if (!tab || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
                throw new Error('Screenshots disabled on system pages.');
            }

            const dataUrl = await api.tabs.captureVisibleTab(null, { format: 'png', quality: 100 });
            api.downloads.download({
                url: dataUrl,
                filename: `nexus_visible_${Date.now()}.png`,
                saveAs: true
            }, () => {
                if (api.runtime.lastError) showError("Download failed: " + api.runtime.lastError.message);
                else showFeedback('Visible Capture Ready!');
            });
        } catch (e) {
            showError(`Nexus Error: ${e.message}`);
        } finally {
            captureVisibleBtn.disabled = false;
            captureVisibleBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> Visible Part';
        }
    }

    if (captureVisibleBtn) captureVisibleBtn.addEventListener('click', captureVisiblePage);



    // --- Core API Logic (Existing) ---
    addHeaderRow('Content-Type', 'application/json');
    methodSelect.addEventListener('change', () => {
        bodySection.classList.toggle('hidden', !['POST', 'PUT', 'PATCH'].includes(methodSelect.value));
    });

    function addHeaderRow(k = '', v = '') {
        const row = document.createElement('div');
        row.className = 'header-row';
        
        const keyInput = document.createElement('input');
        keyInput.type = 'text';
        keyInput.className = 'header-key';
        keyInput.value = k;
        keyInput.placeholder = 'Key';
        
        const valInput = document.createElement('input');
        valInput.type = 'text';
        valInput.className = 'header-value';
        valInput.value = v;
        valInput.placeholder = 'Value';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-header';
        removeBtn.style.cssText = 'background:transparent;border:none;color:var(--text-muted);cursor:pointer;';
        removeBtn.textContent = '✕';
        
        row.appendChild(keyInput);
        row.appendChild(valInput);
        row.appendChild(removeBtn);
        
        headersContainer.appendChild(row);
        removeBtn.onclick = () => row.remove();
    }

    async function sendRequest() {
        const url = urlInput.value.trim();
        const method = methodSelect.value;
        const bodyContent = requestBody.value.trim();

        errorMessage.classList.add('hidden');
        responseSection.classList.add('hidden');
        sendBtn.disabled = true;
        const originalChildren = Array.from(sendBtn.childNodes);
        sendBtn.replaceChildren();
        const loaderReq = document.createElement('div');
        loaderReq.className = 'loader';
        sendBtn.appendChild(loaderReq);
        sendBtn.appendChild(document.createTextNode(' Processing...'));

        try {
            const headers = {};
            document.querySelectorAll('.header-row').forEach(r => {
                const key = r.querySelector('.header-key').value.trim();
                const val = r.querySelector('.header-value').value.trim();
                if (key) headers[key] = val;
            });

            const options = { method, headers };
            if (['POST', 'PUT', 'PATCH'].includes(method) && bodyContent) {
                JSON.parse(bodyContent); 
                options.body = bodyContent;
            }

            const start = performance.now();
            const res = await fetch(url, options);
            const time = Math.round(performance.now() - start);

            const d = await api.storage.local.get(['history']);
            const h = d.history || [];
            h.unshift({ url, method, body: bodyContent, headers, date: new Date().toLocaleDateString(), timestamp: new Date().toLocaleTimeString() });
            await api.storage.local.set({ history: h.slice(0, 50) });

            statusCode.innerText = `${res.status} ${res.statusText || ''}`;
            statusCode.style.color = res.status < 300 ? 'var(--get)' : (res.status < 500 ? 'var(--warning)' : 'var(--error)');
            responseTime.innerText = `${time} ms`;

            const ct = res.headers.get('content-type');
            if (ct && ct.includes('json')) {
                responseBody.textContent = JSON.stringify(await res.json(), null, 2);
            } else {
                responseBody.textContent = await res.text();
            }
            responseSection.classList.remove('hidden');
        } catch (e) {
            showError(e.message);
        } finally {
            sendBtn.disabled = false;
            sendBtn.replaceChildren(...originalChildren);
        }
    }

    sendBtn.onclick = sendRequest;
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(responseBody.textContent);
        showFeedback('Copied!');
    };

    function showError(m) {
        errorMessage.innerText = m;
        errorMessage.classList.remove('hidden');
    }

    function showFeedback(m) {
        feedback.innerText = m;
        feedback.classList.add('show');
        setTimeout(() => feedback.classList.remove('show'), 2500);
    }
});
