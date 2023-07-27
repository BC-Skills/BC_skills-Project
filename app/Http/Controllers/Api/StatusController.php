<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Status;

class StatusController extends Controller
{
    public function index()
    {
        // Fetch all statuses from the database
        $statuses = Status::all();
        
        return response()->json($statuses);
    }

    public function store(Request $request)
    {
        // Validate the request data (you can add more validation rules if needed)
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Create a new status record
        $status = Status::create([
            'name' => $request->name,
        ]);

        return response()->json($status, 201);
    }

    public function show($id)
    {
        // Find the status record by its ID
        $status = Status::findOrFail($id);

        return response()->json($status);
    }

    public function update(Request $request, $id)
    {
        // Validate the request data (you can add more validation rules if needed)
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Find the status record by its ID and update it
        $status = Status::findOrFail($id);
        $status->update([
            'name' => $request->name,
        ]);

        return response()->json($status);
    }

    public function destroy($id)
    {
        // Find the status record by its ID and delete it
        $status = Status::findOrFail($id);
        $status->delete();

        return response()->json(null, 204);
    }
}
