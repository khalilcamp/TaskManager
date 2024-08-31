package com.example.taskmanager.emailservice;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.taskmanager.emailservice.model.Subscription;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Subscription findByEmail(String email);
}
