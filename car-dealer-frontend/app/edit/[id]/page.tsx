'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../lib/api'; 

export default function EditMobil() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    harga_jual: '',
    lokasi: '',
    deskripsi: '',
    status: 'tersedia',
  });

  const [staticData, setStaticData] = useState({
    merk: '',
    model: '',
    tahun: '',
    foto_url: '' 
  });

  useEffect(() => {
    // Fetch current data
    api.get(`/mobils/${id}`)
      .then(res => {
        const data = res.data;
        setFormData({
            harga_jual: data.harga_jual,
            lokasi: data.lokasi,
            deskripsi: data.deskripsi,
            status: data.status
        });
        setStaticData({
            merk: data.merk,
            model: data.model,
            tahun: data.tahun,
            foto_url: data.foto_url
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert('Gagal memuat data mobil');
        router.push('/dashboard');
      });
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/mobils/${id}`, formData);
      alert('Mobil berhasil diperbarui!');
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Gagal memperbarui mobil.');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Mobil</h1>
        
        {/* Preview Existing Car */}
        <div className="flex gap-4 mb-6 bg-blue-50 p-4 rounded-lg items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden shrink-0">
                <img 
                    src={staticData.foto_url || ''} 
                    className="w-full h-full object-cover" 
                    alt="Mobil"
                />
            </div>
            <div>
                <h3 className="font-bold text-gray-900">{staticData.merk} {staticData.model}</h3>
                <p className="text-sm text-gray-600">{staticData.tahun}</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Jual (Rp)</label>
            <input
              type="number"
              required
              value={formData.harga_jual}
              onChange={e => setFormData({...formData, harga_jual: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
            <input
              type="text"
              required
              value={formData.lokasi}
              onChange={e => setFormData({...formData, lokasi: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black bg-white"
            >
                <option value="tersedia">Tersedia</option>
                <option value="terjual">Terjual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              rows={4}
              required
              value={formData.deskripsi}
              onChange={e => setFormData({...formData, deskripsi: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div className="flex gap-4">
            <button
                type="button"
                onClick={() => router.back()}
                className="w-1/3 py-3 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200"
            >
                Batal
            </button>
            <button
                type="submit"
                className="w-2/3 py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md"
            >
                Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}