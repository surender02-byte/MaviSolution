// ========================================
// MAVICLONE - FRONTEND SCRIPT
// ========================================

const API_BASE_URL = 'http://localhost:8080/api';

// ========================================
// AUTHENTICATION
// ========================================

async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            return { success: true, user: data.user, role: data.user.role };
        }
        return { success: false, error: data.message || 'Invalid credentials' };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Cannot connect to server. Make sure backend is running on port 8080' };
    }
}

async function register(fullname, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullname, email, password, role: 'USER' })
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
            return { success: true, message: data.message };
        }
        return { success: false, error: data.error || 'Registration failed' };
    } catch (error) {
        return { success: false, error: 'Cannot connect to server' };
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'ADMIN';
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function checkAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return null;
    }
    return getCurrentUser();
}

// ========================================
// SERVICES CRUD
// ========================================

async function getAllServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/services`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

async function createService(serviceData) {
    try {
        const response = await fetch(`${API_BASE_URL}/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serviceData)
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function updateService(id, serviceData) {
    try {
        const response = await fetch(`${API_BASE_URL}/services/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serviceData)
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deleteService(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/services/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========================================
// USERS
// ========================================

async function getAllUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        return [];
    }
}

async function updateUserProfile(id, userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (response.ok && data.success) {
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.id === id) {
                if (userData.fullname) currentUser.fullname = userData.fullname;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            return { success: true };
        }
        return { success: false, error: data.error || 'Update failed' };
    } catch (error) {
        return { success: false, error: 'Connection failed' };
    }
}

// ========================================
// QUOTATIONS
// ========================================

async function submitQuotation(quotationData) {
    try {
        const response = await fetch(`${API_BASE_URL}/quotations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quotationData)
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getAllQuotations() {
    try {
        const response = await fetch(`${API_BASE_URL}/quotations`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        return [];
    }
}

// ========================================
// UI HELPERS
// ========================================

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getInitials(name) {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}