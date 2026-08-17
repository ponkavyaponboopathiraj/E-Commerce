package ecart.ecommerce.service.impl;

import ecart.ecommerce.entity.Order;
import ecart.ecommerce.entity.OrderItem;
import ecart.ecommerce.entity.Product;
import ecart.ecommerce.enums.OrderStatus;
import ecart.ecommerce.repository.OrderRepository;
import ecart.ecommerce.repository.ProductRepository;
import ecart.ecommerce.service.OrderService;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            ProductRepository productRepository
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    // =====================================================
    // PLACE ORDER
    // =====================================================

    @Override
    public Order placeOrder(Order order) {

        if (order == null) {
            throw new RuntimeException(
                    "Order cannot be null."
            );
        }

        if (order.getCustomerId() == null
                || order.getCustomerId().isBlank()) {

            throw new RuntimeException(
                    "Customer ID is required."
            );
        }

        if (order.getItems() == null
                || order.getItems().isEmpty()) {

            throw new RuntimeException(
                    "Order must contain at least one product."
            );
        }

        BigDecimal totalAmount = BigDecimal.ZERO;

        // =================================================
        // PROCESS EACH ORDER ITEM
        // =================================================

        for (OrderItem orderItem : order.getItems()) {

            if (orderItem.getProductId() == null
                    || orderItem.getProductId().isBlank()) {

                throw new RuntimeException(
                        "Product ID is required."
                );
            }

            if (orderItem.getQuantity() == null
                    || orderItem.getQuantity() <= 0) {

                throw new RuntimeException(
                        "Quantity must be greater than zero."
                );
            }

            // ---------------------------------------------
            // Find product
            // ---------------------------------------------

            Product product =
                    productRepository
                            .findById(orderItem.getProductId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Product not found with id: "
                                                    + orderItem.getProductId()
                                    )
                            );

            // ---------------------------------------------
            // Check stock
            // ---------------------------------------------

            Integer availableStock =
                    product.getStock();

            if (availableStock == null
                    || availableStock <= 0) {

                throw new RuntimeException(
                        "Product is out of stock: "
                                + product.getName()
                );
            }

            if (orderItem.getQuantity()
                    > availableStock) {

                throw new RuntimeException(
                        "Insufficient stock for product: "
                                + product.getName()
                                + ". Available stock: "
                                + availableStock
                );
            }

            // ---------------------------------------------
            // Get seller from actual product
            // ---------------------------------------------

            orderItem.setSellerId(
                    product.getSellerId()
            );

            // ---------------------------------------------
            // Take product details snapshot
            // ---------------------------------------------

            orderItem.setProductName(
                    product.getName()
            );

            orderItem.setPrice(
                    product.getPrice()
            );

            // ---------------------------------------------
            // Calculate subtotal
            // ---------------------------------------------

            BigDecimal subtotal =
                    product.getPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            orderItem.getQuantity()
                                    )
                            );

            orderItem.setSubtotal(subtotal);

            totalAmount =
                    totalAmount.add(subtotal);

            // ---------------------------------------------
            // Reduce stock
            // ---------------------------------------------

            product.setStock(
                    availableStock
                            - orderItem.getQuantity()
            );

            product.setUpdatedAt(
                    LocalDateTime.now()
            );

            // ---------------------------------------------
            // Update product status
            // ---------------------------------------------

            if (product.getStock() <= 0) {

                product.setStatus(
                        ecart.ecommerce.enums.ProductStatus.INACTIVE
                );
            }

            productRepository.save(product);
        }

        // =================================================
        // SET ORDER DETAILS
        // =================================================

        order.setTotalAmount(totalAmount);

        order.setStatus(
                OrderStatus.PLACED
        );

        LocalDateTime now =
                LocalDateTime.now();

        order.setCreatedAt(now);
        order.setUpdatedAt(now);

        // =================================================
        // SAVE ORDER
        // =================================================

        return orderRepository.save(order);
    }

    // =====================================================
    // GET ORDER BY ID
    // =====================================================

    @Override
    public Order getOrderById(String orderId) {

        return orderRepository
                .findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found with id: "
                                        + orderId
                        )
                );
    }

    // =====================================================
    // GET ALL ORDERS
    // =====================================================

    @Override
    public List<Order> getAllOrders() {

        return orderRepository.findAll();
    }

    // =====================================================
    // GET CUSTOMER ORDERS
    // =====================================================

    @Override
    public List<Order> getOrdersByCustomer(
            String customerId
    ) {

        return orderRepository
                .findByCustomerId(customerId);
    }

    // =====================================================
    // GET SELLER ORDERS
    // =====================================================

    @Override
    public List<Order> getOrdersBySeller(
            String sellerId
    ) {

        return orderRepository
                .findByItemsSellerId(sellerId);
    }

    // =====================================================
    // UPDATE ORDER STATUS
    // =====================================================

    @Override
    public Order updateOrderStatus(
            String orderId,
            OrderStatus status
    ) {

        Order order =
                orderRepository
                        .findById(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found with id: "
                                                + orderId
                                )
                        );

        if (status == null) {

            throw new RuntimeException(
                    "Order status is required."
            );
        }

        order.setStatus(status);

        order.setUpdatedAt(
                LocalDateTime.now()
        );

        return orderRepository.save(order);
    }

    // =====================================================
    // CANCEL ORDER
    // =====================================================

    @Override
    public Order cancelOrder(
            String orderId
    ) {

        Order order =
                orderRepository
                        .findById(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found with id: "
                                                + orderId
                                )
                        );

        // ---------------------------------------------
        // Already cancelled
        // ---------------------------------------------

        if (order.getStatus()
                == OrderStatus.CANCELLED) {

            throw new RuntimeException(
                    "Order is already cancelled."
            );
        }

        // ---------------------------------------------
        // Delivered order cannot be cancelled
        // ---------------------------------------------

        if (order.getStatus()
                == OrderStatus.DELIVERED) {

            throw new RuntimeException(
                    "Delivered order cannot be cancelled."
            );
        }

        // ---------------------------------------------
        // Restore product stock
        // ---------------------------------------------

        for (OrderItem item : order.getItems()) {

            Product product =
                    productRepository
                            .findById(item.getProductId())
                            .orElse(null);

            if (product != null) {

                Integer currentStock =
                        product.getStock() == null
                                ? 0
                                : product.getStock();

                product.setStock(
                        currentStock
                                + item.getQuantity()
                );

                product.setStatus(
                        ecart.ecommerce.enums.ProductStatus.ACTIVE
                );

                product.setUpdatedAt(
                        LocalDateTime.now()
                );

                productRepository.save(product);
            }
        }

        // ---------------------------------------------
        // Update order
        // ---------------------------------------------

        order.setStatus(
                OrderStatus.CANCELLED
        );

        order.setUpdatedAt(
                LocalDateTime.now()
        );

        return orderRepository.save(order);
    }
}