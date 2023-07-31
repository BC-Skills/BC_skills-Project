<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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



Route::post('/login', [AuthController::class, 'login'])->name('login');




Route::middleware('auth:sanctum')->group(function () {
    Route::post('/users', [UserController::class, 'store']);
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::apiResource('formations', FormationController::class);
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


Route::post('/messages', 'MessageController@store');


Route::post('profiless/{profileId}/attach-privileges', [ProfileController::class, 'attachPrivileges']);
Route::post('profiless/{profile}/detach-privileges', [ProfileController::class, 'detachPrivileges']);
Route::get('profiless/{profileId}/privileges', [ProfileController::class, 'getPrivileges']);


Route::get('/projects/count/completed', [ProjectController::class, 'countCompletedProjects']);
Route::get('/projects/count/inprogress', [ProjectController::class, 'countInProgressProjects']);
Route::get('/clients/{clientId}/projects', [ClientController::class, 'getProjects']);
Route::get('/projectmanagers/{projectmanagerId}/projects', [ProjectManagerController::class, 'getProjects']);
Route::get('users/{user}/schedule', [TicketController::class, 'showScheduleForUser'])->name('tickets.schedule');
Route::get('/userss/admin', [UserController::class, 'getAdmin']);




Route::apiResource('schedules', ScheduleController::class);


//Route::post('/schedules', [ScheduleController::class, 'store']);
Route::get('schedules/download/{id}', [ScheduleController::class, 'downloadFile']);
Route::get('schedules/user/{userId}', [ScheduleController::class, 'getSchedulesByUser']);



Route::get('tickets/{id}', [TicketController::class, 'getById']); // Custom route to get ticket by ID


Route::get('projects/{id}', [ProjectController::class, 'getById']); // Custom route to get project by ID

Route::post('users/{userId}/update-password', [UserController::class, 'updatePassword']);



Route::get('projects/manager/{managerId}', [ProjectController::class, 'getProjectsByManagerId']);
