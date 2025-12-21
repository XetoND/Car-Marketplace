'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

export default function JualMobil() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [showTerms, setShowTerms] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    merk: '',
    model: '',
    tahun: new Date().getFullYear(),
    harga_jual: '',
    kondisi: 'bekas',
    lokasi: '',
    deskripsi: '',
    foto: null as File | null,
  });

  // Check Auth & Fetch Brands on Load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    api.get('/brands')
      .then(res => setBrands(res.data))
      .catch(err => console.error("Failed to load brands", err))
      .finally(() => setLoadingBrands(false));
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'merk') {
      setFormData(prev => ({ ...prev, merk: value, model: '' })); 
      setModels([]); 

      if (value) {
        api.get(`/models/${value}`)
          .then(res => setModels(res.data))
          .catch(err => console.error("Failed to load models", err));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, foto: file });
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('merk', formData.merk);
    data.append('model', formData.model);
    data.append('tahun', formData.tahun.toString());
    data.append('harga_jual', formData.harga_jual);
    data.append('kondisi', formData.kondisi);
    data.append('lokasi', formData.lokasi);
    data.append('deskripsi', formData.deskripsi);
    
    if (formData.foto) {
      data.append('foto', formData.foto);
    }

    try {
      await api.post('/mobils', data, {
        headers: { 'Content-Type': undefined },
      });
      router.push('/'); 
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal menjual mobil. Periksa input anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* POPUP MODAL */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800">Syarat & Ketentuan Penjual</h3>
                <button type="button" onClick={() => setShowTerms(false)} className="text-gray-400 hover:text-gray-600 transition">✕</button>
            </div>
            <div className="p-6 overflow-y-auto text-sm text-gray-600 space-y-4 leading-relaxed">
                <p><strong className="text-gray-900">1. Biaya Admin:</strong> Setiap transaksi yang berhasil akan dikenakan biaya admin sebesar <span className="text-red-500 font-bold">5%</span>.</p>
                <p><strong className="text-gray-900">2. Keakuratan Data:</strong> Penjual wajib memberikan informasi yang jujur, akurat, dan lengkap.</p>
                <p><strong className="text-gray-900">3. Pembatalan:</strong> Penjual tidak boleh membatalkan sepihak jika sudah dibooking.</p>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
                <button type="button" onClick={() => setShowTerms(false)} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">Saya Paham</button>
            </div>
            </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Jual Mobil Anda</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* EXISTING INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Merk (Brand)</label>
              <select name="merk" required value={formData.merk} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black bg-white">
                <option value="">Pilih Merk</option>
                {loadingBrands ? <option disabled>Loading...</option> : brands.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <select name="model" required value={formData.model} disabled={!formData.merk || models.length === 0} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black bg-white disabled:bg-gray-100 disabled:text-gray-400">
                <option value="">Pilih Model</option>
                {models.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
              <input name="tahun" type="number" required min="1900" max={new Date().getFullYear() + 1} value={formData.tahun} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi</label>
              <select name="kondisi" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black bg-white">
                <option value="bekas">Bekas</option>
                <option value="baru">Baru</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Jual (Rp)</label>
            <input name="harga_jual" type="number" required placeholder="0" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
            <input name="lokasi" type="text" required placeholder="Contoh: Jakarta Selatan" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea name="deskripsi" rows={4} required placeholder="Jelaskan kondisi mobil..." onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Mobil</label>
            <div className="flex items-center gap-4">
              <input type="file" accept="image/*" required onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            {preview && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <img src={preview} alt="Preview" className="h-40 w-auto rounded-lg border border-gray-200 object-cover" />
              </div>
            )}
          </div>

          {/* TRIGGER TEXT */}
          <div className="text-sm text-gray-500 text-center">
            Dengan menekan tombol di bawah, Anda menyetujui{' '}
            <button 
                type="button" 
                onClick={() => setShowTerms(true)}
                className="text-blue-600 font-bold hover:underline focus:outline-none"
            >
                Syarat & Ketentuan
            </button>
            {' '}yang berlaku.
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-bold text-white transition ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'
            }`}
          >
            {loading ? 'Uploading...' : 'Jual Mobil Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
}