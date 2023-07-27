<?php

namespace App\Http\Controllers\Api;

use App\Models\Privilege;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PrivilegeController extends Controller
{
    public function index()
    {
        $privileges = Privilege::all();

        return response()->json($privileges);
    }

    public function show($id)
    {
        $privilege = Privilege::findOrFail($id);

        return response()->json($privilege);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
        ]);

        $privilege = Privilege::create($request->all());

        return response()->json($privilege, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
        ]);

        $privilege = Privilege::findOrFail($id);
        $privilege->update($request->all());

        return response()->json($privilege, 200);
    }

    public function destroy($id)
    {
        $privilege = Privilege::findOrFail($id);
        $privilege->delete();

        return response()->json(null, 204);
    }
}
