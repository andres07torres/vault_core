<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Password extends Model
{
    use HasFactory;

    // Esto permite que podamos guardar datos masivamente
    protected $fillable = [
        'title',
        'encrypted_password',
        'user_id'
    ];

    // Relación inversa: Una contraseña pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}