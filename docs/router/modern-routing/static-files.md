---
sidebar_position: 12
sidebar_label: Static Files
---

# Static Files with Modern Routing

Serve static assets (CSS, JavaScript, images, fonts, etc.) directly from a folder with automatic MIME type detection and caching headers.

## Basic Usage

```php
<?php
require_once 'vendor/autoload.php';

use PhpCompatible\Router\Router;

Router::run(function() {
    // Serve static files from /assets folder at /assets URL
    Router::staticFolder(__DIR__ . '/assets', '/assets');

    Router::get('/', function() {
        return 'Home';
    });
});
```

## URL Mapping

The `Router::staticFolder()` method maps URL paths to files in your static folder:

```
/public/
├── css/
│   └── style.css      → /assets/css/style.css
├── js/
│   └── app.js         → /assets/js/app.js
├── images/
│   └── logo.png       → /assets/images/logo.png
└── fonts/
    └── roboto.woff2   → /assets/fonts/roboto.woff2
```

## Options

### Cache Control

By default, static files are cached for 24 hours. Customize this:

```php
use PhpCompatible\Router\Router;

Router::run(function() {
    // Cache for 1 week
    Router::staticFolder(__DIR__ . '/public', '/assets', array(
        'cache_time' => 604800
    ));

    // No caching (development)
    Router::staticFolder(__DIR__ . '/public', '/assets', array(
        'cache_time' => 0
    ));

    // Cache for 1 year (versioned assets)
    Router::staticFolder(__DIR__ . '/public', '/assets', array(
        'cache_time' => 31536000
    ));
});
```

### Allowed Extensions

Restrict which file types can be served:

```php
Router::run(function() {
    // Only serve CSS, JS, and images
    Router::staticFolder(__DIR__ . '/public', '/assets', array(
        'allowed_extensions' => array('css', 'js', 'png', 'jpg', 'gif', 'svg', 'webp')
    ));

    // Only serve fonts
    Router::staticFolder(__DIR__ . '/fonts', '/fonts', array(
        'allowed_extensions' => array('woff', 'woff2', 'ttf', 'otf', 'eot')
    ));
});
```

## Multiple Static Folders

```php
use PhpCompatible\Router\Router;

Router::run(function() {
    // Serve different asset types from different folders
    Router::staticFolder(__DIR__ . '/assets/css', '/css');
    Router::staticFolder(__DIR__ . '/assets/js', '/js');
    Router::staticFolder(__DIR__ . '/assets/images', '/images');
    Router::staticFolder(__DIR__ . '/node_modules', '/vendor', array(
        'allowed_extensions' => array('css', 'js', 'map')
    ));

    // Application routes
    Router::get('/', function() {
        return '<link rel="stylesheet" href="/css/style.css">';
    });
});
```

## Complete Example

```php
<?php
require_once 'vendor/autoload.php';

use PhpCompatible\Router\Router;

Router::run(function() {
    // Static assets
    Router::staticFolder(__DIR__ . '/public', '/assets');

    // API routes
    Router::group('/api', function() {
        Router::get('/users', function() {
            return array('users' => array());
        });
    });

    // Web routes
    Router::get('/', function() {
        return file_get_contents(__DIR__ . '/views/home.html');
    });
});
```

## Project Structure

```
/myapp
├── public/
│   └── index.php       # Entry point
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── images/
│       └── logo.png
├── views/
│   └── home.html
└── vendor/
```

## Security

The `Router::staticFolder()` method includes security measures:

### Directory Traversal Prevention

Attempts to access files outside the static folder are blocked:

```php
// URL: /assets/../../../etc/passwd
Router::staticFolder(__DIR__ . '/public', '/assets');
// Result: 404 Not Found
```

### Real Path Validation

The function uses `realpath()` to resolve symbolic links and ensure files are within the allowed folder.

## MIME Types

The router automatically detects MIME types based on file extension:

| Extension | MIME Type |
|-----------|-----------|
| `.css` | text/css |
| `.js` | text/javascript |
| `.json` | application/json |
| `.png` | image/png |
| `.jpg` | image/jpeg |
| `.svg` | image/svg+xml |
| `.woff2` | font/woff2 |

## Production Web Server

For production, configure your web server to serve static files directly for better performance.

### Apache

```apache
RewriteEngine On

# If the file exists in assets, serve it directly
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^assets/(.*)$ assets/$1 [L]

# Otherwise, route to PHP
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]
```

### Nginx

```nginx
location /assets {
    alias /var/www/html/assets;
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location / {
    try_files $uri $uri/ /index.php?url=$uri&$args;
}
```
