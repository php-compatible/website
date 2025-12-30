---
sidebar_position: 1
sidebar_label: Overview
---

# Functional Routing

Functional routing gives you complete control over the routing process using simple PHP functions. This is the core routing approach - all other styles (file-based, Router class) are built on top of these functions.

## When to Use Functional Routing

- **Full Control** - You want direct access to all routing primitives
- **Custom Logic** - Need conditional routing based on complex criteria
- **Centralized Routes** - All routes in a single `index.php` or `routes/web.php`
- **Familiar Style** - Similar to frameworks like Slim or raw PHP routing
- **Minimal Overhead** - No class autoloading, just functions

## Basic Usage

### Single Entry Point (index.php)

```php
<?php
require_once 'vendor/autoload.php';

router(function() {
    route(method(GET), url_path('/'), function() {
        echo html_response(HTTP_OK, '<h1>Home</h1>');
    });

    route(method(GET), url_path('/about'), function() {
        echo html_response(HTTP_OK, '<h1>About Us</h1>');
    });

    route(method(GET), url_path('/contact'), function() {
        echo html_response(HTTP_OK, '<h1>Contact</h1>');
    });
});
```

### Route Files Structure

For larger applications, organize routes in separate files:

```
/app
├── public/
│   └── index.php       # Entry point
├── routes/
│   ├── web.php         # Web routes
│   └── api.php         # API routes
└── vendor/
```

**public/index.php:**
```php
<?php
require_once __DIR__ . '/../vendor/autoload.php';

router(function() {
    require __DIR__ . '/../routes/web.php';
    require __DIR__ . '/../routes/api.php';
});
```

**routes/web.php:**
```php
<?php
route(method(GET), url_path('/'), function() {
    echo html_response(HTTP_OK, '<h1>Welcome</h1>');
});

route(method(GET), url_path('/about'), function() {
    echo html_response(HTTP_OK, '<h1>About</h1>');
});
```

**routes/api.php:**
```php
<?php
routerGroup('/api', function() {
    route(method(GET), url_path('/users'), function() {
        echo json_response(HTTP_OK, array('users' => array()));
    });

    route(method(POST), url_path('/users'), function() {
        $data = json_body();
        echo json_response(HTTP_CREATED, array('created' => $data));
    });
});
```

## Topics

- [HTTP Methods](./http-methods) - Match GET, POST, PUT, DELETE, etc.
- [URL Matching](./url-matching) - Static paths, wildcards, and parameters
- [Route Groups](./route-groups) - Organize routes with prefixes
- [Request Handling](./request-handling) - JSON, forms, files, headers
- [Response Helpers](./response-helpers) - JSON, HTML, downloads
- [Error Handling](./error-handling) - Exceptions and error responses
- [Middleware](./middleware) - Authentication, logging, etc.
- [Controllers](./controllers) - Closures, classes, and invokables
- [Advanced Patterns](./advanced-patterns) - Conditionals, priority, subsites
