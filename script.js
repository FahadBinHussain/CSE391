document.addEventListener('DOMContentLoaded', function() {
    
    // Debug message for page load
    console.log('Page loaded successfully - Fortune Generator initializing...');
    
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

    // Fortune Generator Implementation
    const fortunes = [
        "True wisdom comes not from knowledge, but from understanding.",
        "The journey of a thousand miles begins with a single step.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "In the middle of difficulty lies opportunity.",
        "The only way to do great work is to love what you do.",
        "Life is what happens to you while you're busy making other plans.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "It is during our darkest moments that we must focus to see the light.",
        "The only impossible journey is the one you never begin.",
        "Your limitation—it's only your imagination.",
        "Push yourself, because no one else is going to do it for you.",
        "Great things never come from comfort zones.",
        "Dream it. Wish it. Do it.",
        "Success doesn't just find you. You have to go out and get it.",
        "The harder you work for something, the greater you'll feel when you achieve it."
    ];

    // Function to create notification
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification) {
                notification.classList.add('notification-fade-out');
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    // Function to get random fortune
    function getRandomFortune() {
        const randomIndex = Math.floor(Math.random() * fortunes.length);
        console.log(`Selected fortune index: ${randomIndex}`);
        console.log(`Selected fortune: ${fortunes[randomIndex]}`);
        return fortunes[randomIndex];
    }

    // Display random fortune on page load
    const fortuneText = document.getElementById('fortune-text');
    const fortuneBox = document.getElementById('fortune-box');
    
    if (fortuneText && fortuneBox) {
        const selectedFortune = getRandomFortune();
        fortuneText.textContent = selectedFortune;
        console.log('Fortune displayed successfully');
        showNotification('Welcome! Your fortune has been revealed.', 'success');
    }

    // Theme configurations for fortune generator
    const themes = {
        red: {
            fontColor: '#ffffff',
            fontFamily: "'Georgia', serif",
            fontSize: '1.4em',
            backgroundColor: '#dc3545',
            borderColor: '#c82333'
        },
        green: {
            fontColor: '#ffffff',
            fontFamily: "'Verdana', sans-serif",
            fontSize: '1.2em',
            backgroundColor: '#28a745',
            borderColor: '#1e7e34'
        },
        blue: {
            fontColor: '#ffffff',
            fontFamily: "'Arial', sans-serif",
            fontSize: '1.3em',
            backgroundColor: '#007bff',
            borderColor: '#0056b3'
        },
        yellow: {
            fontColor: '#212529',
            fontFamily: "'Courier New', monospace",
            fontSize: '1.1em',
            backgroundColor: '#ffc107',
            borderColor: '#e0a800'
        }
    };

    // Function to apply theme to fortune box
    function applyTheme(themeName) {
        const theme = themes[themeName];
        if (!theme || !fortuneText || !fortuneBox) return;

        // Apply all 5 properties at once
        fortuneText.style.color = theme.fontColor;
        fortuneText.style.fontFamily = theme.fontFamily;
        fortuneText.style.fontSize = theme.fontSize;
        fortuneBox.style.backgroundColor = theme.backgroundColor;
        fortuneBox.style.borderColor = theme.borderColor;

        console.log(`Applied ${themeName} theme to fortune generator`);
        showNotification(`${themeName.charAt(0).toUpperCase() + themeName.slice(1)} theme applied!`, 'success');
    }

    // Button event listeners for themed fortune generator
    const redThemeBtn = document.getElementById('red-theme-btn');
    const greenThemeBtn = document.getElementById('green-theme-btn');
    const blueThemeBtn = document.getElementById('blue-theme-btn');
    const yellowThemeBtn = document.getElementById('yellow-theme-btn');

    if (redThemeBtn) {
        redThemeBtn.addEventListener('click', function() {
            applyTheme('red');
        });
    }

    if (greenThemeBtn) {
        greenThemeBtn.addEventListener('click', function() {
            applyTheme('green');
        });
    }

    if (blueThemeBtn) {
        blueThemeBtn.addEventListener('click', function() {
            applyTheme('blue');
        });
    }

    if (yellowThemeBtn) {
        yellowThemeBtn.addEventListener('click', function() {
            applyTheme('yellow');
        });
    }

    console.log('Fortune Generator initialized successfully');

    // Stopwatch Implementation
    let stopwatchTime = 0; // Time in seconds (multiples of 3)
    let stopwatchInterval = null;
    let isRunning = false;
    const MAX_TIME = 30; // Maximum time in seconds
    const INCREMENT = 3; // Time increment in seconds

    // Get stopwatch elements
    const timeDisplay = document.getElementById('time-display');
    const secondsCount = document.getElementById('seconds-count');
    const statusText = document.getElementById('status-text');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resetBtn = document.getElementById('reset-btn');
    const stopwatchSection = document.getElementById('stopwatch-section');

    // Function to format time display (MM:SS)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Function to update stopwatch display
    function updateStopwatchDisplay() {
        timeDisplay.textContent = formatTime(stopwatchTime);
        secondsCount.textContent = stopwatchTime;
        console.log(`Stopwatch time updated: ${stopwatchTime} seconds`);
    }

    // Function to update button states
    function updateButtonStates() {
        if (stopwatchTime >= MAX_TIME) {
            // Timer completed
            startBtn.disabled = true;
            stopBtn.disabled = true;
            resetBtn.disabled = false;
            statusText.textContent = 'Timer completed! (30 seconds reached)';
            statusText.className = 'status-completed';
            stopwatchSection.classList.add('stopwatch-completed');
            showNotification('Stopwatch completed! 30 seconds reached.', 'success');
        } else if (isRunning) {
            // Timer running
            startBtn.disabled = true;
            stopBtn.disabled = false;
            resetBtn.disabled = false;
            statusText.textContent = 'Stopwatch running...';
            statusText.className = 'status-running';
            stopwatchSection.classList.add('stopwatch-running');
            stopwatchSection.classList.remove('stopwatch-completed');
        } else {
            // Timer stopped/paused
            startBtn.disabled = false;
            stopBtn.disabled = true;
            resetBtn.disabled = false;
            if (stopwatchTime > 0) {
                statusText.textContent = `Paused at ${stopwatchTime} seconds`;
                statusText.className = 'status-stopped';
            } else {
                statusText.textContent = 'Ready to start';
                statusText.className = '';
            }
            stopwatchSection.classList.remove('stopwatch-running', 'stopwatch-completed');
        }
    }

    // Function to start stopwatch
    function startStopwatch() {
        if (stopwatchTime >= MAX_TIME) {
            showNotification('Timer already completed. Please reset to start again.', 'warning');
            return;
        }

        isRunning = true;
        console.log('Stopwatch started');
        showNotification('Stopwatch started', 'info');

        stopwatchInterval = setInterval(() => {
            stopwatchTime += INCREMENT;
            updateStopwatchDisplay();

            if (stopwatchTime >= MAX_TIME) {
                stopStopwatch();
                console.log('Stopwatch automatically stopped at 30 seconds');
            }

            updateButtonStates();
        }, 3000); // Update every 3 seconds

        updateButtonStates();
    }

    // Function to stop stopwatch
    function stopStopwatch() {
        if (!isRunning) {
            showNotification('Stopwatch is not running', 'warning');
            return;
        }

        isRunning = false;
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
        console.log(`Stopwatch stopped at ${stopwatchTime} seconds`);
        showNotification(`Stopwatch paused at ${stopwatchTime} seconds`, 'info');
        updateButtonStates();
    }

    // Function to reset stopwatch
    function resetStopwatch() {
        isRunning = false;
        if (stopwatchInterval) {
            clearInterval(stopwatchInterval);
            stopwatchInterval = null;
        }
        stopwatchTime = 0;
        updateStopwatchDisplay();
        updateButtonStates();
        console.log('Stopwatch reset to 0');
        showNotification('Stopwatch reset to 0', 'info');
    }

    // Add event listeners for stopwatch buttons
    if (startBtn) {
        startBtn.addEventListener('click', startStopwatch);
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', stopStopwatch);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetStopwatch);
    }

    // Initialize stopwatch display
    updateStopwatchDisplay();
    updateButtonStates();

    console.log('Stopwatch initialized successfully');

    // Todo List Implementation
    let todoList = [];
    let todoIdCounter = 1;

    // Get todo elements
    const todoInput = document.getElementById('todo-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const todoListElement = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');
    const totalTasksSpan = document.getElementById('total-tasks');
    const completedTasksSpan = document.getElementById('completed-tasks');
    const pendingTasksSpan = document.getElementById('pending-tasks');

    // Local Storage Functions
    function saveTodosToStorage() {
        localStorage.setItem('todoList', JSON.stringify(todoList));
        localStorage.setItem('todoIdCounter', todoIdCounter.toString());
        console.log('Todos saved to localStorage');
    }

    function loadTodosFromStorage() {
        const savedTodos = localStorage.getItem('todoList');
        const savedCounter = localStorage.getItem('todoIdCounter');
        
        if (savedTodos) {
            todoList = JSON.parse(savedTodos);
            console.log('Loaded todos from localStorage:', todoList);
        }
        
        if (savedCounter) {
            todoIdCounter = parseInt(savedCounter);
        }
        
        renderTodoList();
        updateStats();
    }

    // Function to update statistics
    function updateStats() {
        const total = todoList.length;
        const completed = todoList.filter(todo => todo.completed).length;
        const pending = total - completed;

        totalTasksSpan.textContent = total;
        completedTasksSpan.textContent = completed;
        pendingTasksSpan.textContent = pending;

        // Show/hide empty state
        if (total === 0) {
            emptyState.classList.remove('hidden');
            todoListElement.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            todoListElement.classList.remove('hidden');
        }
    }

    // Function to create todo item HTML
    function createTodoItemHTML(todo) {
        return `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <div class="todo-actions">
                    <button class="delete-btn" title="Delete task">Delete</button>
                </div>
            </li>
        `;
    }

    // Function to render the todo list
    function renderTodoList() {
        todoListElement.innerHTML = '';
        
        todoList.forEach(todo => {
            todoListElement.innerHTML += createTodoItemHTML(todo);
        });

        // Add event listeners to new elements
        attachTodoEventListeners();
        updateStats();
    }

    // Function to attach event listeners to todo items
    function attachTodoEventListeners() {
        // Checkbox event listeners
        const checkboxes = document.querySelectorAll('.todo-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const todoId = parseInt(this.closest('.todo-item').dataset.id);
                toggleTodoComplete(todoId);
            });
        });

        // Delete button event listeners
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const todoId = parseInt(this.closest('.todo-item').dataset.id);
                deleteTodo(todoId);
            });
        });
    }

    // Function to add a new todo
    function addTodo() {
        const todoText = todoInput.value.trim();
        
        if (todoText === '') {
            showNotification('Please enter a task', 'warning');
            todoInput.focus();
            return;
        }

        const newTodo = {
            id: todoIdCounter++,
            text: todoText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        todoList.push(newTodo);
        todoInput.value = '';
        
        renderTodoList();
        saveTodosToStorage();
        
        console.log('New todo added:', newTodo);
        showNotification('Task added successfully!', 'success');
        todoInput.focus();
    }

    // Function to toggle todo completion
    function toggleTodoComplete(todoId) {
        const todo = todoList.find(t => t.id === todoId);
        if (todo) {
            todo.completed = !todo.completed;
            renderTodoList();
            saveTodosToStorage();
            
            const status = todo.completed ? 'completed' : 'pending';
            console.log(`Todo ${todoId} marked as ${status}`);
            showNotification(`Task marked as ${status}`, 'info');
        }
    }

    // Function to delete a todo
    function deleteTodo(todoId) {
        const todoItem = document.querySelector(`[data-id="${todoId}"]`);
        todoItem.classList.add('removing');
        
        setTimeout(() => {
            todoList = todoList.filter(t => t.id !== todoId);
            renderTodoList();
            saveTodosToStorage();
            
            console.log(`Todo ${todoId} deleted`);
            showNotification('Task deleted', 'info');
        }, 300);
    }

    // Event listeners for todo functionality
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', addTodo);
    }

    if (todoInput) {
        todoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodo();
            }
        });

        todoInput.addEventListener('input', function() {
            addTaskBtn.disabled = this.value.trim() === '';
        });
    }

    // Initialize todo list
    loadTodosFromStorage();
    
    // Set initial button state
    if (addTaskBtn && todoInput) {
        addTaskBtn.disabled = todoInput.value.trim() === '';
    }

    console.log('Todo List initialized successfully');
});