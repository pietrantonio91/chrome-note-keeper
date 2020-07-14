chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === "noteExists") {
        if (msg.value) {
            chrome.browserAction.setBadgeText({text: "1"});
            chrome.browserAction.setBadgeBackgroundColor({color: '#758ecd'});
        } else {
            chrome.browserAction.setBadgeText({text: ""});
        }
    }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        const url = tab.url;
        const objKey = "keepNotesHere|"+url;
        chrome.storage.sync.get([objKey], function (data) {
            let notes = data[objKey];
            if(notes && notes.length > 0) {
                chrome.browserAction.setBadgeText({text: "1"});
                chrome.browserAction.setBadgeBackgroundColor({color: '#758ecd'});
            } else {
                chrome.browserAction.setBadgeText({text: ""});
            }
        });
    })
});