package ecart.ecommerce.controller;

import ecart.ecommerce.entity.Notification;
import ecart.ecommerce.repository.NotificationRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(
            NotificationRepository notificationRepository
    ) {
        this.notificationRepository =
                notificationRepository;
    }

    // =========================================
    // GET ALL SELLER NOTIFICATIONS
    // =========================================

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Notification>>
    getSellerNotifications(
            @PathVariable String sellerId
    ) {

        return ResponseEntity.ok(
                notificationRepository
                        .findBySellerIdOrderByCreatedAtDesc(
                                sellerId
                        )
        );
    }

    // =========================================
    // GET UNREAD NOTIFICATIONS
    // =========================================

    @GetMapping("/seller/{sellerId}/unread")
    public ResponseEntity<List<Notification>>
    getUnreadNotifications(
            @PathVariable String sellerId
    ) {

        return ResponseEntity.ok(
                notificationRepository
                        .findBySellerIdAndReadFalseOrderByCreatedAtDesc(
                                sellerId
                        )
        );
    }

    // =========================================
    // MARK AS READ
    // =========================================

    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification>
    markAsRead(
            @PathVariable String id
    ) {

        Notification notification =
                notificationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found with id: "
                                                + id
                                )
                        );

        notification.setRead(true);

        return ResponseEntity.ok(
                notificationRepository.save(
                        notification
                )
        );
    }

    // =========================================
    // MARK ALL AS READ
    // =========================================

    @PatchMapping("/seller/{sellerId}/read-all")
    public ResponseEntity<String>
    markAllAsRead(
            @PathVariable String sellerId
    ) {

        List<Notification> notifications =
                notificationRepository
                        .findBySellerIdAndReadFalseOrderByCreatedAtDesc(
                                sellerId
                        );

        for (Notification notification :
                notifications) {

            notification.setRead(true);
        }

        notificationRepository.saveAll(
                notifications
        );

        return ResponseEntity.ok(
                "All notifications marked as read."
        );
    }
}