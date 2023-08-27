<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;

use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('client', 'projectManager')->get();
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        // Ensure the request contains the required fields and add more validation rules as needed
        $request->validate([
            'nom' => 'required',
            'duree' => 'required|integer',
            'status' => 'required',
            'project_manager_id' => 'required|exists:users,id', // Assuming 'users' is the users table name
            'client_id' => 'required|exists:users,id',
            'project_type_id' => 'nullable|exists:project_types,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date', // Add validation to ensure end date is after start date
        ]);
    
        // Extract the validated data from the request
        $validatedData = $request->all();
    
        // Create the project record
        $project = Project::create($validatedData);
    
        return response()->json($project);
    }
    

    public function show($id)
    {
        $project = Project::findOrFail($id);
        return response()->json($project);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        // Validate the incoming data before updating
       

        $project->update($request->all());
        return response()->json($project, 200);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return response()->json(null, 204);
    }

    public function countByManagerId($managerId)
    {
        $countPending = Project::where('project_manager_id', $managerId)->where('status', 'Pending')->count();
        $countCompleted = Project::where('project_manager_id', $managerId)->where('status', 'Completed')->count();
        $countStart = Project::where('project_manager_id', $managerId)->where('status', 'Start')->count();
        $count = Project::where('project_manager_id', $managerId)->count();
    
        return response()->json(['count' => $count, 'Pending' => $countPending, 'Completed' => $countCompleted, 'Start' => $countStart]);
    }




    public function getProjectsByManagerId($managerId)
    {
        $projects = Project::where('project_manager_id', $managerId)->with('client', 'projectManager')->get();
        return response()->json($projects);
    }

    public function getUsersInProject($id)
    {
        $project = Project::findOrFail($id);
        $users = $project->getAllUsers();
        return response()->json($users);
    }

    public function getAllProjectsWithManagerAndClientNames()
    {
        $projects = Project::with('projectManager', 'client')->get();

        $projectData = [];

        foreach ($projects as $project) {
            $managerName = $project->projectManager->name;
            $clientName = $project->client->name;

            $projectData[] = [
                'project' => $project,
                'manager_name' => $managerName,
                'client_name' => $clientName,
            ];
        }

        return response()->json($projectData);
    }


    
                    public function attachUser(Request $request, $projectId)
                {
                    try {
                        // Find the project by its ID
                        $project = Project::find($projectId);

                        if (!$project) {
                            return response()->json(['error' => 'Project not found'], 404);
                        }

                        // Attach the user(s) to the project
                        $userIds = $request->input('users');
                        $project->users()->attach($userIds);

                        // Respond with a success message or any other relevant data
                        return response()->json(['message' => 'Users attached successfully'], 200);
                    } catch (\Exception $e) {
                        // Handle errors (e.g., database errors)
                        \Log::error('Error attaching users: ' . $e->getMessage());
                        return response()->json(['error' => 'Internal server error'], 500);
                    }
                }

                public function detachUser(Request $request, $projectId)
                {
                    try {
                        // Find the project by its ID
                        $project = Project::find($projectId);

                        if (!$project) {
                            return response()->json(['error' => 'Project not found'], 404);
                        }

                        // Detach the user(s) from the project
                        $userIds = $request->input('users');
                        $project->users()->detach($userIds);

                        // Respond with a success message or any other relevant data
                        return response()->json(['message' => 'Users detached successfully'], 200);
                    } catch (\Exception $e) {
                        // Handle errors (e.g., database errors)
                        \Log::error('Error detaching users: ' . $e->getMessage());
                        return response()->json(['error' => 'Internal server error'], 500);
                    }
                }
                public function getProjectUsers($projectId)
                {
                    try {
                        // Find the project by its ID
                        $project = Project::find($projectId);

                        if (!$project) {
                            return response()->json(['error' => 'Project not found'], 404);
                        }

                        // Get all users associated with the project
                        $users = $project->users;

                        // Respond with the users' data
                        return response()->json($users, 200);
                    } catch (\Exception $e) {
                        // Handle errors (e.g., database errors)
                        \Log::error('Error retrieving project users: ' . $e->getMessage());
                        return response()->json(['error' => 'Internal server error'], 500);
                    }
}
                

public function getProjectsForUser($id)
{
    try {
        // Find the user by their ID
        $user = User::findOrFail($id);

        // Get all projects associated with the user
        $projects = $user->projects;

        // Respond with the projects' data
        return response()->json($projects, 200);
    } catch (\Exception $e) {
        // Handle errors (e.g., database errors)
        \Log::error('Error retrieving user projects: ' . $e->getMessage());
        return response()->json(['error' => 'Internal server error'], 500);
    }
}


}
