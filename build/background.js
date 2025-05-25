let timer = null;
let seconds = 0;

// Function to get current tab
async function getTab() {
    let queries = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queries);
    return tab;
}

// Function to create a document to store time worked
async function getDoc() {
  const hasDocument = await chrome.offscreen.hasDocument();
  if (!hasDocument) {
    await chrome.offscreen.createDocument({
      url: "offscreenTimer.html",
      reasons: ["BLOBS"],
      justification: "Making a timer that runs even when the extension window is closed"
    });
  }
  console.log("worked~");
}

// Listener, asks for the current time
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_TAB') {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        sendResponse({tab:tabs[0]});
      });
      return true;
    }
  });

getDoc();

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "CONTINUE_TIMER") {

  }
  return true;
});
