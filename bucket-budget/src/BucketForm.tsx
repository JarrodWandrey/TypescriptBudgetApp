import { useState } from "react";
import type { Bucket } from "./types";

interface Props {
    onAdd: (bucket: Bucket) => void;
    onCancel?: () => void;
}

export default function BucketForm({ onAdd, onCancel }: Props) {
    const [name, setName] = useState("");
    const [limit, setLimit] = useState("");
    const [color, setColor] = useState("#4a9eff");

    function handleSubmit() {
        if (!name || !limit) return;

        onAdd({
            id: crypto.randomUUID(),
            name,
            limit: parseFloat(limit),
            spent: 0,
            color
        });

        setName("");
        setLimit("");
        setColor("#4a9eff");
    }

    return (
        <>
            <p className="modal-title">New Bucket</p>
            <input
                type="text"
                placeholder="Bucket name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="number"
                inputMode="decimal"
                placeholder="Spending limit"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
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
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
            </div>
            <div className="modal-buttons">
                <button className="btn-primary" onClick={handleSubmit}>Add Bucket</button>
                {onCancel && (
                    <button className="btn-secondary" onClick={onCancel}>Cancel</button>
                )}
            </div>
        </>
    );
}
