export const Icon = {
  Dashboard: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="3" y="3" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="3" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="15" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="11" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Controls: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <line x1="6" y1="3" x2="6" y2="21" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" />
      <line x1="18" y1="3" x2="18" y2="21" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="8" r="2.5" fill="currentColor" />
      <circle cx="12" cy="14" r="2.5" fill="currentColor" />
      <circle cx="18" cy="11" r="2.5" fill="currentColor" />
    </svg>
  ),
  Camera: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 6l1.5-2h5L16 6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Settings: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Network: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M2 9.5a14 14 0 0 1 20 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 13a10 10 0 0 1 14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 16.5a6 6 0 0 1 8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="20" r="1.4" fill="currentColor" />
    </svg>
  ),
  Heat: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 3c-1 2-3 3-3 6a3 3 0 0 0 6 0c0-1-1-1.5-1-3 0-1.5 1-2 1-3 0 0-1 1-3 0z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 14c-2 2-3 4-3 5a4 4 0 0 0 8 0M17 14c2 2 3 4 3 5a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Mist: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 9h12M4 13h16M4 17h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="19" cy="9" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="15" cy="17" r="1.2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  Chevron: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Refresh: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 4v4h-4M21 12a9 9 0 0 1-15.5 6.3L3 16M3 20v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Power: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 3v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.5 7a8 8 0 1 0 11 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Wifi: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M2 9a14 14 0 0 1 20 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5.5 12.5a10 10 0 0 1 13 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 16a5 5 0 0 1 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="19" r="1.4" fill="currentColor" />
    </svg>
  ),
  Maximize: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Snap: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 6l1-2h6l1 2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};
