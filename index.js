const container = document.querySelectorAll('.wrapper');

container.addEventListener('mouseover', function() {
    this.classList.add('centered');
});

container.addEventListener('mouseout', function() {
    this.classList.remove('centered');
});

document.getElementById('login_form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    const isUser = document.getElementById('usertype').checked;
    if (isUser) {
        window.location.href = 'buyerhomepage.html';
    } else {
        window.location.href = 'homepage_user.html';
    }
});