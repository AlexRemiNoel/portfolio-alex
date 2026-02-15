"use client";

import React from "react";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  className?: string;
  inputClassName?: string;
}

export const EditableText = React.memo(function EditableText({
  value,
  onChange,
  isEditing,
  className = "",
  inputClassName = "",
}: EditableTextProps) {
  if (!isEditing) return <span className={className}>{value}</span>;

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-yellow-500/10 border-b-2 border-yellow-500 outline-none focus:bg-yellow-500/20 transition-all ${inputClassName || className}`}
    />
  );
});
