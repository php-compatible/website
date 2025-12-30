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

## Choose Your Routing Style

Each routing style has its own getting started guide with server configuration and examples.

| Approach | Best For | Style |
|----------|----------|-------|
| [File-Based Routing](./file-based-routing) | Legacy projects with existing PHP files | `file_router()` in each file |
| [Functional Routing](./functional-routing) | Full control, centralized routes | `router()`, `route()`, `url_path()` |
| [Modern Routing](./modern-routing) | Clean syntax, new projects | `Router::get()`, `Router::post()` |
