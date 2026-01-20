<?php

use App\Http\Controllers\PasswordController;
use Illuminate\Support\Facades\Route;

// ELIMINA o COMENTA el middleware auth:sanctum para pruebas
// Route::middleware(['auth:sanctum'])->group(function () {
    
    // Esta ruta ahora es pública para tu desarrollo local
    Route::post('/passwords', [PasswordController::class, 'store']);
    Route::get('/passwords', [PasswordController::class, 'index']);
    Route::delete('/passwords/{id}', [PasswordController::class, 'destroy']);

// });