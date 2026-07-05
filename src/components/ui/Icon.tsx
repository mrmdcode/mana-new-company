import {
  Workflow,
  RefreshCcw,
  ShieldCheck,
  Store,
  Lock,
  Headphones,
  ShoppingCart,
  IdCard,
  Shield,
  Rocket,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  automation: Workflow,
  subscription: RefreshCcw,
  "shield-check": ShieldCheck,
  storefront: Store,
  lock: Lock,
  support: Headphones,
  workflow: Workflow,
  cart: ShoppingCart,
  "id-card": IdCard,
  shield: Shield,
  repeat: RefreshCcw,
  rocket: Rocket,
};

export default function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const LucideComponent = ICONS[name] ?? Shield;
  return <LucideComponent className={className} aria-hidden="true" />;
}
