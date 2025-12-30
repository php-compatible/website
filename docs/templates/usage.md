---
sidebar_position: 2
sidebar_label: Usage
---

# Usage

## Basic Templates

Create a template file with standard PHP:

```php title="views/hello.php"
<h1><?= $title ?></h1>
<p><?= $message ?></p>
```

Render it by passing variables as an associative array:

```php
$html = template('views/hello.php', array(
    'title' => 'Welcome',
    'message' => 'Thanks for visiting!'
));

echo $html;
```

## Loops and Iteration

Templates support all PHP control structures:

```php title="views/list.php"
<ul>
<?php foreach ($items as $item): ?>
    <li><?= $item ?></li>
<?php endforeach; ?>
</ul>
```

```php
$html = template('views/list.php', array(
    'items' => array('Apple', 'Banana', 'Cherry')
));
```

## Nested Data

Access array and object properties as you normally would:

```php title="views/user-card.php"
<div class="user-card">
    <h2><?= $user['name'] ?></h2>
    <p><?= $user['email'] ?></p>
    <?php if ($user['verified']): ?>
        <span class="badge">Verified</span>
    <?php endif; ?>
</div>
```

```php
$html = template('views/user-card.php', array(
    'user' => array(
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'verified' => true
    )
));
```

## Layouts and Components

### Creating a Layout

```php title="layouts/page.php"
<!DOCTYPE html>
<html>
<head>
    <title><?= $title ?></title>
</head>
<body>
    <header>
        <nav><!-- navigation --></nav>
    </header>

    <main>
        <?= $content ?>
    </main>

    <footer>
        <p>&copy; <?= date('Y') ?> My Site</p>
    </footer>
</body>
</html>
```

### Using the Layout

```php
// Render the page content first
$content = template('pages/home.php', array(
    'featured' => $featuredItems
));

// Then wrap it in the layout
$html = template('layouts/page.php', array(
    'title' => 'Home',
    'content' => $content
));

echo $html;
```

### Reusable Components

```php title="components/alert.php"
<div class="alert alert-<?= $type ?>">
    <?= $message ?>
</div>
```

Use components within other templates:

```php title="pages/dashboard.php"
<?php if ($error): ?>
    <?= template('components/alert.php', array(
        'type' => 'danger',
        'message' => $error
    )) ?>
<?php endif; ?>

<h1>Dashboard</h1>
<!-- rest of page -->
```

## Conditional Rendering

```php title="views/status.php"
<?php if ($status === 'active'): ?>
    <span class="badge badge-success">Active</span>
<?php elseif ($status === 'pending'): ?>
    <span class="badge badge-warning">Pending</span>
<?php else: ?>
    <span class="badge badge-secondary">Inactive</span>
<?php endif; ?>
```

## Rendering Tables

```php title="views/data-table.php"
<table>
    <thead>
        <tr>
            <?php foreach ($columns as $column): ?>
                <th><?= $column ?></th>
            <?php endforeach; ?>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($rows as $row): ?>
            <tr>
                <?php foreach ($row as $cell): ?>
                    <td><?= $cell ?></td>
                <?php endforeach; ?>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>
```

## Best Practices

### Keep Logic Minimal

Templates should focus on presentation. Move business logic to your controllers or services:

```php
// Good: Logic in controller
$users = $userService->getActiveUsers();
$html = template('views/users.php', array('users' => $users));

// Bad: Logic in template
// <?php $users = $db->query("SELECT * FROM users WHERE active = 1"); ?>
```

### Use Helper Functions

Create helper functions for common formatting tasks:

```php
function format_date($date) {
    return date('F j, Y', strtotime($date));
}

function format_currency($amount) {
    return '$' . number_format($amount, 2);
}
```

Then use them in templates:

```php
<p>Order Date: <?= format_date($order['created_at']) ?></p>
<p>Total: <?= format_currency($order['total']) ?></p>
```
