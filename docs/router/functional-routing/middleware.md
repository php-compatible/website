---
sidebar_position: 8
sidebar_label: Middleware
---

# Middleware

Apply cross-cutting concerns before routes.

## Inline Middleware Pattern

```php
router(function() {
    // Authentication check for all /admin routes
    if (strpos($_GET['url'], 'admin') === 0) {
        $auth = request_header('Authorization');
        if (empty($auth)) {
            echo json_response(HTTP_UNAUTHORIZED, array('error' => 'Unauthorized'));
            stop();
        }
    }

    routerGroup('/admin', function() {
        route(method(GET), url_path('/dashboard'), function() {
            echo json_response(HTTP_OK, array('admin' => 'dashboard'));
        });

        route(method(GET), url_path('/users'), function() {
            echo json_response(HTTP_OK, array('admin' => 'users'));
        });
    });

    // Public routes
    route(method(GET), url_path('/'), function() {
        echo html_response(HTTP_OK, '<h1>Public Home</h1>');
    });
});
```

## Using the Middleware Function

Define reusable middleware functions:

```php
function auth_check() {
    $token = request_header('Authorization');
    if (empty($token)) {
        throw HttpException::unauthorized();
    }
}

function log_request() {
    error_log($_SERVER['REQUEST_METHOD'] . ' ' . $_SERVER['REQUEST_URI']);
}
```

Apply middleware to routes:

```php
router(function() {
    route(method(GET), url_path('/api/protected'), function() {
        middleware(
            'auth_check',
            'log_request',
            function() {
                echo json_response(HTTP_OK, array('secret' => 'data'));
            }
        )();
    });
});
```

## Redirects

```php
route(method(GET), url_path('/old-page'), function() {
    redirect('/new-page');
});

route(method(POST), url_path('/login'), function() {
    // Process login...
    redirect('/dashboard');
});
```
