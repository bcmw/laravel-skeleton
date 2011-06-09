<?php namespace App\Exceptions;

use Exception;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{
	/**
	 * A list of the exception types that should not be reported.
	 *
	 * @var array
	 */
	protected $dontReport = [
		'Symfony\Component\HttpKernel\Exception\HttpException'
	];

	/**
	 * Report or log an exception.
	 *
	 * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
	 *
	 * @param  \Exception  $e
	 * @return void
	 */
	public function report(Exception $e)
	{
		return parent::report($e);
	}

	/**
	 * Render an exception into an HTTP response.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Exception  $e
	 * @return \Illuminate\Http\Response
	 */
	public function render($request, Exception $e)
	{
		if ($request->ajax() || $request->wantsJson()) {

			$message = null;

			if ($e instanceof HttpException) {
				$code = 404;
				$message = 'The requested resource could not be found.';
			} else {
				$code = 500;
			}

			return response()->json([
				'message'   => $message ?: ($e->getMessage() ?: strval($e)),
				'exception' => get_class($e),
			], $code);
		}

		return parent::render($request, $e);
	}
}