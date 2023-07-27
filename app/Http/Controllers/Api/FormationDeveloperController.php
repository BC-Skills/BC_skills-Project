<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormationDeveloper;
use Illuminate\Http\Request;

class FormationDeveloperController extends Controller
{
    public function index()
    {
        $formationDevelopers = FormationDeveloper::all();
        return response()->json($formationDevelopers);
    }

    public function store(Request $request)
    {
        $formationDeveloper = FormationDeveloper::create($request->all());
        return response()->json($formationDeveloper, 201);
    }

    public function show($id)
    {
        $formationDeveloper = FormationDeveloper::findOrFail($id);
        return response()->json($formationDeveloper);
    }

    public function update(Request $request, $id)
    {
        $formationDeveloper = FormationDeveloper::findOrFail($id);
        $formationDeveloper->update($request->all());
        return response()->json($formationDeveloper, 200);
    }

    public function destroy($id)
    {
        $formationDeveloper = FormationDeveloper::findOrFail($id);
        $formationDeveloper->delete();
        return response()->json(null, 204);
    }
}
