---
sidebar_position: 10
sidebar_label: Advanced Patterns
---

# Advanced Patterns

## Subsite Installation

When deployed to a subdirectory:

```php
use PhpCompatible\Router\Router;

Router::setRoot('/myapp');

Router::run(function() {
    Router::get('/', function() {
        // Matches /myapp/
        return 'Home';
    });

    Router::get('/users', function() {
        // Matches /myapp/users
        return array('users' => array());
    });
});

// Build URLs with the root prefix
$url = Router::rootUrl('/users'); // Returns: /myapp/users
```

## Conditional Routes

```php
Router::run(function() {
    // Only register debug routes in development
    if (getenv('APP_ENV') === 'development') {
        Router::get('/debug', function() {
            return $_SERVER;
        });

        Router::get('/debug/routes', function() {
            return array('routes' => get_registered_routes());
        });
    }

    // Feature flag
    if (feature_enabled('new_api')) {
        Router::group('/api/v2', function() {
            Router::get('/users', NewUsersController::class);
        });
    }
});
```

## Organizing Large Applications

### Directory Structure

```
/app
├── public/
│   └── index.php           # Entry point
├── routes/
│   ├── web.php             # Web routes
│   ├── api.php             # API routes
│   └── admin.php           # Admin routes
├── controllers/
│   ├── Web/
│   │   └── HomeController.php
│   ├── Api/
│   │   └── UserController.php
│   └── Admin/
│       └── DashboardController.php
└── vendor/
```

### Entry Point

```php
<?php
// public/index.php
require_once __DIR__ . '/../vendor/autoload.php';

use PhpCompatible\Router\Router;

Router::run(function() {
    require __DIR__ . '/../routes/web.php';
    require __DIR__ . '/../routes/api.php';
    require __DIR__ . '/../routes/admin.php';
});
```

### Route Files

**routes/web.php:**
```php
<?php
use PhpCompatible\Router\Router;

Router::get('/', 'Web\HomeController');
Router::get('/about', 'Web\AboutController');
Router::get('/contact', 'Web\ContactController');
Router::post('/contact', 'Web\ContactController');
```

**routes/api.php:**
```php
<?php
use PhpCompatible\Router\Router;

Router::group('/api', function() {
    Router::get('/users', 'Api\UserController::index');
    Router::post('/users', 'Api\UserController::store');
    Router::get('/users/:id', 'Api\UserController::show');
    Router::put('/users/:id', 'Api\UserController::update');
    Router::delete('/users/:id', 'Api\UserController::destroy');
});
```

**routes/admin.php:**
```php
<?php
use PhpCompatible\Router\Router;

Router::group('/admin', function() {
    // Admin auth check
    $token = request_header('Authorization');
    if (!is_admin($token)) {
        throw HttpException::forbidden('Admin access required');
    }

    Router::get('/dashboard', 'Admin\DashboardController');
    Router::get('/users', 'Admin\UsersController');
});
```

## Static Helper Methods

```php
use PhpCompatible\Router\Router;

// Run the router
Router::run($routes);

// Set root URL for subsites
Router::setRoot('/subsite');

// Get URL with root prefix
$url = Router::rootUrl('/path');

// Redirect
Router::redirect('/new-location');
```

## Complete Example

```php
<?php
require_once 'vendor/autoload.php';

use PhpCompatible\Router\Router;
use PhpCompatible\Router\JsonResponse;
use PhpCompatible\Router\HttpException;

Router::run(function() {
    // API routes
    Router::group('/api', function() {
        Router::get('/users', function() {
            return array('users' => get_all_users());
        });

        Router::get('/users/:id', function($request) {
            $id = $request->getParam('id');
            $user = find_user($id);

            if (!$user) {
                throw HttpException::notFound('User not found');
            }

            return array('user' => $user);
        });

        Router::post('/users', function() {
            $data = json_body();

            if (empty($data['email'])) {
                return JsonResponse::response(HTTP_BAD_REQUEST, array('error' => 'Email required'));
            }

            $user = create_user($data);
            return JsonResponse::response(HTTP_CREATED, array('user' => $user));
        });

        Router::delete('/users/:id', function() {
            delete_user($_GET[':id']);
            return JsonResponse::response(HTTP_NO_CONTENT);
        });
    });

    // Web routes
    Router::get('/', function() {
        return '<h1>Welcome</h1>';
    });
});
```
