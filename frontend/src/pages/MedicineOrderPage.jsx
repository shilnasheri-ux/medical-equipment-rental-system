import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMedicineById } from "../services/medicineService";

const MedicineOrderPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [quantity, setQuantity] = useState(1);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

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

    const handlePlaceOrder = () => {
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

        navigate("/pharmacy-payment", {
            state: {
                mode: "medicine",
                medicine_id: medicine.id,
                medicine_name: medicine.name,
                quantity,
                delivery_address: deliveryAddress,
                phone_number: phoneNumber,
                total_amount: Number(totalPrice),
            },
        });
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
                                ? `https://shilnasherin.pythonanywhere.com${medicine.image}`
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
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MedicineOrderPage;