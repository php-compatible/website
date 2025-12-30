---
sidebar_position: 11
sidebar_label: PSR-7 Style
---

# PSR-7 Style with Modern Routing

Modern routing has built-in support for PSR-7 compatible request and response objects. This is the most framework-ready approach.

## Automatic Request Injection

When your route handler accepts a parameter, the router automatically injects a `ServerRequest`:

```php
use PhpCompatible\Router\Router;

Router::run(function() {
    // With parameter - gets ServerRequest automatically
    Router::get('/users/:id', function($request) {
        $id = $request->getParam('id');
        return array('user_id' => $id);
    });

    // Without parameter - use traditional approach
    Router::get('/users', function() {
        return array('users' => get_all_users());
    });
});
```

## ServerRequest Methods

```php
Router::get('/example', function($request) {
    // Route parameters (from :param placeholders)
    $id = $request->getParam('id');           // Without colon
    $id = $request->getRouteParam(':id');     // With colon
    $params = $request->getAttributes();

    // Query parameters (?key=value)
    $page = $request->getQueryParam('page', 1);
    $all = $request->getQueryParams();

    // Request body (JSON)
    $data = $request->getParsedBody();
    $name = $request->getBodyParam('name');

    // Headers
    $auth = $request->getHeaderLine('Authorization');
    $hasAuth = $request->hasHeader('Authorization');

    // Request info
    $method = $request->getMethod();
    $uri = $request->getUri();
    $isPost = $request->isMethod('POST');
    $isAjax = $request->isAjax();
    $isJson = $request->isJson();
    $acceptsJson = $request->accepts('application/json');
});
```

## Returning Responses

### Return Arrays (Auto JSON)

```php
Router::get('/api/users', function() {
    return array('users' => get_all_users());
});
// Output: {"users":[...]}
```

### Return JsonResponse

```php
use PhpCompatible\Router\JsonResponse;

Router::get('/api/users', function() {
    return JsonResponse::ok(array('users' => array()));
});

Router::post('/api/users', function($request) {
    $data = $request->getParsedBody();

    if (empty($data['name'])) {
        return JsonResponse::badRequest(array('error' => 'Name required'));
    }

    $user = create_user($data);
    return JsonResponse::created(array('user' => $user));
});

Router::get('/api/users/:id', function($request) {
    $user = find_user($request->getParam('id'));

    if (!$user) {
        return JsonResponse::notFound(array('error' => 'User not found'));
    }

    return JsonResponse::ok(array('user' => $user));
});
```

### Factory Methods

```php
JsonResponse::ok($data);           // 200
JsonResponse::created($data);      // 201
JsonResponse::noContent();         // 204
JsonResponse::badRequest($data);   // 400
JsonResponse::unauthorized($data); // 401
JsonResponse::forbidden($data);    // 403
JsonResponse::notFound($data);     // 404
JsonResponse::serverError($data);  // 500
```

## HtmlResponse

```php
use PhpCompatible\Router\HtmlResponse;

Router::get('/', function() {
    return HtmlResponse::response(HTTP_OK, '<h1>Welcome</h1>');
});

Router::get('/users/:id', function($request) {
    $user = get_user($request->getParam('id'));

    return HtmlResponse::view(__DIR__ . '/views/user.php', array(
        'user' => $user,
        'title' => 'User Profile'
    ));
});
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
            return JsonResponse::notFound(array('error' => 'User not found'));
        }

        return JsonResponse::ok(array('user' => $user));
    }

    private function findUser($id)
    {
        return array('id' => $id, 'name' => 'Alice');
    }
}

Router::get('/users/:id', ShowUser::class);
```

## Full CRUD Example

```php
use PhpCompatible\Router\ServerRequest;
use PhpCompatible\Router\JsonResponse;
use PhpCompatible\Router\Router;

class ListUsers
{
    public function __invoke(ServerRequest $request)
    {
        $page = $request->getQueryParam('page', 1);
        return JsonResponse::ok(array('users' => get_users($page)));
    }
}

class CreateUser
{
    public function __invoke(ServerRequest $request)
    {
        $data = $request->getParsedBody();

        if (empty($data['name'])) {
            return JsonResponse::badRequest(array('error' => 'Name required'));
        }

        $user = create_user($data);
        return JsonResponse::created(array('user' => $user));
    }
}

class ShowUser
{
    public function __invoke(ServerRequest $request)
    {
        $user = find_user($request->getParam('id'));
        return $user
            ? JsonResponse::ok(array('user' => $user))
            : JsonResponse::notFound();
    }
}

class UpdateUser
{
    public function __invoke(ServerRequest $request)
    {
        $user = update_user(
            $request->getParam('id'),
            $request->getParsedBody()
        );
        return JsonResponse::ok(array('user' => $user));
    }
}

class DeleteUser
{
    public function __invoke(ServerRequest $request)
    {
        delete_user($request->getParam('id'));
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

## Testing

The PSR-7 style makes unit testing easy:

```php
class ShowUserTest extends TestCase
{
    public function test_returns_user()
    {
        $_GET[':id'] = '123';
        $_SERVER['REQUEST_METHOD'] = 'GET';

        $controller = new ShowUser();
        $response = $controller(new ServerRequest());

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('123', $response->getData()['user']['id']);
    }

    public function test_returns_404_for_missing_user()
    {
        $_GET[':id'] = '999';

        $controller = new ShowUser();
        $response = $controller(new ServerRequest());

        $this->assertEquals(404, $response->getStatusCode());
    }
}
```
