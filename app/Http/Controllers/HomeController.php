<?php

namespace App\Http\Controllers;

class HomeController extends BaseController
{
    public function showHome()
    {
        return view('index');
    }
}
