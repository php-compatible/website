---
sidebar_position: 9
sidebar_label: Controllers
---

# Controllers

## Closure Handlers

The simplest handler is an inline closure:

```php
use PhpCompatible\Router\Router;

Router::get('/users', function() {
    return array('users' => get_all_users());
});
```

## Single Action Controllers

Use invokable classes as route handlers:

```php
class ShowUser
{
    public function __invoke($request)
    {
        $id = $request->getParam('id');
        return array('user' => get_user($id));
    }
}

Router::get('/users/:id', ShowUser::class);
```

## Controllers with Dependencies

```php
class CreateUser
{
    private $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function __invoke($request)
    {
        $data = $request->getParsedBody();
        $user = $this->db->insert('users', $data);
        return JsonResponse::created(array('user' => $user));
    }
}

Router::post('/users', CreateUser::class);
```

## Controllers with Request Injection

Controllers receive a `ServerRequest` object:

```php
use PhpCompatible\Router\ServerRequest;
use PhpCompatible\Router\JsonResponse;

class UpdateUser
{
    public function __invoke(ServerRequest $request)
    {
        $id = $request->getRouteParam(':id');
        $data = $request->getParsedBody();

        $user = update_user($id, $data);

        if (!$user) {
            return JsonResponse::notFound(array('error' => 'User not found'));
        }

        return JsonResponse::ok(array('user' => $user));
    }
}

Router::put('/users/:id', UpdateUser::class);
```

## Resource Controllers

Organize CRUD operations in a single controller:

```php
class UserController
{
    public static function index()
    {
        return array('users' => get_all_users());
    }

    public static function show()
    {
        $id = $_GET[':id'];
        return array('user' => get_user($id));
    }

    public static function store()
    {
        $data = json_body();
        $user = create_user($data);
        return JsonResponse::created(array('user' => $user));
    }

    public static function update()
    {
        $id = $_GET[':id'];
        $data = json_body();
        return array('user' => update_user($id, $data));
    }

    public static function destroy()
    {
        $id = $_GET[':id'];
        delete_user($id);
        return JsonResponse::noContent();
    }
}

Router::run(function() {
    Router::group('/api', function() {
        Router::get('/users', 'UserController::index');
        Router::post('/users', 'UserController::store');
        Router::get('/users/:id', 'UserController::show');
        Router::put('/users/:id', 'UserController::update');
        Router::delete('/users/:id', 'UserController::destroy');
    });
});
```

## Array Callable Handlers

```php
$controller = new UserController();

Router::run(function() use ($controller) {
    Router::get('/users', array($controller, 'index'));
    Router::get('/users/:id', array($controller, 'show'));
});
```
