package com.example.E_commerce.Backend.dto.dtoResponse;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponseDto {
    private Long id;
    private BigDecimal amount;
    private String method;
    private String status;
    private String transactionId;
    private LocalDateTime paymentDate;
}
