---
sidebar_position: 1
sidebar_label: Overview
slug: /category/router
---

# Router

[![CI](https://github.com/php-compatible/router/actions/workflows/ci.yml/badge.svg)](https://github.com/php-compatible/router/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/php-compatible/router/branch/main/graph/badge.svg)](https://codecov.io/gh/php-compatible/router)
[![PHP Version](https://img.shields.io/badge/php-5.5%20--%208.5-8892BF.svg)](https://php.net/)

**Modern routing for legacy PHP applications** — Write clean routes today, upgrade to modern frameworks tomorrow.

## The Problem

You're maintaining a PHP application that's been around for years. The codebase works, but:

- Routes are scattered across dozens of files with mixed HTTP verbs
- `.htaccess` rewrites have become impossible to follow
- You want to modernize, but a full framework migration isn't feasible right now
- Your team needs to support multiple PHP versions during the transition

## The Solution

This router meets you where you are. Whether you're on PHP 5.5 or PHP 8.5, you get the same clean, expressive API. No conditional syntax, no version-specific features — just routing that works.

## Your Upgrade Journey

This router supports developers at every stage of modernization:

| Stage | PHP Version | What You Get |
|-------|-------------|--------------|
| **Legacy Cleanup** | 5.5+ | Consolidate scattered routes into clean definitions |
| **Adding Structure** | 7.0+ | Route groups, middleware, organized code |
| **Modern Patterns** | 7.4+ | PSR-7 style request/response objects |
| **Framework Ready** | 8.0+ | Clean patterns ready for Laravel/Symfony migration |

## Installation

```bash
composer require php-compatible/router
```

## Quick Start

### Functional Style (PHP 5.5+)

```php
<?php
require_once 'vendor/autoload.php';

router(function() {
    route(method(GET), url_path('/'), function() {
        echo json_response(HTTP_OK, array('message' => 'Hello World'));
    });

    route(method(GET), url_path_params('/users/:id'), function() {
        $id = $_GET[':id'];
        echo json_response(HTTP_OK, array('user_id' => $id));
    });
});
```

### Modern Class Style (PHP 7.0+)

```php
<?php
require_once 'vendor/autoload.php';

use PhpCompatible\Router\Router;

Router::run(function() {
    Router::get('/', function() {
        return array('message' => 'Hello World');
    });

    Router::get('/users/:id', function($request) {
        $id = $request->getParam('id');
        return array('user_id' => $id);
    });
});
```

## Features

- **PHP 5.5 - 8.5 Compatible** — Same API across all versions
- **File-Based Routing** — Drop-in routing for existing PHP file structures
- **Route Groups** — Organize routes with common prefixes
- **Middleware Support** — Add authentication, logging, etc.
- **PSR-7 Style Objects** — Optional request/response classes
- **HTTP Exceptions** — `HttpException::notFound()` factory methods
- **98% Test Coverage** — Thoroughly tested across all PHP versions

## Routing Approaches

| Approach | Best For | Style |
|----------|----------|-------|
| [Functional Routing](./functional-routing) | Full control, centralized routes | `router()`, `route()`, `url_path()` |
| [File-Based Routing](./file-based-routing) | Legacy projects with existing PHP files | `file_router()` in each file |
| [Modern Routing](./modern-routing) | Clean syntax, new projects | `Router::get()`, `Router::post()` |

## Documentation

- [Installation](./installation) — Setup and server configuration
- [Functional Routing](./functional-routing) — Full control with functions
- [File-Based Routing](./file-based-routing) — For existing PHP file structures
- [Modern Routing](./modern-routing) — Class-based `Router::` syntax
- [Static File Routing](./static-routing) — Serve CSS, JS, images
- [PSR-7 Style Controllers](./psr7-style) — Request/Response objects
- [API Reference](./api-reference) — Complete reference
