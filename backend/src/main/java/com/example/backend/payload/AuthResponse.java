package com.example.backend.payload;

public class AuthResponse {
    public String token;
    public Long userId;

    public AuthResponse(String token, Long userId) {
        this.token = token;
        this.userId = userId;
    }
}
