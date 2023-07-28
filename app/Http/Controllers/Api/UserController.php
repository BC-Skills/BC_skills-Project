<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Profile;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

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
        $user->delete();
        return response()->json(null, 204);
    }


   
   
    public function getAdmin()
    {
        $users = User::where('profile_id', '!=', '1')->get();
    
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
    
}
