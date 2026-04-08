package com.example.E_commerce.Backend.service;

import com.example.E_commerce.Backend.dto.dtoRequest.ProductRequestDto;
import com.example.E_commerce.Backend.dto.dtoResponse.ProductResponseDto;
import com.example.E_commerce.Backend.model.Product;
import com.example.E_commerce.Backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional
    public ProductResponseDto createProduct(ProductRequestDto request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(request.getCategory());

        product = productRepository.save(product);

        return mapToResponse(product);
    }

    public ProductResponseDto getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToResponse(product);
    }

    public Page<ProductResponseDto> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    public Page<ProductResponseDto> getProductsByCategory(String category, Pageable pageable) {
        return productRepository.findByCategory(category, pageable)
                .map(this::mapToResponse);
    }

    public Page<ProductResponseDto> searchProducts(String name, Pageable pageable) {
        return productRepository.searchByName(name, pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public ProductResponseDto updateProduct(Long id, ProductRequestDto request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(request.getCategory());

        product = productRepository.save(product);

        return mapToResponse(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }

    private ProductResponseDto mapToResponse(Product product) {
        return ProductResponseDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .imageUrl(product.getImageUrl())
                .category(product.getCategory())
                .createdAt(product.getCreatedAt())
                .build();
    }
}