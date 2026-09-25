import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineCalendarDays,
  HiOutlinePencilSquare,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBookmark,
  HiOutlineClock,
} from 'react-icons/hi2';
import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../contexts/UserDataContext';
import { useToast } from '../contexts/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { formatDate } from '../utils/dateFormat';

export default function Profile() {
  useDocumentTitle('Profil');

  const { user, logout, updateDisplayName } = useAuth();
  const { bookmarks, lastRead } = useUserData();
  const toast = useToast();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(user?.displayName ?? '');
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  if (!user) return null;

  const initial = (user.displayName || user.email || 'U')
    .charAt(0)
    .toUpperCase();
  const joined = user.metadata?.creationTime
    ? formatDate(user.metadata.creationTime)
    : '—';

  const handleSave = async () => {
    if (!name.trim()) {
      toast.warning('Nama tidak boleh kosong');
      return;
    }
    try {
      setSaving(true);
      await updateDisplayName(name.trim());
      toast.success('Nama diperbarui');
      setEditOpen(false);
    } catch (err) {
      toast.error(err?.message || 'Gagal memperbarui nama');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      toast.success('Berhasil logout');
      navigate('/');
    } catch (err) {
      toast.error(err?.message || 'Gagal logout');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="container-page py-6 sm:py-10 max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-ink mb-1">
        Profil
      </h1>
      <p className="text-sm text-ink-muted mb-6">
        Kelola informasi akun dan lihat aktivitas Anda.
      </p>

      <Card className="mb-5">
        <div className="flex items-start gap-5">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-main to-emerald-deep text-white text-2xl font-semibold shadow-soft">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display text-xl text-ink truncate">
                {user.displayName || user.email?.split('@')[0]}
              </h2>
              <button
                onClick={() => {
                  setName(user.displayName ?? '');
                  setEditOpen(true);
                }}
                aria-label="Edit nama"
                className="btn-icon shrink-0"
              >
                <HiOutlinePencilSquare className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-ink-muted">
              <HiOutlineEnvelope className="h-4 w-4" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-ink-pale mt-1">
              <HiOutlineCalendarDays className="h-3.5 w-3.5" />
              Bergabung {joined}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <Card className="text-center">
          <HiOutlineBookmark className="h-6 w-6 mx-auto mb-2 text-emerald-main" />
          <div className="font-display text-2xl font-semibold text-ink">
            {bookmarks?.length ?? 0}
          </div>
          <div className="text-xs text-ink-muted">Bookmark</div>
        </Card>
        <Card className="text-center">
          <HiOutlineClock className="h-6 w-6 mx-auto mb-2 text-emerald-main" />
          <div className="font-display text-2xl font-semibold text-ink">
            {lastRead ? '1' : '0'}
          </div>
          <div className="text-xs text-ink-muted">Riwayat baca</div>
        </Card>
      </div>

      <Card className="mb-5">
        <h3 className="font-display text-base text-ink mb-4">Informasi akun</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-line">
            <span className="text-ink-muted">Nama tampilan</span>
            <span className="text-ink font-medium">
              {user.displayName || '—'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-line">
            <span className="text-ink-muted">Email</span>
            <span className="text-ink font-medium truncate max-w-[60%]">
              {user.email}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-ink-muted">Status verifikasi</span>
            <span className="text-ink font-medium">
              {user.emailVerified ? 'Terverifikasi' : 'Belum'}
            </span>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-display text-base text-ink mb-4">Aksi</h3>
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full !justify-start"
            onClick={() => navigate('/bookmarks')}
            leftIcon={<HiOutlineBookmark />}
          >
            Lihat bookmark
          </Button>
          <Button
            variant="ghost"
            className="w-full !justify-start"
            onClick={() => navigate('/last-read')}
            leftIcon={<HiOutlineClock />}
          >
            Lihat riwayat baca
          </Button>
          <div className="h-px bg-line my-1" />
          <Button
            variant="ghost"
            className="w-full !justify-start !text-red-500 hover:!bg-red-50"
            onClick={handleLogout}
            loading={loggingOut}
            leftIcon={<HiOutlineArrowRightOnRectangle />}
          >
            Keluar dari akun
          </Button>
        </div>
      </Card>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Ubah nama"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Simpan
            </Button>
          </div>
        }
      >
        <label className="label">Nama tampilan</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama Anda"
          autoFocus
        />
      </Modal>
    </div>
  );
}