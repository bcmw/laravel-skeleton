<?php namespace App\Providers;

use App\Models\AES;
use App\Services\Validator;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {

	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot()
	{
		if (env('AES_KEY', false) !== false) {
		    AES::setKey(env('AES_KEY'));
		    DB::statement('set @key = unhex(?)', [AES::getKey()]);
		}

		$this->app->validator->resolver(function($translator, $data, $rules, $messages) {
		    return new Validator($translator, $data, $rules, $messages);
		});
	}

	/**
	 * Register any application services.
	 *
	 * This service provider is a great spot to register your various container
	 * bindings with the application. As you can see, we are registering our
	 * "Registrar" implementation here. You can add your own bindings too!
	 *
	 * @return void
	 */
	public function register()
	{
		$this->app->bind(
			'Illuminate\Contracts\Auth\Registrar',
			'App\Services\Registrar'
		);
	}

}
