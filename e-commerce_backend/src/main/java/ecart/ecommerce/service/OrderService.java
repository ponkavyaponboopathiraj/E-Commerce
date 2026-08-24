package ecart.ecommerce.service;
import ecart.ecommerce.entity.Order;
import ecart.ecommerce.enums.OrderStatus;
import java.util.List;

public interface OrderService {

    Order placeOrder(Order order);
    Order getOrderById(String orderId);
    List<Order> getAllOrders();
    List<Order> getOrdersByCustomer(String customerId);
    List<Order> getOrdersBySeller(String sellerId);
    Order updateOrderStatus(  String orderId,OrderStatus status);
    Order cancelOrder(String orderId);
}