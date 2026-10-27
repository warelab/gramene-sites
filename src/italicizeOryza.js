import React from 'react';

// Render display text with the genus name "Oryza" italicized (scientific
// naming convention). Matches the whole word case-insensitively (so "ORYZA"
// in the wordmark italicizes too) but leaves compounds like "GrameneOryza"
// alone. Returns an array of React nodes, so use it inside JSX.
export default function italicizeOryza(text) {
  if (typeof text !== 'string') return text;
  return text.split(/(\bOryza\b)/gi).map((part, i) =>
    /^Oryza$/i.test(part) ? <i key={i}>{part}</i> : part
  );
}
