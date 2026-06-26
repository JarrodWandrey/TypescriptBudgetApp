export interface Bucket {
    id: string;
    name: string;
    limit: number;
    spent: number;
    color: string;
}

export interface Transaction {
    id: string;
    bucketId: string;
    amount: number;
    description: string;
    date: string;
}