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
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchMobils = async (term = '') => {
    setLoading(true);
    try {
      const endpoint = term ? `/mobils?search=${term}` : '/mobils';
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
    setIsLoggedIn(!!token);
    fetchMobils();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(!!searchTerm);
    fetchMobils(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm('');
    setIsSearching(false);
    fetchMobils('');
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* HERO SECTION */}
      <div className="relative bg-slate-900 pt-20 pb-32 overflow-hidden"> 
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-6 border border-blue-500/30">
            Passionate About Cars
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Temukan Mobil <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Impian Anda</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Jual beli mobil bebas ribet. Ribuan pilihan, harga transparan, dan transaksi aman di satu tempat.
          </p>
        </div>
      </div>

      {/* FLOATING SEARCH BAR */}
      <div className="relative -mt-8 px-6 mb-12">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative flex items-center bg-white rounded-full p-2 shadow-2xl border border-gray-100 ring-1 ring-black/5">
            {/* Search Icon */}
            <div className="pl-6 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <input
              type="text"
              placeholder="Cari merk, model, atau tahun..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-4 text-gray-700 bg-transparent focus:outline-none text-lg placeholder-gray-400"
            />

            {isSearching && (
              <button
                type="button"
                onClick={handleReset}
                className="mr-2 p-2 text-gray-400 hover:text-red-500 transition rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full transition-all transform hover:scale-105 shadow-md"
            >
              Cari
            </button>
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
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:bg-blue-50 px-5 py-2.5 rounded-lg transition"
            >
              <span>Dashboard Saya</span>
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
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  
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
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium">No Image</span>
                      </div>
                    )}
                    
                    {/* Floating Badges */}
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {mobil.lokasi}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Harga Cash</p>
                        <p className="text-lg font-extrabold text-gray-900">
                          Rp {Number(mobil.harga_jual).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <span className="text-blue-600 bg-blue-50 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {mobils.length === 0 && (
              <div className="col-span-full text-center py-20">
                <div className="bg-gray-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Tidak ada mobil ditemukan</h3>
                <p className="text-gray-500 mb-6">Coba cari dengan kata kunci lain atau reset filter.</p>
                {isSearching && (
                  <button onClick={handleReset} className="text-blue-600 font-bold hover:underline">
                    Reset Pencarian
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}