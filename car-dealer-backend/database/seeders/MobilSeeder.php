<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Mobil;
use Illuminate\Support\Facades\Hash;

class MobilSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create a Fake User if none exists
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password123'),
                'role' => 'client'
            ]
        );

        // 2. Create a Fake Car
        Mobil::create([
            'owner_id' => $user->id,
            'merk' => 'Toyota',
            'model' => 'Avanza',
            'tahun' => 2022,
            'kondisi' => 'bekas',
            'harga_jual' => 250000000,
            'deskripsi' => 'Mobil sangat mulus, jarang dipakai.',
            'lokasi' => 'Jakarta Selatan',
            'status' => 'tersedia',
            'foto_url' => 'https://placehold.co/600x400/png'
        ]);
    }
}