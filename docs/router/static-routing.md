---
sidebar_position: 6
sidebar_label: Static File Routing
---

# Static File Routing

Serve static assets (CSS, JavaScript, images, fonts, etc.) directly from a folder with automatic MIME type detection and caching headers.

## When to Use Static File Routing

- **Assets Folder** - Serve CSS, JS, images from a `/public` or `/assets` folder
- **Single Entry Point** - All requests go through `index.php`, including static files
- **Development Server** - Using PHP's built-in server without separate static file handling
- **Simple Hosting** - Environments without sophisticated web server configuration

## Basic Usage

### Functional Style

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

### Modern Class Style

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

## MIME Type Detection

The router automatically detects MIME types based on file extension:

### Text & Code
| Extension | MIME Type |
|-----------|-----------|
| `.html`, `.htm` | text/html |
| `.css` | text/css |
| `.js` | text/javascript |
| `.json` | application/json |
| `.xml` | text/xml |
| `.txt` | text/plain |
| `.csv` | text/csv |
| `.md` | text/markdown |

### Images
| Extension | MIME Type |
|-----------|-----------|
| `.png` | image/png |
| `.jpg`, `.jpeg` | image/jpeg |
| `.gif` | image/gif |
| `.svg` | image/svg+xml |
| `.ico` | image/x-icon |
| `.webp` | image/webp |

### Fonts
| Extension | MIME Type |
|-----------|-----------|
| `.woff` | font/woff |
| `.woff2` | font/woff2 |
| `.ttf` | font/ttf |
| `.otf` | font/otf |
| `.eot` | application/vnd.ms-fontobject |

### Documents
| Extension | MIME Type |
|-----------|-----------|
| `.pdf` | application/pdf |
| `.zip` | application/zip |
| `.doc` | application/msword |
| `.xlsx` | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet |

### Audio & Video
| Extension | MIME Type |
|-----------|-----------|
| `.mp3` | audio/mpeg |
| `.wav` | audio/wav |
| `.mp4` | video/mp4 |
| `.webm` | video/webm |

Unknown extensions default to `application/octet-stream`.

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

## Project Structure Examples

### Simple Static Folder

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

### Multiple Static Folders

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

### With Router Class

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

## Using with Web Servers

For production, it's recommended to configure your web server to serve static files directly for better performance.

### Apache

```apache
# Serve static files directly, route everything else to index.php
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

### PHP Built-in Server

When using `php -S`, static file routing works automatically:

```php
// router.php
<?php
if (preg_match('/\.(?:css|js|png|jpg|gif|svg|ico|woff2?)$/i', $_SERVER['REQUEST_URI'])) {
    return false; // Serve file directly
}

$_GET['url'] = ltrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
require 'index.php';
```

```bash
php -S localhost:8080 router.php
```

## Helper Function

You can also use `mime_type()` directly to get the MIME type for any extension:

```php
echo mime_type('css');   // text/css
echo mime_type('png');   // image/png
echo mime_type('woff2'); // font/woff2
echo mime_type('xyz');   // application/octet-stream (unknown)
```
