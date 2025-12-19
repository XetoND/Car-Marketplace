<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TransaksiJual extends Model
{
    use HasUuids;

    protected $table = 'transaksi_jual';

    protected $fillable = [
        'mobil_id', 
        'penjual_id', 
        'pembeli_id', 
        'total', 
        'status'
    ];

    public function mobil()
    {
        return $this->belongsTo(Mobil::class, 'mobil_id');
    }

    public function penjual()
    {
        return $this->belongsTo(User::class, 'penjual_id');
    }

    public function pembeli()
    {
        return $this->belongsTo(User::class, 'pembeli_id');
    }
}