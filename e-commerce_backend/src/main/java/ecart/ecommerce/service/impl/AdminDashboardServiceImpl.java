package ecart.ecommerce.service.impl;

import ecart.ecommerce.dto.response.AdminDashboardResponse;
import ecart.ecommerce.dto.response.AdminDashboardResponse.RecentOrderResponse;
import ecart.ecommerce.entity.Order;
import ecart.ecommerce.entity.OrderItem;
import ecart.ecommerce.enums.OrderStatus;
import ecart.ecommerce.enums.Role;
import ecart.ecommerce.repository.OrderRepository;
import ecart.ecommerce.repository.ProductRepository;
import ecart.ecommerce.repository.UserRepository;
import ecart.ecommerce.service.AdminDashboardService;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminDashboardServiceImpl
        implements AdminDashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public AdminDashboardServiceImpl(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    public AdminDashboardResponse getDashboardData() {

        AdminDashboardResponse response =
                new AdminDashboardResponse();

        // =====================================================
        // GET DATABASE DATA
        // =====================================================

        List<Order> orders =
                orderRepository.findAll();

        // =====================================================
        // TOTAL CUSTOMERS
        // =====================================================

        long totalCustomers =
                userRepository.findAll()
                        .stream()
                        .filter(user ->
                                user.getRole() == Role.CUSTOMER
                        )
                        .count();

        // =====================================================
        // TOTAL PRODUCTS
        // =====================================================

        long totalProducts =
                productRepository.count();

        // =====================================================
        // TOTAL ORDERS
        // =====================================================

        long totalOrders =
                orders.size();

        // =====================================================
        // TOTAL SALES
        // Exclude cancelled orders
        // =====================================================

        BigDecimal totalSales =
                orders.stream()
                        .filter(order ->
                                order.getStatus()
                                        != OrderStatus.CANCELLED
                        )
                        .map(Order::getTotalAmount)
                        .filter(Objects::nonNull)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        // =====================================================
        // MONTHLY REVENUE
        // =====================================================

        YearMonth currentMonth =
                YearMonth.now();

        BigDecimal monthlyRevenue =
                orders.stream()
                        .filter(order ->
                                order.getCreatedAt() != null
                        )
                        .filter(order ->
                                YearMonth.from(
                                        order.getCreatedAt()
                                ).equals(currentMonth)
                        )
                        .filter(order ->
                                order.getStatus()
                                        != OrderStatus.CANCELLED
                        )
                        .map(Order::getTotalAmount)
                        .filter(Objects::nonNull)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        // =====================================================
        // PENDING ORDERS
        // =====================================================

        long pendingOrders =
                orders.stream()
                        .filter(order ->
                                order.getStatus() != null
                        )
                        .filter(order ->
                                order.getStatus()
                                        != OrderStatus.DELIVERED
                                        &&
                                order.getStatus()
                                        != OrderStatus.CANCELLED
                        )
                        .count();

        // =====================================================
        // BEST SELLING PRODUCT
        // =====================================================

        Map<String, Long> productUnits =
                orders.stream()
                        .filter(order ->
                                order.getStatus()
                                        != OrderStatus.CANCELLED
                        )
                        .flatMap(order ->
                                order.getItems() == null
                                        ? java.util.stream.Stream.empty()
                                        : order.getItems().stream()
                        )
                        .filter(item ->
                                item.getProductName() != null
                        )
                        .collect(
                                Collectors.groupingBy(
                                        OrderItem::getProductName,
                                        Collectors.summingLong(
                                                item ->
                                                        item.getQuantity() == null
                                                                ? 0
                                                                : item.getQuantity()
                                        )
                                )
                        );

        String bestSellingProduct = "No sales yet";

        long bestSellingProductUnits = 0;

        if (!productUnits.isEmpty()) {

            Map.Entry<String, Long> bestProduct =
                    productUnits.entrySet()
                            .stream()
                            .max(
                                    Map.Entry.comparingByValue()
                            )
                            .orElse(null);

            if (bestProduct != null) {

                bestSellingProduct =
                        bestProduct.getKey();

                bestSellingProductUnits =
                        bestProduct.getValue();
            }
        }

        // =====================================================
        // TOP CUSTOMER
        // =====================================================

        Map<String, BigDecimal> customerSpending =
                orders.stream()
                        .filter(order ->
                                order.getStatus()
                                        != OrderStatus.CANCELLED
                        )
                        .filter(order ->
                                order.getCustomerId() != null
                        )
                        .collect(
                                Collectors.groupingBy(
                                        Order::getCustomerId,
                                        Collectors.reducing(
                                                BigDecimal.ZERO,
                                                order ->
                                                        order.getTotalAmount() == null
                                                                ? BigDecimal.ZERO
                                                                : order.getTotalAmount(),
                                                BigDecimal::add
                                        )
                                )
                        );

        String topCustomer =
                "No customers yet";

        BigDecimal topCustomerSpent =
                BigDecimal.ZERO;

        if (!customerSpending.isEmpty()) {

            Map.Entry<String, BigDecimal> topCustomerEntry =
                    customerSpending.entrySet()
                            .stream()
                            .max(
                                    Map.Entry.comparingByValue()
                            )
                            .orElse(null);

            if (topCustomerEntry != null) {

                topCustomerSpent =
                        topCustomerEntry.getValue();

                Optional<Order> customerOrder =
                        orders.stream()
                                .filter(order ->
                                        topCustomerEntry
                                                .getKey()
                                                .equals(
                                                        order.getCustomerId()
                                                )
                                )
                                .findFirst();

                if (customerOrder.isPresent()) {

                    topCustomer =
                            customerOrder.get()
                                    .getCustomerName();
                }
            }
        }

        // =====================================================
        // RECENT ORDERS
        // =====================================================

        List<RecentOrderResponse> recentOrders =
                orders.stream()
                        .sorted(
                                Comparator.comparing(
                                        Order::getCreatedAt,
                                        Comparator.nullsLast(
                                                Comparator.reverseOrder()
                                        )
                                )
                        )
                        .limit(5)
                        .map(this::convertRecentOrder)
                        .toList();

        // =====================================================
        // SET RESPONSE
        // =====================================================

        response.setTotalCustomers(
                totalCustomers
        );

        response.setTotalProducts(
                totalProducts
        );

        response.setTotalOrders(
                totalOrders
        );

        response.setTotalSales(
                totalSales
        );

        response.setMonthlyRevenue(
                monthlyRevenue
        );

        response.setPendingOrders(
                pendingOrders
        );

        response.setBestSellingProduct(
                bestSellingProduct
        );

        response.setBestSellingProductUnits(
                bestSellingProductUnits
        );

        response.setTopCustomer(
                topCustomer
        );

        response.setTopCustomerSpent(
                topCustomerSpent
        );

        // For now we don't fake a growth percentage.
        response.setSalesGrowth(
                BigDecimal.ZERO
        );

        response.setRecentOrders(
                recentOrders
        );

        return response;
    }

    // =====================================================
    // RECENT ORDER CONVERSION
    // =====================================================

    private RecentOrderResponse convertRecentOrder(
            Order order
    ) {

        RecentOrderResponse response =
                new RecentOrderResponse();

        response.setId(
                order.getId()
        );

        response.setCustomer(
                order.getCustomerName() == null
                        ? "Unknown Customer"
                        : order.getCustomerName()
        );

        String productName = "Multiple Products";

        if (order.getItems() != null
                && !order.getItems().isEmpty()) {

            if (order.getItems().size() == 1) {

                productName =
                        order.getItems()
                                .get(0)
                                .getProductName();

            } else {

                productName =
                        order.getItems()
                                .get(0)
                                .getProductName()
                                + " + "
                                + (order.getItems().size() - 1)
                                + " more";
            }
        }

        response.setProduct(
                productName
        );

        response.setAmount(
                order.getTotalAmount() == null
                        ? BigDecimal.ZERO
                        : order.getTotalAmount()
        );

        response.setStatus(
                order.getStatus() == null
                        ? "UNKNOWN"
                        : order.getStatus().name()
        );

        return response;
    }
}