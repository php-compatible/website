---
sidebar_position: 6
---

# API Reference

## Enum

Base class for creating PHP 8-style enums.

### Static Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `CaseName()` | `Value` | Get enum case (case-insensitive) |
| `cases()` | `Value[]` | Get all enum cases |
| `from($value)` | `Value` | Get case by value (throws if not found) |
| `tryFrom($value)` | `Value\|null` | Get case by value (null if not found) |

### Example

```php
use PhpCompatible\Enum\Enum;

class Status extends Enum
{
    protected $draft;
    protected $published = 10;
}

// Access cases
$draft = Status::draft();
$published = Status::published();

// Get all cases
$cases = Status::cases();

// Lookup by value
$case = Status::from(10);      // Returns published
$case = Status::tryFrom(999);  // Returns null
```

## Value

Represents a single enum case.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `$name` | `string` | The enum case name (original definition) |
| `$value` | `int\|string\|null` | The enum case value |

### Example

```php
$case = Status::draft();

echo $case->name;   // "draft"
echo $case->value;  // 0
```

## EnumLabel

Converts enum case names to human-readable labels.

### Static Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `from(Value $value)` | `EnumLabel` | Create label from enum value |

### Instance Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `toString()` | `string` | Get label as string |
| `__toString()` | `string` | Auto string conversion |

### Example

```php
use PhpCompatible\Enum\EnumLabel;

class TaskStatus extends Enum
{
    protected $pendingReview;
}

$label = EnumLabel::from(TaskStatus::pendingReview());
echo $label;            // "Pending Review"
echo $label->toString(); // "Pending Review"
```

## Php8EnumLabel

For PHP 8.1+ native enums (extends `EnumLabel`).

### Static Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `fromEnum(UnitEnum $case)` | `Php8EnumLabel` | Create label from PHP 8 enum case |

### Instance Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `toString()` | `string` | Get label as string |
| `__toString()` | `string` | Auto string conversion |

### Example

```php
// PHP 8.1+
use PhpCompatible\Enum\Php8EnumLabel;

enum Status {
    case PendingReview;
    case InProgress;
}

echo Php8EnumLabel::fromEnum(Status::PendingReview); // "Pending Review"
```

## How It Works

- Enum cases are defined as `protected` instance properties
- Properties are immutable from outside the class
- `__callStatic` enables static-style access: `Suit::hearts()`
- A singleton instance is created internally for reflection
- Values are lazily loaded and cached on first access
- `null` (uninitialized) values auto-increment from 0
- Case-insensitive matching allows flexible access styles
