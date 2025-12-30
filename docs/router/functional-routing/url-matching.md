---
sidebar_position: 3
sidebar_label: URL Matching
---

# URL Matching

## Static Paths

```php
route(method(GET), url_path('/'), $handler);           // Root
route(method(GET), url_path('/users'), $handler);      // /users
route(method(GET), url_path('/users/list'), $handler); // /users/list
```

## Wildcard Path

Match any path with `*`:

```php
route(method(GET), url_path('*'), function() {
    // Matches any path - useful for catch-all handlers
});
```

## URL Parameters

Use `url_path_params()` to capture dynamic segments:

```php
route(method(GET), url_path_params('/users/:id'), function() {
    $id = $_GET[':id'];
    echo json_response(HTTP_OK, array('user_id' => $id));
});
```

### Multiple Parameters

```php
route(method(GET), url_path_params('/posts/:postId/comments/:commentId'), function() {
    $postId = $_GET[':postId'];
    $commentId = $_GET[':commentId'];
    echo json_response(HTTP_OK, array(
        'post' => $postId,
        'comment' => $commentId
    ));
});
```

## Route Priority

Routes are matched in order - first match wins. Put specific routes before parameterized ones:

```php
router(function() {
    // Specific route first
    route(method(GET), url_path('/users/me'), function() {
        echo json_response(HTTP_OK, array('user' => 'current'));
    });

    // Parameterized route after
    route(method(GET), url_path_params('/users/:id'), function() {
        echo json_response(HTTP_OK, array('user' => $_GET[':id']));
    });

    // Catch-all last
    route(method(GET), url_path('*'), function() {
        render(HTTP_NOT_FOUND, html_response(HTTP_NOT_FOUND, '<h1>Not Found</h1>'));
    });
});
```
