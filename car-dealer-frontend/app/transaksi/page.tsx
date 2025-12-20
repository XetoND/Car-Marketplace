'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api'; // Adjust path if using src/app

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

    // 1. Get current User ID so we know if we are buyer or seller
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user.id);
    }

    // 2. Fetch History
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
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:underline"
          >
            &larr; Kembali ke Dashboard
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500">
            Belum ada transaksi.
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((trx) => {
              const isBuyer = trx.pembeli_id === userId;
              
              return (
                <div key={trx.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center">
                  
                  {/* Status Badge */}
                  <div className="mb-4 md:mb-0 md:mr-6">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isBuyer 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {isBuyer ? 'Pembelian (Beli)' : 'Penjualan (Jual)'}
                    </span>
                  </div>

                  {/* Car Details */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-bold text-gray-800">
                      {trx.mobil.merk} {trx.mobil.model} ({trx.mobil.tahun})
                    </h3>
                    <p className="text-sm text-gray-500">
                      {isBuyer 
                        ? `Penjual: ${trx.penjual.name}` 
                        : `Pembeli: ${trx.pembeli.name}`
                      }
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Tanggal: {new Date(trx.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-xl font-bold text-gray-900">
                      Rp {Number(trx.total).toLocaleString('id-ID')}
                    </p>
                    <span className="text-xs text-green-600 font-semibold">
                      Lunas
                    </span>
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