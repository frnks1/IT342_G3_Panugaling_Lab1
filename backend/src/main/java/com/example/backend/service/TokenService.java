package com.example.backend.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenService {
    private final Map<String, Long> tokenToUser = new ConcurrentHashMap<>();

    public String createToken(Long userId) {
        String token = UUID.randomUUID().toString();
        tokenToUser.put(token, userId);
        return token;
    }

    public Optional<Long> getUserId(String token) {
        return Optional.ofNullable(tokenToUser.get(token));
    }
}
