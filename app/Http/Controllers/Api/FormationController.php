<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use Illuminate\Http\Request;

class FormationController extends Controller
{
    public function index()
    {
        $formations = Formation::all();
        return response()->json($formations);
    }

    public function store(Request $request)
    {
        $formation = Formation::create($request->all());
        return response()->json($formation, 201);
    }

    public function show($id)
    {
        $formation = Formation::findOrFail($id);
        return response()->json($formation);
    }

    public function update(Request $request, $id)
    {
        $formation = Formation::findOrFail($id);
        $formation->update($request->all());
        return response()->json($formation, 200);
    }

    public function destroy($id)
    {
        $formation = Formation::findOrFail($id);
        $formation->delete();
        return response()->json(null, 204);
    }
   
}
