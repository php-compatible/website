---
sidebar_position: 1
sidebar_label: Overview
---

# File-Based Routing

File-based routing lets you add modern routing capabilities to existing PHP file structures without restructuring your project. Each PHP file handles its own routes based on its location in the filesystem.

## When to Use File-Based Routing

- **Legacy Projects** - Adding routing to existing PHP sites
- **Gradual Migration** - Incrementally modernizing a codebase
- **Simple APIs** - Quick API endpoints in existing projects
- **Shared Hosting** - Environments where you can't control the web server

## How It Works

The `file_router()` function automatically calculates the URL path based on the file's location relative to `DOCUMENT_ROOT`. You define routes relative to that path.

```
/wwwroot/
├── index.php          → matches /
├── api/
│   ├── users.php      → matches /api/users
│   └── posts.php      → matches /api/posts
└── admin/
    └── index.php      → matches /admin/
```

## Basic Usage

**File: `/wwwroot/api/users.php`**

```php
<?php
require_once __DIR__ . '/../../vendor/autoload.php';

file_router(function() {
    // GET /api/users
    route(method(GET), url_path('/'), function() {
        echo json_response(HTTP_OK, array(
            'users' => array(
                array('id' => 1, 'name' => 'Alice'),
                array('id' => 2, 'name' => 'Bob'),
            )
        ));
    });

    // POST /api/users
    route(method(POST), url_path('/'), function() {
        $data = json_body();
        echo json_response(HTTP_CREATED, array('user' => $data));
    });
});
```

## Directory Index Files

Files named `index.php` or `default.php` match their parent directory:

**File: `/wwwroot/admin/index.php`**

```php
<?php
require_once __DIR__ . '/../../vendor/autoload.php';

file_router(function() {
    // GET /admin/ (matches the directory, not /admin/index)
    route(method(GET), url_path('/'), function() {
        echo html_response(HTTP_OK, '<h1>Admin Dashboard</h1>');
    });
});
```

## Topics

- [Getting Started](/docs/router/file-based-routing/getting-started) - Installation and server configuration
- [HTTP Methods](/docs/router/file-based-routing/http-methods) - Match GET, POST, PUT, DELETE, etc.
- [URL Matching](/docs/router/file-based-routing/url-matching) - Static paths and parameters
- [Route Groups](/docs/router/file-based-routing/route-groups) - Organize routes with prefixes
- [Request Handling](/docs/router/file-based-routing/request-handling) - JSON, forms, files, headers
- [Response Helpers](/docs/router/file-based-routing/response-helpers) - JSON, HTML, downloads
- [Error Handling](/docs/router/file-based-routing/error-handling) - Exceptions and error responses
- [Middleware](/docs/router/file-based-routing/middleware) - Authentication, logging, etc.
- [Controllers](/docs/router/file-based-routing/controllers) - Closures, classes, and invokables
- [Server Configuration](/docs/router/file-based-routing/server-config) - Detailed server setup
- [PSR-7 Style](/docs/router/file-based-routing/psr7-style) - Request/Response objects
- [Static Files](/docs/router/file-based-routing/static-files) - Serving static assets
