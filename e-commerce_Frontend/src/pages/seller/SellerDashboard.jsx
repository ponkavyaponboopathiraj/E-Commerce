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


// =============================================================
// CONSTANT
// =============================================================

const API_BASE_URL = "http://localhost:8080";


// =============================================================
// MAIN SELLER DASHBOARD
// =============================================================

function SellerDashboard() {

    const navigate = useNavigate();


    // =========================================================
    // LOGGED-IN SELLER
    // =========================================================

    const sellerEmail =
        localStorage.getItem("email") ||
        "seller@delulucart.com";

    const storedSellerName =
        localStorage.getItem("sellerName");

    const sellerName =
        storedSellerName ||
        sellerEmail
            .split("@")[0]
            .replace(/[._-]/g, " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );

    const sellerId =
        localStorage.getItem("sellerId");


    // =========================================================
    // DASHBOARD STATES
    // =========================================================

    const [activeMenu, setActiveMenu] =
        useState("dashboard");

    const [search, setSearch] =
        useState("");

    const [selectedCategory, setSelectedCategory] =
        useState("All");


    // =========================================================
    // PRODUCT STATES
    // =========================================================

    const [products, setProducts] =
        useState([]);

    const [loadingProducts, setLoadingProducts] =
        useState(false);

    const [showProductModal, setShowProductModal] =
        useState(false);

    const [editingProduct, setEditingProduct] =
        useState(null);

    const [viewProduct, setViewProduct] =
        useState(null);


    // =========================================================
    // OTHER STATES
    // =========================================================

    const [cart, setCart] =
        useState([]);

    const [wishlist, setWishlist] =
        useState([]);

    const [orders, setOrders] =
        useState([]);

    const [toast, setToast] =
        useState("");


    // =========================================================
    // NOTIFICATION STATES
    // =========================================================

    const [notifications, setNotifications] =
        useState([]);

    const [showNotifications, setShowNotifications] =
        useState(false);

    const [loadingNotifications, setLoadingNotifications] =
        useState(false);


    // =========================================================
    // PRODUCT FORM
    // =========================================================

    const [productForm, setProductForm] =
        useState({
            name: "",
            category: "Fashion",
            price: "",
            stock: "",
            image: "",
            description: ""
        });


    // =========================================================
    // CATEGORIES
    // =========================================================

    const categories = [
        "All",
        "Fashion",
        "Electronics",
        "Home",
        "Beauty",
        "Sports"
    ];


    // =========================================================
    // TOAST
    // =========================================================

    const showToast = (message) => {

        setToast(message);

        setTimeout(() => {
            setToast("");
        }, 2500);
    };


    // =========================================================
    // LOAD SELLER PRODUCTS
    // =========================================================

    const loadSellerProducts = async () => {

        if (!sellerId) {

            console.error(
                "Seller ID not found in localStorage"
            );

            showToast(
                "Seller ID not found. Please login again."
            );

            return;
        }


        try {

            setLoadingProducts(true);

            console.log(
                "Loading products for seller:",
                sellerId
            );


            const data =
                await getProductsBySeller(
                    sellerId
                );


            console.log(
                "Products received:",
                data
            );


            setProducts(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.error(
                "Failed to load seller products:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
            );


            showToast(
                error.response?.data?.message ||
                "Failed to load products"
            );


        } finally {

            setLoadingProducts(false);
        }
    };


    // =========================================================
    // LOAD NOTIFICATIONS
    // =========================================================

    const loadNotifications = async () => {

        if (!sellerId) {
            return;
        }


        try {

            setLoadingNotifications(true);


            const response =
                await fetch(
                    `${API_BASE_URL}/api/notifications/seller/${sellerId}`
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to load notifications"
                );
            }


            const data =
                await response.json();


            console.log(
                "Seller notifications:",
                data
            );


            setNotifications(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.error(
                "Notification loading failed:",
                error
            );

        } finally {

            setLoadingNotifications(false);
        }
    };


    // =========================================================
    // INITIAL PRODUCT LOAD
    // =========================================================

    useEffect(() => {

        if (!sellerId) {
            return;
        }

        loadSellerProducts();

    }, [sellerId]);


    // =========================================================
    // NOTIFICATION AUTO REFRESH
    // =========================================================

    useEffect(() => {

        if (!sellerId) {
            return;
        }


        loadNotifications();


        const interval =
            setInterval(() => {

                loadNotifications();

            }, 10000);


        return () => {

            clearInterval(interval);

        };

    }, [sellerId]);


    // =========================================================
    // MARK SINGLE NOTIFICATION AS READ
    // =========================================================

    const markNotificationAsRead =
        async (notification) => {

            if (!notification?.id) {
                return;
            }


            // Already read
            if (notification.read) {
                return;
            }


            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/api/notifications/${notification.id}/read`,
                        {
                            method: "PATCH"
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to mark notification as read"
                    );
                }


                setNotifications(
                    (previousNotifications) =>
                        previousNotifications.map(
                            (item) =>
                                item.id ===
                                notification.id
                                    ? {
                                        ...item,
                                        read: true
                                    }
                                    : item
                        )
                );


            } catch (error) {

                console.error(
                    "Mark notification read failed:",
                    error
                );
            }
        };


    // =========================================================
    // MARK ALL NOTIFICATIONS AS READ
    // =========================================================

    const markAllNotificationsAsRead =
        async () => {

            if (!sellerId) {
                return;
            }


            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/api/notifications/seller/${sellerId}/read-all`,
                        {
                            method: "PATCH"
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to mark all notifications as read"
                    );
                }


                setNotifications(
                    (previousNotifications) =>
                        previousNotifications.map(
                            (notification) => ({
                                ...notification,
                                read: true
                            })
                        )
                );


                showToast(
                    "All notifications marked as read ✅"
                );


            } catch (error) {

                console.error(
                    "Mark all notifications failed:",
                    error
                );

                showToast(
                    "Failed to mark notifications as read"
                );
            }
        };


    // =========================================================
    // UNREAD NOTIFICATION COUNT
    // =========================================================

    const unreadNotifications =
        notifications.filter(
            (notification) =>
                notification.read === false
        ).length;


    // =========================================================
    // MY PRODUCTS
    // =========================================================

    const myProducts =
        products.filter(
            (product) =>
                String(product.sellerId).trim() ===
                String(sellerId).trim()
        );


    // =========================================================
    // FILTERED PRODUCTS
    // =========================================================

    const filteredProducts =
        useMemo(() => {

            return products.filter(
                (product) => {

                    const productName =
                        product.name || "";

                    const productCategory =
                        product.category || "";


                    const searchMatch =
                        productName
                            .toLowerCase()
                            .includes(
                                search.toLowerCase()
                            );


                    const categoryMatch =
                        selectedCategory === "All" ||
                        productCategory ===
                        selectedCategory;


                    return (
                        searchMatch &&
                        categoryMatch
                    );
                }
            );

        }, [
            products,
            search,
            selectedCategory
        ]);


    // =========================================================
    // FORM CHANGE
    // =========================================================

    const handleFormChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setProductForm(
            (previousForm) => ({
                ...previousForm,
                [name]: value
            })
        );
    };


    // =========================================================
    // RESET FORM
    // =========================================================

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


    // =========================================================
    // OPEN ADD PRODUCT
    // =========================================================

    const openAddProduct = () => {

        setEditingProduct(null);

        resetProductForm();

        setShowProductModal(true);
    };


    // =========================================================
    // OPEN EDIT PRODUCT
    // =========================================================

    const openEditProduct = (product) => {

        setEditingProduct(product);


        setProductForm({

            name:
                product.name || "",

            category:
                product.category ||
                "Fashion",

            price:
                product.price ?? "",

            stock:
                product.stock ?? "",

            image:
                product.images?.[0] ||
                product.image ||
                "",

            description:
                product.description || ""
        });


        setShowProductModal(true);
    };


    // =========================================================
    // CLOSE PRODUCT MODAL
    // =========================================================

    const closeProductModal = () => {

        setShowProductModal(false);

        setEditingProduct(null);

        resetProductForm();
    };


    // =========================================================
    // ADD / UPDATE PRODUCT
    // =========================================================

    const handleProductSubmit =
        async (event) => {

            event.preventDefault();


            // -----------------------------------------------
            // SELLER ID
            // -----------------------------------------------

            if (!sellerId) {

                showToast(
                    "Seller ID not found. Please login again."
                );

                return;
            }


            // -----------------------------------------------
            // VALIDATION
            // -----------------------------------------------

            if (
                !productForm.name.trim() ||
                productForm.price === "" ||
                productForm.stock === ""
            ) {

                showToast(
                    "Please fill all required fields"
                );

                return;
            }


            const price =
                Number(productForm.price);

            const stock =
                Number(productForm.stock);


            if (
                Number.isNaN(price) ||
                price < 0
            ) {

                showToast(
                    "Please enter a valid price"
                );

                return;
            }


            if (
                Number.isNaN(stock) ||
                stock < 0
            ) {

                showToast(
                    "Please enter a valid stock quantity"
                );

                return;
            }


            try {

                // =================================================
                // UPDATE EXISTING PRODUCT
                // =================================================

                if (editingProduct) {

                    const updatedProductData = {

                        sellerId:
                            editingProduct.sellerId,

                        name:
                            productForm.name.trim(),

                        description:
                            productForm.description.trim(),

                        price:
                            price,

                        category:
                            productForm.category,

                        stock:
                            stock,

                        status:
                            editingProduct.status ||
                            "ACTIVE",

                        images:
                            productForm.image.trim()
                                ? [
                                    productForm.image.trim()
                                ]
                                : [],

                        attributes:
                            editingProduct.attributes ||
                            {}
                    };


                    console.log(
                        "Updating product:",
                        editingProduct.id
                    );


                    const updatedProduct =
                        await updateProduct(
                            editingProduct.id,
                            updatedProductData
                        );


                    console.log(
                        "Product updated:",
                        updatedProduct
                    );


                    setProducts(
                        (previousProducts) =>
                            previousProducts.map(
                                (product) =>
                                    product.id ===
                                    editingProduct.id
                                        ? updatedProduct
                                        : product
                            )
                    );


                    closeProductModal();


                    // Reload notifications because
                    // stock update can create notification
                    await loadNotifications();


                    showToast(
                        "Product updated successfully ✨"
                    );


                    return;
                }


                // =================================================
                // ADD NEW PRODUCT
                // =================================================

                const productData = {

                    sellerId:
                        sellerId,

                    name:
                        productForm.name.trim(),

                    description:
                        productForm.description.trim(),

                    price:
                        price,

                    category:
                        productForm.category,

                    stock:
                        stock,

                    status:
                        stock > 0
                            ? "ACTIVE"
                            : "INACTIVE",

                    images:
                        productForm.image.trim()
                            ? [
                                productForm.image.trim()
                            ]
                            : [],

                    attributes:
                        {}
                };


                console.log(
                    "Adding product:",
                    productData
                );


                const savedProduct =
                    await addProduct(
                        productData
                    );


                console.log(
                    "Product saved:",
                    savedProduct
                );


                setProducts(
                    (previousProducts) => [
                        savedProduct,
                        ...previousProducts
                    ]
                );


                closeProductModal();


                // New product with stock 0 can
                // create OUT_OF_STOCK notification
                await loadNotifications();


                showToast(
                    "Product added successfully 🎉"
                );


            } catch (error) {

                console.error(
                    "Product save/update error:",
                    error
                );

                console.error(
                    "Backend response:",
                    error.response?.data
                );


                showToast(
                    error.response?.data?.message ||
                    "Failed to save product"
                );
            }
        };


    // =========================================================
    // DELETE PRODUCT
    // =========================================================

    const handleDeleteProduct =
        async (productId) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this product?"
                );


            if (!confirmed) {
                return;
            }


            try {

                await deleteProduct(
                    productId
                );


                setProducts(
                    (previousProducts) =>
                        previousProducts.filter(
                            (product) =>
                                product.id !==
                                productId
                        )
                );


                showToast(
                    "Product deleted successfully 🗑️"
                );


            } catch (error) {

                console.error(
                    "Delete product failed:",
                    error
                );


                showToast(
                    error.response?.data?.message ||
                    "Failed to delete product"
                );
            }
        };


    // =========================================================
    // UPDATE PRODUCT STATUS
    // =========================================================

    const handleStatusChange =
        async (
            productId,
            status
        ) => {

            try {

                const updatedProduct =
                    await updateProductStatus(
                        productId,
                        status
                    );


                setProducts(
                    (previousProducts) =>
                        previousProducts.map(
                            (product) =>
                                product.id ===
                                productId
                                    ? updatedProduct
                                    : product
                        )
                );


                await loadNotifications();


                showToast(
                    updatedProduct.status ===
                    "ACTIVE"
                        ? "Product activated successfully ✅"
                        : "Product deactivated successfully"
                );


            } catch (error) {

                console.error(
                    "Status update failed:",
                    error
                );


                showToast(
                    error.response?.data?.message ||
                    "Failed to update product status"
                );
            }
        };


    // =========================================================
    // ADD TO CART
    // =========================================================

    const addToCart = (product) => {

        if (
            String(product.sellerId).trim() ===
            String(sellerId).trim()
        ) {

            showToast(
                "You cannot buy your own product"
            );

            return;
        }


        if (
            product.status &&
            product.status !== "ACTIVE"
        ) {

            showToast(
                "This product is currently inactive"
            );

            return;
        }


        if (
            Number(product.stock || 0) <= 0
        ) {

            showToast(
                "This product is out of stock"
            );

            return;
        }


        const alreadyInCart =
            cart.some(
                (item) =>
                    item.id ===
                    product.id
            );


        if (alreadyInCart) {

            showToast(
                "Product is already in your cart 🛒"
            );

            return;
        }


        setCart(
            (previousCart) => [
                ...previousCart,
                product
            ]
        );


        showToast(
            "Added to cart 🛒"
        );
    };


    // =========================================================
    // BUY NOW
    // =========================================================

    const buyNow = (product) => {

        if (
            String(product.sellerId).trim() ===
            String(sellerId).trim()
        ) {

            showToast(
                "You cannot buy your own product"
            );

            return;
        }


        if (
            product.status &&
            product.status !== "ACTIVE"
        ) {

            showToast(
                "This product is currently inactive"
            );

            return;
        }


        if (
            Number(product.stock || 0) <= 0
        ) {

            showToast(
                "This product is out of stock"
            );

            return;
        }


        const newOrder = {

            id:
                Date.now(),

            product:
                product,

            quantity:
                1,

            total:
                Number(product.price) || 0,

            date:
                new Date()
                    .toLocaleDateString(
                        "en-US"
                    ),

            status:
                "Confirmed"
        };


        setOrders(
            (previousOrders) => [
                newOrder,
                ...previousOrders
            ]
        );


        showToast(
            "Order placed successfully 🎉"
        );
    };


    // =========================================================
    // WISHLIST
    // =========================================================

    const toggleWishlist =
        (product) => {

            const exists =
                wishlist.some(
                    (item) =>
                        item.id ===
                        product.id
                );


            if (exists) {

                setWishlist(
                    (previousWishlist) =>
                        previousWishlist.filter(
                            (item) =>
                                item.id !==
                                product.id
                        )
                );


                showToast(
                    "Removed from wishlist"
                );


            } else {

                setWishlist(
                    (previousWishlist) => [
                        ...previousWishlist,
                        product
                    ]
                );


                showToast(
                    "Added to wishlist ❤️"
                );
            }
        };


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("role");

        localStorage.removeItem("email");

        localStorage.removeItem("sellerName");

        localStorage.removeItem("sellerId");


        navigate("/login");
    };


    // =========================================================
    // DASHBOARD STATS
    // =========================================================

    const totalProducts =
        myProducts.length;


    const totalStock =
        myProducts.reduce(
            (total, product) =>
                total +
                Number(
                    product.stock || 0
                ),
            0
        );


    const totalSales =
        orders.reduce(
            (total, order) =>
                total +
                Number(
                    order.total || 0
                ),
            0
        );


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="seller-dashboard">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="seller-sidebar">

                <div className="sidebar-brand">

                    <div className="brand-icon">
                        🛍️
                    </div>

                    <div>

                        <h2>
                            DeluLu
                        </h2>

                        <span>
                            Cart
                        </span>

                    </div>

                </div>


                {/* PROFILE */}

                <div className="seller-profile">

                    <div className="profile-avatar">

                        {sellerName
                            .charAt(0)
                            .toUpperCase()}

                    </div>


                    <div>

                        <h3>
                            {sellerName}
                        </h3>

                        <p>
                            Seller Account
                        </p>

                    </div>

                </div>


                {/* MENU */}

                <nav className="sidebar-menu">

                    <button
                        className={
                            activeMenu ===
                            "dashboard"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveMenu(
                                "dashboard"
                            )
                        }
                    >
                        📊 Dashboard
                    </button>


                    <button
                        className={
                            activeMenu ===
                            "products"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveMenu(
                                "products"
                            )
                        }
                    >
                        📦 My Products
                    </button>


                    <button
                        className={
                            activeMenu ===
                            "shop"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveMenu(
                                "shop"
                            )
                        }
                    >
                        🛍️ Shop Products
                    </button>


                    <button
                        className={
                            activeMenu ===
                            "orders"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveMenu(
                                "orders"
                            )
                        }
                    >
                        🚚 My Orders
                    </button>


                    <button
                        className={
                            activeMenu ===
                            "wishlist"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveMenu(
                                "wishlist"
                            )
                        }
                    >
                        ❤️ Wishlist
                    </button>


                    <button
                        className={
                            activeMenu ===
                            "cart"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveMenu(
                                "cart"
                            )
                        }
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
                    onClick={
                        handleLogout
                    }
                >
                    🚪 Logout
                </button>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="seller-main">


                {/* TOP BAR */}

                <header className="seller-topbar">

                    <div>

                        <p>
                            Welcome back,
                        </p>

                        <h1>
                            {sellerName} 👋
                        </h1>

                    </div>


                    <div className="top-actions">


                        {/* =================================================
                            NOTIFICATION
                        ================================================= */}

                        <div
                            className="notification-wrapper"
                            style={{
                                position:
                                    "relative"
                            }}
                        >

                            <button
                                type="button"
                                className="notification-button"
                                onClick={() =>
                                    setShowNotifications(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                style={{
                                    position:
                                        "relative",
                                    border:
                                        "none",
                                    background:
                                        "transparent",
                                    cursor:
                                        "pointer",
                                    fontSize:
                                        "24px"
                                }}
                            >

                                🔔


                                {unreadNotifications >
                                    0 && (

                                    <span
                                        style={{
                                            position:
                                                "absolute",
                                            top:
                                                "-4px",
                                            right:
                                                "-4px",
                                            minWidth:
                                                "20px",
                                            height:
                                                "20px",
                                            borderRadius:
                                                "50%",
                                            background:
                                                "#ef4444",
                                            color:
                                                "#fff",
                                            fontSize:
                                                "11px",
                                            fontWeight:
                                                "700",
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            padding:
                                                "0 4px"
                                        }}
                                    >

                                        {unreadNotifications >
                                            99
                                            ? "99+"
                                            : unreadNotifications}

                                    </span>
                                )}

                            </button>


                            {/* NOTIFICATION DROPDOWN */}

                            {showNotifications && (

                                <div
                                    className="notification-dropdown"
                                    style={{
                                        position:
                                            "absolute",
                                        top:
                                            "48px",
                                        right:
                                            "0",
                                        width:
                                            "380px",
                                        maxHeight:
                                            "500px",
                                        overflowY:
                                            "auto",
                                        background:
                                            "#ffffff",
                                        borderRadius:
                                            "16px",
                                        boxShadow:
                                            "0 15px 40px rgba(0,0,0,0.18)",
                                        zIndex:
                                            9999,
                                        padding:
                                            "14px"
                                    }}
                                >

                                    {/* HEADER */}

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "center",
                                            marginBottom:
                                                "12px"
                                        }}
                                    >

                                        <h3>
                                            🔔 Notifications
                                        </h3>


                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                gap:
                                                    "8px"
                                            }}
                                        >

                                            <button
                                                type="button"
                                                onClick={
                                                    loadNotifications
                                                }
                                                disabled={
                                                    loadingNotifications
                                                }
                                                style={{
                                                    border:
                                                        "none",
                                                    background:
                                                        "transparent",
                                                    cursor:
                                                        "pointer"
                                                }}
                                            >
                                                ↻
                                            </button>


                                            {unreadNotifications >
                                                0 && (

                                                <button
                                                    type="button"
                                                    onClick={
                                                        markAllNotificationsAsRead
                                                    }
                                                    style={{
                                                        border:
                                                            "none",
                                                        background:
                                                            "transparent",
                                                        cursor:
                                                            "pointer",
                                                        fontSize:
                                                            "12px",
                                                        fontWeight:
                                                            "600"
                                                    }}
                                                >
                                                    Mark all read
                                                </button>

                                            )}

                                        </div>

                                    </div>


                                    {/* NOTIFICATION LIST */}

                                    {loadingNotifications ? (

                                        <div
                                            style={{
                                                padding:
                                                    "30px",
                                                textAlign:
                                                    "center"
                                            }}
                                        >
                                            Loading notifications...
                                        </div>

                                    ) : notifications.length ===
                                      0 ? (

                                        <div
                                            style={{
                                                padding:
                                                    "30px 10px",
                                                textAlign:
                                                    "center",
                                                color:
                                                    "#777"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    fontSize:
                                                        "35px"
                                                }}
                                            >
                                                🎉
                                            </div>

                                            <p>
                                                No notifications yet.
                                            </p>

                                        </div>

                                    ) : (

                                        notifications.map(
                                            (notification) => (

                                                <div
                                                    key={
                                                        notification.id
                                                    }
                                                    onClick={() =>
                                                        markNotificationAsRead(
                                                            notification
                                                        )
                                                    }
                                                    style={{
                                                        padding:
                                                            "12px",
                                                        marginBottom:
                                                            "8px",
                                                        borderRadius:
                                                            "12px",
                                                        cursor:
                                                            notification.read
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
                                                            display:
                                                                "flex",
                                                            gap:
                                                                "10px"
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "22px"
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


                                                        <div
                                                            style={{
                                                                flex:
                                                                    1
                                                            }}
                                                        >

                                                            <strong>
                                                                {
                                                                    notification.productName ||
                                                                    "Product"
                                                                }
                                                            </strong>


                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "4px 0",
                                                                    fontSize:
                                                                        "13px"
                                                                }}
                                                            >
                                                                {
                                                                    notification.message
                                                                }
                                                            </p>


                                                            <small
                                                                style={{
                                                                    color:
                                                                        "#888"
                                                                }}
                                                            >
                                                                {
                                                                    notification.createdAt
                                                                        ? new Date(
                                                                            notification.createdAt
                                                                        ).toLocaleString()
                                                                        : ""
                                                                }
                                                            </small>

                                                        </div>


                                                        {!notification.read && (

                                                            <span
                                                                style={{
                                                                    width:
                                                                        "8px",
                                                                    height:
                                                                        "8px",
                                                                    background:
                                                                        "#ef4444",
                                                                    borderRadius:
                                                                        "50%",
                                                                    marginTop:
                                                                        "5px",
                                                                    flexShrink:
                                                                        0
                                                                }}
                                                            />

                                                        )}

                                                    </div>

                                                </div>

                                            )
                                        )

                                    )}

                                </div>

                            )}

                        </div>


                        {/* CART */}

                        <button
                            className="top-cart"
                            onClick={() =>
                                setActiveMenu(
                                    "cart"
                                )
                            }
                        >

                            🛒

                            {cart.length > 0 && (
                                <span>
                                    {cart.length}
                                </span>
                            )}

                        </button>


                        {/* AVATAR */}

                        <div className="top-avatar">

                            {sellerName
                                .charAt(0)
                                .toUpperCase()}

                        </div>

                    </div>

                </header>


                {/* =================================================
                    DASHBOARD
                ================================================= */}

                {activeMenu ===
                    "dashboard" && (

                    <>

                        <section className="hero-banner">

                            <div>

                                <span>
                                    ✨ Seller Hub
                                </span>

                                <h2>
                                    Grow your business
                                    with DeluLu Cart
                                </h2>

                                <p>
                                    Manage products,
                                    explore the marketplace,
                                    and build your brand.
                                </p>

                                <button
                                    onClick={
                                        openAddProduct
                                    }
                                >
                                    + Add New Product
                                </button>

                            </div>


                            <div className="hero-art">
                                🛍️ 📦 ✨
                            </div>

                        </section>


                        <section className="stats-grid">

                            <div className="stat-card">

                                <span>
                                    📦
                                </span>

                                <div>

                                    <p>
                                        My Products
                                    </p>

                                    <h2>
                                        {totalProducts}
                                    </h2>

                                </div>

                            </div>


                            <div className="stat-card">

                                <span>
                                    📊
                                </span>

                                <div>

                                    <p>
                                        Available Stock
                                    </p>

                                    <h2>
                                        {totalStock}
                                    </h2>

                                </div>

                            </div>


                            <div className="stat-card">

                                <span>
                                    🚚
                                </span>

                                <div>

                                    <p>
                                        My Orders
                                    </p>

                                    <h2>
                                        {orders.length}
                                    </h2>

                                </div>

                            </div>


                            <div className="stat-card">

                                <span>
                                    🔔
                                </span>

                                <div>

                                    <p>
                                        Unread Notifications
                                    </p>

                                    <h2>
                                        {unreadNotifications}
                                    </h2>

                                </div>

                            </div>

                        </section>

                    </>

                )}


                {/* =================================================
                    MY PRODUCTS
                ================================================= */}

                {activeMenu ===
                    "products" && (

                    <ProductSection
                        title="My Products"
                        products={
                            myProducts
                        }
                        sellerId={
                            sellerId
                        }
                        loading={
                            loadingProducts
                        }
                        onRefresh={
                            loadSellerProducts
                        }
                        onAdd={
                            openAddProduct
                        }
                        onEdit={
                            openEditProduct
                        }
                        onDelete={
                            handleDeleteProduct
                        }
                        onStatusChange={
                            handleStatusChange
                        }
                        onView={
                            setViewProduct
                        }
                        onWishlist={
                            toggleWishlist
                        }
                        wishlist={
                            wishlist
                        }
                        onCart={
                            addToCart
                        }
                        onBuy={
                            buyNow
                        }
                        search={
                            search
                        }
                        setSearch={
                            setSearch
                        }
                        selectedCategory={
                            selectedCategory
                        }
                        setSelectedCategory={
                            setSelectedCategory
                        }
                        categories={
                            categories
                        }
                    />

                )}


                {/* =================================================
                    SHOP
                ================================================= */}

                {activeMenu ===
                    "shop" && (

                    <ProductSection
                        title="Explore Products"
                        products={
                            filteredProducts
                        }
                        sellerId={
                            sellerId
                        }
                        loading={
                            loadingProducts
                        }
                        onRefresh={
                            loadSellerProducts
                        }
                        onAdd={
                            openAddProduct
                        }
                        onEdit={
                            openEditProduct
                        }
                        onDelete={
                            handleDeleteProduct
                        }
                        onStatusChange={
                            handleStatusChange
                        }
                        onView={
                            setViewProduct
                        }
                        onWishlist={
                            toggleWishlist
                        }
                        wishlist={
                            wishlist
                        }
                        onCart={
                            addToCart
                        }
                        onBuy={
                            buyNow
                        }
                        search={
                            search
                        }
                        setSearch={
                            setSearch
                        }
                        selectedCategory={
                            selectedCategory
                        }
                        setSelectedCategory={
                            setSelectedCategory
                        }
                        categories={
                            categories
                        }
                    />

                )}


                {/* =================================================
                    ORDERS
                ================================================= */}

                {activeMenu ===
                    "orders" && (

                    <section className="content-section">

                        <div className="section-title">

                            <div>

                                <span>
                                    Shopping
                                </span>

                                <h2>
                                    My Orders
                                </h2>

                            </div>

                        </div>


                        {orders.length === 0 ? (

                            <div className="empty-state">

                                <div>
                                    📦
                                </div>

                                <h3>
                                    No orders yet
                                </h3>

                                <p>
                                    Start shopping
                                    products from
                                    other sellers.
                                </p>

                            </div>

                        ) : (

                            <div className="orders-list">

                                {orders.map(
                                    (order) => (

                                        <div
                                            className="order-card"
                                            key={
                                                order.id
                                            }
                                        >

                                            <img
                                                src={
                                                    getProductImage(
                                                        order.product
                                                    )
                                                }
                                                alt={
                                                    order.product
                                                        ?.name
                                                }
                                            />


                                            <div>

                                                <h3>
                                                    {
                                                        order.product
                                                            ?.name
                                                    }
                                                </h3>

                                                <small>
                                                    Ordered on:
                                                    {" "}
                                                    {
                                                        order.date
                                                    }
                                                </small>

                                            </div>


                                            <strong>
                                                ₹
                                                {Number(
                                                    order.total
                                                ).toFixed(
                                                    2
                                                )}
                                            </strong>


                                            <span className="order-status">
                                                {
                                                    order.status
                                                }
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </section>

                )}


                {/* =================================================
                    WISHLIST
                ================================================= */}

                {activeMenu ===
                    "wishlist" && (

                    <section className="content-section">

                        <div className="section-title">

                            <div>

                                <span>
                                    Your Favorites
                                </span>

                                <h2>
                                    Wishlist ❤️
                                </h2>

                            </div>

                        </div>


                        {wishlist.length === 0 ? (

                            <div className="empty-state">

                                <div>
                                    ❤️
                                </div>

                                <h3>
                                    Your wishlist is empty
                                </h3>

                                <p>
                                    Save products you love.
                                </p>

                            </div>

                        ) : (

                            <div className="product-grid">

                                {wishlist.map(
                                    (product) => (

                                        <ProductCard
                                            key={
                                                product.id
                                            }
                                            product={
                                                product
                                            }
                                            sellerId={
                                                sellerId
                                            }
                                            onView={
                                                setViewProduct
                                            }
                                            onWishlist={
                                                toggleWishlist
                                            }
                                            wishlist={
                                                wishlist
                                            }
                                            onCart={
                                                addToCart
                                            }
                                            onBuy={
                                                buyNow
                                            }
                                            onEdit={
                                                openEditProduct
                                            }
                                            onDelete={
                                                handleDeleteProduct
                                            }
                                            onStatusChange={
                                                handleStatusChange
                                            }
                                        />

                                    )
                                )}

                            </div>

                        )}

                    </section>

                )}


                {/* =================================================
                    CART
                ================================================= */}

                {activeMenu ===
                    "cart" && (

                    <section className="content-section">

                        <div className="section-title">

                            <div>

                                <span>
                                    Ready to checkout
                                </span>

                                <h2>
                                    My Cart 🛒
                                </h2>

                            </div>

                        </div>


                        {cart.length === 0 ? (

                            <div className="empty-state">

                                <div>
                                    🛒
                                </div>

                                <h3>
                                    Your cart is empty
                                </h3>

                                <p>
                                    Explore products
                                    from other sellers.
                                </p>

                            </div>

                        ) : (

                            <div className="cart-list">

                                {cart.map(
                                    (product) => (

                                        <div
                                            className="cart-item"
                                            key={
                                                product.id
                                            }
                                        >

                                            <img
                                                src={
                                                    getProductImage(
                                                        product
                                                    )
                                                }
                                                alt={
                                                    product.name
                                                }
                                            />


                                            <div>

                                                <h3>
                                                    {
                                                        product.name
                                                    }
                                                </h3>

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        product.price
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </strong>

                                            </div>


                                            <button
                                                onClick={() =>
                                                    buyNow(
                                                        product
                                                    )
                                                }
                                            >
                                                Buy Now
                                            </button>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </section>

                )}

            </main>


            {/* =================================================
                ADD / EDIT PRODUCT MODAL
            ================================================= */}

            {showProductModal && (

                <div className="modal-overlay">

                    <div className="product-modal">

                        <button
                            className="modal-close"
                            type="button"
                            onClick={
                                closeProductModal
                            }
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


                        <form
                            onSubmit={
                                handleProductSubmit
                            }
                        >

                            <input
                                name="name"
                                placeholder="Product Name"
                                value={
                                    productForm.name
                                }
                                onChange={
                                    handleFormChange
                                }
                                required
                            />


                            <select
                                name="category"
                                value={
                                    productForm.category
                                }
                                onChange={
                                    handleFormChange
                                }
                            >

                                {categories
                                    .filter(
                                        (category) =>
                                            category !==
                                            "All"
                                    )
                                    .map(
                                        (category) => (

                                            <option
                                                key={
                                                    category
                                                }
                                                value={
                                                    category
                                                }
                                            >
                                                {
                                                    category
                                                }
                                            </option>

                                        )
                                    )}

                            </select>


                            <input
                                type="number"
                                name="price"
                                placeholder="Price"
                                value={
                                    productForm.price
                                }
                                onChange={
                                    handleFormChange
                                }
                                min="0"
                                step="0.01"
                                required
                            />


                            <input
                                type="number"
                                name="stock"
                                placeholder="Stock Quantity"
                                value={
                                    productForm.stock
                                }
                                onChange={
                                    handleFormChange
                                }
                                min="0"
                                required
                            />


                            <input
                                type="url"
                                name="image"
                                placeholder="Product Image URL"
                                value={
                                    productForm.image
                                }
                                onChange={
                                    handleFormChange
                                }
                            />


                            <textarea
                                name="description"
                                placeholder="Product Description"
                                value={
                                    productForm.description
                                }
                                onChange={
                                    handleFormChange
                                }
                            />


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    onClick={
                                        closeProductModal
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                >
                                    {editingProduct
                                        ? "Update Product"
                                        : "Add Product"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =================================================
                VIEW PRODUCT MODAL
            ================================================= */}

            {viewProduct && (

                <div className="modal-overlay">

                    <div className="view-modal">

                        <button
                            className="modal-close"
                            type="button"
                            onClick={() =>
                                setViewProduct(
                                    null
                                )
                            }
                        >
                            ×
                        </button>


                        <img
                            src={
                                getProductImage(
                                    viewProduct
                                )
                            }
                            alt={
                                viewProduct.name
                            }
                        />


                        <div>

                            <span>
                                {
                                    viewProduct.category
                                }
                            </span>


                            <h2>
                                {
                                    viewProduct.name
                                }
                            </h2>


                            <p>
                                {
                                    viewProduct.description
                                }
                            </p>


                            <h3>
                                ₹
                                {Number(
                                    viewProduct.price
                                ).toFixed(
                                    2
                                )}
                            </h3>


                            <p>
                                Stock:
                                {" "}
                                {
                                    viewProduct.stock ??
                                    0
                                }
                            </p>


                            <p>
                                Status:
                                {" "}
                                {
                                    viewProduct.status ||
                                    "ACTIVE"
                                }
                            </p>


                            {String(
                                viewProduct.sellerId
                            ).trim() !==
                                String(
                                    sellerId
                                ).trim() && (

                                <div className="view-actions">

                                    <button
                                        onClick={() =>
                                            addToCart(
                                                viewProduct
                                            )
                                        }
                                    >
                                        🛒 Add to Cart
                                    </button>


                                    <button
                                        onClick={() =>
                                            buyNow(
                                                viewProduct
                                            )
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


            {/* =================================================
                TOAST
            ================================================= */}

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
        product.images.length > 0
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

                    <span>
                        DeluLu Marketplace
                    </span>

                    <h2>
                        {title}
                    </h2>

                </div>


                <div>

                    <button
                        className="add-product-button"
                        onClick={
                            onAdd
                        }
                    >
                        + Add Product
                    </button>


                    <button
                        className="add-product-button"
                        onClick={
                            onRefresh
                        }
                        disabled={
                            loading
                        }
                        style={{
                            marginLeft:
                                "10px"
                        }}
                    >
                        {loading
                            ? "Refreshing..."
                            : "↻ Refresh"}
                    </button>

                </div>

            </div>


            {/* SEARCH */}

            <div className="product-toolbar">

                <div className="dashboard-search">

                    🔍

                    <input
                        placeholder="Search products..."
                        value={
                            search
                        }
                        onChange={
                            (event) =>
                                setSearch(
                                    event.target.value
                                )
                        }
                    />

                </div>


                <div className="category-filters">

                    {categories.map(
                        (category) => (

                            <button
                                key={
                                    category
                                }
                                className={
                                    selectedCategory ===
                                    category
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setSelectedCategory(
                                        category
                                    )
                                }
                            >
                                {category}
                            </button>

                        )
                    )}

                </div>

            </div>


            {/* PRODUCTS */}

            <div className="product-grid">

                {loading ? (

                    <div className="empty-state">

                        <div>
                            ⏳
                        </div>

                        <h3>
                            Loading products...
                        </h3>

                    </div>

                ) : products.length > 0 ? (

                    products.map(
                        (product) => (

                            <ProductCard
                                key={
                                    product.id
                                }
                                product={
                                    product
                                }
                                sellerId={
                                    sellerId
                                }
                                onView={
                                    onView
                                }
                                onWishlist={
                                    onWishlist
                                }
                                wishlist={
                                    wishlist
                                }
                                onCart={
                                    onCart
                                }
                                onBuy={
                                    onBuy
                                }
                                onEdit={
                                    onEdit
                                }
                                onDelete={
                                    onDelete
                                }
                                onStatusChange={
                                    onStatusChange
                                }
                            />

                        )
                    )

                ) : (

                    <div className="empty-state">

                        <div>
                            📦
                        </div>

                        <h3>
                            No products found
                        </h3>

                        <p>
                            Add your first product
                            to DeluLu Cart.
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
        String(
            product.sellerId
        ).trim() ===
        String(
            sellerId
        ).trim();


    const isWishlisted =
        wishlist.some(
            (item) =>
                item.id ===
                product.id
        );


    const isActive =
        product.status ===
            "ACTIVE" ||
        !product.status;


    const stock =
        Number(
            product.stock || 0
        );


    const isOutOfStock =
        stock <= 0;


    return (

        <article className="product-card">


            {/* IMAGE */}

            <div className="product-image-wrapper">

                <img
                    src={
                        getProductImage(
                            product
                        )
                    }
                    alt={
                        product.name ||
                        "Product"
                    }
                />


                <button
                    className={
                        isWishlisted
                            ? "wishlist active"
                            : "wishlist"
                    }
                    onClick={() =>
                        onWishlist(
                            product
                        )
                    }
                >
                    {isWishlisted
                        ? "♥"
                        : "♡"}
                </button>


                {isOwnProduct && (

                    <span className="own-product-badge">
                        Your Product
                    </span>

                )}

            </div>


            {/* INFO */}

            <div className="product-info">

                <span className="product-category">

                    {
                        product.category ||
                        "Uncategorized"
                    }

                </span>


                <h3>

                    {
                        product.name ||
                        "Unnamed Product"
                    }

                </h3>


                <p className="seller-name">

                    Sold by:

                    {" "}

                    <strong>

                        {isOwnProduct
                            ? "You"
                            : (
                                product.sellerName ||
                                "Seller"
                            )}

                    </strong>

                </p>


                <p>

                    {
                        product.description ||
                        "No description available."
                    }

                </p>


                <div className="product-price-row">

                    <strong>

                        ₹
                        {Number(
                            product.price ||
                            0
                        ).toFixed(2)}

                    </strong>


                    <span>

                        Stock:
                        {" "}
                        {stock}

                    </span>

                </div>


                {/* STOCK WARNING */}

                {isOwnProduct &&
                    stock > 0 &&
                    stock <= 5 && (

                    <div
                        style={{
                            color:
                                "#d97706",
                            fontSize:
                                "13px",
                            fontWeight:
                                "600",
                            marginTop:
                                "6px"
                        }}
                    >
                        ⚠️ Low stock
                    </div>

                )}


                {isOwnProduct &&
                    isOutOfStock && (

                    <div
                        style={{
                            color:
                                "#dc2626",
                            fontSize:
                                "13px",
                            fontWeight:
                                "600",
                            marginTop:
                                "6px"
                        }}
                    >
                        🚨 Out of stock
                    </div>

                )}


                {/* STATUS */}

                <div className="product-status-row">

                    <span>
                        Status:
                    </span>


                    <strong>

                        {
                            isOutOfStock
                                ? "INACTIVE"
                                : (
                                    product.status ||
                                    "ACTIVE"
                                )
                        }

                    </strong>

                </div>


                {/* ACTIONS */}

                <div className="product-actions">


                    <button
                        className="view-button"
                        onClick={() =>
                            onView(
                                product
                            )
                        }
                    >
                        👁 View
                    </button>


                    {isOwnProduct ? (

                        <>

                            {/* EDIT */}

                            <button
                                className="edit-button"
                                onClick={() =>
                                    onEdit(
                                        product
                                    )
                                }
                            >
                                ✏️ Edit
                            </button>


                            {/* ACTIVE / INACTIVE */}

                            <button
                                className="status-button"
                                disabled={
                                    isOutOfStock
                                }
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


                            {/* DELETE */}

                            <button
                                className="delete-button"
                                onClick={() =>
                                    onDelete(
                                        product.id
                                    )
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
                                    onCart(
                                        product
                                    )
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
                                    onBuy(
                                        product
                                    )
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