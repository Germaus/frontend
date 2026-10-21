document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const currentPage = window.location.pathname;
    
    if (!token && !currentPage.includes('login') && !currentPage.includes('register')) {
        window.location.href = 'login.html';
        return;
    }
    
    if (currentPage.endsWith('index.html') || currentPage === '/' || currentPage.endsWith('/')) {
        loadTasks();
    }
});

const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        
        try {
            await registerUser(username, password);
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        try {
            await loginUser(username, password);
            window.location.href = 'index.html';
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });
}

async function loadTasks() {
    try {
        const tasks = await getTasks();
        renderTasks(tasks);
        setupSearch();
    } catch (error) {
        console.error('Failed to load tasks:', error);
    }
}

function renderTasks(tasks) {
    const taskContainer = document.querySelector('.tasks');
    if (!taskContainer) return;
    
    taskContainer.innerHTML = '';
    
    const newTaskInput = document.createElement('input');
    newTaskInput.placeholder = '+ Add new task...';
    newTaskInput.className = 'new-task-input';
    newTaskInput.style.marginBottom = '10px';
    newTaskInput.style.padding = '10px';
    newTaskInput.style.borderRadius = '5px';
    newTaskInput.style.width = '100%';
    taskContainer.appendChild(newTaskInput);
    
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskContainer.appendChild(taskElement);
    });
    
    setupTaskListeners();
}

function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = 'task-item';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.padding = '10px';
    div.style.marginTop = '5px';
    div.style.backgroundColor = 'white';
    div.style.borderRadius = '5px';
    div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.dataset.taskId = task.id;
    checkbox.style.marginRight = '10px';
    checkbox.style.transform = 'scale(1.5)';
    
    const taskTitle = document.createElement('span');
    taskTitle.textContent = task.title;
    taskTitle.style.flexGrow = '1';
    taskTitle.style.fontSize = '18px';
    if (task.completed) {
        taskTitle.style.textDecoration = 'line-through';
        taskTitle.style.color = 'grey';
    }
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    deleteBtn.dataset.taskId = task.id;
    deleteBtn.style.background = 'none';
    deleteBtn.style.border = 'none';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.fontSize = '20px';
    deleteBtn.style.padding = '5px';
    
    div.append(checkbox, taskTitle, deleteBtn);
    return div;
}

function setupTaskListeners() {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', async (e) => {
            const taskId = e.target.dataset.taskId;
            const completed = e.target.checked;
            try {
                await updateTask(taskId, {completed});
            } catch (error) {
                e.target.checked = !completed;
                alert('Failed to update task');
            }
        });
    });
    
    document.querySelectorAll('[data-task-id]').forEach(btn => {
        if (btn.tagName === 'BUTTON') {
            btn.addEventListener('click', async (e) => {
                const taskId = e.target.dataset.taskId;
                try {
                    await deleteTask(taskId);
                    loadTasks();
                } catch (error) {
                    alert('Failed to delete task');
                }
            });
        }
    });
    
    document.querySelectorAll('.new-task-input').forEach(input => {
        input.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                try {
                    await createTask({title: e.target.value.trim()});
                    e.target.value = '';
                    loadTasks();
                } catch (error) {
                    alert('Failed to create task');
                }
            }
        });
    });
}


function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.toLowerCase();
        try {
            const allTasks = await getTasks();
            const filtered = allTasks.filter(task => 
                task.title.toLowerCase().includes(query)
            );
            renderTasks(filtered);
        } catch (error) {
            console.error('Search failed:', error);
        }
    });
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
}