import axios from "axios";

// ==========================================
// BASE URL
// ==========================================

const BASE_URL = "http://localhost:8080/api/auth";


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
// GET ALL PENDING SELLERS
// ==========================================

export const getPendingSellers = async () => {

    const response = await axios.get(

        `${BASE_URL}/admin/pending-sellers`,

        getHeaders()

    );

    return response.data;

};


// ==========================================
// APPROVE SELLER
// ==========================================

export const approveSeller = async (sellerId) => {

    const response = await axios.put(

        `${BASE_URL}/admin/approve-seller/${sellerId}`,

        {},

        getHeaders()

    );

    return response.data;

};