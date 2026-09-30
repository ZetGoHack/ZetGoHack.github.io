const PATHS = {
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  eyeOff: 'M3 3l18 18M10.6 5.1A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2M6.6 6.6C3.9 8.3 2 12 2 12s3.6 7 10 7c1.9 0 3.5-.6 4.9-1.4M9.9 9.9a3 3 0 0 0 4.2 4.2',
  star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z',
  pencil: 'M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4',
  grip: 'M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  plus: 'M12 5v14M5 12h14',
} as const;

export default function Icon({ name, filled = false }: { name: keyof typeof PATHS; filled?: boolean }) {
  return (
    <svg
      class="icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      stroke-width={name === 'grip' ? 3 : 1.8}
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
