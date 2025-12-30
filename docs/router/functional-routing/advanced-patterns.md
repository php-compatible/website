---
sidebar_position: 10
sidebar_label: Advanced Patterns
---

# Advanced Patterns

## Conditional Routes

```php
router(function() {
    // Only register admin routes in development
    if (getenv('APP_ENV') === 'development') {
        route(method(GET), url_path('/debug'), function() {
            echo json_response(HTTP_OK, $_SERVER);
        });
    }

    // Feature flag
    if (feature_enabled('new_api')) {
        routerGroup('/api/v2', function() {
            // New API routes
        });
    }
});
```

## Subsite Installation

When installed in a subdirectory, use `set_root_url()`:

```php
set_root_url('/myapp');

router(function() {
    route(method(GET), url_path('/'), function() {
        // Matches /myapp/
        $loginUrl = root_url('/login');  // /myapp/login
        echo html_response(HTTP_OK, '<a href="' . $loginUrl . '">Login</a>');
    });
});
```

## Complete Example

```php
<?php
// public/index.php
require_once __DIR__ . '/../vendor/autoload.php';

router(function() {
    // API routes
    routerGroup('/api', function() {
        // List users
        route(method(GET), url_path('/users'), function() {
            echo json_response(HTTP_OK, array(
                'users' => array(
                    array('id' => 1, 'name' => 'Alice'),
                    array('id' => 2, 'name' => 'Bob'),
                )
            ));
        });

        // Get single user
        route(method(GET), url_path_params('/users/:id'), function() {
            $id = $_GET[':id'];
            echo json_response(HTTP_OK, array('user' => array('id' => $id)));
        });

        // Create user
        route(method(POST), url_path('/users'), function() {
            $data = json_body();
            echo json_response(HTTP_CREATED, array('created' => $data));
        });

        // Update user
        route(method(PUT), url_path_params('/users/:id'), function() {
            $id = $_GET[':id'];
            $data = json_body();
            echo json_response(HTTP_OK, array('updated' => $id, 'data' => $data));
        });

        // Delete user
        route(method(DELETE), url_path_params('/users/:id'), function() {
            $id = $_GET[':id'];
            echo json_response(HTTP_NO_CONTENT, null);
        });
    });

    // Web routes
    route(method(GET), url_path('/'), function() {
        echo html_response(HTTP_OK, '<!DOCTYPE html>
            <html>
            <head><title>Home</title></head>
            <body><h1>Welcome</h1></body>
            </html>');
    });
});
```
