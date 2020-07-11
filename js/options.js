document.addEventListener('DOMContentLoaded', function () {

    const table = document.getElementById('notes');
    const tbody = table.querySelector('tbody');

    const reload = document.getElementById('reload');
    reload.addEventListener('click', function(e) {
        loadNotes(tbody);
        showMessage('Notes refreshed');
    })
    
    loadNotes(tbody);

    const inputSearch = document.getElementById('searchNotes');
    inputSearch.addEventListener('keyup', function(e) {
        search(tbody, e.target.value);
    });

    const deleteAllButton = document.getElementById('deleteAll');
    deleteAllButton.addEventListener('click', function(e) {
        if (confirm('Are you sure you want to delete all notes?')) {   
            deleteAll(tbody);
        }
    });

    const exportButton = document.getElementById('download');
    exportButton.addEventListener('click', function(e) {
        if (confirm('Are you sure you want to export all notes?')) {   
            exportAll();
        }
    });

    const uploadButton = document.getElementById('upload');
    uploadButton.addEventListener('click', function(e) {
        document.getElementById('import').classList.remove('hidden')
    });

    const closeImport = document.getElementById('closeImportButton');
    closeImport.addEventListener('click', function(e) {
        document.getElementById('import').classList.add('hidden')
    });

    const importButton = document.getElementById('importButton');
    importButton.addEventListener('click', function(e) {
        importFile(tbody);
    });
});

function loadNotes(tbody) {
    chrome.storage.sync.get(null, function (items) {
        let notes = [];
        for(const key in items) {
            if (key.startsWith('keepNotesHere')) {
                notes[key.replace("keepNotesHere|", "")] = items[key];
            }
        }
        // add notes to table
        populateTable(notes, tbody);
    });
}

function populateTable(notes, tbody) {
    tbody.innerHTML = '';
    for(key in notes) {
        let tr = document.createElement('tr');
        let text = (notes[key].length > 300) ? notes[key].substr(0, 300 - 3)+'...' : notes[key];
        tr.innerHTML = '<td><a href="'+key+'" target="_blank">'+key+'</a></td><td>'+text+'</td><td><button type="button" class="btn-nostyle deleteNote" data-url="'+key+'"><span class="material-icons font-x2">delete</span></button></td>';
        tbody.appendChild(tr);
    }

    let deleteButtons = document.querySelectorAll('.deleteNote');
    deleteButtons.forEach(button => button.addEventListener('click', function(e) {
            let button = e.target;
            if (button.getAttribute('data-url') === null) {
                button = button.closest('button');
            }
            let url = button.getAttribute('data-url');
            
            if(confirm('Are you sure you want to delete this note?')) {
                chrome.storage.sync.remove(["keepNotesHere|"+url]);
                showMessage('Note deleted!');
                // reload storage notes
                loadNotes(tbody);
            }
        })
    );
}

function search(tbody, search) {
    let tr = tbody.querySelectorAll('tr');
    tr.forEach(function(row) {
        let show = false;
        if (search != '') {            
            let td = row.querySelectorAll('td');      
            if (td[0].innerText.toLowerCase().includes(search.toLowerCase()) || td[1].innerText.toLowerCase().includes(search.toLowerCase())) {
                show = true;
            }            
        } else {
            show = true;
        }
        if(show !== true) {
            row.style.display = 'none';   
        } else {
            row.style.display = 'table-row';
        }
    })
}

function deleteAll(tbody) {
    chrome.storage.sync.get(null, function (items) {
        for(const key in items) {
            if (key.startsWith('keepNotesHere')) {
                chrome.storage.sync.remove([key]);
            }
        }
        showMessage('All notes deleted!');
        // reload storage notes
        loadNotes(tbody);
    });
}

function exportAll() {
    const currentdate = new Date(); 
    chrome.storage.sync.get(null, function (items) {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items)));
        element.setAttribute('download', `KeepNotesHere-export-${currentdate.getFullYear()}-${currentdate.getMonth()+1}-${currentdate.getDate()}_${currentdate.getHours()}-${currentdate.getMinutes()}-${currentdate.getSeconds()}.json`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        showMessage('Export completed!');
    });
}

function importFile(tbody) {
    const fileImport = document.getElementById('file_import');
    const file = fileImport.files[0];
    if (file !== undefined) {
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            let text = evt.target.result;
            try {
                let json = JSON.parse(text);
                for(key in json) {
                    if (key.startsWith('keepNotesHere')) {
                        let obj = {};
                        obj[key] = json[key];
                        chrome.storage.sync.set(obj);
                    }
                }
                document.getElementById('import').classList.add('hidden')
                fileImport.value = '';
                showMessage('Import completed!');
                loadNotes(tbody);
            } catch (error) {
                showErrorMessage('An error occurred with this file.');
            }
        }
        reader.onerror = function (evt) {
            showErrorMessage('An error occurred with this file.');
        }
    }
}