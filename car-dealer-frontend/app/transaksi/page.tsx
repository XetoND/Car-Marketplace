'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api'; 
import Link from 'next/link';

export default function TransactionHistory() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user.id);
    }

    api.get('/transaksi')
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="p-8 text-center">Loading history...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Riwayat Transaksi</h1>
          <Link 
            href="/dashboard"
            className="text-blue-600 hover:underline"
          >
            &larr; Kembali ke Dashboard
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow text-center text-gray-500 border border-gray-200">
            <p className="text-lg font-medium">Belum ada transaksi.</p>
            <p className="text-sm">Transaksi anda akan muncul di sini.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((trx) => {
              const isBuyer = trx.pembeli_id === userId;
              const isSeller = trx.penjual_id === userId;
              const isPending = trx.status === 'menunggu_konfirmasi';
              
              return (
                <div key={trx.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center transition hover:shadow-md">
                  
                  {/* LEFT: Info & Status */}
                  <div className="flex-1 w-full md:w-auto mb-4 md:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                       {/* Role Badge */}
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          isBuyer ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                       }`}>
                          {isBuyer ? 'Saya Membeli' : 'Saya Menjual'}
                       </span>

                       {/* Status Badge (The Fix) */}
                       {isPending ? (
                         <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700 flex items-center gap-1">
                           ⏳ Menunggu Admin
                         </span>
                       ) : (
                         <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 flex items-center gap-1">
                           ✅ Selesai
                         </span>
                       )}
                    </div>

                    <h3 className="text-lg font-bold text-gray-800">
                      {trx.mobil.merk} {trx.mobil.model} <span className="text-gray-400 font-normal">({trx.mobil.tahun})</span>
                    </h3>
                    
                    <div className="text-sm text-gray-500 mt-1">
                      {isBuyer 
                        ? `Penjual: ${trx.penjual.name}` 
                        : `Pembeli: ${trx.pembeli.name}`
                      }
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      ID: {trx.id.substring(0, 8)}... • {new Date(trx.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                    
                    {isSeller ? (
                        <>
                            <p className="text-sm text-gray-400">Harga Jual</p>
                            <p className="text-lg font-bold text-gray-900">
                                Rp {Number(trx.total).toLocaleString('id-ID')}
                            </p>
                            
                            {/* Show Fee Deduction */}
                            <div className="text-xs text-red-500 mt-1">
                                - Fee Admin (5%): Rp {Number(trx.admin_fee).toLocaleString('id-ID')}
                            </div>
                            
                            {/* Net Income */}
                            <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
                                <p className="text-xs text-green-600 font-bold uppercase">Pendapatan Bersih</p>
                                <p className="text-xl font-extrabold text-green-700">
                                    Rp {(Number(trx.total) - Number(trx.admin_fee)).toLocaleString('id-ID')}
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-gray-400">Total Bayar</p>
                            <p className="text-2xl font-extrabold text-gray-900">
                                Rp {Number(trx.total).toLocaleString('id-ID')}
                            </p>
                        </>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}