'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../lib/api'; // Adjust path if needed

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myMobils, setMyMobils] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check Auth
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userStr));

    // 2. Fetch User's Cars
    api.get('/user') 
      .then((res) => {
        if (res.data.mobils) {
            setMyMobils(res.data.mobils);
        } else {
            api.get('/mobils').then(allCars => {
                const myCars = allCars.data.filter((m: any) => m.owner_id === res.data.id);
                setMyMobils(myCars);
            });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

  }, [router]);

  const handleLogout = () => {
    api.post('/logout')
      .catch(err => console.error("Logout error", err))
      .finally(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      });
  };

  const handleDelete = async (mobilId: string) => {
    if (!confirm('Apakah anda yakin ingin menghapus mobil ini?')) return;

    try {
      await api.delete(`/mobils/${mobilId}`);
      setMyMobils(prev => prev.filter(m => m.id !== mobilId));
      alert('Mobil berhasil dihapus.');
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus mobil.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col justify-between">
        <div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-blue-600">Showroom</h1>
          </div>
          <nav className="mt-6">
            <a href="#" className="flex items-center space-x-2 px-6 py-3 bg-blue-50 text-blue-600 border-r-4 border-blue-600">
              <span className="font-medium">Dashboard</span>
            </a>
            <Link href="/" className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:bg-gray-50 transition">
              <span className="font-medium">Beranda (Home)</span>
            </Link>
            <Link href="/transaksi" className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:bg-gray-50 transition">
               <span className="font-medium">Riwayat Transaksi</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Halo, {user?.name} 👋</h1>
            <p className="text-gray-500">Selamat datang kembali di dashboard anda.</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="bg-red-50 text-red-600 border border-red-200 px-5 py-2 rounded-lg font-medium hover:bg-red-100 transition shadow-sm"
          >
            Logout
          </button>
        </div>

        {/* Stats / Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Card 1: Sell Car */}
            <Link href="/jual" className="group block p-8 bg-blue-600 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Jual Mobil</h2>
                  <p className="text-blue-100">Pasang iklan mobil anda sekarang.</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg text-white text-2xl group-hover:bg-white/30 transition">
                  +
                </div>
              </div>
            </Link>

            {/* Card 2: Transaction History */}
            <Link href="/transaksi" className="group block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Riwayat Transaksi</h2>
                  <p className="text-gray-500">Lihat riwayat pembelian dan penjualan anda.</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg text-green-600 text-2xl group-hover:bg-green-200 transition">
                  $
                </div>
              </div>
            </Link>
        </div>

        {/* My Cars Section */}
        <h3 className="text-xl font-bold text-gray-900 mb-6">Mobil Anda ({myMobils.length})</h3>
        
        {myMobils.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">Anda belum menjual mobil apapun.</p>
            <Link href="/jual" className="text-blue-600 font-bold hover:underline">Mulai Jual Mobil &rarr;</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myMobils.map((mobil) => (
              <div key={mobil.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group relative hover:shadow-md transition">
                
                {/* EDIT BUTTON */}
                <Link
                  href={`/edit/${mobil.id}`}
                  className="absolute top-2 right-12 bg-white/90 p-2 rounded-full text-blue-500 hover:bg-blue-100 shadow-sm z-10 transition opacity-0 group-hover:opacity-100"
                  title="Edit Mobil"
                >
                  ✏️
                </Link>

                {/* DELETE BUTTON */}
                <button
                  onClick={(e) => {
                    e.preventDefault(); 
                    handleDelete(mobil.id);
                  }}
                  className="absolute top-2 right-2 bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-100 shadow-sm z-10 transition opacity-0 group-hover:opacity-100"
                  title="Hapus Mobil"
                >
                  🗑️
                </button>

                <Link href={`/mobil/${mobil.id}`}>
                  <div className="h-40 bg-gray-200 relative">
                    {mobil.foto_url ? (
                      <img src={mobil.foto_url} alt={mobil.model} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">No Image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 truncate">{mobil.merk} {mobil.model}</h3>
                    <p className="text-sm text-gray-500">{mobil.tahun} • Rp {Number(mobil.harga_jual).toLocaleString('id-ID')}</p>
                    
                    <div className="mt-3">
                      {mobil.status === 'terjual' ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                          Terjual
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                          Tersedia
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}