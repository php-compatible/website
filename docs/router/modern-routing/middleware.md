---
sidebar_position: 8
sidebar_label: Middleware
---

# Middleware

Apply cross-cutting concerns to modern routes.

## Inline Authentication

```php
use PhpCompatible\Router\Router;
use PhpCompatible\Router\JsonResponse;

Router::run(function() {
    Router::group('/api', function() {
        // Check auth for all /api routes
        $auth = request_header('Authorization');
        if (empty($auth)) {
            echo json_response(HTTP_UNAUTHORIZED, array('error' => 'Unauthorized'));
            stop();
        }

        Router::get('/users', function() {
            return array('users' => get_all_users());
        });

        Router::get('/profile', function() {
            return array('user' => get_current_user());
        });
    });

    // Public routes
    Router::get('/', function() {
        return 'Welcome';
    });
});
```

## Role-Based Access

```php
Router::run(function() {
    Router::group('/admin', function() {
        // Verify admin role
        $token = request_header('Authorization');
        $user = verify_token($token);

        if (!$user || $user['role'] !== 'admin') {
            return JsonResponse::forbidden(array('error' => 'Admin access required'));
        }

        Router::get('/dashboard', function() {
            return array('stats' => get_admin_stats());
        });

        Router::delete('/users/:id', function() {
            delete_user($_GET[':id']);
            return JsonResponse::noContent();
        });
    });
});
```

## Request Logging

```php
Router::run(function() {
    // Log all requests
    error_log(sprintf(
        '[%s] %s %s',
        date('Y-m-d H:i:s'),
        $_SERVER['REQUEST_METHOD'],
        $_SERVER['REQUEST_URI']
    ));

    Router::get('/users', function() {
        return array('users' => array());
    });
});
```

## Rate Limiting

```php
function check_rate_limit() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $key = "rate_limit:$ip";

    $requests = get_cache($key) ?: 0;
    if ($requests > 100) {
        throw HttpException::tooManyRequests('Rate limit exceeded');
    }

    set_cache($key, $requests + 1, 60);
}

Router::run(function() {
    Router::group('/api', function() {
        check_rate_limit();

        Router::get('/data', function() {
            return array('data' => 'rate limited');
        });
    });
});
```

## CORS Headers

```php
Router::run(function() {
    // Set CORS headers for all routes
    response_header('Access-Control-Allow-Origin', '*');
    response_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response_header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    Router::options('*', function() {
        http_response_code(HTTP_NO_CONTENT);
    });

    Router::get('/api/data', function() {
        return array('cors' => 'enabled');
    });
});
```

## Redirects

```php
Router::get('/old-path', function() {
    Router::redirect('/new-path');
});

Router::get('/legacy', function() {
    redirect('/modern');
});
```
