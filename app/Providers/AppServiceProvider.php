<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
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
     * @return void
     */
    public function register()
    {
        //
    }
}
