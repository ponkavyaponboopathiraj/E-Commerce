


import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SellerDashboard.css";

import {
    addProduct,
    getProductsBySeller,
    updateProduct,
    updateProductStatus,
    deleteProduct
} from "../../service/productService";

const API_BASE_URL = "http://localhost:8080";

function SellerDashboard() {
    const navigate = useNavigate();

    const sellerEmail = localStorage.getItem("email") || "seller@delulucart.com";
    const storedSellerName = localStorage.getItem("sellerName");

    const sellerName =
        storedSellerName ||
        sellerEmail
            .split("@")[0]
            .replace(/[._-]/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

    const sellerId = localStorage.getItem("sellerId");
    const token = localStorage.getItem("token");

    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewProduct, setViewProduct] = useState(null);

    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const [toast, setToast] = useState("");

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    const [productForm, setProductForm] = useState({
        name: "",
        category: "Fashion",
        price: "",
        stock: "",
        image: "",
        description: ""
    });

    const categories = [
        "All",
        "Fashion",
        "Electronics",
        "Home",
        "Beauty",
        "Sports"
    ];

    const authHeaders = () => {
        const headers = {
            "Content-Type": "application/json"
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return headers;
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(""), 2500);
    };

    const isSuccessfulResponse = (response) =>
        response.ok || response.status === 204;

    // =========================================================
    // PRODUCTS
    // =========================================================

    const loadSellerProducts = async () => {
        if (!sellerId) {
            showToast("Seller ID not found. Please login again.");
            return;
        }

        try {
            setLoadingProducts(true);

            const data = await getProductsBySeller(sellerId);

            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load seller products:", error);
            console.error("Backend response:", error.response?.data);

            showToast(
                error.response?.data?.message ||
                "Failed to load your products"
            );
        } finally {
            setLoadingProducts(false);
        }
    };

    // Load ALL marketplace products.
    // This is intentionally different from getProductsBySeller().
    const loadAllMarketplaceProducts = async () => {
        try {
            setLoadingProducts(true);

            const response = await fetch(
                `${API_BASE_URL}/api/products`,
                {
                    method: "GET",
                    headers: authHeaders()
                }
            );

            if (!response.ok) {
                throw new Error(`Products request failed: ${response.status}`);
            }

            const data = await response.json();

            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load marketplace products:", error);
            showToast("Failed to load shop products");
        } finally {
            setLoadingProducts(false);
        }
    };

    // =========================================================
    // ORDERS
    // =========================================================

    const loadSellerOrders = async () => {
        if (!sellerId) return;

        try {
            setLoadingOrders(true);

            const response = await fetch(
                `${API_BASE_URL}/api/orders/seller/${sellerId}`,
                {
                    method: "GET",
                    headers: authHeaders()
                }
            );

            if (!response.ok) {
                throw new Error(`Orders request failed: ${response.status}`);
            }

            const data = await response.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load seller orders:", error);
            showToast("Failed to load orders");
        } finally {
            setLoadingOrders(false);
        }
    };

    // =========================================================
    // NOTIFICATIONS
    // =========================================================

    const loadNotifications = async () => {
        if (!sellerId) return;

        try {
            setLoadingNotifications(true);

            const response = await fetch(
                `${API_BASE_URL}/api/notifications/seller/${sellerId}`,
                {
                    method: "GET",
                    headers: authHeaders()
                }
            );

            if (response.status === 401) {
                console.error(
                    "Notification API returned 401. JWT token is missing/expired or the endpoint requires authentication."
                );
                return;
            }

            if (!response.ok) {
                throw new Error(
                    `Notification request failed: ${response.status}`
                );
            }

            const data = await response.json();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Notification loading failed:", error);
        } finally {
            setLoadingNotifications(false);
        }
    };

    useEffect(() => {
        if (!sellerId) return;

        loadSellerProducts();
        loadSellerOrders();
        loadNotifications();

        const interval = setInterval(() => {
            loadNotifications();
            loadSellerOrders();
        }, 10000);

        return () => clearInterval(interval);
    }, [sellerId]);

    const markNotificationAsRead = async (notification) => {
        if (!notification?.id || notification.read) return;

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/${notification.id}/read`,
                {
                    method: "PATCH",
                    headers: authHeaders()
                }
            );

            if (!isSuccessfulResponse(response)) {
                throw new Error("Failed to mark notification as read");
            }

            setNotifications((previous) =>
                previous.map((item) =>
                    item.id === notification.id
                        ? { ...item, read: true }
                        : item
                )
            );
        } catch (error) {
            console.error("Mark notification read failed:", error);
        }
    };

    const markAllNotificationsAsRead = async () => {
        if (!sellerId) return;

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/notifications/seller/${sellerId}/read-all`,
                {
                    method: "PATCH",
                    headers: authHeaders()
                }
            );

            if (!isSuccessfulResponse(response)) {
                throw new Error("Failed to mark all notifications as read");
            }

            setNotifications((previous) =>
                previous.map((notification) => ({
                    ...notification,
                    read: true
                }))
            );

            showToast("All notifications marked as read ✅");
        } catch (error) {
            console.error("Mark all notifications failed:", error);
            showToast("Failed to mark notifications as read");
        }
    };

    const unreadNotifications = notifications.filter(
        (notification) => notification.read === false
    ).length;

    // =========================================================
    // PRODUCT FILTERING
    // =========================================================

    const myProducts = products.filter(
        (product) =>
            String(product.sellerId || "").trim() ===
            String(sellerId || "").trim()
    );

    const marketplaceProducts = products.filter(
        (product) =>
            String(product.sellerId || "").trim() !==
            String(sellerId || "").trim()
    );

    const filteredProducts = useMemo(() => {
        const source =
            activeMenu === "products"
                ? myProducts
                : marketplaceProducts;

        return source.filter((product) => {
            const productName = product.name || "";
            const productCategory = product.category || "";

            const searchMatch = productName
                .toLowerCase()
                .includes(search.toLowerCase());

            const categoryMatch =
                selectedCategory === "All" ||
                productCategory === selectedCategory;

            return searchMatch && categoryMatch;
        });
    }, [
        products,
        sellerId,
        activeMenu,
        search,
        selectedCategory
    ]);

    // =========================================================
    // PRODUCT FORM
    // =========================================================

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setProductForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const resetProductForm = () => {
        setProductForm({
            name: "",
            category: "Fashion",
            price: "",
            stock: "",
            image: "",
            description: ""
        });
    };

    const openAddProduct = () => {
        setEditingProduct(null);
        resetProductForm();
        setShowProductModal(true);
    };

    const openEditProduct = (product) => {
        setEditingProduct(product);

        setProductForm({
            name: product.name || "",
            category: product.category || "Fashion",
            price: product.price ?? "",
            stock: product.stock ?? "",
            image:
                product.images?.[0] ||
                product.image ||
                "",
            description: product.description || ""
        });

        setShowProductModal(true);
    };

    const closeProductModal = () => {
        setShowProductModal(false);
        setEditingProduct(null);
        resetProductForm();
    };

    const handleProductSubmit = async (event) => {
        event.preventDefault();

        if (!sellerId) {
            showToast("Seller ID not found. Please login again.");
            return;
        }

        if (
            !productForm.name.trim() ||
            productForm.price === "" ||
            productForm.stock === ""
        ) {
            showToast("Please fill all required fields");
            return;
        }

        const price = Number(productForm.price);
        const stock = Number(productForm.stock);

        if (!Number.isFinite(price) || price < 0) {
            showToast("Please enter a valid price");
            return;
        }

        if (!Number.isInteger(stock) || stock < 0) {
            showToast("Please enter a valid stock quantity");
            return;
        }

        try {
            if (editingProduct) {
                const updatedProductData = {
                    sellerId: editingProduct.sellerId || sellerId,
                    name: productForm.name.trim(),
                    description: productForm.description.trim(),
                    price,
                    category: productForm.category,
                    stock,
                    status:
                        stock > 0
                            ? (editingProduct.status === "INACTIVE"
                                ? "INACTIVE"
                                : "ACTIVE")
                            : "INACTIVE",
                    images: productForm.image.trim()
                        ? [productForm.image.trim()]
                        : [],
                    attributes: editingProduct.attributes || {}
                };

                const updatedProduct = await updateProduct(
                    editingProduct.id,
                    updatedProductData
                );

                setProducts((previous) =>
                    previous.map((product) =>
                        product.id === editingProduct.id
                            ? updatedProduct
                            : product
                    )
                );

                closeProductModal();
                await loadSellerProducts();
                await loadNotifications();

                showToast("Product updated successfully ✨");
                return;
            }

            const productData = {
                sellerId,
                name: productForm.name.trim(),
                description: productForm.description.trim(),
                price,
                category: productForm.category,
                stock,
                status: stock > 0 ? "ACTIVE" : "INACTIVE",
                images: productForm.image.trim()
                    ? [productForm.image.trim()]
                    : [],
                attributes: {}
            };

            const savedProduct = await addProduct(productData);

            setProducts((previous) => [
                savedProduct,
                ...previous
            ]);

            closeProductModal();

            await loadSellerProducts();
            await loadNotifications();

            showToast("Product added successfully 🎉");
        } catch (error) {
            console.error("Product save/update error:", error);
            console.error("Backend response:", error.response?.data);

            showToast(
                error.response?.data?.message ||
                "Failed to save product"
            );
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {
            await deleteProduct(productId);

            setProducts((previous) =>
                previous.filter((product) => product.id !== productId)
            );

            showToast("Product deleted successfully 🗑️");
        } catch (error) {
            console.error("Delete product failed:", error);

            showToast(
                error.response?.data?.message ||
                "Failed to delete product"
            );
        }
    };

    const handleStatusChange = async (productId, status) => {
        try {
            const updatedProduct = await updateProductStatus(
                productId,
                status
            );

            setProducts((previous) =>
                previous.map((product) =>
                    product.id === productId
                        ? updatedProduct
                        : product
                )
            );

            await loadNotifications();

            showToast(
                updatedProduct.status === "ACTIVE"
                    ? "Product activated successfully ✅"
                    : "Product deactivated successfully"
            );
        } catch (error) {
            console.error("Status update failed:", error);

            showToast(
                error.response?.data?.message ||
                "Failed to update product status"
            );
        }
    };

    // =========================================================
    // CART
    // =========================================================

    const addToCart = (product) => {
        const isOwnProduct =
            String(product.sellerId || "").trim() ===
            String(sellerId || "").trim();

        if (isOwnProduct) {
            showToast("You cannot buy your own product");
            return;
        }

        if (product.status && product.status !== "ACTIVE") {
            showToast("This product is currently inactive");
            return;
        }

        if (Number(product.stock || 0) <= 0) {
            showToast("This product is out of stock");
            return;
        }

        const existing = cart.find(
            (item) => item.productId === product.id
        );

        if (existing) {
            if (existing.quantity >= Number(product.stock)) {
                showToast("Maximum available stock already in cart");
                return;
            }

            setCart((previous) =>
                previous.map((item) =>
                    item.productId === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                )
            );

            showToast("Cart quantity increased 🛒");
            return;
        }

        setCart((previous) => [
            ...previous,
            {
                productId: product.id,
                product,
                quantity: 1
            }
        ]);

        showToast("Added to cart 🛒");
    };

    const removeFromCart = (productId) => {
        setCart((previous) =>
            previous.filter((item) => item.productId !== productId)
        );

        showToast("Removed from cart");
    };

    const updateCartQuantity = (productId, quantity) => {
        const cartItem = cart.find(
            (item) => item.productId === productId
        );

        if (!cartItem) return;

        const stock = Number(cartItem.product.stock || 0);

        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        if (quantity > stock) {
            showToast(`Only ${stock} item(s) available`);
            return;
        }

        setCart((previous) =>
            previous.map((item) =>
                item.productId === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const cartTotal = cart.reduce(
        (total, item) =>
            total +
            Number(item.product.price || 0) *
            item.quantity,
        0
    );

    // =========================================================
    // REAL ORDER API
    // =========================================================

    const createOrder = async (items, shippingAddress = "") => {
        if (!sellerId) {
            showToast("Customer/Seller ID not found. Please login again.");
            return null;
        }

        if (!items.length) {
            showToast("Please select at least one product");
            return null;
        }

        const orderPayload = {
            customerId: sellerId,
            items: items.map((item) => ({
                productId: item.product.id,
                sellerId: item.product.sellerId,
                productName: item.product.name,
                price: Number(item.product.price || 0),
                quantity: item.quantity,
                subtotal:
                    Number(item.product.price || 0) *
                    item.quantity
            })),
            shippingAddress
        };

        const response = await fetch(
            `${API_BASE_URL}/api/orders`,
            {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify(orderPayload)
            }
        );

        if (!response.ok) {
            let message = "Failed to place order";

            try {
                const data = await response.json();
                message =
                    data?.message ||
                    data?.error ||
                    message;
            } catch {
                // response may not contain JSON
            }

            throw new Error(message);
        }

        return response.json();
    };

    const buyNow = async (product) => {
        const isOwnProduct =
            String(product.sellerId || "").trim() ===
            String(sellerId || "").trim();

        if (isOwnProduct) {
            showToast("You cannot buy your own product");
            return;
        }

        if (product.status && product.status !== "ACTIVE") {
            showToast("This product is currently inactive");
            return;
        }

        if (Number(product.stock || 0) <= 0) {
            showToast("This product is out of stock");
            return;
        }

        try {
            await createOrder([
                {
                    productId: product.id,
                    product,
                    quantity: 1
                }
            ]);

            await loadSellerOrders();
            await loadSellerProducts();
            await loadNotifications();

            showToast("Order placed successfully 🎉");
        } catch (error) {
            console.error("Buy now failed:", error);
            showToast(error.message || "Failed to place order");
        }
    };

    const checkoutCart = async () => {
        if (!cart.length) {
            showToast("Your cart is empty");
            return;
        }

        try {
            await createOrder(cart);

            setCart([]);

            await loadSellerOrders();
            await loadSellerProducts();
            await loadNotifications();

            showToast("Cart order placed successfully 🎉");
        } catch (error) {
            console.error("Checkout failed:", error);
            showToast(error.message || "Failed to place order");
        }
    };

    // =========================================================
    // WISHLIST
    // =========================================================

    const toggleWishlist = (product) => {
        const exists = wishlist.some(
            (item) => item.id === product.id
        );

        if (exists) {
            setWishlist((previous) =>
                previous.filter(
                    (item) => item.id !== product.id
                )
            );

            showToast("Removed from wishlist");
        } else {
            setWishlist((previous) => [
                ...previous,
                product
            ]);

            showToast("Added to wishlist ❤️");
        }
    };

    // =========================================================
    // SELLER ORDER STATUS
    // =========================================================

    const handleOrderStatusChange = async (
        orderId,
        status
    ) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/orders/${orderId}/status?status=${encodeURIComponent(status)}`,
                {
                    method: "PATCH",
                    headers: authHeaders()
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update order status");
            }

            const updatedOrder = await response.json();

            setOrders((previous) =>
                previous.map((order) =>
                    order.id === orderId
                        ? updatedOrder
                        : order
                )
            );

            showToast("Order status updated successfully ✅");
        } catch (error) {
            console.error("Order status update failed:", error);
            showToast(error.message || "Failed to update order status");
        }
    };

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {
        [
            "token",
            "role",
            "email",
            "sellerName",
            "sellerId"
        ].forEach((key) => localStorage.removeItem(key));

        navigate("/login");
    };

    // =========================================================
    // STATS
    // =========================================================

    const totalProducts = myProducts.length;

    const totalStock = myProducts.reduce(
        (total, product) =>
            total + Number(product.stock || 0),
        0
    );

    const totalSales = orders.reduce(
        (total, order) => {
            const sellerItems = (order.items || []).filter(
                (item) =>
                    String(item.sellerId || "").trim() ===
                    String(sellerId || "").trim()
            );

            return (
                total +
                sellerItems.reduce(
                    (sum, item) =>
                        sum + Number(item.subtotal || 0),
                    0
                )
            );
        },
        0
    );

    // =========================================================
    // MENU
    // =========================================================

    const changeMenu = async (menu) => {
        setActiveMenu(menu);
        setSearch("");
        setSelectedCategory("All");

        if (menu === "shop") {
            await loadAllMarketplaceProducts();
        } else if (menu === "products") {
            await loadSellerProducts();
        } else if (menu === "orders") {
            await loadSellerOrders();
        }
    };

    return (
        <div className="seller-dashboard">

            <aside className="seller-sidebar">

                <div className="sidebar-brand">
                    <div className="brand-icon">🛍️</div>
                    <div>
                        <h2>DeluLu</h2>
                        <span>Cart</span>
                    </div>
                </div>

                <div className="seller-profile">
                    <div className="profile-avatar">
                        {sellerName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h3>{sellerName}</h3>
                        <p>Seller Account</p>
                    </div>
                </div>

                <nav className="sidebar-menu">

                    <button
                        className={activeMenu === "dashboard" ? "active" : ""}
                        onClick={() => changeMenu("dashboard")}
                    >
                        📊 Dashboard
                    </button>

                    <button
                        className={activeMenu === "products" ? "active" : ""}
                        onClick={() => changeMenu("products")}
                    >
                        📦 My Products
                    </button>

                    <button
                        className={activeMenu === "shop" ? "active" : ""}
                        onClick={() => changeMenu("shop")}
                    >
                        🛍️ Shop Products
                    </button>

                    <button
                        className={activeMenu === "orders" ? "active" : ""}
                        onClick={() => changeMenu("orders")}
                    >
                        🚚 My Orders
                    </button>

                    <button
                        className={activeMenu === "wishlist" ? "active" : ""}
                        onClick={() => changeMenu("wishlist")}
                    >
                        ❤️ Wishlist
                        {wishlist.length > 0 && (
                            <span className="menu-count">
                                {wishlist.length}
                            </span>
                        )}
                    </button>

                    <button
                        className={activeMenu === "cart" ? "active" : ""}
                        onClick={() => changeMenu("cart")}
                    >
                        🛒 Cart
                        {cart.length > 0 && (
                            <span className="menu-count">
                                {cart.length}
                            </span>
                        )}
                    </button>

                </nav>

                <button
                    className="sidebar-logout"
                    onClick={handleLogout}
                >
                    🚪 Logout
                </button>

            </aside>

            <main className="seller-main">

                <header className="seller-topbar">

                    <div>
                        <p>Welcome back,</p>
                        <h1>{sellerName} 👋</h1>
                    </div>

                    <div className="top-actions">

                        <div
                            className="notification-wrapper"
                            style={{ position: "relative" }}
                        >
                            <button
                                type="button"
                                className="notification-button"
                                onClick={() =>
                                    setShowNotifications((previous) => !previous)
                                }
                                style={{
                                    position: "relative",
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                    fontSize: "24px"
                                }}
                            >
                                🔔

                                {unreadNotifications > 0 && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: "-4px",
                                            right: "-4px",
                                            minWidth: "20px",
                                            height: "20px",
                                            borderRadius: "50%",
                                            background: "#ef4444",
                                            color: "#fff",
                                            fontSize: "11px",
                                            fontWeight: "700",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            padding: "0 4px"
                                        }}
                                    >
                                        {unreadNotifications > 99
                                            ? "99+"
                                            : unreadNotifications}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div
                                    className="notification-dropdown"
                                    style={{
                                        position: "absolute",
                                        top: "48px",
                                        right: "0",
                                        width: "380px",
                                        maxHeight: "500px",
                                        overflowY: "auto",
                                        background: "#fff",
                                        borderRadius: "16px",
                                        boxShadow:
                                            "0 15px 40px rgba(0,0,0,0.18)",
                                        zIndex: 9999,
                                        padding: "14px"
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "12px"
                                        }}
                                    >
                                        <h3>🔔 Notifications</h3>

                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "8px"
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={loadNotifications}
                                                disabled={loadingNotifications}
                                            >
                                                ↻
                                            </button>

                                            {unreadNotifications > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        markAllNotificationsAsRead
                                                    }
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {loadingNotifications ? (
                                        <div
                                            style={{
                                                padding: "30px",
                                                textAlign: "center"
                                            }}
                                        >
                                            Loading notifications...
                                        </div>
                                    ) : notifications.length === 0 ? (
                                        <div
                                            style={{
                                                padding: "30px 10px",
                                                textAlign: "center",
                                                color: "#777"
                                            }}
                                        >
                                            <div style={{ fontSize: "35px" }}>
                                                🎉
                                            </div>
                                            <p>No notifications yet.</p>
                                        </div>
                                    ) : (
                                        notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                onClick={() =>
                                                    markNotificationAsRead(
                                                        notification
                                                    )
                                                }
                                                style={{
                                                    padding: "12px",
                                                    marginBottom: "8px",
                                                    borderRadius: "12px",
                                                    cursor: notification.read
                                                        ? "default"
                                                        : "pointer",
                                                    background:
                                                        notification.read
                                                            ? "#f8fafc"
                                                            : "#fff4f4",
                                                    border:
                                                        notification.read
                                                            ? "1px solid #e5e7eb"
                                                            : "1px solid #fecaca"
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "10px"
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize: "22px"
                                                        }}
                                                    >
                                                        {notification.type ===
                                                        "OUT_OF_STOCK"
                                                            ? "🚨"
                                                            : notification.type ===
                                                              "LOW_STOCK"
                                                            ? "⚠️"
                                                            : notification.type ===
                                                              "BACK_IN_STOCK"
                                                            ? "✅"
                                                            : "🔔"}
                                                    </div>

                                                    <div style={{ flex: 1 }}>
                                                        <strong>
                                                            {notification.productName ||
                                                                "Product"}
                                                        </strong>

                                                        <p
                                                            style={{
                                                                margin: "4px 0",
                                                                fontSize: "13px"
                                                            }}
                                                        >
                                                            {
                                                                notification.message
                                                            }
                                                        </p>

                                                        <small
                                                            style={{
                                                                color: "#888"
                                                            }}
                                                        >
                                                            {notification.createdAt
                                                                ? new Date(
                                                                      notification.createdAt
                                                                  ).toLocaleString()
                                                                : ""}
                                                        </small>
                                                    </div>

                                                    {!notification.read && (
                                                        <span
                                                            style={{
                                                                width: "8px",
                                                                height: "8px",
                                                                background:
                                                                    "#ef4444",
                                                                borderRadius:
                                                                    "50%",
                                                                marginTop: "5px",
                                                                flexShrink: 0
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            className="top-cart"
                            onClick={() => changeMenu("cart")}
                        >
                            🛒
                            {cart.length > 0 && (
                                <span>{cart.length}</span>
                            )}
                        </button>

                        <div className="top-avatar">
                            {sellerName.charAt(0).toUpperCase()}
                        </div>

                    </div>
                </header>

                {/* =====================================================
                    DASHBOARD
                ===================================================== */}

                {activeMenu === "dashboard" && (
                    <>
                        <section className="hero-banner">
                            <div>
                                <span>✨ Seller Hub</span>
                                <h2>
                                    Grow your business with DeluLu Cart
                                </h2>
                                <p>
                                    Manage products, explore the marketplace,
                                    and build your brand.
                                </p>

                                <button onClick={openAddProduct}>
                                    + Add New Product
                                </button>
                            </div>

                            <div className="hero-art">
                                🛍️ 📦 ✨
                            </div>
                        </section>

                        <section className="stats-grid">

                            <div className="stat-card">
                                <span>📦</span>
                                <div>
                                    <p>My Products</p>
                                    <h2>{totalProducts}</h2>
                                </div>
                            </div>

                            <div className="stat-card">
                                <span>📊</span>
                                <div>
                                    <p>Available Stock</p>
                                    <h2>{totalStock}</h2>
                                </div>
                            </div>

                            <div className="stat-card">
                                <span>🚚</span>
                                <div>
                                    <p>My Orders</p>
                                    <h2>{orders.length}</h2>
                                </div>
                            </div>

                            <div className="stat-card">
                                <span>💰</span>
                                <div>
                                    <p>Sales</p>
                                    <h2>₹{totalSales.toFixed(2)}</h2>
                                </div>
                            </div>

                        </section>
                    </>
                )}

                {/* =====================================================
                    PRODUCTS / SHOP
                ===================================================== */}

                {(activeMenu === "products" ||
                    activeMenu === "shop") && (
                    <ProductSection
                        title={
                            activeMenu === "products"
                                ? "My Products"
                                : "Explore Products"
                        }
                        products={filteredProducts}
                        sellerId={sellerId}
                        loading={loadingProducts}
                        onRefresh={
                            activeMenu === "products"
                                ? loadSellerProducts
                                : loadAllMarketplaceProducts
                        }
                        onAdd={openAddProduct}
                        onEdit={openEditProduct}
                        onDelete={handleDeleteProduct}
                        onStatusChange={handleStatusChange}
                        onView={setViewProduct}
                        onWishlist={toggleWishlist}
                        wishlist={wishlist}
                        onCart={addToCart}
                        onBuy={buyNow}
                        search={search}
                        setSearch={setSearch}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        categories={categories}
                    />
                )}

                {/* =====================================================
                    SELLER ORDERS
                ===================================================== */}

                {activeMenu === "orders" && (
                    <section className="content-section">

                        <div className="section-title">
                            <div>
                                <span>Seller Order Management</span>
                                <h2>My Orders</h2>
                            </div>

                            <button
                                className="add-product-button"
                                onClick={loadSellerOrders}
                                disabled={loadingOrders}
                            >
                                {loadingOrders
                                    ? "Refreshing..."
                                    : "↻ Refresh"}
                            </button>
                        </div>

                        {loadingOrders ? (
                            <div className="empty-state">
                                <div>⏳</div>
                                <h3>Loading orders...</h3>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="empty-state">
                                <div>📦</div>
                                <h3>No orders yet</h3>
                                <p>
                                    Orders containing your products will
                                    appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map((order) => {
                                    const sellerItems = (
                                        order.items || []
                                    ).filter(
                                        (item) =>
                                            String(
                                                item.sellerId || ""
                                            ).trim() ===
                                            String(
                                                sellerId || ""
                                            ).trim()
                                    );

                                    if (!sellerItems.length) return null;

                                    return (
                                        <div
                                            className="order-card"
                                            key={order.id}
                                        >
                                            <div>
                                                <h3>
                                                    Order #{order.id}
                                                </h3>

                                                <small>
                                                    Customer:{" "}
                                                    {order.customerId}
                                                </small>

                                                <small
                                                    style={{
                                                        display: "block",
                                                        marginTop: "5px"
                                                    }}
                                                >
                                                    Placed:{" "}
                                                    {order.createdAt
                                                        ? new Date(
                                                              order.createdAt
                                                          ).toLocaleString()
                                                        : "-"}
                                                </small>
                                            </div>

                                            <div>
                                                {sellerItems.map(
                                                    (item, index) => (
                                                        <div
                                                            key={`${order.id}-${index}`}
                                                            style={{
                                                                marginBottom:
                                                                    "5px"
                                                            }}
                                                        >
                                                            <strong>
                                                                {
                                                                    item.productName
                                                                }
                                                            </strong>
                                                            {" × "}
                                                            {item.quantity}
                                                            {" — ₹"}
                                                            {Number(
                                                                item.subtotal ||
                                                                    0
                                                            ).toFixed(2)}
                                                        </div>
                                                    )
                                                )}
                                            </div>

                                            <strong>
                                                ₹
                                                {sellerItems
                                                    .reduce(
                                                        (sum, item) =>
                                                            sum +
                                                            Number(
                                                                item.subtotal ||
                                                                    0
                                                            ),
                                                        0
                                                    )
                                                    .toFixed(2)}
                                            </strong>

                                            <select
                                                value={
                                                    order.status ||
                                                    "PLACED"
                                                }
                                                onChange={(event) =>
                                                    handleOrderStatusChange(
                                                        order.id,
                                                        event.target.value
                                                    )
                                                }
                                            >
                                                <option value="PLACED">
                                                    PLACED
                                                </option>
                                                <option value="CONFIRMED">
                                                    CONFIRMED
                                                </option>
                                                <option value="PROCESSING">
                                                    PROCESSING
                                                </option>
                                                <option value="SHIPPED">
                                                    SHIPPED
                                                </option>
                                                <option value="DELIVERED">
                                                    DELIVERED
                                                </option>
                                                <option value="CANCELLED">
                                                    CANCELLED
                                                </option>
                                            </select>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                )}

                {/* =====================================================
                    WISHLIST
                ===================================================== */}

                {activeMenu === "wishlist" && (
                    <section className="content-section">

                        <div className="section-title">
                            <div>
                                <span>Your Favorites</span>
                                <h2>Wishlist ❤️</h2>
                            </div>
                        </div>

                        {wishlist.length === 0 ? (
                            <div className="empty-state">
                                <div>❤️</div>
                                <h3>Your wishlist is empty</h3>
                                <p>
                                    Save products you love from Shop Products.
                                </p>
                            </div>
                        ) : (
                            <div className="product-grid">
                                {wishlist.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        sellerId={sellerId}
                                        onView={setViewProduct}
                                        onWishlist={toggleWishlist}
                                        wishlist={wishlist}
                                        onCart={addToCart}
                                        onBuy={buyNow}
                                        onEdit={openEditProduct}
                                        onDelete={handleDeleteProduct}
                                        onStatusChange={handleStatusChange}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* =====================================================
                    CART
                ===================================================== */}

                {activeMenu === "cart" && (
                    <section className="content-section">

                        <div className="section-title">
                            <div>
                                <span>Ready to checkout</span>
                                <h2>My Cart 🛒</h2>
                            </div>
                        </div>

                        {cart.length === 0 ? (
                            <div className="empty-state">
                                <div>🛒</div>
                                <h3>Your cart is empty</h3>
                                <p>
                                    Explore products from other sellers.
                                </p>

                                <button
                                    className="add-product-button"
                                    onClick={() => changeMenu("shop")}
                                >
                                    🛍️ Shop Products
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="cart-list">
                                    {cart.map((item) => (
                                        <div
                                            className="cart-item"
                                            key={item.productId}
                                        >
                                            <img
                                                src={getProductImage(
                                                    item.product
                                                )}
                                                alt={item.product.name}
                                            />

                                            <div style={{ flex: 1 }}>
                                                <h3>
                                                    {item.product.name}
                                                </h3>

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        item.product.price ||
                                                            0
                                                    ).toFixed(2)}
                                                </strong>

                                                <p>
                                                    Seller:{" "}
                                                    {item.product.sellerName ||
                                                        item.product.sellerId}
                                                </p>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "10px"
                                                    }}
                                                >
                                                    <button
                                                        onClick={() =>
                                                            updateCartQuantity(
                                                                item.productId,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                    >
                                                        −
                                                    </button>

                                                    <strong>
                                                        {item.quantity}
                                                    </strong>

                                                    <button
                                                        onClick={() =>
                                                            updateCartQuantity(
                                                                item.productId,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <strong>
                                                ₹
                                                {(
                                                    Number(
                                                        item.product.price || 0
                                                    ) *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </strong>

                                            <button
                                                onClick={() =>
                                                    removeFromCart(
                                                        item.productId
                                                    )
                                                }
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div
                                    style={{
                                        marginTop: "25px",
                                        padding: "20px",
                                        borderRadius: "16px",
                                        background: "#fff",
                                        boxShadow:
                                            "0 10px 30px rgba(0,0,0,0.08)",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <div>
                                        <span>Cart Total</span>
                                        <h2>
                                            ₹{cartTotal.toFixed(2)}
                                        </h2>
                                    </div>

                                    <button
                                        className="add-product-button"
                                        onClick={checkoutCart}
                                    >
                                        ⚡ Checkout
                                    </button>
                                </div>
                            </>
                        )}
                    </section>
                )}
            </main>

            {/* =====================================================
                ADD / EDIT PRODUCT MODAL
            ===================================================== */}

            {showProductModal && (
                <div className="modal-overlay">
                    <div className="product-modal">

                        <button
                            className="modal-close"
                            type="button"
                            onClick={closeProductModal}
                        >
                            ×
                        </button>

                        <h2>
                            {editingProduct
                                ? "Edit Product"
                                : "Add New Product"}
                        </h2>

                        <p>
                            {editingProduct
                                ? "Update your product details."
                                : "Add your product details to DeluLu Cart."}
                        </p>

                        <form onSubmit={handleProductSubmit}>

                            <input
                                name="name"
                                placeholder="Product Name"
                                value={productForm.name}
                                onChange={handleFormChange}
                                required
                            />

                            <select
                                name="category"
                                value={productForm.category}
                                onChange={handleFormChange}
                            >
                                {categories
                                    .filter(
                                        (category) => category !== "All"
                                    )
                                    .map((category) => (
                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>
                                    ))}
                            </select>

                            <input
                                type="number"
                                name="price"
                                placeholder="Price"
                                value={productForm.price}
                                onChange={handleFormChange}
                                min="0"
                                step="0.01"
                                required
                            />

                            <input
                                type="number"
                                name="stock"
                                placeholder="Stock Quantity"
                                value={productForm.stock}
                                onChange={handleFormChange}
                                min="0"
                                step="1"
                                required
                            />

                            <input
                                type="url"
                                name="image"
                                placeholder="Product Image URL"
                                value={productForm.image}
                                onChange={handleFormChange}
                            />

                            <textarea
                                name="description"
                                placeholder="Product Description"
                                value={productForm.description}
                                onChange={handleFormChange}
                            />

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    onClick={closeProductModal}
                                >
                                    Cancel
                                </button>

                                <button type="submit">
                                    {editingProduct
                                        ? "Update Product"
                                        : "Add Product"}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =====================================================
                VIEW PRODUCT
            ===================================================== */}

            {viewProduct && (
                <div className="modal-overlay">

                    <div className="view-modal">

                        <button
                            className="modal-close"
                            type="button"
                            onClick={() => setViewProduct(null)}
                        >
                            ×
                        </button>

                        <img
                            src={getProductImage(viewProduct)}
                            alt={viewProduct.name}
                        />

                        <div>

                            <span>
                                {viewProduct.category}
                            </span>

                            <h2>{viewProduct.name}</h2>

                            <p>
                                {viewProduct.description ||
                                    "No description available."}
                            </p>

                            <h3>
                                ₹
                                {Number(
                                    viewProduct.price || 0
                                ).toFixed(2)}
                            </h3>

                            <p>
                                Stock:{" "}
                                {viewProduct.stock ?? 0}
                            </p>

                            <p>
                                Status:{" "}
                                {viewProduct.status ||
                                    "ACTIVE"}
                            </p>

                            {String(
                                viewProduct.sellerId || ""
                            ).trim() !==
                                String(
                                    sellerId || ""
                                ).trim() && (
                                <div className="view-actions">

                                    <button
                                        onClick={() =>
                                            addToCart(viewProduct)
                                        }
                                    >
                                        🛒 Add to Cart
                                    </button>

                                    <button
                                        onClick={() =>
                                            buyNow(viewProduct)
                                        }
                                    >
                                        ⚡ Buy Now
                                    </button>

                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div className="toast-message">
                    {toast}
                </div>
            )}
        </div>
    );
}

// =============================================================
// PRODUCT IMAGE HELPER
// =============================================================

function getProductImage(product) {
    if (
        product?.images &&
        Array.isArray(product.images) &&
        product.images.length > 0 &&
        product.images[0]
    ) {
        return product.images[0];
    }

    if (product?.image) {
        return product.image;
    }

    return "https://via.placeholder.com/600x500?text=DeluLu+Cart";
}

// =============================================================
// PRODUCT SECTION
// =============================================================

function ProductSection({
    title,
    products,
    sellerId,
    loading,
    onRefresh,
    onAdd,
    onEdit,
    onDelete,
    onStatusChange,
    onView,
    onWishlist,
    wishlist,
    onCart,
    onBuy,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    categories
}) {
    return (
        <section className="content-section">

            <div className="section-title">

                <div>
                    <span>DeluLu Marketplace</span>
                    <h2>{title}</h2>
                </div>

                <div>
                    <button
                        className="add-product-button"
                        onClick={onAdd}
                    >
                        + Add Product
                    </button>

                    <button
                        className="add-product-button"
                        onClick={onRefresh}
                        disabled={loading}
                        style={{ marginLeft: "10px" }}
                    >
                        {loading
                            ? "Refreshing..."
                            : "↻ Refresh"}
                    </button>
                </div>
            </div>

            <div className="product-toolbar">

                <div className="dashboard-search">
                    🔍
                    <input
                        placeholder="Search products..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />
                </div>

                <div className="category-filters">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={
                                selectedCategory === category
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setSelectedCategory(category)
                            }
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="product-grid">

                {loading ? (
                    <div className="empty-state">
                        <div>⏳</div>
                        <h3>Loading products...</h3>
                    </div>
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            sellerId={sellerId}
                            onView={onView}
                            onWishlist={onWishlist}
                            wishlist={wishlist}
                            onCart={onCart}
                            onBuy={onBuy}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onStatusChange={onStatusChange}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <div>📦</div>
                        <h3>No products found</h3>
                        <p>
                            {title === "My Products"
                                ? "Add your first product to DeluLu Cart."
                                : "No products from other sellers are available."}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

// =============================================================
// PRODUCT CARD
// =============================================================

function ProductCard({
    product,
    sellerId,
    onView,
    onWishlist,
    wishlist,
    onCart,
    onBuy,
    onEdit,
    onDelete,
    onStatusChange
}) {
    const isOwnProduct =
        String(product.sellerId || "").trim() ===
        String(sellerId || "").trim();

    const isWishlisted = wishlist.some(
        (item) => item.id === product.id
    );

    const isActive =
        product.status === "ACTIVE" ||
        !product.status;

    const stock = Number(product.stock || 0);
    const isOutOfStock = stock <= 0;

    return (
        <article className="product-card">

            <div className="product-image-wrapper">

                <img
                    src={getProductImage(product)}
                    alt={product.name || "Product"}
                />

                <button
                    className={
                        isWishlisted
                            ? "wishlist active"
                            : "wishlist"
                    }
                    onClick={() => onWishlist(product)}
                >
                    {isWishlisted ? "♥" : "♡"}
                </button>

                {isOwnProduct && (
                    <span className="own-product-badge">
                        Your Product
                    </span>
                )}
            </div>

            <div className="product-info">

                <span className="product-category">
                    {product.category || "Uncategorized"}
                </span>

                <h3>
                    {product.name || "Unnamed Product"}
                </h3>

                <p className="seller-name">
                    Sold by:{" "}
                    <strong>
                        {isOwnProduct
                            ? "You"
                            : product.sellerName ||
                              product.sellerId ||
                              "Seller"}
                    </strong>
                </p>

                <p>
                    {product.description ||
                        "No description available."}
                </p>

                <div className="product-price-row">

                    <strong>
                        ₹
                        {Number(
                            product.price || 0
                        ).toFixed(2)}
                    </strong>

                    <span>
                        Stock: {stock}
                    </span>
                </div>

                {isOwnProduct &&
                    stock > 0 &&
                    stock <= 5 && (
                        <div
                            style={{
                                color: "#d97706",
                                fontSize: "13px",
                                fontWeight: "600",
                                marginTop: "6px"
                            }}
                        >
                            ⚠️ Low stock
                        </div>
                    )}

                {isOwnProduct &&
                    isOutOfStock && (
                        <div
                            style={{
                                color: "#dc2626",
                                fontSize: "13px",
                                fontWeight: "600",
                                marginTop: "6px"
                            }}
                        >
                            🚨 Out of stock
                        </div>
                    )}

                <div className="product-status-row">
                    <span>Status:</span>
                    <strong>
                        {isOutOfStock
                            ? "INACTIVE"
                            : product.status ||
                              "ACTIVE"}
                    </strong>
                </div>

                <div className="product-actions">

                    <button
                        className="view-button"
                        onClick={() => onView(product)}
                    >
                        👁 View
                    </button>

                    {isOwnProduct ? (
                        <>
                            <button
                                className="edit-button"
                                onClick={() =>
                                    onEdit(product)
                                }
                            >
                                ✏️ Edit
                            </button>

                            <button
                                className="status-button"
                                disabled={isOutOfStock}
                                onClick={() =>
                                    onStatusChange(
                                        product.id,
                                        isActive
                                            ? "INACTIVE"
                                            : "ACTIVE"
                                    )
                                }
                            >
                                {isOutOfStock
                                    ? "🚨 Out of Stock"
                                    : isActive
                                    ? "⏸ Deactivate"
                                    : "▶ Activate"}
                            </button>

                            <button
                                className="delete-button"
                                onClick={() =>
                                    onDelete(product.id)
                                }
                            >
                                🗑️ Delete
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="cart-action"
                                disabled={
                                    !isActive ||
                                    stock <= 0
                                }
                                onClick={() =>
                                    onCart(product)
                                }
                            >
                                🛒
                            </button>

                            <button
                                className="buy-action"
                                disabled={
                                    !isActive ||
                                    stock <= 0
                                }
                                onClick={() =>
                                    onBuy(product)
                                }
                            >
                                Buy Now
                            </button>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
}

export default SellerDashboard;
