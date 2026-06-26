import { useState } from "react";
import type { Bucket } from "./types";

interface Props {
    onAdd: (bucket: Bucket) => void;
}

export default function BucketForm({ onAdd}: Props) {
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
        <div className="form-card">
            <input
                type="text"
                placeholder="Bucket Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <div className="form-row">
            <input
                type="number"
                placeholder="Spending limit"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                onKeyDown={(e) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab"){
                        e.preventDefault();
                    }
                }}
            />
            <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
            />
            </div>
            <button onClick={handleSubmit}>Add Bucket</button>
        </div>
    );
}