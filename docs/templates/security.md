---
sidebar_position: 3
sidebar_label: Security
---

# Security

The `template()` function does not automatically escape output. This gives you full control but requires you to handle escaping properly to prevent XSS (Cross-Site Scripting) attacks.

## HTML Escaping

Always escape user-provided content when outputting HTML:

```php
<!-- Unsafe: vulnerable to XSS -->
<h1><?= $userInput ?></h1>

<!-- Safe: escaped output -->
<h1><?= htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8') ?></h1>
```

### Creating an Escape Helper

For convenience, create a short helper function:

```php
function e($string) {
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}
```

Then use it throughout your templates:

```php
<h1><?= e($title) ?></h1>
<p><?= e($description) ?></p>
<a href="<?= e($url) ?>">Click here</a>
```

## Attribute Escaping

When outputting into HTML attributes, always quote the attribute and escape the value:

```php
<!-- Safe: quoted and escaped -->
<input type="text" value="<?= e($value) ?>">
<a href="<?= e($url) ?>">Link</a>
<div data-id="<?= e($id) ?>">Content</div>
```

## URL Parameters

When building URLs with query parameters, use `urlencode()`:

```php
<a href="/search?q=<?= urlencode($query) ?>">Search</a>
```

Or use `http_build_query()` for multiple parameters:

```php
<?php
$params = http_build_query(array(
    'search' => $query,
    'page' => $page,
    'sort' => $sort
));
?>
<a href="/results?<?= $params ?>">View Results</a>
```

## JSON Output

When outputting data for JavaScript consumption, use `json_encode()`:

```php
<script>
    var config = <?= json_encode($config, JSON_HEX_TAG | JSON_HEX_AMP) ?>;
    var items = <?= json_encode($items, JSON_HEX_TAG | JSON_HEX_AMP) ?>;
</script>
```

The `JSON_HEX_TAG` and `JSON_HEX_AMP` flags provide additional safety by escaping `<`, `>`, and `&` characters.

## CSS Values

When outputting into CSS, be cautious with user input:

```php
<!-- Be careful with user-provided colors/values -->
<div style="background-color: <?= e($bgColor) ?>">
```

For dynamic CSS, consider using a whitelist approach:

```php
<?php
$allowedColors = array('red', 'blue', 'green', 'yellow');
$color = in_array($userColor, $allowedColors) ? $userColor : 'gray';
?>
<div style="background-color: <?= $color ?>">
```

## Security Checklist

| Context | Function | Example |
|---------|----------|---------|
| HTML content | `htmlspecialchars()` | `<p><?= e($text) ?></p>` |
| HTML attributes | `htmlspecialchars()` | `<input value="<?= e($val) ?>">` |
| URLs | `urlencode()` | `?q=<?= urlencode($q) ?>` |
| JavaScript | `json_encode()` | `var x = <?= json_encode($x) ?>;` |
| CSS | Whitelist | Validate against allowed values |

## Trusted Content

If you need to output trusted HTML (e.g., from a WYSIWYG editor), ensure it has been sanitized before storage or use a library like HTML Purifier:

```php
// Only for content you trust or have sanitized
<?= $trustedHtmlContent ?>
```

:::warning
Never output raw user input without sanitization. Even "trusted" content should ideally be sanitized on input.
:::
