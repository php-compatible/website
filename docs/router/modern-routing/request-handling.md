---
sidebar_position: 5
sidebar_label: Request Handling
---

# Request Handling

## JSON Body

Parse JSON request body with `json_body()`:

```php
use PhpCompatible\Router\Router;
use PhpCompatible\Router\JsonResponse;

Router::post('/api/users', function() {
    $data = json_body();

    if (empty($data['name'])) {
        return JsonResponse::badRequest(array('error' => 'Name required'));
    }

    $user = create_user($data);
    return JsonResponse::created(array('user' => $user));
});
```

## Form Data

Access POST form data with `form_body()`:

```php
Router::post('/contact', function() {
    $form = form_body();
    $name = $form['name'];
    $email = $form['email'];

    send_contact_email($name, $email, $form['message']);
    return '<p>Thanks for your message!</p>';
});
```

## File Uploads

Handle file uploads with `has_file()`, `file_body()`, and `move_file()`:

```php
Router::post('/upload', function() {
    if (!has_file('document')) {
        return JsonResponse::badRequest(array('error' => 'No file uploaded'));
    }

    $file = file_body('document');
    move_file('document', '/uploads/' . $file['name']);

    return array('uploaded' => $file['name']);
});
```

## Request Headers

Read headers with `request_header()`:

```php
Router::get('/api/protected', function() {
    $auth = request_header('Authorization');

    if (empty($auth)) {
        return JsonResponse::unauthorized(array('error' => 'Unauthorized'));
    }

    return array('data' => 'secret');
});
```

## Content Negotiation

Check the Accept header with `accept()`:

```php
Router::get('/data', function() {
    $data = array('message' => 'Hello');

    if (accept(JSON_CONTENT)) {
        return $data;  // Auto-converted to JSON
    } else {
        return '<p>' . $data['message'] . '</p>';
    }
});
```

## Using ServerRequest

Routes can receive a PSR-7 style request object:

```php
use PhpCompatible\Router\ServerRequest;

Router::get('/users/:id', function(ServerRequest $request) {
    $id = $request->getRouteParam(':id');
    $page = $request->getQueryParam('page', 1);

    return array(
        'user_id' => $id,
        'page' => $page
    );
});

Router::post('/users', function(ServerRequest $request) {
    $data = $request->getParsedBody();
    $contentType = $request->getHeader('Content-Type');

    return array('received' => $data);
});
```

## Query Parameters

```php
// GET /api/users?page=2&limit=10
Router::get('/api/users', function() {
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;

    $users = get_users_paginated($page, $limit);
    return array(
        'users' => $users,
        'page' => $page,
        'limit' => $limit
    );
});
```
