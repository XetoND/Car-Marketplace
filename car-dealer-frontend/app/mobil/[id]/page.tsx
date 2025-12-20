'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../lib/api';

export default function CarDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [mobil, setMobil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Transaction States
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/mobils/${id}`)
        .then((res) => setMobil(res.data))
        .catch((err) => {
          console.error(err);
          alert('Mobil tidak ditemukan');
          router.push('/');
        })
        .finally(() => setLoading(false));
    }
  }, [id, router]);

  const handleBuy = async () => {
    setError('');

    // Check Auth
    if (!localStorage.getItem('token')) {
      // If not logged in, redirect to login
      router.push('/login');
      return;
    }

    if (!confirm('Apakah anda yakin ingin membeli mobil ini?')) return;

    setBuying(true);
    
    try {
      await api.post('/transaksi', {
        mobil_id: mobil.id
      });
      
      alert('Pembelian berhasil! Mobil kini milik anda.');
      router.push('/transaksi'); 
      
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan saat memproses transaksi.';
      
      setError(msg);
      if (!err.response || err.response.status === 500) {
        console.error("System Error:", err);
      }
      
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading details...</div>;
  if (!mobil) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        
        {/* Large Image Header */}
        <div className="h-96 w-full bg-gray-200 relative">
          {mobil.foto_url ? (
            <img
              src={mobil.foto_url}
              alt={mobil.model}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xl">
              No Image Available
            </div>
          )}
        </div>

        <div className="p-8">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{mobil.merk} {mobil.model}</h1>
              <p className="text-gray-500 mt-1">📍 {mobil.lokasi} • {mobil.tahun}</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-sm text-gray-500">Harga Cash</p>
              <p className="text-3xl font-bold text-green-600">
                Rp {Number(mobil.harga_jual).toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 my-6"></div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Description */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Deskripsi</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {mobil.deskripsi}
              </p>

              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Detail Spesifikasi</h3>
                <ul className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <li className="flex justify-between border-b py-2">
                    <span>Kondisi:</span> 
                    <span className="font-medium capitalize">{mobil.kondisi}</span>
                  </li>
                  <li className="flex justify-between border-b py-2">
                    <span>Penjual:</span> 
                    <span className="font-medium">{mobil.owner?.name}</span>
                  </li>
                  <li className="flex justify-between border-b py-2">
                    <span>Email:</span> 
                    <span className="font-medium">{mobil.owner?.email}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Action Box */}
            <div className="bg-gray-50 p-6 rounded-xl h-fit border border-gray-100">
              <p className="text-sm text-gray-500 mb-4 text-center">Tertarik dengan mobil ini?</p>
              
              {/* ERROR MESSAGE DISPLAY */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-lg text-center animate-pulse">
                  ⚠️ {error}
                </div>
              )}

              <button
                onClick={handleBuy}
                disabled={buying}
                className={`w-full py-3 rounded-lg font-bold text-lg shadow-md transition transform hover:scale-105 ${
                  buying 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {buying ? 'Memproses...' : 'Beli Sekarang'}
              </button>
              
              <p className="text-xs text-center text-gray-400 mt-4">
                Transaksi aman dilindungi oleh sistem Showroom.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}