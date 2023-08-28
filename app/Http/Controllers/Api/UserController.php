<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Profile;

class UserController extends Controller
{
    // public function index()
    // {
    //     $users = User::all();
    //     return response()->json($users);
    // }

    public function store(Request $request)
    {
        $user = User::create($request->all());
        return response()->json($user, 201);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->all());
        return response()->json($user, 200);
    }



    public function destroy($id)
    {
        $user = User::findOrFail($id);
    
        if ($user->status === 'non archiver') {
            $user->status = 'archive';
        } else {
            $user->status = 'non archiver';
        }
    
        $user->save();
    
        return response()->json(null, 204);
    }

   
   
    public function getAdmin()
{
    // Get active users (excluding those with status 'archive') who are not admins
    $users = User::where('status', '!=', 'archive')->where('profile_id', '!=', '1')->get();

    return response()->json($users);
}


          // Controller function for updating the user's password
          public function updatePassword(Request $request, $userId)
          {
              try {
                  // Find the user by their ID
                  $user = User::find($userId);
      
                  if (!$user) {
                      return response()->json(['error' => 'User not found'], 404);
                  }
      
                  // Update the user's password
                  $user->password = bcrypt($request->input('newPassword'));
                  $user->save();
      
                  // Respond with a success message or any other relevant data
                  return response()->json(['message' => 'Password updated successfully'], 200);
              } catch (\Exception $e) {
                  // Handle errors (e.g., database errors)
                  \Log::error('Error updating password: ' . $e->getMessage());
                  return response()->json(['error' => 'Internal server error'], 500);
              }
          }
            public function index()
            {
                // Get all active users (excluding those with status 'archive') with their profiles
                $users = User::where('status', '!=', 'archive')->with('profile')->get();

                // Map each user to include the profile name
                $usersData = $users->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'profile_picture'=> $user->profile_picture,
                        'name' => $user->name,
                        'email' => $user->email,
                        'tel' => $user->tel,
                        'profile_id' => $user->profile_id,
                        'profile_name' => $user->profile ? $user->profile->name : 'Loading...',
                    ];
                });

                return response()->json($usersData);
            }



            public function index2()
            {
                // Get all active users (excluding those with status 'archive') with their profiles
                $users = User::with('profile')->get();

                // Map each user to include the profile name
                $usersData = $users->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'profile_picture'=> $user->profile_picture,
                        'name' => $user->name,
                        'email' => $user->email,
                        'tel' => $user->tel,
                        'status' => $user->status,
                        'profile_id' => $user->profile_id,
                        'profile_name' => $user->profile ? $user->profile->name : 'Loading...',
                    ];
                });

                return response()->json($usersData);
            }



            public function getClients()
            {
                // Find the profile with the name "Client"
                $clientProfile = Profile::where('name', 'Client')->first();
            
                if (!$clientProfile) {
                    return response()->json(['error' => 'Client profile not found'], 404);
                }
            
                // Get active users with the "Client" profile along with their profile info
                $clients = User::where('status', '!=', 'archive')
                                ->where('profile_id', $clientProfile->id)
                                ->with('profile')
                                ->get();
            
                return response()->json($clients);
            }
            



            public function getUsersAndUserById($id)
            {
                $adminProfile = Profile::where('name', 'Admin')->first();
                $clientProfile = Profile::where('name', 'Client')->first();
            
                if (!$adminProfile || !$clientProfile) {
                    return response()->json(['error' => 'Profiles not found'], 404);
                }
            
                $usersQuery = User::where('status', '!=', 'archive')
                                  ->where('profile_id', '!=', $adminProfile->id)
                                  ->where('profile_id', '!=', $clientProfile->id)
                                  ->with('profile');
            
                if ($id !== null) {
                    $usersQuery->where('id', '!=', $id);
                }
                $users = $usersQuery->get();
            
                return response()->json($users);
            }
      
    
}
