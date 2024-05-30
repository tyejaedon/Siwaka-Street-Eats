const container = document.querySelectorAll('.wrapper');

container.addEventListener('mouseover', function() {
    this.classList.add('centered');
});

container.addEventListener('mouseout', function() {
    this.classList.remove('centered');
});


