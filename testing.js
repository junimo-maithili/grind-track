chrome.runtime.onActivated.addListener(async(activeInfo) => {
    const currTab = await chrome.tabs.get(activeInfo.tabId);


});