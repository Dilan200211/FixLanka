'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { Wrench, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          router.replace('/admin');
        }
      });
    } catch {
      // Env variables not yet set
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError('Failed to authenticate.');
        setLoading(false);
        return;
      }

      // Verify the user is an authorized admin in admin_users
      const { data: adminRecord, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle();

      if (adminError || !adminRecord) {
        await supabase.auth.signOut();
        setError('Access denied: this account is not registered in the admin_users table.');
        setLoading(false);
        return;
      }

      router.replace('/admin');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify Supabase environment variables.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mx-auto mb-4">
            <Wrench size={24} />
          </div>
          <h1 className="text-xl font-bold text-navy">{t.admin.login}</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-border p-6 space-y-4"
        >
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-navy mb-1.5"
            >
              {t.admin.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-navy mb-1.5"
            >
              {t.admin.passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-white rounded-lg font-medium text-sm
                       hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {loading ? t.common.loading : t.admin.signIn}
          </button>
        </form>
      </div>
    </main>
  );
}
