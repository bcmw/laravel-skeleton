<?php

class TestCase extends Illuminate\Foundation\Testing\TestCase {

	/**
	 * Creates the application.
	 *
	 * @return \Illuminate\Foundation\Application
	 */
	public function createApplication()
	{
		$app = require __DIR__.'/../bootstrap/app.php';

		$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

		$config = $app->make('config');
		$config->set('database.default', 'testing');
		$config->set('mail.pretend', true);

		$artisan = $app->make('Illuminate\Contracts\Console\Kernel');
		$artisan->call('migrate');
		$artisan->call('db:seed');

		return $app;
	}

}
