<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

// Ruta para limpiar caché (por si acaso)
Route::get('/limpiar', function() {
    Artisan::call('route:clear');
    Artisan::call('config:clear');
    return "Caché de rutas y configuración limpia";
});

// Ruta de migración (solo la versión con Try/Catch para ver errores)
Route::get('/ejecutar-migracion', function () {
    try {
        Artisan::call('migrate:fresh --force');
        return "¡Tablas creadas exitosamente en TiDB Cloud!";
    } catch (\Exception $e) {
        return "Error al migrar: " . $e->getMessage();
    }
});

Route::get('/', function () {
    return ['Laravel' => app()->version(), 'Estado' => 'Conectado'];
});

require __DIR__.'/auth.php';
