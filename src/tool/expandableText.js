import React, { useState } from 'react';
import Button from '@mui/material/Button';

export function ExpandableText({ text, limit }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Truncate text function
  const truncateText = (str, num) => {
    if (str.length <= num) return str;
    return str.slice(0, num) + '...';
  };

  return (
    <div>
      {isExpanded ? text : truncateText(text, limit)}
      {text.length > limit && (
        <Button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Show Less' : 'Expand'}
        </Button>
      )}
    </div>
  );
}
