import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";

function CustomerDashboard() {

    const navigate = useNavigate();

    // =====================================================
    // API
    // =====================================================

    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:8080";


    // =====================================================
    // CUSTOMER DETAILS
    // =====================================================

    const storedEmail =
        localStorage.getItem("email") ||
        "customer@delulucart.com";

    const storedName =
        localStorage.getItem("firstName") ||
        localStorage.getItem("name") ||
        storedEmail.split("@")[0];

    const customerId =
        localStorage.getItem("customerId") ||
        localStorage.getItem("userId") ||
        localStorage.getItem("id");


    const [customerName, setCustomerName] =
        useState(
            storedName.charAt(0).toUpperCase() +
            storedName.slice(1)
        );

    const [customerEmail] =
        useState(storedEmail);


    // =====================================================
    // UI STATES
    // =====================================================

    const [activeSection, setActiveSection] =
        useState("home");

    const [search, setSearch] =
        useState("");

    const [selectedCategory, setSelectedCategory] =
        useState("All");

    const [showProfile, setShowProfile] =
        useState(false);

    const [showNotifications, setShowNotifications] =
        useState(false);

    const [showCart, setShowCart] =
        useState(false);

    const [selectedProduct, setSelectedProduct] =
        useState(null);

    const [showCheckout, setShowCheckout] =
        useState(false);

    const [showEditProfile, setShowEditProfile] =
        useState(false);


    // =====================================================
    // LOADING / ERROR STATES
    // =====================================================

    const [products, setProducts] =
        useState([]);

    const [productsLoading, setProductsLoading] =
        useState(true);

    const [ordersLoading, setOrdersLoading] =
        useState(false);

    const [placingOrder, setPlacingOrder] =
        useState(false);

    const [cancellingOrderId, setCancellingOrderId] =
        useState(null);

    const [errorMessage, setErrorMessage] =
        useState("");


    // =====================================================
    // SHIPPING ADDRESS
    // =====================================================

    const [shippingAddress, setShippingAddress] =
        useState(
            localStorage.getItem("shippingAddress") || ""
        );


    // =====================================================
    // CART
    // =====================================================

    const [cart, setCart] = useState(() => {

        const savedCart =
            localStorage.getItem("customerCart");

        try {

            return savedCart
                ? JSON.parse(savedCart)
                : [];

        } catch {

            return [];

        }

    });


    // =====================================================
    // WISHLIST
    // =====================================================

    const [wishlist, setWishlist] =
        useState(() => {

            const savedWishlist =
                localStorage.getItem(
                    "customerWishlist"
                );

            try {

                return savedWishlist
                    ? JSON.parse(savedWishlist)
                    : [];

            } catch {

                return [];

            }

        });


    // =====================================================
    // ORDERS
    // =====================================================

    const [orders, setOrders] =
        useState([]);


    // =====================================================
    // CATEGORIES
    // =====================================================

    const categories = [
        {
            name: "All",
            icon: "✨"
        },
        {
            name: "Fashion",
            icon: "👗"
        },
        {
            name: "Electronics",
            icon: "📱"
        },
        {
            name: "Home",
            icon: "🏠"
        }
    ];


    // =====================================================
    // FETCH PRODUCTS
    // =====================================================

    useEffect(() => {

        fetchProducts();

    }, []);


    const fetchProducts = async () => {

        try {

            setProductsLoading(true);
            setErrorMessage("");

            const response =
                await fetch(
                    `${API_BASE_URL}/api/products`
                );

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch products."
                );

            }

            const data =
                await response.json();

            /*
             * Backend Product fields are converted
             * into the structure used by this dashboard.
             */

            const formattedProducts =
                Array.isArray(data)
                    ? data.map((product) => ({

                        id:
                            product.id ??
                            product._id,

                        name:
                            product.name,

                        category:
                            product.categoryName ??
                            product.category ??
                            "General",

                        price:
                            Number(
                                product.price || 0
                            ),

                        rating:
                            Number(
                                product.rating || 4.5
                            ),

                        reviews:
                            Number(
                                product.reviews || 0
                            ),

                        image:
                            product.image ||
                            product.imageUrl ||
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",

                        description:
                            product.description ||
                            "Quality product from DeluLu Cart.",

                        seller:
                            product.sellerName ||
                            product.seller ||
                            "DeluLu Seller",

                        sellerId:
                            product.sellerId,

                        stock:
                            product.stock ?? 0

                    }))
                    : [];


            setProducts(
                formattedProducts
            );

        } catch (error) {

            console.error(
                "Product fetch error:",
                error
            );

            setErrorMessage(
                "Unable to load products from server."
            );

        } finally {

            setProductsLoading(false);

        }

    };


    // =====================================================
    // FETCH CUSTOMER ORDERS
    // =====================================================

    useEffect(() => {

        if (customerId) {

            fetchCustomerOrders();

        }

    }, [customerId]);


    const fetchCustomerOrders = async () => {

        try {

            setOrdersLoading(true);
            setErrorMessage("");

            const response =
                await fetch(
                    `${API_BASE_URL}/api/orders/customer/${customerId}`
                );

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch customer orders."
                );

            }

            const data =
                await response.json();

            setOrders(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Order fetch error:",
                error
            );

            setErrorMessage(
                "Unable to load your orders."
            );

        } finally {

            setOrdersLoading(false);

        }

    };


    // =====================================================
    // SAVE CART
    // =====================================================

    useEffect(() => {

        localStorage.setItem(
            "customerCart",
            JSON.stringify(cart)
        );

    }, [cart]);


    // =====================================================
    // SAVE WISHLIST
    // =====================================================

    useEffect(() => {

        localStorage.setItem(
            "customerWishlist",
            JSON.stringify(wishlist)
        );

    }, [wishlist]);


    // =====================================================
    // SAVE SHIPPING ADDRESS
    // =====================================================

    useEffect(() => {

        localStorage.setItem(
            "shippingAddress",
            shippingAddress
        );

    }, [shippingAddress]);


    // =====================================================
    // FILTER PRODUCTS
    // =====================================================

    const filteredProducts = useMemo(() => {

        return products.filter((product) => {

            const productName =
                product.name || "";

            const productCategory =
                product.category || "";

            const matchesSearch =
                productName
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesCategory =
                selectedCategory === "All" ||
                productCategory ===
                selectedCategory;

            return (
                matchesSearch &&
                matchesCategory
            );

        });

    }, [
        products,
        search,
        selectedCategory
    ]);


    // =====================================================
    // CART COUNT
    // =====================================================

    const cartCount = cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );


    // =====================================================
    // CART TOTAL
    // =====================================================

    const cartTotal = cart.reduce(
        (total, item) =>
            total +
            Number(item.price || 0) *
            Number(item.quantity || 0),
        0
    );


    // =====================================================
    // ADD TO CART
    // =====================================================

    const addToCart = (product) => {

        if (!product.id) {

            alert(
                "Product ID is missing."
            );

            return;

        }


        if (
            product.stock !== undefined &&
            Number(product.stock) <= 0
        ) {

            alert(
                "This product is currently out of stock."
            );

            return;

        }


        setCart((previousCart) => {

            const existingProduct =
                previousCart.find(
                    (item) =>
                        item.id === product.id
                );


            if (existingProduct) {

                if (
                    product.stock &&
                    existingProduct.quantity >=
                    Number(product.stock)
                ) {

                    alert(
                        "You cannot add more than available stock."
                    );

                    return previousCart;

                }


                return previousCart.map(
                    (item) =>
                        item.id === product.id
                            ? {
                                ...item,
                                quantity:
                                    item.quantity + 1
                            }
                            : item
                );

            }


            return [
                ...previousCart,
                {
                    ...product,
                    quantity: 1
                }
            ];

        });

    };


    // =====================================================
    // UPDATE CART QUANTITY
    // =====================================================

    const updateQuantity = (
        productId,
        change
    ) => {

        setCart((previousCart) => {

            return previousCart
                .map((item) => {

                    if (
                        item.id === productId
                    ) {

                        const newQuantity =
                            item.quantity +
                            change;


                        if (
                            newQuantity <= 0
                        ) {

                            return {
                                ...item,
                                quantity: 0
                            };

                        }


                        if (
                            item.stock &&
                            newQuantity >
                            Number(item.stock)
                        ) {

                            alert(
                                "Maximum available stock reached."
                            );

                            return item;

                        }


                        return {
                            ...item,
                            quantity:
                                newQuantity
                        };

                    }

                    return item;

                })
                .filter(
                    (item) =>
                        item.quantity > 0
                );

        });

    };


    // =====================================================
    // REMOVE CART ITEM
    // =====================================================

    const removeFromCart = (
        productId
    ) => {

        setCart(
            (previousCart) =>
                previousCart.filter(
                    (item) =>
                        item.id !== productId
                )
        );

    };


    // =====================================================
    // WISHLIST
    // =====================================================

    const toggleWishlist = (
        product
    ) => {

        setWishlist(
            (previousWishlist) => {

                const exists =
                    previousWishlist.some(
                        (item) =>
                            item.id === product.id
                    );


                if (exists) {

                    return previousWishlist.filter(
                        (item) =>
                            item.id !==
                            product.id
                    );

                }


                return [
                    ...previousWishlist,
                    product
                ];

            }
        );

    };


    // =====================================================
    // CHECKOUT
    // =====================================================

    const handleCheckout = () => {

        if (cart.length === 0) {

            alert(
                "Your cart is empty!"
            );

            return;

        }


        if (!customerId) {

            alert(
                "Customer information not found. Please login again."
            );

            navigate("/login");

            return;

        }


        setShowCheckout(true);

    };


    // =====================================================
    // PLACE ORDER
    // =====================================================

    const placeOrder = async () => {

        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;

        }


        if (!customerId) {

            alert(
                "Customer ID not found. Please login again."
            );

            navigate("/login");

            return;

        }


        if (
            !shippingAddress.trim()
        ) {

            alert(
                "Please enter your shipping address."
            );

            return;

        }


        try {

            setPlacingOrder(true);
            setErrorMessage("");


            // =================================================
            // CREATE BACKEND ORDER
            // =================================================

            const orderPayload = {

                customerId:

                    customerId,

                items:

                    cart.map(
                        (item) => ({

                            productId:
                                String(
                                    item.id
                                ),

                            quantity:
                                Number(
                                    item.quantity
                                )

                        })
                    ),

                shippingAddress:
                    shippingAddress.trim()

            };


            console.log(
                "Order Payload:",
                orderPayload
            );


            const response =
                await fetch(
                    `${API_BASE_URL}/api/orders`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                orderPayload
                            )

                    }
                );


            const responseText =
                await response.text();


            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Failed to place order."
                );

            }


            const savedOrder =
                responseText
                    ? JSON.parse(
                        responseText
                    )
                    : null;


            console.log(
                "Order Created:",
                savedOrder
            );


            // =================================================
            // CLEAR CART
            // =================================================

            setCart([]);


            // =================================================
            // CLOSE MODALS
            // =================================================

            setShowCheckout(
                false
            );

            setShowCart(
                false
            );


            // =================================================
            // GO TO ORDERS
            // =================================================

            setActiveSection(
                "orders"
            );


            // =================================================
            // REFRESH ORDERS FROM MONGODB
            // =================================================

            await fetchCustomerOrders();


            alert(
                "Order placed successfully! 🎉"
            );


        } catch (error) {

            console.error(
                "Place order error:",
                error
            );

            setErrorMessage(
                error.message ||
                "Unable to place order."
            );


            alert(
                "Failed to place order. Please try again."
            );

        } finally {

            setPlacingOrder(false);

        }

    };


    // =====================================================
    // CANCEL ORDER
    // =====================================================

    const cancelOrder = async (
        orderId
    ) => {

        if (!orderId) {

            return;

        }


        const confirmCancel =
            window.confirm(
                "Are you sure you want to cancel this order?"
            );


        if (!confirmCancel) {

            return;

        }


        try {

            setCancellingOrderId(
                orderId
            );

            setErrorMessage("");


            const response =
                await fetch(
                    `${API_BASE_URL}/api/orders/${orderId}/cancel`,
                    {

                        method: "PATCH"

                    }
                );


            const responseText =
                await response.text();


            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Unable to cancel order."
                );

            }


            const cancelledOrder =
                responseText
                    ? JSON.parse(
                        responseText
                    )
                    : null;


            // Update order directly
            if (cancelledOrder) {

                setOrders(
                    (previousOrders) =>
                        previousOrders.map(
                            (order) =>
                                order.id ===
                                cancelledOrder.id
                                    ? cancelledOrder
                                    : order
                        )
                );

            } else {

                await fetchCustomerOrders();

            }


            alert(
                "Order cancelled successfully."
            );


        } catch (error) {

            console.error(
                "Cancel order error:",
                error
            );


            alert(
                error.message ||
                "Unable to cancel order."
            );

        } finally {

            setCancellingOrderId(
                null
            );

        }

    };


    // =====================================================
    // REORDER
    // =====================================================

    const reorder = (
        order
    ) => {

        if (
            !order ||
            !order.items
        ) {

            return;

        }


        order.items.forEach(
            (orderItem) => {

                const product =
                    products.find(
                        (item) =>
                            String(
                                item.id
                            ) ===
                            String(
                                orderItem.productId
                            )
                    );


                if (product) {

                    const reorderProduct = {

                        ...product,

                        quantity:
                            Number(
                                orderItem.quantity
                            )

                    };


                    setCart(
                        (previousCart) => {

                            const existing =
                                previousCart.find(
                                    (item) =>
                                        String(
                                            item.id
                                        ) ===
                                        String(
                                            reorderProduct.id
                                        )
                                );


                            if (existing) {

                                return previousCart.map(
                                    (item) =>
                                        String(
                                            item.id
                                        ) ===
                                        String(
                                            reorderProduct.id
                                        )
                                            ? {
                                                ...item,
                                                quantity:
                                                    item.quantity +
                                                    reorderProduct.quantity
                                            }
                                            : item
                                );

                            }


                            return [
                                ...previousCart,
                                reorderProduct
                            ];

                        }
                    );

                }

            }
        );


        setShowCart(true);

    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "role"
        );

        localStorage.removeItem(
            "email"
        );

        localStorage.removeItem(
            "firstName"
        );

        localStorage.removeItem(
            "customerId"
        );

        localStorage.removeItem(
            "userId"
        );

        localStorage.removeItem(
            "id"
        );

        navigate("/login");

    };


    // =====================================================
    // NAVIGATION
    // =====================================================

    const goToSection = (
        section
    ) => {

        setActiveSection(
            section
        );

        setShowProfile(false);

        setShowNotifications(false);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        if (
            section === "orders" &&
            customerId
        ) {

            fetchCustomerOrders();

        }

    };


    // =====================================================
    // ORDER DATE
    // =====================================================

    const formatOrderDate = (
        order
    ) => {

        if (
            order.createdAt
        ) {

            return new Date(
                order.createdAt
            ).toLocaleString();

        }


        return "Recently";

    };


    // =====================================================
    // ORDER TOTAL
    // =====================================================

    const getOrderTotal = (
        order
    ) => {

        return Number(
            order.totalAmount || 0
        );

    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (
        status
    ) => {

        if (!status) {

            return "";

        }


        return status
            .toLowerCase()
            .replaceAll(
                "_",
                "-"
            );

    };


    // =====================================================
    // CAN CANCEL
    // =====================================================

    const canCancelOrder = (
        status
    ) => {

        return (
            status &&
            status !== "DELIVERED" &&
            status !== "CANCELLED"
        );

    };


    return (

        <div className="customer-dashboard">

            {/* =================================================
                TOP NAVBAR
            ================================================= */}

            <header className="customer-navbar">

                <div
                    className="brand"
                    onClick={() =>
                        goToSection("home")
                    }
                >

                    <div className="brand-icon">
                        🛍️
                    </div>

                    <div>

                        <strong>
                            DeluLu
                        </strong>

                        <span>
                            Cart
                        </span>

                    </div>

                </div>


                {/* SEARCH */}

                <div className="search-box">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                {/* NAV ACTIONS */}

                <div className="nav-actions">

                    <button
                        className="nav-icon-button"
                        onClick={() =>
                            setShowNotifications(
                                !showNotifications
                            )
                        }
                    >
                        🔔
                    </button>


                    <button
                        className="nav-icon-button cart-nav-button"
                        onClick={() =>
                            setShowCart(true)
                        }
                    >

                        🛒

                        {cartCount > 0 && (

                            <span className="cart-count">
                                {cartCount}
                            </span>

                        )}

                    </button>


                    <button
                        className="profile-mini"
                        onClick={() =>
                            setShowProfile(
                                !showProfile
                            )
                        }
                    >

                        <div className="avatar">

                            {customerName
                                .charAt(0)
                                .toUpperCase()}

                        </div>

                        <span>
                            {customerName}
                        </span>

                    </button>

                </div>


                {/* NOTIFICATIONS */}

                {showNotifications && (

                    <div className="notification-panel">

                        <h3>
                            Notifications
                        </h3>

                        <div className="notification-item">
                            🎉 Welcome to DeluLu Cart!
                        </div>

                        <div className="notification-item">
                            🚚 Track your orders easily.
                        </div>

                        <div className="notification-item">
                            💜 Discover amazing products today.
                        </div>

                    </div>

                )}

            </header>


            {/* =================================================
                PROFILE SIDEBAR
            ================================================= */}

            {showProfile && (

                <>

                    <div
                        className="profile-overlay"
                        onClick={() =>
                            setShowProfile(false)
                        }
                    />

                    <aside className="profile-sidebar">

                        <button
                            className="close-sidebar"
                            onClick={() =>
                                setShowProfile(false)
                            }
                        >
                            ×
                        </button>


                        <div className="profile-avatar-large">

                            {customerName
                                .charAt(0)
                                .toUpperCase()}

                        </div>


                        <h2>
                            {customerName}
                        </h2>

                        <p>
                            {customerEmail}
                        </p>


                        <div className="profile-status">

                            <span>
                                ●
                            </span>

                            Active Customer

                        </div>


                        <div className="profile-menu">

                            <button
                                onClick={() =>
                                    goToSection(
                                        "home"
                                    )
                                }
                            >
                                🏠 Dashboard
                            </button>


                            <button
                                onClick={() =>
                                    goToSection(
                                        "orders"
                                    )
                                }
                            >
                                📦 My Orders
                            </button>


                            <button
                                onClick={() =>
                                    goToSection(
                                        "wishlist"
                                    )
                                }
                            >
                                ❤️ My Wishlist
                            </button>


                            <button
                                onClick={() =>
                                    setShowEditProfile(
                                        true
                                    )
                                }
                            >
                                ✏️ Edit Profile
                            </button>

                        </div>


                        <button
                            className="sidebar-logout"
                            onClick={
                                handleLogout
                            }
                        >
                            🚪 Logout
                        </button>

                    </aside>

                </>

            )}


            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {errorMessage && (

                <div className="dashboard-error">

                    ⚠️ {errorMessage}

                    <button
                        onClick={() =>
                            setErrorMessage("")
                        }
                    >
                        ×
                    </button>

                </div>

            )}


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="customer-main">

                {/* =================================================
                    HOME
                ================================================= */}

                {activeSection === "home" && (

                    <>

                        {/* HERO */}

                        <section className="customer-hero">

                            <div className="hero-content">

                                <span className="hero-badge">
                                    ✨ Welcome back,{" "}
                                    {customerName}
                                </span>

                                <h1>
                                    Shop Your
                                    <br />

                                    <span>
                                        Happy Place.
                                    </span>
                                </h1>

                                <p>
                                    Discover trending
                                    products, amazing
                                    deals and everything
                                    you love — all in one
                                    beautiful place.
                                </p>

                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                "products"
                                            )
                                            ?.scrollIntoView({
                                                behavior:
                                                    "smooth"
                                            })
                                    }
                                >
                                    Start Shopping →
                                </button>

                            </div>


                            <div className="hero-visual">

                                <div className="hero-glow"></div>

                                <img
                                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1000"
                                    alt="Shopping"
                                />

                                <div className="floating-card card-one">

                                    🛍️

                                    <span>
                                        Happy Shopping
                                    </span>

                                </div>


                                <div className="floating-card card-two">

                                    ⭐

                                    <span>
                                        Top Rated
                                    </span>

                                </div>

                            </div>

                        </section>


                        {/* STATS */}

                        <section className="customer-stats">

                            <div className="stat-card">

                                <span>
                                    🛒
                                </span>

                                <strong>
                                    {cartCount}
                                </strong>

                                <p>
                                    Cart Items
                                </p>

                            </div>


                            <div className="stat-card">

                                <span>
                                    ❤️
                                </span>

                                <strong>
                                    {wishlist.length}
                                </strong>

                                <p>
                                    Wishlist
                                </p>

                            </div>


                            <div className="stat-card">

                                <span>
                                    📦
                                </span>

                                <strong>
                                    {orders.length}
                                </strong>

                                <p>
                                    Orders
                                </p>

                            </div>


                            <div className="stat-card">

                                <span>
                                    🎁
                                </span>

                                <strong>
                                    12
                                </strong>

                                <p>
                                    Rewards
                                </p>

                            </div>

                        </section>


                        {/* CATEGORIES */}

                        <section className="category-section">

                            <div className="section-heading">

                                <span>
                                    Explore
                                </span>

                                <h2>
                                    Shop by Category
                                </h2>

                            </div>


                            <div className="category-list">

                                {categories.map(
                                    (category) => (

                                        <button
                                            key={
                                                category.name
                                            }
                                            className={
                                                selectedCategory ===
                                                category.name
                                                    ? "category-card active"
                                                    : "category-card"
                                            }
                                            onClick={() => {

                                                setSelectedCategory(
                                                    category.name
                                                );

                                                document
                                                    .getElementById(
                                                        "products"
                                                    )
                                                    ?.scrollIntoView({
                                                        behavior:
                                                            "smooth"
                                                    });

                                            }}
                                        >

                                            <span>
                                                {
                                                    category.icon
                                                }
                                            </span>

                                            {
                                                category.name
                                            }

                                        </button>

                                    )
                                )}

                            </div>

                        </section>


                        {/* PRODUCTS */}

                        <section
                            className="products-section"
                            id="products"
                        >

                            <div className="section-heading">

                                <span>
                                    Trending Now
                                </span>

                                <h2>
                                    Discover Products
                                </h2>

                            </div>


                            {productsLoading ? (

                                <div className="empty-dashboard">

                                    <div>
                                        ⏳
                                    </div>

                                    <h3>
                                        Loading products...
                                    </h3>

                                    <p>
                                        Please wait while we
                                        load the latest products.
                                    </p>

                                </div>

                            ) : (

                                <div className="product-grid">

                                    {filteredProducts.length >
                                    0 ? (

                                        filteredProducts.map(
                                            (product) => {

                                                const isWishlisted =
                                                    wishlist.some(
                                                        (item) =>
                                                            String(
                                                                item.id
                                                            ) ===
                                                            String(
                                                                product.id
                                                            )
                                                    );


                                                return (

                                                    <div
                                                        className="product-card"
                                                        key={
                                                            product.id
                                                        }
                                                    >

                                                        <div className="product-image-container">

                                                            <img
                                                                src={
                                                                    product.image
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="product-image"
                                                            />


                                                            <button
                                                                className={
                                                                    isWishlisted
                                                                        ? "wishlist-button wishlisted"
                                                                        : "wishlist-button"
                                                                }
                                                                onClick={() =>
                                                                    toggleWishlist(
                                                                        product
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    isWishlisted
                                                                        ? "♥"
                                                                        : "♡"
                                                                }
                                                            </button>

                                                        </div>


                                                        <div className="product-details">

                                                            <span className="product-category">
                                                                {
                                                                    product.category
                                                                }
                                                            </span>

                                                            <h3>
                                                                {
                                                                    product.name
                                                                }
                                                            </h3>


                                                            <p className="seller-name">

                                                                Sold by{" "}

                                                                {
                                                                    product.seller
                                                                }

                                                            </p>


                                                            <div className="rating">

                                                                ⭐
                                                                {
                                                                    product.rating
                                                                }

                                                                <span>
                                                                    (
                                                                    {
                                                                        product.reviews
                                                                    }
                                                                    )
                                                                </span>

                                                            </div>


                                                            <div className="product-bottom">

                                                                <strong>

                                                                    $
                                                                    {
                                                                        Number(
                                                                            product.price
                                                                        ).toFixed(
                                                                            2
                                                                        )
                                                                    }

                                                                </strong>


                                                                <div className="product-actions">

                                                                    <button
                                                                        className="view-button"
                                                                        onClick={() =>
                                                                            setSelectedProduct(
                                                                                product
                                                                            )
                                                                        }
                                                                    >
                                                                        👁️
                                                                    </button>


                                                                    <button
                                                                        className="add-cart-button"
                                                                        onClick={() =>
                                                                            addToCart(
                                                                                product
                                                                            )
                                                                        }
                                                                    >
                                                                        🛒
                                                                    </button>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>

                                                );

                                            }
                                        )

                                    ) : (

                                        <div className="empty-state">

                                            <div>
                                                🔍
                                            </div>

                                            <h3>
                                                No products found
                                            </h3>

                                            <p>
                                                Try another
                                                search or
                                                category.
                                            </p>

                                        </div>

                                    )}

                                </div>

                            )}

                        </section>

                    </>

                )}


                {/* =================================================
                    ORDERS
                ================================================= */}

                {activeSection === "orders" && (

                    <section className="dashboard-section">

                        <div className="section-heading">

                            <span>
                                Your Shopping Journey
                            </span>

                            <h2>
                                My Orders
                            </h2>

                        </div>


                        {ordersLoading ? (

                            <div className="empty-dashboard">

                                <div>
                                    ⏳
                                </div>

                                <h3>
                                    Loading orders...
                                </h3>

                            </div>

                        ) : orders.length === 0 ? (

                            <div className="empty-dashboard">

                                <div>
                                    📦
                                </div>

                                <h3>
                                    No orders yet
                                </h3>

                                <p>
                                    Your order history
                                    will appear here.
                                </p>

                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        goToSection(
                                            "home"
                                        )
                                    }
                                >
                                    Start Shopping
                                </button>

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

                                            {/* ORDER HEADER */}

                                            <div className="order-header">

                                                <div>

                                                    <strong>

                                                        Order #{" "}

                                                        {
                                                            order.id
                                                        }

                                                    </strong>

                                                    <p>
                                                        {
                                                            formatOrderDate(
                                                                order
                                                            )
                                                        }
                                                    </p>

                                                </div>


                                                <span
                                                    className={
                                                        `order-status ${getStatusClass(
                                                            order.status
                                                        )}`
                                                    }
                                                >
                                                    {
                                                        order.status
                                                    }
                                                </span>

                                            </div>


                                            {/* SHIPPING ADDRESS */}

                                            {order.shippingAddress && (

                                                <div className="order-address">

                                                    📍

                                                    <span>

                                                        {
                                                            order.shippingAddress
                                                        }

                                                    </span>

                                                </div>

                                            )}


                                            {/* ORDER ITEMS */}

                                            <div className="order-items">

                                                {order.items?.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (

                                                        <div
                                                            className="order-item"
                                                            key={
                                                                `${order.id}-${item.productId}-${index}`
                                                            }
                                                        >

                                                            <div className="order-product-image">

                                                                <span>
                                                                    🛍️
                                                                </span>

                                                            </div>


                                                            <div>

                                                                <strong>
                                                                    {
                                                                        item.productName
                                                                    }
                                                                </strong>

                                                                <p>
                                                                    Qty:{" "}
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </p>

                                                                <small>
                                                                    Price: $
                                                                    {
                                                                        Number(
                                                                            item.price || 0
                                                                        ).toFixed(
                                                                            2
                                                                        )
                                                                    }
                                                                </small>

                                                            </div>


                                                            <strong className="order-item-subtotal">

                                                                $
                                                                {
                                                                    Number(
                                                                        item.subtotal || 0
                                                                    ).toFixed(
                                                                        2
                                                                    )
                                                                }

                                                            </strong>

                                                        </div>

                                                    )
                                                )}

                                            </div>


                                            {/* ORDER FOOTER */}

                                            <div className="order-footer">

                                                <strong>

                                                    Total: $

                                                    {
                                                        getOrderTotal(
                                                            order
                                                        ).toFixed(
                                                            2
                                                        )
                                                    }

                                                </strong>


                                                <div className="order-actions">

                                                    <button
                                                        className="secondary-button"
                                                        onClick={() =>
                                                            reorder(
                                                                order
                                                            )
                                                        }
                                                    >
                                                        🔁 Reorder
                                                    </button>


                                                    {canCancelOrder(
                                                        order.status
                                                    ) && (

                                                        <button
                                                            className="cancel-order-button"
                                                            disabled={
                                                                cancellingOrderId ===
                                                                order.id
                                                            }
                                                            onClick={() =>
                                                                cancelOrder(
                                                                    order.id
                                                                )
                                                            }
                                                        >

                                                            {cancellingOrderId ===
                                                            order.id
                                                                ? "Cancelling..."
                                                                : "Cancel Order"}

                                                        </button>

                                                    )}

                                                </div>

                                            </div>

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

                {activeSection === "wishlist" && (

                    <section className="dashboard-section">

                        <div className="section-heading">

                            <span>
                                Saved For Later
                            </span>

                            <h2>
                                My Wishlist ❤️
                            </h2>

                        </div>


                        {wishlist.length === 0 ? (

                            <div className="empty-dashboard">

                                <div>
                                    💜
                                </div>

                                <h3>
                                    Your wishlist is empty
                                </h3>

                                <p>
                                    Save products you love
                                    and find them here.
                                </p>

                            </div>

                        ) : (

                            <div className="product-grid">

                                {wishlist.map(
                                    (product) => (

                                        <div
                                            className="product-card"
                                            key={
                                                product.id
                                            }
                                        >

                                            <div className="product-image-container">

                                                <img
                                                    src={
                                                        product.image
                                                    }
                                                    alt={
                                                        product.name
                                                    }
                                                    className="product-image"
                                                />


                                                <button
                                                    className="wishlist-button wishlisted"
                                                    onClick={() =>
                                                        toggleWishlist(
                                                            product
                                                        )
                                                    }
                                                >
                                                    ♥
                                                </button>

                                            </div>


                                            <div className="product-details">

                                                <span className="product-category">
                                                    {
                                                        product.category
                                                    }
                                                </span>

                                                <h3>
                                                    {
                                                        product.name
                                                    }
                                                </h3>


                                                <div className="product-bottom">

                                                    <strong>

                                                        $

                                                        {
                                                            Number(
                                                                product.price
                                                            ).toFixed(
                                                                2
                                                            )
                                                        }

                                                    </strong>


                                                    <button
                                                        className="add-cart-button"
                                                        onClick={() =>
                                                            addToCart(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        🛒
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </section>

                )}

            </main>


            {/* =================================================
                CART DRAWER
            ================================================= */}

            {showCart && (

                <>

                    <div
                        className="cart-overlay"
                        onClick={() =>
                            setShowCart(false)
                        }
                    />


                    <aside className="cart-drawer">

                        <div className="cart-header">

                            <h2>
                                🛒 Your Cart
                            </h2>

                            <button
                                onClick={() =>
                                    setShowCart(false)
                                }
                            >
                                ×
                            </button>

                        </div>


                        {cart.length === 0 ? (

                            <div className="empty-cart">

                                <div>
                                    🛒
                                </div>

                                <h3>
                                    Your cart is empty
                                </h3>

                                <p>
                                    Add something you love!
                                </p>

                            </div>

                        ) : (

                            <>

                                <div className="cart-items">

                                    {cart.map(
                                        (item) => (

                                            <div
                                                className="cart-item"
                                                key={
                                                    item.id
                                                }
                                            >

                                                <img
                                                    src={
                                                        item.image
                                                    }
                                                    alt={
                                                        item.name
                                                    }
                                                />


                                                <div className="cart-item-info">

                                                    <h4>
                                                        {
                                                            item.name
                                                        }
                                                    </h4>


                                                    <strong>

                                                        $

                                                        {
                                                            Number(
                                                                item.price
                                                            ).toFixed(
                                                                2
                                                            )
                                                        }

                                                    </strong>


                                                    <div className="quantity-controls">

                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    -1
                                                                )
                                                            }
                                                        >
                                                            −
                                                        </button>


                                                        <span>
                                                            {
                                                                item.quantity
                                                            }
                                                        </span>


                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    1
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </button>


                                                        <button
                                                            className="remove-item"
                                                            onClick={() =>
                                                                removeFromCart(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            🗑️
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>


                                <div className="cart-footer">

                                    <div className="cart-total">

                                        <span>
                                            Total
                                        </span>

                                        <strong>

                                            $

                                            {
                                                cartTotal.toFixed(
                                                    2
                                                )
                                            }

                                        </strong>

                                    </div>


                                    <button
                                        className="checkout-button"
                                        onClick={
                                            handleCheckout
                                        }
                                    >
                                        Proceed to Checkout →
                                    </button>

                                </div>

                            </>

                        )}

                    </aside>

                </>

            )}


            {/* =================================================
                PRODUCT DETAILS MODAL
            ================================================= */}

            {selectedProduct && (

                <div className="modal-overlay">

                    <div className="product-modal">

                        <button
                            className="modal-close"
                            onClick={() =>
                                setSelectedProduct(
                                    null
                                )
                            }
                        >
                            ×
                        </button>


                        <img
                            src={
                                selectedProduct.image
                            }
                            alt={
                                selectedProduct.name
                            }
                        />


                        <div className="modal-content">

                            <span>
                                {
                                    selectedProduct.category
                                }
                            </span>


                            <h2>
                                {
                                    selectedProduct.name
                                }
                            </h2>


                            <div className="rating">

                                ⭐
                                {
                                    selectedProduct.rating
                                }

                                <small>
                                    (
                                    {
                                        selectedProduct.reviews
                                    } reviews)
                                </small>

                            </div>


                            <p>
                                {
                                    selectedProduct.description
                                }
                            </p>


                            <h3>

                                $

                                {
                                    Number(
                                        selectedProduct.price
                                    ).toFixed(
                                        2
                                    )
                                }

                            </h3>


                            <button
                                className="primary-button full-button"
                                onClick={() => {

                                    addToCart(
                                        selectedProduct
                                    );

                                    setSelectedProduct(
                                        null
                                    );

                                }}
                            >
                                🛒 Add to Cart
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                CHECKOUT MODAL
            ================================================= */}

            {showCheckout && (

                <div className="modal-overlay">

                    <div className="checkout-modal">

                        <button
                            className="modal-close"
                            onClick={() =>
                                setShowCheckout(
                                    false
                                )
                            }
                        >
                            ×
                        </button>


                        <div className="checkout-icon">
                            💳
                        </div>


                        <h2>
                            Confirm Your Order
                        </h2>


                        <p>
                            Enter your shipping address
                            and confirm your order.
                        </p>


                        {/* SHIPPING ADDRESS */}

                        <div className="checkout-address">

                            <label>
                                Shipping Address
                            </label>

                            <textarea
                                value={
                                    shippingAddress
                                }
                                onChange={(event) =>
                                    setShippingAddress(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter your complete shipping address..."
                                rows="4"
                            />

                        </div>


                        <div className="checkout-summary">

                            <span>
                                Items
                            </span>

                            <strong>
                                {cartCount}
                            </strong>

                        </div>


                        <div className="checkout-summary">

                            <span>
                                Total Amount
                            </span>

                            <strong className="checkout-total">

                                $

                                {
                                    cartTotal.toFixed(
                                        2
                                    )
                                }

                            </strong>

                        </div>


                        <div className="checkout-actions">

                            <button
                                className="secondary-button"
                                disabled={
                                    placingOrder
                                }
                                onClick={() =>
                                    setShowCheckout(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </button>


                            <button
                                className="primary-button"
                                disabled={
                                    placingOrder
                                }
                                onClick={
                                    placeOrder
                                }
                            >

                                {placingOrder
                                    ? "Placing Order..."
                                    : "Confirm Order"}

                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                EDIT PROFILE MODAL
            ================================================= */}

            {showEditProfile && (

                <div className="modal-overlay">

                    <div className="profile-modal">

                        <button
                            className="modal-close"
                            onClick={() =>
                                setShowEditProfile(
                                    false
                                )
                            }
                        >
                            ×
                        </button>


                        <div className="profile-avatar-large">

                            {customerName
                                .charAt(0)
                                .toUpperCase()}

                        </div>


                        <h2>
                            Edit Profile
                        </h2>


                        <input
                            type="text"
                            value={customerName}
                            onChange={(event) =>
                                setCustomerName(
                                    event.target.value
                                )
                            }
                            placeholder="Your name"
                        />


                        <input
                            type="email"
                            value={customerEmail}
                            disabled
                        />


                        <button
                            className="primary-button full-button"
                            onClick={() => {

                                localStorage.setItem(
                                    "firstName",
                                    customerName
                                );

                                setShowEditProfile(
                                    false
                                );

                            }}
                        >
                            Save Profile
                        </button>

                    </div>

                </div>

            )}


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="customer-footer">

                <div className="footer-brand">
                    🛍️ DeluLu Cart
                </div>

                <p>
                    Your beautiful everyday shopping
                    destination.
                </p>

                <p>
                    © 2026 DeluLu Cart. All rights reserved.
                </p>

            </footer>

        </div>

    );

}

export default CustomerDashboard;