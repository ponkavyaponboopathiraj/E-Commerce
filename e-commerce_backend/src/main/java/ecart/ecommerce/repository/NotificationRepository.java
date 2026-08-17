package ecart.ecommerce.repository;

import ecart.ecommerce.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository
        extends MongoRepository<Notification, String> {

    List<Notification> findBySellerIdOrderByCreatedAtDesc(
            String sellerId
    );

    List<Notification> findBySellerIdAndReadFalseOrderByCreatedAtDesc(
            String sellerId
    );
}