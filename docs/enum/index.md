---
sidebar_label: Overview
slug: /category/enum
---

# Enum

[![CI](https://github.com/php-compatible/enum/actions/workflows/ci.yml/badge.svg)](https://github.com/php-compatible/enum/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/php-compatible/enum/branch/main/graph/badge.svg)](https://codecov.io/gh/php-compatible/enum)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/php-compatible/enum/blob/main/LICENSE)

**PHP 8-style enums for PHP 7.2+** - Write enums today, upgrade to native enums tomorrow.

This library provides a PHP 8-compatible enum API that works on PHP 7.2 and above. When you're ready to upgrade to PHP 8.1+, use the included migration tool to automatically convert your enums to native PHP syntax.

## Why Use This Package?

- **Future-proof**: API mirrors PHP 8 enums (`from()`, `tryFrom()`, `cases()`)
- **Zero-friction migration**: Automated upgrade tool converts to native PHP 8 enums
- **IDE-friendly**: CLI tool auto-generates PHPDoc annotations for full autocompletion
- **Flexible**: Case-insensitive access, auto-increment values, string or int backing
- **Human-readable labels**: Built-in conversion from `camelCase` to `Camel Case`
- **Type-safe**: Strict type comparison for value lookups (matches PHP 8 behavior)
- **Well-tested**: 100% code coverage across PHP 7.2 - 8.5

## CLI Tools Included

| Command | Description |
|---------|-------------|
| `vendor/bin/php-compatible-enum-auto-doc` | Auto-generate `@method` PHPDoc annotations for IDE support |
| `vendor/bin/php-compatible-enum-upgrade-to-php8` | Migrate enums to native PHP 8.1+ syntax |

## Quick Start

```bash
composer require php-compatible/enum
```

```php
<?php

use PhpCompatible\Enum\Enum;
use PhpCompatible\Enum\Value;

/**
 * @method static Value hearts()
 * @method static Value diamonds()
 * @method static Value clubs()
 * @method static Value spades()
 */
class Suit extends Enum
{
    protected $hearts;   // 0
    protected $diamonds; // 1
    protected $clubs;    // 2
    protected $spades;   // 3
}

echo Suit::hearts()->name;  // "hearts"
echo Suit::hearts()->value; // 0
```

## Requirements

- PHP 7.2 or higher
