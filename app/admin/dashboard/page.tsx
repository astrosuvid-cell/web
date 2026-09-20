'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Inbox, ShoppingBag, ArrowRight } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import StatusBadge from '@/components/admin/StatusBadge';

interface ContactPreview {
  id: string;
  name: string;
  email: string;
  service_type: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, new: 0 });
  const [activeServices, setActiveServices] = useState(0);
  const [recent, setRecent] = useState<ContactPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const headers = { Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}` };
    try {
      const [contactsRes, servicesRes] = await Promise.all([
        fetch('/api/admin/contacts', { headers }),
        fetch('/api/admin/services', { headers }),
      ]);
      if (contactsRes.ok) {
        const data = await contactsRes.json();
        setStats({ total: data.stats?.total || 0, new: data.stats?.new || 0 });
        setRecent((data.contacts || []).slice(0, 6));
      }
      if (servicesRes.ok) {
        const data = await servicesRes.json();
        setActiveServices(data.stats?.active || 0);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const respondedRate =
    stats.total > 0 ? Math.round(((stats.total - stats.new) / stats.total) * 100) : 0;

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of enquiries and services."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total enquiries"
          value={loading ? '—' : stats.total}
          hint={loading ? undefined : `${stats.new} awaiting review`}
          icon={Inbox}
        />
        <AdminStatCard
          label="New"
          value={loading ? '—' : stats.new}
          hint="Needs attention"
          icon={MessageSquare}
        />
        <AdminStatCard
          label="Active services"
          value={loading ? '—' : activeServices}
          hint="Visible on site"
          icon={ShoppingBag}
        />
        <AdminStatCard
          label="Handled"
          value={loading ? '—' : `${respondedRate}%`}
          hint="Read or responded"
          icon={MessageSquare}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="admin-panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-stone-900">Recent enquiries</h2>
              <Link
                href="/admin/contacts"
                className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 transition-colors hover:text-stone-900"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="px-5 py-14 text-center text-sm text-stone-500">Loading…</div>
            ) : recent.length === 0 ? (
              <div className="px-5 py-14 text-center text-sm text-stone-500">No enquiries yet.</div>
            ) : (
              <div className="divide-y divide-stone-100">
                {recent.map((item) => (
                  <Link
                    key={item.id}
                    href="/admin/contacts"
                    className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-stone-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-900">{item.name}</p>
                      <p className="truncate text-xs text-stone-500">
                        {item.service_type || 'General'} · {item.email}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <StatusBadge status={item.status} />
                      <span className="text-[11px] text-stone-400">
                        {new Date(item.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="admin-panel p-5">
            <h2 className="text-sm font-semibold text-stone-900">Quick links</h2>
            <div className="mt-4 space-y-2">
              {[
                { href: '/admin/contacts', label: 'Review enquiries', desc: 'Filter and respond' },
                { href: '/admin/astromall', label: 'Manage products', desc: 'Astro Mall catalog' },
                { href: '/admin/services', label: 'Edit services', desc: 'Pricing and visibility' },
                { href: '/admin/settings', label: 'Settings', desc: 'Contact details and password' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between rounded-lg border border-stone-100 px-4 py-3 transition-colors hover:bg-stone-50"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-900">{action.label}</p>
                    <p className="text-xs text-stone-500">{action.desc}</p>
                  </div>
                  <ArrowRight size={16} className="text-stone-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
