package com.example.taskmanager.emailservice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SubscriptionController {

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody EmailSubscriptionRequest request) {

        if (isValidEmail(request.getEmail())) {

            return ResponseEntity.ok().body("Subscription successful");
        } else {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
    }

    private boolean isValidEmail(String email) {

        return email != null && email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
    }
}