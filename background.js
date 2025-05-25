let timer = null;
let seconds = 0;


// Create an alarm if it doesn't exist
if (!timer) {
    chrome.alarms.create("CONTINUE_TIMER", {
      periodInMinutes: 1
    });
}

// Respond to the alarm by adding a minute to local storage
timer = chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "CONTINUE_TIMER") {
    chrome.local.storage.get("seconds", (numSeconds) => {
      seconds = numSeconds.seconds || 0;
      chrome.storage.storage.set("seconds", seconds+60)
    });
    
  }
});


// giving current tab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_TAB') {
      chrome.tabs.query({active:true, lastFocusedWindow:true }, (tabs) => {
        sendResponse({tab:tabs[0]});
      });
      return true;
    }
  });
