import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRecoveryKits } from "../services/recoveryKitService";

const CONDITIONS = [
    "Knee Surgery",
    "Hip Surgery",
    "Leg Fracture",
    "Elderly Care",
    "Respiratory Problems",
    "Back Pain",
];

const RecoveryKitPage = () => {
    const navigate = useNavigate();

    const [kits, setKits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCondition, setSelectedCondition] = useState("");
    const [selectedKit, setSelectedKit] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchKits = async () => {
            try {
                setLoading(true);
                const response = await getRecoveryKits();
                setKits(response.data.results);
            } catch (err) {
                setError("Failed to load recovery kits.");
            } finally {
                setLoading(false);
            }
        };

        fetchKits();
    }, []);

    const handleConditionChange = (e) => {
        const condition = e.target.value;
        setSelectedCondition(condition);

        if (!condition) {
            setSelectedKit(null);
            setNotFound(false);
            return;
        }

        const matchedKit = kits.find(
            (kit) => kit.condition_name === condition
        );

        if (matchedKit) {
            setSelectedKit(matchedKit);
            setNotFound(false);
        } else {
            setSelectedKit(null);
            setNotFound(true);
        }
    };

    const handleBookKit = () => {
        // Booking logic to be implemented in a future step.
        // Until it exists, send the user to the equipment catalogue
        // instead of leaving the button non-functional.
        navigate("/equipment");
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div
                    className="spinner-border"
                    style={{ color: "var(--blue-500)", width: "2.4rem", height: "2.4rem" }}
                    role="status"
                >
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p
                    className="mt-3 mb-0"
                    style={{ fontFamily: "'Poppins', sans-serif", color: "#64748B" }}
                >
                    Loading recovery kits...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    // Presentational-only parsing: the underlying field on selectedKit
    // stays exactly as provided by the API (recommended_equipment is not
    // mutated or re-shaped in state). This just splits the display string
    // into chip labels; a non-comma-separated string still renders as a
    // single chip.
    const equipmentChips = selectedKit
        ? String(selectedKit.recommended_equipment)
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
        : [];

    return (
        <div style={{ backgroundColor: "#FFFFFF", minHeight: "100vh", padding: "4rem 0" }}>
            <div className="container">
                <div className="row g-5">

                    {/* ── Left: heading + condition selector ── */}
                    <div className="col-12 col-lg-5">
                        <span
                            className="d-block mb-3"
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                                letterSpacing: "1.5px",
                                textTransform: "uppercase",
                                color: "var(--blue-500)",
                            }}
                        >
                            Recovery Support
                        </span>

                        <h1
                            style={{
                                fontFamily: "'Sora', sans-serif",
                                fontSize: "clamp(1.9rem, 4vw, 2.6rem)",
                                fontWeight: 800,
                                color: "var(--blue-900)",
                                marginBottom: "0.75rem",
                                lineHeight: 1.2,
                            }}
                        >
                            Home Recovery Kits
                        </h1>

                        <p
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: "0.98rem",
                                color: "#64748B",
                                lineHeight: 1.75,
                                marginBottom: "2rem",
                                maxWidth: 420,
                            }}
                        >
                            Select your condition to get a recommended recovery package.
                        </p>

                        <div style={{ maxWidth: 420 }}>
                            <label
                                className="form-label"
                                style={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontWeight: 600,
                                    fontSize: "0.85rem",
                                    color: "var(--blue-900)",
                                }}
                            >
                                Select Condition
                            </label>
                            <select
                                className="form-select"
                                value={selectedCondition}
                                onChange={handleConditionChange}
                                style={{
                                    borderRadius: "14px",
                                    border: "1px solid var(--glass-border)",
                                    padding: "0.75rem 1rem",
                                    fontFamily: "'Poppins', sans-serif",
                                    fontSize: "0.92rem",
                                    color: "var(--blue-900)",
                                    boxShadow: "0 2px 10px rgba(15,76,150,0.06)",
                                }}
                            >
                                <option value="">-- Select a condition --</option>
                                {CONDITIONS.map((condition) => (
                                    <option key={condition} value={condition}>
                                        {condition}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {notFound && (
                            <div
                                className="alert alert-warning mt-4"
                                role="alert"
                                style={{
                                    borderRadius: "16px",
                                    fontFamily: "'Poppins', sans-serif",
                                    fontSize: "0.9rem",
                                    maxWidth: 420,
                                }}
                            >
                                No recovery kit found for this condition yet.
                            </div>
                        )}
                    </div>

                    {/* ── Right: premium kit card ── */}
                    <div className="col-12 col-lg-7">
                        {selectedKit ? (
                            <div
                                style={{
                                    background: "#FFFFFF",
                                    border: "1px solid var(--glass-border)",
                                    borderRadius: "24px",
                                    boxShadow: "0 12px 40px rgba(15,76,150,0.08)",
                                    padding: "2rem",
                                }}
                            >
                                {/* Condition name */}
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <span style={{ fontSize: "1.5rem" }} aria-hidden="true">🏥</span>
                                    <h2
                                        style={{
                                            fontFamily: "'Sora', sans-serif",
                                            fontSize: "1.4rem",
                                            fontWeight: 800,
                                            color: "var(--blue-900)",
                                            margin: 0,
                                        }}
                                    >
                                        {selectedKit.condition_name}
                                    </h2>
                                </div>

                                {/* Recommended equipment chips */}
                                <div className="mb-4">
                                    <span
                                        className="d-block mb-2"
                                        style={{
                                            fontFamily: "'Poppins', sans-serif",
                                            fontSize: "0.78rem",
                                            fontWeight: 600,
                                            letterSpacing: "0.5px",
                                            textTransform: "uppercase",
                                            color: "#64748B",
                                        }}
                                    >
                                        Recommended Equipment
                                    </span>
                                    <div className="d-flex flex-wrap">
                                        {equipmentChips.map((item) => (
                                            <span
                                                key={item}
                                                className="d-inline-flex align-items-center me-2 mb-2"
                                                style={{
                                                    background: "var(--blue-50)",
                                                    color: "var(--blue-700)",
                                                    borderRadius: "999px",
                                                    padding: "0.45rem 0.95rem",
                                                    fontFamily: "'Poppins', sans-serif",
                                                    fontSize: "0.82rem",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Stat cards */}
                                <div className="row g-3 mb-4">
                                    <div className="col-4">
                                        <div
                                            style={{
                                                background: "var(--blue-50)",
                                                borderRadius: "16px",
                                                padding: "1rem",
                                                textAlign: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontFamily: "'Poppins', sans-serif",
                                                    fontSize: "0.7rem",
                                                    fontWeight: 600,
                                                    color: "#64748B",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.4px",
                                                    marginBottom: "0.35rem",
                                                }}
                                            >
                                                Rental Cost
                                            </div>
                                            <div
                                                style={{
                                                    fontFamily: "'Sora', sans-serif",
                                                    fontSize: "1.15rem",
                                                    fontWeight: 800,
                                                    color: "var(--blue-700)",
                                                }}
                                            >
                                                ₹{selectedKit.estimated_cost}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div
                                            style={{
                                                background: "var(--blue-50)",
                                                borderRadius: "16px",
                                                padding: "1rem",
                                                textAlign: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontFamily: "'Poppins', sans-serif",
                                                    fontSize: "0.7rem",
                                                    fontWeight: 600,
                                                    color: "#64748B",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.4px",
                                                    marginBottom: "0.35rem",
                                                }}
                                            >
                                                Recovery
                                            </div>
                                            <div
                                                style={{
                                                    fontFamily: "'Sora', sans-serif",
                                                    fontSize: "1.15rem",
                                                    fontWeight: 800,
                                                    color: "var(--blue-700)",
                                                }}
                                            >
                                                {selectedKit.recovery_days} Days
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div
                                            style={{
                                                background: "var(--blue-50)",
                                                borderRadius: "16px",
                                                padding: "1rem",
                                                textAlign: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontFamily: "'Poppins', sans-serif",
                                                    fontSize: "0.7rem",
                                                    fontWeight: 600,
                                                    color: "#64748B",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.4px",
                                                    marginBottom: "0.35rem",
                                                }}
                                            >
                                                Delivery
                                            </div>
                                            <div
                                                style={{
                                                    fontFamily: "'Sora', sans-serif",
                                                    fontSize: "1.15rem",
                                                    fontWeight: 800,
                                                    color: "var(--blue-700)",
                                                }}
                                            >
                                                Same Day
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Why this kit */}
                                <div
                                    style={{
                                        background: "#F8FBFF",
                                        border: "1px solid var(--glass-border)",
                                        borderRadius: "18px",
                                        padding: "1.25rem 1.5rem",
                                        marginBottom: "2rem",
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontFamily: "'Sora', sans-serif",
                                            fontSize: "1rem",
                                            fontWeight: 700,
                                            color: "var(--blue-900)",
                                            marginBottom: "0.85rem",
                                        }}
                                    >
                                        Why this kit?
                                    </h3>
                                    <ul className="list-unstyled mb-0">
                                        {[
                                            "Hospital sanitized",
                                            "Home delivery available",
                                            "Doctor recommended equipment",
                                        ].map((point) => (
                                            <li
                                                key={point}
                                                className="d-flex align-items-center gap-2 mb-2"
                                                style={{
                                                    fontFamily: "'Poppins', sans-serif",
                                                    fontSize: "0.88rem",
                                                    color: "#334155",
                                                }}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                    <path
                                                        d="M20 6L9 17l-5-5"
                                                        stroke="var(--blue-500)"
                                                        strokeWidth="2.4"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Book button */}
                                <button
                                    className="btn-medical-primary w-100 justify-content-center"
                                    onClick={handleBookKit}
                                    style={{ fontSize: "1rem", padding: "0.9rem 1.5rem" }}
                                >
                                    Book Entire Kit
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <path
                                            d="M5 12h14M13 6l6 6-6 6"
                                            stroke="#fff"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            !notFound && (
                                <div
                                    className="d-flex align-items-center justify-content-center text-center"
                                    style={{
                                        background: "var(--blue-50)",
                                        border: "1px dashed var(--glass-border)",
                                        borderRadius: "24px",
                                        padding: "3rem",
                                        minHeight: 280,
                                        fontFamily: "'Poppins', sans-serif",
                                        color: "#64748B",
                                        fontSize: "0.95rem",
                                    }}
                                >
                                    Select a condition to view its recommended recovery kit.
                                </div>
                            )
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RecoveryKitPage;