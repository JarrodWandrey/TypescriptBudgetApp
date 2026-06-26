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

    function handleSubmit(){
        if (!amount || !description) return;
        onSubmit(parseFloat(amount), description);
        setAmount("");
        setDescription("");
    }

    return (
        <div className="transaction-card">
            <h2>Log spend - {bucket.name}</h2>
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab"){
                        e.preventDefault();
                    }
                }}
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    )
}