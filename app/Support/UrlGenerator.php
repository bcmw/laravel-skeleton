<?php
namespace App\Support;

use Illuminate\Routing\UrlGenerator as BaseUrlGenerator;

class UrlGenerator extends BaseUrlGenerator
{
    public function asset($path, $secure = null)
    {
        return parent::asset(static::revPath($path), $secure);
    }

    protected static function revPath($path)
    {
        static $manifest = null;

        if ($manifest === null) {
            $file = storage_path('app/asset-manifest.json');

            if (file_exists($file)) {
                $raw_manifest = json_decode(file_get_contents($file), true);

                $manifest = [];
                foreach ($raw_manifest as $k => $v) {
                    $manifest['assets/' . $k] = 'assets/' . $v;
                }
            } else {
                $manifest = false;
            }
        }

        if ($manifest === false || !isset($manifest[$path])) {
            return $path;
        }

        return $manifest[$path];
    }

}
