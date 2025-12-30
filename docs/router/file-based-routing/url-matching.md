---
sidebar_position: 3
sidebar_label: URL Matching
---

# URL Matching

In file-based routing, the base URL is determined by the file's location. You define routes relative to that base.

## Static Paths

**File: `/wwwroot/api/users.php`** (base: `/api/users`)

```php
file_router(function() {
    route(method(GET), url_path('/'), $handler);        // /api/users
    route(method(GET), url_path('/active'), $handler);  // /api/users/active
    route(method(GET), url_path('/banned'), $handler);  // /api/users/banned
});
```

## URL Parameters

Use `url_path_params()` to capture dynamic segments:

```php
file_router(function() {
    // /api/users/123
    route(method(GET), url_path_params('/:id'), function() {
        $id = $_GET[':id'];
        echo json_response(HTTP_OK, array('user_id' => $id));
    });
});
```

### Multiple Parameters

```php
file_router(function() {
    // /api/users/123/posts/456
    route(method(GET), url_path_params('/:userId/posts/:postId'), function() {
        $userId = $_GET[':userId'];
        $postId = $_GET[':postId'];
        echo json_response(HTTP_OK, array(
            'user' => $userId,
            'post' => $postId
        ));
    });
});
```

## Route Priority

Routes are matched in order - first match wins:

```php
file_router(function() {
    // Specific route first
    route(method(GET), url_path('/me'), function() {
        echo json_response(HTTP_OK, array('user' => 'current'));
    });

    // Parameterized route after
    route(method(GET), url_path_params('/:id'), function() {
        echo json_response(HTTP_OK, array('user' => $_GET[':id']));
    });
});
```

## Wildcard Path

Match any sub-path:

```php
file_router(function() {
    route(method(GET), url_path('*'), function() {
        // Catch-all for this file's routes
        echo json_response(HTTP_NOT_FOUND, array('error' => 'Not found'));
    });
});
```
