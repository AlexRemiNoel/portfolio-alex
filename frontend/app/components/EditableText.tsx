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
  if (!isEditing) {
    return <span className={className}>{value}</span>;
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputClassName || className}
    />
  );
});
