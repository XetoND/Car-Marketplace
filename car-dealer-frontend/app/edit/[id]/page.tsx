'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../lib/api'; 

export default function EditMobil() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    harga_jual: '',
    lokasi: '',
    deskripsi: '',
    status: 'tersedia',
    foto: null as File | null,
  });

  const [staticData, setStaticData] = useState({
    merk: '',
    model: '',
    tahun: '',
    foto_url: '' 
  });

  useEffect(() => {
    api.get(`/mobils/${id}`)
      .then(res => {
        const data = res.data;
        setFormData({
            harga_jual: data.harga_jual,
            lokasi: data.lokasi,
            deskripsi: data.deskripsi,
            status: data.status,
            foto: null
        });
        setStaticData({
            merk: data.merk,
            model: data.model,
            tahun: data.tahun,
            foto_url: data.foto_url
        });
        
        setPreview(data.foto_url); 
        
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert('Gagal memuat data mobil');
        router.push('/dashboard');
      });
  }, [id, router]);

  // Handle Text Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, foto: file }));
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    
    data.append('_method', 'PUT'); 

    data.append('harga_jual', formData.harga_jual);
    data.append('lokasi', formData.lokasi);
    data.append('deskripsi', formData.deskripsi);
    data.append('status', formData.status);

    if (formData.foto) {
        data.append('foto', formData.foto);
    }

    try {
      await api.post(`/mobils/${id}`, data, {
        headers: { 'Content-Type': undefined } 
      });

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
        
        {/* Preview Section */}
        <div className="flex gap-4 mb-6 bg-blue-50 p-4 rounded-lg items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden shrink-0 border border-gray-300">
                {preview ? (
                    <img 
                        src={preview} 
                        className="w-full h-full object-cover" 
                        alt="Preview"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-500">No Image</div>
                )}
            </div>
            <div>
                <h3 className="font-bold text-gray-900">{staticData.merk} {staticData.model}</h3>
                <p className="text-sm text-gray-600 mb-2">{staticData.tahun}</p>
                
                {/* File Input */}
                <label className="cursor-pointer bg-white border border-blue-300 text-blue-600 text-xs font-bold py-1 px-3 rounded hover:bg-blue-50 transition">
                    Ganti Foto
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="hidden" 
                    />
                </label>
                {formData.foto && <p className="text-xs text-green-600 mt-1">File terpilih: {formData.foto.name}</p>}
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Jual (Rp)</label>
            <input
              name="harga_jual"
              type="number"
              required
              value={formData.harga_jual}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
            <input
              name="lokasi"
              type="text"
              required
              value={formData.lokasi}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black bg-white"
            >
                <option value="tersedia">Tersedia</option>
                <option value="terjual">Terjual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              name="deskripsi"
              rows={4}
              required
              value={formData.deskripsi}
              onChange={handleChange}
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