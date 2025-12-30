---
sidebar_position: 4
---

# CLI Tools

## Auto-generating PHPDoc Annotations

Use the `php-compatible-enum-auto-doc` CLI tool to automatically generate `@method` annotations for your enum classes:

```bash
# Scan src/ directory (default)
vendor/bin/php-compatible-enum-auto-doc

# Scan a specific directory
vendor/bin/php-compatible-enum-auto-doc app/Enums

# Preview changes without modifying files
vendor/bin/php-compatible-enum-auto-doc --dry-run
```

### Case Style Options

```bash
# camelCase (default): hearts()
vendor/bin/php-compatible-enum-auto-doc

# PascalCase: Hearts()
vendor/bin/php-compatible-enum-auto-doc --pascal-case

# snake_case: hearts()
vendor/bin/php-compatible-enum-auto-doc --snake-case

# SCREAMING_SNAKE_CASE: HEARTS()
vendor/bin/php-compatible-enum-auto-doc --screaming-snake-case
```

The tool scans PHP files for classes that use `PhpCompatible\Enum\Enum`, extracts protected properties, and updates the class docblock with appropriate `@method` annotations. Files are listed as they are updated.

### Example

**Before:**

```php
<?php

use PhpCompatible\Enum\Enum;

class Suit extends Enum
{
    protected $hearts;
    protected $diamonds;
    protected $clubs;
    protected $spades;
}
```

**After:**

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
    protected $hearts;
    protected $diamonds;
    protected $clubs;
    protected $spades;
}
```
