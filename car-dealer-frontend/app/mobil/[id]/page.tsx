'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../lib/api';

export default function CarDetail() {
  const { id } = useParams();
  const router = useRouter();
  
  const [mobil, setMobil] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [inputAmount, setInputAmount] = useState('');
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUserId(JSON.parse(userStr).id);
    }

    if (id) {
      api.get(`/mobils/${id}`)
        .then((res) => setMobil(res.data))
        .catch((err) => {
          console.error(err);
          router.push('/');
        })
        .finally(() => setLoading(false));
    }
  }, [id, router]);

  const price = mobil ? Number(mobil.harga_jual) : 0;

  const handleOpenModal = () => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
      return;
    }
    setError('');
    setShowModal(true);
  };

  const handleConfirmBuy = async () => {
    setError('');

    const numericInput = Number(inputAmount.replace(/\./g, '').replace(/,/g, ''));
    
    if (numericInput !== price) {
      setError(`Nominal salah. Harap masukkan sesuai harga: Rp ${price.toLocaleString('id-ID')}`);
      return;
    }

    setBuying(true);
    
    try {
      await api.post('/transaksi', { mobil_id: mobil.id });
      
      setShowModal(false);
      alert('Pesanan berhasil dibuat! Menunggu konfirmasi admin.');
      router.push('/transaksi'); 
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading details...</div>;
  if (!mobil) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 relative">
      
      {/* CONFIRMATION POPUP */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Konfirmasi Pembayaran</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Total yang harus dibayar</p>
                <p className="text-3xl font-extrabold text-gray-900">
                  Rp {price.toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-gray-600 mt-2 bg-gray-50 inline-block px-3 py-1 rounded-full">
                  Harga sudah termasuk pajak & biaya layanan
                </p>
              </div>

              {/* Safety Input */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Ketik Nominal untuk Konfirmasi
                </label>
                <input 
                  type="number"
                  placeholder="0"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 text-lg font-mono text-center text-gray-900 font-bold"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                  ⚠️ {error}
                </div>
              )}

              <button
                onClick={handleConfirmBuy}
                disabled={buying}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition transform active:scale-95 disabled:bg-gray-400"
              >
                {buying ? 'Memproses...' : 'Konfirmasi Pembayaran'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* END POPUP */}

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        
        {/* Image & Sold Badge */}
        <div className="h-96 w-full bg-gray-200 relative">
          {mobil.foto_url ? (
            <img src={mobil.foto_url} alt={mobil.model} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
          )}
           {mobil.status === 'terjual' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-600 text-white px-8 py-3 rounded-full text-2xl font-bold uppercase tracking-widest border-4 border-white transform -rotate-12 shadow-2xl">
                    TERJUAL
                  </span>
              </div>
           )}
           {mobil.status === 'booked' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-yellow-500 text-white px-8 py-3 rounded-full text-2xl font-bold uppercase tracking-widest border-4 border-white transform -rotate-12 shadow-2xl">
                    MENUNGGU KONFIRMASI
                  </span>
              </div>
           )}
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{mobil.merk} {mobil.model}</h1>
              <p className="text-gray-500 mt-1">📍 {mobil.lokasi} • {mobil.tahun}</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-sm text-gray-500">Harga Cash</p>
              <p className="text-3xl font-bold text-green-600">
                Rp {price.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 my-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Deskripsi</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{mobil.deskripsi}</p>
              
              <div className="mt-8">
                 <h3 className="text-lg font-bold text-gray-900 mb-3">Detail</h3>
                 <ul className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <li className="flex justify-between border-b py-2"><span>Kondisi:</span> <span className="font-medium capitalize">{mobil.kondisi}</span></li>
                    <li className="flex justify-between border-b py-2"><span>Penjual:</span> <span className="font-medium">{mobil.owner?.name}</span></li>
                 </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl h-fit border border-gray-100">
              
              {/* BUTTON LOGIC */}
              {mobil.status !== 'tersedia' ? (
                <div className="text-center py-6 bg-gray-100 rounded-lg border border-gray-200">
                  <p className="text-gray-600 font-bold text-lg">⛔ Tidak Tersedia</p>
                  <p className="text-gray-500 text-sm">Sedang diproses atau sudah terjual.</p>
                </div>
              ) : currentUserId === mobil.owner_id ? (
                <div className="text-center py-6 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-blue-700 font-bold mb-2">👋 Ini Mobil Anda</p>
                  <button onClick={() => router.push(`/edit/${mobil.id}`)} className="text-blue-600 underline text-sm">Edit Mobil</button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-4 text-center">Tertarik dengan mobil ini?</p>
                  <button
                    onClick={handleOpenModal}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition hover:scale-105"
                  >
                    Beli Sekarang
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-4">
                    Transaksi aman dengan layanan kami.
                  </p>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}