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
        Schema::create('mobils', function (Blueprint $table) {
        $table->uuid('id')->primary();
        $table->foreignUuid('owner_id')->constrained('users')->cascadeOnDelete();
        $table->string('merk');
        $table->string('model');
        $table->integer('tahun');
        $table->enum('kondisi', ['baru', 'bekas']);
        $table->text('deskripsi');
        $table->decimal('harga_jual', 15, 2);
        $table->string('foto_url')->nullable();
        $table->string('lokasi');
        $table->string('status')->default('tersedia'); // tersedia, terjual
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
