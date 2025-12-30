---
sidebar_position: 3
sidebar_label: URL Matching
---

# URL Matching

## Static Paths

```php
use PhpCompatible\Router\Router;

Router::run(function() {
    Router::get('/', function() { /* ... */ });           // Root
    Router::get('/users', function() { /* ... */ });      // /users
    Router::get('/users/list', function() { /* ... */ }); // /users/list
});
```

## URL Parameters

Parameters are automatically detected when the path contains `:param` placeholders:

```php
Router::get('/users/:id', function() {
    $id = $_GET[':id'];
    return array('user_id' => $id);
});
```

### Multiple Parameters

```php
Router::get('/posts/:postId/comments/:commentId', function() {
    $postId = $_GET[':postId'];
    $commentId = $_GET[':commentId'];
    return array(
        'post' => $postId,
        'comment' => $commentId
    );
});
```

### With Request Object

```php
Router::get('/users/:id', function($request) {
    $id = $request->getParam('id'); // Without the colon
    return array('user_id' => $id);
});
```

## Route Priority

Routes are matched in order - first match wins:

```php
Router::run(function() {
    // Specific route first
    Router::get('/users/me', function() {
        return array('user' => 'current');
    });

    // Parameterized route after
    Router::get('/users/:id', function() {
        return array('user' => $_GET[':id']);
    });

    // Catch-all last
    Router::get('*', function() {
        return JsonResponse::response(HTTP_NOT_FOUND, array('error' => 'Not found'));
    });
});
```

## Wildcard Path

```php
Router::get('/docs/*', function() {
    // Matches /docs/anything/here
    return array('path' => $_GET['url']);
});
```
