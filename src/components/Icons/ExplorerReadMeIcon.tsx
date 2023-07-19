import React from 'react';
import { IconButton } from 'theme-ui';

function Icon() {
  return (
    <IconButton>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M2.667 13a1.667 1.667 0 011.666-1.667h9"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M4.333 1.333h9v13.334h-9A1.667 1.667 0 012.666 13V3a1.667 1.667 0 011.667-1.667v0z"
        />
      </svg>
    </IconButton>
  );
}

export default Icon;
