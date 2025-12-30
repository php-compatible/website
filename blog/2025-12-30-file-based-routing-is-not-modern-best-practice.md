---
slug: file-based-routing-is-not-modern-best-practice
title: File-Based Routing Is Not Modern Best Practice
authors:
  - name: PHP Compatible Team
    url: https://github.com/php-compatible
tags: [router, opinion]
---

# How File-Based Routing Is *Not* Modern Best Practice

A few months ago, I **left a** role maintaining a legacy PHP 5 codebase. The kind of system where "working fine" meant "nobody dares touch it" and maintenance was just crossing your fingers every time you merged.

On paper, the architecture sounded simple: file-based routing. In reality, it was chaos.

Each PHP file represented an endpoint. Open any one of them and you’d find logic for multiple HTTP verbs living together in the same file. `GET` requests, `POST` submissions, validation, database writes, redirects, and HTML rendering were all intertwined. The control flow depended entirely on `if` statements scattered between massive blocks of code:

```php
<?php
require_once 'db.php';
session_start();

$error = '';
$success = '';

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete'])) {
    $id = $_POST['id'];
    mysql_query("DELETE FROM items WHERE id = $id");
    $success = 'Item deleted';
}

$user = mysql_fetch_assoc(mysql_query("SELECT * FROM users WHERE id = " . $_SESSION['user_id']));

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update'])) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    mysql_query("UPDATE users SET name = '$name', email = '$email' WHERE id = " . $_SESSION['user_id']);
    $user['name'] = $name;
    $user['email'] = $email;
    $success = 'Profile updated';
}

if ($_GET['action'] === 'export') {
    header('Content-Type: text/csv');
    // ... 50 lines of CSV generation
    exit;
}

$items = mysql_query("SELECT * FROM items WHERE user_id = " . $_SESSION['user_id']);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add'])) {
    $title = $_POST['title'];
    mysql_query("INSERT INTO items (user_id, title) VALUES (" . $_SESSION['user_id'] . ", '$title')");
    $items = mysql_query("SELECT * FROM items WHERE user_id = " . $_SESSION['user_id']); // re-fetch
}
?>
<!DOCTYPE html>
<html>
<head><title>Dashboard</title></head>
<body>
    <?php if ($error): ?>
        <div class="error"><?= $error ?></div>
    <?php endif; ?>
    <!-- ... 200 more lines of HTML mixed with PHP ... -->
```

Scroll a bit further and you’d hit another conditional that completely changed what the file was doing. Scroll further again and suddenly you were in the middle of HTML output. It wasn’t just hard to follow — it was almost impossible to reason about. Understanding *what happens when* required mentally simulating the entire file from top to bottom.

Technically, it worked. Practically, it was unmaintainable.

## The Irony of File-Based Routing’s Comeback

What makes this experience particularly ironic is that file-based routing has made a big comeback — especially in JavaScript ecosystems.

Frameworks like Next.js proudly advertise file-based routing as a feature. Create a file, get a route. Clean. Intuitive. Modern.

At a glance, it looks eerily similar to what PHP developers were doing years ago with `login.php`, `users.php`, and `edit.php`. Which naturally raises the question: if file-based routing was such a mess back then, why does it suddenly feel acceptable now?

## The Critical Difference: Files Aren’t the Behavior Anymore

The answer is subtle, but important.

Modern “file-based routing” isn’t really file-based routing at all. It’s **function-based routing that uses the filesystem as a registry**.

In modern frameworks, the file doesn’t *execute*. It *declares* behavior. Inside the file are explicit handlers — usually one per HTTP verb — each with a clear responsibility, well-defined inputs, and predictable outputs.

Compare that to the legacy PHP pattern I was dealing with. There, the file *was* the program. Execution started at the top and ran straight through unless redirected by conditionals. HTTP verbs weren’t first-class concepts — they were just branches in a script. Side effects and rendering were mixed freely, and nothing enforced separation of concerns.

The similarity is cosmetic. Architecturally, they’re worlds apart.

## Why Classic File-Based Routing Aged So Poorly

The old approach failed not because files were involved, but because everything else was implicit:

- HTTP verbs were hidden inside conditionals
- Control flow depended on global state
- Rendering, validation, and persistence lived together
- Reading the code required understanding *every* branch

As systems grew, so did the cognitive load. Making a “small change” meant understanding an entire file’s execution path — including paths that might only run on certain days, with certain inputs, under certain conditions.

That kind of complexity doesn’t scale.

## Why Rewrites Don't Work

The obvious answer to legacy chaos is "just rewrite it." But rewrites almost never work.

They take longer than estimated — always. They introduce new bugs while trying to replicate old behavior. They require the business to freeze feature development while the team rebuilds something that already exists. And most critically, they cost money that companies simply don't have.

I've watched teams pitch six-month rewrites that turned into two-year death marches. I've seen "quick migrations" that never finished because the business couldn't stop shipping features. The reality is that most companies can't afford to pause revenue-generating work to rebuild infrastructure that technically works.

Rewrites fail because they ignore the constraint that matters most: **the business has to keep running**.

## What Developer Teams Actually Need

That experience is what finally pushed me to build **[PHP Compatible Router](https://phpcompatible.dev/docs/category/router)**.

Developer teams don't need permission to stop everything and rewrite. They need tools that let them improve things *while* shipping features. They need a path forward that doesn't require executive buy-in for a multi-month project. They need to make the codebase better one pull request at a time.

What teams need is an **upgrade journey**.

[PHP Compatible Router](https://phpcompatible.dev/docs/category/router) is designed around a simple idea: most legacy PHP applications don't need a big-bang rewrite — they need a way to get better *incrementally*.

So instead of forcing you to abandon file-based routing immediately, the router lets you start exactly where you are. If your app already routes by files, you can keep that structure — but those files no longer have to be giant scripts that run top to bottom. They can return handlers. They can declare intent. They can stop being a dumping ground for every concern in the system.

From there, you can improve things one step at a time.

The router is intentionally boring — in the best possible way. It gives you structure, clarity, and explicitness, while letting the business move at a pace it can actually tolerate.

## What Modern Best Practice Actually Looks Like

Modern backend architecture isn’t about where routes are declared. It’s about **how explicit the behavior is**.

Best practice today means:

- One route maps to one clear responsibility
- HTTP verbs are explicit, not inferred
- Side effects are isolated
- Control flow is easy to reason about

Whether you express that with files, configuration objects, or code annotations is secondary. What matters is that each route represents a small, understandable unit of behavior.

That’s why modern JavaScript routing feels maintainable — and why old PHP file-based routing didn’t.

## Final Thought

If you’ve ever opened a PHP file that handled form display, submission, validation, database writes, redirects, and rendering all in one place, you already know why the classic approach failed.

Modern frameworks didn’t bring file-based routing back from the dead.

They replaced it with something better — and kept the familiar shape so it felt simple.

And once you’ve worked with explicit, functional routing — even in a legacy PHP codebase — it’s very hard to go back and pretend those giant, unreadable files were ever a good idea.
