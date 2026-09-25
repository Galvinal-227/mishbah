import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import AuthLayout from '../components/auth/AuthLayout';
import PasswordInput from '../components/auth/PasswordInput';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Login() {
  useDocumentTitle('Masuk');

  const { login, loginWithGoogle, error, clearError, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user, navigate, redirectTo]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Isi email dan password');
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
      toast.success('Berhasil masuk');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Gagal masuk');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      toast.success('Berhasil masuk dengan Google');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Gagal masuk dengan Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Masuk"
      subtitle="Selamat datang kembali. Lanjutkan tilawah Anda."
      footer={
        <>
          Belum punya akun?{' '}
          <Link
            to="/register"
            className="font-medium text-emerald-main hover:text-emerald-deep"
          >
            Daftar sekarang
          </Link>
        </>
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

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="label !mb-0">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-emerald-main hover:text-emerald-deep"
            >
              Lupa password?
            </Link>
          </div>
          <div className="relative">
            <HiOutlineLockClosed className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-pale z-10" />
            <PasswordInput
              id="password"
              autoComplete="current-password"
              className="pl-9"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          Masuk
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
          Lanjut dengan Google
        </Button>
      </form>
    </AuthLayout>
  );
}