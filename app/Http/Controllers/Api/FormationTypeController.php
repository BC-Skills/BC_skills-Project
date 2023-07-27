<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormationType;
use Illuminate\Http\Request;

class FormationTypeController extends Controller
{
    public function index()
    {
        $formationTypes = FormationType::all();
        return response()->json($formationTypes);
    }

    public function store(Request $request)
    {
        $formationType = FormationType::create($request->all());
        return response()->json($formationType, 201);
    }

    public function show($id)
    {
        $formationType = FormationType::findOrFail($id);
        return response()->json($formationType);
    }

    public function update(Request $request, $id)
    {
        $formationType = FormationType::findOrFail($id);
        $formationType->update($request->all());
        return response()->json($formationType, 200);
    }

    public function destroy($id)
    {
        $formationType = FormationType::findOrFail($id);
        $formationType->delete();
        return response()->json(null, 204);
    }
}
