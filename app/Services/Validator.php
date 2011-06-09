<?php namespace App\Services;

use Illuminate\Validation\Validator as BaseValidator;

class Validator extends BaseValidator
{
    public function validatePhone($attribute, $value)
    {
        return preg_match('/(\W|^)[(]{0,1}\d{3}[)]{0,1}[\s-]{0,1}\d{3}[\s-]{0,1}\d{4}(\W|$)/', $value);
    }

    public function validateActiveEmail($attribute, $value)
    {
        if (($host = strstr($value, '@')) === false) {
            return false;
        }

        return checkdnsrr(substr($host, 1), 'MX');
    }
}
