---
sidebar_position: 9
sidebar_label: Controllers
---

# Controllers

## Closure Handlers

The simplest handler is an inline closure:

```php
file_router(function() {
    route(method(GET), url_path('/'), function() {
        echo json_response(HTTP_OK, array('users' => get_all_users()));
    });
});
```

## Function Handlers

Pass a function name as a string:

```php
function list_users() {
    echo json_response(HTTP_OK, array('users' => get_all_users()));
}

function show_user() {
    $user = get_user($_GET[':id']);
    echo json_response(HTTP_OK, array('user' => $user));
}

file_router(function() {
    route(method(GET), url_path('/'), 'list_users');
    route(method(GET), url_path_params('/:id'), 'show_user');
});
```

## Single Action Controllers

Pass a class name - it will be instantiated and invoked:

```php
class ListUsers
{
    public function __invoke()
    {
        echo json_response(HTTP_OK, array('users' => get_all_users()));
    }
}

class ShowUser
{
    public function __invoke()
    {
        $user = get_user($_GET[':id']);
        echo json_response(HTTP_OK, array('user' => $user));
    }
}

file_router(function() {
    route(method(GET), url_path('/'), ListUsers::class);
    route(method(GET), url_path_params('/:id'), ShowUser::class);
});
```

## Controllers with Request Injection

Controllers can receive a `ServerRequest` object:

```php
use PhpCompatible\Router\ServerRequest;
use PhpCompatible\Router\JsonResponse;

class ShowUser
{
    public function __invoke(ServerRequest $request)
    {
        $id = $request->getRouteParam(':id');
        $user = get_user($id);

        if (!$user) {
            return JsonResponse::notFound(array('error' => 'User not found'));
        }

        return JsonResponse::ok(array('user' => $user));
    }
}

file_router(function() {
    route(method(GET), url_path_params('/:id'), ShowUser::class);
});
```

## Static Method Handlers

```php
class UserController
{
    public static function index()
    {
        echo json_response(HTTP_OK, array('users' => get_all_users()));
    }

    public static function show()
    {
        echo json_response(HTTP_OK, array('user' => get_user($_GET[':id'])));
    }

    public static function store()
    {
        $data = json_body();
        echo json_response(HTTP_CREATED, array('user' => create_user($data)));
    }
}

file_router(function() {
    route(method(GET), url_path('/'), 'UserController::index');
    route(method(GET), url_path_params('/:id'), 'UserController::show');
    route(method(POST), url_path('/'), 'UserController::store');
});
```

## Array Callable Handlers

```php
$controller = new UserController();

file_router(function() use ($controller) {
    route(method(GET), url_path('/'), array($controller, 'index'));
    route(method(GET), url_path_params('/:id'), array($controller, 'show'));
});
```
