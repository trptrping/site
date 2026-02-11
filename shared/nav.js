/* TRP Site — Navigation
   Highlights current page in nav. */

(function() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.site-nav .nav-links a');
    links.forEach(a => {
        const href = a.getAttribute('href');
        if (href === path || (path === 'index.html' && href === 'index.html')) {
            a.classList.add('active');
        }
    });
})();
