package com.example.E_commerce.Backend.controller;

import com.example.E_commerce.Backend.dto.dtoRequest.ProductRequestDto;
import com.example.E_commerce.Backend.dto.dtoResponse.ProductResponseDto;
import com.example.E_commerce.Backend.service.ProductService;
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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product management endpoints")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Get all products")
    public ResponseEntity<Page<ProductResponseDto>> getAllProducts(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ProductResponseDto> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProduct(id));
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get products by category")
    public ResponseEntity<Page<ProductResponseDto>> getProductsByCategory(
            @PathVariable String category,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(productService.getProductsByCategory(category, pageable));
    }

    @GetMapping("/search")
    @Operation(summary = "Search products by name")
    public ResponseEntity<Page<ProductResponseDto>> searchProducts(
            @RequestParam String name,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(productService.searchProducts(name, pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Create a new product (Admin only)")
    public ResponseEntity<ProductResponseDto> createProduct(@Valid @RequestBody ProductRequestDto request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Update a product (Admin only)")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDto request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Delete a product (Admin only)")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
