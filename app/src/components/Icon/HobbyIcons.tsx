import React from 'react';

export const SkiIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17l-5.29-5.29a1 1 0 0 0-1.41 0l-6.3 6.3a1 1 0 0 0 0 1.41l.7.71a1 1 0 0 0 1.41 0L21 8" />
    <path d="M3 15l2-2" />
    <path d="m7 9-4 4" />
    <path d="M11 13V7c0-1.1.9-2 2-2h2" />
    <path d="M17 8h.01" />
  </svg>
);

export const RunIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 4v6l3.5 7" />
    <path d="M7 13c1.4 1 3 1 4 .5l3-1.5" />
    <path d="M18 5h1" />
    <path d="M13.5 15.5c0 1 0 2 .5 3.5c0 .5 0 .5-1 1.5h-1c-.73.61-1.57 1.03-2.5 1H9c-1 0-3-1-3.5-4.5l-1-2C4 12.5 4.5 9 7.5 8.5h1a5 5 0 0 1 2.5.5" />
    <path d="M10.5 8.5c0-1.5 1.5-3 3-3c1.5 0 3 1 3 3v1" />
  </svg>
);

export const YogaIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="6" r="2" />
    <path d="M10 14v4a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-4" />
    <path d="M12 20a6 6 0 0 0 6-6c0-4-3-6-6-6s-6 2-6 6a6 6 0 0 0 6 6z" />
    <path d="M12 15v-2" />
  </svg>
);

export const HikeIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M17 21h-6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6l4 4v12a2 2 0 0 1-2 2z" />
    <path d="m9 17 1-4-4-3 2-3 3 2 2-2" />
    <path d="M7 21h-.3a2 2 0 0 1-1.977-2.304l.8-4A2 2 0 0 1 7.5 13H9l.2-1" />
  </svg>
);

export const DogWalkIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5c-1.5 2-2.5 3.5-2.5 5.5 0 2 1 3 3 3s3-1 3-3-1-3.5-2.5-5.5" />
    <path d="M11 3v2" />
    <path d="M8 5h6" />
    <path d="M18 12v1" />
    <path d="M21 13v1" />
    <path d="M22 17c0 1-1 2-2.5 2s-2.5-1-2.5-2c0-.5 0-1 .5-1.5.334-.334.5-1 .5-1.5 0-1 0-3 2-3s2 2 2 3c0 .5.166 1.166.5 1.5.5.5.5 1 .5 1.5z" />
    <path d="M18 19v3" />
    <path d="M18.5 21h2" />
    <path d="M3 18v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M3 18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2H3v2z" />
  </svg>
);

export const PhotoIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

export const MusicIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const BookIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export const MountainIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
);

export const BalanceIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 18a6 6 0 0 0 0-12v12z" />
    <path d="M12 6a6 6 0 0 1 0 12V6z" />
    <path d="M12 18a6 6 0 0 0 0-12" />
    <path d="M12 6a6 6 0 0 1 0 12" />
  </svg>
);

export const CuriosityIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.5 2.5-1.5 3.5L12 12l-2.5-2.5C8.5 8.5 8 7.5 8 6a4 4 0 0 1 4-4z" />
    <path d="M12 12v8" />
    <path d="M12 20h4" />
  </svg>
);

export const ConnectionIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 16h.01" />
    <path d="M8 16h.01" />
    <path d="M12 20h.01" />
    <path d="M12 12h.01" />
    <path d="M12 4h.01" />
    <path d="M4 8h.01" />
    <path d="M20 8h.01" />
    <path d="M4 12h.01" />
    <path d="M20 12h.01" />
    <path d="m14 12-2 2-2-2 2-2 2 2z" />
    <path d="m14 4-2 2-2-2 2-2 2 2z" />
    <path d="m8 8-2 2-2-2 2-2 2 2z" />
    <path d="m22 8-2 2-2-2 2-2 2 2z" />
    <path d="m14 20-2 2-2-2 2-2 2 2z" />
  </svg>
);