<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProjectType;
use Illuminate\Http\Request;

class ProjectTypeController extends Controller
{
    public function index()
    {
        $projectTypes = ProjectType::all();
        return response()->json($projectTypes);
    }

    public function store(Request $request)
    {
        $projectType = ProjectType::create($request->all());
        return response()->json($projectType, 201);
    }

    public function show($id)
    {
        $projectType = ProjectType::findOrFail($id);
        return response()->json($projectType);
    }

    public function update(Request $request, $id)
    {
        $projectType = ProjectType::findOrFail($id);
        $projectType->update($request->all());
        return response()->json($projectType, 200);
    }

    public function destroy($id)
    {
        $projectType = ProjectType::findOrFail($id);
        $projectType->delete();
        return response()->json(null, 204);
    }
}
