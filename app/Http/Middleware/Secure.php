<?php namespace App\Http\Middleware;

use App;
use Closure;
use Exception;
use Illuminate\Contracts\Routing\Middleware;

class Secure implements Middleware
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (App::environment('production') && !$request->secure()) {
            throw new Exception('All requests to this endpoint must be secure!');
        }

        return $next($request);
    }
}