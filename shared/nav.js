/* TRP Site — Navigation
   Highlights current page in nav. Hamburger toggle on mobile. */

(function() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.site-nav .nav-links a');
    links.forEach(function(a) {
        var href = a.getAttribute('href');
        if (href === path || (path === 'index.html' && href === 'index.html')) {
            a.classList.add('active');
        }
    });

    // Hamburger toggle for mobile
    var nav = document.querySelector('.site-nav');
    if (!nav) return;
    var toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', 'Menu');
    toggle.textContent = '\u2261'; // hamburger character
    toggle.onclick = function() {
        nav.classList.toggle('nav-open');
        toggle.textContent = nav.classList.contains('nav-open') ? '\u2715' : '\u2261';
    };
    // Insert before nav-links
    var navLinks = nav.querySelector('.nav-links');
    if (navLinks) nav.insertBefore(toggle, navLinks);

    // Close menu when a link is clicked
    links.forEach(function(a) {
        a.addEventListener('click', function() {
            nav.classList.remove('nav-open');
            toggle.textContent = '\u2261';
        });
    });
})();
