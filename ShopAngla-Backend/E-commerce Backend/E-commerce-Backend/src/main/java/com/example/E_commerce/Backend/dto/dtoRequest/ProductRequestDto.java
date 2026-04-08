package com.example.E_commerce.Backend.dto.dtoRequest;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequestDto {
    @NotBlank
    private String name;

    private String description;

    @NotNull
    @Positive
    private BigDecimal price;

    @Min(0)
    private Integer stockQuantity;

    private String imageUrl;

    private String category;
}

