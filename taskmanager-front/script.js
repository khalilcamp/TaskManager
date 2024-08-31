document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const taskForm = document.getElementById('task-form');
    const searchInput = document.getElementById('task-search');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescriptionInput = document.getElementById('task-description');
    const searchTermDisplay = document.getElementById('search-term');
    const noTasksFound = document.getElementById('no-tasks-found');

    let currentPage = 0;
    let searchTerm = '';

    const showToast = (message, type = 'info') => {
        Toastify({
            text: message,
            className: type,
            gravity: "bottom",
            position: "right",
            backgroundColor: type === 'error' ? '#ff6b6b' : '#4caf50',
            duration: 2000
        }).showToast();
    };

    const isWeekend = () => {
        const today = new Date();
        const day = today.getDay();
        return day === 0 || day >= 5; //if friday+, can't create 
    };

    const fetchTasks = async (search) => {
        try {
            const response = await fetch(`http://localhost:8080/api/tasks?search=${encodeURIComponent(search)}&page=${currentPage}&size=8`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
    
            taskList.innerHTML = '';
    
            if (data.content.length === 0) {
                noTasksFound.style.display = 'block';
            } else {
                noTasksFound.style.display = 'none';
                data.content.forEach(task => {
                    const listItem = document.createElement('li');
                    const statusClass = task.status === 'COMPLETED' ? 'completed' : 'pending'; // Use 'completed' for completed tasks
                    listItem.classList.add(statusClass);
                    listItem.innerHTML = `
                        <div class="iconsContainer">
                            <span class="icons">
                                <svg class="checkmark" data-id="${task.id}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" viewBox="0 0 16 16">
                                    <path d="M10.97 4.97a.75.75 0 0 1 1.08 1.05l-5 6a.75.75 0 0 1-1.08.02L3.324 9.384a.75.75 0 1 1 1.052-1.068l1.919 2.232 4.616-5.581z"/>
                                </svg>
                                <svg class="edit" data-id="${task.id}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 3.5L12.5 2.207 13.793 3.5 12.5 4.793 11.207 3.5zM10.5 4.207L11.793 5.5 4 13.293V12H3.5a.5.5 0 0 1-.5-.5V11H2.707L10.5 4.207zM1 13.5V15h1.5L9 8.207 7.793 7 1 13.5z"/>
                                </svg>
                                <svg class="delete" data-id="${task.id}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5V6H5v-.5zM3 6v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6H3zm9 0H4v9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6zm-1.5-4a1.5 1.5 0 0 1 1.5 1.5V3h-9v-.5A1.5 1.5 0 0 1 6.5 1h3z"/>
                                </svg>
                            </span>
                        </div>
                        <div class="taskContainer">
                            <div class="taskTitle">${task.title}</div>
                            <div class="taskDescription">${task.description}</div>
                        </div>
                    `;
                    taskList.appendChild(listItem);
    
                    listItem.querySelector('.checkmark').addEventListener('click', () => completeTask(task.id));
                    listItem.querySelector('.edit').addEventListener('click', () => editTask(task.id));
                    listItem.querySelector('.delete').addEventListener('click', () => deleteTask(task.id));
                });
            }
            pageInfo.textContent = `Page ${currentPage + 1}`;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            showToast('Error fetching tasks', 'error');
        }
    };

    const completeTask = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'COMPLETED' })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            showToast('Task completed successfully');
            fetchTasks(); 
        } catch (error) {
            showToast('Error completing task', 'error');
        }
    };

    const editTask = async (id) => {
        const newTitle = prompt('Enter new title');
        const newDescription = prompt('Enter new description');
        const newStatus = prompt('Enter new status (PENDING, IN_PROGRESS, COMPLETED)'); 
    
        if (newTitle && newDescription && newStatus) {
            try {
                const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: newTitle, description: newDescription, status: newStatus })
                });
    
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }
    
                showToast('Task updated successfully');
                fetchTasks(searchTerm);
            } catch (error) {
                showToast(`Error updating task: ${error.message}`, 'error');
            }
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            showToast('Task deleted successfully');
            fetchTasks(searchTerm); 
        } catch (error) {
            showToast('Error deleting task', 'error');
        }
    };

    const addTask = async (title, description) => {
        if (isWeekend()) {
            showToast('Cannot create tasks on weekends, sorry!', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            showToast('Task created successfully');
            fetchTasks(searchTerm); 
        } catch (error) {
            showToast('Error creating task', 'error');
        }
    };


    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();

        if (title && description) {
            addTask(title, description);
        } else {
            showToast('Please fill out all fields', 'error');
        }
    });

    searchInput.addEventListener('input', (event) => {
        searchTerm = event.target.value.trim();
        searchTermDisplay.textContent = searchTerm ? `Searching for: ${searchTerm}` : 'No search term';
        fetchTasks(searchTerm);
    });

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            fetchTasks(searchTerm);
        }
    });

    nextPageButton.addEventListener('click', () => {
        currentPage++;
        fetchTasks(searchTerm);
    });


    fetchTasks(searchTerm);

    const notificationForm = document.getElementById('notification-form');
    const emailInput = document.getElementById('email');
    const notificationMessage = document.getElementById('notification-message');

    notificationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = emailInput.value.trim();

        try {
            const response = await fetch('http://localhost:8080/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            notificationMessage.textContent = 'You have successfully subscribed!';
            notificationMessage.style.display = 'block';
            emailInput.value = ''; 

        } catch (error) {
            notificationMessage.textContent = 'Error subscribing. Please try again.';
            notificationMessage.style.display = 'block';
        }
    });
});
