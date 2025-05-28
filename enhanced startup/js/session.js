// Session Management
class SessionManager {
    static setUser(userData) {
        sessionStorage.setItem('user', JSON.stringify(userData));
        this.updateUI();
    }
    
    static getUser() {
        const user = sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
    
    static isLoggedIn() {
        return this.getUser() !== null;
    }
    
    static logout() {
        sessionStorage.removeItem('user');
        this.updateUI();
        window.location.href = 'index.html';
    }
    
    static updateUI() {
        const authBtn = document.getElementById('auth-btn');
        const userMenu = document.getElementById('user-menu');
        
        if (this.isLoggedIn()) {
            const user = this.getUser();
            authBtn.textContent = user.name;
            authBtn.href = '#';
            userMenu.style.display = 'block';
        } else {
            authBtn.textContent = 'Login';
            authBtn.href = 'auth.html';
            userMenu.style.display = 'none';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    SessionManager.updateUI();
});

function logout() {
    SessionManager.logout();
}