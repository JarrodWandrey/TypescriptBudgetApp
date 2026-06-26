import type { Bucket, Transaction } from "./types";

interface Props {
    bucket: Bucket;
    transactions: Transaction[];
    onClose: () => void;
}

export default function TransactionHistory({ bucket, transactions, onClose}: Props){
    const bucketTransactions = transactions.filter((t) => t.bucketId === bucket.id);

    return (
    <div className="transaction-card">
        <h2>{bucket.name} — History</h2>
        {bucketTransactions.length === 0 ? (
            <p style={{ color: "#888", fontSize: "0.85rem" }}>No transactions yet.</p>
        ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {bucketTransactions.map((t) => (
                <li
                key={t.id}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.4rem 0",
                    borderBottom: "1px solid #f0f0f0",
                    fontSize: "0.85rem",
                }}
                >
                <span style={{ color: "#555" }}>
                    {t.description || "No description"}
                </span>
                <span style={{ fontWeight: 600, color: bucket.color }}>
                    ${t.amount.toFixed(2)}
                </span>
                </li>
            ))}
            </ul>
        )}
        <div className="transaction-buttons">
            <button onClick={onClose}>Close</button>
        </div>
        </div>
    );
}