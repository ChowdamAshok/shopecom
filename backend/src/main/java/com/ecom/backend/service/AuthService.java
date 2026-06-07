package com.ecom.backend.service;

import com.ecom.backend.dto.request.LoginRequest;
import com.ecom.backend.dto.request.RegisterRequest;
import com.ecom.backend.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String refreshToken);
}