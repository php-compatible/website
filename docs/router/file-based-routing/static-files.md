---
sidebar_position: 12
sidebar_label: Static Files
---

# Static Files with File-Based Routing

When using file-based routing, static files are typically handled by your web server directly. However, you can still use `static_folder()` within your PHP files if needed.

## Recommended Approach

For file-based routing, let your web server handle static files directly:

### Apache (.htaccess)

```apache
RewriteEngine On

# If the file exists, serve it directly
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule \.(css|js|png|jpg|gif|svg|ico|woff2?|ttf|eot)$ - [L]

# If file exists, serve it with url parameter
RewriteCond %{REQUEST_FILENAME} -f
RewriteCond %{REQUEST_FILENAME} \.php$
RewriteRule ^(.*)$ $1?url=$1 [QSA,L]
```

### Nginx

```nginx
location ~* \.(css|js|png|jpg|gif|svg|ico|woff2?|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~ \.php$ {
    fastcgi_param QUERY_STRING url=$uri&$query_string;
    fastcgi_pass unix:/var/run/php/php-fpm.sock;
    include fastcgi_params;
}
```

## Using static_folder() in PHP Files

If you need to serve static files through PHP (e.g., for access control or dynamic serving), you can use `static_folder()`:

**File: `/wwwroot/assets.php`**

```php
<?php
require_once __DIR__ . '/../vendor/autoload.php';

file_router(function() {
    // Serve files from /assets folder
    // URL: /assets/css/style.css → /wwwroot/../public/css/style.css
    static_folder(__DIR__ . '/../public', '/assets');
});
```

## Options

### Cache Control

```php
file_router(function() {
    // Cache for 1 week
    static_folder(__DIR__ . '/../public', '/assets', array(
        'cache_time' => 604800
    ));

    // No caching (development)
    static_folder(__DIR__ . '/../public', '/assets', array(
        'cache_time' => 0
    ));
});
```

### Allowed Extensions

```php
file_router(function() {
    // Only serve CSS, JS, and images
    static_folder(__DIR__ . '/../public', '/assets', array(
        'allowed_extensions' => array('css', 'js', 'png', 'jpg', 'gif', 'svg')
    ));
});
```

## Project Structure

```
/wwwroot/
├── api/
│   └── users.php
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── images/
│       └── logo.png
└── index.php
```

With file-based routing, the web server typically serves `/public/` files directly, so you don't need `static_folder()` in most cases.

## Security

The `static_folder()` function includes security measures:

- **Directory Traversal Prevention** - Blocks attempts to access files outside the static folder
- **Real Path Validation** - Uses `realpath()` to resolve symbolic links

```php
// URL: /assets/../../../etc/passwd
// Result: 404 Not Found
```

## MIME Types

The router automatically detects MIME types:

```php
echo mime_type('css');   // text/css
echo mime_type('png');   // image/png
echo mime_type('woff2'); // font/woff2
```

## When to Use static_folder()

Use `static_folder()` in file-based routing when:

- You need access control on static files
- Your hosting doesn't allow web server configuration
- You want to serve files from outside the web root
- You need to log or track file downloads

For standard static file serving, rely on your web server for better performance.
