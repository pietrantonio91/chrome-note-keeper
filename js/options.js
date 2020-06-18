document.addEventListener('DOMContentLoaded', function () {

    var table = document.getElementById('notes');
    var tbody = table.querySelector('tbody');

    var reload = document.getElementById('reload');
    reload.addEventListener('click', function(e) {
        loadNotes(tbody);
    })
    
    loadNotes(tbody);
});

function loadNotes(tbody) {
    chrome.storage.sync.get(["keepNotesHere"], function (data) {
        var notes = data.keepNotesHere;
        // add notes to table
        populateTable(notes, tbody);

        var inputSearch = document.getElementById('searchNotes');
        inputSearch.addEventListener('keyup', function(e) {
            search(tbody, e.target.value);
        });

        var deleteAll = document.getElementById('deleteAll');
        deleteAll.addEventListener('click', function(e) {
            if (confirm('Are you sure you want to delete all notes?')) {   
                chrome.storage.sync.set({"keepNotesHere": {}});
                showMessage('All notes deleted!');
                // reload storage notes
                populateTable({}, tbody);
            }
        });

        
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

    var deleteButtons = document.querySelectorAll('.deleteNote');
    deleteButtons.forEach(button => button.addEventListener('click', function(e) {
            let button = e.target;
            if (button.getAttribute('data-url') === null) {
                button = button.closest('button');
            }
            var url = button.getAttribute('data-url');
            
            if(confirm('Are you sure you want to delete this note?')) {
                delete notes[url];
                chrome.storage.sync.set({"keepNotesHere": notes});
                showMessage('Note deleted!');
                // reload storage notes
                populateTable(notes, tbody);
            }
        })
    );
}

function search(tbody, search) {
    var tr = tbody.querySelectorAll('tr');
    tr.forEach(function(row) {
        var show = false;
        if (search != '') {            
            var td = row.querySelectorAll('td');      
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