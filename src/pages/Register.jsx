import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineUser,
} from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import AuthLayout from '../components/auth/AuthLayout';
import PasswordInput from '../components/auth/PasswordInput';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Register() {
  useDocumentTitle('Daftar');

  const { register, loginWithGoogle, updateDisplayName, error, clearError, user } =
    useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.warning('Password minimal 6 karakter');
      return;
    }
    if (password !== confirm) {
      toast.warning('Konfirmasi password tidak cocok');
      return;
    }
    try {
      setLoading(true);
      await register(email, password);
      if (name.trim()) {
        try {
          await updateDisplayName(name.trim());
        } catch {
          /* ignore */
        }
      }
      toast.success('Akun berhasil dibuat');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Gagal mendaftar');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      toast.success('Berhasil masuk dengan Google');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Gagal masuk dengan Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Daftar"
      subtitle="Buat akun untuk menyimpan bookmark dan riwayat bacaan."
      footer={
        <>
          Sudah punya akun?{' '}
          <Link
            to="/login"
            className="font-medium text-emerald-main hover:text-emerald-deep"
          >
            Masuk
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="label">
            Nama (opsional)
          </label>
          <div className="relative">
            <HiOutlineUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-pale" />
            <input
              id="name"
              type="text"
              autoComplete="name"
              className="input pl-9"
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

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

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="relative">
            <HiOutlineLockClosed className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-pale z-10" />
            <PasswordInput
              id="password"
              autoComplete="new-password"
              className="pl-9"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirm" className="label">
            Konfirmasi password
          </label>
          <div className="relative">
            <HiOutlineLockClosed className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-pale z-10" />
            <PasswordInput
              id="confirm"
              autoComplete="new-password"
              className="pl-9"
              placeholder="Ulangi password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600">
            {error}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={loading}
          disabled={googleLoading}
        >
          Buat akun
        </Button>

        <div className="flex items-center gap-3 text-xs text-ink-pale">
          <div className="h-px flex-1 bg-line" />
          <span>atau</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleGoogle}
          loading={googleLoading}
          disabled={loading}
          leftIcon={<FcGoogle className="h-5 w-5" />}
        >
          Daftar dengan Google
        </Button>
      </form>
    </AuthLayout>
  );
}