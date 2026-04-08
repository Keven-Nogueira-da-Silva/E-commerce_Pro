package com.example.E_commerce.Backend.repository;


import com.example.E_commerce.Backend.model.Cart;
import com.example.E_commerce.Backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}