package com.example.E_commerce.Backend.dto.dtoRequest;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddToCartRequestDto {
    @NotNull
    private Long productId;

    @NotNull
    @Min(1)
    private Integer quantity;
}

