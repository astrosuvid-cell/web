import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/adminRequest';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { slugify } from '@/lib/slug';

export async function GET(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ posts: data || [] });
  } catch (error) {
    console.error('Admin blog GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { title, slug, content, excerpt, category, image_url, author, is_published } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const finalSlug = slug?.trim() || slugify(title);
    const published = Boolean(is_published);

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert({
        title: title.trim(),
        slug: finalSlug,
        content: content.trim(),
        excerpt: excerpt?.trim() || null,
        category: category?.trim() || null,
        image_url: image_url?.trim() || null,
        author: author?.trim() || 'Astro Suvid',
        is_published: published,
        published_at: published ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ post: data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create post';
    console.error('Admin blog POST error:', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { id, title, slug, content, excerpt, category, image_url, author, is_published } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (title !== undefined) updates.title = title.trim();
    if (slug !== undefined) updates.slug = slug.trim() || slugify(title || '');
    if (content !== undefined) updates.content = content.trim();
    if (excerpt !== undefined) updates.excerpt = excerpt?.trim() || null;
    if (category !== undefined) updates.category = category?.trim() || null;
    if (image_url !== undefined) updates.image_url = image_url?.trim() || null;
    if (author !== undefined) updates.author = author?.trim() || 'Astro Suvid';
    if (is_published !== undefined) {
      updates.is_published = Boolean(is_published);
      updates.published_at = is_published ? new Date().toISOString() : null;
    }

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ post: data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update post';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin blog DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
