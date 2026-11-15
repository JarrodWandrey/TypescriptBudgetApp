import { useState } from "react";
import type { Bucket } from "./types";

interface Props {
    bucket: Bucket;
    onSubmit: (newName: string, newLimit: number, newColor: string) => void;
    onCancel: () => void;
}

export default function BucketEditForm({ bucket, onSubmit, onCancel }: Props) {
    const [nameInput, setNameInput] = useState(bucket.name);
    const [limitInput, setLimitInput] = useState(bucket.limit.toString());
    const [colorInput, setColorInput] = useState(bucket.color);

    function handleSubmit() {
        if (!nameInput.trim() || !limitInput) return;
        onSubmit(nameInput.trim(), parseFloat(limitInput), colorInput);
    }

    return (
        <>
            <p className="modal-title">Edit — {bucket.name}</p>
            <input
                type="text"
                placeholder="Bucket name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
            />
            <input
                type="number"
                inputMode="decimal"
                placeholder="Spending limit"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                onKeyDown={(e) => {
                    if (!/[0-9.]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
                        e.preventDefault();
                    }
                }}
            />
            <div className="color-row">
                <label>Color</label>
                <input
                    type="color"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                />
            </div>
            <div className="modal-buttons">
                <button className="btn-primary" onClick={handleSubmit}>Save</button>
                <button className="btn-secondary" onClick={onCancel}>Cancel</button>
            </div>
        </>
    );
}
