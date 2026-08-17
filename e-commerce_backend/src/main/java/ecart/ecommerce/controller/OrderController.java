package ecart.ecommerce.controller;

import ecart.ecommerce.entity.Order;
import ecart.ecommerce.enums.OrderStatus;
import ecart.ecommerce.service.OrderService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/orders", "/api/orders/"})
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // =====================================================
    // PLACE ORDER
    // =====================================================

    @PostMapping({"", "/"})
    public ResponseEntity<Order> placeOrder(
            @RequestBody Order order) {

        Order savedOrder =
                orderService.placeOrder(order);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedOrder);
    }

    // =====================================================
    // GET ALL ORDERS
    // =====================================================

    @GetMapping({"", "/"})
    public ResponseEntity<List<Order>> getAllOrders() {

        return ResponseEntity.ok(
                orderService.getAllOrders()
        );
    }

    // =====================================================
    // GET ORDER BY ID
    // =====================================================

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(
            @PathVariable String orderId) {

        return ResponseEntity.ok(
                orderService.getOrderById(orderId)
        );
    }

    // =====================================================
    // GET CUSTOMER ORDERS
    // =====================================================

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getOrdersByCustomer(
            @PathVariable String customerId) {

        return ResponseEntity.ok(
                orderService.getOrdersByCustomer(customerId)
        );
    }

    // =====================================================
    // GET SELLER ORDERS
    // =====================================================

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Order>> getOrdersBySeller(
            @PathVariable String sellerId) {

        return ResponseEntity.ok(
                orderService.getOrdersBySeller(sellerId)
        );
    }

    // =====================================================
    // UPDATE ORDER STATUS
    // =====================================================

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable String orderId,
            @RequestParam OrderStatus status) {

        Order updatedOrder =
                orderService.updateOrderStatus(
                        orderId,
                        status
                );

        return ResponseEntity.ok(updatedOrder);
    }

    // =====================================================
    // CANCEL ORDER
    // =====================================================

    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(
            @PathVariable String orderId) {

        Order cancelledOrder =
                orderService.cancelOrder(orderId);

        return ResponseEntity.ok(cancelledOrder);
    }
}