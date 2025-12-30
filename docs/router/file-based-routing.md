---
sidebar_position: 4
sidebar_label: File-Based Routing
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

### Simple API Endpoint

**File: `/wwwroot/api/users.php`**

```php
<?php
require_once __DIR__ . '/../../vendor/autoload.php';

file_router(function() {
    // GET /api/users
    route(method(GET), url_path('/'), function() {
        echo json_response(array(
            'users' => array(
                array('id' => 1, 'name' => 'Alice'),
                array('id' => 2, 'name' => 'Bob'),
            )
        ));
    });

    // POST /api/users
    route(method(POST), url_path('/'), function() {
        $data = json_body();
        echo json_response(array(
            'message' => 'User created',
            'user' => $data
        ));
    });
});
```

### With URL Parameters

**File: `/wwwroot/api/users.php`**

```php
<?php
require_once __DIR__ . '/../../vendor/autoload.php';

file_router(function() {
    // GET /api/users
    route(method(GET), url_path('/'), function() {
        echo json_response(array('users' => get_all_users()));
    });

    // GET /api/users/123
    route(method(GET), url_path_params('/:id'), function() {
        $id = $_GET[':id'];
        echo json_response(array('user' => get_user($id)));
    });

    // PUT /api/users/123
    route(method(PUT), url_path_params('/:id'), function() {
        $id = $_GET[':id'];
        $data = json_body();
        echo json_response(array('user' => update_user($id, $data)));
    });

    // DELETE /api/users/123
    route(method(DELETE), url_path_params('/:id'), function() {
        $id = $_GET[':id'];
        delete_user($id);
        echo json_response(array('message' => 'User deleted'));
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
    // GET /admin/ (note: matches the directory, not /admin/index)
    route(method(GET), url_path('/'), function() {
        echo html_response('<h1>Admin Dashboard</h1>');
    });
});
```

## Web Server Configuration

For file-based routing, configure your web server to:
1. Serve existing PHP files directly
2. Pass the URL as a query parameter

### Apache (.htaccess)

```apache
RewriteEngine On

# If file exists, serve it with url parameter
RewriteCond %{REQUEST_FILENAME} -f
RewriteCond %{REQUEST_FILENAME} \.php$
RewriteRule ^(.*)$ $1?url=$1 [QSA,L]

# If directory has index.php, use it
RewriteCond %{REQUEST_FILENAME} -d
RewriteCond %{REQUEST_FILENAME}/index.php -f
RewriteRule ^(.*)/?$ $1/index.php?url=$1 [QSA,L]
```

### PHP Built-in Server

Create a `router.php` for development:

```php
<?php
// router.php
if (php_sapi_name() === 'cli-server') {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    // Check for PHP file
    if (preg_match('/\.php$/', $path) && file_exists(__DIR__ . $path)) {
        $_GET['url'] = ltrim($path, '/');
        $_GET['url'] = preg_replace('/\.php$/', '', $_GET['url']);
        return false; // Let PHP serve the file
    }

    // Check for directory with index.php
    $indexPath = __DIR__ . $path . '/index.php';
    if (is_dir(__DIR__ . $path) && file_exists($indexPath)) {
        $_GET['url'] = trim($path, '/');
        include $indexPath;
        return true;
    }

    // Try to find matching PHP file
    $phpPath = __DIR__ . $path . '.php';
    if (file_exists($phpPath)) {
        $_GET['url'] = ltrim($path, '/');
        include $phpPath;
        return true;
    }
}

http_response_code(404);
echo 'Not Found';
```

Run with:

```bash
php -S localhost:8080 router.php
```

## Error Handling

`file_router()` automatically handles errors and returns appropriate responses:

```php
file_router(function() {
    route(method(GET), url_path('/'), function() {
        // Throw HTTP exceptions
        if (!$user) {
            throw HttpException::NotFound('User not found');
        }

        // Or throw regular exceptions (becomes 500)
        throw new Exception('Something went wrong');
    });
});
```

Errors are returned as JSON if the client accepts `application/json`, otherwise as plain text.

## Combining with Route Groups

You can use `routerGroup()` inside `file_router()` for sub-paths:

**File: `/wwwroot/api/v1.php`**

```php
<?php
require_once __DIR__ . '/../../vendor/autoload.php';

file_router(function() {
    // Routes for /api/v1/...

    routerGroup('/users', function() {
        // GET /api/v1/users
        route(method(GET), url_path('/'), function() {
            echo json_response(array('users' => array()));
        });

        // GET /api/v1/users/123
        route(method(GET), url_path_params('/:id'), function() {
            echo json_response(array('user' => $_GET[':id']));
        });
    });

    routerGroup('/posts', function() {
        // GET /api/v1/posts
        route(method(GET), url_path('/'), function() {
            echo json_response(array('posts' => array()));
        });
    });
});
```

## Best Practices

1. **Keep files focused** - Each PHP file should handle one resource
2. **Use consistent structure** - Follow REST conventions for API endpoints
3. **Handle errors gracefully** - Use `HttpException` for client errors
4. **Validate input** - Always validate `json_body()` and `$_GET` parameters
5. **Set content types** - Use `json_response()`, `html_response()`, etc.
