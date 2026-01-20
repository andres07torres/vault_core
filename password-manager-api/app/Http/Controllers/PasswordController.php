<?php

namespace App\Http\Controllers;

use App\Models\Password;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class PasswordController extends Controller
{

    public function store(Request $request)
    {
        // Validamos que lleguen los datos, incluyendo el user_id
        $request->validate([
            'title' => 'required',
            'password' => 'required',
            'user_id' => 'required'
        ]);

        // Creamos la contraseña directamente en la tabla
        Password::create([
            'user_id' => $request->user_id, // Usará el ID 1 que enviamos
            'title' => $request->title,
            'encrypted_password' => Crypt::encryptString($request->password),
        ]);

        return response()->json(['message' => 'Guardado con éxito'], 201);
    }

    public function index()
    {
        // Obtenemos todas las contraseñas del usuario 1
        return Password::where('user_id', 1)->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                // Aquí las desciframos para verlas en el frontend
                'password' => Crypt::decryptString($item->encrypted_password),
            ];
        });
    }
    public function destroy($id)
    {
        // Busca la contraseña por su ID y la elimina
        $password = \App\Models\Password::find($id);

        if (!$password) {
            return response()->json(['message' => 'No se encontró la contraseña'], 404);
        }

        $password->delete();

        return response()->json(['message' => 'Eliminado correctamente'], 200);
    }
}
