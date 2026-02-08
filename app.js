const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const clearCompletedButton = document.getElementById('clearCompletedButton');
const taskCountElement = document.getElementById('taskCount');
const currentDateElement = document.getElementById('currentDate');

//query selectors for empty state and filter buttons
const emptyState = document.querySelector('.empty-state');
const filterButtons = document.querySelectorAll('.filter');

let tasks = [];
// Load tasks from localStorage on page load
let currentFilter = 'all';

addTaskButton.addEventListener('click', () => {
    addTodo(taskInput.value);
});

taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTodo(taskInput.value);
    }
});

clearCompletedButton.addEventListener('click', clearCompleted);

function addTodo(taskText) {
    if (taskText.trim() === '') {
        alert('Ooops! Please enter a task.');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();    
    renderTasks();
    taskInput.value = '';
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    updateItemsLeft();
    checkEmptyState();
}

function updateItemsLeft() {
    const itemsLeft = tasks.filter(task => !task.completed);
    taskCountElement.textContent = `${itemsLeft.length} ${itemsLeft.length === 1 ? 'item' : 'items'} left`;
}

function checkEmptyState() {
const filteredTasks = tasks.filter(filterTasks(currentFilter));
if (filteredTasks.length === 0) {
    emptyState.style.display = 'block';
} else {
    emptyState.style.display = 'none';
}
}

 function filterTasks(filter) {
    switch (filter) {
        case 'active':
            return task => !task.completed;
        case 'completed':
            return task => task.completed;
        default:
            return () => true;
    }
 }

    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(filterTasks(currentFilter));
        filteredTasks.forEach(task => {
            const taskItem = document.createElement("li");
            taskItem.classList.add("task-item");
            if (task.completed) taskItem.classList.add("completed");

            const checkboxContainer = document.createElement("label");
            checkboxContainer.classList.add("checkbox-container");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("task-checkbox");
            checkbox.checked = task.completed;
            checkbox.addEventListener("change", () => toggleTaskCompletion(task.id));

            const checkmark = document.createElement("span");
            checkmark.classList.add("checkmark");

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(checkmark);

            const taskText = document.createElement("span");
            taskText.classList.add("task-item-text");
            taskText.textContent = task.text;

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-button");
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.addEventListener("click", () => deleteTask(task.id));

            taskItem.appendChild(checkboxContainer);
            taskItem.appendChild(taskText);
            taskItem.appendChild(deleteBtn);
            taskList.appendChild(taskItem);
          });
          
        };

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    function toggleTaskCompletion(id) {
        const task = tasks.find(task => task.id === id);    
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    }

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}   

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
}

filterButtons.forEach(filter => {
    filter.addEventListener('click', () => {
        setActiveFilter(filter.getAttribute('data-filter')) ;
    });
});

function setActiveFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(item => {
    if (item.getAttribute('data-filter') === filter) {
        item.classList.add('active');
    } else {
        item.classList.remove('active');
    }
    });
    renderTasks();
    checkEmptyState();
}
function updateCurrentDate() {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const today = new Date();
    currentDateElement.textContent = today.toLocaleDateString('en-US', options);
}

window.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    updateItemsLeft();
    updateCurrentDate();
})