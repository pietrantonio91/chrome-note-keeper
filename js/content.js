(function(){
    const url = location.href;
    const objKey = "keepNotesHere|"+url;
    chrome.storage.sync.get([objKey], function (data) {
        let notes = data[objKey];
        if(notes && notes.length > 0) {
            // send to background
            chrome.runtime.sendMessage({
                action: 'noteExists',
                value: true
            });
        } else {
            chrome.runtime.sendMessage({
                action: 'noteExists',
                value: false
            });
        }
    });
})();