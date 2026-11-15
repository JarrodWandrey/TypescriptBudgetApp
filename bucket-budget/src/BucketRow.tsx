import { useRef, useEffect } from "react";
import type { Bucket } from "./types";
import BucketCard from "./BucketCard";

interface Props {
  bucket: Bucket;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onHistory: () => void;
}

const SWIPE_REVEAL = 120;
const SWIPE_THRESHOLD = 55;

export default function BucketRow({ bucket, isOpen, onOpen, onClose, onSelect, onDelete, onEdit, onHistory }: Props) {
  const startX = useRef(0);
  const startY = useRef(0);
  const dragging = useRef(false);
  const didSwipe = useRef(false);
  const currentOffset = useRef(0);
  const rowRef = useRef<HTMLDivElement>(null);

  const fillPct = Math.min((bucket.spent / bucket.limit) * 100, 100);

  // Close when clicking anywhere outside this row
  useEffect(() => {
    if (!isOpen) return;
    function handleOutsideClick(e: MouseEvent) {
      if (rowRef.current && !rowRef.current.closest(".bucket-row-wrap")?.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen, onClose]);

  // Keep currentOffset in sync with isOpen so drag math stays correct
  currentOffset.current = isOpen ? -SWIPE_REVEAL : 0;

  function setTransform(x: number) {
    if (rowRef.current) {
      rowRef.current.style.transform = `translateX(${x}px)`;
    }
  }

  // ── Touch handlers ────────────────────────────────────────
  function handleTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    dragging.current = true;
    didSwipe.current = false;
    // disable transition while dragging
    if (rowRef.current) rowRef.current.style.transition = "none";
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!dragging.current) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dx) < 10) {
      dragging.current = false;
      return;
    }

    e.preventDefault();
    const raw = currentOffset.current + dx;
    const clamped = Math.max(-SWIPE_REVEAL, Math.min(0, raw));
    setTransform(clamped);
    if (Math.abs(dx) > 8) didSwipe.current = true;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!dragging.current) return;
    dragging.current = false;
    if (rowRef.current) rowRef.current.style.transition = "";

    const dx = e.changedTouches[0].clientX - startX.current;
    const finalOffset = currentOffset.current + dx;

    if (finalOffset < -SWIPE_THRESHOLD) {
      setTransform(-SWIPE_REVEAL);
      onOpen();
    } else {
      setTransform(0);
      onClose();
    }
  }

  // ── Mouse handlers ────────────────────────────────────────
  function handleMouseDown(e: React.MouseEvent) {
    startX.current = e.clientX;
    dragging.current = true;
    didSwipe.current = false;
    if (rowRef.current) rowRef.current.style.transition = "none";
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragging.current) return;
    const dx = e.clientX - startX.current;
    const raw = currentOffset.current + dx;
    const clamped = Math.max(-SWIPE_REVEAL, Math.min(0, raw));
    setTransform(clamped);
    if (Math.abs(dx) > 8) didSwipe.current = true;
  }

  function handleMouseUp(e: React.MouseEvent) {
    if (!dragging.current) return;
    dragging.current = false;
    if (rowRef.current) rowRef.current.style.transition = "";

    const dx = e.clientX - startX.current;
    const finalOffset = currentOffset.current + dx;

    if (finalOffset < -SWIPE_THRESHOLD) {
      setTransform(-SWIPE_REVEAL);
      onOpen();
    } else {
      setTransform(0);
      onClose();
    }
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation(); // prevent document listener from firing on the same click
    if (didSwipe.current) return;
    if (isOpen) {
      onClose();
      return;
    }
    onSelect();
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    onClose();
    onDelete();
  }

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    onClose();
    onEdit();
  }

  return (
    <div className="bucket-row-wrap">
      {/* Action buttons */}
      <div className="bucket-row-actions">
        <button
          className="row-action-btn row-action-edit"
          onClick={handleEdit}
          aria-label="Edit bucket"
        >
          ✏️
        </button>
        <button
          className="row-action-btn row-action-delete"
          onClick={handleDelete}
          aria-label="Delete bucket"
        >
          ✕
        </button>
      </div>

      {/* Sliding row */}
      <div
        ref={rowRef}
        className="bucket-row"
        style={{
          transform: `translateX(${isOpen ? -SWIPE_REVEAL : 0}px)`,
          transition: "transform 0.22s cubic-bezier(0.4,0,0.2,1)",
          borderColor: `${bucket.color}33`,
          cursor: isOpen ? "default" : "pointer",
        }}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Bucket SVG */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <BucketCard
            bucket={bucket}
            scale={0.65}
            compact
            onHistory={onHistory}
            onEdit={onEdit}
            onUpdate={() => {}}
          />
        </div>

        {/* Name + bar + spend */}
        <div className="bucket-row-info">
          <div className="bucket-row-name">{bucket.name}</div>
          <div className="bucket-row-bar-wrap">
            <div
              className="bucket-row-bar"
              style={{ width: `${fillPct}%`, background: bucket.color }}
            />
          </div>
          <div className="bucket-row-sub">
            <span className="bucket-row-spend">
              ${bucket.spent.toFixed(0)} / ${bucket.limit.toFixed(0)}
            </span>
            <button
              className="bucket-row-hist-btn"
              onClick={(e) => { e.stopPropagation(); onHistory(); }}
            >
              history
            </button>
          </div>
        </div>

        {/* Amount + % */}
        <div className="bucket-row-amount" style={{ color: bucket.color }}>
          <span>${bucket.spent.toFixed(0)}</span>
          <span className="bucket-row-pct">{Math.round(fillPct)}%</span>
        </div>
      </div>
    </div>
  );
}
