import { useEffect, useMemo, useState } from "react";
import { getAllUsers } from "../../service/adminService";
import "./AdminUserManagement.css";

function AdminUserManagement() {

    // =====================================================
    // STATES
    // =====================================================

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [roleFilter, setRoleFilter] = useState("ALL");

    const [statusFilter, setStatusFilter] = useState("ALL");


    // =====================================================
    // LOAD ALL USERS
    // =====================================================

    const loadUsers = async () => {

        try {

            setLoading(true);

            setError("");

            const data = await getAllUsers();

            setUsers(data);

        } catch (error) {

            console.error(
                "Failed to load users:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load users."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadUsers();

    }, []);


    // =====================================================
    // FILTER USERS
    // =====================================================

    const filteredUsers = useMemo(() => {

        return users.filter((user) => {

            // ---------------------------------------------
            // SEARCH
            // ---------------------------------------------

            const searchValue =
                search
                    .toLowerCase()
                    .trim();

            const fullName =
                `${user.firstName || ""} ${user.lastName || ""}`
                    .toLowerCase();

            const email =
                (user.email || "")
                    .toLowerCase();

            const phone =
                (user.phoneNumber || "")
                    .toLowerCase();

            const matchesSearch =
                !searchValue ||
                fullName.includes(searchValue) ||
                email.includes(searchValue) ||
                phone.includes(searchValue);


            // ---------------------------------------------
            // ROLE FILTER
            // ---------------------------------------------

            const matchesRole =
                roleFilter === "ALL" ||
                user.role === roleFilter;


            // ---------------------------------------------
            // STATUS FILTER
            // ---------------------------------------------

            const matchesStatus =
                statusFilter === "ALL" ||
                user.status === statusFilter;


            return (
                matchesSearch &&
                matchesRole &&
                matchesStatus
            );

        });

    }, [
        users,
        search,
        roleFilter,
        statusFilter
    ]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalUsers =
        users.length;

    const totalCustomers =
        users.filter(
            (user) =>
                user.role === "CUSTOMER"
        ).length;

    const totalSellers =
        users.filter(
            (user) =>
                user.role === "SELLER"
        ).length;

    const totalAdmins =
        users.filter(
            (user) =>
                user.role === "ADMIN"
        ).length;

    const activeUsers =
        users.filter(
            (user) =>
                user.status === "ACTIVE"
        ).length;


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
    // ROLE BADGE
    // =====================================================

    const getRoleClass = (role) => {

        switch (role) {

            case "ADMIN":
                return "user-role-admin";

            case "SELLER":
                return "user-role-seller";

            case "CUSTOMER":
                return "user-role-customer";

            default:
                return "user-role-default";
        }
    };


    // =====================================================
    // STATUS BADGE
    // =====================================================

    const getStatusClass = (status) => {

        switch (status) {

            case "ACTIVE":
                return "user-status-active";

            case "BLOCKED":
                return "user-status-blocked";

            case "PENDING_APPROVAL":
                return "user-status-pending";

            case "REJECTED":
                return "user-status-rejected";

            default:
                return "user-status-default";
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="users-loading">

                <div className="users-loader"></div>

                <h2>
                    Loading Users...
                </h2>

                <p>
                    Please wait while we fetch user data.
                </p>

            </div>

        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="users-error">

                <div className="users-error-icon">
                    ⚠️
                </div>

                <h2>
                    Unable to Load Users
                </h2>

                <p>
                    {error}
                </p>

                <button
                    className="users-retry-btn"
                    onClick={loadUsers}
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

        <div className="user-management-container">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="user-management-header">

                <div>

                    <span className="user-management-label">
                        USER MANAGEMENT
                    </span>

                    <h2>
                        All Users
                    </h2>

                    <p>
                        Manage customers, sellers and administrators
                        from one place.
                    </p>

                </div>


                <button
                    className="refresh-users-btn"
                    onClick={loadUsers}
                >
                    🔄 Refresh
                </button>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="user-stats-grid">


                {/* TOTAL USERS */}

                <div className="user-stat-card">

                    <div className="user-stat-icon">
                        👥
                    </div>

                    <div>

                        <span>
                            Total Users
                        </span>

                        <strong>
                            {totalUsers}
                        </strong>

                    </div>

                </div>


                {/* CUSTOMERS */}

                <div className="user-stat-card">

                    <div className="user-stat-icon">
                        🛍️
                    </div>

                    <div>

                        <span>
                            Customers
                        </span>

                        <strong>
                            {totalCustomers}
                        </strong>

                    </div>

                </div>


                {/* SELLERS */}

                <div className="user-stat-card">

                    <div className="user-stat-icon">
                        🏪
                    </div>

                    <div>

                        <span>
                            Sellers
                        </span>

                        <strong>
                            {totalSellers}
                        </strong>

                    </div>

                </div>


                {/* ADMINS */}

                <div className="user-stat-card">

                    <div className="user-stat-icon">
                        👑
                    </div>

                    <div>

                        <span>
                            Admins
                        </span>

                        <strong>
                            {totalAdmins}
                        </strong>

                    </div>

                </div>


                {/* ACTIVE */}

                <div className="user-stat-card">

                    <div className="user-stat-icon">
                        🟢
                    </div>

                    <div>

                        <span>
                            Active Users
                        </span>

                        <strong>
                            {activeUsers}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                FILTER SECTION
            ================================================= */}

            <div className="user-filter-card">


                {/* SEARCH */}

                <div className="user-search-box">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                    {search && (

                        <button
                            className="clear-search"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            ✕
                        </button>

                    )}

                </div>


                {/* ROLE FILTER */}

                <div className="user-filter-group">

                    <label>
                        Role
                    </label>

                    <select
                        value={roleFilter}
                        onChange={(event) =>
                            setRoleFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="ALL">
                            All Roles
                        </option>

                        <option value="CUSTOMER">
                            Customer
                        </option>

                        <option value="SELLER">
                            Seller
                        </option>

                        <option value="ADMIN">
                            Admin
                        </option>

                    </select>

                </div>


                {/* STATUS FILTER */}

                <div className="user-filter-group">

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

                        <option value="BLOCKED">
                            Blocked
                        </option>

                        <option value="PENDING_APPROVAL">
                            Pending Approval
                        </option>

                        <option value="REJECTED">
                            Rejected
                        </option>

                    </select>

                </div>


                {/* RESULT COUNT */}

                <div className="user-result-count">

                    <span>
                        Showing
                    </span>

                    <strong>
                        {filteredUsers.length}
                    </strong>

                    <span>
                        of {users.length} users
                    </span>

                </div>

            </div>


            {/* =================================================
                USERS TABLE
            ================================================= */}

            <div className="users-table-card">

                <div className="users-table-header">

                    <div>

                        <span className="user-table-label">
                            USER DIRECTORY
                        </span>

                        <h3>
                            Registered Users
                        </h3>

                    </div>

                    <span className="user-count-badge">

                        {filteredUsers.length}

                    </span>

                </div>


                {filteredUsers.length === 0 ? (

                    /* =================================================
                       NO USERS FOUND
                    ================================================= */

                    <div className="no-users">

                        <div className="no-users-icon">
                            🔍
                        </div>

                        <h3>
                            No Users Found
                        </h3>

                        <p>
                            Try changing your search or filters.
                        </p>

                        <button
                            onClick={() => {

                                setSearch("");
                                setRoleFilter("ALL");
                                setStatusFilter("ALL");

                            }}
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    /* =================================================
                       TABLE
                    ================================================= */

                    <div className="users-table-wrapper">

                        <table className="users-table">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        User
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        Role
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

                                {filteredUsers.map(
                                    (user, index) => (

                                        <tr
                                            key={user.id}
                                        >

                                            {/* NUMBER */}

                                            <td>

                                                <span className="user-row-number">
                                                    {index + 1}
                                                </span>

                                            </td>


                                            {/* USER */}

                                            <td>

                                                <div className="user-info-cell">

                                                    <div className="user-avatar">

                                                        {user.firstName
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {user.firstName}{" "}
                                                            {user.lastName}
                                                        </strong>

                                                        <small>
                                                            ID:{" "}
                                                            {user.id?.slice(
                                                                0,
                                                                8
                                                            )}
                                                            ...
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* EMAIL */}

                                            <td>

                                                <span className="user-email">

                                                    {user.email}

                                                </span>

                                            </td>


                                            {/* PHONE */}

                                            <td>

                                                {user.phoneNumber || (
                                                    <span className="not-available">
                                                        N/A
                                                    </span>
                                                )}

                                            </td>


                                            {/* ROLE */}

                                            <td>

                                                <span
                                                    className={`user-role-badge ${getRoleClass(
                                                        user.role
                                                    )}`}
                                                >

                                                    {user.role}

                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={`user-status-badge ${getStatusClass(
                                                        user.status
                                                    )}`}
                                                >

                                                    <span className="status-dot">
                                                    </span>

                                                    {user.status}

                                                </span>

                                            </td>


                                            {/* CREATED DATE */}

                                            <td>

                                                {formatDate(
                                                    user.createdAt
                                                )}

                                            </td>


                                            {/* ACTION */}

                                            <td>

                                                <button
                                                    className="view-user-btn"
                                                    title="View User"
                                                    onClick={() =>
                                                        alert(
                                                            `User: ${user.firstName} ${user.lastName}\nEmail: ${user.email}`
                                                        )
                                                    }
                                                >
                                                    👁️
                                                </button>

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

export default AdminUserManagement;