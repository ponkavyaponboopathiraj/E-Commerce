import { useEffect, useState } from "react";
import axios from "axios";
import "./PendingSellerRequests.css";
import { approveSeller, rejectSeller } 
from "../../service/adminService";

const BASE_URL = "http://localhost:8080/api/auth";

function PendingSellerRequests() {

    const [pendingSellers, setPendingSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    // ==========================================
    // LOAD PENDING SELLERS
    // ==========================================

    const loadPendingSellers = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${BASE_URL}/admin/pending-sellers`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPendingSellers(response.data);

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to load pending sellers."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // APPROVE SELLER
    // ==========================================

    const approveSeller = async (sellerId) => {

        try {

            setProcessingId(sellerId);

            const token = localStorage.getItem("token");

            await axios.put(

                `${BASE_URL}/admin/approve-seller/${sellerId}`,

                {},

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            alert("Seller Approved Successfully ✅");

            loadPendingSellers();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Approval Failed"
            );

        } finally {

            setProcessingId(null);

        }

    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        loadPendingSellers();

    }, []);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="pending-loading">

                <div className="loader"></div>

                <h2>Loading Seller Requests...</h2>

            </div>

        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="pending-container">

            <div className="pending-header">

                <div>

                    <span className="pending-label">
                        ADMIN APPROVAL
                    </span>

                    <h2>Pending Seller Requests</h2>

                </div>

                <div className="pending-count">

                    {pendingSellers.length}

                </div>

            </div>


            {

                pendingSellers.length === 0 ?

                (

                    <div className="empty-state">

                        <div className="empty-icon">

                            ✅

                        </div>

                        <h3>No Pending Seller Requests</h3>

                        <p>

                            Every seller has already been approved.

                        </p>

                    </div>

                )

                :

                (

                    <table className="pending-table">

                        <thead>

                            <tr>

                                <th>Name</th>

                                <th>Email</th>

                                <th>Phone</th>

                                <th>Status</th>

                                <th>Action</th>

                            </tr>

                        </thead>


                        <tbody>

                            {

                                pendingSellers.map((seller) => (

                                    <tr key={seller.id}>

                                        <td>

                                            {seller.firstName}{" "}
                                            {seller.lastName}

                                        </td>

                                        <td>

                                            {seller.email}

                                        </td>

                                        <td>

                                            {seller.phoneNumber}

                                        </td>

                                        <td>

                                            <span
                                                className="status-pending"
                                            >

                                                Pending Approval

                                            </span>

                                        </td>

                                        <td>

                                            <button

                                                className="approve-btn"

                                                disabled={
                                                    processingId === seller.id
                                                }

                                                onClick={() =>
                                                    approveSeller(seller.id)
                                                }

                                            >

                                                {

                                                    processingId === seller.id

                                                        ?

                                                        "Approving..."

                                                        :

                                                        "Approve"

                                                }

                                            </button>
                                            <button

    className="reject-btn"

    onClick={() => handleReject(seller.id)}

>

    Reject

</button>


                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                )

            }

        </div>

    );

}

export default PendingSellerRequests;