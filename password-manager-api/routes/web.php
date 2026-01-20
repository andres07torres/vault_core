<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

// Ruta para limpiar caché (por si acaso)
Route::get('/limpiar', function() {
    Artisan::call('route:clear');
    Artisan::call('config:clear');
    return "Caché de rutas y configuración limpia";
});
Route::get('/', function () {
    return ['Laravel' => app()->version(), 'Estado' => 'Conectado'];
});

require __DIR__.'/auth.php';
