package com.example.E_commerce.Backend.dto.dtoResponse;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CartResponseDto {
    private Long id;
    private List<CartItemResponseDto> items;
    private BigDecimal totalAmount;
    private Integer totalItems;
}
