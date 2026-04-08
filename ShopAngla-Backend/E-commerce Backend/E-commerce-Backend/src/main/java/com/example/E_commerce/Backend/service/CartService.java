package com.example.E_commerce.Backend.service;

import com.example.E_commerce.Backend.dto.dtoRequest.AddToCartRequestDto;
import com.example.E_commerce.Backend.dto.dtoResponse.CartItemResponseDto;
import com.example.E_commerce.Backend.dto.dtoResponse.CartResponseDto;
import com.example.E_commerce.Backend.model.Cart;
import com.example.E_commerce.Backend.model.CartItem;
import com.example.E_commerce.Backend.model.Product;
import com.example.E_commerce.Backend.model.User;
import com.example.E_commerce.Backend.repository.CartRepository;
import com.example.E_commerce.Backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartResponseDto getCart(User user) {
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponseDto addToCart(User user, AddToCartRequestDto request) {
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock");
        }

        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            existingItem.setUnitPrice(product.getPrice());
            existingItem.calculateSubtotal();
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            newItem.setUnitPrice(product.getPrice());
            newItem.calculateSubtotal();
            cart.getItems().add(newItem);
        }

        updateCartTotal(cart);
        cart = cartRepository.save(cart);

        return mapToResponse(cart);
    }

    // FIX 1: itemId alterado de String para Long (CartItem.id é Long)
    @Transactional
    public CartResponseDto updateCartItem(User user, Long itemId, Integer quantity) {
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            Product product = item.getProduct();
            if (product.getStockQuantity() < quantity) {
                throw new RuntimeException("Insufficient stock");
            }
            item.setQuantity(quantity);
            item.calculateSubtotal();
        }

        updateCartTotal(cart);
        cart = cartRepository.save(cart);

        return mapToResponse(cart);
    }

    // FIX 1: itemId alterado de String para Long
    @Transactional
    public void removeFromCart(User user, Long itemId) {
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().removeIf(item -> item.getId().equals(itemId));
        updateCartTotal(cart);
        cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(User user) {
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
    }

    private void updateCartTotal(Cart cart) {
        BigDecimal total = cart.getItems().stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(total);
    }

    private CartResponseDto mapToResponse(Cart cart) {
        return CartResponseDto.builder()
                .id(cart.getId())
                .items(cart.getItems().stream()
                        .map(this::mapToCartItemResponse)
                        .collect(Collectors.toList()))
                .totalAmount(cart.getTotalAmount())
                .totalItems(cart.getItems().size())
                .build();
    }

    // FIX 2: preencher productId e id no CartItemResponseDto (era null, causava NPE no OrderService)
    private CartItemResponseDto mapToCartItemResponse(CartItem item) {
        return CartItemResponseDto.builder()
                .id(String.valueOf(item.getId()))
                .productId(String.valueOf(item.getProduct().getId()))
                .productName(item.getProduct().getName())
                .unitPrice(item.getUnitPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .build();
    }
}
