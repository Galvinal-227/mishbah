import { useEffect, useState } from 'react';
import { HiOutlineMapPin, HiOutlineGlobeAlt } from 'react-icons/hi2';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useLocationCtx } from '../../contexts/LocationContext';
import { useToast } from '../../contexts/ToastContext';

export default function LocationPicker({ open, onClose }) {
  const {
    location,
    provinsiList,
    kabkotaList,
    loadingProvinsi,
    loadingKabkota,
    detecting,
    setManual,
    detectAuto,
  } = useLocationCtx();

  const toast = useToast();
  const [provinsi, setProvinsi] = useState(location?.provinsi ?? '');
  const [kabkota, setKabkota] = useState(location?.kabkota ?? '');

  useEffect(() => {
    if (open) {
      setProvinsi(location?.provinsi ?? '');
      setKabkota(location?.kabkota ?? '');
    }
  }, [open, location]);

  const handleSave = () => {
    if (!provinsi || !kabkota) {
      toast.warning('Pilih provinsi dan kabupaten/kota terlebih dahulu');
      return;
    }
    setManual(provinsi, kabkota);
    toast.success('Lokasi disimpan');
    onClose?.();
  };

  const handleDetect = async () => {
    const res = await detectAuto();
    if (res) {
      setProvinsi(res.provinsi);
      setKabkota(res.kabkota);
      toast.success(`Lokasi terdeteksi: ${res.kabkota}`);
    } else {
      toast.error('Gagal mendeteksi lokasi. Pilih manual saja.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Pilih Lokasi"
      description="Untuk menampilkan jadwal sholat yang akurat"
      footer={
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave}>Simpan</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Button
          variant="secondary"
          onClick={handleDetect}
          loading={detecting}
          leftIcon={<HiOutlineGlobeAlt />}
          className="w-full"
        >
          Deteksi lokasi saya otomatis
        </Button>

        <div className="flex items-center gap-3 text-xs text-ink-pale">
          <div className="h-px flex-1 bg-line" />
          <span>atau pilih manual</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <div>
          <label className="label">Provinsi</label>
          <select
            className="input"
            value={provinsi}
            onChange={(e) => {
              setProvinsi(e.target.value);
              setKabkota('');
            }}
            disabled={loadingProvinsi}
          >
            <option value="">
              {loadingProvinsi ? 'Memuat provinsi…' : '— Pilih provinsi —'}
            </option>
            {provinsiList.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Kabupaten / Kota</label>
          <select
            className="input"
            value={kabkota}
            onChange={(e) => setKabkota(e.target.value)}
            disabled={!provinsi || loadingKabkota}
          >
            <option value="">
              {!provinsi
                ? '— Pilih provinsi dulu —'
                : loadingKabkota
                ? 'Memuat kabupaten/kota…'
                : '— Pilih kabupaten/kota —'}
            </option>
            {kabkotaList.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        {location?.source === 'auto' && (
          <div className="text-xs text-emerald-muted flex items-center gap-1">
            <HiOutlineMapPin className="h-3 w-3" />
            Lokasi terdeteksi otomatis
          </div>
        )}
      </div>
    </Modal>
  );
}