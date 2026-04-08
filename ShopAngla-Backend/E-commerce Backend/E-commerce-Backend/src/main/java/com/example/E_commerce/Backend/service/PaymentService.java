package com.example.E_commerce.Backend.service;

import com.example.E_commerce.Backend.dto.dtoRequest.OrderRequestDto;
import com.example.E_commerce.Backend.model.Order;
import com.example.E_commerce.Backend.model.Payment;
import com.example.E_commerce.Backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Transactional
    public Payment processPayment(Order order, OrderRequestDto.PaymentInfo paymentInfo) {
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setMethod(Payment.PaymentMethod.valueOf(paymentInfo.getMethod()));
        payment.setStatus(Payment.PaymentStatus.PROCESSING);

        // Simulate payment processing
        try {
            // In a real implementation, integrate with payment gateway here
            String transactionId = UUID.randomUUID().toString();
            payment.setTransactionId(transactionId);
            payment.setStatus(Payment.PaymentStatus.COMPLETED);
            payment.setPaymentDate(LocalDateTime.now());
        } catch (Exception e) {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            throw new RuntimeException("Payment processing failed: " + e.getMessage());
        }

        return paymentRepository.save(payment);
    }

    public Payment getPayment(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    @Transactional
    public Payment refundPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() != Payment.PaymentStatus.COMPLETED) {
            throw new RuntimeException("Only completed payments can be refunded");
        }

        // Simulate refund processing
        payment.setStatus(Payment.PaymentStatus.REFUNDED);
        return paymentRepository.save(payment);
    }
}