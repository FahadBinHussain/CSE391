document.addEventListener('DOMContentLoaded', function() {
    
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const setTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });


    const pageInfoDiv = document.getElementById('page-info');
    if (pageInfoDiv) {
        const pageLocation = window.location.href;
        const lastModified = document.lastModified;
        pageInfoDiv.innerHTML = 'Page Location: ' + pageLocation + '<br />Last Modified: ' + lastModified;
    }

});