import {useState} from "react";
import type {Bucket} from "./types";

interface Props{
    bucket: Bucket;
    onSubmit: (newName: string, newLimit: number, newColor: string) => void;
    onCancel: () => void;
}

export default function BucketEditForm({bucket, onSubmit, onCancel}: Props){
    const [nameInput, setNameInput] = useState(bucket.name);
    const [limitInput, setLimitInput] = useState(bucket.limit.toString());
    const [colorInput, setColorInput] = useState(bucket.color);

    function handleSubmit(){
        if (!nameInput.trim() || !limitInput) return;
        onSubmit(nameInput.trim(), parseFloat(limitInput), colorInput);
    }

      return (
    <div className="transaction-card">
      <h2>Edit — {bucket.name}</h2>
      <input
        type="text"
        placeholder="Bucket name"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
      />
      <input
        type="number"
        inputMode="decimal"
        placeholder="Spending limit"
        value={limitInput}
        onChange={(e) => setLimitInput(e.target.value)}
        onKeyDown={(e) => {
          if (!/[0-9.]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
            e.preventDefault();
          }
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <label style={{ fontSize: "0.85rem", color: "#555" }}>Color</label>
        <input
          type="color"
          value={colorInput}
          onChange={(e) => setColorInput(e.target.value)}
          style={{ width: "44px", height: "36px", padding: "2px", borderRadius: "8px", cursor: "pointer" }}
        />
      </div>
      <div className="transaction-buttons">
        <button onClick={handleSubmit}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}