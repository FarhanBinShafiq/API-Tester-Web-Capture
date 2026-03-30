// Cross-browser API Handler
const api = typeof browser !== 'undefined' ? browser : (typeof chrome !== 'undefined' ? chrome : null);

// This background script enables the extension to handle long-running capture tasks
api.runtime.onInstalled.addListener(() => {
    console.log("Nexus API Background Service Started.");
});
