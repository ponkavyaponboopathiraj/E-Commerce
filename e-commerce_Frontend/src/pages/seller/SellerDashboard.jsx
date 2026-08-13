import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SellerDashboard.css";

import {
    addProduct,
    getProductsBySeller
} from "../../service/productService";


function SellerDashboard() {

    const navigate = useNavigate();

    // =====================================================
    // CURRENT LOGGED-IN SELLER
    // =====================================================

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


    // =====================================================
    // STATES
    // =====================================================

    const [activeMenu, setActiveMenu] =
        useState("dashboard");

    const [search, setSearch] =
        useState("");

    const [selectedCategory, setSelectedCategory] =
        useState("All");

    const [products, setProducts] =
        useState([]);

    const [showProductModal, setShowProductModal] =
        useState(false);

    const [editingProduct, setEditingProduct] =
        useState(null);

    const [viewProduct, setViewProduct] =
        useState(null);

    const [cart, setCart] =
        useState([]);

    const [wishlist, setWishlist] =
        useState([]);

    const [orders, setOrders] =
        useState([]);

    const [toast, setToast] =
        useState("");

    const [loadingProducts, setLoadingProducts] =
        useState(false);


    // =====================================================
    // PRODUCT FORM
    // =====================================================

    const [productForm, setProductForm] =
        useState({
            name: "",
            category: "Fashion",
            price: "",
            stock: "",
            image: "",
            description: ""
        });


    // =====================================================
    // CATEGORIES
    // =====================================================

    const categories = [
        "All",
        "Fashion",
        "Electronics",
        "Home",
        "Beauty",
        "Sports"
    ];


    // =====================================================
    // LOAD PRODUCTS FROM MONGODB
    // =====================================================

    const loadSellerProducts = async () => {

        if (!sellerId) {

            console.error(
                "❌ Seller ID not found in localStorage"
            );

            showToast(
                "Seller ID not found. Please login again."
            );

            return;
        }

        try {

            setLoadingProducts(true);

            console.log(
                "🔥 Loading products for seller:",
                sellerId
            );

            const data =
                await getProductsBySeller(
                    sellerId
                );

            console.log(
                "🔥 Products received from MongoDB:",
                data
            );

            setProducts(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "❌ Failed to load seller products:",
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


    // =====================================================
    // LOAD PRODUCTS WHEN DASHBOARD OPENS
    // =====================================================

    useEffect(() => {

        loadSellerProducts();

    }, [sellerId]);


    // =====================================================
    // MY PRODUCTS
    // =====================================================

    const myProducts =
        products.filter(
            (product) =>
                String(product.sellerId).trim() ===
                String(sellerId).trim()
        );


    // =====================================================
    // FILTER PRODUCTS
    // =====================================================

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


    // =====================================================
    // SHOW TOAST
    // =====================================================

    const showToast = (message) => {

        setToast(message);

        setTimeout(() => {
            setToast("");
        }, 2500);
    };


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleFormChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setProductForm({
            ...productForm,
            [name]: value
        });
    };


    // =====================================================
    // RESET PRODUCT FORM
    // =====================================================

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


    // =====================================================
    // OPEN ADD PRODUCT
    // =====================================================

    const openAddProduct = () => {

        setEditingProduct(null);

        resetProductForm();

        setShowProductModal(true);
    };


    // =====================================================
    // OPEN EDIT PRODUCT
    // =====================================================

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
            description:
                product.description || ""
        });

        setShowProductModal(true);
    };


    // =====================================================
    // ADD PRODUCT
    // =====================================================

    const handleProductSubmit =
        async (event) => {

            event.preventDefault();

            console.log(
                "🔥 HANDLE PRODUCT SUBMIT"
            );


            // -------------------------------------------------
            // VALIDATION
            // -------------------------------------------------

            if (!sellerId) {

                showToast(
                    "Seller ID not found. Please login again."
                );

                return;
            }


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


            try {

                // -------------------------------------------------
                // UPDATE IS NOT CONNECTED YET
                // -------------------------------------------------

                if (editingProduct) {

                    showToast(
                        "Edit API will be connected next."
                    );

                    return;
                }


                // -------------------------------------------------
                // PRODUCT DATA
                // -------------------------------------------------

                const productData = {

                    sellerId: sellerId,

                    name:
                        productForm.name.trim(),

                    description:
                        productForm.description.trim(),

                    price:
                        Number(
                            productForm.price
                        ),

                    category:
                        productForm.category,

                    stock:
                        Number(
                            productForm.stock
                        ),

                    status:
                        "ACTIVE",

                    images:
                        productForm.image.trim()
                            ? [
                                productForm.image.trim()
                            ]
                            : [],

                    attributes: {}
                };


                console.log(
                    "🔥 Sending product to backend:",
                    productData
                );


                // -------------------------------------------------
                // SAVE TO MONGODB
                // -------------------------------------------------

                const savedProduct =
                    await addProduct(
                        productData
                    );


                console.log(
                    "✅ Product saved successfully:",
                    savedProduct
                );


                // -------------------------------------------------
                // IMPORTANT
                // DO NOT DIRECTLY PUSH savedProduct
                //
                // MongoDB is our source of truth.
                // -------------------------------------------------

                await loadSellerProducts();


                // -------------------------------------------------
                // CLEAR FORM
                // -------------------------------------------------

                resetProductForm();

                setEditingProduct(null);

                setShowProductModal(false);


                showToast(
                    "Product added successfully 🎉"
                );

            } catch (error) {

                console.error(
                    "❌ PRODUCT SAVE ERROR:",
                    error
                );

                console.error(
                    "Backend response:",
                    error.response?.data
                );

                showToast(
                    error.response?.data?.message ||
                    "Failed to add product"
                );
            }
        };


    // =====================================================
    // DELETE PRODUCT
    // =====================================================
    // NOTE:
    // Current productService only confirmed add/get methods.
    // So we DON'T fake a MongoDB delete here.
    // =====================================================

    const handleDeleteProduct = () => {

        showToast(
            "Delete API will be connected next."
        );
    };


    // =====================================================
    // ADD TO CART
    // =====================================================

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


        const alreadyInCart =
            cart.some(
                (item) =>
                    item.id === product.id
            );


        if (alreadyInCart) {

            showToast(
                "Product is already in your cart 🛒"
            );

            return;
        }


        setCart([
            ...cart,
            product
        ]);


        showToast(
            "Added to cart 🛒"
        );
    };


    // =====================================================
    // BUY NOW
    // =====================================================

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


        const newOrder = {

            id: Date.now(),

            product: product,

            quantity: 1,

            total:
                Number(product.price) || 0,

            date:
                new Date()
                    .toLocaleDateString(
                        "en-US"
                    ),

            status: "Confirmed"
        };


        setOrders([
            newOrder,
            ...orders
        ]);


        showToast(
            "Order placed successfully 🎉"
        );
    };


    // =====================================================
    // WISHLIST
    // =====================================================

    const toggleWishlist = (product) => {

        const exists =
            wishlist.some(
                (item) =>
                    item.id === product.id
            );


        if (exists) {

            setWishlist(
                wishlist.filter(
                    (item) =>
                        item.id !==
                        product.id
                )
            );

            showToast(
                "Removed from wishlist"
            );

        } else {

            setWishlist([
                ...wishlist,
                product
            ]);

            showToast(
                "Added to wishlist ❤️"
            );
        }
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
            "sellerName"
        );

        localStorage.removeItem(
            "sellerId"
        );

        navigate("/login");
    };


    // =====================================================
    // DASHBOARD STATS
    // =====================================================

    const totalProducts =
        myProducts.length;


    const totalStock =
        myProducts.reduce(
            (total, product) =>
                total +
                Number(product.stock || 0),
            0
        );


    const totalSales =
        orders.reduce(
            (total, order) =>
                total +
                Number(order.total || 0),
            0
        );


    // =====================================================
    // RENDER
    // =====================================================

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
                        📊
                        Dashboard
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
                        📦
                        My Products
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
                        🛍️
                        Shop Products
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
                        🚚
                        My Orders
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
                        ❤️
                        Wishlist
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
                        🛒
                        Cart

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
                    🚪
                    Logout
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
                                🛍️
                                📦
                                ✨
                            </div>

                        </section>


                        {/* STATS */}

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
                                    💰
                                </span>

                                <div>

                                    <p>
                                        Shopping Total
                                    </p>

                                    <h2>
                                        $
                                        {totalSales.toFixed(
                                            2
                                        )}
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
                                                    order
                                                        .product
                                                        .name
                                                }
                                            />

                                            <div>

                                                <h3>
                                                    {
                                                        order
                                                            .product
                                                            .name
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
                                                $
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
                                                    $
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
                PRODUCT MODAL
            ================================================= */}

            {showProductModal && (

                <div className="modal-overlay">

                    <div className="product-modal">

                        <button
                            className="modal-close"
                            onClick={() =>
                                setShowProductModal(
                                    false
                                )
                            }
                        >
                            ×
                        </button>


                        <h2>
                            {editingProduct
                                ? "Update Product"
                                : "Add New Product"}
                        </h2>


                        <p>
                            Add your product details
                            to DeluLu Cart.
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
                                        (cat) =>
                                            cat !== "All"
                                    )
                                    .map(
                                        (cat) => (

                                            <option
                                                key={cat}
                                                value={cat}
                                            >
                                                {cat}
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


                            <button
                                type="submit"
                            >
                                {editingProduct
                                    ? "Update Product"
                                    : "Add Product"}
                            </button>

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
                                $
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
                                    viewProduct.stock
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

    const [localSearch, setLocalSearch] =
        useState(search);


    useEffect(() => {
        setLocalSearch(search);
    }, [search]);


    const displayedProducts =
        products.filter((product) => {

            const name =
                product.name || "";

            const category =
                product.category || "";

            const matchesSearch =
                name
                    .toLowerCase()
                    .includes(
                        localSearch.toLowerCase()
                    );

            const matchesCategory =
                selectedCategory === "All" ||
                category === selectedCategory;

            return (
                matchesSearch &&
                matchesCategory
            );
        });


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
                        onClick={onAdd}
                    >
                        + Add Product
                    </button>

                    <button
                        className="add-product-button"
                        onClick={onRefresh}
                        disabled={loading}
                        style={{
                            marginLeft: "10px"
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
                            localSearch
                        }
                        onChange={(event) => {

                            setLocalSearch(
                                event.target.value
                            );

                            setSearch(
                                event.target.value
                            );

                        }}
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

                ) : displayedProducts.length >
                  0 ? (

                    displayedProducts.map(
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
    onDelete
}) {

    const isOwnProduct =
        String(product.sellerId).trim() ===
        String(sellerId).trim();


    const isWishlisted =
        wishlist.some(
            (item) =>
                item.id === product.id
        );


    return (

        <article className="product-card">

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


                <div className="product-price-row">

                    <strong>
                        $
                        {Number(
                            product.price || 0
                        ).toFixed(2)}
                    </strong>


                    <span>
                        Stock:
                        {" "}
                        {
                            product.stock ??
                            0
                        }
                    </span>

                </div>


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


                            <button
                                className="delete-button"
                                onClick={() =>
                                    onDelete(
                                        product.id
                                    )
                                }
                            >
                                🗑️
                            </button>

                        </>

                    ) : (

                        <>

                            <button
                                className="cart-action"
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