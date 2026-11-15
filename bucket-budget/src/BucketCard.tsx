import type { Bucket } from "./types";

interface Props {
  bucket: Bucket;
  scale?: number;
  compact?: boolean; // when true, hides label/amount/history (row layout renders those)
  onHistory: () => void;
  onEdit: () => void;
  onUpdate: (newName: string, newLimit: number, newColor: string) => void;
}

export default function BucketCard({
  bucket,
  scale = 1,
  compact = false,
  onHistory,
  onEdit,
}: Props) {
  const fillPercentage = Math.min((bucket.spent / bucket.limit) * 100, 100);
  const isOverflowing = fillPercentage >= 100;

  function getAnimationClass(): string {
    if (fillPercentage >= 100) return "bucket-danger";
    if (fillPercentage >= 75) return "bucket-warning";
    return "bucket-safe";
  }

  // Tapered bucket shape (SVG 60×80 viewBox)
  const bodyTopY = 22;
  const bodyBottomY = 72;
  const bodyHeight = bodyBottomY - bodyTopY; // 50

  const tl = { x: 6, y: bodyTopY };
  const tr = { x: 54, y: bodyTopY };
  const br = { x: 48, y: bodyBottomY };
  const bl = { x: 12, y: bodyBottomY };

  const clipId = `clip-${bucket.id}`;
  const bodyPath = `M${tl.x},${tl.y} L${tr.x},${tr.y} L${br.x},${br.y} L${bl.x},${bl.y} Z`;

  const fillHeight = (fillPercentage / 100) * bodyHeight;
  const fillY = bodyBottomY - fillHeight;

  const t = fillHeight / bodyHeight;
  const fillLeftX = bl.x + (tl.x - bl.x) * t;
  const fillRightX = br.x + (tr.x - br.x) * t;

  const fillPath = `M${fillLeftX},${fillY} L${fillRightX},${fillY} L${br.x},${bodyBottomY} L${bl.x},${bodyBottomY} Z`;

  const svgW = Math.round(60 * scale);
  const svgH = Math.round(80 * scale);

  return (
    <div style={{ textAlign: "center", cursor: "pointer", position: "relative" }}>
      <svg
        width={svgW}
        height={svgH}
        viewBox="0 0 60 80"
        className={getAnimationClass()}
        style={{ overflow: "visible", display: "block" }}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={bodyPath} />
          </clipPath>
          <filter id={`glow-${bucket.id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Bucket body */}
        <path
          d={bodyPath}
          fill="#1a1d26"
          stroke={bucket.color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Fill liquid */}
        {fillHeight > 0 && (
          <path
            d={fillPath}
            fill={bucket.color}
            opacity="0.82"
            clipPath={`url(#${clipId})`}
            filter={`url(#glow-${bucket.id})`}
            style={{ transition: "d 0.4s cubic-bezier(0.4,0,0.2,1)" }}
          />
        )}

        {/* Liquid surface shimmer */}
        {fillHeight > 1 && (
          <line
            x1={fillLeftX + 1}
            y1={fillY}
            x2={fillRightX - 1}
            y2={fillY}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            clipPath={`url(#${clipId})`}
          />
        )}

        {/* Handle arc */}
        <path
          d="M18 22 Q30 7 42 22"
          fill="none"
          stroke={bucket.color}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Rim highlight */}
        <line
          x1="6" y1="22" x2="54" y2="22"
          stroke={bucket.color}
          strokeWidth="1.5"
          opacity="0.5"
        />
      </svg>

      {/* Overflow drops */}
      {isOverflowing && (
        <>
          <div className="water-drop drop-left" style={{ color: bucket.color }}>💧</div>
          <div className="water-drop drop-right" style={{ color: bucket.color }}>💧</div>
        </>
      )}

      {/* Label / amount / history — hidden in compact (row) mode */}
      {!compact && (
        <>
          <p
            className="bucket-label"
            style={{ color: bucket.color, fontSize: `${Math.round(10 * scale)}px`, maxWidth: `${svgW}px` }}
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            title="Tap to edit"
          >
            {bucket.name}
          </p>

          <p className="bucket-amount" style={{ fontSize: `${Math.round(8.5 * scale)}px` }}>
            ${bucket.spent.toFixed(0)}/${bucket.limit.toFixed(0)}
          </p>

          <button
            className="bucket-hist-btn"
            style={{ fontSize: `${Math.round(7.5 * scale)}px` }}
            onClick={(e) => { e.stopPropagation(); onHistory(); }}
          >
            history
          </button>
        </>
      )}
    </div>
  );
}
