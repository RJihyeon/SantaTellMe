// components/ChevronPattern.tsx

import React from 'react';

interface ChevronPatternProps {
  forecolor?: string;
  backcolor?: string;
}

const ChevronPattern: React.FC<ChevronPatternProps> = ({
  forecolor = '#D23B49',
  backcolor = 'transparent',
}) => {
  const uniqueId = `chevronpattern-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg width="100%" height="100%">
      <defs>
        <pattern id={uniqueId} width="80" height="80" patternUnits="userSpaceOnUse">
          <polygon points="0,0 40,40 0,80 80,80 40,40 80,0" fill={forecolor} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uniqueId})`} />
    </svg>
  );
};

export default ChevronPattern;