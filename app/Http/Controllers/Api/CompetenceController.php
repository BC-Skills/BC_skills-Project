<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Competence;
use App\Http\Controllers\Controller;
use App\Models\User;

class CompetenceController extends Controller
{
    public function index()
    {
        $competences = Competence::all();
        return response()->json($competences);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        
        $user = User::findOrFail($data['user_id']); // Fetch the user by ID
        
        $competence = $user->competences()->create($data);
        
        return response()->json($competence, 201);
    }

    public function show($id)
    {
        $competence = Competence::findOrFail($id);
        return response()->json($competence);
    }

    public function update(Request $request, $id)
    {
        $competence = Competence::findOrFail($id);

        $request->validate([
            'name' => 'required|string',
            // You can add more validation rules as needed
        ]);

        $competence->update([
            'name' => $request->input('name'),
        ]);

        return response()->json($competence, 200);
    }

    public function destroy($id)
    {
        $competence = Competence::findOrFail($id);
        $competence->delete();
        return response()->json(null, 204);
    }
}