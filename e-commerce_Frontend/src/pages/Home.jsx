import { Link } from "react-router-dom";
import "./Home.css";

function Home() {

    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    return (
        <div className="home-page">

            {/* Hero Section */}
            <section className="hero-section">

                <div className="hero-content">

                    <span className="hero-badge">
                        ✨ Welcome to E-Cart
                    </span>

                    <h1>
                        Shop Smart.
                        <span> Live Better.</span>
                    </h1>

                    <p>
                        Discover amazing products, explore trusted sellers,
                        and enjoy a seamless online shopping experience.
                    </p>

                    <div className="hero-buttons">

                        <Link to="/role-test" className="primary-btn">
                            Explore Now 🛍️
                        </Link>

                        <Link to="/register" className="secondary-btn">
                            Create Account
                        </Link>

                    </div>

                </div>

                <div className="hero-visual">

                    <div className="floating-card card-one">
                        🛍️
                    </div>

                    <div className="floating-card card-two">
                        📦
                    </div>

                    <div className="floating-card card-three">
                        ❤️
                    </div>

                    <div className="shopping-circle">
                        <span>🛒</span>
                    </div>

                </div>

            </section>


            {/* Welcome User */}
            {email && (
                <section className="welcome-section">

                    <div>
                        <h2>
                            Welcome back! 👋
                        </h2>

                        <p>
                            Logged in as <strong>{email}</strong>
                        </p>
                    </div>

                    <div className="role-badge">
                        {role}
                    </div>

                </section>
            )}


            {/* Features */}
            <section className="features-section">

                <div className="section-heading">
                    <span>WHY CHOOSE E-CART?</span>

                    <h2>
                        Everything You Need,
                        <span> In One Place</span>
                    </h2>
                </div>


                <div className="feature-grid">

                    <div className="feature-card">
                        <div className="feature-icon">
                            🛍️
                        </div>

                        <h3>
                            Easy Shopping
                        </h3>

                        <p>
                            Find your favorite products quickly
                            and enjoy a smooth shopping experience.
                        </p>
                    </div>


                    <div className="feature-card">
                        <div className="feature-icon">
                            🚚
                        </div>

                        <h3>
                            Fast Delivery
                        </h3>

                        <p>
                            Get your orders delivered safely
                            and conveniently to your doorstep.
                        </p>
                    </div>


                    <div className="feature-card">
                        <div className="feature-icon">
                            🔒
                        </div>

                        <h3>
                            Secure Payments
                        </h3>

                        <p>
                            Your data and transactions are protected
                            with secure technology.
                        </p>
                    </div>


                    <div className="feature-card">
                        <div className="feature-icon">
                            ⭐
                        </div>

                        <h3>
                            Trusted Sellers
                        </h3>

                        <p>
                            Discover products from reliable
                            and trusted sellers.
                        </p>
                    </div>

                </div>

            </section>


            {/* CTA */}
            <section className="cta-section">

                <div>
                    <h2>
                        Ready to Start Shopping?
                    </h2>

                    <p>
                        Join E-Cart and discover a world of amazing products.
                    </p>
                </div>

                <Link to="/role-test" className="cta-button">
                    Start Shopping →
                </Link>

            </section>


            {/* Footer */}
            <footer className="home-footer">

                <h2>
                    E-Cart
                </h2>

                <p>
                    Your trusted online shopping destination.
                </p>

                <span>
                    © 2026 E-Cart. All rights reserved.
                </span>

            </footer>

        </div>
    );
}

export default Home;