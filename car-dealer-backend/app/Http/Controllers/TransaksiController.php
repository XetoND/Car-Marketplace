<?php

namespace App\Http\Controllers;

use App\Models\Mobil;
use App\Models\TransaksiJual;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransaksiController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'mobil_id' => 'required|exists:mobils,id',
        ]);

        $user = $request->user();
        $mobil = Mobil::find($request->mobil_id);
        
        if ($mobil->status !== 'tersedia') {
            return response()->json(['message' => 'Maaf, mobil ini sudah terjual.'], 400);
        }

        if ($mobil->owner_id === $user->id) {
            return response()->json(['message' => 'Anda tidak bisa membeli mobil sendiri.'], 400);
        }

        $grandTotal = $mobil->harga_jual; 
        $fee = $grandTotal * 0.05; 

        try {
            DB::beginTransaction();

            $transaksi = TransaksiJual::create([
                'mobil_id' => $mobil->id,
                'penjual_id' => $mobil->owner_id,
                'pembeli_id' => $user->id,
                'total' => $grandTotal,
                'admin_fee' => $fee,
                'status' => 'menunggu_konfirmasi', 
            ]);

            $mobil->update(['status' => 'booked']);

            DB::commit();

            return response()->json([
                'message' => 'Pesanan diterima! Menunggu konfirmasi Admin.',
                'data' => $transaksi
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal memproses transaksi.'], 500);
        }
    }

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        
        $transactions = TransaksiJual::with(['mobil', 'penjual:id,name', 'pembeli:id,name'])
            ->where('pembeli_id', $userId)
            ->orWhere('penjual_id', $userId)
            ->latest()
            ->get();
            
        return response()->json($transactions);
    }

    public function adminIndex(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $transactions = TransaksiJual::with(['mobil', 'penjual', 'pembeli'])
            ->where('status', 'menunggu_konfirmasi')
            ->latest()
            ->get();

        return response()->json($transactions);
    }

    public function confirm(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $transaksi = TransaksiJual::find($id);

        if (!$transaksi || $transaksi->status !== 'menunggu_konfirmasi') {
            return response()->json(['message' => 'Transaksi tidak valid'], 404);
        }

        try {
            DB::beginTransaction();
            $transaksi->update(['status' => 'selesai']);
            
            $transaksi->mobil()->update(['status' => 'terjual']);
            
            DB::commit();
            return response()->json(['message' => 'Transaksi disetujui.']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error'], 500);
        }
    }

    public function adminStats(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $totalRevenue = TransaksiJual::where('status', 'selesai')->sum('admin_fee');
        
        return response()->json(['total_revenue' => $totalRevenue]);
    }

    public function userStats(Request $request)
    {
        $userId = $request->user()->id;
        $transactions = TransaksiJual::where('penjual_id', $userId)
                                     ->where('status', 'selesai')
                                     ->get();
        
        $totalEarnings = 0;
        foreach($transactions as $trx) {
            $totalEarnings += ($trx->total - $trx->admin_fee);
        }

        return response()->json(['total_earnings' => $totalEarnings]);
    }
}