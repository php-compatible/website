---
sidebar_position: 7
sidebar_label: Error Handling
---

# Error Handling

## HTTP Exceptions

Throw `HttpException` to return error responses:

```php
use PhpCompatible\Router\Router;
use PhpCompatible\Router\HttpException;

Router::get('/users/:id', function() {
    $user = find_user($_GET[':id']);

    if (!$user) {
        throw HttpException::notFound('User not found');
    }

    return array('user' => $user);
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

## Using JsonResponse for Errors

```php
use PhpCompatible\Router\JsonResponse;

Router::get('/users/:id', function() {
    $user = find_user($_GET[':id']);

    if (!$user) {
        return JsonResponse::response(HTTP_NOT_FOUND, array('error' => 'User not found'));
    }

    return JsonResponse::response(HTTP_OK, array('user' => $user));
});

Router::post('/users', function() {
    $data = json_body();

    if (empty($data['email'])) {
        return JsonResponse::response(HTTP_BAD_REQUEST, array(
            'error' => 'Validation failed',
            'fields' => array('email' => 'Email is required')
        ));
    }

    $user = create_user($data);
    return JsonResponse::response(HTTP_CREATED, array('user' => $user));
});
```

## Validation Errors

```php
Router::post('/users', function() {
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
        return JsonResponse::response(HTTP_BAD_REQUEST, array(
            'error' => 'Validation failed',
            'fields' => $errors
        ));
    }

    $user = create_user($data);
    return JsonResponse::response(HTTP_CREATED, array('user' => $user));
});
```

## Custom Error Handling

```php
Router::get('/risky', function() {
    try {
        $result = do_something_risky();
        return array('result' => $result);
    } catch (DatabaseException $e) {
        error_log('Database error: ' . $e->getMessage());
        return JsonResponse::response(HTTP_INTERNAL_SERVER_ERROR, array(
            'error' => 'Database temporarily unavailable'
        ));
    } catch (Exception $e) {
        error_log('Error: ' . $e->getMessage());
        return JsonResponse::response(HTTP_INTERNAL_SERVER_ERROR, array(
            'error' => 'Something went wrong'
        ));
    }
});
```

## Automatic Error Handling

Errors thrown inside `Router::run()` are automatically caught and rendered as JSON or HTML based on the Accept header:

```php
Router::run(function() {
    Router::get('/api/data', function() {
        throw HttpException::notFound('Data not found');
        // Returns: {"error": "Data not found"} with 404 status
    });
});
```
