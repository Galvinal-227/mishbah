import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineEnvelope, HiOutlineCheckCircle } from 'react-icons/hi2';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function ForgotPassword() {
  useDocumentTitle('Lupa Password');

  const { resetPassword, error, clearError } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning('Masukkan email Anda');
      return;
    }
    try {
      setLoading(true);
      await resetPassword(email);
      setSent(true);
      toast.success('Email reset terkirim');
    } catch (err) {
      toast.error(err?.message || 'Gagal mengirim email reset');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout
        title="Email terkirim"
        subtitle="Periksa kotak masuk Anda untuk tautan reset password."
        footer={
          <Link
            to="/login"
            className="font-medium text-emerald-main hover:text-emerald-deep"
          >
            ← Kembali ke halaman masuk
          </Link>
        }
      >
        <div className="rounded-2xl border border-emerald-main/20 bg-emerald-soft/50 p-5 flex items-start gap-3">
          <HiOutlineCheckCircle className="h-5 w-5 text-emerald-main shrink-0 mt-0.5" />
          <div className="text-sm text-ink-soft">
            Kami telah mengirim tautan reset password ke{' '}
            <span className="font-medium text-ink">{email}</span>. Cek juga
            folder spam jika tidak menemukannya.
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Lupa password"
      subtitle="Masukkan email Anda. Kami akan mengirim tautan untuk mengatur ulang password."
      footer={
        <Link
          to="/login"
          className="font-medium text-emerald-main hover:text-emerald-deep"
        >
          ← Kembali ke halaman masuk
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <div className="relative">
            <HiOutlineEnvelope className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-pale" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="input pl-9"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Kirim tautan reset
        </Button>
      </form>
    </AuthLayout>
  );
}