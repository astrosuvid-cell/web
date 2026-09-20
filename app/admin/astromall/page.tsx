'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  LayoutGrid,
  List,
  Package,
  IndianRupee,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Product {
  id: string;
  name: string;
  image_url: string;
  price: number;
  price_type: 'total' | 'per_unit';
  unit_name: 'total' | 'ratti';
  description: string;
  is_active: boolean;
}

const EMPTY_FORM = {
  name: '',
  image_url: '',
  price: '',
  price_type: 'total' as 'total' | 'per_unit',
  unit_name: 'total' as 'total' | 'ratti',
  description: '',
};

type StatusFilter = 'all' | 'active' | 'inactive';
type PriceFilter = 'all' | 'total' | 'per_unit';
type ViewMode = 'grid' | 'table';

export default function AstroMallAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (statusFilter === 'active') result = result.filter((p) => p.is_active);
    if (statusFilter === 'inactive') result = result.filter((p) => !p.is_active);
    if (priceFilter !== 'all') result = result.filter((p) => p.price_type === priceFilter);

    return result;
  }, [products, searchTerm, statusFilter, priceFilter]);

  const stats = useMemo(
    () => ({
      total: products.length,
      active: products.filter((p) => p.is_active).length,
      perUnit: products.filter((p) => p.price_type === 'per_unit').length,
    }),
    [products]
  );

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setPanelOpen(true);
  };

  const openEdit = (product: Product) => {
    setFormData({
      name: product.name,
      image_url: product.image_url || '',
      price: product.price.toString(),
      price_type: product.price_type,
      unit_name: product.unit_name,
      description: product.description || '',
    });
    setEditingId(product.id);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('adminToken')!;

    try {
      const response = await fetch('/api/admin/products', {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingId ? { id: editingId, ...formData } : formData),
      });

      if (response.ok) {
        closePanel();
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;

    const token = localStorage.getItem('adminToken')!;
    try {
      const response = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const formatPrice = (product: Product) => {
    const base = `₹${product.price}`;
    if (product.price_type === 'per_unit') {
      return `${base} / ${product.unit_name}`;
    }
    return base;
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Astro Mall"
        description="Manage gemstones and astro products for the storefront."
        actions={
          <Button
            onClick={openCreate}
            className="gap-2 bg-slate-900 text-white hover:bg-slate-800"
          >
            <Plus size={16} /> Add product
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <AdminStatCard label="Total products" value={loading ? '—' : stats.total} icon={Package} />
        <AdminStatCard
          label="Active listings"
          value={loading ? '—' : stats.active}
          hint={loading ? undefined : `${stats.total - stats.active} hidden`}
          icon={Package}
        />
        <AdminStatCard
          label="Per-unit pricing"
          value={loading ? '—' : stats.perUnit}
          hint="Ratti-based items"
          icon={IndianRupee}
        />
      </div>

      {/* Filters */}
      <div className="mt-8 admin-panel p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Search products…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 border-slate-200 bg-slate-50/50 pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'active', 'inactive'] as const).map((status) => (
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
                {status}
              </button>
            ))}

            <span className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />

            {(['all', 'total', 'per_unit'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setPriceFilter(type)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  priceFilter === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'per_unit' ? 'Per unit' : type === 'all' ? 'All pricing' : 'Fixed'}
              </button>
            ))}

            <span className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />

            <div className="flex rounded-lg border border-slate-200 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`rounded-md p-1.5 ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                aria-label="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`rounded-md p-1.5 ${viewMode === 'table' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                aria-label="Table view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Product list */}
      <div className="mt-6">
        {loading ? (
          <div className="admin-panel py-20 text-center text-sm text-slate-500 shadow-sm">
            Loading catalog…
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white py-20 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-900">No products match your filters</p>
            <p className="mt-2 text-sm text-slate-500">
              {products.length === 0 ? 'Add your first product to get started.' : 'Try adjusting filters.'}
            </p>
            {products.length === 0 && (
              <Button onClick={openCreate} className="mt-4 gap-2 bg-slate-900 text-white hover:bg-slate-800">
                <Plus size={16} /> Add product
              </Button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden admin-panel transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300">
                      <Package size={40} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute right-3 top-3">
                    <StatusBadge status={product.is_active ? 'active' : 'inactive'} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{product.name}</h3>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
                    {formatPrice(product)}
                  </p>
                  {product.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {product.description}
                    </p>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 flex-1 border-slate-200 gap-1"
                      onClick={() => openEdit(product)}
                    >
                      <Pencil size={14} /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden admin-panel">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium">Pricing</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-[#faf7f2]/80">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-slate-300">
                                <Package size={16} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900">{product.name}</p>
                            <p className="line-clamp-1 text-xs text-slate-500">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium tabular-nums text-slate-900">
                        {formatPrice(product)}
                      </td>
                      <td className="px-5 py-4 capitalize text-slate-600">
                        {product.price_type.replace('_', ' ')}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={product.is_active ? 'active' : 'inactive'} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-slate-200 gap-1"
                            onClick={() => openEdit(product)}
                          >
                            <Pencil size={14} /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => deleteProduct(product.id)}
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
          </div>
        )}
      </div>

      {/* Slide-over panel */}
      {panelOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={closePanel}
            aria-hidden
          />
          <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl sm:max-w-lg">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingId ? 'Edit product' : 'New product'}
                </h2>
                <p className="text-xs text-slate-500">Changes reflect on the Astro Mall storefront.</p>
              </div>
              <button
                type="button"
                onClick={closePanel}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveProduct} className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Product name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price type</Label>
                    <Select
                      value={formData.price_type}
                      onValueChange={(v) =>
                        setFormData({ ...formData, price_type: v as 'total' | 'per_unit' })
                      }
                    >
                      <SelectTrigger className="border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="total">Fixed total</SelectItem>
                        <SelectItem value="per_unit">Per unit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select
                      value={formData.unit_name}
                      onValueChange={(v) =>
                        setFormData({ ...formData, unit_name: v as 'total' | 'ratti' })
                      }
                    >
                      <SelectTrigger className="border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="total">Total</SelectItem>
                        <SelectItem value="ratti">Ratti</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      placeholder="https://…"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Benefits, weight, origin…"
                    rows={4}
                    className="border-slate-200 resize-none"
                  />
                </div>

                {formData.image_url && (
                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="aspect-video w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 border-t border-slate-100 px-5 py-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-slate-200"
                  onClick={closePanel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-slate-900 text-white hover:bg-slate-800"
                >
                  {saving ? 'Saving…' : editingId ? 'Update product' : 'Create product'}
                </Button>
              </div>
            </form>
          </aside>
        </>
      )}
    </AdminLayout>
  );
}
