import React from "react";

export function renderDescription(
  description: string | null | undefined,
  viewAll: boolean
): React.ReactNode {
  if (!description) {
    return "";
  }
  return viewAll ? (
    <span>{description}</span>
  ) : (
    <span>
      {description.slice(0, 200)}
      {description.length > 200 ? "..." : ""}
    </span>
  );
}

export function removeSnakeCase(text: string): string {
  const newText = text.split("_").join(" ");
  return newText.charAt(0).toUpperCase() + newText.slice(1);
}
