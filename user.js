function blur_object(box) {
    box.blurTimeout = setTimeout(() => {
        document.querySelectorAll('.shop').forEach(sibling => {
            if (sibling !== box) {
                sibling.classList.add('blurred');
            }
        });
    }, 200);
}

function clear_blur_timeout(box) {
    clearTimeout(box.blurTimeout);
    document.querySelectorAll('.shop').forEach(sibling => {
        sibling.classList.remove('blurred');
    });
}

document.querySelectorAll('.shop').forEach(box => {
    box.addEventListener('mouseenter', () => blur_object(box));
    box.addEventListener('mouseleave', () => clear_blur_timeout(box));
});
