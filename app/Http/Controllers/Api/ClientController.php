<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Models\Competence;
class ClientController extends Controller
{
    public function getProjects($clientId)
    {
        $client = User::findOrFail($clientId);
        $projects = Project::where('client_id', $client->id)->get();
        return response()->json(['projects' => $projects]);
    }




}
