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

Pass `true` as the first argument:

```php
file_router(function() {
    route(true, url_path('/webhook'), function() {
        // Handles any HTTP method
        $method = $_SERVER['REQUEST_METHOD'];
        echo json_response(HTTP_OK, array('method' => $method));
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
