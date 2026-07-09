// Auth logic for Login and Register

function handleLogin(e) {
    e.preventDefault();
    
    // For this mockup, any login is successful.
    // In a real app, we would make a fetch() call to a PHP endpoint here to verify credentials.
    
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'dashboard.html';
}

function handleRegister(e) {
    e.preventDefault();
    
    // Mock successful registration
    alert('Registration successful! Please login.');
    window.location.href = 'login.html';
}
