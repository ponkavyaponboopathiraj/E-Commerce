
package ecart.ecommerce.repository;

import ecart.ecommerce.entity.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductRepository
        extends MongoRepository<Product, String> {

    // =========================================================
    // FIND PRODUCTS BY SELLER
    // =========================================================

    List<Product> findBySellerId(String sellerId);


    // =========================================================
    // FIND PRODUCTS BY CATEGORY
    // =========================================================

    List<Product> findByCategory(String category);


    // =========================================================
    // FIND ACTIVE PRODUCTS
    // =========================================================

    List<Product> findByStatus(
            ecart.ecommerce.enums.ProductStatus status
    );


    // =========================================================
    // FIND SELLER'S PRODUCTS BY STATUS
    // =========================================================

    List<Product> findBySellerIdAndStatus(
            String sellerId,
            ecart.ecommerce.enums.ProductStatus status
    );


    // =========================================================
    // SEARCH PRODUCT BY NAME
    // =========================================================

    List<Product> findByNameContainingIgnoreCase(
            String name
    );
}

