'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Inbox, MessageSquare, Briefcase, BookOpen, ShoppingBag } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';

interface AnalyticsData {
  summary: {
    totalEnquiries: number;
    newEnquiries: number;
    activeServices: number;
    totalServices: number;
    publishedPosts: number;
    totalPostViews: number;
    activeProducts: number;
    pageViewEvents: number;
  };
  enquiriesByDay: { date: string; count: number }[];
  statusBreakdown: { new: number; read: number; responded: number };
  enquiriesByService: { name: string; count: number }[];
  topPages: { page: string; views: number }[];
}

const STATUS_COLORS = ['#f59e0b', '#3b82f6', '#10b981'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/admin/analytics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}` },
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const statusPie = data
    ? [
        { name: 'New', value: data.statusBreakdown.new },
        { name: 'Read', value: data.statusBreakdown.read },
        { name: 'Responded', value: data.statusBreakdown.responded },
      ].filter((d) => d.value > 0)
    : [];

  const formatDay = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Analytics"
        description="Enquiry trends, service interest, and site activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total enquiries"
          value={loading ? '—' : data?.summary.totalEnquiries ?? 0}
          hint={loading ? undefined : `${data?.summary.newEnquiries ?? 0} new`}
          icon={Inbox}
        />
        <AdminStatCard
          label="Active services"
          value={loading ? '—' : data?.summary.activeServices ?? 0}
          hint={loading ? undefined : `of ${data?.summary.totalServices ?? 0} total`}
          icon={Briefcase}
        />
        <AdminStatCard
          label="Published articles"
          value={loading ? '—' : data?.summary.publishedPosts ?? 0}
          hint={loading ? undefined : `${data?.summary.totalPostViews ?? 0} total views`}
          icon={BookOpen}
        />
        <AdminStatCard
          label="Active products"
          value={loading ? '—' : data?.summary.activeProducts ?? 0}
          icon={ShoppingBag}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="admin-panel p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Enquiries — last 7 days</h3>
          {loading ? (
            <div className="flex h-64 items-center justify-center text-sm text-slate-500">Loading…</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data?.enquiriesByDay || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tickFormatter={formatDay} tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={formatDay} />
                <Bar dataKey="count" fill="#1e293b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="admin-panel p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Enquiry status</h3>
          {loading || statusPie.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-slate-500">
              {loading ? 'Loading…' : 'No enquiry data yet'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusPie.map((_, i) => (
                    <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="admin-panel p-5 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-900">Enquiries by service type</h3>
          {loading || !data?.enquiriesByService.length ? (
            <div className="py-12 text-center text-sm text-slate-500">
              {loading ? 'Loading…' : 'No service breakdown yet'}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {data.enquiriesByService.map((item) => {
                const max = data.enquiriesByService[0]?.count || 1;
                const pct = Math.round((item.count / max) * 100);
                return (
                  <div key={item.name}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-slate-700">{item.name}</span>
                      <span className="tabular-nums text-slate-500">{item.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-800 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {data && data.topPages.length > 0 && (
          <div className="admin-panel p-5 shadow-sm lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900">Top pages (tracked views)</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {data.topPages.map((p) => (
                <div
                  key={p.page}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 text-sm"
                >
                  <span className="truncate text-slate-700">{p.page}</span>
                  <span className="ml-2 shrink-0 tabular-nums text-slate-500">{p.views} views</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        <MessageSquare size={14} />
        Enquiry data comes from contact form submissions. Page views appear when analytics tracking is enabled.
      </div>
    </AdminLayout>
  );
}
