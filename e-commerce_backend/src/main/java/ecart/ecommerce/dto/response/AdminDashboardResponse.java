package ecart.ecommerce.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class AdminDashboardResponse {

    private long totalCustomers;
    private long totalProducts;
    private long totalOrders;

    private BigDecimal totalSales;
    private BigDecimal monthlyRevenue;

    private long pendingOrders;

    private String bestSellingProduct;
    private long bestSellingProductUnits;

    private String topCustomer;
    private BigDecimal topCustomerSpent;

    private BigDecimal salesGrowth;

    private List<RecentOrderResponse> recentOrders;

    public AdminDashboardResponse() {
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(BigDecimal totalSales) {
        this.totalSales = totalSales;
    }

    public BigDecimal getMonthlyRevenue() {
        return monthlyRevenue;
    }

    public void setMonthlyRevenue(BigDecimal monthlyRevenue) {
        this.monthlyRevenue = monthlyRevenue;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public String getBestSellingProduct() {
        return bestSellingProduct;
    }

    public void setBestSellingProduct(String bestSellingProduct) {
        this.bestSellingProduct = bestSellingProduct;
    }

    public long getBestSellingProductUnits() {
        return bestSellingProductUnits;
    }

    public void setBestSellingProductUnits(long bestSellingProductUnits) {
        this.bestSellingProductUnits = bestSellingProductUnits;
    }

    public String getTopCustomer() {
        return topCustomer;
    }

    public void setTopCustomer(String topCustomer) {
        this.topCustomer = topCustomer;
    }

    public BigDecimal getTopCustomerSpent() {
        return topCustomerSpent;
    }

    public void setTopCustomerSpent(BigDecimal topCustomerSpent) {
        this.topCustomerSpent = topCustomerSpent;
    }

    public BigDecimal getSalesGrowth() {
        return salesGrowth;
    }

    public void setSalesGrowth(BigDecimal salesGrowth) {
        this.salesGrowth = salesGrowth;
    }

    public List<RecentOrderResponse> getRecentOrders() {
        return recentOrders;
    }

    public void setRecentOrders(
            List<RecentOrderResponse> recentOrders
    ) {
        this.recentOrders = recentOrders;
    }

    // =====================================================
    // RECENT ORDER DTO
    // =====================================================

    public static class RecentOrderResponse {

        private String id;
        private String customer;
        private String product;
        private BigDecimal amount;
        private String status;

        public RecentOrderResponse() {
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getCustomer() {
            return customer;
        }

        public void setCustomer(String customer) {
            this.customer = customer;
        }

        public String getProduct() {
            return product;
        }

        public void setProduct(String product) {
            this.product = product;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}