---
sidebar_position: 4
sidebar_label: Route Groups
---

# Route Groups

Use `routerGroup()` inside `file_router()` to organize sub-paths within a file.

## Basic Grouping

**File: `/wwwroot/api/v1.php`** (base: `/api/v1`)

```php
<?php
require_once __DIR__ . '/../../vendor/autoload.php';

file_router(function() {
    routerGroup('/users', function() {
        // GET /api/v1/users
        route(method(GET), url_path('/'), function() {
            echo json_response(HTTP_OK, array('users' => array()));
        });

        // GET /api/v1/users/123
        route(method(GET), url_path_params('/:id'), function() {
            echo json_response(HTTP_OK, array('user' => $_GET[':id']));
        });
    });

    routerGroup('/posts', function() {
        // GET /api/v1/posts
        route(method(GET), url_path('/'), function() {
            echo json_response(HTTP_OK, array('posts' => array()));
        });
    });
});
```

## Nested Groups

```php
file_router(function() {
    routerGroup('/admin', function() {
        routerGroup('/users', function() {
            // /api/v1/admin/users
            route(method(GET), url_path('/'), function() {
                echo json_response(HTTP_OK, array('admin_users' => array()));
            });
        });

        routerGroup('/settings', function() {
            // /api/v1/admin/settings
            route(method(GET), url_path('/'), function() {
                echo json_response(HTTP_OK, array('settings' => array()));
            });
        });
    });
});
```

## Combining Multiple Resources

**File: `/wwwroot/api/admin.php`**

```php
<?php
require_once __DIR__ . '/../../vendor/autoload.php';

file_router(function() {
    // /api/admin/dashboard
    route(method(GET), url_path('/dashboard'), function() {
        echo json_response(HTTP_OK, array('stats' => get_dashboard_stats()));
    });

    // /api/admin/users/*
    routerGroup('/users', function() {
        route(method(GET), url_path('/'), 'list_admin_users');
        route(method(POST), url_path('/'), 'create_admin_user');
        route(method(DELETE), url_path_params('/:id'), 'delete_admin_user');
    });

    // /api/admin/logs/*
    routerGroup('/logs', function() {
        route(method(GET), url_path('/'), 'list_logs');
        route(method(GET), url_path('/errors'), 'list_error_logs');
    });
});
```
