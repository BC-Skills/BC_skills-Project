<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Profile;
use App\Notifications;
use App\Notifications\UserCreatedNotification;
use App\Notifications\PasswordUpdatedNotification;

use Illuminate\Support\Str; // Make sure to import the Str class



class UserController extends Controller
{
    // public function index()
    // {
    //     $users = User::all();
    //     return response()->json($users);
    // }

    // public function store(Request $request)
    // {
    //     $user = User::create($request->all());
    //     return response()->json($user, 201);
    // }

    public function store(Request $request)
    {
        // Validate the incoming request data if needed
        // $request->validate([
        //     'name' => 'required|string',
        //     'email' => 'required|email|unique:users',
        //     'password' => 'required|min:8',
        //     'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        // ]);
    
        // Handle the profile picture upload and store the image in the public disk
        if ($request->hasFile('profile_picture')) {
            $image = $request->file('profile_picture');
            $imagePath = $image->store('public/profile_pictures');
    
            // Generate URL for the uploaded image
            $profilePictureUrl = asset('storage/profile_pictures/' . basename($imagePath));
        } else {
            // If no image is uploaded, set default values for profile_picture and profilePictureUrl
            $profilePictureUrl = null;
        }
            // Generate a random password or use the password from the request
            $password = Str::random(8); // Change this line if you want to use a different password generation method

    
        // Modify the request data to set the profile picture URL
        $requestData = $request->all();
        $requestData['profile_picture'] = $profilePictureUrl;
        $requestData['password'] = $password ;

    
        // Create the user with the modified request data
        $user = User::create($requestData);

            // Send email notification
            $user->notify(new UserCreatedNotification($password));
  
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

    
    public function updateProfilePicture(Request $request, $id)
{
    $user = User::findOrFail($id);

    // Handle the profile picture update if a new file is provided
    if ($request->hasFile('profile_picture')) {
        // Delete the old profile picture if it exists
        // if ($user->profile_picture) {
        //     Storage::delete('public/profile_pictures/' . basename($user->profile_picture));
        // }

        $image = $request->file('profile_picture');
        $imagePath = $image->store('public/profile_pictures');

        // Generate URL for the uploaded image
        $profilePictureUrl = asset('storage/profile_pictures/' . basename($imagePath));
        $user->profile_picture = $profilePictureUrl;
        $user->save();
    }

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

   
    public function getUserCompetences(User $user)
    {
        $competences = $user->competences; 
        
        return response()->json($competences);
    }

    public function getAdmin()
    {
        // Get active users (excluding those with status 'archive') who are not admins
        $users = User::where('status', '!=', 'archive')
                    ->whereHas('profile', function ($query) {
                        $query->where('name', '!=', 'admin');
                    })
                    ->get();
    
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

                     // Send the PasswordUpdatedNotification to inform the user about the password update
                     $user->notify(new PasswordUpdatedNotification());
      
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
                                  ->with('profile')
                                  ->with('competences'); 
            
                if ($id !== null) {
                    $usersQuery->where('id', '!=', $id);
                }
                $users = $usersQuery->get();
            
                return response()->json($users);
            }
      
    
}
