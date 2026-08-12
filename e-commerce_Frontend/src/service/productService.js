import api from "./api";

// =====================================================
// ADD PRODUCT
// =====================================================

export const addProduct = async (product) => {

    const response = await api.post(
        "/api/products",
        product
    );

    return response.data;
};


// =====================================================
// GET ALL PRODUCTS
// =====================================================

export const getAllProducts = async () => {

    const response = await api.get(
        "/api/products"
    );

    return response.data;
};


// =====================================================
// GET PRODUCT BY ID
// =====================================================

export const getProductById = async (id) => {

    const response = await api.get(
        `/api/products/${id}`
    );

    return response.data;
};


// =====================================================
// GET PRODUCTS BY SELLER
// =====================================================

export const getProductsBySeller = async (sellerId) => {

    const response = await api.get(
        `/api/products/seller/${sellerId}`
    );

    return response.data;
};


// =====================================================
// GET PRODUCTS BY CATEGORY
// =====================================================

export const getProductsByCategory = async (category) => {

    const response = await api.get(
        `/api/products/category/${category}`
    );

    return response.data;
};


// =====================================================
// GET PRODUCTS BY STATUS
// =====================================================

export const getProductsByStatus = async (status) => {

    const response = await api.get(
        `/api/products/status/${status}`
    );

    return response.data;
};


// =====================================================
// SEARCH PRODUCTS
// =====================================================

export const searchProductsByName = async (name) => {

    const response = await api.get(
        "/api/products/search",
        {
            params: {
                name: name
            }
        }
    );

    return response.data;
};


// =====================================================
// UPDATE PRODUCT
// =====================================================

export const updateProduct = async (
    id,
    product
) => {

    const response = await api.put(
        `/api/products/${id}`,
        product
    );

    return response.data;
};


// =====================================================
// UPDATE PRODUCT STATUS
// =====================================================

export const updateProductStatus = async (
    id,
    status
) => {

    const response = await api.patch(
        `/api/products/${id}/status`,
        null,
        {
            params: {
                status: status
            }
        }
    );

    return response.data;
};


// =====================================================
// DELETE PRODUCT
// =====================================================

export const deleteProduct = async (id) => {

    const response = await api.delete(
        `/api/products/${id}`
    );

    return response.data;
};