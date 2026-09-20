'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { DbService } from '@/lib/services';
import { parseFeatures } from '@/lib/services';
import { slugify } from '@/lib/slug';
import { Briefcase } from 'lucide-react';

const EMPTY = {
  title: '',
  slug: '',
  description: '',
  long_description: '',
  price: '',
  duration_minutes: '',
  show_price: false,
  features: '',
  image_url: '',
  is_active: true,
  order_index: '0',
};

export default function ServicesPage() {
  const [services, setServices] = useState<DbService[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
    'Content-Type': 'application/json',
  });

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services', { headers: getHeaders() });
      const data = await res.json();
      if (res.ok) {
        setServices(
          (data.services || []).map((s: DbService) => ({
            ...s,
            features: parseFeatures(s.features),
          }))
        );
        setStats(data.stats || { total: 0, active: 0 });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY, order_index: String(services.length) });
    setPanelOpen(true);
  };

  const openEdit = (service: DbService) => {
    setEditingId(service.id);
    setForm({
      title: service.title,
      slug: service.slug,
      description: service.description,
      long_description: service.long_description || '',
      price: service.price != null ? String(service.price) : '',
      duration_minutes:
        service.duration_minutes != null
          ? String(service.duration_minutes)
          : service.duration?.match(/\d+/)?.[0] || '',
      show_price: service.show_price ?? false,
      features: (service.features || []).join('\n'),
      image_url: service.image_url || '',
      is_active: service.is_active,
      order_index: String(service.order_index),
    });
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setEditingId(null);
    setForm(EMPTY);
  };

  const saveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        order_index: parseInt(form.order_index, 10) || 0,
      };
      const res = await fetch('/api/admin/services', {
        method: editingId ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to save');
        return;
      }
      closePanel();
      fetchServices();
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    await fetch('/api/admin/services', {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ id }),
    });
    fetchServices();
  };

  const toggleActive = async (service: DbService) => {
    await fetch('/api/admin/services', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ id: service.id, is_active: !service.is_active }),
    });
    fetchServices();
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Services"
        description="Manage services shown on the website. Inactive services are hidden from the public services page."
        actions={
          <Button onClick={openCreate} className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
            <Plus size={16} /> Add service
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <AdminStatCard label="Total services" value={loading ? '—' : stats.total} icon={Briefcase} />
        <AdminStatCard
          label="Active on site"
          value={loading ? '—' : stats.active}
          hint={loading ? undefined : `${stats.total - stats.active} hidden`}
          icon={Briefcase}
        />
      </div>

      <div className="overflow-hidden admin-panel">
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500">Loading services…</div>
        ) : services.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-slate-900">No services in database</p>
            <p className="mt-1 text-sm text-slate-500">
              Run <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">scripts/seed-services.sql</code> in
              Supabase, or add one below.
            </p>
            <Button onClick={openCreate} className="mt-4 gap-2 bg-slate-900 text-white hover:bg-slate-800">
              <Plus size={16} /> Add service
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-medium">Service</th>
                  <th className="px-5 py-3 font-medium">Duration</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Show price</th>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-[#faf7f2]/80">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{service.title}</p>
                      <p className="text-xs text-slate-500">{service.slug}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {service.duration_minutes != null
                        ? `${service.duration_minutes} min`
                        : service.duration || '—'}
                    </td>
                    <td className="px-5 py-4 tabular-nums text-slate-900">
                      {service.price != null ? `₹${service.price}` : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={service.show_price ? 'active' : 'inactive'} />
                    </td>
                    <td className="px-5 py-4 text-slate-600">{service.order_index}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={service.is_active ? 'active' : 'inactive'} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-slate-200"
                          onClick={() => toggleActive(service)}
                        >
                          {service.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-slate-200 gap-1"
                          onClick={() => openEdit(service)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => deleteService(service.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {panelOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/40" onClick={closePanel} aria-hidden />
          <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-semibold">{editingId ? 'Edit service' : 'New service'}</h2>
              <button type="button" onClick={closePanel} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={saveService} className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        title: e.target.value,
                        slug: f.slug || slugify(e.target.value),
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Short description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={2}
                    required
                    className="resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Full description</Label>
                  <Textarea
                    value={form.long_description}
                    onChange={(e) => setForm((f) => ({ ...f, long_description: e.target.value }))}
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                      placeholder="1500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={form.duration_minutes}
                      onChange={(e) => setForm((f) => ({ ...f, duration_minutes: e.target.value }))}
                      placeholder="60"
                    />
                    <p className="text-xs text-slate-500">Shown as “₹price / 60 min” on the website when pricing is visible.</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.show_price}
                    onChange={(e) => setForm((f) => ({ ...f, show_price: e.target.checked }))}
                    className="rounded"
                  />
                  Show price on public website
                </label>
                <div className="space-y-2">
                  <Label>Features (one per line)</Label>
                  <Textarea
                    value={form.features}
                    onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sort order</Label>
                    <Input
                      type="number"
                      value={form.order_index}
                      onChange={(e) => setForm((f) => ({ ...f, order_index: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={form.image_url}
                      onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                    className="rounded"
                  />
                  Active on website
                </label>
              </div>
              <div className="flex gap-3 border-t border-slate-100 px-5 py-4">
                <Button type="button" variant="outline" className="flex-1" onClick={closePanel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="flex-1 bg-slate-900 text-white hover:bg-slate-800">
                  {saving ? 'Saving…' : editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </aside>
        </>
      )}
    </AdminLayout>
  );
}
