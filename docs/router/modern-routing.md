---
sidebar_position: 5
sidebar_label: Modern Routing
---

# Modern Routing

The `Router` class provides a clean, Laravel-style syntax for defining routes. This approach is ideal for new projects or when centralizing routes in a single file.

## When to Use Modern Routing

- **New Projects** - Starting fresh with modern patterns
- **Route Files** - Centralizing routes in `routes/web.php` or `routes/api.php`
- **Cleaner Syntax** - Prefer `Router::get()` over `route(method(GET), url_path())`
- **Automatic Parameter Detection** - No need for separate `url_path_params()`

## Basic Usage

```php
<?php
require_once 'vendor/autoload.php';

use PhpCompatible\Router\Router;

Router::run(function() {
    Router::get('/', function() {
        echo 'Home';
    });

    Router::get('/about', function() {
        echo 'About';
    });
});
```

## HTTP Methods

All standard HTTP methods are supported:

```php
Router::get('/users', function() { /* ... */ });
Router::post('/users', function() { /* ... */ });
Router::put('/users/:id', function() { /* ... */ });
Router::patch('/users/:id', function() { /* ... */ });
Router::delete('/users/:id', function() { /* ... */ });
Router::head('/users', function() { /* ... */ });
Router::options('/users', function() { /* ... */ });
```

### Match Any Method

```php
Router::any('/webhook', function() {
    // Handles GET, POST, PUT, DELETE, etc.
});
```

### Match Multiple Methods

```php
Router::match(array(GET, POST), '/form', function() {
    // Handles both GET and POST
});
```

## Route Parameters

Parameters are automatically detected when the path contains `:param` placeholders:

```php
Router::get('/users/:id', function() {
    $id = $_GET[':id'];
    echo "User ID: $id";
});

Router::get('/posts/:postId/comments/:commentId', function() {
    $postId = $_GET[':postId'];
    $commentId = $_GET[':commentId'];
    echo "Post $postId, Comment $commentId";
});
```

With PSR-7 style request object:

```php
Router::get('/users/:id', function($request) {
    $id = $request->getParam('id'); // Without the colon
    return array('user_id' => $id);
});
```

## Route Groups

Organize routes with common prefixes:

```php
Router::run(function() {
    Router::group('/api', function() {
        // All routes here are prefixed with /api

        Router::get('/users', function() {
            // Matches /api/users
        });

        Router::get('/posts', function() {
            // Matches /api/posts
        });
    });
});
```

### Nested Groups

```php
Router::run(function() {
    Router::group('/api', function() {
        Router::group('/v1', function() {
            Router::get('/users', function() {
                // Matches /api/v1/users
            });
        });

        Router::group('/v2', function() {
            Router::get('/users', function() {
                // Matches /api/v2/users
            });
        });
    });
});
```

## Returning Responses

Routes can return values that are automatically handled:

### Return Arrays (Auto-converted to JSON)

```php
Router::get('/api/users', function() {
    return array(
        'users' => array(
            array('id' => 1, 'name' => 'Alice'),
            array('id' => 2, 'name' => 'Bob'),
        )
    );
});
// Output: {"users":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]}
```

### Return Strings

```php
Router::get('/hello', function() {
    return 'Hello World';
});
```

### Return JsonResponse Objects

```php
use PhpCompatible\Router\JsonResponse;

Router::get('/api/users', function() {
    return JsonResponse::ok(array('users' => array()));
});

Router::get('/api/users/:id', function($request) {
    $id = $request->getParam('id');
    if (!$id) {
        return JsonResponse::badRequest(array('error' => 'Invalid ID'));
    }
    return JsonResponse::ok(array('user' => get_user($id)));
});
```

## Single Action Controllers

Use invokable classes as route handlers:

```php
class ShowUser
{
    public function __invoke($request)
    {
        $id = $request->getParam('id');
        return array('user' => get_user($id));
    }
}

Router::get('/users/:id', ShowUser::class);
```

### Controller with Dependencies

```php
class CreateUser
{
    private $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function __invoke($request)
    {
        $data = $request->getParsedBody();
        $user = $this->db->insert('users', $data);
        return JsonResponse::created(array('user' => $user));
    }
}

Router::post('/users', CreateUser::class);
```

## Organizing Routes

### Route Files Structure

```
/app
├── routes/
│   ├── web.php      # Web routes
│   └── api.php      # API routes
├── controllers/
│   └── UserController.php
└── public/
    └── index.php    # Entry point
```

### Entry Point (public/index.php)

```php
<?php
require_once __DIR__ . '/../vendor/autoload.php';

use PhpCompatible\Router\Router;

// Load route files
Router::run(function() {
    require __DIR__ . '/../routes/web.php';
    require __DIR__ . '/../routes/api.php';
});
```

### Web Routes (routes/web.php)

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

### API Routes (routes/api.php)

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

## Redirects

```php
Router::get('/old-path', function() {
    Router::redirect('/new-path');
});

// Or using the function directly
Router::get('/legacy', function() {
    redirect('/modern');
});
```

## Root URL for Subsites

When deployed to a subdirectory:

```php
Router::setRoot('/myapp');

Router::run(function() {
    Router::get('/', function() {
        // Matches /myapp/
    });

    Router::get('/users', function() {
        // Matches /myapp/users
    });
});

// Build URLs with the root prefix
$url = Router::rootUrl('/users'); // Returns: /myapp/users
```

## Static Helper Methods

The `Router` class provides static wrappers for common operations:

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
