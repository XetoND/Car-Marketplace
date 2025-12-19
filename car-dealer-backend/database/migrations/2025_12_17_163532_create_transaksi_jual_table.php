<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transaksi_jual', function (Blueprint $table) {
        $table->uuid('id')->primary();
        $table->foreignUuid('mobil_id')->constrained('mobils')->cascadeOnDelete();
        $table->foreignUuid('penjual_id')->constrained('users');
        $table->foreignUuid('pembeli_id')->constrained('users');
        $table->decimal('total', 15, 2);
        $table->string('status')->default('diproses');
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi_jual');
    }
};
