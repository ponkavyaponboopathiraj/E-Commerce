import axios from "axios";

const BASE_URL = "http://localhost:8080/api/categories";

// =====================================================
// GET JWT TOKEN
// =====================================================

const getToken = () => {
    return localStorage.getItem("token");
};


// =====================================================
// COMMON HEADERS
// =====================================================

const getHeaders = () => {
    return {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    };
};


// =====================================================
// GET ALL CATEGORIES
// =====================================================

export const getAllCategories = async () => {

    const response = await axios.get(
        BASE_URL,
        getHeaders()
    );

    return response.data;
};


// =====================================================
// GET CATEGORY BY ID
// =====================================================

export const getCategoryById = async (id) => {

    const response = await axios.get(
        `${BASE_URL}/${id}`,
        getHeaders()
    );

    return response.data;
};


// =====================================================
// SEARCH CATEGORIES
// =====================================================

export const searchCategories = async (name) => {

    const response = await axios.get(
        `${BASE_URL}/search`,
        {
            ...getHeaders(),
            params: {
                name
            }
        }
    );

    return response.data;
};


// =====================================================
// GET CATEGORIES BY STATUS
// =====================================================

export const getCategoriesByStatus = async (status) => {

    const response = await axios.get(
        `${BASE_URL}/status/${status}`,
        getHeaders()
    );

    return response.data;
};


// =====================================================
// ADD CATEGORY
// =====================================================

export const addCategory = async (category) => {

    const response = await axios.post(
        BASE_URL,
        category,
        getHeaders()
    );

    return response.data;
};


// =====================================================
// UPDATE CATEGORY
// =====================================================

export const updateCategory = async (
    id,
    category
) => {

    const response = await axios.put(
        `${BASE_URL}/${id}`,
        category,
        getHeaders()
    );

    return response.data;
};


// =====================================================
// UPDATE CATEGORY STATUS
// =====================================================

export const updateCategoryStatus = async (
    id,
    status
) => {

    const response = await axios.patch(
        `${BASE_URL}/${id}/status`,
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


// =====================================================
// DELETE CATEGORY
// =====================================================

export const deleteCategory = async (id) => {

    const response = await axios.delete(
        `${BASE_URL}/${id}`,
        getHeaders()
    );

    return response.data;
};