// if activetab
// get url, if it's acceptable (includes) then continue timer

chrome.runtime.onInstalled.addListener(async(activeInfo) => {

    // on activated doesn't exist??

    numSeconds = 0


    const currTab = await chrome.tabs.get(activeInfo.tabId);
   checkValidTab(currTab.url);

    function checkValidTab(url) {
        chrome.storage.local.get(["acceptedWebsites"], (result) => {
            const allowedSites = result.acceptedWebsites || [];
            const isAllowed = allowedSites.some(websiteLink => url.includes(websiteLink))

            if (isAllowed) {
                // If timer doesn't exist, make one
                if (!setInterval) {
                    let timer = setInterval(timerInterval, 1000)
                    function timerInterval () {
                        numSeconds++;
                        //Document.getElementById("TIMER").innerHTML = numSeconds;
                    }        
                }
            } else {
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                  }
            }

        return numSeconds;
    });

    time = numSeconds;




    }

})

async function getTime() {
    return time;
}
