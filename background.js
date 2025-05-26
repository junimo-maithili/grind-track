let timer = null;
let seconds = 0;

chrome.storage.local.set({startTime:Date.now()});

// giving current tab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_TAB') {
      chrome.tabs.query({active:true, lastFocusedWindow:true }, (tabs) => {
        sendResponse({tab:tabs[0]});
      });
      return true;
    }
  });
