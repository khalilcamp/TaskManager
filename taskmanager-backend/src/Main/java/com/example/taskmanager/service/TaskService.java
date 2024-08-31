package com.example.taskmanager.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.TaskStatus;
import com.example.taskmanager.repository.TaskRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public Page<Task> getAllTasks(Pageable pageable) {
        return taskRepository.findAll(pageable);
    }

    public Task createTask(Task task) {
        if (LocalDate.now().getDayOfWeek().getValue() <= 5) { 
            task.setCreatedAt(LocalDate.now()); 
            return taskRepository.save(task);
        }
        throw new IllegalStateException("Tasks can only be created during weekdays.");
    }

    public Task updateTask(Long id, Task task) {
        Task existingTask = taskRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Task not found"));
        if (existingTask.getStatus() == TaskStatus.PENDING) { 
            existingTask.setTitle(task.getTitle());
            existingTask.setDescription(task.getDescription());
            existingTask.setStatus(task.getStatus());
            return taskRepository.save(existingTask);
        }
        throw new IllegalStateException("Only tasks with PENDING status can be updated.");
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Task not found"));
        if (task.getCreatedAt().isBefore(LocalDate.now().minusDays(5))) { 
            taskRepository.delete(task);
        } else {
            throw new IllegalStateException("Tasks can only be deleted if they are older than 5 days.");
        }
    }

    public Page<Task> searchTasks(String searchTerm, Pageable pageable) {
        return taskRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(searchTerm, searchTerm, pageable);
    }
}
