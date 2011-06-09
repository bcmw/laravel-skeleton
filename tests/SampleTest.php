<?php

class SampleTest extends TestCase
{
	public function testRequest()
	{
		$response = $this->call('GET', '/');

		$this->assertTrue($response->isOk());
	}
}
