"use client";

import { useLanguage } from "../lib/i18n";
import { EditableText } from "./EditableText";

interface FooterProps {
  year?: string;
  name?: string;
  onNameChange?: (value: string) => void;
  isEditing?: boolean;
}

export function Footer({
  year = "2026",
  name = "Your Name",
  onNameChange,
  isEditing = false,
}: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "clamp(1.5rem, 4vw, 2rem) 1.5rem",
        textAlign: "center",
        color: "var(--muted)",
        fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
      }}
    >
      <p style={{ margin: 0 }}>
        © {year}{" "}
        {onNameChange && isEditing ? (
          <EditableText
            value={name}
            onChange={onNameChange}
            isEditing={true}
          />
        ) : (
          name
        )}
        . {t("home.allRightsReserved")}
      </p>
    </footer>
  );
}
