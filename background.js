// Function to get current tab
async function getTab() {
    let queries = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queries);
    return tab;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_TAB') {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        sendResponse({ tab: tabs[0] });
      });
      return true;
    }
  });
  
chrome.idle.setDetectionInterval(60); // 1 minute

chrome.idle.onStateChanged.addListener((state) => {
  // If user isn't using tab or if laptop is closed, stop timer
  if (state === "idle" || state === "locked") {
    chrome.runtime.sendMessage({type: "STOP_TIMER"});
  }
  else if (state === "active")
    chrome.runtime.sendMessage({type: "CONTINUE_TIMER"});
});


