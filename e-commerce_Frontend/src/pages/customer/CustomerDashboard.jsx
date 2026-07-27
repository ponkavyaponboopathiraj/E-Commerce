import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";

function CustomerDashboard() {

    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [cartCount, setCartCount] = useState(0);

    const [products] = useState([
        {
            id: 1,
            name: "Premium Sneakers",
            category: "Fashion",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
        },
        {
            id: 2,
            name: "Wireless Headphones",
            category: "Electronics",
            price: 129.99,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
        },
        {
            id: 3,
            name: "Smart Watch",
            category: "Electronics",
            price: 199.99,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
        },
        {
            id: 4,
            name: "Leather Handbag",
            category: "Fashion",
            price: 79.99,
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"
        },
        {
            id: 5,
            name: "Modern Chair",
            category: "Home",
            price: 149.99,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=600"
        },
        {
            id: 6,
            name: "Minimal Lamp",
            category: "Home",
            price: 49.99,
            image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"
        }
    ]);

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


    const addToCart = () => {

        setCartCount((previousCount) =>
            previousCount + 1
        );
    };


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");

        navigate("/login");
    };


    return (

        <div className="customer-dashboard">

            {/* =========================
                NAVBAR
            ========================== */}

            <header className="customer-navbar">

                <div className="brand">

                    <span className="brand-icon">
                        🛍️
                    </span>

                    <span>
                        E-Cart
                    </span>

                </div>


                <div className="search-box">

                    <span>
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


                <div className="nav-actions">

                    <button
                        className="cart-button"
                        onClick={() => alert("Cart coming soon!")}
                    >

                        🛒

                        <span>
                            {cartCount}
                        </span>

                    </button>


                    <button
                        className="profile-button"
                        onClick={() =>
                            alert(
                                `Logged in as ${localStorage.getItem("email")}`
                            )
                        }
                    >

                        👤

                    </button>


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
                        and enjoy a seamless shopping experience.
                    </p>

                    <button
                        className="shop-now-button"
                        onClick={() =>
                            document
                                .getElementById("products")
                                .scrollIntoView({
                                    behavior: "smooth"
                                })
                        }
                    >

                        Shop Now
                        <span>→</span>

                    </button>

                </div>


                <div className="hero-image-container">

                    <div className="floating-circle circle-one"></div>

                    <div className="floating-circle circle-two"></div>

                    <img
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1000"
                        alt="Shopping"
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
                PRODUCT SECTION
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

                                <div className="product-image-container">

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-image"
                                    />

                                    <button className="wishlist-button">
                                        ♡
                                    </button>

                                </div>


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
                                            onClick={addToCart}
                                        >

                                            + 🛒

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