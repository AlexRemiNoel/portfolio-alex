"use client";

import React from "react";

interface EditableTextareaProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  rows?: number;
  className?: string;
}

export const EditableTextarea = ({ value, onChange, isEditing, rows = 3, className = "" }: any) => {
  if (!isEditing) return <p className={`whitespace-pre-wrap ${className}`}>{value}</p>;
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className={`w-full mt-2 ${className}`}
    />
  );
};