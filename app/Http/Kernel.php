<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * @var array
     */
    protected $middleware = [
        Illuminate\Foundation\Http\Middleware\CheckForMaintenanceMode::class,
		App\Http\Middleware\Secure::class,
    ];

    /**
     * The application's route middleware.
     *
     * @var array
     */
	 *
	 * @var array
	 */
    protected $routeMiddleware = [
		'cookie.encrypt' => Illuminate\Cookie\Middleware\EncryptCookies::class,
		'cookie.queue'   => Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
		'session.start'  => Illuminate\Session\Middleware\StartSession::class,
		'session.errors' => Illuminate\View\Middleware\ShareErrorsFromSession::class,
		'cors'           => App\Http\Middleware\CORS::class,
		'csrf'           => App\Http\Middleware\VerifyCsrfToken::class,
		'auth.basic'     => Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
		'auth'           => App\Http\Middleware\Authenticate::class,
		'admin'          => App\Http\Middleware\Admin::class,
		'guest'          => App\Http\Middleware\RedirectIfAuthenticated::class,
    ];
}
