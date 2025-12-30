---
sidebar_position: 4
sidebar_label: Route Groups
---

# Route Groups

Group routes with a common prefix using `routerGroup()`.

## Basic Grouping

```php
router(function() {
    routerGroup('/api', function() {
        route(method(GET), url_path('/users'), function() {
            // Matches /api/users
        });

        route(method(GET), url_path('/posts'), function() {
            // Matches /api/posts
        });
    });

    // Routes outside the group
    route(method(GET), url_path('/'), function() {
        // Matches /
    });
});
```

## Nested Groups

```php
router(function() {
    routerGroup('/api', function() {
        routerGroup('/v1', function() {
            route(method(GET), url_path('/users'), function() {
                // Matches /api/v1/users
            });

            route(method(GET), url_path('/posts'), function() {
                // Matches /api/v1/posts
            });
        });

        routerGroup('/v2', function() {
            route(method(GET), url_path('/users'), function() {
                // Matches /api/v2/users
            });
        });
    });
});
```

## API Versioning Example

```php
router(function() {
    routerGroup('/api/v1', function() {
        route(method(GET), url_path('/users'), 'V1\UsersController::index');
        route(method(POST), url_path('/users'), 'V1\UsersController::store');
    });

    routerGroup('/api/v2', function() {
        route(method(GET), url_path('/users'), 'V2\UsersController::index');
        route(method(POST), url_path('/users'), 'V2\UsersController::store');
    });
});
```
