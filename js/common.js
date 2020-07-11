function showMessage(message) {
    let area = document.getElementById('messages');
    area.innerHTML = '';
    let span = document.createElement('span');
    span.classList.add('message');
    span.innerText = message;
    area.appendChild(span);
    setTimeout(function() {
        area.innerHTML = '';
    }, 1500);
}

function showErrorMessage(message) {
    let area = document.getElementById('messages');
    area.innerHTML = '';
    let span = document.createElement('span');
    span.classList.add('message');
    span.classList.add('error');
    span.innerText = message;
    area.appendChild(span);
    setTimeout(function() {
        area.innerHTML = '';
    }, 2000);
}