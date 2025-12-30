---
sidebar_position: 1
sidebar_label: Overview
---

# Modern Routing

The `Router` class provides a clean, Laravel-style syntax for defining routes with automatic PSR-7 request injection. This approach is ideal for new projects or when centralizing routes in a single file.

## When to Use Modern Routing

- **New Projects** - Starting fresh with modern patterns
- **Route Files** - Centralizing routes in `routes/web.php` or `routes/api.php`
- **Cleaner Syntax** - Prefer `Router::get()` over `route(method(GET), url_path())`
- **Automatic Parameter Detection** - No need for separate `url_path_params()`
- **PSR-7 Request Injection** - Handlers receive a `ServerRequest` automatically

## Basic Usage

```php
<?php
require_once 'vendor/autoload.php';

use PhpCompatible\Router\Router;

Router::run(function() {
    Router::get('/', function() {
        return 'Home';
    });

    Router::get('/about', function() {
        return 'About';
    });

    // Automatic request injection when handler accepts a parameter
    Router::get('/api/users/:id', function($request) {
        $id = $request->getParam('id');
        return array('user_id' => $id);  // Auto-converted to JSON
    });
});
```

## Route Files Structure

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

## Topics

- [Getting Started](getting-started) - Installation and server configuration
- [HTTP Methods](http-methods) - GET, POST, PUT, DELETE, etc.
- [URL Matching](url-matching) - Static paths and parameters
- [Route Groups](route-groups) - Organize routes with prefixes
- [Request Handling](request-handling) - JSON, forms, files, headers
- [Response Helpers](response-helpers) - JSON, HTML, automatic conversion
- [Error Handling](error-handling) - Exceptions and error responses
- [Middleware](middleware) - Authentication, logging, etc.
- [Controllers](controllers) - Closures, classes, and invokables
- [Advanced Patterns](advanced-patterns) - Subsites, redirects, organization
- [PSR-7 Style](psr7-style) - Full Request/Response reference
- [Static Files](static-files) - Serving static assets
