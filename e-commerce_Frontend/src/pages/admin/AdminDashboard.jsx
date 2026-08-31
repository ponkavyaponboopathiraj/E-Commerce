import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminUserManagement from "./AdminUserManagement";
import AdminProductManagement from "./AdminProductManagement";
import PendingSellerRequests from "./PendingSellerRequests";
import AdminOrderManagement from "./AdminOrderManagement";
import AdminCategoryManagement from "./AdminCategoryManagement";

import {
    getAllUsers,
    getAllAdminProducts,
    getAllOrders,
    getPendingSellers
} from "../../service/adminService";

import "./AdminDashboard.css";


function AdminDashboard() {

    const navigate = useNavigate();

    // =========================================================
    // STATES
    // =========================================================

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [activeMenu, setActiveMenu] =
        useState("Dashboard");

    const [search, setSearch] =
        useState("");

    const [users, setUsers] =
        useState([]);

    const [products, setProducts] =
        useState([]);

    const [orders, setOrders] =
        useState([]);

    const [pendingSellers, setPendingSellers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================================================
    // LOAD ADMIN DASHBOARD DATA
    // =========================================================

    useEffect(() => {

        if (activeMenu !== "Dashboard") {
            return;
        }

        loadDashboardData();

    }, [activeMenu]);


    const loadDashboardData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                usersData,
                productsData,
                ordersData,
                pendingSellersData
            ] = await Promise.all([

                getAllUsers(),

                getAllAdminProducts(),

                getAllOrders(),

                getPendingSellers()

            ]);


            setUsers(
                Array.isArray(usersData)
                    ? usersData
                    : []
            );


            setProducts(
                Array.isArray(productsData)
                    ? productsData
                    : []
            );


            setOrders(
                Array.isArray(ordersData)
                    ? ordersData
                    : []
            );


            setPendingSellers(
                Array.isArray(pendingSellersData)
                    ? pendingSellersData
                    : []
            );


        } catch (err) {

            console.error(
                "Admin dashboard data error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load dashboard data."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");

        navigate("/login");

    };


    // =========================================================
    // MENU ITEMS
    // =========================================================

    const menuItems = [
        {
            name: "Dashboard",
            icon: "📊"
        },
        {
            name: "Users",
            icon: "👥"
        },
        {
            name: "Seller Requests",
            icon: "🔔"
        },
        {
            name: "Products",
            icon: "📦"
        },
        {
            name: "Categories",
            icon: "🗂️"
        },
        {
            name: "Brands",
            icon: "🏷️"
        },
        {
            name: "Orders",
            icon: "🛒"
        },
        {
            name: "Coupons",
            icon: "🎟️"
        },
        {
            name: "Inventory",
            icon: "📋"
        },
        {
            name: "Reviews",
            icon: "⭐"
        },
        {
            name: "Reports",
            icon: "📈"
        }
    ];


    // =========================================================
    // MENU NAVIGATION
    // =========================================================

    const handleMenuClick = (menu) => {

        setActiveMenu(menu);

        setSearch("");

        setSidebarOpen(false);

    };


    // =========================================================
    // HELPER - CUSTOMER USERS
    // =========================================================

    const customers = useMemo(() => {

        return users.filter(
            user =>
                user?.role?.toString().toUpperCase() ===
                "CUSTOMER"
        );

    }, [users]);


    // =========================================================
    // HELPER - DATE
    // =========================================================

    const isSameMonth = (
        dateValue,
        date
    ) => {

        if (!dateValue) {
            return false;
        }

        const value =
            new Date(dateValue);

        if (Number.isNaN(value.getTime())) {
            return false;
        }

        return (
            value.getMonth() ===
                date.getMonth()
            &&
            value.getFullYear() ===
                date.getFullYear()
        );

    };


    const isPreviousMonth = (
        dateValue,
        date
    ) => {

        if (!dateValue) {
            return false;
        }

        const value =
            new Date(dateValue);

        if (Number.isNaN(value.getTime())) {
            return false;
        }

        const previousMonth =
            new Date(
                date.getFullYear(),
                date.getMonth() - 1,
                1
            );

        return (
            value.getMonth() ===
                previousMonth.getMonth()
            &&
            value.getFullYear() ===
                previousMonth.getFullYear()
        );

    };


    // =========================================================
    // VALID ORDERS
    // =========================================================

    const nonCancelledOrders = useMemo(() => {

        return orders.filter(
            order =>
                order?.status?.toString().toUpperCase()
                !== "CANCELLED"
        );

    }, [orders]);


    // =========================================================
    // TOTAL SALES
    // =========================================================

    const totalSales = useMemo(() => {

        return nonCancelledOrders.reduce(
            (total, order) => {

                const amount =
                    Number(
                        order?.totalAmount || 0
                    );

                return total + amount;

            },
            0
        );

    }, [nonCancelledOrders]);


    // =========================================================
    // THIS MONTH SALES
    // =========================================================

    const currentMonthSales = useMemo(() => {

        const now = new Date();

        return nonCancelledOrders.reduce(
            (total, order) => {

                if (
                    !isSameMonth(
                        order?.createdAt,
                        now
                    )
                ) {
                    return total;
                }

                return (
                    total +
                    Number(
                        order?.totalAmount || 0
                    )
                );

            },
            0
        );

    }, [nonCancelledOrders]);


    // =========================================================
    // PREVIOUS MONTH SALES
    // =========================================================

    const previousMonthSales = useMemo(() => {

        const now = new Date();

        return nonCancelledOrders.reduce(
            (total, order) => {

                if (
                    !isPreviousMonth(
                        order?.createdAt,
                        now
                    )
                ) {
                    return total;
                }

                return (
                    total +
                    Number(
                        order?.totalAmount || 0
                    )
                );

            },
            0
        );

    }, [nonCancelledOrders]);


    // =========================================================
    // SALES GROWTH
    // =========================================================

    const salesGrowth = useMemo(() => {

        if (previousMonthSales === 0) {

            if (currentMonthSales > 0) {
                return 100;
            }

            return 0;
        }

        return (
            (
                (
                    currentMonthSales -
                    previousMonthSales
                ) /
                previousMonthSales
            ) * 100
        );

    }, [
        currentMonthSales,
        previousMonthSales
    ]);


    // =========================================================
    // ORDER GROWTH
    // =========================================================

    const orderGrowth = useMemo(() => {

        const now = new Date();

        const currentOrders =
            nonCancelledOrders.filter(
                order =>
                    isSameMonth(
                        order?.createdAt,
                        now
                    )
            ).length;


        const previousOrders =
            nonCancelledOrders.filter(
                order =>
                    isPreviousMonth(
                        order?.createdAt,
                        now
                    )
            ).length;


        if (previousOrders === 0) {

            return currentOrders > 0
                ? 100
                : 0;

        }

        return (
            (
                (
                    currentOrders -
                    previousOrders
                ) /
                previousOrders
            ) * 100
        );

    }, [nonCancelledOrders]);


    // =========================================================
    // CUSTOMER GROWTH
    // =========================================================

    const customerGrowth = useMemo(() => {

        const now = new Date();

        const currentCustomers =
            customers.filter(
                user =>
                    isSameMonth(
                        user?.createdAt,
                        now
                    )
            ).length;


        const previousCustomers =
            customers.filter(
                user =>
                    isPreviousMonth(
                        user?.createdAt,
                        now
                    )
            ).length;


        if (previousCustomers === 0) {

            return currentCustomers > 0
                ? 100
                : 0;

        }

        return (
            (
                (
                    currentCustomers -
                    previousCustomers
                ) /
                previousCustomers
            ) * 100
        );

    }, [customers]);


    // =========================================================
    // PRODUCT GROWTH
    // =========================================================

    const productGrowth = useMemo(() => {

        const now = new Date();

        const currentProducts =
            products.filter(
                product =>
                    isSameMonth(
                        product?.createdAt,
                        now
                    )
            ).length;


        const previousProducts =
            products.filter(
                product =>
                    isPreviousMonth(
                        product?.createdAt,
                        now
                    )
            ).length;


        if (previousProducts === 0) {

            return currentProducts > 0
                ? 100
                : 0;

        }

        return (
            (
                (
                    currentProducts -
                    previousProducts
                ) /
                previousProducts
            ) * 100
        );

    }, [products]);


    // =========================================================
    // FORMAT CURRENCY
    // =========================================================

    const formatCurrency = (value) => {

        const number =
            Number(value || 0);

        return new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 2
            }
        ).format(number);

    };


    // =========================================================
    // FORMAT GROWTH
    // =========================================================

    const formatGrowth = (value) => {

        const number =
            Number(value || 0);

        if (number > 0) {

            return `+${number.toFixed(1)}%`;

        }

        if (number < 0) {

            return `${number.toFixed(1)}%`;

        }

        return "0.0%";

    };


    // =========================================================
    // DASHBOARD STATS
    // =========================================================

    const stats = [
        {
            title: "Total Sales",
            value: formatCurrency(totalSales),
            icon: "💰",
            growth: formatGrowth(salesGrowth)
        },
        {
            title: "Total Orders",
            value: nonCancelledOrders.length.toLocaleString(),
            icon: "🛍️",
            growth: formatGrowth(orderGrowth)
        },
        {
            title: "Total Customers",
            value: customers.length.toLocaleString(),
            icon: "👥",
            growth: formatGrowth(customerGrowth)
        },
        {
            title: "Total Products",
            value: products.length.toLocaleString(),
            icon: "📦",
            growth: formatGrowth(productGrowth)
        }
    ];


    // =========================================================
    // RECENT ORDERS
    // =========================================================

    const recentOrders = useMemo(() => {

        return [...orders]

            .sort(
                (a, b) =>
                    new Date(
                        b?.createdAt || 0
                    ) -
                    new Date(
                        a?.createdAt || 0
                    )
            )

            .slice(0, 5)

            .map(order => {

                const firstItem =
                    order?.items?.[0];

                const itemCount =
                    order?.items?.reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            Number(
                                item?.quantity || 0
                            ),
                        0
                    );


                return {

                    id:
                        order?.id ||
                        "N/A",

                    customer:
                        order?.customerName ||
                        order?.customerEmail ||
                        "Unknown Customer",

                    product:
                        firstItem?.productName
                            ? (
                                order?.items?.length > 1
                                    ? `${firstItem.productName} + ${
                                        order.items.length - 1
                                      } more`
                                    : firstItem.productName
                              )
                            : `${itemCount} item(s)`,

                    amount:
                        formatCurrency(
                            order?.totalAmount || 0
                        ),

                    status:
                        order?.status ||
                        "PLACED"

                };

            });

    }, [orders]);


    // =========================================================
    // ORDER STATUS LABEL
    // =========================================================

    const getStatusLabel = (status) => {

        if (!status) {
            return "Unknown";
        }

        return status
            .toString()
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                char =>
                    char.toUpperCase()
            );

    };


    // =========================================================
    // SALES BY DAY - CURRENT WEEK
    // =========================================================

    const weeklySales = useMemo(() => {

        const now = new Date();

        const day =
            now.getDay();

        const monday =
            new Date(now);

        monday.setDate(
            now.getDate() -
            (day === 0 ? 6 : day - 1)
        );

        monday.setHours(
            0,
            0,
            0,
            0
        );


        const result = [
            {
                label: "Mon",
                value: 0
            },
            {
                label: "Tue",
                value: 0
            },
            {
                label: "Wed",
                value: 0
            },
            {
                label: "Thu",
                value: 0
            },
            {
                label: "Fri",
                value: 0
            },
            {
                label: "Sat",
                value: 0
            },
            {
                label: "Sun",
                value: 0
            }
        ];


        nonCancelledOrders.forEach(
            order => {

                if (!order?.createdAt) {
                    return;
                }

                const orderDate =
                    new Date(
                        order.createdAt
                    );

                if (
                    Number.isNaN(
                        orderDate.getTime()
                    )
                ) {
                    return;
                }


                const diff =
                    Math.floor(
                        (
                            orderDate -
                            monday
                        ) /
                        (
                            1000 *
                            60 *
                            60 *
                            24
                        )
                    );


                if (
                    diff >= 0 &&
                    diff < 7
                ) {

                    result[diff].value +=
                        Number(
                            order?.totalAmount ||
                            0
                        );

                }

            }
        );


        return result;

    }, [nonCancelledOrders]);


    // =========================================================
    // MAX WEEKLY SALES
    // =========================================================

    const maxWeeklySales = useMemo(() => {

        const max =
            Math.max(
                ...weeklySales.map(
                    item => item.value
                ),
                0
            );

        return max > 0
            ? max
            : 1;

    }, [weeklySales]);


    // =========================================================
    // BEST SELLING PRODUCT
    // =========================================================

    const bestSellingProduct = useMemo(() => {

        const productMap = {};


        nonCancelledOrders.forEach(
            order => {

                if (!order?.items) {
                    return;
                }


                order.items.forEach(
                    item => {

                        const id =
                            item?.productId ||
                            item?.productName ||
                            "unknown";


                        if (!productMap[id]) {

                            productMap[id] = {

                                name:
                                    item?.productName ||
                                    "Unknown Product",

                                quantity: 0,

                                revenue: 0

                            };

                        }


                        productMap[id].quantity +=
                            Number(
                                item?.quantity ||
                                0
                            );


                        productMap[id].revenue +=
                            Number(
                                item?.subtotal ||
                                0
                            );

                    }
                );

            }
        );


        const list =
            Object.values(
                productMap
            );


        if (list.length === 0) {

            return {
                name: "No sales yet",
                quantity: 0,
                revenue: 0
            };

        }


        return list.sort(
            (a, b) =>
                b.quantity -
                a.quantity
        )[0];

    }, [nonCancelledOrders]);


    // =========================================================
    // TOP CUSTOMER
    // =========================================================

    const topCustomer = useMemo(() => {

        const customerMap = {};


        nonCancelledOrders.forEach(
            order => {

                const customerId =
                    order?.customerId ||
                    order?.customerEmail ||
                    order?.customerName ||
                    "unknown";


                if (!customerMap[customerId]) {

                    customerMap[customerId] = {

                        name:
                            order?.customerName ||
                            order?.customerEmail ||
                            "Unknown Customer",

                        spent: 0

                    };

                }


                customerMap[customerId].spent +=
                    Number(
                        order?.totalAmount ||
                        0
                    );

            }
        );


        const list =
            Object.values(
                customerMap
            );


        if (list.length === 0) {

            return {
                name: "No customers yet",
                spent: 0
            };

        }


        return list.sort(
            (a, b) =>
                b.spent -
                a.spent
        )[0];

    }, [nonCancelledOrders]);


    // =========================================================
    // MONTHLY REVENUE
    // =========================================================

    const monthlyRevenue =
        currentMonthSales;


    // =========================================================
    // PENDING ORDERS
    // =========================================================

    const pendingOrders = useMemo(() => {

        return orders.filter(
            order => {

                const status =
                    order?.status
                        ?.toString()
                        .toUpperCase();

                return (
                    status === "PLACED" ||
                    status === "CONFIRMED" ||
                    status === "PROCESSING" ||
                    status === "SHIPPED" ||
                    status === "OUT_FOR_DELIVERY"
                );

            }
        );

    }, [orders]);


    // =========================================================
    // RENDER OTHER MODULES
    // =========================================================

    const renderModule = () => {

        // USERS
        if (activeMenu === "Users") {

            return (
                <AdminUserManagement />
            );

        }


        // SELLER REQUESTS
        if (activeMenu === "Seller Requests") {

            return (
                <PendingSellerRequests />
            );

        }


        // PRODUCTS
        if (activeMenu === "Products") {

            return (
                <AdminProductManagement />
            );

        }


        // ORDERS
        if (activeMenu === "Orders") {

            return (
                <AdminOrderManagement />
            );

        }


        // CATEGORIES
        if (activeMenu === "Categories") {

            return (
                <AdminCategoryManagement />
            );

        }


        const selectedItem =
            menuItems.find(
                item =>
                    item.name ===
                    activeMenu
            );


        return (

            <section className="module-placeholder">

                <div className="placeholder-icon">

                    {selectedItem?.icon}

                </div>


                <h2>

                    {activeMenu} Management

                </h2>


                <p>

                    The{" "}
                    {activeMenu.toLowerCase()}{" "}
                    management module is ready to be
                    connected with your backend API.

                </p>


                <button
                    className="admin-primary-button"
                    onClick={() =>
                        setActiveMenu(
                            "Dashboard"
                        )
                    }
                >

                    ← Back to Dashboard

                </button>

            </section>

        );

    };


    // =========================================================
    // DASHBOARD
    // =========================================================

    const renderDashboard = () => {

        // -----------------------------------------------------
        // LOADING
        // -----------------------------------------------------

        if (loading) {

            return (

                <section className="module-placeholder">

                    <div className="placeholder-icon">
                        ⏳
                    </div>

                    <h2>
                        Loading Dashboard
                    </h2>

                    <p>
                        Fetching the latest data from
                        DeluLu Cart database...
                    </p>

                </section>

            );

        }


        // -----------------------------------------------------
        // ERROR
        // -----------------------------------------------------

        if (error) {

            return (

                <section className="module-placeholder">

                    <div className="placeholder-icon">
                        ⚠️
                    </div>

                    <h2>
                        Unable to Load Dashboard
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="admin-primary-button"
                        onClick={
                            loadDashboardData
                        }
                    >
                        🔄 Retry
                    </button>

                </section>

            );

        }


        return (

            <>

                {/* =================================================
                    WELCOME BANNER
                ================================================= */}

                <section className="welcome-banner">

                    <div>

                        <span>
                            ✨ GOOD TO SEE YOU, ADMIN
                        </span>


                        <h2>

                            Welcome back to{" "}

                            <strong>
                                DeluLu Cart
                            </strong>

                        </h2>


                        <p>

                            Here's what's happening
                            with your store today.

                        </p>

                    </div>


                    <div className="welcome-illustration">

                        🛍️

                    </div>

                </section>


                {/* =================================================
                    STATS
                ================================================= */}

                <section className="admin-stats-grid">

                    {stats.map(
                        stat => (

                            <div
                                className="admin-stat-card"
                                key={stat.title}
                            >

                                <div className="stat-icon">

                                    {stat.icon}

                                </div>


                                <div className="stat-content">

                                    <span>
                                        {stat.title}
                                    </span>


                                    <h3>
                                        {stat.value}
                                    </h3>


                                    <small>

                                        <b>
                                            {stat.growth}
                                        </b>

                                        {" "}
                                        from last month

                                    </small>

                                </div>

                            </div>

                        )
                    )}

                </section>


                {/* =================================================
                    MAIN CONTENT GRID
                ================================================= */}

                <section className="admin-content-grid">


                    {/* =================================================
                        RECENT ORDERS
                    ================================================= */}

                    <div className="admin-card orders-card">

                        <div className="admin-card-header">

                            <div>

                                <span className="card-label">

                                    ORDER MANAGEMENT

                                </span>


                                <h2>

                                    Recent Orders

                                </h2>

                            </div>


                            <button
                                className="view-all-button"
                                onClick={() =>
                                    handleMenuClick(
                                        "Orders"
                                    )
                                }
                            >

                                View All →

                            </button>

                        </div>


                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Order ID
                                        </th>

                                        <th>
                                            Customer
                                        </th>

                                        <th>
                                            Product
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {recentOrders.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                style={{
                                                    textAlign:
                                                        "center",
                                                    padding:
                                                        "30px"
                                                }}
                                            >

                                                No orders found.

                                            </td>

                                        </tr>

                                    ) : (

                                        recentOrders.map(
                                            order => (

                                                <tr
                                                    key={
                                                        order.id
                                                    }
                                                >

                                                    <td>

                                                        <strong>
                                                            #{order.id}
                                                        </strong>

                                                    </td>


                                                    <td>
                                                        {
                                                            order.customer
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            order.product
                                                        }
                                                    </td>


                                                    <td>

                                                        <strong>
                                                            {
                                                                order.amount
                                                            }
                                                        </strong>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                `status-badge status-${order.status
                                                                    .toString()
                                                                    .toLowerCase()
                                                                    .replaceAll(
                                                                        "_",
                                                                        "-"
                                                                    )}`
                                                            }
                                                        >

                                                            {
                                                                getStatusLabel(
                                                                    order.status
                                                                )
                                                            }

                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT COLUMN
                    ================================================= */}

                    <div className="admin-side-column">


                        {/* =================================================
                            SALES OVERVIEW
                        ================================================= */}

                        <div className="admin-card">

                            <div className="admin-card-header">

                                <div>

                                    <span className="card-label">

                                        ANALYTICS

                                    </span>


                                    <h2>

                                        Sales Overview

                                    </h2>

                                </div>


                                <span className="period-badge">

                                    This Week

                                </span>

                            </div>


                            <div className="sales-overview">

                                <div className="sales-total">

                                    {formatCurrency(
                                        currentMonthSales
                                    )}

                                </div>


                                <div
                                    className="sales-growth"
                                >

                                    {salesGrowth >= 0
                                        ? "↑"
                                        : "↓"}{" "}

                                    {Math.abs(
                                        salesGrowth
                                    ).toFixed(1)}
                                    %

                                </div>

                            </div>


                            <div className="fake-chart">

                                {weeklySales.map(
                                    (item) => (

                                        <div
                                            key={
                                                item.label
                                            }
                                            title={`${item.label}: ${formatCurrency(item.value)}`}
                                            style={{
                                                height:
                                                    `${
                                                        Math.max(
                                                            (
                                                                item.value /
                                                                maxWeeklySales
                                                            ) *
                                                            100,
                                                            4
                                                        )
                                                    }%`
                                            }}
                                        ></div>

                                    )
                                )}

                            </div>


                            <div className="chart-labels">

                                {weeklySales.map(
                                    item => (

                                        <span
                                            key={
                                                item.label
                                            }
                                        >
                                            {
                                                item.label
                                            }
                                        </span>

                                    )
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            QUICK ACTIONS
                        ================================================= */}

                        <div className="admin-card">

                            <div className="admin-card-header">

                                <div>

                                    <span className="card-label">

                                        SHORTCUTS

                                    </span>


                                    <h2>

                                        Quick Actions

                                    </h2>

                                </div>

                            </div>


                            <div className="quick-actions">


                                <button
                                    onClick={() =>
                                        handleMenuClick(
                                            "Users"
                                        )
                                    }
                                >

                                    👥

                                    <span>
                                        Manage Users
                                    </span>

                                </button>


                                <button
                                    onClick={() =>
                                        handleMenuClick(
                                            "Products"
                                        )
                                    }
                                >

                                    📦

                                    <span>
                                        Manage Products
                                    </span>

                                </button>


                                <button
                                    onClick={() =>
                                        handleMenuClick(
                                            "Orders"
                                        )
                                    }
                                >

                                    🛒

                                    <span>
                                        Manage Orders
                                    </span>

                                </button>


                                <button
                                    onClick={() =>
                                        handleMenuClick(
                                            "Reports"
                                        )
                                    }
                                >

                                    📈

                                    <span>
                                        View Reports
                                    </span>

                                </button>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    REPORT SUMMARY
                ================================================= */}

                <section className="report-summary">

                    <div className="report-summary-header">

                        <div>

                            <span className="card-label">

                                BUSINESS INSIGHTS

                            </span>


                            <h2>

                                Store Performance

                            </h2>

                        </div>

                    </div>


                    <div className="report-grid">


                        {/* BEST SELLING PRODUCT */}

                        <div className="report-card">

                            <span>
                                Best Selling Product
                            </span>


                            <strong>
                                {
                                    bestSellingProduct.name
                                }
                            </strong>


                            <small>

                                {
                                    bestSellingProduct.quantity
                                }{" "}
                                units sold

                            </small>

                        </div>


                        {/* TOP CUSTOMER */}

                        <div className="report-card">

                            <span>
                                Top Customer
                            </span>


                            <strong>
                                {
                                    topCustomer.name
                                }
                            </strong>


                            <small>

                                {
                                    formatCurrency(
                                        topCustomer.spent
                                    )
                                }{" "}
                                total spent

                            </small>

                        </div>


                        {/* MONTHLY REVENUE */}

                        <div className="report-card">

                            <span>
                                Monthly Revenue
                            </span>


                            <strong>

                                {
                                    formatCurrency(
                                        monthlyRevenue
                                    )
                                }

                            </strong>


                            <small>

                                Current month revenue

                            </small>

                        </div>


                        {/* PENDING ORDERS */}

                        <div className="report-card">

                            <span>
                                Pending Orders
                            </span>


                            <strong>
                                {
                                    pendingOrders.length
                                }
                            </strong>


                            <small>

                                Need attention

                            </small>

                        </div>

                    </div>

                </section>

            </>

        );

    };


    // =========================================================
    // MAIN RETURN
    // =========================================================

    return (

        <div className="admin-dashboard">


            {/* =================================================
                MOBILE OVERLAY
            ================================================= */}

            {sidebarOpen && (

                <div
                    className="admin-overlay"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                ></div>

            )}


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
                className={
                    sidebarOpen
                        ? "admin-sidebar open"
                        : "admin-sidebar"
                }
            >


                {/* LOGO */}

                <div className="admin-logo">

                    <div className="admin-logo-icon">

                        🛍️

                    </div>


                    <div className="admin-logo-text">

                        <span>
                            DeluLu
                        </span>


                        <strong>
                            Cart
                        </strong>

                    </div>


                    <button
                        className="sidebar-close"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                    >

                        ✕

                    </button>

                </div>


                {/* PROFILE */}

                <div className="admin-profile">

                    <div className="admin-avatar">

                        👑

                    </div>


                    <div className="admin-profile-info">

                        <h4>
                            Administrator
                        </h4>


                        <p>

                            {
                                localStorage.getItem(
                                    "email"
                                ) ||
                                "admin@delulu.com"
                            }

                        </p>

                    </div>

                </div>


                {/* NAVIGATION */}

                <div className="sidebar-section-title">

                    MAIN MENU

                </div>


                <nav className="admin-nav">

                    {menuItems.map(
                        item => (

                            <button
                                key={
                                    item.name
                                }
                                className={
                                    activeMenu ===
                                    item.name
                                        ? "admin-nav-item active"
                                        : "admin-nav-item"
                                }
                                onClick={() =>
                                    handleMenuClick(
                                        item.name
                                    )
                                }
                            >

                                <span className="admin-nav-icon">

                                    {
                                        item.icon
                                    }

                                </span>


                                <span className="admin-nav-text">

                                    {
                                        item.name
                                    }

                                </span>


                                {/* PENDING SELLER COUNT */}

                                {item.name ===
                                    "Seller Requests" &&
                                    pendingSellers.length >
                                        0 && (

                                        <span className="notification-dot">

                                            {
                                                pendingSellers.length
                                            }

                                        </span>

                                    )}


                                {activeMenu ===
                                    item.name &&
                                    item.name !==
                                        "Seller Requests" && (

                                        <span className="active-indicator">

                                            →

                                        </span>

                                    )}

                            </button>

                        )
                    )}

                </nav>


                {/* SIDEBAR BOTTOM */}

                <div className="sidebar-bottom">


                    <button className="sidebar-help">

                        <span>
                            💡
                        </span>


                        <div>

                            <strong>
                                Need Help?
                            </strong>


                            <small>
                                Admin support
                            </small>

                        </div>

                    </button>


                    <button
                        className="admin-logout"
                        onClick={
                            handleLogout
                        }
                    >

                        <span>
                            🚪
                        </span>


                        Logout

                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="admin-main">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="admin-header">


                    <div className="admin-header-left">


                        <button
                            className="admin-menu-button"
                            onClick={() =>
                                setSidebarOpen(
                                    true
                                )
                            }
                        >

                            ☰

                        </button>


                        <div>

                            <span className="header-label">

                                ADMIN CONTROL CENTER

                            </span>


                            <h1>

                                {
                                    activeMenu
                                }

                            </h1>


                            <p>

                                Manage your DeluLu Cart
                                platform from one place.

                            </p>

                        </div>

                    </div>


                    <div className="admin-header-actions">


                        {/* HEADER SEARCH */}

                        <div className="admin-search">

                            <span>
                                🔍
                            </span>


                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={
                                    event =>
                                        setSearch(
                                            event.target.value
                                        )
                                }
                            />

                        </div>


                        {/* NOTIFICATION */}

                        <button
                            className="notification-button"
                            onClick={() =>
                                handleMenuClick(
                                    "Seller Requests"
                                )
                            }
                        >

                            🔔


                            {pendingSellers.length >
                                0 && (

                                <span className="notification-dot">

                                    {
                                        pendingSellers.length
                                    }

                                </span>

                            )}

                        </button>


                        {/* ADMIN AVATAR */}

                        <div className="header-avatar">

                            👑

                        </div>

                    </div>

                </header>


                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <div className="admin-page-content">

                    {activeMenu ===
                        "Dashboard"
                        ? renderDashboard()
                        : renderModule()}

                </div>


            </main>

        </div>

    );

}


export default AdminDashboard;