---
sidebar_position: 7
sidebar_label: Error Handling
---

# Error Handling

## HTTP Exceptions

Throw `HttpException` to return error responses:

```php
use PhpCompatible\Router\HttpException;

route(method(GET), url_path_params('/users/:id'), function() {
    $id = $_GET[':id'];
    $user = find_user($id);

    if (!$user) {
        throw HttpException::notFound('User not found');
    }

    echo json_response(HTTP_OK, array('user' => $user));
});
```

### Available Exception Methods

```php
throw HttpException::badRequest('Invalid input');
throw HttpException::unauthorized('Please log in');
throw HttpException::forbidden('Access denied');
throw HttpException::notFound('Resource not found');
throw HttpException::methodNotAllowed('Method not allowed');
throw HttpException::conflict('Resource conflict');
throw HttpException::unprocessableEntity('Validation failed');
throw HttpException::tooManyRequests('Rate limit exceeded');
throw HttpException::internalServerError('Something went wrong');
```

## Custom Error Handling

```php
route(method(GET), url_path('/risky'), function() {
    try {
        do_something_risky();
    } catch (Exception $e) {
        error_log($e->getMessage());
        echo json_response(HTTP_INTERNAL_SERVER_ERROR, array(
            'error' => 'Something went wrong'
        ));
        stop();
    }
});
```

## Automatic Error Handling

Errors thrown inside `router()` are automatically caught and rendered as JSON or HTML based on the `Accept` header:

```php
router(function() {
    route(method(GET), url_path('/api/data'), function() {
        throw HttpException::notFound('Data not found');
        // Returns: {"error": "Data not found"} with 404 status
    });
});
```

## Stop Execution

Use `stop()` to halt route processing after sending a response:

```php
route(method(POST), url_path('/login'), function() {
    $data = json_body();

    if (empty($data['email'])) {
        echo json_response(HTTP_BAD_REQUEST, array('error' => 'Email required'));
        stop();  // Stops here, doesn't continue
    }

    // Process login...
});
```
