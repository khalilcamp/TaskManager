package com.example.taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TaskManagerApp {

    public static void main(String[] args) {
        SpringApplication.run(TaskManagerApp.class, args);
    }
}
