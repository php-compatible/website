---
sidebar_position: 9
sidebar_label: Controllers
---

# Controllers

## Closure Handlers

The simplest handler is an inline closure:

```php
route(method(GET), url_path('/users'), function() {
    echo json_response(HTTP_OK, array('users' => get_all_users()));
});
```

## Function Handlers

Pass a function name as a string:

```php
function show_users() {
    echo json_response(HTTP_OK, array('users' => get_all_users()));
}

route(method(GET), url_path('/users'), 'show_users');
```

## Single Action Controllers

Pass a class name - it will be instantiated and invoked:

```php
class ShowDashboard
{
    public function __invoke()
    {
        echo html_response(HTTP_OK, '<h1>Dashboard</h1>');
    }
}

route(method(GET), url_path('/dashboard'), ShowDashboard::class);
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
        return JsonResponse::response(HTTP_OK, array('user_id' => $id));
    }
}

route(method(GET), url_path_params('/users/:id'), ShowUser::class);
```

## Static Method Handlers

```php
class UserController
{
    public static function index()
    {
        echo json_response(HTTP_OK, array('users' => array()));
    }

    public static function show()
    {
        $id = $_GET[':id'];
        echo json_response(HTTP_OK, array('user_id' => $id));
    }
}

route(method(GET), url_path('/users'), 'UserController::index');
route(method(GET), url_path_params('/users/:id'), 'UserController::show');
```

## Array Callable Handlers

```php
$controller = new UserController();

route(method(GET), url_path('/users'), array($controller, 'index'));
route(method(GET), url_path_params('/users/:id'), array($controller, 'show'));
```
