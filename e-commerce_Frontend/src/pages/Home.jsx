import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {

    const navigate = useNavigate();

    const categories = [
        {
            icon: "👗",
            title: "Fashion",
            description: "Discover the latest styles",
        },
        {
            icon: "📱",
            title: "Electronics",
            description: "Smart gadgets for you",
        },
        {
            icon: "🏠",
            title: "Home & Living",
            description: "Make your space beautiful",
        },
        {
            icon: "💄",
            title: "Beauty",
            description: "Feel confident every day",
        },
    ];

    const products = [
        {
            id: 1,
            name: "Premium Sneakers",
            category: "Fashion",
            price: "$89.99",
            oldPrice: "$119.99",
            image:
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
            badge: "Best Seller",
        },
        {
            id: 2,
            name: "Wireless Headphones",
            category: "Electronics",
            price: "$129.99",
            oldPrice: "$169.99",
            image:
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700",
            badge: "Popular",
        },
        {
            id: 3,
            name: "Smart Watch",
            category: "Electronics",
            price: "$199.99",
            oldPrice: "$249.99",
            image:
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
            badge: "Trending",
        },
        {
            id: 4,
            name: "Luxury Handbag",
            category: "Fashion",
            price: "$79.99",
            oldPrice: "$109.99",
            image:
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700",
            badge: "New",
        },
    ];

    const handleExplore = () => {
        navigate("/customer-dashboard");
    };

    return (

        <div className="home-page">

            {/* ====================================
                NAVBAR
            ==================================== */}

            <nav className="home-navbar">

                <div
                    className="home-logo"
                    onClick={() => navigate("/")}
                >

                    <div className="logo-icon">
                        🛍️
                    </div>

                    <div className="logo-text">
                        <span>DeluLu</span>
                        <strong>Cart</strong>
                    </div>

                </div>


                <div className="home-nav-links">

                    <a href="#home">
                        Home
                    </a>

                    <a href="#categories">
                        Categories
                    </a>

                    <a href="#products">
                        Products
                    </a>

                    <a href="#about">
                        About Us
                    </a>

                </div>


                <div className="home-nav-actions">

                    <button
                        className="nav-login-btn"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                    <button
                        className="nav-register-btn"
                        onClick={() => navigate("/register")}
                    >
                        Get Started
                    </button>

                </div>

            </nav>


            {/* ====================================
                HERO SECTION
            ==================================== */}

            <section
                className="hero-section"
                id="home"
            >

                <div className="hero-background-circle circle-1"></div>

                <div className="hero-background-circle circle-2"></div>

                <div className="hero-content">

                    <div className="hero-small-badge">

                        ✨ Your Everyday Shopping Destination

                    </div>


                    <h1>

                        Shop Smarter.

                        <span>
                            Live Better.
                        </span>

                    </h1>


                    <p>

                        Welcome to <strong>DeluLu Cart</strong> —
                        your one-stop destination for fashion,
                        electronics, lifestyle, and everything
                        you love.

                    </p>


                    <div className="hero-buttons">

                        <button
                            className="primary-hero-btn"
                            onClick={handleExplore}
                        >

                            Explore Products

                            <span>
                                →
                            </span>

                        </button>


                        <button
                            className="secondary-hero-btn"
                            onClick={() => navigate("/register")}
                        >

                            Join DeluLu Cart

                        </button>

                    </div>


                    <div className="hero-trust">

                        <div className="trust-avatars">

                            <span>👩</span>
                            <span>👨</span>
                            <span>👩‍💼</span>
                            <span>👨‍💻</span>

                        </div>

                        <div>

                            <strong>
                                10K+ Happy Shoppers
                            </strong>

                            <p>
                                Loved by customers everywhere
                            </p>

                        </div>

                    </div>

                </div>


                {/* HERO IMAGE */}

                <div className="hero-visual">

                    <div className="hero-glow"></div>


                    <div className="floating-card card-top">

                        <span>
                            ⭐
                        </span>

                        <div>

                            <strong>
                                4.9/5
                            </strong>

                            <small>
                                Customer Rating
                            </small>

                        </div>

                    </div>


                    <div className="hero-image-wrapper">

                        <img
                            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1000"
                            alt="DeluLu Cart Shopping"
                        />

                    </div>


                    <div className="floating-card card-bottom">

                        <span>
                            🛒
                        </span>

                        <div>

                            <strong>
                                Shop Freely
                            </strong>

                            <small>
                                Everything you need
                            </small>

                        </div>

                    </div>

                </div>

            </section>


            {/* ====================================
                FEATURES
            ==================================== */}

            <section className="features-section">

                <div className="feature-box">

                    <div className="feature-icon">
                        🚚
                    </div>

                    <div>

                        <h3>
                            Fast Delivery
                        </h3>

                        <p>
                            Get your products delivered quickly.
                        </p>

                    </div>

                </div>


                <div className="feature-box">

                    <div className="feature-icon">
                        🔒
                    </div>

                    <div>

                        <h3>
                            Secure Shopping
                        </h3>

                        <p>
                            Your data and payments are protected.
                        </p>

                    </div>

                </div>


                <div className="feature-box">

                    <div className="feature-icon">
                        💳
                    </div>

                    <div>

                        <h3>
                            Easy Payments
                        </h3>

                        <p>
                            Simple and secure payment options.
                        </p>

                    </div>

                </div>


                <div className="feature-box">

                    <div className="feature-icon">
                        ⭐
                    </div>

                    <div>

                        <h3>
                            Quality Products
                        </h3>

                        <p>
                            Carefully selected products for you.
                        </p>

                    </div>

                </div>

            </section>


            {/* ====================================
                CATEGORY SECTION
            ==================================== */}

            <section
                className="categories-section"
                id="categories"
            >

                <div className="section-title">

                    <span>
                        Explore Our World
                    </span>

                    <h2>
                        Shop By Category
                    </h2>

                    <p>
                        Find everything you love,
                        all in one beautiful place.
                    </p>

                </div>


                <div className="category-grid">

                    {categories.map((category) => (

                        <div
                            className="category-box"
                            key={category.title}
                            onClick={handleExplore}
                        >

                            <div className="category-icon">
                                {category.icon}
                            </div>

                            <h3>
                                {category.title}
                            </h3>

                            <p>
                                {category.description}
                            </p>

                            <span className="category-arrow">
                                Explore →
                            </span>

                        </div>

                    ))}

                </div>

            </section>


            {/* ====================================
                OFFER BANNER
            ==================================== */}

            <section className="offer-section">

                <div className="offer-content">

                    <span className="offer-badge">
                        🔥 Limited Time Offer
                    </span>

                    <h2>
                        Up to 50% Off
                    </h2>

                    <p>
                        Fresh deals. Amazing products.
                        Unbeatable prices.
                    </p>

                    <button
                        onClick={handleExplore}
                    >
                        Shop Deals →
                    </button>

                </div>


                <div className="offer-emoji">

                    🛍️

                </div>

            </section>


            {/* ====================================
                PRODUCTS
            ==================================== */}

            <section
                className="products-section"
                id="products"
            >

                <div className="section-title">

                    <span>
                        Trending Now
                    </span>

                    <h2>
                        Featured Products
                    </h2>

                    <p>
                        Handpicked products that
                        everyone is loving right now.
                    </p>

                </div>


                <div className="products-grid">

                    {products.map((product) => (

                        <div
                            className="home-product-card"
                            key={product.id}
                        >

                            <div className="product-image-wrapper">

                                <img
                                    src={product.image}
                                    alt={product.name}
                                />

                                <span className="product-badge">
                                    {product.badge}
                                </span>

                                <button className="wishlist-btn">
                                    ♡
                                </button>

                            </div>


                            <div className="product-info">

                                <span className="product-category">
                                    {product.category}
                                </span>

                                <h3>
                                    {product.name}
                                </h3>


                                <div className="product-rating">

                                    ⭐⭐⭐⭐⭐

                                    <span>
                                        4.8
                                    </span>

                                </div>


                                <div className="price-row">

                                    <div>

                                        <strong>
                                            {product.price}
                                        </strong>

                                        <del>
                                            {product.oldPrice}
                                        </del>

                                    </div>


                                    <button
                                        className="quick-add-btn"
                                        onClick={handleExplore}
                                    >
                                        +
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>


                <button
                    className="view-all-btn"
                    onClick={handleExplore}
                >

                    View All Products →

                </button>

            </section>


            {/* ====================================
                STATISTICS
            ==================================== */}

            <section
                className="stats-section"
                id="about"
            >

                <div className="stats-content">

                    <span>
                        WHY DELULU CART?
                    </span>

                    <h2>
                        Shopping Made
                        <br />
                        <strong>
                            Simple & Joyful.
                        </strong>
                    </h2>

                    <p>
                        We believe shopping should be more
                        than just buying things. It should be
                        an experience that is easy, exciting,
                        and enjoyable.
                    </p>

                </div>


                <div className="stats-grid">

                    <div className="stat-item">

                        <strong>
                            10K+
                        </strong>

                        <span>
                            Happy Customers
                        </span>

                    </div>


                    <div className="stat-item">

                        <strong>
                            5K+
                        </strong>

                        <span>
                            Products
                        </span>

                    </div>


                    <div className="stat-item">

                        <strong>
                            500+
                        </strong>

                        <span>
                            Trusted Sellers
                        </span>

                    </div>


                    <div className="stat-item">

                        <strong>
                            24/7
                        </strong>

                        <span>
                            Customer Support
                        </span>

                    </div>

                </div>

            </section>


            {/* ====================================
                CTA
            ==================================== */}

            <section className="cta-section">

                <div>

                    <span>
                        Ready to shop?
                    </span>

                    <h2>
                        Your Next Favourite
                        <br />
                        Product Is Waiting.
                    </h2>

                    <p>
                        Start exploring thousands of products
                        at DeluLu Cart today.
                    </p>

                    <button
                        onClick={handleExplore}
                    >
                        Start Shopping →
                    </button>

                </div>

            </section>


            {/* ====================================
                FOOTER
            ==================================== */}

            <footer className="home-footer">

                <div className="footer-main">

                    <div className="footer-brand">

                        <div className="home-logo">

                            <div className="logo-icon">
                                🛍️
                            </div>

                            <div className="logo-text">

                                <span>
                                    DeluLu
                                </span>

                                <strong>
                                    Cart
                                </strong>

                            </div>

                        </div>

                        <p>
                            Shop smarter. Live better.
                            Everything you love, all in one place.
                        </p>

                    </div>


                    <div className="footer-column">

                        <h4>
                            Quick Links
                        </h4>

                        <a href="#home">
                            Home
                        </a>

                        <a href="#categories">
                            Categories
                        </a>

                        <a href="#products">
                            Products
                        </a>

                    </div>


                    <div className="footer-column">

                        <h4>
                            Support
                        </h4>

                        <a href="#about">
                            About Us
                        </a>

                        <a href="#about">
                            Contact Us
                        </a>

                        <a href="#about">
                            Help Center
                        </a>

                    </div>


                    <div className="footer-column">

                        <h4>
                            Follow Us
                        </h4>

                        <div className="social-icons">

                            <span>📘</span>
                            <span>📸</span>
                            <span>🐦</span>
                            <span>▶️</span>

                        </div>

                    </div>

                </div>


                <div className="footer-bottom">

                    <p>
                        © 2026 DeluLu Cart. All rights reserved.
                    </p>

                    <p>
                        Made with ❤️ for happy shoppers.
                    </p>

                </div>

            </footer>

        </div>
    );
}

export default Home;