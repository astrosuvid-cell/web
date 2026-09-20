'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { BlogPost } from '@/lib/blog';
import { formatBlogDate } from '@/lib/blog';
import { slugify } from '@/lib/slug';

const EMPTY = {
  title: '',
  slug: '',
  excerpt: '',
  category: '',
  image_url: '',
  author: 'Astro Suvid',
  content: '',
  is_published: false,
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
    'Content-Type': 'application/json',
  });

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog', { headers: getHeaders() });
      const data = await res.json();
      if (res.ok) setPosts(data.posts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY);
    setPanelOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      category: post.category || '',
      image_url: post.image_url || '',
      author: post.author,
      content: post.content,
      is_published: post.is_published,
    });
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setEditingId(null);
    setForm(EMPTY);
  };

  const savePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/blog', {
        method: editingId ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to save');
        return;
      }
      closePanel();
      fetchPosts();
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    await fetch('/api/admin/blog', {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ id }),
    });
    fetchPosts();
  };

  const togglePublish = async (post: BlogPost) => {
    await fetch('/api/admin/blog', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ id: post.id, is_published: !post.is_published }),
    });
    fetchPosts();
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Blog"
        description="Write and publish articles for your audience."
        actions={
          <Button onClick={openCreate} className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
            <Plus size={16} /> New article
          </Button>
        }
      />

      <div className="overflow-hidden admin-panel">
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500">Loading articles…</div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-slate-900">No articles yet</p>
            <p className="mt-1 text-sm text-slate-500">Create your first post to show on the website.</p>
            <Button onClick={openCreate} className="mt-4 gap-2 bg-slate-900 text-white hover:bg-slate-800">
              <Plus size={16} /> New article
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Views</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#faf7f2]/80">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{post.title}</p>
                      <p className="text-xs text-slate-500">/blog/{post.slug}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{post.category || '—'}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={post.is_published ? 'active' : 'inactive'} />
                    </td>
                    <td className="px-5 py-4 tabular-nums text-slate-600">{post.view_count || 0}</td>
                    <td className="px-5 py-4 text-slate-500">
                      {formatBlogDate(post.published_at || post.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-slate-200"
                          onClick={() => togglePublish(post)}
                          title={post.is_published ? 'Unpublish' : 'Publish'}
                        >
                          {post.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-slate-200 gap-1"
                          onClick={() => openEdit(post)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => deletePost(post.id)}
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
              <h2 className="text-lg font-semibold">{editingId ? 'Edit article' : 'New article'}</h2>
              <button type="button" onClick={closePanel} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={savePost} className="flex flex-1 flex-col overflow-hidden">
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      placeholder="Vedic Wisdom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Author</Label>
                    <Input
                      value={form.author}
                      onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cover image URL</Label>
                  <Input
                    value={form.image_url}
                    onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                    placeholder="https://…"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Excerpt</Label>
                  <Textarea
                    value={form.excerpt}
                    onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                    rows={2}
                    className="resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    rows={12}
                    required
                    className="resize-none font-mono text-sm"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
                    className="rounded"
                  />
                  Publish immediately
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
