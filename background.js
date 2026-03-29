// This background script enables the extension to handle long-running capture tasks
// that would otherwise be interrupted if the popup closes.

chrome.runtime.onInstalled.addListener(() => {
    console.log("Nexus API Background Service Started.");
});
