package com.example.backend.config;

import com.example.backend.filter.AuthFilter;
import com.example.backend.service.TokenService;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<AuthFilter> authFilter(TokenService tokenService) {
        FilterRegistrationBean<AuthFilter> reg = new FilterRegistrationBean<>();
        reg.setFilter(new AuthFilter(tokenService));
        reg.addUrlPatterns("/api/user/*");
        reg.setOrder(1);
        return reg;
    }
}
