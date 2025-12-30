---
sidebar_position: 7
sidebar_label: Error Handling
---

# Error Handling

`file_router()` automatically handles errors and returns appropriate responses based on the Accept header.

## HTTP Exceptions

Throw `HttpException` to return error responses:

```php
use PhpCompatible\Router\HttpException;

file_router(function() {
    route(method(GET), url_path_params('/:id'), function() {
        $user = find_user($_GET[':id']);

        if (!$user) {
            throw HttpException::notFound('User not found');
        }

        echo json_response(HTTP_OK, array('user' => $user));
    });
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

## Validation Errors

```php
file_router(function() {
    route(method(POST), url_path('/'), function() {
        $data = json_body();
        $errors = array();

        if (empty($data['name'])) {
            $errors['name'] = 'Name is required';
        }
        if (empty($data['email'])) {
            $errors['email'] = 'Email is required';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email format';
        }

        if (!empty($errors)) {
            throw HttpException::unprocessableEntity('Validation failed', $errors);
        }

        $user = create_user($data);
        echo json_response(HTTP_CREATED, array('user' => $user));
    });
});
```

## Custom Error Handling

```php
file_router(function() {
    route(method(GET), url_path('/risky'), function() {
        try {
            $result = do_something_risky();
            echo json_response(HTTP_OK, array('result' => $result));
        } catch (DatabaseException $e) {
            error_log('Database error: ' . $e->getMessage());
            echo json_response(HTTP_SERVICE_UNAVAILABLE, array(
                'error' => 'Database temporarily unavailable'
            ));
            stop();
        } catch (Exception $e) {
            error_log('Error: ' . $e->getMessage());
            echo json_response(HTTP_INTERNAL_SERVER_ERROR, array(
                'error' => 'Something went wrong'
            ));
            stop();
        }
    });
});
```

## Automatic Error Formatting

Errors are returned as JSON if the client accepts `application/json`, otherwise as HTML:

```php
// Request with Accept: application/json
// Response: {"error": "User not found"}

// Request with Accept: text/html
// Response: <h1>404 Not Found</h1><p>User not found</p>
```

## Stop Execution

Use `stop()` to halt route processing after sending a response:

```php
file_router(function() {
    route(method(POST), url_path('/'), function() {
        $data = json_body();

        if (empty($data['email'])) {
            echo json_response(HTTP_BAD_REQUEST, array('error' => 'Email required'));
            stop();  // Stops here
        }

        // This code only runs if email is provided
        $user = create_user($data);
        echo json_response(HTTP_CREATED, array('user' => $user));
    });
});
```
