import { useState } from "react";
import type { Bucket, Transaction } from "./types";
import {
  saveBuckets,
  getBuckets,
  deleteBucket,
  saveTransactions,
  getTransactions,
  createTransaction,
  resetBuckets,
  updateBucket,
} from "./store";
import BucketRow from "./BucketRow";
import BucketForm from "./BucketForm";
import BucketEditForm from "./BucketEditForm";
import TransactionForm from "./TransactionForm";
import TransactionHistory from "./TransactionHistory";
import "./App.css";

export default function App() {
  const [buckets, setBuckets] = useState<Bucket[]>(getBuckets());
  const [transactions, setTransactions] = useState<Transaction[]>(getTransactions());
  const [selectedBucket, setSelectedBucket] = useState<Bucket | null>(null);
  const [historyBucket, setHistoryBucket] = useState<Bucket | null>(null);
  const [editBucket, setEditBucket] = useState<Bucket | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [openRowId, setOpenRowId] = useState<string | null>(null);

  // ── Stats ──────────────────────────────────────────────────
  const totalBudget = buckets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = buckets.reduce((s, b) => s + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  // ── Handlers ───────────────────────────────────────────────
  function handleAddBucket(bucket: Bucket) {
    const updated = [...buckets, bucket];
    saveBuckets(updated);
    setBuckets(updated);
    setShowAddForm(false);
  }

  function handleDeleteBucket(id: string) {
    if (window.confirm("Delete this bucket?")) {
      deleteBucket(id);
      setBuckets(getBuckets());
    }
  }

  function handleEditBucket(bucket: Bucket) {
    setEditBucket(bucket);
  }

  function handleCloseEdit() {
    setEditBucket(null);
  }

  function handleUpdateBucket(id: string, newName: string, newLimit: number, newColor: string) {
    updateBucket(id, newName, newLimit, newColor);
    setBuckets(getBuckets());
    setEditBucket(null);
  }

  function handleLogTransaction(amount: number, description: string) {
    if (!selectedBucket) return;

    const transaction = createTransaction(selectedBucket.id, amount, description);
    const updatedTransactions = [...transactions, transaction];

    const updatedBuckets = buckets.map((bucket) =>
      bucket.id === selectedBucket.id
        ? { ...bucket, spent: bucket.spent + amount }
        : bucket
    );

    saveTransactions(updatedTransactions);
    saveBuckets(updatedBuckets);
    setTransactions(updatedTransactions);
    setBuckets(updatedBuckets);
    setSelectedBucket(null);
  }

  function handleShowHistory(bucket: Bucket) {
    setHistoryBucket(bucket);
  }

  function handleCloseHistory() {
    setHistoryBucket(null);
  }

  function handleResetBuckets() {
    if (window.confirm("Reset all spending for the new month?")) {
      resetBuckets();
      setBuckets(getBuckets());
    }
  }

  return (
    <div className="app-container">
      {/* Header */}
      <div className="top-bar">
        <span className="app-title">Budget Buckets</span>
        <button className="reset-button" onClick={handleResetBuckets}>
          New Month
        </button>
      </div>

      {/* Stats strip */}
      <div className="stats-strip">
        <div className="stat-item">
          <span className="stat-label">Budget</span>
          <span className="stat-value">${totalBudget.toFixed(0)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Spent</span>
          <span className="stat-value spent">${totalSpent.toFixed(0)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Left</span>
          <span className={`stat-value ${totalRemaining < 0 ? "over" : "remaining"}`}>
            ${Math.abs(totalRemaining).toFixed(0)}
            {totalRemaining < 0 ? " over" : ""}
          </span>
        </div>
      </div>

      {/* Row list */}
      <div className="bucket-list" onClick={() => setOpenRowId(null)}>
        {buckets.map((bucket) => (
          <BucketRow
            key={bucket.id}
            bucket={bucket}
            isOpen={openRowId === bucket.id}
            onOpen={() => setOpenRowId(bucket.id)}
            onClose={() => setOpenRowId(null)}
            onSelect={() => setSelectedBucket(bucket)}
            onDelete={() => handleDeleteBucket(bucket.id)}
            onEdit={() => handleEditBucket(bucket)}
            onHistory={() => handleShowHistory(bucket)}
          />
        ))}
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => setShowAddForm(true)} aria-label="Add bucket">
        +
      </button>

      {/* ── Modals ──────────────────────────────────────────── */}

      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <BucketForm onAdd={handleAddBucket} onCancel={() => setShowAddForm(false)} />
          </div>
        </div>
      )}

      {selectedBucket && (
        <div className="modal-overlay" onClick={() => setSelectedBucket(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <TransactionForm
              bucket={selectedBucket}
              onSubmit={handleLogTransaction}
              onCancel={() => setSelectedBucket(null)}
            />
          </div>
        </div>
      )}

      {historyBucket && (
        <div className="modal-overlay" onClick={handleCloseHistory}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <TransactionHistory
              bucket={historyBucket}
              transactions={transactions}
              onClose={handleCloseHistory}
            />
          </div>
        </div>
      )}

      {editBucket && (
        <div className="modal-overlay" onClick={handleCloseEdit}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <BucketEditForm
              bucket={editBucket}
              onSubmit={(newName, newLimit, newColor) =>
                handleUpdateBucket(editBucket.id, newName, newLimit, newColor)
              }
              onCancel={handleCloseEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
