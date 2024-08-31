package com.example.taskmanager.emailservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.taskmanager.emailservice.model.Subscription;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public Subscription subscribe(String email) {
        Subscription subscription = new Subscription();
        subscription.setEmail(email);
        return subscriptionRepository.save(subscription);
    }

    public boolean isSubscribed(String email) {
        return subscriptionRepository.findByEmail(email) != null;
    }
}
