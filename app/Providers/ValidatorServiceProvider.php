<?php

namespace App\Providers;

use App\Support\Validator;
use Bluechip\Laravel\Providers\ValidatorServiceProvider as ServiceProvider;

class ValidatorServiceProvider extends ServiceProvider
{
    protected $validator = Validator::class;
}
