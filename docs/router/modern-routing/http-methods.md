---
sidebar_position: 2
sidebar_label: HTTP Methods
---

# HTTP Methods

The `Router` class provides static methods for each HTTP verb.

## Basic Method Matching

```php
use PhpCompatible\Router\Router;

Router::run(function() {
    Router::get('/users', function() { /* ... */ });
    Router::post('/users', function() { /* ... */ });
    Router::put('/users/:id', function() { /* ... */ });
    Router::patch('/users/:id', function() { /* ... */ });
    Router::delete('/users/:id', function() { /* ... */ });
    Router::head('/users', function() { /* ... */ });
    Router::options('/users', function() { /* ... */ });
});
```

## Match Any Method

```php
Router::any('/webhook', function() {
    // Handles GET, POST, PUT, DELETE, etc.
    $method = $_SERVER['REQUEST_METHOD'];
    return array('method' => $method);
});
```

## Match Multiple Methods

```php
Router::match(array(GET, POST), '/form', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        return '<form method="POST">...</form>';
    } else {
        $data = json_body();
        return array('submitted' => $data);
    }
});
```

## RESTful Resource Example

```php
use PhpCompatible\Router\Router;

Router::run(function() {
    Router::group('/api', function() {
        // GET /api/users - List all
        Router::get('/users', function() {
            return array('users' => get_all_users());
        });

        // GET /api/users/123 - Get one
        Router::get('/users/:id', function() {
            $user = get_user($_GET[':id']);
            return array('user' => $user);
        });

        // POST /api/users - Create
        Router::post('/users', function() {
            $data = json_body();
            $user = create_user($data);
            return JsonResponse::created(array('user' => $user));
        });

        // PUT /api/users/123 - Update
        Router::put('/users/:id', function() {
            $data = json_body();
            $user = update_user($_GET[':id'], $data);
            return array('user' => $user);
        });

        // DELETE /api/users/123 - Delete
        Router::delete('/users/:id', function() {
            delete_user($_GET[':id']);
            return JsonResponse::noContent();
        });
    });
});
```
