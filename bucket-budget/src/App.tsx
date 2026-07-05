import { useState } from "react";
import type { Bucket, Transaction } from "./types";
import { saveBuckets, getBuckets, deleteBucket, saveTransactions, getTransactions, createTransaction, resetBuckets, renameBucket } from "./store";
import BucketCard from "./BucketCard";
import BucketForm from "./BucketForm";
import TransactionForm from "./TransactionForm";
import TransactionHistory from "./TransactionHistory";
import "./App.css";

export default function App() {
  const [buckets, setBuckets] = useState<Bucket[]>(getBuckets());
  const [transactions, setTransactions] = useState<Transaction[]>(getTransactions());
  const [selectedBucket, setSelectedBucket] = useState<Bucket | null>(null);
  const [historyBucket, setHistoryBucket] = useState<Bucket | null>(null);

  function handleAddBucket( bucket : Bucket) {
    const updated = [...buckets, bucket];
    saveBuckets(updated);
    setBuckets(updated);
  }

  function handleDeleteBucket(id: string) {
    if (window.confirm("Delete this bucket?")){
      deleteBucket(id);
      setBuckets(getBuckets());
    }
  }

  function handleSelectBucket(bucket: Bucket) {
    setSelectedBucket(bucket);
  }

  function handleRenameBucket(id: string, newName: string) {
    renameBucket(id, newName);
    setBuckets(getBuckets());
  }

  function handleLogTransaction(amount: number, description: string) {
    if (!selectedBucket) return;

    const transaction = createTransaction(selectedBucket.id, amount, description);
    const updatedTransactions = [...transactions, transaction];

    const updatedBuckets = buckets.map((bucket) =>
      bucket.id === selectedBucket.id ? { ...bucket, spent: bucket.spent + amount } : bucket
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

  function handleCancel() {
    setSelectedBucket(null);
  }

  const padding = 40;
  const ringSize = window.innerWidth * 0.9;
  const centerX = ringSize / 2;
  const centerY = ringSize / 2;
  const radius = (ringSize / 2) - padding;

  function getPosition(index: number, total: number) {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from the top

    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  }

  function handleResetBuckets() {
    resetBuckets();
    setBuckets(getBuckets());
  }

  return (
    <div className="app-container">
      <div className="top-bar">
        <h1>Budget Buckets</h1>
        <button className="reset-button" onClick={handleResetBuckets}>Reset data</button>
      </div>

      <BucketForm onAdd={handleAddBucket}/>
      {selectedBucket && (
            <TransactionForm
              bucket={selectedBucket}
              onSubmit={handleLogTransaction}
              onCancel={handleCancel}
            />
          )}
          {historyBucket && (
            <TransactionHistory
              bucket={historyBucket}
              transactions={transactions}
              onClose={handleCloseHistory}
            />
          )}
        <div className="bucket-ring" style={{
          position: "relative",
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          margin: "0 auto",
          overflow: "visible"
        }}>
        {buckets.map((bucket, index) => {
          const pos = getPosition(index, buckets.length);
          let pressTimer: ReturnType<typeof setTimeout>

          return (
            <div
              key={bucket.id}
              style={{
                position: "absolute",
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: "translate(-50%, -50%)"
              }}
              onClick={() => handleSelectBucket(bucket)}
              onMouseDown={() => {
                pressTimer = setTimeout(() => handleDeleteBucket(bucket.id), 500);
              }}
              onMouseUp={() => { clearTimeout(pressTimer)}}
              onTouchStart={() => {
                pressTimer = setTimeout(() => handleDeleteBucket(bucket.id), 500);
              }}
              onTouchEnd={() => { clearTimeout(pressTimer)}}
              >
              <BucketCard bucket={bucket} onHistory={() => handleShowHistory(bucket)} onRename={(newName) => handleRenameBucket(bucket.id, newName)}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}