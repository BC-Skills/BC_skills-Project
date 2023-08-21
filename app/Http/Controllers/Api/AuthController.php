<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\Profile;
use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Handle user login.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function login(Request $request)
    {
        // Validate the request data
        $this->validateLogin($request);

        // Retrieve the login credentials from the request
        $credentials = $request->only('email', 'password');

        // Perform authentication
        if (Auth::attempt($credentials)) {
            // Authentication successful

            // Get the authenticated user
            $user = Auth::user();

            // Update is_connected to true
            $user->update(['is_connected' => true]);

            // Get the user's profile
            $profile = Profile::find($user->profile_id);

            // Create a new token for the user
            $token = $user->createToken('authToken')->plainTextToken;

            // Return the token and user information
            return response()->json([
                'token' => $token,
                'user' => $user,
                'profile' => $profile
            ]);
        }

        // Authentication failed
        throw ValidationException::withMessages(['login' => 'Invalid credentials']);
    }

    /**
     * Validate the login request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function validateLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    }

    /**
     * Logout the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        // Get the user ID from the request
        $userId = $request->id;
    
        // Find the user by ID
        $user = User::find($userId);
    
        if ($user) {
            // Update is_connected to false
            $user->update(['is_connected' => false]);
            return response()->json(['message' => 'Logged out successfully']);
        } else {
            return response()->json(['message' => 'User not found']);
        }
    }
}
