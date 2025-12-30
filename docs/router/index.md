---
sidebar_position: 1
sidebar_label: Overview
slug: /category/router
---

# Router

[![CI](https://github.com/php-compatible/router/actions/workflows/ci.yml/badge.svg)](https://github.com/php-compatible/router/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/php-compatible/router/branch/main/graph/badge.svg)](https://codecov.io/gh/php-compatible/router)
[![PHP Version](https://img.shields.io/badge/php-5.5%20--%208.5-8892BF.svg)](https://php.net/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/php-compatible/router/blob/main/LICENSE)

**Modern routing for legacy PHP applications** — Write clean routes today, upgrade to modern frameworks tomorrow.

## The Problem

You're maintaining a PHP application that's been around for years. The codebase works, but:

- Routes are scattered across dozens of files with mixed HTTP verbs
- `.htaccess` rewrites have become impossible to follow
- You want to modernize, but a full framework migration isn't feasible right now
- Your team needs to support multiple PHP versions during the transition

## The Solution

This router meets you where you are. Whether you're on PHP 5.5 or PHP 8.5, you get the same clean, expressive API. No conditional syntax, no version-specific features — just routing that works.

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
| [File-Based Routing](./file-based-routing) | Legacy projects with existing PHP files | `file_router()` in each file |
| [Functional Routing](./functional-routing) | Full control, centralized routes | `router()`, `route()`, `url_path()` |
| [Modern Routing](./modern-routing) | Clean syntax, new projects | `Router::get()`, `Router::post()` |
