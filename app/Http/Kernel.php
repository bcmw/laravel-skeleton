<?php namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel {

	/**
	 * The application's global HTTP middleware stack.
	 *
	 * @var array
	 */
	protected $middleware = [
		'Illuminate\Foundation\Http\Middleware\CheckForMaintenanceMode',
		// 'App\Http\Middleware\Secure',
	];

	/**
	 * The application's route middleware.
	 *
	 * @var array
	 */
	protected $routeMiddleware = [
		'cookie.encrypt' => 'Illuminate\Cookie\Middleware\EncryptCookies',
		'cookie.queue'   => 'Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse',
		'session.start'  => 'Illuminate\Session\Middleware\StartSession',
		'session.errors' => 'Illuminate\View\Middleware\ShareErrorsFromSession',
		'cors'           => 'App\Http\Middleware\CORS',
		'csrf'           => 'App\Http\Middleware\VerifyCsrfToken',
		'auth.basic'     => 'Illuminate\Auth\Middleware\AuthenticateWithBasicAuth',
		'auth'           => 'App\Http\Middleware\Authenticate',
		'admin'          => 'App\Http\Middleware\Admin',
		'guest'          => 'App\Http\Middleware\RedirectIfAuthenticated',
	];

}
