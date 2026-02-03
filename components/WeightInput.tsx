"use client";

import { useState } from "react";

interface WeightInputProps {
    exerciseId: string;
    actualWeight: string;
    onWeightChange: (weight: string) => void;
}

export default function WeightInput({ exerciseId, actualWeight, onWeightChange }: WeightInputProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(actualWeight || "");

    const handleSave = () => {
        onWeightChange(inputValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setInputValue(actualWeight || "");
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="ej: 50kg, 15kg c/u"
                    autoFocus
                    style={{
                        background: "var(--card)",
                        border: "1px solid var(--accent-border)",
                        borderRadius: "4px",
                        padding: "2px 6px",
                        fontSize: "11px",
                        color: "var(--text)",
                        width: "80px",
                        outline: "none",
                    }}
                />
                <button
                    onClick={handleSave}
                    style={{
                        background: "var(--accent)",
                        border: "none",
                        borderRadius: "3px",
                        padding: "2px 6px",
                        fontSize: "10px",
                        color: "#000",
                        cursor: "pointer",
                        fontWeight: 600,
                    }}
                >
                    ✓
                </button>
                <button
                    onClick={handleCancel}
                    style={{
                        background: "var(--card-light)",
                        border: "none",
                        borderRadius: "3px",
                        padding: "2px 6px",
                        fontSize: "10px",
                        color: "var(--text-dim)",
                        cursor: "pointer",
                    }}
                >
                    ✕
                </button>
            </div>
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            style={{
                background: actualWeight
                    ? "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.08) 100%)"
                    : "linear-gradient(135deg, rgba(156,163,175,0.15) 0%, rgba(156,163,175,0.08) 100%)",
                border: actualWeight
                    ? "1px solid rgba(34,197,94,0.25)"
                    : "1px solid rgba(156,163,175,0.25)",
                borderRadius: "6px",
                padding: "4px 9px",
                fontSize: "12px",
                fontWeight: 500,
                color: actualWeight ? "var(--green)" : "var(--text-dim)",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "4px",
            }}
        >
            {actualWeight ? "💪" : "➕"} Peso usado{" "}
            <span style={{
                color: actualWeight ? "var(--green)" : "var(--text-dim)",
                fontWeight: 600
            }}>
                {actualWeight || "sin registrar"}
            </span>
        </div>
    );
}