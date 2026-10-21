const API_BASE = '/api';


let USE_MOCK = true;
let MOCK_TASKS = [];

async function registerUser(username, password) {
    if (USE_MOCK) {
        alert('MOCK: Registration successful');
        localStorage.setItem('authToken', 'mock-token');
        return {};
    }
    
    const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

async function loginUser(username, password) {
    if (USE_MOCK) {
        alert('MOCK: Login successful');
        localStorage.setItem('authToken', 'mock-token');
        return {access_token: 'mock-token'};
    }
    
    const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    localStorage.setItem('authToken', data.access_token);
    return data;
}

async function getTasks() {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE}/tasks`, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

async function createTask(taskData) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

async function updateTask(taskId, updates) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

async function deleteTask(taskId) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${token}`}
    });
    if (!response.ok) throw new Error(await response.text());
    return true;
}