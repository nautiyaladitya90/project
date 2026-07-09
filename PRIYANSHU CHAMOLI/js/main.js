// Main JS Logic (Theme & Menu)

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        // Check local storage for theme
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }

        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            let theme = 'light';
            if (document.body.classList.contains('dark-mode')) {
                theme = 'dark';
                themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
            localStorage.setItem('theme', theme);
        });
    }

    // Mobile Menu Logic
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if(navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.right = '20px';
                navLinks.style.background = 'var(--surface)';
                navLinks.style.padding = '20px';
                navLinks.style.borderRadius = '12px';
                navLinks.style.border = '1px solid var(--border-solid)';
            }
        });
    }

    // Auth State Logic
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const navDashboard = document.getElementById('nav-dashboard');
    const navLogin = document.getElementById('nav-login');
    const navLogout = document.getElementById('nav-logout');
    
    // Index page buttons
    const browseNotesBtn = document.getElementById('browse-notes-btn');
    const getStartedBtn = document.getElementById('get-started-btn');

    if (isLoggedIn) {
        if(navDashboard) navDashboard.style.display = 'block';
        if(navLogin) navLogin.style.display = 'none';
        if(navLogout) navLogout.style.display = 'block';
        
        if(browseNotesBtn) browseNotesBtn.style.display = 'inline-block';
        if(getStartedBtn) getStartedBtn.style.display = 'none';
    }
});

function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    window.location.reload();
}
