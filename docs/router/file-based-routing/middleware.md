---
sidebar_position: 8
sidebar_label: Middleware
---

# Middleware

Apply cross-cutting concerns to file-based routes.

## Inline Authentication Check

```php
file_router(function() {
    // Check auth for all routes in this file
    $auth = request_header('Authorization');
    if (empty($auth)) {
        echo json_response(HTTP_UNAUTHORIZED, array('error' => 'Unauthorized'));
        stop();
    }

    // Protected routes
    route(method(GET), url_path('/'), function() {
        echo json_response(HTTP_OK, array('users' => get_all_users()));
    });

    route(method(POST), url_path('/'), function() {
        $data = json_body();
        echo json_response(HTTP_CREATED, array('user' => create_user($data)));
    });
});
```

## Role-Based Access

```php
file_router(function() {
    // Verify admin role
    $token = request_header('Authorization');
    $user = verify_token($token);

    if (!$user || $user['role'] !== 'admin') {
        echo json_response(HTTP_FORBIDDEN, array('error' => 'Admin access required'));
        stop();
    }

    // Admin-only routes
    route(method(GET), url_path('/users'), function() {
        echo json_response(HTTP_OK, array('users' => get_all_users()));
    });

    route(method(DELETE), url_path_params('/users/:id'), function() {
        delete_user($_GET[':id']);
        echo json_response(HTTP_NO_CONTENT, null);
    });
});
```

## Request Logging

```php
file_router(function() {
    // Log all requests to this file
    error_log(sprintf(
        '[%s] %s %s',
        date('Y-m-d H:i:s'),
        $_SERVER['REQUEST_METHOD'],
        $_SERVER['REQUEST_URI']
    ));

    route(method(GET), url_path('/'), function() {
        echo json_response(HTTP_OK, array('data' => 'logged'));
    });
});
```

## Using the Middleware Function

Define reusable middleware functions:

```php
function require_auth() {
    $token = request_header('Authorization');
    if (empty($token)) {
        throw HttpException::unauthorized();
    }
    return verify_token($token);
}

function require_json() {
    if (!accept(JSON_CONTENT)) {
        throw HttpException::notAcceptable('JSON required');
    }
}

file_router(function() {
    route(method(GET), url_path('/profile'), function() {
        middleware(
            'require_auth',
            'require_json',
            function() {
                $user = require_auth(); // Get user from middleware
                echo json_response(HTTP_OK, array('user' => $user));
            }
        )();
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

    set_cache($key, $requests + 1, 60); // 100 requests per minute
}

file_router(function() {
    check_rate_limit();

    route(method(GET), url_path('/'), function() {
        echo json_response(HTTP_OK, array('data' => 'rate limited'));
    });
});
```

## CORS Headers

```php
file_router(function() {
    // Set CORS headers for all routes
    response_header('Access-Control-Allow-Origin', '*');
    response_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response_header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (method(OPTIONS)) {
        http_response_code(HTTP_NO_CONTENT);
        stop();
    }

    route(method(GET), url_path('/'), function() {
        echo json_response(HTTP_OK, array('cors' => 'enabled'));
    });
});
```
