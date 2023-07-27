<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class RedirectBasedOnProfile
{
    public function handle($request, Closure $next, $profile)
    {
        // Perform authentication
        if (Auth::check()) {
            $user = Auth::user();
            $profile = Profile::find($user->profile_id);
            
            if ($userProfile !== $profile) {
                return Redirect::back()->withErrors(['login' => 'Invalid profile']);
            }
        } else {
            return Redirect::route('login');
        }

        return $next($request);
    }
}
