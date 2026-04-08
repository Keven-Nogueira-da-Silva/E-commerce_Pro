package com.example.E_commerce.Backend.dto.dtoResponse;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponseDto {
    private Long id;
    private String orderNumber;
    private BigDecimal totalAmount;
    private String status;
    private String shippingAddress;
    private List<OrderItemResponseDto> items;
    private PaymentResponseDto payment;
    private LocalDateTime createdAt;
}
