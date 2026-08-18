package ecart.ecommerce.repository;
import ecart.ecommerce.entity.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProductRepository
        extends MongoRepository<Product, String> {

    List<Product> findBySellerId(String sellerId);

    List<Product> findByCategory(String category);

    List<Product> findByStatus(
            ecart.ecommerce.enums.ProductStatus status);
    List<Product> findBySellerIdAndStatus(
            String sellerId,
            ecart.ecommerce.enums.ProductStatus status);
    List<Product> findByNameContainingIgnoreCase(
            String name
            
    );
}

