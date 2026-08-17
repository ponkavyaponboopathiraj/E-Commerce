import axios from "axios";

const API_URL = "http://localhost:8080/api/notifications";

// Get all notifications for seller
export const getSellerNotifications = async (sellerId) => {
    const response = await axios.get(
        `${API_URL}/seller/${sellerId}`
    );

    return response.data;
};

// Get unread notifications
export const getUnreadNotifications = async (sellerId) => {
    const response = await axios.get(
        `${API_URL}/seller/${sellerId}/unread`
    );

    return response.data;
};

// Mark one notification as read
export const markNotificationAsRead = async (notificationId) => {
    const response = await axios.patch(
        `${API_URL}/${notificationId}/read`
    );

    return response.data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (sellerId) => {
    const response = await axios.patch(
        `${API_URL}/seller/${sellerId}/read-all`
    );

    return response.data;
};