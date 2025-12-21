'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // NEW: State for Revenue
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Helper to fetch stats
  const fetchStats = () => {
    api.get('/admin/stats')
      .then((res) => setTotalRevenue(res.data.total_revenue))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(userStr);
    if (userData.role !== 'admin') {
      alert('Access Denied');
      router.push('/dashboard');
      return;
    }

    setUser(userData);

    // 1. Fetch Transactions
    api.get('/admin/transaksi')
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // 2. Fetch Revenue
    fetchStats();

  }, [router]);

  const handleApprove = async (id: string) => {
    if (!confirm('Setujui transaksi ini? Dana akan diteruskan ke penjual.')) return;
    
    setProcessingId(id);
    try {
      await api.post(`/admin/transaksi/${id}/confirm`);
      setTransactions(prev => prev.filter(t => t.id !== id));
      fetchStats();
      alert('Transaksi berhasil disetujui!');
    } catch (err) {
      console.error(err);
      alert('Gagal memproses transaksi.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col justify-between fixed h-full z-10">
        <div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-blue-600">Showroom <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded ml-1">ADMIN</span></h1>
          </div>
          <nav className="mt-6">
            <a href="#" className="flex items-center space-x-2 px-6 py-3 bg-red-50 text-red-600 border-r-4 border-red-600">
              <span className="font-bold">Admin Panel</span>
            </a>
            <Link href="/" className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:bg-gray-50 transition">
              <span className="font-medium">Beranda (Home)</span>
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 ml-0 md:ml-64">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Halo, Admin {user?.name} 🛡️</h1>
            <p className="text-gray-500">Pantau dan kelola transaksi marketplace.</p>
          </div>
          <button onClick={handleLogout} className="bg-white text-red-600 border border-red-200 px-5 py-2 rounded-lg font-medium hover:bg-red-50 transition shadow-sm">
            Logout
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Menunggu Konfirmasi</p>
                  <h2 className="text-3xl font-bold text-gray-900">{transactions.length}</h2>
                </div>
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg text-2xl">⏳</div>
            </div>

             {/* TOTAL REVENUE CARD */}
             <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Pendapatan (Real)</p>
                  <h2 className="text-xl font-bold text-green-600">
                    Rp {Number(totalRevenue).toLocaleString('id-ID')}
                  </h2>
                </div>
                <div className="p-3 bg-green-100 text-green-600 rounded-lg text-2xl">💰</div>
            </div>

             <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between opacity-60">
                <div>
                  <p className="text-gray-500 text-sm">Potensi Fee (Pending)</p>
                  <h2 className="text-xl font-bold text-gray-400">
                    Rp {transactions.reduce((acc, curr) => acc + Number(curr.admin_fee), 0).toLocaleString('id-ID')}
                  </h2>
                </div>
                <div className="p-3 bg-gray-100 text-gray-400 rounded-lg text-2xl">📊</div>
            </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Permintaan Transaksi Masuk</h3>
            </div>

            {transactions.length === 0 ? (
                <div className="p-12 text-center">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✅</div>
                    <h3 className="text-lg font-bold text-gray-900">Semua Aman</h3>
                    <p className="text-gray-500">Tidak ada transaksi yang perlu diproses.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-6 font-semibold">Detail Mobil</th>
                                <th className="p-6 font-semibold">Partisipan</th>
                                <th className="p-6 text-right font-semibold">Total & Fee</th>
                                <th className="p-6 text-center font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-gray-50 transition">
                                    <td className="p-6">
                                        <div className="font-bold text-gray-900">{trx.mobil.merk} {trx.mobil.model}</div>
                                        <div className="text-sm text-gray-500">{trx.mobil.tahun}</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="text-xs text-gray-500">Jual: {trx.penjual.name}</div>
                                        <div className="text-xs text-gray-500">Beli: {trx.pembeli.name}</div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="font-bold text-gray-900">Rp {Number(trx.total).toLocaleString('id-ID')}</div>
                                        <div className="text-xs text-green-600">Fee: Rp {Number(trx.admin_fee).toLocaleString('id-ID')}</div>
                                    </td>
                                    <td className="p-6 text-center">
                                        <button
                                            onClick={() => handleApprove(trx.id)}
                                            disabled={processingId === trx.id}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm"
                                        >
                                            {processingId === trx.id ? '...' : 'Setujui'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}