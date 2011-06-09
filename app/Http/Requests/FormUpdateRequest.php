<?php namespace App\Http\Requests;

use App\Http\Requests\Request;
use Illuminate\Validation\Validator;

class FormUpdateRequest extends Request
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name'    => 'min:4|required',//unique:forms|
            'from'    => 'active_email|required_with:to',
            'to'      => 'required_with:from|array',
            'cc'      => 'array',
            'bcc'     => 'array',
            'subject' => 'max:255|required_with:from',
            'hook'    => 'url',
            'fields'  => 'required|array',
        ];
    }
}
