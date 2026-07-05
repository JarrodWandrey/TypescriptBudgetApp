import type { Bucket, Transaction } from "./types";

export function getBuckets(): Bucket[] {
    const data = localStorage.getItem("buckets");
    return data ? JSON.parse(data) : [];
}

export function saveBuckets(buckets: Bucket[]): void {
    localStorage.setItem("buckets", JSON.stringify(buckets));
}

export function createBucket(name: string, limit: number, color: string): Bucket {
    return {
        id: crypto.randomUUID(), // Generate a unique ID for the bucket
        name,
        limit,
        spent: 0,
        color
    };
}

export function renameBucket(id: string, newName: string): void {
    const buckets = getBuckets().map((b) =>
        b.id === id ? { ...b, name: newName } : b
    );
    saveBuckets(buckets);
}

export function deleteBucket(id: string): void {
    const buckets = getBuckets().filter((b) => b.id !== id);
    saveBuckets(buckets);
}

export function getTransactions(): Transaction[] {
    const data = localStorage.getItem("transactions");
    return data ? JSON.parse(data) : [];
}

export function getTransactionsForBucket(bucketId: string): Transaction[] {
    return getTransactions().filter((t) => t.bucketId === bucketId);
}

export function createTransaction(bucketId: string, amount: number, description: string): Transaction {
    return {
        id: crypto.randomUUID(),
        bucketId,
        amount,
        description,
        date: new Date().toISOString()
    };
}

export function saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Function to clear all buckets (i.e a new pay period or month)
export function resetBuckets(): void {
    const buckets = getBuckets();
    const reset = buckets.map((bucket) => (({ ...bucket, spent: 0})));
    saveBuckets(reset);
}