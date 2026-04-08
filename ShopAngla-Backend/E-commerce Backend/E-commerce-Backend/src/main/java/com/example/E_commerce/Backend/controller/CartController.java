package com.example.E_commerce.Backend.controller;

import com.example.E_commerce.Backend.dto.dtoRequest.AddToCartRequestDto;
import com.example.E_commerce.Backend.dto.dtoResponse.CartResponseDto;
import com.example.E_commerce.Backend.model.User;
import com.example.E_commerce.Backend.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Cart", description = "Shopping cart management endpoints")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Get current user's cart")
    public ResponseEntity<CartResponseDto> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @PostMapping("/items")
    @Operation(summary = "Add item to cart")
    public ResponseEntity<CartResponseDto> addToCart(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddToCartRequestDto request) {
        return ResponseEntity.ok(cartService.addToCart(user, request));
    }

    // FIX 3: itemId alterado de String para Long para bater com CartItem.id (Long)
    @PutMapping("/items/{itemId}")
    @Operation(summary = "Update cart item quantity")
    public ResponseEntity<CartResponseDto> updateCartItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateCartItem(user, itemId, quantity));
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove item from cart")
    public ResponseEntity<Void> removeFromCart(
            @AuthenticationPrincipal User user,
            @PathVariable Long itemId) {
        cartService.removeFromCart(user, itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    @Operation(summary = "Clear cart")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal User user) {
        cartService.clearCart(user);
        return ResponseEntity.noContent().build();
    }
}
