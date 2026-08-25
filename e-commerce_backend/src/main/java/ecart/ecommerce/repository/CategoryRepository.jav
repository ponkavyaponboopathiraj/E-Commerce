package ecart.ecommerce.repository;

import ecart.ecommerce.entity.Category;
import ecart.ecommerce.enums.CategoryStatus;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository
        extends MongoRepository<Category, String> {

    Optional<Category> findByNameIgnoreCase(
            String name
    );

    boolean existsByNameIgnoreCase(
            String name
    );

    List<Category> findByStatus(
            CategoryStatus status
    );
    List<Category> findByNameContainingIgnoreCase(
            String name
    );
}