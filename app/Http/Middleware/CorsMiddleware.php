<?php


namespace App\Http\Middleware;

use Closure;

class CorsMiddleware
{
    public function handle($request, Closure $next)
    {
        // Allow requests from any origin
        header('Access-Control-Allow-Origin: * ');

        // Allow specific HTTP methods
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');

        // Allow specific headers
        header('Access-Control-Allow-Headers: Origin, Content-Type, Authorization');

        // Continue with the request
        return $next($request);
    }
}
