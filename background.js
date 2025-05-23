chrome.runtime.onActivated.addListener(async(activeInfo) => {

    const currTab = await chrome.tabs.get(activeInfo.tabId);
    checkValidTab(currTab.url);

    function checkValidTab(url) {
        chrome.storage.local.get(["acceptedWebsites"], (result) => {
            const allowedSites = result.acceptedWebsites || [];
            const isAllowed = 
        });
    }

})