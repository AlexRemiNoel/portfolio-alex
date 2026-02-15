"use client";

import React from "react";

interface EditableTextareaProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  rows?: number;
  className?: string;
}

export const EditableTextarea = React.memo(function EditableTextarea({
  value,
  onChange,
  isEditing,
  rows = 3,
  className = "",
}: EditableTextareaProps) {
  if (!isEditing) return <span className={`whitespace-pre-wrap ${className}`}>{value}</span>;

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className={`w-full bg-yellow-500/10 border-2 border-yellow-500 rounded p-2 outline-none focus:bg-yellow-500/20 transition-all ${className}`}
    />
  );
});
