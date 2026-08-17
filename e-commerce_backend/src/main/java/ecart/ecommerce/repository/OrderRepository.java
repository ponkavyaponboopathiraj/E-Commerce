package ecart.ecommerce.repository;

import ecart.ecommerce.entity.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository
        extends MongoRepository<Order, String> {

    // Customer's orders
    List<Order> findByCustomerId(String customerId);

    // Orders containing products belonging to a seller
    List<Order> findByItemsSellerId(String sellerId);
}