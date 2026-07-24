import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMedicineById, placeMedicineOrder } from "../services/medicineService";

const MedicineOrderPage = () => {
    const { id } = useParams();

    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [quantity, setQuantity] = useState(1);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [placingOrder, setPlacingOrder] = useState(false);
    const [orderError, setOrderError] = useState(null);

    useEffect(() => {
        const fetchMedicine = async () => {
            try {
                setLoading(true);
                const response = await getMedicineById(id);
                setMedicine(response.data.medicine);
            } catch (err) {
                setError("Failed to load medicine details.");
            } finally {
                setLoading(false);
            }
        };

        fetchMedicine();
    }, [id]);

    const totalPrice = medicine ? (medicine.price * quantity).toFixed(2) : 0;

    const handlePlaceOrder = async () => {
        setOrderError(null);

        if (!quantity || quantity <= 0) {
            setOrderError("Quantity must be greater than 0.");
            return;
        }

        if (!deliveryAddress.trim()) {
            setOrderError("Delivery address cannot be empty.");
            return;
        }

        if (!phoneNumber.trim()) {
            setOrderError("Phone number cannot be empty.");
            return;
        }

        const payload = {
            medicine: medicine.id,
            quantity: quantity,
            delivery_address: deliveryAddress,
            phone_number: phoneNumber
        };

        try {
            setPlacingOrder(true);
            const response = await placeMedicineOrder(payload);

            if (response.data.success) {
                alert(response.data.message || "Medicine order placed successfully.");
                setQuantity(1);
                setDeliveryAddress("");
                setPhoneNumber("");
            } else {
                setOrderError(
                    response.data.errors
                        ? JSON.stringify(response.data.errors)
                        : "Failed to place order."
                );
            }
        } catch (err) {
            setOrderError(
                err.response?.data?.errors
                    ? JSON.stringify(err.response.data.errors)
                    : "Failed to place order. Please try again."
            );
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) {
        return <div className="container mt-4">Loading medicine details...</div>;
    }

    if (error) {
        return <div className="container mt-4 text-danger">{error}</div>;
    }

    if (!medicine) {
        return <div className="container mt-4">Medicine not found.</div>;
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-5">
                    <img
                        src={
                            medicine.image
                                ? `http://127.0.0.1:8000${medicine.image}`
                                : "https://dummyimage.com/400x300/e9ecef/6c757d&text=Medicine"
                        }
                        alt={medicine.name}
                        className="img-fluid rounded"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                "https://dummyimage.com/400x300/e9ecef/6c757d&text=Medicine";
                        }}
                    />
                </div>

                <div className="col-md-7">
                    <h3>{medicine.name}</h3>
                    <p><strong>Price:</strong> ₹{medicine.price}</p>

                    <div className="mb-3">
                        <label className="form-label">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            className="form-control"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Delivery Address</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="text"
                            className="form-control"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <strong>Total Price: ₹{totalPrice}</strong>
                    </div>

                    {orderError && (
                        <div className="alert alert-danger" role="alert">
                            {orderError}
                        </div>
                    )}

                    <button
                        className="btn btn-primary"
                        onClick={handlePlaceOrder}
                        disabled={placingOrder}
                    >
                        {placingOrder ? "Placing Order..." : "Place Order"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MedicineOrderPage;