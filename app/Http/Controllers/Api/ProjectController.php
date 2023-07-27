<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::all();
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        // Ensure the request contains the required fields
        $request->validate([
            'nom' => 'required',
            'status' => 'required',
            'client_id' => 'required',
            'project_manager_id' => 'required',
            // Add other validation rules as needed for other fields
        ]);
    
        // Extract the validated data from the request
        $validatedData = $request->only(['nom', 'duree', 'status', 'client_id', 'project_manager_id']);
        
        $project = Project::create($validatedData);
        return response()->json($project, 201);
    }

    public function show($id)
    {
        $project = Project::findOrFail($id);
        return response()->json($project);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $project->update($request->all());
        return response()->json($project, 200);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return response()->json(null, 204);
    }

    public function countInProgressProjects(){
        $count = Project::where("status","progress")->count();
        return response()->json($count);
    }

    public function countCompletedProjects()
    {
        $count = Project::where('status', 'finished')->count();
        return response()->json(['count' => $count]);
    }


}
