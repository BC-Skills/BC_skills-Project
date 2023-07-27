<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sprint;
use Illuminate\Http\Request;

class SprintController extends Controller
{
    public function index()
    {
        $sprints = Sprint::all();
        return response()->json($sprints);
    }

    public function store(Request $request)
    {
        $sprint = Sprint::create($request->all());
        return response()->json($sprint, 201);
    }

    public function show($id)
    {
        $sprint = Sprint::findOrFail($id);
        return response()->json($sprint);
    }

    public function update(Request $request, $id)
    {
        $sprint = Sprint::findOrFail($id);
        $sprint->update($request->all());
        return response()->json($sprint, 200);
    }

    public function destroy($id)
    {
        $sprint = Sprint::findOrFail($id);
        $sprint->delete();
        return response()->json(null, 204);
    }
}
