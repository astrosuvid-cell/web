'use client';

import type { ReactNode } from 'react';
import { useAdminAuth } from '@/lib/adminAuth';
import AdminSidebar from '@/components/AdminSidebar';
import AdminLoading from '@/components/admin/AdminLoading';
import {
  AdminNavProvider,
  AdminContentTransition,
} from '@/components/admin/AdminRouteProgress';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, logout } = useAdminAuth();

  if (loading) {
    return <AdminLoading />;
  }

  if (!user) {
    return null;
  }

  return (
    <AdminNavProvider>
      <div className="admin-shell min-h-screen">
        <div className="pointer-events-none fixed inset-0 admin-shell-grid opacity-[0.35]" aria-hidden />
        <AdminSidebar user={user} onLogout={logout} />
        <div className="relative min-h-screen pt-14 md:ml-[272px] md:pt-0">
          <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <AdminContentTransition>{children}</AdminContentTransition>
          </div>
        </div>
      </div>
    </AdminNavProvider>
  );
}
