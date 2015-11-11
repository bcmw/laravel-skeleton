<?php

namespace Http\Controllers;

use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    public function showHome()
    {
        return view('index');
    }
}
