import api from "./api";

export const addProduct = async (product) => {
    const response = await api.post(
        "/products",
        product
    );

    return response.data;
};

export const getAllProducts = async () => {
    const response = await api.get(
        "/products"
    );

    return response.data;
};

export const getProductById = async (id) => {
    const response = await api.get(
        `/products/${id}`
    );

    return response.data;
};

export const getProductsBySeller = async (sellerId) => {
    const response = await api.get(
        `/products/seller/${sellerId}`
    );

    return response.data;
};

export const updateProduct = async (
    id,
    product
) => {
    const response = await api.put(
        `/products/${id}`,
        product
    );

    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(
        `/products/${id}`
    );

    return response.data;
};