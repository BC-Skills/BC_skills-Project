<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use App\Models\Formation;
use App\Models\Profile;
use App\Models\Sprint;
use App\Models\Ticket;
use Illuminate\Support\Facades\DB;


class DashboardController extends Controller
{
    public function getDashboardData()
{
    $projectCount = Project::count();
    $formationCount = Formation::count();

    // Find the profile with the name "Client"
    $clientProfile = Profile::where('name', 'Client')->first();

    if (!$clientProfile) {
        return response()->json(['error' => 'Client profile not found'], 404);
    }

    // Get the count of users with profiles not equal to "Client"
    $userCount = User::where('profile_id', '!=', $clientProfile->id)->count();

    // Get the count of users with the "Client" profile
    $clientCount = User::where('profile_id', $clientProfile->id)->count();

    // Calculate counts for Completed, started, and pending projects
    $completedProjectCount = Project::where('status', 'Completed')->count();
    $startedProjectCount = Project::where('status', 'Start')->count();
    $pendingProjectCount = $projectCount - ($completedProjectCount + $startedProjectCount);

    $users = User::select('users.*', 'ticket_counts.finished_ticket_count')
    ->leftJoinSub(function ($query) {
        $query->select('assign_to', DB::raw('COUNT(id) as finished_ticket_count'))
              ->from('tickets')
              ->where('status', 'Fini')
              ->groupBy('assign_to');
    }, 'ticket_counts', 'users.id', '=', 'ticket_counts.assign_to')
    ->orderBy('finished_ticket_count', 'desc')
    ->limit(3)
    ->get();

    $topProjectManagers = Project::select('project_manager_id', DB::raw('COUNT(*) as count'))
        ->where('status', 'Completed')
        ->groupBy('project_manager_id')
        ->orderByDesc('count')
        ->limit(2);

    // Join the users table to fetch details of project managers
    $topProjectManagersData = User::joinSub($topProjectManagers, 'top_managers', function ($join) {
        $join->on('users.id', '=', 'top_managers.project_manager_id');
    })->get(['users.*', 'top_managers.count as project_count']);


    return response()->json([
        'project_count' => $projectCount,
        'completed_project_count' => $completedProjectCount,
        'started_project_count' => $startedProjectCount,
        'pending_project_count' => $pendingProjectCount,
        'formation_count' => $formationCount,
        'user_count' => $userCount,
        'client_count' => $clientCount,
        'top_ticket_finishers' => $users,
        'top_project_managers' => $topProjectManagersData,
    ]);
}


public function getAllProjects()
{
    $projects = Project::all();

    return response()->json([
        'projects' => $projects,
    ]);
}

public function getProjectSprints($projectId)
{
    $project = Project::find($projectId);

    if (!$project) {
        return response()->json(['error' => 'Project not found'], 404);
    }

    $sprints = Sprint::where('project_id', $project->id)->get();

    return response()->json([
        'project' => $project,
        'sprints' => $sprints,
    ]);
}


public function getSprintStatusCounts($projectId)
{
    $project = Project::find($projectId);

    if (!$project) {
        return response()->json(['error' => 'Project not found'], 404);
    }

    $pendingSprintCount = Sprint::where('project_id', $project->id)->where('status', 'Pending')->count();
    $startedSprintCount = Sprint::where('project_id', $project->id)->where('status', 'Start')->count();
    $completedSprintCount = Sprint::where('project_id', $project->id)->where('status', 'Completed')->count();

    return response()->json([
        'pending_sprint_count' => $pendingSprintCount,
        'started_sprint_count' => $startedSprintCount,
        'completed_sprint_count' => $completedSprintCount,
    ]);
}

public function getSprintTicketStatusCounts($projectId, $sprintId)
{
    $project = Project::find($projectId);

    if (!$project) {
        return response()->json(['error' => 'Project not found'], 404);
    }

    $sprint = Sprint::where('project_id', $project->id)->find($sprintId);

    if (!$sprint) {
        return response()->json(['error' => 'Sprint not found'], 404);
    }

    $pendingTicketCount = Ticket::where('sprint_id', $sprint->id)->where('status', 'En Cours')->count();
    $startedTicketCount = Ticket::where('sprint_id', $sprint->id)->where('status', 'A faire')->count();
    $completedTicketCount = Ticket::where('sprint_id', $sprint->id)->where('status', 'Fini')->count();

    return response()->json([
        'pending_ticket_count' => $pendingTicketCount,
        'started_ticket_count' => $startedTicketCount,
        'completed_ticket_count' => $completedTicketCount,
    ]);
}





}
