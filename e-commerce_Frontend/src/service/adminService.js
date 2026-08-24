
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/auth";
const PRODUCT_BASE_URL = "http://localhost:8080/api/admin";
const ORDER_BASE_URL = "http://localhost:8080/api/orders";

// ==========================================
// GET JWT TOKEN
// ==========================================

const getToken = () => {
    return localStorage.getItem("token");
};


// ==========================================
// COMMON HEADERS
// ==========================================

const getHeaders = () => {

    return {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    };

};


// ==========================================
// USERS
// ==========================================

// GET ALL USERS

export const getAllUsers = async () => {

    const response = await axios.get(
        `${BASE_URL}/admin/users`,
        getHeaders()
    );

    return response.data;
};


// ==========================================
// PENDING SELLERS
// ==========================================

// GET ALL PENDING SELLERS

export const getPendingSellers = async () => {

    const response = await axios.get(
        `${BASE_URL}/admin/pending-sellers`,
        getHeaders()
    );

    return response.data;
};


// APPROVE SELLER

export const approveSeller = async (sellerId) => {

    const response = await axios.put(
        `${BASE_URL}/admin/approve-seller/${sellerId}`,
        {},
        getHeaders()
    );

    return response.data;
};


// REJECT SELLER

export const rejectSeller = async (sellerId) => {

    const response = await axios.put(
        `${BASE_URL}/admin/reject-seller/${sellerId}`,
        {},
        getHeaders()
    );

    return response.data;
};


// ==========================================
// PRODUCTS
// ==========================================

// GET ALL PRODUCTS - ADMIN

export const getAllAdminProducts = async () => {

    const response = await axios.get(
        `${PRODUCT_BASE_URL}/products`,
        getHeaders()
    );

    return response.data;
};


// ==========================================
// GET PRODUCT BY ID - ADMIN
// ==========================================

export const getAdminProductById = async (id) => {

    const response = await axios.get(
        `${PRODUCT_BASE_URL}/products/${id}`,
        getHeaders()
    );

    return response.data;
};


// ==========================================
// GET PRODUCTS BY STATUS - ADMIN
// ==========================================

export const getAdminProductsByStatus = async (status) => {

    const response = await axios.get(
        `${PRODUCT_BASE_URL}/products/status/${status}`,
        getHeaders()
    );

    return response.data;
};


// ==========================================
// SEARCH PRODUCTS - ADMIN
// ==========================================

export const searchAdminProducts = async (name) => {

    const response = await axios.get(
        `${PRODUCT_BASE_URL}/products/search`,
        {
            ...getHeaders(),
            params: {
                name
            }
        }
    );

    return response.data;
};


// ==========================================
// UPDATE PRODUCT - ADMIN
// ==========================================

export const updateAdminProduct = async (
    id,
    product
) => {

    const response = await axios.put(
        `${PRODUCT_BASE_URL}/products/${id}`,
        product,
        getHeaders()
    );

    return response.data;
};


// ==========================================
// UPDATE PRODUCT STATUS - ADMIN
// ==========================================

export const updateAdminProductStatus = async (
    id,
    status
) => {

    const response = await axios.patch(
        `${PRODUCT_BASE_URL}/products/${id}/status`,
        null,
        {
            ...getHeaders(),
            params: {
                status
            }
        }
    );

    return response.data;
};


// ==========================================
// DELETE PRODUCT - ADMIN
// ==========================================

export const deleteAdminProduct = async (id) => {

    const response = await axios.delete(
        `${PRODUCT_BASE_URL}/products/${id}`,
        getHeaders()
    );

    return response.data;
};
// ==========================================
// GET ALL ORDERS
// ==========================================

export const getAllOrders = async () => {

    const response = await axios.get(
        "http://localhost:8080/api/orders",
        getHeaders()
    );

    return response.data;
};


// ==========================================
// GET ORDER BY ID
// ==========================================

export const getOrderById = async (orderId) => {

    const response = await axios.get(
        `http://localhost:8080/api/orders/${orderId}`,
        getHeaders()
    );

    return response.data;
};


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

export const updateOrderStatus = async (
    orderId,
    status
) => {

    const response = await axios.patch(
        `http://localhost:8080/api/orders/${orderId}/status`,
        {},
        {
            ...getHeaders(),
            params: {
                status
            }
        }
    );

    return response.data;
};


// ==========================================
// CANCEL ORDER
// ==========================================

export const cancelOrder = async (orderId) => {

    const response = await axios.patch(
        `http://localhost:8080/api/orders/${orderId}/cancel`,
        {},
        getHeaders()
    );

    return response.data;
};