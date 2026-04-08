package com.example.E_commerce.Backend.service;

import com.example.E_commerce.Backend.dto.dtoRequest.OrderRequestDto;
import com.example.E_commerce.Backend.dto.dtoResponse.*;
import com.example.E_commerce.Backend.model.*;
import com.example.E_commerce.Backend.repository.OrderRepository;
import com.example.E_commerce.Backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final ProductRepository productRepository;
    private final PaymentService paymentService;

    @Transactional
    public OrderResponseDto createOrder(User user, OrderRequestDto request) {
        CartResponseDto cart = cartService.getCart(user);

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot create order: cart is empty");
        }

        // FIX 4a: verificação de estoque sem duplicação
        for (CartItemResponseDto cartItem : cart.getItems()) {
            Product product = productRepository.findById(Long.parseLong(cartItem.getProductId()))
                    .orElseThrow(() -> new RuntimeException("Product not found: " + cartItem.getProductName()));
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
        }

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(cart.getTotalAmount());
        order.setShippingAddress(request.getShippingAddress());

        // FIX 4b: adicionar itens ao order e decrementar estoque (estava completamente ausente)
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItemResponseDto cartItem : cart.getItems()) {
            Product product = productRepository.findById(Long.parseLong(cartItem.getProductId()))
                    .orElseThrow(() -> new RuntimeException("Product not found: " + cartItem.getProductName()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getUnitPrice());
            orderItem.setSubtotal(cartItem.getSubtotal());
            orderItems.add(orderItem);

            // Decrementar estoque
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }
        order.setItems(orderItems);

        order = orderRepository.save(order);

        // Process payment
        Payment payment = paymentService.processPayment(order, request.getPaymentInfo());
        order.setPayment(payment);
        order = orderRepository.save(order);

        // Clear cart
        cartService.clearCart(user);

        return mapToResponse(order);
    }

    public OrderResponseDto getOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToResponse(order);
    }

    public Page<OrderResponseDto> getUserOrders(User user, Pageable pageable) {
        return orderRepository.findByUser(user, pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public OrderResponseDto updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        order = orderRepository.save(order);
        return mapToResponse(order);
    }

    private OrderResponseDto mapToResponse(Order order) {
        return OrderResponseDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .shippingAddress(order.getShippingAddress())
                .items(order.getItems().stream()
                        .map(this::mapToOrderItemResponse)
                        .collect(Collectors.toList()))
                .payment(mapToPaymentResponse(order.getPayment()))
                .createdAt(order.getCreatedAt())
                .build();
    }

    private OrderItemResponseDto mapToOrderItemResponse(OrderItem item) {
        return OrderItemResponseDto.builder()
                .productId(String.valueOf(item.getProduct().getId()))
                .productName(item.getProduct().getName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(item.getSubtotal())
                .build();
    }

    private PaymentResponseDto mapToPaymentResponse(Payment payment) {
        if (payment == null) return null;
        return PaymentResponseDto.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .method(payment.getMethod().name())
                .status(payment.getStatus().name())
                .transactionId(payment.getTransactionId())
                .paymentDate(payment.getPaymentDate())
                .build();
    }
}
