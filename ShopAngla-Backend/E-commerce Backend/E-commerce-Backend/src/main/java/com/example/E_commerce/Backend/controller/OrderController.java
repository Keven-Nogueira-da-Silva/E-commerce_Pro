package com.example.E_commerce.Backend.controller;

import com.example.E_commerce.Backend.dto.dtoRequest.OrderRequestDto;
import com.example.E_commerce.Backend.dto.dtoResponse.OrderResponseDto;
import com.example.E_commerce.Backend.model.Order;
import com.example.E_commerce.Backend.model.User;
import com.example.E_commerce.Backend.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Orders", description = "Order management endpoints")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Create a new order")
    public ResponseEntity<OrderResponseDto> createOrder(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody OrderRequestDto request) {
        return ResponseEntity.ok(orderService.createOrder(user, request));
    }

    @GetMapping
    @Operation(summary = "Get current user's orders")
    public ResponseEntity<Page<OrderResponseDto>> getUserOrders(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(orderService.getUserOrders(user, pageable));
    }

    @GetMapping("/{orderId}")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<OrderResponseDto> getOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrder(orderId));
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update order status (Admin only)")
    public ResponseEntity<OrderResponseDto> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId,
                Order.OrderStatus.valueOf(status)));
    }
}
