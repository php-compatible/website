---
sidebar_position: 4
sidebar_label: Route Groups
---

# Route Groups

Organize routes with common prefixes using `Router::group()`.

## Basic Grouping

```php
use PhpCompatible\Router\Router;

Router::run(function() {
    Router::group('/api', function() {
        Router::get('/users', function() {
            // Matches /api/users
            return array('users' => array());
        });

        Router::get('/posts', function() {
            // Matches /api/posts
            return array('posts' => array());
        });
    });
});
```

## Nested Groups

```php
Router::run(function() {
    Router::group('/api', function() {
        Router::group('/v1', function() {
            Router::get('/users', function() {
                // Matches /api/v1/users
                return array('version' => 1, 'users' => array());
            });
        });

        Router::group('/v2', function() {
            Router::get('/users', function() {
                // Matches /api/v2/users
                return array('version' => 2, 'users' => array());
            });
        });
    });
});
```

## API Versioning

```php
Router::run(function() {
    Router::group('/api/v1', function() {
        Router::get('/users', ListUsersV1::class);
        Router::post('/users', CreateUserV1::class);
        Router::get('/users/:id', ShowUserV1::class);
    });

    Router::group('/api/v2', function() {
        Router::get('/users', ListUsersV2::class);
        Router::post('/users', CreateUserV2::class);
        Router::get('/users/:id', ShowUserV2::class);
    });
});
```

## Organizing Route Files

**routes/api.php:**

```php
<?php
use PhpCompatible\Router\Router;

Router::group('/api', function() {
    Router::get('/users', ListUsers::class);
    Router::post('/users', CreateUser::class);
    Router::get('/users/:id', ShowUser::class);
    Router::put('/users/:id', UpdateUser::class);
    Router::delete('/users/:id', DeleteUser::class);
});
```

**routes/web.php:**

```php
<?php
use PhpCompatible\Router\Router;

Router::get('/', function() {
    return file_get_contents(__DIR__ . '/../views/home.html');
});

Router::get('/about', function() {
    return file_get_contents(__DIR__ . '/../views/about.html');
});
```
