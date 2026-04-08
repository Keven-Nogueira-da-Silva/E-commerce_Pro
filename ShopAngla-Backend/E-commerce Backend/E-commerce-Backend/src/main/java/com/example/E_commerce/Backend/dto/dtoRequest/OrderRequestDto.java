package com.example.E_commerce.Backend.dto.dtoRequest;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderRequestDto {
    @NotBlank
    private String shippingAddress;

    private PaymentInfo paymentInfo;


    @Data
    public static class PaymentInfo {
        private String method;
        private String cardNumber;
        private String cardHolderName;
        private String expiryDate;
        private String cvv;
    }
}
