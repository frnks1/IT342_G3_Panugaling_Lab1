package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.payload.AuthResponse;
import com.example.backend.payload.LoginRequest;
import com.example.backend.payload.RegisterRequest;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, TokenService tokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepository.findByEmail(req.email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        if (userRepository.findByUsername(req.username).isPresent()) {
            return ResponseEntity.badRequest().body("Username already in use");
        }
        User u = new User();
        u.setUsername(req.username);
        u.setEmail(req.email);
        u.setPassword(passwordEncoder.encode(req.password));
        userRepository.save(u);
        return ResponseEntity.ok("registered");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Optional<User> o = userRepository.findByEmail(req.email);
        if (o.isEmpty()) return ResponseEntity.status(401).body("invalid credentials");
        User u = o.get();
        if (!passwordEncoder.matches(req.password, u.getPassword())) {
            return ResponseEntity.status(401).body("invalid credentials");
        }
        String token = tokenService.createToken(u.getId());
        return ResponseEntity.ok(new AuthResponse(token, u.getId()));
    }
}
