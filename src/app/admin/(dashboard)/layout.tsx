import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  robots: { index: false, follow: false },
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 p-5 sm:p-8">{children}</div>
    </div>
  );
}
