<?php namespace App\Providers;

use Route;
use Illuminate\Routing\Router;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
	/**
	 * This namespace is applied to the controller routes in your routes file.
	 *
	 * In addition, it is set as the URL generator's root namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'App\Http\Controllers';

	/**
	 * Define your route model bindings, pattern filters, etc.
	 *
	 * @param  \Illuminate\Routing\Router  $router
	 * @return void
	 */
	public function boot(Router $router)
	{
		parent::boot($router);
	}

	/**
	 * Define the routes for the application.
	 *
	 * @param  \Illuminate\Routing\Router  $router
	 * @return void
	 */
	public function map(Router $router)
	{
		$router->group(['namespace' => $this->namespace], function($router) {
			/*
			|--------------------------------------------------------------------------
			| Application Routes
			|--------------------------------------------------------------------------
			|
			| Here is where you can register all of the routes for an application.
			| It's a breeze. Simply tell Laravel the URIs it should respond to
			| and give it the controller to call when that URI is requested.
			|
			*/

			$router->get('/', 'DefaultController@index');
		});
	}
}
