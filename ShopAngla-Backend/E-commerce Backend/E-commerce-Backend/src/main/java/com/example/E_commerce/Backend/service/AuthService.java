package com.example.E_commerce.Backend.service;

import com.example.E_commerce.Backend.config.JwtService;
import com.example.E_commerce.Backend.dto.dtoResponse.AuthResponseDto;
import com.example.E_commerce.Backend.dto.dtoRequest.LoginRequestDto;
import com.example.E_commerce.Backend.dto.dtoRequest.RegisterRequestDto;
import com.example.E_commerce.Backend.model.Cart;
import com.example.E_commerce.Backend.model.User;
import com.example.E_commerce.Backend.repository.CartRepository;
import com.example.E_commerce.Backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponseDto register(RegisterRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(User.Role.USER);

        user = userRepository.save(user);

        // Create cart for user
        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);

        String token = jwtService.generateToken(user);

        return AuthResponseDto.builder()
                .token(token)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponseDto login(LoginRequestDto request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();
        String token = jwtService.generateToken(user);

        return AuthResponseDto.builder()
                .token(token)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .build();
    }
}