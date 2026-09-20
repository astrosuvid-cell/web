'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(async () => {
        const text = await response.text();
        return { error: `Server error ${response.status}: ${text || response.statusText}` };
      });

      if (!response.ok) {
        setError(data?.error || 'Login failed');
        return;
      }

      localStorage.setItem('adminToken', data.token);
      router.push('/admin/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-shell flex min-h-screen">
      <div className="hidden w-[42%] flex-col justify-between border-r border-stone-200 bg-white p-12 lg:flex">
        <div>
          <img src="/logo.png" alt="Astro Suvid" className="h-12 w-auto max-w-[220px] object-contain" />
          <p className="mt-3 text-sm text-stone-500">Admin panel</p>
        </div>

        <div className="max-w-sm">
          <h1 className="text-3xl font-semibold leading-snug text-stone-900">
            Manage your website content and enquiries.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-stone-500">
            Sign in to update services, products, blog posts, and respond to customer messages.
          </p>
        </div>

        <p className="text-xs text-stone-400">© Astro Suvid. Authorised access only.</p>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-stone-800"
        >
          <ArrowLeft size={16} />
          Back to website
        </Link>

        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden">
            <img src="/logo.png" alt="Astro Suvid" className="h-10 w-auto max-w-[180px] object-contain" />
            <p className="mt-2 text-sm text-stone-500">Admin panel</p>
          </div>

          <h2 className="mt-8 text-xl font-semibold text-stone-900 lg:mt-0">Sign in</h2>
          <p className="mt-1 text-sm text-stone-500">Enter your admin credentials</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="username"
                className="h-11 border-stone-200 bg-white text-stone-900 focus-visible:border-stone-400 focus-visible:ring-stone-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  className="h-11 border-stone-200 bg-white pr-11 text-stone-900 focus-visible:border-stone-400 focus-visible:ring-stone-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-stone-900 text-sm font-medium text-white hover:bg-stone-800"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
