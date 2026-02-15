"use client";

import React from "react";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  className?: string;
  inputClassName?: string;
}

export const EditableText = ({ value, onChange, isEditing, className = "" }: any) => {
  if (!isEditing) return <span className={className}>{value}</span>;
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`font-inherit bg-transparent !border-b-2 !border-primary !rounded-none !px-0 ${className}`}
    />
  );
};