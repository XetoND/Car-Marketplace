'use client';

import { useEffect, useState } from 'react';
import api from './lib/api'; 
import Link from 'next/link';

interface Mobil {
  id: string;
  merk: string;
  model: string;
  tahun: number;
  harga_jual: number;
  foto_url: string;
  lokasi: string;
  status: string;
  owner: {
    name: string;
  };
}

export default function Home() {
  const [mobils, setMobils] = useState<Mobil[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardLink, setDashboardLink] = useState('/dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    merk: '',
    tahun: '',
    lokasi: ''
  });

  const fetchMobils = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (filters.merk) params.append('merk', filters.merk);
      if (filters.tahun) params.append('tahun', filters.tahun);
      if (filters.lokasi) params.append('lokasi', filters.lokasi);

      const endpoint = `/mobils?${params.toString()}`;
      const response = await api.get(endpoint);
      setMobils(response.data);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'admin') {
        setDashboardLink('/admin');
      } else {
        setDashboardLink('/dashboard');
      }
    }
    fetchMobils();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Handle Submit Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMobils();
  };

  // Handle Reset
  const handleReset = () => {
    setSearchTerm('');
    setFilters({ merk: '', tahun: '', lokasi: '' });
    setTimeout(() => {
        window.location.reload(); 
    }, 100);
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* HERO SECTION */}
      <div className="relative bg-slate-900 pt-20 pb-40 overflow-hidden"> 
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-6 border border-blue-500/30">
            Passionate About Cars
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Temukan Mobil <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Impian Anda</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl mb-4 max-w-2xl mx-auto leading-relaxed">
            Jual beli mobil bebas ribet. Ribuan pilihan, harga transparan.
          </p>
        </div>
      </div>

      {/* SEARCH & FILTER SECTION */}
      <div className="relative -mt-20 px-6 mb-12 z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
          
          <form onSubmit={handleSearch}>
            {/* Search Utama */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Cari merk atau model mobil..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex justify-center items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                {showFilters ? 'Tutup Filter' : 'Filter Lanjutan'}
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-all shadow-md"
              >
                Cari
              </button>
            </div>

            {/* Area Filter Lanjutan */}
            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100 animate-fade-in-down">
                    
                    {/* Filter Merk */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Merk</label>
                        <input
                            type="text"
                            name="merk"
                            placeholder="Contoh: Toyota"
                            value={filters.merk}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    {/* Filter Tahun */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tahun</label>
                        <input
                            type="number"
                            name="tahun"
                            placeholder="Contoh: 2022"
                            value={filters.tahun}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    {/* Filter Lokasi */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Lokasi</label>
                        <input
                            type="text"
                            name="lokasi"
                            placeholder="Contoh: Jakarta"
                            value={filters.lokasi}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                </div>
            )}
            
            {/* Indikator Reset */}
            {(searchTerm || filters.merk || filters.tahun || filters.lokasi) && (
                <div className="mt-4 text-center">
                    <button type="button" onClick={handleReset} className="text-sm text-red-500 hover:text-red-700 font-medium hover:underline">
                        Hapus Semua Filter
                    </button>
                </div>
            )}
          </form>
        </div>
      </div>

      {/* SUB-HEADER & STATS */}
      <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-col md:flex-row justify-between items-end border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Koleksi Terbaru</h2>
          <p className="text-gray-500 mt-1">
            {loading ? 'Sedang memuat data...' : `Menampilkan ${mobils.length} mobil berkualitas`}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          {isLoggedIn ? (
            <Link 
              href={dashboardLink} 
              className={`inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-lg transition ${
                dashboardLink === '/admin' 
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span>{dashboardLink === '/admin' ? 'Panel Admin' : 'Dashboard Saya'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          ) : (
            <div className="space-x-4">
              <Link href="/login" className="text-gray-600 font-medium hover:text-blue-600 transition">Masuk</Link>
              <Link href="/register" className="bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition shadow-sm">
                Daftar Akun
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* CAR GRID */}
      <div className="px-6 pb-20 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white h-96 rounded-2xl shadow-sm animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mobils.map((mobil) => (
              <Link href={`/mobil/${mobil.id}`} key={mobil.id} className="group">
                {/* CONDITIONAL STYLE */}
                <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col ${mobil.status !== 'tersedia' ? 'grayscale-[30%] opacity-90' : ''}`}>
                  
                  {/* Image Container */}
                  <div className="relative h-60 w-full bg-gray-100 overflow-hidden">
                    {mobil.foto_url ? (
                      <img
                        src={mobil.foto_url}
                        alt={mobil.model}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-300">
                          <span className="text-sm font-medium">No Image</span>
                      </div>
                    )}
                    
                    {mobil.status === 'booked' && (
                      <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 border border-yellow-200">
                        ⏳ BOOKED
                      </div>
                    )}

                    {mobil.status === 'terjual' && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 border border-red-700">
                        ❌ TERJUAL
                      </div>
                    )}

                    {mobil.status === 'tersedia' && (
                       <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                         ✅ AVAILABLE
                       </div>
                    )}

                    {/* Year Badge */}
                    <div className="absolute top-4 right-4 flex gap-2">
                       <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        {mobil.tahun}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {mobil.merk} {mobil.model}
                      </h2>
                    </div>
                    
                    <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                      📍 {mobil.lokasi}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Harga Cash</p>
                        <p className={`text-lg font-extrabold ${mobil.status !== 'tersedia' ? 'text-gray-500 line-through decoration-red-500' : 'text-gray-900'}`}>
                          Rp {Number(mobil.harga_jual).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {mobils.length === 0 && (
              <div className="col-span-full text-center py-20">
                <h3 className="text-lg font-bold text-gray-900">Tidak ada mobil ditemukan</h3>
                <p className="text-gray-500 mb-6">Coba kurangi filter pencarian anda.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}