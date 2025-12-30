---
sidebar_position: 3
---

# Usage

## Basic Enum (Auto-increment)

Define enum cases as protected properties. Uninitialized properties auto-increment from 0:

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

## Mixed Values

Combine auto-increment with explicit values:

```php
class Status extends Enum
{
    protected $draft;        // 0
    protected $pending;      // 1
    protected $published = 10;
    protected $archived;     // 11
}
```

## String Enum

```php
class Color extends Enum
{
    protected $red = 'red';
    protected $green = 'green';
    protected $blue = 'blue';
}

echo Color::red()->name;  // "red"
echo Color::red()->value; // "red"
```

## Case-Insensitive Access

Access enum cases using any naming convention:

```php
class Status extends Enum
{
    protected $pendingReview;
}

// All of these return the same Value instance:
Status::pendingReview();   // camelCase
Status::PendingReview();   // PascalCase
Status::PENDING_REVIEW();  // SCREAMING_SNAKE_CASE
Status::pending_review();  // snake_case

// The name property preserves the original definition:
Status::PENDING_REVIEW()->name; // "pendingReview"
```

## Getting All Cases

```php
foreach (Suit::cases() as $case) {
    echo $case->name . ': ' . $case->value . PHP_EOL;
}
// hearts: 0
// diamonds: 1
// clubs: 2
// spades: 3
```

## Looking Up by Value

Use `from()` and `tryFrom()` to get an enum case from its backing value (PHP 8 compatible):

```php
// from() throws an exception if the value doesn't exist
$case = Suit::from(0);
echo $case->name;  // "hearts"

// tryFrom() returns null if the value doesn't exist
$case = Suit::tryFrom(999);
var_dump($case);  // null

// Type-sensitive: integer 0 won't match string '0'
$case = Suit::tryFrom('0');
var_dump($case);  // null
```

Duplicate backing values are not allowed (matches PHP 8 behavior):

```php
// This will throw LogicException
class Invalid extends Enum
{
    protected $foo = 1;
    protected $bar = 1;  // Duplicate value!
}
```

## Human-Readable Labels

Use `EnumLabel` to convert enum names to human-readable labels:

```php
use PhpCompatible\Enum\EnumLabel;

class TaskStatus extends Enum
{
    protected $pendingReview;
    protected $inProgress;
    protected $onHold;
}

echo EnumLabel::from(TaskStatus::pendingReview()); // "Pending Review"
echo EnumLabel::from(TaskStatus::inProgress());    // "In Progress"
echo EnumLabel::from(TaskStatus::onHold());        // "On Hold"
```

`EnumLabel` handles various naming conventions:

| Input | Output |
|-------|--------|
| `camelCase` | `Camel Case` |
| `PascalCase` | `Pascal Case` |
| `snake_case` | `Snake Case` |
| `SCREAMING_SNAKE` | `Screaming Snake` |
| `ABCValue` | `ABC Value` |

Labels auto-convert to strings:

```php
$label = EnumLabel::from(TaskStatus::pendingReview());

echo "Status: $label";    // "Status: Pending Review"
echo $label->toString();  // "Pending Review"
```

## IDE Support

Add PHPDoc `@method` annotations for autocompletion:

```php
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

:::tip
Use the `php-compatible-enum-auto-doc` CLI tool to automatically generate these annotations!
:::
