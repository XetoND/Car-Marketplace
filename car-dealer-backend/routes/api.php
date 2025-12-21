<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MobilController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\NhtsaController;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/mobils', [MobilController::class, 'index']);    
Route::get('/mobils/{id}', [MobilController::class, 'show']);

// Protected Routes (Require Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::get('/admin/transaksi', [TransaksiController::class, 'adminIndex']);
    Route::post('/admin/transaksi/{id}/confirm', [TransaksiController::class, 'confirm']);

    Route::post('/mobils', [MobilController::class, 'store']);
    Route::delete('/mobils/{id}', [MobilController::class, 'destroy']);
    Route::put('/mobils/{id}', [MobilController::class, 'update']);

    Route::post('/transaksi', [TransaksiController::class, 'store']);
    Route::get('/transaksi', [TransaksiController::class, 'index']);
    
    Route::get('/brands', [NhtsaController::class, 'getBrands']);
    Route::get('/models/{brand}', [NhtsaController::class, 'getModels']);
    Route::get('/admin/stats', [TransaksiController::class, 'adminStats']);
    Route::get('/user/stats', [TransaksiController::class, 'userStats']);
});