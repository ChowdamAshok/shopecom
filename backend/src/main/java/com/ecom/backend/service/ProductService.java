package com.ecom.backend.service;

import com.ecom.backend.dto.request.ProductRequest;
import com.ecom.backend.dto.response.PageResponse;
import com.ecom.backend.dto.response.ProductResponse;

public interface ProductService {
    ProductResponse createProduct(ProductRequest request);
    ProductResponse updateProduct(Long id, ProductRequest request);
    ProductResponse getProductById(Long id);
    PageResponse<ProductResponse> getAllProducts(int page, int size, String sortBy, String sortDir);
    PageResponse<ProductResponse> getProductsByCategory(Long categoryId, int page, int size);
    PageResponse<ProductResponse> searchProducts(String keyword, int page, int size);
    void deleteProduct(Long id);
}