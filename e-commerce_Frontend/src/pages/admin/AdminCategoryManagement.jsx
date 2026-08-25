import { useEffect, useState } from "react";
import {
    getAllCategories,
    addCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory
} from "../../service/categoryService";

import "./AdminCategoryManagement.css";


function AdminCategoryManagement() {

    // =====================================================
    // STATE
    // =====================================================

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [editingCategory, setEditingCategory] =
        useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: ""
    });


    // =====================================================
    // LOAD CATEGORIES
    // =====================================================

    const loadCategories = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getAllCategories();

            setCategories(data);

        } catch (err) {

            console.error(
                "Failed to load categories:",
                err
            );

            setError(
                "Unable to load categories."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadCategories();

    }, []);


    // =====================================================
    // FORM INPUT
    // =====================================================

    const handleInputChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    // =====================================================
    // OPEN ADD MODAL
    // =====================================================

    const openAddModal = () => {

        setEditingCategory(null);

        setFormData({
            name: "",
            description: "",
            image: ""
        });

        setShowModal(true);
    };


    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEditModal = (category) => {

        setEditingCategory(category);

        setFormData({
            name: category.name || "",
            description: category.description || "",
            image: category.image || ""
        });

        setShowModal(true);
    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {

        setShowModal(false);

        setEditingCategory(null);

        setFormData({
            name: "",
            description: "",
            image: ""
        });
    };


    // =====================================================
    // SAVE CATEGORY
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!formData.name.trim()) {

            alert("Category name is required.");

            return;
        }

        try {

            if (editingCategory) {

                await updateCategory(
                    editingCategory.id,
                    {
                        name: formData.name.trim(),
                        description:
                            formData.description.trim(),
                        image:
                            formData.image.trim()
                    }
                );

            } else {

                await addCategory({
                    name: formData.name.trim(),
                    description:
                        formData.description.trim(),
                    image:
                        formData.image.trim()
                });

            }

            closeModal();

            await loadCategories();

        } catch (err) {

            console.error(
                "Category save error:",
                err
            );

            const message =
                err?.response?.data?.message ||
                "Failed to save category.";

            alert(message);
        }
    };


    // =====================================================
    // TOGGLE STATUS
    // =====================================================

    const handleStatusToggle = async (category) => {

        const newStatus =
            category.status === "ACTIVE"
                ? "INACTIVE"
                : "ACTIVE";

        try {

            await updateCategoryStatus(
                category.id,
                newStatus
            );

            await loadCategories();

        } catch (err) {

            console.error(
                "Status update error:",
                err
            );

            alert(
                "Failed to update category status."
            );
        }
    };


    // =====================================================
    // DELETE CATEGORY
    // =====================================================

    const handleDelete = async (category) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${category.name}"?`
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteCategory(category.id);

            await loadCategories();

        } catch (err) {

            console.error(
                "Delete category error:",
                err
            );

            alert(
                "Failed to delete category."
            );
        }
    };


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredCategories =
        categories.filter((category) => {

            const searchText =
                search.toLowerCase();

            return (
                category.name
                    ?.toLowerCase()
                    .includes(searchText)
                ||
                category.description
                    ?.toLowerCase()
                    .includes(searchText)
            );
        });


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <section className="category-management">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="category-page-header">

                <div>

                    <span className="category-label">
                        PRODUCT ORGANIZATION
                    </span>

                    <h2>
                        Categories
                    </h2>

                    <p>
                        Create and manage product categories
                        for your DeluLu Cart store.
                    </p>

                </div>


                <button
                    className="category-add-button"
                    onClick={openAddModal}
                >

                    <span>+</span>

                    Add Category

                </button>

            </div>


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <div className="category-toolbar">

                <div className="category-search">

                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                <div className="category-count">

                    {filteredCategories.length}

                    {" "}

                    Categories

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="category-error">

                    <span>⚠️</span>

                    <div>

                        <strong>
                            Unable to Load Categories
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                    <button
                        onClick={loadCategories}
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && !error && (

                <div className="category-loading">

                    <div className="category-spinner"></div>

                    <p>
                        Loading categories...
                    </p>

                </div>

            )}


            {/* =================================================
                EMPTY
            ================================================= */}

            {!loading &&
                !error &&
                filteredCategories.length === 0 && (

                    <div className="category-empty">

                        <div className="empty-icon">
                            🗂️
                        </div>

                        <h3>
                            No Categories Found
                        </h3>

                        <p>

                            {search
                                ? "Try a different search."
                                : "Create your first category to get started."
                            }

                        </p>


                        {!search && (

                            <button
                                className="category-add-button"
                                onClick={openAddModal}
                            >

                                + Add Category

                            </button>

                        )}

                    </div>

                )}


            {/* =================================================
                CATEGORY TABLE
            ================================================= */}

            {!loading &&
                !error &&
                filteredCategories.length > 0 && (

                    <div className="category-card">

                        <div className="category-table-wrapper">

                            <table className="category-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Category
                                        </th>

                                        <th>
                                            Description
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Created
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredCategories.map(
                                        (category) => (

                                            <tr
                                                key={
                                                    category.id
                                                }
                                            >

                                                {/* CATEGORY */}

                                                <td>

                                                    <div className="category-info">

                                                        {category.image ? (

                                                            <img
                                                                src={
                                                                    category.image
                                                                }
                                                                alt={
                                                                    category.name
                                                                }
                                                                className="category-image"
                                                                onError={(
                                                                    event
                                                                ) => {
                                                                    event.currentTarget.style.display =
                                                                        "none";
                                                                }}
                                                            />

                                                        ) : (

                                                            <div className="category-image-placeholder">

                                                                🗂️

                                                            </div>

                                                        )}


                                                        <div>

                                                            <strong>
                                                                {
                                                                    category.name
                                                                }
                                                            </strong>

                                                            <small>
                                                                ID:{" "}
                                                                {
                                                                    category.id
                                                                }
                                                            </small>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* DESCRIPTION */}

                                                <td>

                                                    <span className="category-description">

                                                        {category.description ||
                                                            "No description"}

                                                    </span>

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    <button
                                                        className={
                                                            category.status ===
                                                            "ACTIVE"
                                                                ? "category-status active"
                                                                : "category-status inactive"
                                                        }
                                                        onClick={() =>
                                                            handleStatusToggle(
                                                                category
                                                            )
                                                        }
                                                    >

                                                        <span></span>

                                                        {
                                                            category.status
                                                        }

                                                    </button>

                                                </td>


                                                {/* CREATED */}

                                                <td>

                                                    <span className="category-date">

                                                        {category.createdAt
                                                            ? new Date(
                                                                  category.createdAt
                                                              ).toLocaleDateString()
                                                            : "-"
                                                        }

                                                    </span>

                                                </td>


                                                {/* ACTIONS */}

                                                <td>

                                                    <div className="category-actions">

                                                        <button
                                                            className="category-edit"
                                                            title="Edit"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    category
                                                                )
                                                            }
                                                        >
                                                            ✏️
                                                        </button>


                                                        <button
                                                            className="category-delete"
                                                            title="Delete"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    category
                                                                )
                                                            }
                                                        >
                                                            🗑️
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}


            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

            {showModal && (

                <div
                    className="category-modal-overlay"
                    onClick={closeModal}
                >

                    <div
                        className="category-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="category-modal-header">

                            <div>

                                <span>
                                    CATEGORY MANAGEMENT
                                </span>

                                <h2>
                                    {editingCategory
                                        ? "Edit Category"
                                        : "Add Category"
                                    }
                                </h2>

                            </div>


                            <button
                                className="category-modal-close"
                                onClick={closeModal}
                            >
                                ✕
                            </button>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                        >

                            <div className="category-form-group">

                                <label>
                                    Category Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter category name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    required
                                />

                            </div>


                            <div className="category-form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    placeholder="Enter category description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    rows="4"
                                />

                            </div>


                            <div className="category-form-group">

                                <label>
                                    Image URL
                                </label>

                                <input
                                    type="url"
                                    name="image"
                                    placeholder="https://example.com/image.jpg"
                                    value={
                                        formData.image
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                />

                                <small>
                                    Paste a public image URL.
                                </small>

                            </div>


                            <div className="category-modal-actions">

                                <button
                                    type="button"
                                    className="category-cancel-button"
                                    onClick={
                                        closeModal
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="category-save-button"
                                >

                                    {editingCategory
                                        ? "Update Category"
                                        : "Create Category"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </section>
    );
}

export default AdminCategoryManagement;