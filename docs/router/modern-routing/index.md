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

- [Getting Started](/docs/router/modern-routing/getting-started) - Installation and server configuration
- [HTTP Methods](/docs/router/modern-routing/http-methods) - GET, POST, PUT, DELETE, etc.
- [URL Matching](/docs/router/modern-routing/url-matching) - Static paths and parameters
- [Route Groups](/docs/router/modern-routing/route-groups) - Organize routes with prefixes
- [Request Handling](/docs/router/modern-routing/request-handling) - JSON, forms, files, headers
- [Response Helpers](/docs/router/modern-routing/response-helpers) - JSON, HTML, automatic conversion
- [Error Handling](/docs/router/modern-routing/error-handling) - Exceptions and error responses
- [Middleware](/docs/router/modern-routing/middleware) - Authentication, logging, etc.
- [Controllers](/docs/router/modern-routing/controllers) - Closures, classes, and invokables
- [Advanced Patterns](/docs/router/modern-routing/advanced-patterns) - Subsites, redirects, organization
- [PSR-7 Style](/docs/router/modern-routing/psr7-style) - Full Request/Response reference
- [Static Files](/docs/router/modern-routing/static-files) - Serving static assets
