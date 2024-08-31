document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const taskForm = document.getElementById('task-form');
    const searchInput = document.getElementById('task-search');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const addTaskForm = document.getElementById('task-form'); 
    const taskTitleInput = document.getElementById('task-title');
    const taskDescriptionInput = document.getElementById('task-description');
    const searchTermDisplay = document.getElementById('search-term'); 
    const noTasksFound = document.getElementById('no-tasks-found'); 
    let currentPage = 0;
    let searchTerm = '';

    const fetchTasks = async (search) => {
        try {
            const response = await fetch(`http://localhost:8080/api/tasks?search=${encodeURIComponent(search)}&page=${currentPage}&size=8`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
        
            console.log('API response:', data); 
        
            taskList.innerHTML = ''; 
        
            if (data.content.length === 0) {
                const listItem = document.createElement('li');
                listItem.textContent = 'Task not found';
                taskList.appendChild(listItem);
            } else {
                data.content.forEach(task => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${task.title} - ${task.description}`;
                    taskList.appendChild(listItem);
                });
            }
        
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };
    
    

    const addTask = async (title, description) => {
        try {
            const payload = JSON.stringify({ title, description });
            console.log('Payload:', payload); 
    
            const response = await fetch('http://localhost:8080/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: payload
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    

            taskTitleInput.value = '';
            taskDescriptionInput.value = '';
    
            fetchTasks(searchTerm);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    
    addTaskForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();

        if (title && description) {
            addTask(title, description);
        } else {
            console.log('Title and description are required.');
        }
    });

    searchInput.addEventListener('input', () => {
        searchTerm = searchInput.value.trim();
        searchTermDisplay.textContent = searchTerm; 
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
});
