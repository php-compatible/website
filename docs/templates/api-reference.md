---
sidebar_position: 4
sidebar_label: API Reference
---

# API Reference

## template()

Renders a PHP template file with variables and returns the output as a string.

```php
function template($path, $variables)
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `$path` | `string` | Path to the PHP template file |
| `$variables` | `array` | Associative array of variables to make available in the template |

### Return Value

Returns a `string` containing the rendered template output.

### How It Works

1. Starts output buffering with `ob_start()`
2. Extracts variables from the array into local scope using `extract()`
3. Includes the template file with `require`
4. Captures the output buffer contents
5. Cleans the output buffer with `ob_end_clean()`
6. Returns the captured output

### Example

```php
// Template file: views/greeting.php
<h1>Hello, <?= $name ?>!</h1>
<p>You have <?= $count ?> new messages.</p>

// Usage
$html = template('views/greeting.php', array(
    'name' => 'Alice',
    'count' => 5
));

echo $html;
// Output:
// <h1>Hello, Alice!</h1>
// <p>You have 5 new messages.</p>
```

### Nested Templates

Templates can call `template()` to include other templates:

```php title="views/page.php"
<html>
<body>
    <?= template('components/header.php', array('title' => $title)) ?>

    <main>
        <?= $content ?>
    </main>

    <?= template('components/footer.php', array()) ?>
</body>
</html>
```

### Variable Scope

Variables passed to `template()` are extracted into the local scope of the template file. This means:

- Variables are available directly by name (e.g., `$name`, not `$variables['name']`)
- The original `$variables` array is not available in the template
- Variables do not leak back to the calling scope

```php
// Calling code
$result = template('views/demo.php', array(
    'foo' => 'bar',
    'items' => array(1, 2, 3)
));

// In views/demo.php, these are available:
// $foo = 'bar'
// $items = array(1, 2, 3)
```

### Error Handling

If the template file does not exist, PHP will emit a warning and the function will return an empty string or partial output depending on where the error occurs.

For production use, consider wrapping with error handling:

```php
function safe_template($path, $variables) {
    if (!file_exists($path)) {
        error_log("Template not found: $path");
        return '';
    }
    return template($path, $variables);
}
```

## Source Code

The complete implementation:

```php
<?php
/**
 * Parse PHP template file
 *
 * @param string $path of the template
 * @param array $variables an associative array of variables which are available
 *                         in the PHP template
 * @return string the parsed template
 */
function template($path, $variables)
{
    ob_start();
    extract($variables);
    require $path;
    $output = ob_get_contents();
    ob_end_clean();
    return $output;
}
```
