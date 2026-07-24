import React, { useState } from "react";
import { analyzeSymptoms } from "../services/healthAssistantService";

const SYMPTOMS = [
    { key: "fever", label: "Fever" },
    { key: "cough", label: "Cough" },
    { key: "breathlessness", label: "Breathlessness" },
    { key: "joint_pain", label: "Joint Pain" },
    { key: "swelling", label: "Swelling" },
    { key: "difficulty_walking", label: "Difficulty Walking" },
    { key: "back_pain", label: "Back Pain" },
    { key: "weakness", label: "Weakness" },
    { key: "dizziness", label: "Dizziness" },
];

const HealthAssistantPage = () => {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCheckboxChange = (symptomKey) => {
        setSelectedSymptoms((prev) =>
            prev.includes(symptomKey)
                ? prev.filter((s) => s !== symptomKey)
                : [...prev, symptomKey]
        );
    };

    const handleAnalyze = async () => {
        setError(null);
        setResult(null);

        if (selectedSymptoms.length === 0) {
            setError("Please select at least one symptom.");
            return;
        }

        try {
            setLoading(true);
            const response = await analyzeSymptoms(selectedSymptoms);

            if (response.data.success) {
                setResult(response.data);
            } else {
                setError(response.data.error || "Failed to analyze symptoms.");
            }
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Failed to analyze symptoms. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="text-center mb-4">
                <h3 className="fw-bold">Health Assistant</h3>
                <p className="text-muted">
                    Select your symptoms below to get a basic recommendation.
                </p>
            </div>

            <div className="row row-cols-1 row-cols-md-2 g-3 mb-4">
                {SYMPTOMS.map((symptom) => (
                    <div className="col" key={symptom.key}>
                        <div
                            className={`card h-100 shadow-sm rounded-4 border-0 ${
                                selectedSymptoms.includes(symptom.key)
                                    ? "border border-primary bg-primary-subtle"
                                    : ""
                            }`}
                            role="button"
                            onClick={() => handleCheckboxChange(symptom.key)}
                        >
                            <div className="card-body d-flex align-items-center gap-2 py-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input mt-0"
                                    id={symptom.key}
                                    checked={selectedSymptoms.includes(symptom.key)}
                                    onChange={() => handleCheckboxChange(symptom.key)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <label
                                    className="form-check-label mb-0 fw-medium"
                                    htmlFor={symptom.key}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {symptom.label}
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {error && (
                <div className="alert alert-danger rounded-4 text-center" role="alert">
                    {error}
                </div>
            )}

            <div className="text-center mb-4">
                <button
                    className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm"
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    {loading ? "Analyzing..." : "Analyze Symptoms"}
                </button>
            </div>

            {result && (
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card shadow rounded-4 border-0">
                            <div className="card-body p-4">
                                <div className="text-center mb-3">
                                    <span style={{ fontSize: "2.5rem" }}>✅</span>
                                </div>

                                <h5 className="fw-bold">Possible Condition</h5>
                                <p className="card-text mb-4">{result.condition}</p>

                                <h5 className="fw-bold">Recommended Equipment</h5>
                                <div className="mb-4">
                                    {result.recommended_equipment
                                        .split(",")
                                        .map((item, index) => (
                                            <span
                                                key={index}
                                                className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill me-2 mb-2 p-2"
                                            >
                                                {item.trim()}
                                            </span>
                                        ))}
                                </div>

                                <h5 className="fw-bold">Advice</h5>
                                <p className="card-text mb-0">{result.advice}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center mt-5">
                <small className="text-muted">
                    ⚠ This is a rule-based health assistant and does not replace
                    professional medical advice.
                </small>
            </div>
        </div>
    );
};

export default HealthAssistantPage;