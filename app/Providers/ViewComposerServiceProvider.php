<?php
namespace App\Providers;

use Bluechip\Laravel\Providers\ViewComposerServiceProvider as ServiceProvider;

class ViewComposerServiceProvider extends ServiceProvider
{
    protected $composers = [
        // \App\ViewComposers\SomeComposer::class => ['some.view', 'some.other_view'],
    ];
}
