
import { useEffect, useMemo, useState } from "react";
import {
    getAllAdminProducts,
    deleteAdminProduct,
    updateAdminProductStatus
} from "../../service/adminService";

import "./AdminProductManagement.css";


function AdminProductManagement() {

    // =====================================================
    // STATES
    // =====================================================

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");

    const [deleteLoading, setDeleteLoading] = useState("");

    const [statusLoading, setStatusLoading] = useState("");


    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    const loadProducts = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getAllAdminProducts();

            setProducts(data);

        } catch (error) {

            console.error(
                "Failed to load products:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load products."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadProducts();

    }, []);


    // =====================================================
    // FILTER PRODUCTS
    // =====================================================

    const filteredProducts = useMemo(() => {

        return products.filter((product) => {

            const searchValue =
                search
                    .toLowerCase()
                    .trim();


            const productName =
                (product.name || "")
                    .toLowerCase();


            const brand =
                (product.brand || "")
                    .toLowerCase();


            const category =
                (product.category || "")
                    .toLowerCase();


            const matchesSearch =
                !searchValue ||
                productName.includes(searchValue) ||
                brand.includes(searchValue) ||
                category.includes(searchValue);


            const matchesStatus =
                statusFilter === "ALL" ||
                product.status === statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [
        products,
        search,
        statusFilter
    ]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalProducts =
        products.length;


    const activeProducts =
        products.filter(
            (product) =>
                product.status === "ACTIVE"
        ).length;


    const inactiveProducts =
        products.filter(
            (product) =>
                product.status === "INACTIVE"
        ).length;


    const discontinuedProducts =
        products.filter(
            (product) =>
                product.status === "DISCONTINUED"
        ).length;


    const lowStockProducts =
        products.filter(
            (product) =>
                product.stock !== null &&
                product.stock !== undefined &&
                product.stock > 0 &&
                product.stock <= 5
        ).length;


    // =====================================================
    // FORMAT PRICE
    // =====================================================

    const formatPrice = (price) => {

        if (
            price === null ||
            price === undefined
        ) {
            return "N/A";
        }

        return Number(price).toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2
            }
        );
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        switch (status) {

            case "ACTIVE":
                return "product-status-active";

            case "INACTIVE":
                return "product-status-inactive";

            case "DISCONTINUED":
                return "product-status-discontinued";

            default:
                return "product-status-default";
        }
    };


    // =====================================================
    // STOCK CLASS
    // =====================================================

    const getStockClass = (stock) => {

        if (
            stock === null ||
            stock === undefined
        ) {
            return "product-stock-unavailable";
        }

        if (stock <= 0) {
            return "product-stock-out";
        }

        if (stock <= 5) {
            return "product-stock-low";
        }

        return "product-stock-good";
    };


    // =====================================================
    // UPDATE STATUS
    // =====================================================

    const handleStatusChange = async (
        productId,
        status
    ) => {

        try {

            setStatusLoading(productId);

            const updatedProduct =
                await updateAdminProductStatus(
                    productId,
                    status
                );


            setProducts((previousProducts) =>
                previousProducts.map(
                    (product) =>
                        product.id === productId
                            ? updatedProduct
                            : product
                )
            );

        } catch (error) {

            console.error(
                "Failed to update product status:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update product status."
            );

        } finally {

            setStatusLoading("");

        }
    };


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const handleDelete = async (product) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${product.name}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            setDeleteLoading(product.id);

            await deleteAdminProduct(product.id);

            setProducts((previousProducts) =>
                previousProducts.filter(
                    (item) =>
                        item.id !== product.id
                )
            );

        } catch (error) {

            console.error(
                "Failed to delete product:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete product."
            );

        } finally {

            setDeleteLoading("");

        }
    };


    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {

        setSearch("");
        setStatusFilter("ALL");

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="products-loading">

                <div className="products-loader"></div>

                <h2>
                    Loading Products...
                </h2>

                <p>
                    Please wait while we fetch product data.
                </p>

            </div>

        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="products-error">

                <div className="products-error-icon">
                    ⚠️
                </div>

                <h2>
                    Unable to Load Products
                </h2>

                <p>
                    {error}
                </p>

                <button
                    className="products-retry-btn"
                    onClick={loadProducts}
                >
                    🔄 Retry
                </button>

            </div>

        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="product-management-container">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="product-management-header">

                <div>

                    <span className="product-management-label">
                        PRODUCT MANAGEMENT
                    </span>

                    <h2>
                        All Products
                    </h2>

                    <p>
                        Manage products across your
                        DeluLu Cart platform from one place.
                    </p>

                </div>


                <button
                    className="refresh-products-btn"
                    onClick={loadProducts}
                >
                    🔄 Refresh
                </button>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="product-stats-grid">


                {/* TOTAL */}

                <div className="product-stat-card">

                    <div className="product-stat-icon">
                        📦
                    </div>

                    <div>

                        <span>
                            Total Products
                        </span>

                        <strong>
                            {totalProducts}
                        </strong>

                    </div>

                </div>


                {/* ACTIVE */}

                <div className="product-stat-card">

                    <div className="product-stat-icon">
                        🟢
                    </div>

                    <div>

                        <span>
                            Active
                        </span>

                        <strong>
                            {activeProducts}
                        </strong>

                    </div>

                </div>


                {/* INACTIVE */}

                <div className="product-stat-card">

                    <div className="product-stat-icon">
                        ⚪
                    </div>

                    <div>

                        <span>
                            Inactive
                        </span>

                        <strong>
                            {inactiveProducts}
                        </strong>

                    </div>

                </div>


                {/* DISCONTINUED */}

                <div className="product-stat-card">

                    <div className="product-stat-icon">
                        🔴
                    </div>

                    <div>

                        <span>
                            Discontinued
                        </span>

                        <strong>
                            {discontinuedProducts}
                        </strong>

                    </div>

                </div>


                {/* LOW STOCK */}

                <div className="product-stat-card">

                    <div className="product-stat-icon">
                        ⚠️
                    </div>

                    <div>

                        <span>
                            Low Stock
                        </span>

                        <strong>
                            {lowStockProducts}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                FILTER SECTION
            ================================================= */}

            <div className="product-filter-card">


                {/* SEARCH */}

                <div className="product-search-box">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search by product, brand or category..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                    {search && (

                        <button
                            className="clear-product-search"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            ✕
                        </button>

                    )}

                </div>


                {/* STATUS FILTER */}

                <div className="product-filter-group">

                    <label>
                        Status
                    </label>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="ALL">
                            All Status
                        </option>

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="INACTIVE">
                            Inactive
                        </option>

                        <option value="DISCONTINUED">
                            Discontinued
                        </option>

                    </select>

                </div>


                {/* RESULT COUNT */}

                <div className="product-result-count">

                    <span>
                        Showing
                    </span>

                    <strong>
                        {filteredProducts.length}
                    </strong>

                    <span>
                        of {products.length} products
                    </span>

                </div>

            </div>


            {/* =================================================
                PRODUCT TABLE
            ================================================= */}

            <div className="products-table-card">


                {/* TABLE HEADER */}

                <div className="products-table-header">

                    <div>

                        <span className="product-table-label">
                            PRODUCT DIRECTORY
                        </span>

                        <h3>
                            Registered Products
                        </h3>

                    </div>

                    <span className="product-count-badge">
                        {filteredProducts.length}
                    </span>

                </div>


                {/* NO PRODUCTS */}

                {filteredProducts.length === 0 ? (

                    <div className="no-products">

                        <div className="no-products-icon">
                            🔍
                        </div>

                        <h3>
                            No Products Found
                        </h3>

                        <p>
                            Try changing your search or filters.
                        </p>

                        <button
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    <div className="products-table-wrapper">

                        <table className="products-table">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Product
                                    </th>

                                    <th>
                                        Brand
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                    <th>
                                        Stock
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Joined
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredProducts.map(
                                    (product, index) => (

                                        <tr
                                            key={product.id}
                                        >

                                            {/* NUMBER */}

                                            <td>

                                                <span className="product-row-number">
                                                    {index + 1}
                                                </span>

                                            </td>


                                            {/* PRODUCT */}

                                            <td>

                                                <div className="product-info-cell">

                                                    <div className="product-image">

                                                        {product.images &&
                                                        product.images.length > 0 ? (

                                                            <img
                                                                src={
                                                                    product.images[0]
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                            />

                                                        ) : (

                                                            <span>
                                                                📦
                                                            </span>

                                                        )}

                                                    </div>


                                                    <div>

                                                        <strong>
                                                            {product.name ||
                                                                "Unnamed Product"}
                                                        </strong>

                                                        <small>
                                                            ID:{" "}
                                                            {product.id?.slice(
                                                                0,
                                                                8
                                                            )}
                                                            ...
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* BRAND */}

                                            <td>

                                                {product.brand || (
                                                    <span className="not-available">
                                                        N/A
                                                    </span>
                                                )}

                                            </td>


                                            {/* CATEGORY */}

                                            <td>

                                                <span className="product-category">
                                                    {product.category || "N/A"}
                                                </span>

                                            </td>


                                            {/* PRICE */}

                                            <td>

                                                <strong className="product-price">
                                                    {formatPrice(
                                                        product.price
                                                    )}
                                                </strong>

                                            </td>


                                            {/* STOCK */}

                                            <td>

                                                <span
                                                    className={`product-stock ${getStockClass(
                                                        product.stock
                                                    )}`}
                                                >

                                                    {product.stock === null ||
                                                    product.stock === undefined
                                                        ? "N/A"
                                                        : product.stock}

                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={`product-status-badge ${getStatusClass(
                                                        product.status
                                                    )}`}
                                                >

                                                    <span className="product-status-dot">
                                                    </span>

                                                    {product.status}

                                                </span>

                                            </td>


                                            {/* CREATED DATE */}

                                            <td>

                                                {formatDate(
                                                    product.createdAt
                                                )}

                                            </td>


                                            {/* ACTION */}

                                            <td>

                                                <div className="product-actions">

                                                    {/* STATUS */}

                                                    <select
                                                        className="product-status-select"
                                                        value={
                                                            product.status ||
                                                            "INACTIVE"
                                                        }
                                                        disabled={
                                                            statusLoading ===
                                                            product.id
                                                        }
                                                        onChange={(event) =>
                                                            handleStatusChange(
                                                                product.id,
                                                                event.target.value
                                                            )
                                                        }
                                                    >

                                                        <option value="ACTIVE">
                                                            Active
                                                        </option>

                                                        <option value="INACTIVE">
                                                            Inactive
                                                        </option>

                                                        <option value="DISCONTINUED">
                                                            Discontinued
                                                        </option>

                                                    </select>


                                                    {/* DELETE */}

                                                    <button
                                                        className="delete-product-btn"
                                                        title="Delete Product"
                                                        disabled={
                                                            deleteLoading ===
                                                            product.id
                                                        }
                                                        onClick={() =>
                                                            handleDelete(
                                                                product
                                                            )
                                                        }
                                                    >

                                                        {deleteLoading ===
                                                        product.id
                                                            ? "..."
                                                            : "🗑️"}

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}


export default AdminProductManagement;
