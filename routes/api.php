<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\FormationDeveloperController;
use App\Http\Controllers\Api\FormationTypeController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ProjectTypeController;
use App\Http\Controllers\Api\SprintController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ProjectManagerController;
use App\Http\Controllers\Api\DevelopperController;
use App\Http\Controllers\Api\PrivilegeController;
use App\Http\Controllers\Api\StatusController;
use App\Http\Controllers\Api\ScheduleController;

use App\Http\Controllers\Api\DashboardController;


Route::post('/login', [AuthController::class, 'login'])->name('login');




Route::middleware('auth:sanctum')->group(function () {
    Route::post('/users', [UserController::class, 'store']);
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::apiResource('formations', FormationController::class);
Route::get('formation-types/{formationType}/formations', [FormationTypeController::class, 'getFormations']);

Route::apiResource('formationdevelopers', FormationDeveloperController::class);
Route::apiResource('formation-types', FormationTypeController::class);
Route::apiResource('profiles', ProfileController::class);
Route::apiResource('projects', ProjectController::class);
Route::apiResource('project-types', ProjectTypeController::class);
Route::apiResource('sprints', SprintController::class);
Route::apiResource('tickets', TicketController::class);
Route::apiResource('users', UserController::class);
Route::apiResource('privileges', PrivilegeController::class);
Route::resource('statuses', StatusController::class);

Route::get('/profile/{id}', 'ProfileController@show');
Route::post('ticketss', [TicketController::class, 'storez']);


Route::post('/messages', 'MessageController@store');


Route::post('profiless/{profileId}/attach-privileges', [ProfileController::class, 'attachPrivileges']);
Route::post('profiless/{profile}/detach-privileges', [ProfileController::class, 'detachPrivileges']);
Route::get('profiless/{profileId}/privileges', [ProfileController::class, 'getPrivileges']);


Route::post('/projects/{projectId}/users/attach', [ProjectController::class, 'attachUser']);

// Route to detach users from a project
Route::post('/projects/{projectId}/users/detach', [ProjectController::class, 'detachUser']);

// Route to get all users associated with a project
Route::get('/projects/{projectId}/users', [ProjectController::class, 'getProjectUsers']);



Route::get('/projects/count/manager/{managerId}', [ProjectController::class, 'countByManagerId']);

Route::get('/clients/{clientId}/projects', [ClientController::class, 'getProjects']);
Route::get('/projectmanagers/{projectmanagerId}/projects', [ProjectManagerController::class, 'getProjects']);
Route::get('users/{user}/schedule', [TicketController::class, 'showScheduleForUser'])->name('tickets.schedule');
Route::get('/userss/admin', [UserController::class, 'getAdmin']);




Route::apiResource('schedules', ScheduleController::class);


//Route::post('/schedules', [ScheduleController::class, 'store']);
Route::get('schedules/download/{id}', [ScheduleController::class, 'downloadFile']);
Route::get('schedules/user/{userId}', [ScheduleController::class, 'getSchedulesByUser']);

Route::get('/sprintss/{project_id}', [SprintController::class, 'getSprints']);


Route::get('tickets/{id}', [TicketController::class, 'getById']); // Custom route to get ticket by ID


Route::get('projects/{id}', [ProjectController::class, 'getById']); // Custom route to get project by ID

Route::post('users/{userId}/update-password', [UserController::class, 'updatePassword']);

Route::get('/ticketss/{projectId}', [TicketController::class, 'getTicketsByProjectId']);
Route::put('/ticketss/{projectId}', [TicketController::class, 'update2']);

Route::get('/ticketss/projectss/{projectId}/sprintss/{sprintId}', [TicketController::class, 'getTicketsByProjectAndSprintIdd']);

Route::get('projects/{projectId}/tickets-without-sprint', [TicketController::class, 'getTicketsByProjectWithoutSprint']);



Route::get('projects/manager/{managerId}', [ProjectController::class, 'getProjectsByManagerId']);

Route::get('/projects/{id}/users', [ProjectController::class, 'getUsersInProject']);


Route::get('/projectss', [ProjectController::class, 'getAllProjectsWithManagerAndClientNames']);


Route::get('/statuss/{statusId}', [PrivilegeController::class, 'getByStatusId']);

//images

Route::get('/userss/clients', [UserController::class, 'getClients']);


Route::get('/profiless/get-profile-id', [ProfileController::class, 'getProfileIdByName']);


Route::get('/storage/{path}', function ($path) {
    return response()->file(storage_path('app/public/' . $path));
})->where('path', '.*');


Route::get('/scheduless/last-7-days/{userId}', [ScheduleController::class, 'getLast7DaysSchedulesForUser']);


Route::get('/dashboard', [DashboardController::class, 'getDashboardData']);


Route::get('/dashboard/projects', [DashboardController::class, 'getAllProjects']);
Route::get('/dashboard/projects/{projectId}/sprints', [DashboardController::class, 'getProjectSprints']);

Route::get('/dashboard/projects/{projectId}/sprint-status', [DashboardController::class, 'getSprintStatusCounts']);

Route::get('/dashboard/projects/{projectId}/sprints/{sprintId}/ticket-status', [DashboardController::class, 'getSprintTicketStatusCounts']);


Route::get('userss/exadminclient/{id}',  [UserController::class, 'getUsersAndUserById']);
