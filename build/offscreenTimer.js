alert(chrome?.storage);

let seconds = 0;
let timer = setInterval(() => {
        seconds ++;
    chrome.storage.local.set({ seconds });
    }, 1000);
