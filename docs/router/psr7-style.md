---
sidebar_position: 7
sidebar_label: PSR-7 Style Controllers
---

# PSR-7 Style Controllers

The router supports PSR-7 compatible request and response objects for a more modern, testable approach. These are optional - you can still use the traditional function-based approach.

## ServerRequest

The `ServerRequest` class wraps the current HTTP request in an object:

```php
use PhpCompatible\Router\ServerRequest;
use PhpCompatible\Router\Router;

Router::get('/users/:id', function(ServerRequest $request) {
    $id = $request->getParam('id');
    $query = $request->getQueryParam('filter');

    return array('user_id' => $id, 'filter' => $query);
});
```

### Automatic Injection

When your route handler accepts a parameter, the router automatically injects a `ServerRequest`:

```php
// Closure with parameter - gets ServerRequest
Router::get('/users', function($request) {
    // $request is a ServerRequest instance
});

// Closure without parameters - no injection
Router::get('/users', function() {
    // Use traditional $_GET, json_body(), etc.
});
```

### Route Parameters

Access URL parameters (`:param` placeholders) using `getParam()` or `getAttribute()`:

```php
Router::get('/posts/:postId/comments/:commentId', function($request) {
    $postId = $request->getParam('postId');       // "123"
    $commentId = $request->getAttribute('commentId'); // "456"

    // Or get all route parameters
    $params = $request->getAttributes();
    // ['postId' => '123', 'commentId' => '456']
});
```

### Query Parameters

```php
// URL: /search?q=hello&page=2
Router::get('/search', function($request) {
    $query = $request->getQueryParam('q');           // "hello"
    $page = $request->getQueryParam('page', 1);      // "2" (or 1 if not set)
    $all = $request->getQueryParams();               // ['q' => 'hello', 'page' => '2']
});
```

### Request Body

```php
Router::post('/users', function($request) {
    // For JSON requests (Content-Type: application/json)
    $data = $request->getParsedBody();
    $name = $request->getBodyParam('name');

    // Raw body string
    $raw = $request->getBody();
});
```

### Headers

```php
Router::get('/api/data', function($request) {
    $auth = $request->getHeaderLine('Authorization');
    $contentType = $request->getHeaderLine('Content-Type');

    if ($request->hasHeader('X-Custom')) {
        // ...
    }

    $allHeaders = $request->getHeaders();
});
```

### Request Information

```php
Router::any('/info', function($request) {
    $method = $request->getMethod();    // "GET", "POST", etc.
    $uri = $request->getUri();          // "/info?foo=bar"
    $path = $request->getPath();        // "info"

    if ($request->isMethod('POST')) { /* ... */ }
    if ($request->isAjax()) { /* ... */ }
    if ($request->isJson()) { /* ... */ }
    if ($request->accepts('application/json')) { /* ... */ }
});
```

### File Uploads

```php
Router::post('/upload', function($request) {
    if ($request->hasUploadedFile('avatar')) {
        $file = $request->getUploadedFile('avatar');
        // $file contains: name, type, tmp_name, error, size
    }

    $allFiles = $request->getUploadedFiles();
});
```

### Server Parameters

```php
Router::get('/debug', function($request) {
    $ip = $request->getServerParam('REMOTE_ADDR');
    $host = $request->getServerParam('HTTP_HOST');
    $all = $request->getServerParams();
});
```

### Immutable Modifications

Like PSR-7, `ServerRequest` is immutable. Modifications return new instances:

```php
Router::get('/users/:id', function($request) {
    // Add custom attributes
    $request = $request->withAttribute('user', $user);
    $request = $request->withAttribute('permissions', array('read', 'write'));

    // Later retrieve them
    $user = $request->getAttribute('user');
});
```

## JsonResponse

The `JsonResponse` class provides a fluent API for building JSON responses:

```php
use PhpCompatible\Router\JsonResponse;

Router::get('/api/users', function() {
    return JsonResponse::ok(array(
        'users' => array(
            array('id' => 1, 'name' => 'Alice'),
        )
    ));
});
```

### Factory Methods

Common HTTP status codes have convenient factory methods:

```php
// Success responses
JsonResponse::ok($data);           // 200 OK
JsonResponse::created($data);      // 201 Created
JsonResponse::noContent();         // 204 No Content

// Client error responses
JsonResponse::badRequest($data);   // 400 Bad Request
JsonResponse::unauthorized($data); // 401 Unauthorized
JsonResponse::forbidden($data);    // 403 Forbidden
JsonResponse::notFound($data);     // 404 Not Found

// Server error responses
JsonResponse::serverError($data);  // 500 Internal Server Error
```

### Custom Status Codes

```php
$response = new JsonResponse($data, 418); // I'm a teapot
```

### Fluent Modifications

`JsonResponse` is also immutable:

```php
$response = JsonResponse::ok(array('status' => 'pending'))
    ->withStatus(202)
    ->withHeader('X-Custom', 'value')
    ->withData(array('status' => 'accepted'));
```

### Response Properties

```php
$response = JsonResponse::ok(array('key' => 'value'));

$data = $response->getData();         // ['key' => 'value']
$code = $response->getStatusCode();   // 200
$headers = $response->getHeaders();   // []
$body = $response->getBody();         // '{"key":"value"}'
```

## HtmlResponse

The `HtmlResponse` class is for returning HTML content:

```php
use PhpCompatible\Router\HtmlResponse;

Router::get('/', function() {
    return HtmlResponse::ok('<h1>Welcome</h1><p>Hello World</p>');
});
```

### Factory Methods

```php
HtmlResponse::ok($content);          // 200 OK
HtmlResponse::notFound($content);    // 404 Not Found
HtmlResponse::forbidden($content);   // 403 Forbidden
HtmlResponse::serverError($content); // 500 Internal Server Error
```

### Rendering Views

Load HTML from a file with variable extraction:

```php
Router::get('/users/:id', function($request) {
    $user = get_user($request->getParam('id'));

    return HtmlResponse::view(__DIR__ . '/views/user.php', array(
        'user' => $user,
        'title' => 'User Profile'
    ));
});
```

In `views/user.php`:
```php
<h1><?= htmlspecialchars($title) ?></h1>
<p>Name: <?= htmlspecialchars($user['name']) ?></p>
```

### Fluent Modifications

```php
$response = HtmlResponse::ok('<h1>Hello</h1>')
    ->withStatus(200)
    ->withHeader('X-Custom', 'value')
    ->withContent('<h1>Updated</h1>');
```

## DownloadResponse

The `DownloadResponse` class handles file downloads:

```php
use PhpCompatible\Router\DownloadResponse;

Router::get('/export/users', function() {
    $csv = "id,name,email\n1,Alice,alice@example.com\n";
    return DownloadResponse::csv($csv, 'users.csv');
});
```

### Factory Methods for Common Types

```php
// Documents
DownloadResponse::pdf($content, 'document.pdf');
DownloadResponse::csv($content, 'data.csv');
DownloadResponse::json($data, 'data.json');  // Auto-encodes array
DownloadResponse::xml($content, 'data.xml');
DownloadResponse::text($content, 'readme.txt');

// Web assets
DownloadResponse::html($content, 'page.html');
DownloadResponse::javascript($content, 'script.js');
DownloadResponse::css($content, 'style.css');

// Archives & binary
DownloadResponse::zip($content, 'archive.zip');
DownloadResponse::binary($content, 'file.bin');
```

### Download from File Path

```php
Router::get('/files/:id', function($request) {
    $filepath = '/storage/files/' . $request->getParam('id');

    // Auto-detects MIME type and uses original filename
    return DownloadResponse::file($filepath);

    // Or customize filename and MIME type
    return DownloadResponse::file($filepath, 'custom-name.pdf', 'application/pdf');
});
```

### Fluent Modifications

```php
$response = DownloadResponse::csv($data, 'export.csv')
    ->withFilename('users-2024.csv')
    ->withHeader('X-Generated-At', date('c'));
```

### Inline Display vs Download

By default, downloads prompt the user to save. For inline display (e.g., viewing a PDF in browser):

```php
// Download (Content-Disposition: attachment)
return DownloadResponse::pdf($content, 'document.pdf');

// Inline display (no filename = no Content-Disposition header)
return new DownloadResponse($content, PDF_CONTENT);
```

## Single Action Controllers

The PSR-7 style works seamlessly with Single Action Controllers:

```php
use PhpCompatible\Router\ServerRequest;
use PhpCompatible\Router\JsonResponse;

class ShowUser
{
    public function __invoke(ServerRequest $request)
    {
        $id = $request->getParam('id');

        $user = $this->findUser($id);
        if (!$user) {
            return JsonResponse::notFound(array(
                'error' => 'User not found'
            ));
        }

        return JsonResponse::ok(array('user' => $user));
    }

    private function findUser($id)
    {
        // Database lookup...
        return array('id' => $id, 'name' => 'Alice');
    }
}

// Register the controller
Router::get('/users/:id', ShowUser::class);
```

### Full CRUD Example

```php
<?php
use PhpCompatible\Router\ServerRequest;
use PhpCompatible\Router\JsonResponse;
use PhpCompatible\Router\Router;

class ListUsers
{
    public function __invoke(ServerRequest $request)
    {
        $page = $request->getQueryParam('page', 1);
        $users = $this->getUsers($page);
        return JsonResponse::ok(array('users' => $users, 'page' => $page));
    }
}

class CreateUser
{
    public function __invoke(ServerRequest $request)
    {
        $data = $request->getParsedBody();

        if (empty($data['name'])) {
            return JsonResponse::badRequest(array(
                'error' => 'Name is required'
            ));
        }

        $user = $this->createUser($data);
        return JsonResponse::created(array('user' => $user));
    }
}

class ShowUser
{
    public function __invoke(ServerRequest $request)
    {
        $id = $request->getParam('id');
        $user = $this->findUser($id);

        if (!$user) {
            return JsonResponse::notFound();
        }

        return JsonResponse::ok(array('user' => $user));
    }
}

class UpdateUser
{
    public function __invoke(ServerRequest $request)
    {
        $id = $request->getParam('id');
        $data = $request->getParsedBody();

        $user = $this->updateUser($id, $data);
        return JsonResponse::ok(array('user' => $user));
    }
}

class DeleteUser
{
    public function __invoke(ServerRequest $request)
    {
        $id = $request->getParam('id');
        $this->deleteUser($id);
        return JsonResponse::noContent();
    }
}

// routes/api.php
Router::group('/api/users', function() {
    Router::get('/', ListUsers::class);
    Router::post('/', CreateUser::class);
    Router::get('/:id', ShowUser::class);
    Router::put('/:id', UpdateUser::class);
    Router::delete('/:id', DeleteUser::class);
});
```

## Mixing Styles

You can mix PSR-7 style with traditional functions in the same application:

```php
Router::run(function() {
    // PSR-7 style
    Router::get('/api/users', function($request) {
        return JsonResponse::ok(array('users' => array()));
    });

    // Traditional style
    Router::get('/legacy', function() {
        $data = json_body();
        echo json_response(array('received' => $data));
    });

    // Hybrid - use request object but echo response
    Router::post('/hybrid', function($request) {
        $data = $request->getParsedBody();
        echo json_response(array('data' => $data));
    });
});
```

## Testing

The PSR-7 style makes testing easier:

```php
class ShowUserTest extends TestCase
{
    public function test_returns_user()
    {
        // Arrange
        $_GET[':id'] = '123';
        $_SERVER['REQUEST_METHOD'] = 'GET';

        $controller = new ShowUser();
        $request = new ServerRequest();

        // Act
        $response = $controller($request);

        // Assert
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('123', $response->getData()['user']['id']);
    }

    public function test_returns_404_for_missing_user()
    {
        $_GET[':id'] = '999';
        $_SERVER['REQUEST_METHOD'] = 'GET';

        $controller = new ShowUser();
        $response = $controller(new ServerRequest());

        $this->assertEquals(404, $response->getStatusCode());
    }
}
```
