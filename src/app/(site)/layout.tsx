import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSiteLogo } from "@/lib/db";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const logoUrl = getSiteLogo() ?? null;

  return (
    <>
      <Header logoUrl={logoUrl} />
      <main className="flex-1">{children}</main>
      <Footer logoUrl={logoUrl} />
    </>
  );
}
