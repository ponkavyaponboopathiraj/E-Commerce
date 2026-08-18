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

    const [customerName, setCustomerName] = useState(
        storedName.charAt(0).toUpperCase() + storedName.slice(1)
    );

    const [customerEmail] = useState(storedEmail);

    // =====================================================
    // UI STATES
    // =====================================================

    const [activeSection, setActiveSection] = useState("home");
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showCart, setShowCart] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);

    // =====================================================
    // LOADING / ERROR STATES
    // =====================================================

    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const [placingOrder, setPlacingOrder] = useState(false);
    const [cancellingOrderId, setCancellingOrderId] = useState(null);

    const [errorMessage, setErrorMessage] = useState("");

    // =====================================================
    // SHIPPING ADDRESS
    // =====================================================

    const [shippingAddress, setShippingAddress] = useState(
        localStorage.getItem("shippingAddress") || ""
    );

    // =====================================================
    // CART
    // =====================================================

    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("customerCart");

        try {
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Cart parse error:", error);
            return [];
        }
    });

    // =====================================================
    // WISHLIST
    // =====================================================

    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist =
            localStorage.getItem("customerWishlist");

        try {
            return savedWishlist
                ? JSON.parse(savedWishlist)
                : [];
        } catch (error) {
            console.error("Wishlist parse error:", error);
            return [];
        }
    });

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
    // AUTH HEADER
    // =====================================================

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");

        return {
            "Content-Type": "application/json",
            ...(token
                ? {
                    Authorization: `Bearer ${token}`
                }
                : {})
        };
    };

    // =====================================================
    // HANDLE AUTH ERROR
    // =====================================================

    const handleUnauthorized = () => {
        localStorage.removeItem("token");

        setErrorMessage(
            "Your login session has expired. Please login again."
        );

        setTimeout(() => {
            navigate("/login");
        }, 1200);
    };

    // =====================================================
    // EXTRACT PRODUCT ARRAY
    // Handles:
    //
    // [
    //   {...},
    //   {...}
    // ]
    //
    // OR
    //
    // {
    //   products: [...]
    // }
    //
    // OR
    //
    // {
    //   data: [...]
    // }
    // =====================================================

    const extractProducts = (data) => {
        if (Array.isArray(data)) {
            return data;
        }

        if (Array.isArray(data?.products)) {
            return data.products;
        }

        if (Array.isArray(data?.data)) {
            return data.data;
        }

        if (Array.isArray(data?.content)) {
            return data.content;
        }

        return [];
    };

    // =====================================================
    // FORMAT PRODUCT
    // =====================================================

    const formatProduct = (product) => {
        const productId =
            product?.id ??
            product?._id ??
            product?.productId ??
            null;

        let productImage =
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";

        if (
            Array.isArray(product?.images) &&
            product.images.length > 0
        ) {
            productImage = product.images[0];
        } else if (product?.image) {
            productImage = product.image;
        } else if (product?.imageUrl) {
            productImage = product.imageUrl;
        }

        const productImages =
            Array.isArray(product?.images) &&
            product.images.length > 0
                ? product.images
                : [productImage];

        const productCategory =
            product?.categoryName ??
            product?.category?.name ??
            product?.category ??
            "General";

        const sellerName =
            product?.sellerName ??
            product?.seller?.name ??
            product?.seller?.firstName ??
            product?.sellerFirstName ??
            product?.seller ??
            "DeluLu Seller";

        const sellerId =
            product?.sellerId ??
            product?.seller?.id ??
            null;

        const productPrice = Number(
            product?.price ?? 0
        );

        const productStock = Number(
            product?.stock ??
            product?.quantity ??
            product?.availableStock ??
            0
        );

        const productRating = Number(
            product?.rating ?? 4.5
        );

        const productReviews = Number(
            product?.reviews ??
            product?.reviewCount ??
            0
        );

        return {
            id: productId,

            name:
                product?.name ??
                product?.productName ??
                "Unnamed Product",

            category: productCategory,

            price: productPrice,

            rating: productRating,

            reviews: productReviews,

            image: productImage,

            images: productImages,

            description:
                product?.description ??
                "Quality product from DeluLu Cart.",

            seller: sellerName,

            sellerId: sellerId,

            stock: productStock,

            status: product?.status ?? "ACTIVE",

            attributes:
                product?.attributes ?? {},

            brand:
                product?.brandName ??
                product?.brand ??
                "",

            originalProduct: product
        };
    };

    // =====================================================
    // FETCH PRODUCTS
    // =====================================================

    const fetchProducts = async () => {
        try {
            setProductsLoading(true);
            setErrorMessage("");

            const token = localStorage.getItem("token");

            console.log(
                "Fetching customer products..."
            );

            if (!token) {
                console.error(
                    "JWT token not found in localStorage"
                );

                setErrorMessage(
                    "Login session expired. Please login again."
                );

                setProductsLoading(false);

                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/api/products`,
                {
                    method: "GET",
                    headers: getAuthHeaders()
                }
            );

            console.log(
                "Product API status:",
                response.status
            );

            const responseText =
                await response.text();

            let data = null;

            try {
                data = responseText
                    ? JSON.parse(responseText)
                    : null;
            } catch {
                data = responseText;
            }

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                console.error(
                    "Product API unauthorized:",
                    data
                );

                handleUnauthorized();

                return;
            }

            if (!response.ok) {
                console.error(
                    "Product API Error:",
                    response.status,
                    data
                );

                throw new Error(
                    typeof data === "string"
                        ? data
                        : data?.message ||
                        "Failed to fetch products."
                );
            }

            console.log(
                "Products received from backend:",
                data
            );

            const backendProducts =
                extractProducts(data);

            console.log(
                "Backend product count:",
                backendProducts.length
            );

            const formattedProducts =
                backendProducts
                    .filter((product) => {
                        /*
                         * If backend provides status,
                         * show only ACTIVE products.
                         *
                         * If status is missing,
                         * show the product.
                         */

                        if (!product?.status) {
                            return true;
                        }

                        const status =
                            String(
                                product.status
                            ).toUpperCase();

                        return (
                            status === "ACTIVE" ||
                            status === "AVAILABLE" ||
                            status === "APPROVED"
                        );
                    })
                    .map(formatProduct)
                    .filter(
                        (product) =>
                            product.id !== null
                    );

            console.log(
                "Formatted customer products:",
                formattedProducts
            );

            setProducts(
                formattedProducts
            );

        } catch (error) {
            console.error(
                "Product fetch error:",
                error
            );

            setErrorMessage(
                error.message ||
                "Unable to load products from server."
            );
        } finally {
            setProductsLoading(false);
        }
    };

    // =====================================================
    // INITIAL PRODUCT LOAD
    // =====================================================

    useEffect(() => {
        fetchProducts();
    }, []);

    // =====================================================
    // REFRESH PRODUCTS WHEN CUSTOMER RETURNS TO HOME
    // This helps seller-added products appear.
    // =====================================================

    useEffect(() => {
        if (activeSection === "home") {
            fetchProducts();
        }
    }, [activeSection]);

    // =====================================================
    // FETCH CUSTOMER ORDERS
    // =====================================================

    const fetchCustomerOrders = async () => {
        if (!customerId) {
            return;
        }

        try {
            setOrdersLoading(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                handleUnauthorized();
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/api/orders/customer/${customerId}`,
                {
                    method: "GET",
                    headers: getAuthHeaders()
                }
            );

            const responseText =
                await response.text();

            let data = null;

            try {
                data = responseText
                    ? JSON.parse(responseText)
                    : null;
            } catch {
                data = responseText;
            }

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                handleUnauthorized();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    typeof data === "string"
                        ? data
                        : data?.message ||
                        "Failed to fetch customer orders."
                );
            }

            const orderList =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.orders)
                        ? data.orders
                        : Array.isArray(data?.data)
                            ? data.data
                            : [];

            setOrders(orderList);

        } catch (error) {
            console.error(
                "Order fetch error:",
                error
            );

            setErrorMessage(
                error.message ||
                "Unable to load your orders."
            );
        } finally {
            setOrdersLoading(false);
        }
    };

    // =====================================================
    // LOAD ORDERS
    // =====================================================

    useEffect(() => {
        if (customerId) {
            fetchCustomerOrders();
        }
    }, [customerId]);

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
        const searchValue =
            search.trim().toLowerCase();

        return products.filter((product) => {
            const productName =
                String(
                    product.name || ""
                ).toLowerCase();

            const productCategory =
                String(
                    product.category || ""
                ).toLowerCase();

            const productDescription =
                String(
                    product.description || ""
                ).toLowerCase();

            const productSeller =
                String(
                    product.seller || ""
                ).toLowerCase();

            const matchesSearch =
                !searchValue ||
                productName.includes(searchValue) ||
                productCategory.includes(searchValue) ||
                productDescription.includes(searchValue) ||
                productSeller.includes(searchValue);

            const matchesCategory =
                selectedCategory === "All" ||
                productCategory ===
                String(
                    selectedCategory
                ).toLowerCase();

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
            total +
            Number(item.quantity || 0),
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
        if (!product?.id) {
            alert(
                "Product ID is missing."
            );
            return;
        }

        if (
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
                        String(item.id) ===
                        String(product.id)
                );

            if (existingProduct) {
                const currentQuantity =
                    Number(
                        existingProduct.quantity || 0
                    );

                const stock =
                    Number(product.stock);

                if (
                    stock > 0 &&
                    currentQuantity >= stock
                ) {
                    alert(
                        "You cannot add more than available stock."
                    );

                    return previousCart;
                }

                return previousCart.map(
                    (item) =>
                        String(item.id) ===
                        String(product.id)
                            ? {
                                ...item,
                                quantity:
                                    currentQuantity + 1
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
                        String(item.id) !==
                        String(productId)
                    ) {
                        return item;
                    }

                    const currentQuantity =
                        Number(
                            item.quantity || 0
                        );

                    const newQuantity =
                        currentQuantity +
                        change;

                    if (newQuantity <= 0) {
                        return {
                            ...item,
                            quantity: 0
                        };
                    }

                    const stock =
                        Number(item.stock);

                    if (
                        stock > 0 &&
                        newQuantity > stock
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
                })
                .filter(
                    (item) =>
                        Number(item.quantity) > 0
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
                        String(item.id) !==
                        String(productId)
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
                            String(item.id) ===
                            String(product.id)
                    );

                if (exists) {
                    return previousWishlist.filter(
                        (item) =>
                            String(item.id) !==
                            String(product.id)
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

        if (!shippingAddress.trim()) {
            alert(
                "Please enter your shipping address."
            );
            return;
        }

        try {
            setPlacingOrder(true);
            setErrorMessage("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                handleUnauthorized();
                return;
            }

            const orderPayload = {
                customerId: customerId,

                items: cart.map(
                    (item) => ({
                        productId:
                            String(item.id),

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

            const response = await fetch(
                `${API_BASE_URL}/api/orders`,
                {
                    method: "POST",

                    headers:
                        getAuthHeaders(),

                    body:
                        JSON.stringify(
                            orderPayload
                        )
                }
            );

            const responseText =
                await response.text();

            let data = null;

            try {
                data = responseText
                    ? JSON.parse(responseText)
                    : null;
            } catch {
                data = responseText;
            }

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                handleUnauthorized();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    typeof data === "string"
                        ? data
                        : data?.message ||
                        "Failed to place order."
                );
            }

            console.log(
                "Order Created:",
                data
            );

            setCart([]);

            setShowCheckout(false);
            setShowCart(false);

            setActiveSection(
                "orders"
            );

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
                        method: "PATCH",
                        headers:
                            getAuthHeaders()
                    }
                );

            const responseText =
                await response.text();

            let data = null;

            try {
                data = responseText
                    ? JSON.parse(responseText)
                    : null;
            } catch {
                data = responseText;
            }

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                handleUnauthorized();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    typeof data === "string"
                        ? data
                        : data?.message ||
                        "Unable to cancel order."
                );
            }

            const cancelledOrder =
                data;

            if (
                cancelledOrder &&
                cancelledOrder.id
            ) {
                setOrders(
                    (previousOrders) =>
                        previousOrders.map(
                            (order) =>
                                String(
                                    order.id
                                ) ===
                                String(
                                    cancelledOrder.id
                                )
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

    const reorder = (order) => {
        if (
            !order ||
            !Array.isArray(order.items)
        ) {
            return;
        }

        let addedAnyProduct = false;

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

                if (!product) {
                    return;
                }

                addedAnyProduct = true;

                const quantity =
                    Number(
                        orderItem.quantity || 1
                    );

                setCart(
                    (previousCart) => {
                        const existing =
                            previousCart.find(
                                (item) =>
                                    String(
                                        item.id
                                    ) ===
                                    String(
                                        product.id
                                    )
                            );

                        if (existing) {
                            return previousCart.map(
                                (item) =>
                                    String(
                                        item.id
                                    ) ===
                                    String(
                                        product.id
                                    )
                                        ? {
                                            ...item,
                                            quantity:
                                                Number(
                                                    item.quantity
                                                ) +
                                                quantity
                                        }
                                        : item
                            );
                        }

                        return [
                            ...previousCart,
                            {
                                ...product,
                                quantity
                            }
                        ];
                    }
                );
            }
        );

        if (addedAnyProduct) {
            setShowCart(true);
        } else {
            alert(
                "The products from this order are no longer available."
            );
        }
    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        localStorage.removeItem("firstName");
        localStorage.removeItem("name");
        localStorage.removeItem("customerId");
        localStorage.removeItem("userId");
        localStorage.removeItem("id");

        navigate("/login");
    };

    // =====================================================
    // NAVIGATION
    // =====================================================

    const goToSection = (
        section
    ) => {
        setActiveSection(section);

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

        if (
            section === "home"
        ) {
            fetchProducts();
        }
    };

    // =====================================================
    // ORDER DATE
    // =====================================================

    const formatOrderDate = (
        order
    ) => {
        if (order?.createdAt) {
            const date =
                new Date(
                    order.createdAt
                );

            if (!Number.isNaN(date.getTime())) {
                return date.toLocaleString();
            }
        }

        return "Recently";
    };

    // =====================================================
    // ORDER TOTAL
    // =====================================================

    const getOrderTotal = (
        order
    ) => {
        if (
            order?.totalAmount !== undefined &&
            order?.totalAmount !== null
        ) {
            return Number(
                order.totalAmount
            );
        }

        if (
            Array.isArray(order?.items)
        ) {
            return order.items.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.subtotal ??
                        (
                            Number(
                                item.price || 0
                            ) *
                            Number(
                                item.quantity || 0
                            )
                        )
                    ),
                0
            );
        }

        return 0;
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

        return String(status)
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
        if (!status) {
            return false;
        }

        const normalizedStatus =
            String(status).toUpperCase();

        return (
            normalizedStatus !==
            "DELIVERED" &&
            normalizedStatus !==
            "CANCELLED"
        );
    };

    // =====================================================
    // RENDER
    // =====================================================

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

                                    {filteredProducts.length > 0 ? (
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

                                                        {/* PRODUCT IMAGE */}

                                                        <div className="product-image-container">

                                                            <img
                                                                src={
                                                                    product.image
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="product-image"
                                                                onError={(
                                                                    event
                                                                ) => {
                                                                    event.currentTarget.src =
                                                                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";
                                                                }}
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
                                                                {isWishlisted
                                                                    ? "♥"
                                                                    : "♡"}
                                                            </button>

                                                        </div>

                                                        {/* PRODUCT DETAILS */}

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

                                                                ⭐{" "}
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

                                                            <div
                                                                className="product-stock"
                                                                style={{
                                                                    fontSize:
                                                                        "13px",
                                                                    marginTop:
                                                                        "5px"
                                                                }}
                                                            >
                                                                {Number(
                                                                    product.stock
                                                                ) > 0 ? (
                                                                    <span>
                                                                        🟢{" "}
                                                                        {
                                                                            product.stock
                                                                        }{" "}
                                                                        in stock
                                                                    </span>
                                                                ) : (
                                                                    <span>
                                                                        🔴 Out of stock
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="product-bottom">

                                                                <strong>
                                                                    $
                                                                    {Number(
                                                                        product.price
                                                                    ).toFixed(
                                                                        2
                                                                    )}
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
                                                                        disabled={
                                                                            Number(
                                                                                product.stock
                                                                            ) <=
                                                                            0
                                                                        }
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

                                            <button
                                                className="secondary-button"
                                                onClick={() => {
                                                    setSearch("");
                                                    setSelectedCategory(
                                                        "All"
                                                    );
                                                    fetchProducts();
                                                }}
                                            >
                                                Refresh Products
                                            </button>

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

                                            <div className="order-items">

                                                {Array.isArray(
                                                    order.items
                                                ) &&
                                                    order.items.map(
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
                                                                        {Number(
                                                                            item.price ||
                                                                            0
                                                                        ).toFixed(
                                                                            2
                                                                        )}
                                                                    </small>

                                                                </div>

                                                                <strong className="order-item-subtotal">

                                                                    $

                                                                    {Number(
                                                                        item.subtotal ??
                                                                        (
                                                                            Number(
                                                                                item.price ||
                                                                                0
                                                                            ) *
                                                                            Number(
                                                                                item.quantity ||
                                                                                0
                                                                            )
                                                                        )
                                                                    ).toFixed(
                                                                        2
                                                                    )}

                                                                </strong>

                                                            </div>
                                                        )
                                                    )}

                                            </div>

                                            <div className="order-footer">

                                                <strong>
                                                    Total: $
                                                    {getOrderTotal(
                                                        order
                                                    ).toFixed(
                                                        2
                                                    )}
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

                                                <p className="seller-name">
                                                    Sold by{" "}
                                                    {
                                                        product.seller
                                                    }
                                                </p>

                                                <div className="product-bottom">

                                                    <strong>
                                                        $
                                                        {Number(
                                                            product.price
                                                        ).toFixed(
                                                            2
                                                        )}
                                                    </strong>

                                                    <button
                                                        className="add-cart-button"
                                                        disabled={
                                                            Number(
                                                                product.stock
                                                            ) <=
                                                            0
                                                        }
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
                                                        {Number(
                                                            item.price
                                                        ).toFixed(
                                                            2
                                                        )}
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
                                            {cartTotal.toFixed(
                                                2
                                            )}
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

                            <p className="seller-name">
                                Sold by{" "}
                                {
                                    selectedProduct.seller
                                }
                            </p>

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

                            <p>
                                Stock:{" "}
                                <strong>
                                    {
                                        selectedProduct.stock
                                    }
                                </strong>
                            </p>

                            <h3>
                                $
                                {Number(
                                    selectedProduct.price
                                ).toFixed(
                                    2
                                )}
                            </h3>

                            <button
                                className="primary-button full-button"
                                disabled={
                                    Number(
                                        selectedProduct.stock
                                    ) <=
                                    0
                                }
                                onClick={() => {
                                    addToCart(
                                        selectedProduct
                                    );

                                    setSelectedProduct(
                                        null
                                    );
                                }}
                            >
                                {Number(
                                    selectedProduct.stock
                                ) > 0
                                    ? "🛒 Add to Cart"
                                    : "Out of Stock"}
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
                                {cartTotal.toFixed(
                                    2
                                )}
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
                            value={
                                customerName
                            }
                            onChange={(event) =>
                                setCustomerName(
                                    event.target.value
                                )
                            }
                            placeholder="Your name"
                        />

                        <input
                            type="email"
                            value={
                                customerEmail
                            }
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