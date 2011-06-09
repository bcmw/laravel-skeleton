<?php namespace App\Http\Requests;

use App\Http\Requests\Request;
use Illuminate\Validation\Validator;

class FormRequest extends Request
{
    public function authorize()
    {
        return true;
    }

    public function forbiddenResponse()
    {
        return response()->json([
            'message' => 'You do not have sufficient permissions to access the requested resource.',
        ], 403);
    }

    protected function formatErrors(Validator $validator)
    {
        return ['errors' => $validator->errors()->getMessages()];
    }

    public function rules()
    {
        return [
            'name'    => 'unique:forms|min:4|required',
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
