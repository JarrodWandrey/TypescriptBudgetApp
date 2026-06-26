import type { Bucket } from "./types";

interface Props {
    bucket: Bucket;
    onHistory: () => void;
}

export default function BucketCard({ bucket, onHistory }: Props) {
    const fillPercentage = Math.min((bucket.spent / bucket.limit) * 100, 100);
    const bucketHeight = 50;
    const fillHeight = Math.max((fillPercentage / 100) * bucketHeight, 0);
    const fillY = 70 - fillHeight;
    const isOverflowing = fillPercentage >= 100;

    function getAnimationClass(): string {
        if (fillPercentage >= 100) return "bucket-danger";
        if (fillPercentage >= 75) return "bucket-warning";
        return "bucket-safe";
    }

    return (
        <div style={{ textAlign: "center", cursor: "pointer" }}>
            <svg
                width="60"
                height="80"
                viewBox="0 0 60 80"
                className={getAnimationClass()}>
                <defs>
                    <clipPath id={`clip-${bucket.id}`}>
                        <rect x="8" y="20" width="44" height={bucketHeight} rx="2" />
                    </clipPath>
                </defs>

                 {/* Bucket background */}
                <rect
                x="8"
                y="20"
                width="44"
                height={bucketHeight}
                rx="2"
                fill="#f5f5f5"
                stroke={bucket.color}
                strokeWidth="2"
                />

                {/* Fill level */}
                <rect
                x="8"
                y={fillY}
                width="44"
                height={fillHeight}
                fill={bucket.color}
                opacity="0.7"
                clipPath={`url(#clip-${bucket.id})`}
                />

                {/* Bucket handle */}
                <path
                d="M20 20 Q30 8 40 20"
                fill="none"
                stroke={bucket.color}
                strokeWidth="2"
                />
            </svg>

            {/* Add drip animation when overflowing */}
            {isOverflowing && (
                <>
                <div className="water-drop drop-left" style={{ color: bucket.color }}>
                    💧
                </div>
                <div className="water-drop drop-right" style={{ color: bucket.color }}>
                    💧
                </div>
                </>
            )}
            <p style={{ fontSize: "10px", margin: "2px 0", color: bucket.color }}>{bucket.name}</p>
            <p style={{ fontSize: "9px", margin: 0, color: "#888", whiteSpace: "nowrap" }}>
                ${bucket.spent.toFixed(2)} / ${bucket.limit.toFixed(2)}
            </p>
            <button
                onClick={(e) => {
                e.stopPropagation();
                onHistory();
                }}
                style={{
                fontSize: "8px",
                padding: "2px 6px",
                marginTop: "2px",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                background: "white",
                cursor: "pointer",
                color: "#888",
                }}
            >
                history
            </button>
        </div>
    )
}