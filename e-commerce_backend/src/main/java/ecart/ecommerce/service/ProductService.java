package ecart.ecommerce.service;

import ecart.ecommerce.entity.Product;

import java.util.List;

public interface ProductService {

    Product addProduct(Product product);
    Product getProductById(String productId);
    List<Product> getAllProducts();
    List<Product> getProductsBySeller(String sellerId);
    Product updateProduct(String productId, Product product);
    void deleteProduct(String productId);
}