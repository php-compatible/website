---
sidebar_position: 12
sidebar_label: Static Files
---

# Static Files with Functional Routing

Serve static assets (CSS, JavaScript, images, fonts, etc.) directly from a folder with automatic MIME type detection and caching headers.

## When to Use Static File Routing

- **Assets Folder** - Serve CSS, JS, images from a `/public` or `/assets` folder
- **Single Entry Point** - All requests go through `index.php`, including static files
- **Development Server** - Using PHP's built-in server without separate static file handling
- **Simple Hosting** - Environments without sophisticated web server configuration

## Basic Usage

```php
<?php
require_once 'vendor/autoload.php';

router(function() {
    // Serve static files from /public folder at /static URL
    static_folder(__DIR__ . '/public', '/static');

    // Other routes
    route(method(GET), url_path('/'), function() {
        echo 'Home';
    });
});
```

## URL Mapping

The `static_folder()` function maps URL paths to files in your static folder:

```
/public/
├── css/
│   └── style.css      → /static/css/style.css
├── js/
│   └── app.js         → /static/js/app.js
├── images/
│   └── logo.png       → /static/images/logo.png
└── fonts/
    └── roboto.woff2   → /static/fonts/roboto.woff2
```

```php
// All files in /public are served at /static/*
static_folder(__DIR__ . '/public', '/static');
```

## Options

### Cache Control

By default, static files are cached for 24 hours (86400 seconds). You can customize this:

```php
// Cache for 1 week
static_folder(__DIR__ . '/public', '/static', array(
    'cache_time' => 604800
));

// No caching (development)
static_folder(__DIR__ . '/public', '/static', array(
    'cache_time' => 0
));

// Cache for 1 year (versioned assets)
static_folder(__DIR__ . '/public', '/static', array(
    'cache_time' => 31536000
));
```

### Allowed Extensions

Restrict which file types can be served:

```php
// Only serve CSS, JS, and images
static_folder(__DIR__ . '/public', '/static', array(
    'allowed_extensions' => array('css', 'js', 'png', 'jpg', 'gif', 'svg', 'webp')
));

// Only serve fonts
static_folder(__DIR__ . '/fonts', '/fonts', array(
    'allowed_extensions' => array('woff', 'woff2', 'ttf', 'otf', 'eot')
));
```

## Multiple Static Folders

```php
router(function() {
    // Serve different asset types from different folders
    static_folder(__DIR__ . '/assets/css', '/css');
    static_folder(__DIR__ . '/assets/js', '/js');
    static_folder(__DIR__ . '/assets/images', '/images');
    static_folder(__DIR__ . '/node_modules', '/vendor', array(
        'allowed_extensions' => array('css', 'js', 'map')
    ));

    // Application routes
    route(method(GET), url_path('/'), function() {
        echo 'Home';
    });
});
```

## Project Structure Example

```
/project
├── index.php
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── images/
│       └── logo.png
└── vendor/
```

```php
// index.php
<?php
require_once 'vendor/autoload.php';

router(function() {
    static_folder(__DIR__ . '/public', '/public');

    route(method(GET), url_path('/'), function() {
        echo html_response('<link rel="stylesheet" href="/public/css/style.css">');
    });
});
```

## Security

The `static_folder()` function includes security measures:

### Directory Traversal Prevention

Attempts to access files outside the static folder are blocked:

```php
// This will NOT serve files outside /public
// URL: /static/../../../etc/passwd
static_folder(__DIR__ . '/public', '/static');
// Result: 404 Not Found
```

### Real Path Validation

The function uses `realpath()` to resolve symbolic links and ensure files are within the allowed folder.

## MIME Types

The router automatically detects MIME types based on file extension. Common types include:

| Extension | MIME Type |
|-----------|-----------|
| `.css` | text/css |
| `.js` | text/javascript |
| `.json` | application/json |
| `.png` | image/png |
| `.jpg` | image/jpeg |
| `.svg` | image/svg+xml |
| `.woff2` | font/woff2 |

You can also use `mime_type()` directly:

```php
echo mime_type('css');   // text/css
echo mime_type('png');   // image/png
echo mime_type('woff2'); // font/woff2
```

## Production Web Server

For production, configure your web server to serve static files directly for better performance.

### Apache

```apache
RewriteEngine On

# If the file exists, serve it directly
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^public/(.*)$ public/$1 [L]

# Otherwise, route to PHP
RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]
```

### Nginx

```nginx
location /static {
    alias /var/www/html/public;
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location / {
    try_files $uri /index.php?url=$uri&$args;
}
```
