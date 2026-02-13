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
  if (!isEditing) {
    return <span className={className}>{value}</span>;
  }

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className={className}
    />
  );
});
