chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === "noteExists") {
        if (msg.value) {
            showBadge();
        } else {
            hideBadge();
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
                showBadge();
            } else {
                hideBadge();
            }
        });
    })
});

function showBadge() {
    chrome.action.setBadgeText({text: " "});
    chrome.action.setBadgeBackgroundColor({color: '#758ecd'});
}

function hideBadge() {
    chrome.action.setBadgeText({text: ""});
}