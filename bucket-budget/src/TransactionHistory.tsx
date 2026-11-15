import type { Bucket, Transaction } from "./types";

interface Props {
    bucket: Bucket;
    transactions: Transaction[];
    onClose: () => void;
}

export default function TransactionHistory({ bucket, transactions, onClose }: Props) {
    const bucketTransactions = transactions.filter((t) => t.bucketId === bucket.id);

    return (
        <>
            <p className="modal-title" style={{ color: bucket.color }}>
                {bucket.name} — History
            </p>

            {bucketTransactions.length === 0 ? (
                <p className="history-empty">No transactions yet.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: "55vh", overflowY: "auto" }}>
                    {bucketTransactions.map((t) => (
                        <li key={t.id} className="history-item">
                            <span className="history-desc">{t.description || "No description"}</span>
                            <span className="history-amount" style={{ color: bucket.color }}>
                                ${t.amount.toFixed(2)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            <div className="modal-buttons">
                <button className="btn-secondary" onClick={onClose}>Close</button>
            </div>
        </>
    );
}
