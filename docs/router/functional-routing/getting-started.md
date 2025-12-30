---
sidebar_position: 1
sidebar_label: Getting Started
---

# Getting Started with Functional Routing

Functional routing gives you complete control using simple PHP functions. This is ideal for centralized route definitions in a single entry point.

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

router(function() {
    // Home page
    route(method(GET), url_path('/'), function() {
        echo html_response(HTTP_OK, '<h1>Welcome</h1>');
    });

    // API endpoint
    route(method(GET), url_path('/api/users'), function() {
        echo json_response(HTTP_OK, array(
            'users' => array(
                array('id' => 1, 'name' => 'Alice'),
                array('id' => 2, 'name' => 'Bob'),
            )
        ));
    });

    // Create user
    route(method(POST), url_path('/api/users'), function() {
        $data = json_body();
        echo json_response(HTTP_CREATED, array('user' => $data));
    });
});
```

## Project Structure

```
/myapp
├── index.php           # Entry point with routes
├── .htaccess           # Apache rewrite rules
├── router.php          # PHP built-in server router
└── vendor/
    └── autoload.php
```

For larger applications, split routes into files:

```
/myapp
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

## Subsite Installation

If your application is installed in a subdirectory (e.g., `/myapp/`):

```php
<?php
require_once 'vendor/autoload.php';

set_root_url('/myapp');

router(function() {
    // Routes are now relative to /myapp
    route(method(GET), url_path('/'), function() {
        echo 'Home'; // Matches /myapp/
    });

    route(method(GET), url_path('/users'), function() {
        echo 'Users'; // Matches /myapp/users
    });
});
```

Build URLs with the root prefix:

```php
$homeUrl = root_url('/');           // Returns: /myapp/
$usersUrl = root_url('/users');     // Returns: /myapp/users
```

## Next Steps

- [HTTP Methods](./http-methods) — Match GET, POST, PUT, DELETE
- [URL Matching](./url-matching) — Static paths and parameters
- [Request Handling](./request-handling) — JSON, forms, files
- [Response Helpers](./response-helpers) — JSON, HTML, downloads
