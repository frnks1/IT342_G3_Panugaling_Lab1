package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest req) {
        Object uid = req.getAttribute("userId");
        if (uid == null) return ResponseEntity.status(401).body("unauthorized");
        Optional<User> u = userRepository.findById((Long) uid);
        if (u.isEmpty()) return ResponseEntity.status(404).body("not found");
        User user = u.get();
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
}
