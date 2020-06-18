function showMessage(message) {
    let area = document.getElementById('messages');
    let span = document.createElement('span');
    span.classList.add('message');
    span.innerText = message;
    area.appendChild(span);
    setTimeout(function() {
        area.innerHTML = '';
    }, 1500);
}