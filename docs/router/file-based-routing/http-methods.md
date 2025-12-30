---
sidebar_position: 2
sidebar_label: HTTP Methods
---

# HTTP Methods

Use the `method()` function to match HTTP methods in file-based routes.

## Basic Method Matching

**File: `/wwwroot/api/users.php`**

```php
<?php
require_once __DIR__ . '/../../vendor/autoload.php';

file_router(function() {
    route(method(GET), url_path('/'), $handler);      // GET /api/users
    route(method(POST), url_path('/'), $handler);     // POST /api/users
    route(method(PUT), url_path('/:id'), $handler);   // PUT /api/users/123
    route(method(DELETE), url_path('/:id'), $handler); // DELETE /api/users/123
    route(method(PATCH), url_path('/:id'), $handler);  // PATCH /api/users/123
});
```

## Match Any Method

:::caution Avoid Using ALL
While the `ALL` constant exists for matching any HTTP method, **you should avoid using it**. The whole point of adding this router to your legacy files is to make future upgrades easier. When you specify explicit methods like `GET`, `POST`, `PUT`, `DELETE`, you're documenting your API contract and making it easy to migrate to Laravel, Symfony, or other frameworks later.

If your existing code handles multiple methods, take the time to separate them now:
:::

**Instead of this:**
```php
// DON'T DO THIS - defeats the purpose of the router
file_router(function() {
    route(ALL, url_path('/'), function() {
        // Handles any HTTP method - but what methods does it actually support?
    });
});
```

**Do this:**
```php
// DO THIS - explicit methods make migration easy
file_router(function() {
    route(method(GET), url_path('/'), function() {
        echo json_response(HTTP_OK, array('users' => get_all_users()));
    });

    route(method(POST), url_path('/'), function() {
        $data = json_body();
        echo json_response(HTTP_CREATED, array('user' => create_user($data)));
    });
});
```

If you truly need to handle any method (e.g., for webhooks), use `ALL` but document why:

```php
file_router(function() {
    // Webhook endpoint - external service may use various methods
    route(ALL, url_path('/webhook'), function() {
        $method = $_SERVER['REQUEST_METHOD'];
        $payload = json_body();
        log_webhook($method, $payload);
        echo json_response(HTTP_OK, array('received' => true));
    });
});
```

## Custom Method Logic

Combine method checks with boolean logic:

```php
file_router(function() {
    $isGetOrPost = method(GET) || method(POST);
    route($isGetOrPost, url_path('/form'), function() {
        if (method(GET)) {
            echo html_response(HTTP_OK, '<form method="POST">...</form>');
        } else {
            $data = form_body();
            echo html_response(HTTP_OK, '<p>Form submitted!</p>');
        }
    });
});
```

## RESTful Resource Example

**File: `/wwwroot/api/users.php`**

```php
<?php
require_once __DIR__ . '/../../vendor/autoload.php';

file_router(function() {
    // GET /api/users - List all
    route(method(GET), url_path('/'), function() {
        echo json_response(HTTP_OK, array('users' => get_all_users()));
    });

    // GET /api/users/123 - Get one
    route(method(GET), url_path_params('/:id'), function() {
        $user = get_user($_GET[':id']);
        echo json_response(HTTP_OK, array('user' => $user));
    });

    // POST /api/users - Create
    route(method(POST), url_path('/'), function() {
        $data = json_body();
        $user = create_user($data);
        echo json_response(HTTP_CREATED, array('user' => $user));
    });

    // PUT /api/users/123 - Update
    route(method(PUT), url_path_params('/:id'), function() {
        $data = json_body();
        $user = update_user($_GET[':id'], $data);
        echo json_response(HTTP_OK, array('user' => $user));
    });

    // DELETE /api/users/123 - Delete
    route(method(DELETE), url_path_params('/:id'), function() {
        delete_user($_GET[':id']);
        echo json_response(HTTP_NO_CONTENT, null);
    });
});
```
