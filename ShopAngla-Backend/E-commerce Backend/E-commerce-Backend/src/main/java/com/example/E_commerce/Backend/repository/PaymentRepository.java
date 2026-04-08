package com.example.E_commerce.Backend.repository;

import com.example.E_commerce.Backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
