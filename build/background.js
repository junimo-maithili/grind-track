let timer = null;
let seconds = 0;


// Create an alarm if it doesn't exist
chrome.runtime.onStartup.addListener( () => {
    chrome.alarms.create("CONTINUE_TIMER", {
      periodInMinutes: 60
    });
}
);

chrome.storage.local.set({startTime:Date.now()});


// Respond to the alarm by adding a minute to local storage
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "CONTINUE_TIMER") {
    chrome.storage.local.get("seconds", (numSeconds) => {
      allSeconds = numSeconds.seconds || 0;
      chrome.storage.local.set({"seconds":allSeconds+1});
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
