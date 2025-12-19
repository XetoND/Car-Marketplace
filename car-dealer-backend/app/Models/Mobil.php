<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Mobil extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'merk', 
        'model', 
        'tahun', 
        'harga_jual', 
        'deskripsi', 
        'lokasi', 
        'foto_url', 
        'status',
        'owner_id'
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}