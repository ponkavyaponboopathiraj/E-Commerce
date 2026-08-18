import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const placeOrder = async (orderData) => {

    const response = await axios.post(
        `${API_BASE_URL}/api/orders`,
        orderData
    );

    return response.data;
};


export const getOrdersBySeller = async (sellerId) => {

    const response = await axios.get(
        `${API_BASE_URL}/api/orders/seller/${sellerId}`
    );

    return response.data;
};


export const getOrdersByCustomer = async (customerId) => {

    const response = await axios.get(
        `${API_BASE_URL}/api/orders/customer/${customerId}`
    );

    return response.data;
};