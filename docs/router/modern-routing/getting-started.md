---
sidebar_position: 1
sidebar_label: Getting Started
---

# Getting Started with Modern Routing

Modern routing uses the `Router` class for clean, Laravel-style syntax with automatic PSR-7 request injection. This is ideal for new projects or when you want the most readable, testable route definitions.

## Installation

```bash
composer require php-compatible/router
```

## Server Configuration

### Apache (.htaccess)

Create a `.htaccess` file in your web root:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]
```

### Nginx

```nginx
location / {
    try_files $uri $uri/ /index.php?url=$uri&$args;
}
```

### PHP Built-in Server

Create a `router.php` file:

```php
<?php
if (php_sapi_name() === 'cli-server') {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if ($path !== '/' && file_exists(__DIR__ . $path)) {
        return false;
    }
}

$url = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/';
$_GET['url'] = ltrim(strtok($url, '?'), '/');

require_once __DIR__ . '/index.php';
```

Run with:

```bash
php -S localhost:8080 router.php
```

## Your First Routes

Create `index.php`:

```php
<?php
require_once 'vendor/autoload.php';

use PhpCompatible\Router\Router;
use PhpCompatible\Router\JsonResponse;

Router::run(function() {
    // Home page
    Router::get('/', function() {
        return '<h1>Welcome</h1>';
    });

    // API - returns array auto-converted to JSON
    Router::get('/api/users', function() {
        return array(
            'users' => array(
                array('id' => 1, 'name' => 'Alice'),
                array('id' => 2, 'name' => 'Bob'),
            )
        );
    });

    // URL parameters - use $request parameter for automatic injection
    Router::get('/api/users/:id', function($request) {
        $id = $request->getParam('id');
        return array('user_id' => $id);
    });

    // POST with JSON body
    Router::post('/api/users', function($request) {
        $data = $request->getParsedBody();
        return JsonResponse::created(array('user' => $data));
    });
});
```

## Key Features

### Automatic Request Injection

When your handler accepts a parameter, a `ServerRequest` is automatically injected:

```php
Router::get('/users/:id', function($request) {
    $id = $request->getParam('id');           // Route parameter
    $page = $request->getQueryParam('page');  // Query string
    $isAjax = $request->isAjax();             // Request info

    return array('user_id' => $id);
});
```

### Auto JSON Conversion

Return an array and it's automatically converted to JSON:

```php
Router::get('/api/data', function() {
    return array('message' => 'Hello');
});
// Output: {"message":"Hello"}
```

### Automatic Parameter Detection

No need for `url_path_params()` — parameters are detected automatically:

```php
Router::get('/users/:id/posts/:postId', function($request) {
    $userId = $request->getParam('id');
    $postId = $request->getParam('postId');
    return array('user' => $userId, 'post' => $postId);
});
```

### Clean Syntax

```php
// Modern style
Router::get('/users', $handler);
Router::post('/users', $handler);
Router::put('/users/:id', $handler);
Router::delete('/users/:id', $handler);

// vs Functional style
route(method(GET), url_path('/users'), $handler);
route(method(POST), url_path('/users'), $handler);
```

:::tip Legacy Function Access
While modern routing uses PSR-7 request injection, you can still access route parameters via `$_GET[':id']` and use helper functions like `json_body()` if needed. However, using the `$request` object is recommended for better testability.
:::

## Project Structure

```
/myapp
├── public/
│   └── index.php       # Entry point
├── routes/
│   ├── web.php         # Web routes
│   └── api.php         # API routes
├── controllers/
│   └── UserController.php
└── vendor/
```

**public/index.php:**
```php
<?php
require_once __DIR__ . '/../vendor/autoload.php';

use PhpCompatible\Router\Router;

Router::run(function() {
    require __DIR__ . '/../routes/web.php';
    require __DIR__ . '/../routes/api.php';
});
```

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

## Next Steps

- [HTTP Methods](./http-methods) — GET, POST, PUT, DELETE, etc.
- [Route Groups](./route-groups) — Organize routes with prefixes
- [Controllers](./controllers) — Single Action Controllers
- [PSR-7 Style](./psr7-style) — Full Request/Response reference
