'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  ShoppingBag,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import type { AdminUser } from '@/lib/adminAuth';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAdminNav } from '@/components/admin/AdminRouteProgress';

interface AdminSidebarProps {
  user: AdminUser;
  onLogout: () => void;
}

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Inbox',
    items: [{ href: '/admin/contacts', label: 'Enquiries', icon: Inbox }],
  },
  {
    label: 'Catalog',
    items: [
      { href: '/admin/astromall', label: 'Astro Mall', icon: ShoppingBag },
      { href: '/admin/services', label: 'Services', icon: Briefcase },
    ],
  },
  {
    label: 'Content',
    items: [{ href: '/admin/blog', label: 'Blog', icon: BookOpen }],
  },
  {
    label: 'Insights',
    items: [{ href: '/admin/analytics', label: 'Analytics', icon: BarChart3 }],
  },
  {
    label: 'Website',
    items: [{ href: '/admin/settings', label: 'Settings', icon: Settings }],
  },
];

function NavContent({
  pathname,
  onNavigate,
  user,
  onLogout,
}: {
  pathname: string;
  onNavigate?: () => void;
  user: AdminUser;
  onLogout: () => void;
}) {
  const { startNavigation } = useAdminNav();
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleNavClick = (href: string) => {
    if (pathname !== href) startNavigation();
    onNavigate?.();
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-white/10 px-5 py-5">
        <Link href="/admin/dashboard" onClick={onNavigate} className="flex items-center gap-3">
          <img
            src="/logo-mark.png"
            alt=""
            className="h-10 w-10 shrink-0 object-contain"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight text-white">Astro Suvid</p>
            <p className="text-xs text-stone-500">Admin panel</p>
          </div>
        </Link>
      </div>

      <ScrollArea className="admin-sidebar-scroll min-h-0 flex-1">
        <nav className="space-y-6 px-3 py-5 pr-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-xs text-stone-500">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        isActive
                          ? 'bg-white/10 font-medium text-white'
                          : 'text-stone-400 hover:bg-white/5 hover:text-stone-200'
                      }`}
                    >
                      <Icon
                        size={17}
                        strokeWidth={isActive ? 2 : 1.75}
                        className={isActive ? 'text-[#c4a574]' : undefined}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="shrink-0 space-y-2 border-t border-white/10 p-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={15} />
          View website
        </a>
        <div className="rounded-lg bg-white/5 px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-700 text-[11px] font-semibold text-white">
              {initials || 'AS'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-stone-500">{user.email}</p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-rose-300 transition-colors hover:bg-rose-500/10"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar({ user, onLogout }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentPage =
    NAV_GROUPS.flatMap((g) => g.items).find((i) => i.href === pathname)?.label ?? 'Admin';

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-stone-200 bg-white px-4 md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-700"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <span className="text-sm font-semibold text-stone-900">{currentPage}</span>
        <div className="w-9" />
      </header>

      <aside className="admin-sidebar fixed left-0 top-0 z-40 hidden h-screen w-[272px] flex-col md:flex">
        <NavContent pathname={pathname} user={user} onLogout={onLogout} />
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <aside className="admin-sidebar absolute left-0 top-0 flex h-full w-[min(100vw,280px)] flex-col shadow-2xl">
            <div className="flex shrink-0 items-center justify-end p-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 hover:bg-white/10 hover:text-white"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col">
              <NavContent
                pathname={pathname}
                onNavigate={() => setIsOpen(false)}
                user={user}
                onLogout={onLogout}
              />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
