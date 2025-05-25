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
  
