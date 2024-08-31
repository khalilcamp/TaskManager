package com.example.taskmanager.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.taskmanager.emailservice.EmailService;
import com.example.taskmanager.emailservice.SubscriptionRepository;
import com.example.taskmanager.emailservice.model.Subscription;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.TaskStatus;
import com.example.taskmanager.repository.TaskRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private EmailService emailService;

    public Page<Task> getAllTasks(Pageable pageable) {
        return taskRepository.findAll(pageable);
    }

    public Task createTask(Task task) {
        task.setCreatedAt(LocalDate.now());
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task task) {
        
        Task existingTask = taskRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        
        if (existingTask.getStatus() == TaskStatus.PENDING) {
            
            existingTask.setTitle(task.getTitle());
            existingTask.setDescription(task.getDescription());

            
            if (task.getStatus() != null) {
                existingTask.setStatus(task.getStatus());
            }

            
            return taskRepository.save(existingTask);
        }

        
        throw new IllegalStateException("Only tasks with PENDING status can be updated.");
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        taskRepository.delete(task);
    }

    public Page<Task> searchTasks(String searchTerm, Pageable pageable) {
        return taskRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(searchTerm, searchTerm, pageable);
    }

    public List<Task> getPendingTasks() {
        return taskRepository.findByStatus(TaskStatus.PENDING);
    }

    public void sendPendingTaskReminders() {
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        for (Subscription subscription : subscriptions) {
            String email = subscription.getEmail();
            String subject = "Pending Task Reminder";
            String text = "You have pending tasks to review. Please check your task manager.";
            emailService.sendReminderEmail(email, subject, text);
        }
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }
}
