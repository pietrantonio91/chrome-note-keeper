document.addEventListener('DOMContentLoaded', function () {
    
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        var tab = tabs[0];
        var url = tab.url;
        var textarea = document.getElementById('notes');
        textarea.focus();

        chrome.storage.sync.get(["keepNotesHere"], function (data) {
            let notes = data.keepNotesHere;
            if(notes && notes[url]) {
                populateTextarea(textarea, notes[url]);
            }
        });
        
        textarea.addEventListener('keyup', function(e) {
            let text = e.target.value;
            // save on chrome storage
            chrome.storage.sync.get(["keepNotesHere"], function (data) {
                let notes = data.keepNotesHere;
                if (!notes) {
                    notes = {};
                }
                notes[url] = text;
                if(text == '') {
                    delete notes[url];
                }
                chrome.storage.sync.set({"keepNotesHere": notes});
            });
        });
        
        /**
         * Buttons
         */
        //  delete
        let deleteButton = document.getElementById('deleteNote');
        deleteButton.addEventListener('click', function(e) {
            if(confirm('Are you sure you want to delete this note?')) {
                chrome.storage.sync.get(["keepNotesHere"], function (data) {
                    let notes = data.keepNotesHere;
                    delete notes[url];
                    chrome.storage.sync.set({"keepNotesHere": notes});
                    populateTextarea(textarea, '');
                    showMessage('Note deleted!');
                });
            }
        });

        // copy
        let copyButton = document.getElementById('copyNote');
        copyButton.addEventListener('click', function(e) {
            copyTextarea(textarea);
        });
        
        // download
        let downloadButton = document.getElementById('downloadNote');
        downloadButton.addEventListener('click', function(e) {
            downloadTextarea(textarea);
        });

    });

});

function populateTextarea(textarea, text) {
    textarea.value = text;
}

function copyTextarea(textarea)
{
    textarea.select();
    document.execCommand("copy");

    showMessage('Note copied!');
}

function downloadTextarea(textarea) {
    let text = textarea.value;
    if(text == '' || text === null)
        return false;
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'KeepNotesHereDownload.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showMessage('Note downloaded!');
}