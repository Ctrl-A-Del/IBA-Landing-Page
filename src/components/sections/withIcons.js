/**
 * Pairs a section's copy items (from `data.json`) with its decorative icons (kept in code, since they
 * are not copy) by position. The two lists live in different files, so a count mismatch throws at
 * module load instead of silently rendering a wrong or missing icon.
 */
export const withIcons = (items, icons, section) => {
  if (items.length !== icons.length) {
    throw new Error(
      `${section}: ${items.length} items in data.json but ${icons.length} icons; keep them paired.`
    );
  }
  return items.map((item, i) => ({ ...item, Icon: icons[i] }));
};
