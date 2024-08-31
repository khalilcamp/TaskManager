package com.example.taskmanager.emailservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.taskmanager.service.TaskService;

@Component
public class CustomTaskScheduler {

    @Autowired
    private TaskService taskService;

    @Scheduled(cron = "0 0 8 * * ?") // Execute todos os dias às 8:00 AM
    public void sendDailyPendingTaskReminders() {
        taskService.sendPendingTaskReminders();
    }
}
