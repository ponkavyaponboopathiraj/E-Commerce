import { useEffect, useMemo, useState } from "react";
import {
    getAllOrders,
    updateOrderStatus,
    cancelOrder
} from "../../service/adminService";

import "./AdminOrderManagement.css";

function AdminOrderManagement() {

    // =====================================================
    // STATES
    // =====================================================

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");

    const [updatingOrder, setUpdatingOrder] = useState(null);


    // =====================================================
    // LOAD ORDERS
    // =====================================================

    const loadOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getAllOrders();

            setOrders(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load orders:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load orders."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadOrders();

    }, []);


    // =====================================================
    // FILTER ORDERS
    // =====================================================

    const filteredOrders = useMemo(() => {

        const searchValue =
            search
                .toLowerCase()
                .trim();

        return orders.filter((order) => {

            const orderId =
                (order.id || "")
                    .toLowerCase();

            const customerName =
                (order.customerName || "")
                    .toLowerCase();

            const customerEmail =
                (order.customerEmail || "")
                    .toLowerCase();

            const customerPhone =
                (order.customerPhone || "")
                    .toLowerCase();

            const matchesSearch =
                !searchValue ||
                orderId.includes(searchValue) ||
                customerName.includes(searchValue) ||
                customerEmail.includes(searchValue) ||
                customerPhone.includes(searchValue);

            const matchesStatus =
                statusFilter === "ALL" ||
                order.status === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [
        orders,
        search,
        statusFilter
    ]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalOrders =
        orders.length;

    const placedOrders =
        orders.filter(
            (order) =>
                order.status === "PLACED"
        ).length;

    const processingOrders =
        orders.filter(
            (order) =>
                order.status === "PROCESSING"
        ).length;

    const shippedOrders =
        orders.filter(
            (order) =>
                order.status === "SHIPPED" ||
                order.status === "OUT_FOR_DELIVERY"
        ).length;

    const deliveredOrders =
        orders.filter(
            (order) =>
                order.status === "DELIVERED"
        ).length;

    const cancelledOrders =
        orders.filter(
            (order) =>
                order.status === "CANCELLED"
        ).length;


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // =====================================================
    // FORMAT CURRENCY
    // =====================================================

    const formatAmount = (amount) => {

        if (
            amount === null ||
            amount === undefined
        ) {
            return "₹0.00";
        }

        return `₹${Number(amount).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;
    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        switch (status) {

            case "PLACED":
                return "order-status-placed";

            case "CONFIRMED":
                return "order-status-confirmed";

            case "PROCESSING":
                return "order-status-processing";

            case "SHIPPED":
                return "order-status-shipped";

            case "OUT_FOR_DELIVERY":
                return "order-status-out";

            case "DELIVERED":
                return "order-status-delivered";

            case "CANCELLED":
                return "order-status-cancelled";

            default:
                return "order-status-default";
        }
    };


    // =====================================================
    // STATUS LABEL
    // =====================================================

    const getStatusLabel = (status) => {

        switch (status) {

            case "OUT_FOR_DELIVERY":
                return "Out for Delivery";

            case "PLACED":
                return "Placed";

            case "CONFIRMED":
                return "Confirmed";

            case "PROCESSING":
                return "Processing";

            case "SHIPPED":
                return "Shipped";

            case "DELIVERED":
                return "Delivered";

            case "CANCELLED":
                return "Cancelled";

            default:
                return status || "Unknown";
        }
    };


    // =====================================================
    // UPDATE STATUS
    // =====================================================

    const handleStatusChange = async (
        orderId,
        newStatus
    ) => {

        try {

            setUpdatingOrder(orderId);

            const updatedOrder =
                await updateOrderStatus(
                    orderId,
                    newStatus
                );

            setOrders((previousOrders) =>
                previousOrders.map((order) =>
                    order.id === orderId
                        ? updatedOrder
                        : order
                )
            );

        } catch (error) {

            console.error(
                "Failed to update order status:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update order status."
            );

        } finally {

            setUpdatingOrder(null);

        }
    };


    // =====================================================
    // CANCEL ORDER
    // =====================================================

    const handleCancelOrder = async (
        order
    ) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to cancel order ${order.id}?`
            );

        if (!confirmed) {
            return;
        }

        try {

            setUpdatingOrder(order.id);

            const cancelledOrder =
                await cancelOrder(
                    order.id
                );

            setOrders((previousOrders) =>
                previousOrders.map((item) =>
                    item.id === order.id
                        ? cancelledOrder
                        : item
                )
            );

        } catch (error) {

            console.error(
                "Failed to cancel order:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to cancel order."
            );

        } finally {

            setUpdatingOrder(null);

        }
    };


    // =====================================================
    // VIEW ORDER
    // =====================================================

    const handleViewOrder = (order) => {

        const itemDetails =
            order.items
                ?.map(
                    (item) =>
                        `${item.productName} × ${item.quantity} = ${formatAmount(item.subtotal)}`
                )
                .join("\n") ||
            "No items";

        alert(
            `Order ID: ${order.id}\n\n` +
            `Customer: ${order.customerName || "N/A"}\n` +
            `Email: ${order.customerEmail || "N/A"}\n` +
            `Phone: ${order.customerPhone || "N/A"}\n\n` +
            `Items:\n${itemDetails}\n\n` +
            `Total: ${formatAmount(order.totalAmount)}\n` +
            `Status: ${getStatusLabel(order.status)}\n` +
            `Address: ${order.shippingAddress || "N/A"}`
        );
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="orders-loading">

                <div className="orders-loader"></div>

                <h2>
                    Loading Orders...
                </h2>

                <p>
                    Please wait while we fetch order data.
                </p>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="orders-error">

                <div className="orders-error-icon">
                    ⚠️
                </div>

                <h2>
                    Unable to Load Orders
                </h2>

                <p>
                    {error}
                </p>

                <button
                    className="orders-retry-btn"
                    onClick={loadOrders}
                >
                    🔄 Retry
                </button>

            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="order-management-container">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="order-management-header">

                <div>

                    <span className="order-management-label">
                        ORDER MANAGEMENT
                    </span>

                    <h2>
                        All Orders
                    </h2>

                    <p>
                        Monitor and manage customer orders
                        from one place.
                    </p>

                </div>


                <button
                    className="refresh-orders-btn"
                    onClick={loadOrders}
                >
                    🔄 Refresh
                </button>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="order-stats-grid">


                <div className="order-stat-card">

                    <div className="order-stat-icon">
                        🛒
                    </div>

                    <div>

                        <span>
                            Total Orders
                        </span>

                        <strong>
                            {totalOrders}
                        </strong>

                    </div>

                </div>


                <div className="order-stat-card">

                    <div className="order-stat-icon">
                        🟡
                    </div>

                    <div>

                        <span>
                            Placed
                        </span>

                        <strong>
                            {placedOrders}
                        </strong>

                    </div>

                </div>


                <div className="order-stat-card">

                    <div className="order-stat-icon">
                        ⚙️
                    </div>

                    <div>

                        <span>
                            Processing
                        </span>

                        <strong>
                            {processingOrders}
                        </strong>

                    </div>

                </div>


                <div className="order-stat-card">

                    <div className="order-stat-icon">
                        🚚
                    </div>

                    <div>

                        <span>
                            Shipped
                        </span>

                        <strong>
                            {shippedOrders}
                        </strong>

                    </div>

                </div>


                <div className="order-stat-card">

                    <div className="order-stat-icon">
                        🟢
                    </div>

                    <div>

                        <span>
                            Delivered
                        </span>

                        <strong>
                            {deliveredOrders}
                        </strong>

                    </div>

                </div>


                <div className="order-stat-card">

                    <div className="order-stat-icon">
                        🔴
                    </div>

                    <div>

                        <span>
                            Cancelled
                        </span>

                        <strong>
                            {cancelledOrders}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="order-filter-card">


                <div className="order-search-box">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search order ID, customer, email or phone..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                    {search && (

                        <button
                            className="clear-order-search"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            ✕
                        </button>

                    )}

                </div>


                <div className="order-filter-group">

                    <label>
                        Status
                    </label>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="ALL">
                            All Status
                        </option>

                        <option value="PLACED">
                            Placed
                        </option>

                        <option value="CONFIRMED">
                            Confirmed
                        </option>

                        <option value="PROCESSING">
                            Processing
                        </option>

                        <option value="SHIPPED">
                            Shipped
                        </option>

                        <option value="OUT_FOR_DELIVERY">
                            Out for Delivery
                        </option>

                        <option value="DELIVERED">
                            Delivered
                        </option>

                        <option value="CANCELLED">
                            Cancelled
                        </option>

                    </select>

                </div>


                <div className="order-result-count">

                    <span>
                        Showing
                    </span>

                    <strong>
                        {filteredOrders.length}
                    </strong>

                    <span>
                        of {orders.length} orders
                    </span>

                </div>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="orders-table-card">


                <div className="orders-table-header">

                    <div>

                        <span className="order-table-label">
                            ORDER DIRECTORY
                        </span>

                        <h3>
                            Customer Orders
                        </h3>

                    </div>

                    <span className="order-count-badge">
                        {filteredOrders.length}
                    </span>

                </div>


                {filteredOrders.length === 0 ? (

                    <div className="no-orders">

                        <div className="no-orders-icon">
                            🔍
                        </div>

                        <h3>
                            No Orders Found
                        </h3>

                        <p>
                            Try changing your search or filter.
                        </p>

                        <button
                            onClick={() => {

                                setSearch("");
                                setStatusFilter("ALL");

                            }}
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    <div className="orders-table-wrapper">

                        <table className="orders-table">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Order
                                    </th>

                                    <th>
                                        Customer
                                    </th>

                                    <th>
                                        Items
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Ordered
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredOrders.map(
                                    (order, index) => (

                                        <tr
                                            key={order.id}
                                        >

                                            <td>

                                                <span className="order-row-number">
                                                    {index + 1}
                                                </span>

                                            </td>


                                            <td>

                                                <div className="order-id-cell">

                                                    <strong>
                                                        #{order.id?.slice(
                                                            0,
                                                            8
                                                        )}
                                                    </strong>

                                                    <small>
                                                        {order.id}
                                                    </small>

                                                </div>

                                            </td>


                                            <td>

                                                <div className="order-customer-cell">

                                                    <div className="order-customer-avatar">

                                                        {order.customerName
                                                            ?.charAt(0)
                                                            ?.toUpperCase() || "?"}

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {order.customerName || "N/A"}
                                                        </strong>

                                                        <small>
                                                            {order.customerEmail || "N/A"}
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                <span className="order-items-count">

                                                    {order.items?.length || 0}

                                                </span>

                                                <small className="items-label">
                                                    product(s)
                                                </small>

                                            </td>


                                            <td>

                                                <strong className="order-amount">
                                                    {formatAmount(
                                                        order.totalAmount
                                                    )}
                                                </strong>

                                            </td>


                                            <td>

                                                <select
                                                    className={`order-status-select ${getStatusClass(
                                                        order.status
                                                    )}`}
                                                    value={
                                                        order.status || ""
                                                    }
                                                    disabled={
                                                        updatingOrder ===
                                                        order.id ||
                                                        order.status ===
                                                        "CANCELLED"
                                                    }
                                                    onChange={(event) =>
                                                        handleStatusChange(
                                                            order.id,
                                                            event.target.value
                                                        )
                                                    }
                                                >

                                                    <option value="PLACED">
                                                        Placed
                                                    </option>

                                                    <option value="CONFIRMED">
                                                        Confirmed
                                                    </option>

                                                    <option value="PROCESSING">
                                                        Processing
                                                    </option>

                                                    <option value="SHIPPED">
                                                        Shipped
                                                    </option>

                                                    <option value="OUT_FOR_DELIVERY">
                                                        Out for Delivery
                                                    </option>

                                                    <option value="DELIVERED">
                                                        Delivered
                                                    </option>

                                                    <option value="CANCELLED">
                                                        Cancelled
                                                    </option>

                                                </select>

                                            </td>


                                            <td>

                                                <span className="order-date">
                                                    {formatDate(
                                                        order.createdAt
                                                    )}
                                                </span>

                                            </td>


                                            <td>

                                                <div className="order-actions">

                                                    <button
                                                        className="view-order-btn"
                                                        title="View Order"
                                                        onClick={() =>
                                                            handleViewOrder(
                                                                order
                                                            )
                                                        }
                                                    >
                                                        👁️
                                                    </button>


                                                    {order.status !==
                                                        "CANCELLED" &&
                                                        order.status !==
                                                        "DELIVERED" && (

                                                            <button
                                                                className="cancel-order-btn"
                                                                title="Cancel Order"
                                                                disabled={
                                                                    updatingOrder ===
                                                                    order.id
                                                                }
                                                                onClick={() =>
                                                                    handleCancelOrder(
                                                                        order
                                                                    )
                                                                }
                                                            >
                                                                ✕
                                                            </button>

                                                        )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default AdminOrderManagement;