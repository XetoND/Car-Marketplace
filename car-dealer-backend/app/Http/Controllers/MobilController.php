<?php

namespace App\Http\Controllers;

use App\Models\Mobil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MobilController extends Controller
{
    public function index(Request $request)
    {
    $query = Mobil::with('owner')->whereIn('status', ['tersedia', 'booked']);

    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function($q) use ($search) {
            $q->where('merk', 'like', "%{$search}%")
              ->orWhere('model', 'like', "%{$search}%")
              ->orWhereRaw("CONCAT(merk, ' ', model) LIKE ?", ["%{$search}%"]);
        });
    }

    if ($request->filled('merk')) {
        $query->where('merk', 'like', "%{$request->merk}%");
    }

    if ($request->filled('tahun')) {
        $query->where('tahun', $request->tahun);
    }

    if ($request->filled('lokasi')) {
        $query->where('lokasi', 'like', "%{$request->lokasi}%");
    }

    $mobils = $query->latest()->get();

    return response()->json($mobils);
    }      

    public function show($id)
    {
        $mobil = Mobil::with('owner:id,name,email,phone')->find($id);

        if (!$mobil) {
            return response()->json(['message' => 'Mobil tidak ditemukan'], 404);
        }

        return response()->json($mobil);
    }

    public function store(Request $request)
    {
        $request->validate([
            'merk' => 'required|string',
            'model' => 'required|string',
            'tahun' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'harga_jual' => 'required|numeric|min:0',
            'kondisi' => 'required|in:baru,bekas',
            'lokasi' => 'required|string',
            'deskripsi' => 'required|string',
            'foto' => 'required|image|max:5120',
        ]);

        // Handle File Upload
        $path = null;
        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('mobils', 'public');
        }

        // Create Record
        $mobil = Mobil::create([
            'owner_id' => $request->user()->id,
            'merk' => $request->merk,
            'model' => $request->model,
            'tahun' => $request->tahun,
            'harga_jual' => $request->harga_jual,
            'kondisi' => $request->kondisi,
            'lokasi' => $request->lokasi,
            'deskripsi' => $request->deskripsi,
            'foto_url' => $path ? asset('storage/' . $path) : null,
            'status' => 'tersedia',
        ]);

        return response()->json([
            'message' => 'Mobil berhasil dijual',
            'data' => $mobil
        ], 201);
    }
 
    public function destroy($id, Request $request)
    {
        $mobil = Mobil::find($id);

        if (!$mobil) {
            return response()->json(['message' => 'Mobil not found'], 404);
        }

        // Security Check
        if ($mobil->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        if ($mobil->foto_url) {
            $oldPath = str_replace(asset('storage/'), '', $mobil->foto_url);
            Storage::disk('public')->delete($oldPath);
        }

        $mobil->delete();

        return response()->json(['message' => 'Mobil deleted successfully']);
    }

    public function update(Request $request, $id)
    {
        $mobil = Mobil::find($id);

        if (!$mobil) {
            return response()->json(['message' => 'Mobil not found'], 404);
        }

        if ($mobil->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $validatedData = $request->validate([
            'harga_jual' => 'numeric',
            'lokasi'     => 'string',
            'deskripsi'  => 'string',
            'status'     => 'in:tersedia,terjual',
            'foto'       => 'nullable|image|max:5120', 
        ]);

        if ($request->hasFile('foto')) {
            if ($mobil->foto_url) {
                $oldPath = str_replace(asset('storage/'), '', $mobil->foto_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('foto')->store('mobils', 'public');
            $validatedData['foto_url'] = asset('storage/' . $path);
        }
        unset($validatedData['foto']); 

        $mobil->update($validatedData);

        return response()->json(['message' => 'Mobil updated successfully', 'data' => $mobil]);
    }
}