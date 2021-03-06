<?php

namespace App\Http;

use App\Http\Middleware\Authenticate;
use App\Http\Middleware\CORS;
use App\Http\Middleware\VerifyCsrfToken;
use Bluechip\Laravel\Middleware\DevPasswordProtect;
use Bluechip\Laravel\Middleware\GetWall;
use Bluechip\Laravel\Middleware\RedirectIfAuthenticated;
use Bluechip\Laravel\Middleware\Secure;
use Illuminate\Auth\Middleware\AuthenticateWithBasicAuth;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Kernel as HttpKernel;
use Illuminate\Foundation\Http\Middleware\CheckForMaintenanceMode;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Illuminate\Routing\Middleware\ThrottleRequests;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array
     */
    protected $middleware = [
        CheckForMaintenanceMode::class,    // check for maintenance mode flag
        // Secure::class,                  // force requests to secure endpoint
        DevPasswordProtect::class,         // password-protection for development
        EncryptCookies::class,             // encrypt cookies
        AddQueuedCookiesToResponse::class, // send set-cookie header
        StartSession::class,               // start session
        ShareErrorsFromSession::class,     // add errors object from session to all views
    ];

    /**
     * The application's route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     *
     * @var array
     */
    protected $routeMiddleware = [
        'auth'       => Authenticate::class,              // redirect if the user is not logged in
        'auth.basic' => AuthenticateWithBasicAuth::class, // basic auth if the user is not logged in
        'cors'       => CORS::class,                      // headers to cors requests
        'csrf'       => VerifyCsrfToken::class,           // csrf protection
        'guest'      => RedirectIfAuthenticated::class,   // redirect if the user is logged in
        'getwall'    => GetWall::class,                   // protect a route with a query string parameter
        'throttle'   => ThrottleRequests::class,
    ];
}
