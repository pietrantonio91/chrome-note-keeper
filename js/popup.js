const byteLimit = 8192; // Chrome is 8192 bytes, but to be sure I put this limit
const byteSize = str => new Blob([str]).size;

document.addEventListener('DOMContentLoaded', function () {
    
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        const tab = tabs[0];
        const url = tab.url;
        const objKey = "keepNotesHere|"+url;
        let textarea = document.getElementById('notes');
        textarea.focus();

        chrome.storage.sync.get([objKey], function (data) {
            let notes = data[objKey];
            if(notes && notes.length > 0) {
                populateTextarea(textarea, notes);
            }
        });
        
        textarea.addEventListener('keyup', function(e) {
            let text = e.target.value;
    
            // save on chrome storage
            chrome.storage.sync.get([objKey], function (data) {
                let notes = data[objKey];
                if (!notes) {
                    notes = '';
                }
                notes = text;
                if(text == '') {
                    delete notes;
                }
                
                let obj = {};
                obj[objKey] = notes;
                if (byteSize(JSON.stringify(notes)+objKey) > byteLimit) {  
                    showErrorMessage('NOTE NOT SAVED! Text is too long.');
                    lengthMessage.classList.add('text-error');
                    lengthMessage.classList.remove('text-success');
                    lengthMessage.innerText = 'Error';
                } else {
                    chrome.storage.sync.set(obj);
                    let lengthMessage = document.getElementById('lengthMessage');
                    lengthMessage.classList.remove('text-error');
                    lengthMessage.classList.add('text-success');
                    lengthMessage.innerText = 'Saved';
                    // send to background
                    chrome.runtime.sendMessage({
                        action: 'noteExists',
                        value: true
                    });
                }
            });
        });
        
        /**
         * Buttons
         */
        //  delete
        let deleteButton = document.getElementById('deleteNote');
        deleteButton.addEventListener('click', function(e) {
            if(confirm('Are you sure you want to delete this note?')) {
                const url = tab.url;
                const objKey = "keepNotesHere|"+url;
                chrome.storage.sync.get([objKey], function (data) {
                    chrome.storage.sync.remove([objKey]);
                    populateTextarea(textarea, '');
                    showMessage('Note deleted!');
                    // send to background
                    chrome.runtime.sendMessage({
                        action: 'noteExists',
                        value: false
                    });
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