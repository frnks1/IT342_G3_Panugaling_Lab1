package com.example.backend.filter;

import com.example.backend.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;

import java.io.IOException;

public class AuthFilter extends HttpFilter {
    private final TokenService tokenService;

    public AuthFilter(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    protected void doFilter(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
        String auth = req.getHeader(HttpHeaders.AUTHORIZATION);
        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            tokenService.getUserId(token).ifPresent(userId -> req.setAttribute("userId", userId));
        }
        chain.doFilter(req, res);
    }
}
