## Blue Chip Laravel Skeleton Project

Laravel 5.2 Skeleton

### Installation
```
composer install && npm install && bower install
gulp watch
```

### Folder structure
The folder structure of the skeleton app is as follows, with some important folders highlighted.
You should not need to touch any folder other than the ones explained below.
```
|-- app
    |-- Http
        |-- Controllers
        |-- Middleware
        |-- Requests
        |-- routes.php
|-- bootstrap
|-- config
|-- database
|-- public
|-- resources
    |-- font
    |-- img
    |-- js
        |-- critical
        |-- main
    |-- lang
    |-- scss
        |-- critical
        |-- main
    |-- views
|-- storage
|-- tests
```

#### bootstrap, config, database, public, storage, tests
Do not modify anything in these folders unless you know what you are doing. Do not put anything in public folder, it will get deleted when pushing live. Images and other assets should go into `resources` folder.

#### app
You won't have to touch anything in this folder except defining new routes in `app/Http/routes.php` and controller actions in `app/Http/Controllers/*.php`. Anything else leave as is.

#### Resources
This is the folder you will be working off of the most. It contains all the assets as well as css, js and view files.

#### Images
All the images go into the `resources/img` folder. All the images will be compressed and put in the respective folder in `public/assets`. To access the file from the `resources` folder in Twig template use
```
<img src="{{ resource('img/logo.png') }}" alt="Logo image">
```

##### CSS
CSS is split into two sections, `main` and `critical`. You can use Neat/Burbon mixins as they are pulled in automatically.

Main CSS section has all the main CSS definitions and declarations. You can split the CSS into sections and join them into one file in `style.scss` located at `resources/scss/main`.

In the critical section you should only put minimal amount of CSS to have the above-the-fold content display better before main CSS kicks in. Rule of thumb is that critical CSS should not exceed one screen of definitions. Critical CSS is inlined on every page.

##### Javascript
Similar to CSS Javascript is split into two sections, critical and main. Both files are located in `resources/scss`. Critical JS will be inlined on every page.

##### Views
All views are done in Twig and located at `resources/views`. `layout.twig` controls the structure and `index.twig` has the site content.

#### Routes
To define a new route to `/privacy-policy` enter the following`routes.php` file located in `app/Http` folder

```php
Route::get('/privacy-policy', 'HomeController@privacy');
```

Now define a new action in `HomeController` located in `app/Http/Controllers` and add the following

```php
public function privacy()
{
    return view('privacy');
}
```

The view rendered is taken from `resources/views/privacy.twig`.
