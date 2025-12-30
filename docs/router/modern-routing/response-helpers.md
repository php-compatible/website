---
sidebar_position: 6
sidebar_label: Response Helpers
---

# Response Helpers

Routes can return values that are automatically handled.

## Return Arrays (Auto-converted to JSON)

```php
use PhpCompatible\Router\Router;

Router::get('/api/users', function() {
    return array(
        'users' => array(
            array('id' => 1, 'name' => 'Alice'),
            array('id' => 2, 'name' => 'Bob'),
        )
    );
});
// Output: {"users":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]}
```

## Return Strings

```php
Router::get('/hello', function() {
    return 'Hello World';
});

Router::get('/page', function() {
    return '<html><body><h1>Page</h1></body></html>';
});
```

## JsonResponse Objects

```php
use PhpCompatible\Router\JsonResponse;

Router::get('/api/users', function() {
    return JsonResponse::ok(array('users' => array()));
});

Router::post('/api/users', function() {
    $data = json_body();
    $user = create_user($data);
    return JsonResponse::created(array('user' => $user));
});

Router::get('/api/users/:id', function() {
    $user = find_user($_GET[':id']);
    if (!$user) {
        return JsonResponse::notFound(array('error' => 'User not found'));
    }
    return JsonResponse::ok(array('user' => $user));
});
```

### Available JsonResponse Methods

```php
JsonResponse::ok($data);              // 200
JsonResponse::created($data);          // 201
JsonResponse::noContent();             // 204
JsonResponse::badRequest($data);       // 400
JsonResponse::unauthorized($data);     // 401
JsonResponse::forbidden($data);        // 403
JsonResponse::notFound($data);         // 404
JsonResponse::serverError($data);      // 500
```

## HtmlResponse Objects

```php
use PhpCompatible\Router\HtmlResponse;

Router::get('/page', function() {
    return HtmlResponse::response(HTTP_OK, '<h1>Hello</h1>');
});

Router::get('/view', function() {
    return HtmlResponse::view('/path/to/template.php', array(
        'title' => 'My Page',
        'user' => get_current_user()
    ));
});
```

## File Downloads

```php
Router::get('/export/csv', function() {
    $csv = "id,name,email\n";
    foreach (get_all_users() as $user) {
        $csv .= "{$user['id']},{$user['name']},{$user['email']}\n";
    }
    download_csv($csv, 'users.csv');
});

Router::get('/export/json', function() {
    $data = array('users' => get_all_users());
    download_json($data, 'users.json');
});

Router::get('/files/:id', function() {
    $file = get_file($_GET[':id']);
    download_file($file['path'], $file['name']);
});
```

## Response Headers

```php
Router::get('/api/data', function() {
    response_header('X-Custom-Header', 'value');
    response_header('Cache-Control', 'max-age=3600');
    return array('cached' => true);
});
```
