<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Profile;

class CheckProfile
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $profile
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $profile)
    {
        // Get the authenticated user
        $user = $request->user();
        $profilee = Profile::find($user->profile_id);

        // Check if the user's profile matches the required profile
        if ($user && $profilee->name === $profile) {
            return $next($request);
        }

        // Redirect or abort the request as desired
        return redirect()->route('login'); // Redirect to the login page
        // Or
        // abort(403, 'Unauthorized'); // Show a 403 Forbidden error
    }
}
