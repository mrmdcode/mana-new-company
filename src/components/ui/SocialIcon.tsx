type SocialName = "instagram" | "telegram" | "linkedin" | "whatsapp";

const paths: Record<SocialName, React.ReactNode> = {
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </g>
  ),
  telegram: (
    <path
      fill="currentColor"
      d="M21.9 3.5 18.6 20c-.2 1-.9 1.3-1.7.8l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8L18 8.3c.4-.3 0-.5-.5-.2L6.6 14.7 2 13.2c-1-.3-1-1 .2-1.4l18-6.9c.8-.3 1.6.2 1.3 1.6Z"
    />
  ),
  linkedin: (
    <path
      fill="currentColor"
      d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8.3 18.3H5.7V9.8h2.6v8.5ZM7 8.7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm11.3 9.6h-2.6v-4.1c0-1 0-2.3-1.4-2.3s-1.7 1.1-1.7 2.2v4.2H10V9.8h2.5v1.2h.1c.3-.7 1.2-1.4 2.5-1.4 2.7 0 3.2 1.8 3.2 4.1v4.6Z"
    />
  ),
  whatsapp: (
    <path
      fill="currentColor"
      d="M17 14.2c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.5.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s1 2.5 1.1 2.6c.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3ZM12 22c-1.7 0-3.4-.5-4.9-1.3L2 22l1.4-5c-.9-1.5-1.4-3.3-1.4-5.1C2 6.4 6.5 2 12 2s10 4.4 10 9.9-4.5 10.1-10 10.1Z"
    />
  ),
};

export default function SocialIcon({
  name,
  className,
}: {
  name: SocialName;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
