<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Profile;

class ProfileMiddleware
{
    public function handle(Request $request, Closure $next, $requiredProfile)
    {
        $user = Auth::user();
        $profile = Profile::find($user->profile_id);

        if ($user && $profile->name === $requiredProfile) {
            return $next($request);
        }

        abort(403, 'Unauthorized');
    }
}