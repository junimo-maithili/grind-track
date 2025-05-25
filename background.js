let timer = null;
let seconds = 0;

// Function to get current tab
async function getTab() {
    let queries = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queries);
    return tab;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_TAB') {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        sendResponse({tab:tabs[0]});
      });
      return true;
    }
  });

async function increaseTime() {
      timer = setInterval(() => {
        seconds += 1;
      }, 1000);
    
  chrome.storage.local.set({seconds});
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type = "CONTINUE_TIMER") {
    increaseTime();
  }
  return;
});

