import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";

function CustomerDashboard() {

    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [cartCount, setCartCount] = useState(0);
    const [wishlist, setWishlist] = useState([]);

    const products = [
        {
            id: 1,
            name: "Premium Sneakers",
            category: "Fashion",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            name: "Wireless Headphones",
            category: "Electronics",
            price: 129.99,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            name: "Smart Watch",
            category: "Electronics",
            price: 199.99,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 4,
            name: "Leather Handbag",
            category: "Fashion",
            price: 79.99,
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 5,
            name: "Modern Chair",
            category: "Home",
            price: 149.99,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 6,
            name: "Minimal Lamp",
            category: "Home",
            price: 49.99,
            image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
        }
    ];

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

    // Search + Category Filter
    const filteredProducts = products.filter((product) => {

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const matchesSearch =
            product.name
                .toLowerCase()
                .includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
    });


    // Add Product To Cart
    const addToCart = (product) => {

        setCartCount((previousCount) =>
            previousCount + 1
        );

        alert(`${product.name} added to cart 🛒`);
    };


    // Wishlist
    const toggleWishlist = (productId) => {

        setWishlist((previousWishlist) => {

            if (previousWishlist.includes(productId)) {

                return previousWishlist.filter(
                    (id) => id !== productId
                );

            }

            return [
                ...previousWishlist,
                productId
            ];

        });
    };


    // Logout
    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");

        navigate("/login");
    };


    // Profile
    const handleProfile = () => {

        const email =
            localStorage.getItem("email");

        alert(
            `Logged in as:\n${email || "User"}`
        );
    };


    // Scroll To Products
    const scrollToProducts = () => {

        const productSection =
            document.getElementById("products");

        if (productSection) {

            productSection.scrollIntoView({
                behavior: "smooth"
            });

        }
    };


    return (

        <div className="customer-dashboard">

            {/* =========================
                NAVBAR
            ========================== */}

            <header className="customer-navbar">

                <div
                    className="brand"
                    onClick={() => navigate("/")}
                >

                    <span className="brand-icon">
                        🛍️
                    </span>

                    <span>
                        E-Cart
                    </span>

                </div>


                {/* SEARCH */}

                <div className="search-box">

                    <span className="search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                </div>


                {/* NAV ACTIONS */}

                <div className="nav-actions">

                    {/* CART */}

                    <button
                        className="cart-button"
                        onClick={() =>
                            alert(
                                `You have ${cartCount} item(s) in your cart 🛒`
                            )
                        }
                        aria-label="Shopping Cart"
                    >

                        🛒

                        {cartCount > 0 && (

                            <span>
                                {cartCount}
                            </span>

                        )}

                    </button>


                    {/* PROFILE */}

                    <button
                        className="profile-button"
                        onClick={handleProfile}
                        aria-label="Profile"
                    >

                        👤

                    </button>


                    {/* LOGOUT */}

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >

                        Logout

                    </button>

                </div>

            </header>


            {/* =========================
                HERO SECTION
            ========================== */}

            <section className="hero-section">

                <div className="hero-content">

                    <span className="hero-badge">
                        ✨ Welcome to E-Cart
                    </span>


                    <h1>

                        Discover.
                        <br />

                        Shop.
                        <br />

                        Enjoy.

                    </h1>


                    <p>

                        Explore amazing products,
                        discover new styles,
                        and enjoy a seamless
                        shopping experience.

                    </p>


                    <button
                        className="shop-now-button"
                        onClick={scrollToProducts}
                    >

                        Shop Now

                        <span>
                            →
                        </span>

                    </button>

                </div>


                {/* HERO IMAGE */}

                <div className="hero-image-container">

                    <div className="floating-circle circle-one"></div>

                    <div className="floating-circle circle-two"></div>


                    <img
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80"
                        alt="E-Cart Shopping"
                        className="hero-image"
                    />

                </div>

            </section>


            {/* =========================
                CATEGORY SECTION
            ========================== */}

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

                    {categories.map((category) => (

                        <button
                            key={category.name}
                            className={
                                selectedCategory === category.name
                                    ? "category-card active"
                                    : "category-card"
                            }
                            onClick={() =>
                                setSelectedCategory(
                                    category.name
                                )
                            }
                        >

                            <span className="category-icon">
                                {category.icon}
                            </span>

                            <span>
                                {category.name}
                            </span>

                        </button>

                    ))}

                </div>

            </section>


            {/* =========================
                PRODUCTS SECTION
            ========================== */}

            <section
                className="products-section"
                id="products"
            >

                <div className="section-heading">

                    <span>
                        Trending Now
                    </span>

                    <h2>
                        Featured Products
                    </h2>

                </div>


                <div className="product-grid">

                    {filteredProducts.length > 0 ? (

                        filteredProducts.map((product) => (

                            <div
                                className="product-card"
                                key={product.id}
                            >

                                {/* PRODUCT IMAGE */}

                                <div className="product-image-container">

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-image"
                                        loading="lazy"
                                    />


                                    {/* WISHLIST */}

                                    <button
                                        className={
                                            wishlist.includes(product.id)
                                                ? "wishlist-button active"
                                                : "wishlist-button"
                                        }
                                        onClick={() =>
                                            toggleWishlist(
                                                product.id
                                            )
                                        }
                                        aria-label="Add to wishlist"
                                    >

                                        {wishlist.includes(
                                            product.id
                                        )
                                            ? "♥"
                                            : "♡"
                                        }

                                    </button>

                                </div>


                                {/* PRODUCT DETAILS */}

                                <div className="product-details">

                                    <span className="product-category">
                                        {product.category}
                                    </span>


                                    <h3>
                                        {product.name}
                                    </h3>


                                    <div className="product-bottom">

                                        <strong>
                                            ${product.price.toFixed(2)}
                                        </strong>


                                        <button
                                            className="add-cart-button"
                                            onClick={() =>
                                                addToCart(product)
                                            }
                                        >

                                            🛒

                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))

                    ) : (

                        <div className="no-products">

                            <span>
                                🔍
                            </span>

                            <h3>
                                No products found
                            </h3>

                            <p>
                                Try searching for another product.
                            </p>

                        </div>

                    )}

                </div>

            </section>


            {/* =========================
                FOOTER
            ========================== */}

            <footer className="customer-footer">

                <div className="footer-brand">

                    🛍️ E-Cart

                </div>

                <p>
                    Your everyday shopping destination.
                </p>

                <p>
                    © 2026 E-Cart. All rights reserved.
                </p>

            </footer>

        </div>
    );
}

export default CustomerDashboard;