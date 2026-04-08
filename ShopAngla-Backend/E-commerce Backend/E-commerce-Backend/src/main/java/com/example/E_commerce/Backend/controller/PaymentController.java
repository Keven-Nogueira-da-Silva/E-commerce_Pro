package com.example.E_commerce.Backend.controller;

import com.example.E_commerce.Backend.dto.dtoResponse.PaymentResponseDto;
import com.example.E_commerce.Backend.model.Payment;
import com.example.E_commerce.Backend.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Payments", description = "Payment management endpoints")
public class PaymentController {

    private final PaymentService paymentService;

    // FIX 5a: agora busca o pagamento real do serviço em vez de retornar DTO vazio
    @GetMapping("/{paymentId}")
    @Operation(summary = "Get payment details")
    public ResponseEntity<PaymentResponseDto> getPayment(@PathVariable Long paymentId) {
        Payment payment = paymentService.getPayment(paymentId);
        PaymentResponseDto response = PaymentResponseDto.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .method(payment.getMethod().name())
                .status(payment.getStatus().name())
                .transactionId(payment.getTransactionId())
                .paymentDate(payment.getPaymentDate())
                .build();
        return ResponseEntity.ok(response);
    }

    // FIX 5b: paymentId era String, corrigido para Long + implementado o refund de verdade
    @PostMapping("/{paymentId}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Refund a payment (Admin only)")
    public ResponseEntity<PaymentResponseDto> refundPayment(@PathVariable Long paymentId) {
        Payment payment = paymentService.refundPayment(paymentId);
        PaymentResponseDto response = PaymentResponseDto.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .method(payment.getMethod().name())
                .status(payment.getStatus().name())
                .transactionId(payment.getTransactionId())
                .paymentDate(payment.getPaymentDate())
                .build();
        return ResponseEntity.ok(response);
    }
}
