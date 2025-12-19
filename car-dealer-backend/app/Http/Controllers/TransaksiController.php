<?php

namespace App\Http\Controllers;

use App\Models\Mobil;
use App\Models\TransaksiJual;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransaksiController extends Controller
{
    // POST /api/transaksi
    public function store(Request $request)
    {
        $request->validate([
            'mobil_id' => 'required|exists:mobils,id',
        ]);

        $user = $request->user();
        $mobil = Mobil::find($request->mobil_id);

        // 1. Validation: Is the car actually available?
        if ($mobil->status !== 'tersedia') {
            return response()->json(['message' => 'Maaf, mobil ini sudah terjual.'], 400);
        }

        // 2. Validation: You cannot buy your own car
        if ($mobil->owner_id === $user->id) {
            return response()->json(['message' => 'Anda tidak bisa membeli mobil sendiri.'], 400);
        }

        // 3. Execute Transaction
        try {
            DB::beginTransaction();

            // Create Transaction Record
            $transaksi = TransaksiJual::create([
                'mobil_id' => $mobil->id,
                'penjual_id' => $mobil->owner_id,
                'pembeli_id' => $user->id,
                'total' => $mobil->harga_jual,
                'status' => 'selesai', // Auto-complete for now
            ]);

            // Mark Car as Sold
            $mobil->update(['status' => 'terjual']);

            DB::commit();

            return response()->json([
                'message' => 'Pembelian berhasil!',
                'data' => $transaksi
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan sistem.'], 500);
        }
    }
    
    // GET /api/transaksi (History)
    public function index(Request $request)
    {
        // Get all transactions where user is Buyer OR Seller
        $userId = $request->user()->id;
        
        $transactions = TransaksiJual::with(['mobil', 'penjual:id,name', 'pembeli:id,name'])
            ->where('pembeli_id', $userId)
            ->orWhere('penjual_id', $userId)
            ->latest()
            ->get();
            
        return response()->json($transactions);
    }
}