---
sidebar_position: 10
sidebar_label: Server Configuration
---

# Server Configuration

For file-based routing, configure your web server to pass the URL as a query parameter.

## Apache (.htaccess)

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

## Nginx

```nginx
location ~ \.php$ {
    # Pass URL as query parameter
    fastcgi_param QUERY_STRING url=$uri&$query_string;
    fastcgi_pass unix:/var/run/php/php-fpm.sock;
    fastcgi_index index.php;
    include fastcgi_params;
}

location / {
    # Try PHP file first, then directory index
    try_files $uri $uri/ $uri.php?url=$uri&$args;
}
```

## PHP Built-in Server

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

## Directory Structure Example

```
/wwwroot/
├── .htaccess           # Apache rewrite rules
├── router.php          # PHP built-in server router
├── index.php           # Home page (/)
├── api/
│   ├── users.php       # /api/users
│   ├── posts.php       # /api/posts
│   └── v2/
│       └── users.php   # /api/v2/users
├── admin/
│   └── index.php       # /admin/
└── vendor/
    └── autoload.php
```

## Best Practices

1. **Keep files focused** - Each PHP file should handle one resource
2. **Use consistent structure** - Follow REST conventions for API endpoints
3. **Handle errors gracefully** - Use `HttpException` for client errors
4. **Validate input** - Always validate `json_body()` and parameters
5. **Set content types** - Use `json_response()`, `html_response()`, etc.
