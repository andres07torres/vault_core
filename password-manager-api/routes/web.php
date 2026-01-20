<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/ejecutar-migracion', function () {
    Artisan::call('migrate:fresh --force');
    return "¡Tablas creadas exitosamente en TiDB Cloud!";
});

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

require __DIR__.'/auth.php';

Route::get('/ejecutar-migracion', function () {
    try {
        Artisan::call('migrate:fresh --force');
        return "¡Tablas creadas exitosamente en TiDB Cloud!";
    } catch (\Exception $e) {
        return "Error al migrar: " . $e->getMessage();
    }
});
