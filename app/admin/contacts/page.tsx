'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Download, Search, Trash2, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ContactResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  created_at: string;
}

const STATUS_FILTERS = ['all', 'new', 'read', 'responded'] as const;

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactResponse | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const serviceTypes = useMemo(() => {
    const types = new Set(contacts.map((c) => c.service_type).filter(Boolean));
    return Array.from(types).sort();
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    let result = [...contacts];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q) ||
          c.message.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (serviceFilter !== 'all') {
      result = result.filter((c) => c.service_type === serviceFilter);
    }

    return result.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [contacts, searchTerm, statusFilter, serviceFilter]);

  const counts = useMemo(
    () => ({
      all: contacts.length,
      new: contacts.filter((c) => c.status === 'new').length,
      read: contacts.filter((c) => c.status === 'read').length,
      responded: contacts.filter((c) => c.status === 'responded').length,
    }),
    [contacts]
  );

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
  });

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/contacts', { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: ContactResponse['status']) => {
    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (response.ok) {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
        if (selectedContact?.id === id) {
          setSelectedContact((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Delete this enquiry permanently?')) return;
    try {
      const response = await fetch(`/api/admin/contacts?id=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
        if (selectedContact?.id === id) setSelectedContact(null);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Service', 'Status', 'Date', 'Message'],
      ...filteredContacts.map((c) => [
        c.name,
        c.email,
        c.phone || '',
        c.service_type || '',
        c.status,
        new Date(c.created_at).toLocaleDateString(),
        c.message.replace(/"/g, '""'),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setServiceFilter('all');
  };

  const hasActiveFilters =
    searchTerm || statusFilter !== 'all' || serviceFilter !== 'all';

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Enquiries"
        description="All form submissions from the website — contact, vastu, matchmaking, matrimonial."
        actions={
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="gap-2 border-slate-200 bg-white text-slate-700 hover:bg-[#faf7f2]"
          >
            <Download size={16} />
            Export CSV
          </Button>
        }
      />

      {/* Filters */}
      <div className="mb-6 space-y-4 admin-panel p-4 shadow-sm sm:p-5">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Search name, email, phone, message…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-slate-200 bg-slate-50/50 pl-9"
          />
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'All' : status}
                <span className="ml-1.5 tabular-nums opacity-70">
                  {counts[status]}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
            >
              <option value="all">All services</option>
              {serviceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                <X size={14} /> Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        {/* Table */}
        <div className="xl:col-span-7 2xl:col-span-8">
          <div className="overflow-hidden admin-panel">
            <div className="border-b border-slate-100 px-5 py-3.5">
              <p className="text-sm font-medium text-slate-900">
                {filteredContacts.length} result{filteredContacts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {dataLoading ? (
              <div className="py-16 text-center text-sm text-slate-500">Loading enquiries…</div>
            ) : filteredContacts.length === 0 ? (
              <div className="py-16 text-center text-sm text-slate-500">No enquiries match your filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Service</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredContacts.map((contact) => (
                      <tr
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className={`cursor-pointer transition-colors hover:bg-[#faf7f2] ${
                          selectedContact?.id === contact.id ? 'bg-blue-50/60' : ''
                        }`}
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-900">{contact.name}</p>
                          <p className="text-xs text-slate-500">{contact.email}</p>
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {contact.service_type || '—'}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={contact.status} />
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {new Date(contact.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div className="xl:col-span-5 2xl:col-span-4">
          {selectedContact ? (
            <div className="sticky top-6 overflow-hidden admin-panel">
              <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{selectedContact.name}</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {new Date(selectedContact.created_at).toLocaleString('en-IN')}
                  </p>
                </div>
                <StatusBadge status={selectedContact.status} />
              </div>

              <div className="space-y-4 px-5 py-5 text-sm">
                <DetailRow label="Email">
                  <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                    {selectedContact.email}
                  </a>
                </DetailRow>
                {selectedContact.phone && (
                  <DetailRow label="Phone">
                    <a href={`tel:${selectedContact.phone}`} className="text-blue-600 hover:underline">
                      {selectedContact.phone}
                    </a>
                  </DetailRow>
                )}
                {selectedContact.service_type && (
                  <DetailRow label="Service">{selectedContact.service_type}</DetailRow>
                )}
                <DetailRow label="Message">
                  <p className="whitespace-pre-wrap leading-relaxed text-slate-700">
                    {selectedContact.message}
                  </p>
                </DetailRow>
              </div>

              <div className="space-y-2 border-t border-slate-100 px-5 py-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-200"
                    onClick={() => updateStatus(selectedContact.id, 'read')}
                  >
                    Mark read
                  </Button>
                  <Button
                    size="sm"
                    className="bg-slate-900 text-white hover:bg-slate-800"
                    onClick={() => updateStatus(selectedContact.id, 'responded')}
                  >
                    Responded
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => deleteContact(selectedContact.id)}
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete enquiry
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
              <p className="text-sm text-slate-500">Select an enquiry to view full details.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="text-slate-800">{children}</div>
    </div>
  );
}
