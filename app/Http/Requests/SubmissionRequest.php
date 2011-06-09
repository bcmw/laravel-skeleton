<?php namespace App\Http\Requests;

use App\Http\Requests\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Validator;

class SubmissionRequest extends Request
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
        $form = Route::current()->parameter('forms');

        return $form->rules;
    }
}
