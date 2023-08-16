<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index()
    {
        $profiles = Profile::all();
        return response()->json($profiles);
    }

    public function store(Request $request)
    {
        $profile = Profile::create($request->all());
        return response()->json($profile, 201);
    }

    public function show($id)
    {
        $profile = Profile::findOrFail($id);
        return response()->json($profile);
    }

    public function update(Request $request, $id)
    {
        $profile = Profile::findOrFail($id);
        $profile->update($request->all());
        return response()->json($profile, 200);
    }

    public function destroy($id)
    {
        $profile = Profile::findOrFail($id);
        $profile->delete();
        return response()->json(null, 204);
    }

    public function attachPrivileges(Request $request, $profileId)
    {
        $profile = Profile::findOrFail($profileId);
        $privileges = $request->input('privileges');
    
        // Attach the new privileges to the profile's pivot table
        $profile->privileges()->attach($privileges);
    
        return response()->json($profile->load('privileges'), 200);
    }

    public function getPrivileges($profileId)
    {
        $profile = Profile::findOrFail($profileId);
        $privileges = $profile->privileges;
        return response()->json($privileges, 200);
    }

    public function detachPrivileges(Request $request, Profile $profile)
    {
        $privilegeId = $request->input('privileges');
        
        // Check if the privilege exists in the profile's pivot table before detaching
        if ($profile->privileges()->where('privilege_id', $privilegeId)->exists()) {
            // Detach the privilege from the profile
            $profile->privileges()->detach($privilegeId);
    
            return response()->json(['message' => 'Privilege detached successfully'], 200);
        } else {
            return response()->json(['message' => $privilegeId ], 404);
        }
    }

    public function getProfileIdByName(Request $request)
    {
        $profileName = $request->input('profile_name');
    
        $profile = Profile::where('name', $profileName)->first();
    
        if (!$profile) {
            return response()->json(['error' => 'Profile not found'], 404);
        }
    
        return response()->json(['profile_id' => $profile->id], 200);
    }

}
