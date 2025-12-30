---
sidebar_position: 2
sidebar_label: Installation
---

# Installation

## Requirements

- PHP 5.5 or higher
- Composer

## Install via Composer

```bash
composer require php-compatible/router
```

## Web Server Configuration

The router needs URL rewriting to work. Configure your web server to route all requests through a single entry point.

### Apache (.htaccess)

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

For development, create a `router.php` file:

```php
<?php
// router.php - for PHP built-in server
if (php_sapi_name() === 'cli-server') {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    // Serve static files directly
    if ($path !== '/' && file_exists(__DIR__ . $path)) {
        return false;
    }
}

// Set URL for router
$url = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/';
if ($url[0] === '/') {
    $url = substr($url, 1);
}
$_GET['url'] = strtok($url, '?');

// Include your main application file
require_once __DIR__ . '/index.php';
```

Then run:

```bash
php -S localhost:8080 router.php
```

## Basic Setup

### Entry Point (index.php)

```php
<?php
require_once 'vendor/autoload.php';

router(function() {
    route(method(GET), url_path('/'), function() {
        echo 'Hello World';
    });
});
```

### Using REQUEST_URI Instead of Query String

If you prefer to use `REQUEST_URI` directly instead of a `url` query parameter:

```php
<?php
require_once 'vendor/autoload.php';

use_request_uri(); // Use REQUEST_URI instead of $_GET['url']

router(function() {
    route(method(GET), url_path('/'), function() {
        echo 'Hello World';
    });
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
