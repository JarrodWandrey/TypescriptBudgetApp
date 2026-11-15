import { useState } from "react";
import type { Bucket } from "./types";

interface Props {
    bucket: Bucket;
    onSubmit: (amount: number, description: string) => void;
    onCancel: () => void;
}

export default function TransactionForm({ bucket, onSubmit, onCancel }: Props) {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    function handleSubmit() {
        if (!amount) return;
        onSubmit(parseFloat(amount), description);
        setAmount("");
        setDescription("");
    }

    return (
        <>
            <p className="modal-title" style={{ color: bucket.color }}>
                Log spend — {bucket.name}
            </p>
            <input
                type="number"
                inputMode="decimal"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => {
                    if (!/[0-9.]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
                        e.preventDefault();
                    }
                }}
                autoFocus
            />
            <input
                type="text"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <div className="modal-buttons">
                <button className="btn-primary" onClick={handleSubmit}>Log</button>
                <button className="btn-secondary" onClick={onCancel}>Cancel</button>
            </div>
        </>
    );
}
