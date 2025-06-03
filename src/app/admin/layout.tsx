import { AdminNavbar } from '@/components/admin/AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1]">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
} 