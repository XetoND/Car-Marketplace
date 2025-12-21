'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myMobils, setMyMobils] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);

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
      .catch((err) => console.error(err));

    api.get('/user/stats')
      .then((res) => setEarnings(res.data.total_earnings))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

  }, [router]);

  const handleLogout = () => {
    api.post('/logout').finally(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    });
  };

  const handleDelete = async (mobilId: string) => {
    if (!confirm('Hapus mobil ini?')) return;
    try {
      await api.delete(`/mobils/${mobilId}`);
      setMyMobils(prev => prev.filter(m => m.id !== mobilId));
    } catch (err) {
      alert('Gagal menghapus.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col justify-between">
        <div>
          <div className="p-6"><h1 className="text-2xl font-bold text-blue-600">Showroom</h1></div>
          <nav className="mt-6">
            <a href="#" className="flex items-center space-x-2 px-6 py-3 bg-blue-50 text-blue-600 border-r-4 border-blue-600">
              <span className="font-medium">Dashboard</span>
            </a>
            {user?.role === 'admin' && (
                <Link href="/admin" className="flex items-center space-x-2 px-6 py-3 text-red-600 hover:bg-red-50 transition">
                <span className="font-bold">🛡️ Admin Panel</span>
                </Link>
            )}
            <Link href="/" className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:bg-gray-50 transition">
              <span className="font-medium">Beranda</span>
            </Link>
            <Link href="/transaksi" className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:bg-gray-50 transition">
               <span className="font-medium">Riwayat Transaksi</span>
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Halo, {user?.name} 👋</h1>
            <p className="text-gray-500">Selamat datang kembali.</p>
          </div>
          <button onClick={handleLogout} className="bg-red-50 text-red-600 border border-red-200 px-5 py-2 rounded-lg font-medium hover:bg-red-100 transition">Logout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Link href="/jual" className="group block p-8 bg-blue-600 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                <h2 className="text-xl font-bold text-white mb-2">Jual Mobil</h2>
                <p className="text-blue-100">Pasang iklan mobil anda sekarang.</p>
                </div>
                <div className="text-white text-2xl">+</div>
              </div>
            </Link>

            <Link href="/transaksi" className="group block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Riwayat Transaksi</h2>
                <p className="text-gray-600">Lihat riwayat transaksi anda.</p>
                </div>
                <div className="text-gray-600 text-2xl">📋</div>
              </div>
            </Link>

            {/* NEW: EARNINGS CARD */}
            <div className="p-8 bg-green-50 rounded-xl shadow-lg border border-green-100">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-green-800 mb-1">Total Pendapatan</h2>
                  <p className="text-green-600 text-sm mb-2">Bersih (Setelah Fee)</p>
                  <p className="text-2xl font-extrabold text-green-700">
                    Rp {Number(earnings).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg text-green-600 text-2xl shadow-sm">💵</div>
              </div>
            </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-6">Mobil Anda ({myMobils.length})</h3>
        {/* ... (Car Grid Logic Remains Same) ... */}
        {myMobils.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
             <p>Anda belum menjual mobil.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {myMobils.map(mobil => (
                 <div key={mobil.id} className="bg-white rounded-xl shadow-sm border p-4">
                    <img src={mobil.foto_url} className="h-40 w-full object-cover rounded mb-4 bg-gray-200" />
                    <h3 className="font-bold">{mobil.merk} {mobil.model}</h3>
                    <div className="flex justify-between items-center mt-2">
                         <span className={`text-xs px-2 py-1 rounded font-bold ${mobil.status==='terjual'?'bg-green-100 text-green-700':'bg-blue-100 text-blue-700'}`}>{mobil.status}</span>
                         <button onClick={(e)=>{e.preventDefault(); handleDelete(mobil.id)}} className="text-red-500 text-sm">Hapus</button>
                    </div>
                 </div>
             ))}
          </div>
        )}

      </main>
    </div>
  );
}