
package ecart.ecommerce.service;

import ecart.ecommerce.entity.Product;
import ecart.ecommerce.enums.ProductStatus;

import java.util.List;

public interface ProductService {
    Product addProduct(Product product);
    Product getProductById(String id);
    List<Product> getAllProducts();
    List<Product> getProductsBySeller(String sellerId);
    List<Product> getProductsByCategory(String category);
    List<Product> getProductsByStatus(ProductStatus status);
    List<Product> searchProductsByName(String name);
    Product updateProduct(String id,Product product);
    Product updateProductStatus(String id,ProductStatus status);
    void deleteProduct(String id);
    
}

