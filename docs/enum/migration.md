---
sidebar_position: 5
---

# Migration to PHP 8

When you're ready to migrate to PHP 8.1+ native enums, use the `php-compatible-enum-upgrade-to-php8` CLI tool.

## Running the Migration

```bash
# Scan src/ directory (default)
vendor/bin/php-compatible-enum-upgrade-to-php8

# Scan a specific directory
vendor/bin/php-compatible-enum-upgrade-to-php8 app/Enums

# Preview changes without modifying files
vendor/bin/php-compatible-enum-upgrade-to-php8 --dry-run
```

## What the Tool Does

The migration tool will:

1. **Convert enum class definitions** - Transform `class Status extends Enum` to `enum Status`
2. **Update case declarations** - Convert `protected $draft;` to `case draft;`
3. **Handle backed enums** - Preserve integer or string backing values
4. **Update usages** - Replace `Status::draft()` with `Status::draft` (removes parentheses)
5. **Swap EnumLabel** - Replace `EnumLabel::from()` with `Php8EnumLabel::fromEnum()`

## Example Transformation

**Before:**

```php
<?php

use PhpCompatible\Enum\Enum;
use PhpCompatible\Enum\EnumLabel;

class Status extends Enum
{
    protected $draft;
    protected $published = 10;
}

$status = Status::draft();
echo EnumLabel::from($status);
```

**After:**

```php
<?php

use PhpCompatible\Enum\Php8EnumLabel;

enum Status: int
{
    case draft = 0;
    case published = 10;
}

$status = Status::draft;
echo Php8EnumLabel::fromEnum($status);
```

## Unit Enums vs Backed Enums

The migration tool automatically determines whether to create a unit enum or a backed enum:

- **Unit enum**: Created when no explicit values are set (pure enum without backing type)
- **Backed enum**: Created when any case has an explicit value (int or string)

### Unit Enum Example

**Before:**

```php
class Direction extends Enum
{
    protected $north;
    protected $south;
    protected $east;
    protected $west;
}
```

**After:**

```php
enum Direction
{
    case north;
    case south;
    case east;
    case west;
}
```

### Backed Enum Example

**Before:**

```php
class Color extends Enum
{
    protected $red = 'red';
    protected $green = 'green';
    protected $blue = 'blue';
}
```

**After:**

```php
enum Color: string
{
    case red = 'red';
    case green = 'green';
    case blue = 'blue';
}
```

## Post-Migration Steps

After running the migration tool:

1. **Update your `composer.json`** - You can remove `php-compatible/enum` from your dependencies if you no longer need backward compatibility
2. **Update PHP requirement** - Set your minimum PHP version to 8.1+
3. **Run your tests** - Ensure all functionality works as expected
4. **Keep `Php8EnumLabel`** - If you use human-readable labels, keep the package installed for `Php8EnumLabel`

:::tip
Always run with `--dry-run` first to preview changes before modifying your files!
:::
