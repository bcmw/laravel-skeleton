<?php

namespace App\Providers;

use App\Utils\Validator;
use Bluechip\Laravel\Providers\ValidatorServiceProvider as ServiceProvider;

class ValidatorServiceProvider extends ServiceProvider
{
    protected $validator = Validator::class;
}
