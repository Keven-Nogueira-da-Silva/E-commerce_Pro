package com.example.E_commerce.Backend.dto.dtoResponse;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CartItemResponseDto {
    private String id;
    private String product;
    private String productId;
    private String productName;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;
}
