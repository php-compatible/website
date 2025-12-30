---
sidebar_position: 1
sidebar_label: Getting Started
---

# Getting Started with File-Based Routing

File-based routing lets you add modern routing to existing PHP files without restructuring your project. Each PHP file handles its own routes.

## Installation

```bash
composer require php-compatible/router
```

## Server Configuration

File-based routing requires your server to pass the URL to each PHP file.

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

### Nginx

```nginx
location ~ \.php$ {
    fastcgi_param QUERY_STRING url=$uri&$query_string;
    fastcgi_pass unix:/var/run/php/php-fpm.sock;
    include fastcgi_params;
}

location / {
    try_files $uri $uri/ $uri.php?url=$uri&$args;
}
```

### PHP Built-in Server

Create a `router.php` file:

```php
<?php
if (php_sapi_name() === 'cli-server') {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    // PHP file exists - set url and let PHP serve it
    if (preg_match('/\.php$/', $path) && file_exists(__DIR__ . $path)) {
        $_GET['url'] = preg_replace('/\.php$/', '', ltrim($path, '/'));
        return false;
    }

    // Directory with index.php
    if (is_dir(__DIR__ . $path) && file_exists(__DIR__ . $path . '/index.php')) {
        $_GET['url'] = trim($path, '/');
        include __DIR__ . $path . '/index.php';
        return true;
    }

    // Try to find matching PHP file
    if (file_exists(__DIR__ . $path . '.php')) {
        $_GET['url'] = ltrim($path, '/');
        include __DIR__ . $path . '.php';
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

## Your First File-Based Route

Create `/wwwroot/api/users.php`:

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

    // GET /api/users/123
    route(method(GET), url_path_params('/:id'), function() {
        echo json_response(HTTP_OK, array('user_id' => $_GET[':id']));
    });
});
```

## How It Works

`file_router()` automatically calculates the URL path based on the file's location:

```
/wwwroot/
├── index.php          → matches /
├── api/
│   ├── users.php      → matches /api/users
│   └── posts.php      → matches /api/posts
└── admin/
    └── index.php      → matches /admin/
```

## Why File-Based?

This approach is perfect when:
- You have an existing site with PHP files everywhere
- You can't restructure to a single entry point
- You want to add routing gradually, file by file
- You're preparing for a future framework migration

:::tip Document Your Methods
The whole point of adding this router is to prepare for future upgrades. Always use explicit HTTP methods (`GET`, `POST`, etc.) instead of `ALL` — this documents your API and makes migration easy.
:::

## Next Steps

- [HTTP Methods](./http-methods) — Match GET, POST, PUT, DELETE
- [URL Matching](./url-matching) — Static paths and parameters
- [Request Handling](./request-handling) — JSON, forms, files
- [Server Configuration](./server-config) — Detailed server setup
