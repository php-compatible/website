---
sidebar_position: 1
sidebar_label: Overview
slug: /category/templates
---

# Templates

[![CI](https://github.com/php-compatible/templates/actions/workflows/ci.yml/badge.svg)](https://github.com/php-compatible/templates/actions/workflows/ci.yml)
[![PHP Version](https://img.shields.io/badge/php-5.5%20--%208.5-8892BF.svg)](https://php.net/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/php-compatible/templates/blob/main/LICENSE)

**Blazing fast PHP templating with zero dependencies.**

A lightweight, high-performance template engine that leverages PHP's native output buffering for maximum speed. No parsing overhead, no compilation step, no caching layer needed — just pure PHP execution at full speed.

## Why Templates?

- **Zero overhead** — Uses PHP's native `require` and output buffering. No regex parsing, no AST compilation, no runtime interpretation
- **Instant rendering** — Templates execute as native PHP code. What you write is what runs
- **No dependencies** — A single function. No framework required. No external libraries
- **Legacy compatible** — Works on PHP 5.5 through 8.x. Modernize your legacy codebase without breaking compatibility
- **Familiar syntax** — It's just PHP. No new template language to learn

## Quick Start

```bash
composer require php-compatible/templates
```

```php
<?php
require 'vendor/autoload.php';

$html = template('views/hello.php', array(
    'title' => 'Hello World',
    'message' => 'Welcome to my site!'
));

echo $html;
```

## How It Works

The `template()` function loads a PHP file and executes it with the provided variables in scope. Variables are passed as an associative array and automatically extracted, making them available as local variables within the template.

```php
// Calling template() with variables
template('views/user.php', array('name' => 'Alice'));

// Inside views/user.php, $name is available
<h1>Hello, <?= $name ?>!</h1>
```

## Template Organization

Organize your templates into logical directories:

| Directory | Purpose |
|-----------|---------|
| `layouts/` | Page wrappers containing header/footer markup |
| `pages/` | Complete page templates |
| `components/` | Reusable UI elements |

## Requirements

- PHP 5.5 or higher
