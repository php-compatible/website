---
sidebar_position: 11
sidebar_label: PSR-7 Style
---

# PSR-7 Style with File-Based Routing

You can use PSR-7 compatible request and response objects with file-based routing for a more testable, object-oriented approach.

## ServerRequest

The `ServerRequest` class wraps the current HTTP request:

**File: `/wwwroot/api/users.php`**

```php
<?php
require_once __DIR__ . '/../../vendor/autoload.php';

use PhpCompatible\Router\ServerRequest;

file_router(function() {
    route(method(GET), url_path_params('/:id'), function() {
        $request = new ServerRequest();

        $id = $request->getRouteParam(':id');
        $include = $request->getQueryParam('include', '');

        echo json_response(HTTP_OK, array(
            'user_id' => $id,
            'include' => $include
        ));
    });
});
```

### Request Methods

```php
$request = new ServerRequest();

// Route parameters (from :param placeholders)
$id = $request->getRouteParam(':id');
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
```

## JsonResponse

Return structured JSON responses:

**File: `/wwwroot/api/users.php`**

```php
<?php
require_once __DIR__ . '/../../vendor/autoload.php';

use PhpCompatible\Router\ServerRequest;
use PhpCompatible\Router\JsonResponse;

file_router(function() {
    route(method(GET), url_path('/'), function() {
        $users = get_all_users();
        $response = JsonResponse::response(HTTP_OK, array('users' => $users));
        $response->send();
    });

    route(method(POST), url_path('/'), function() {
        $request = new ServerRequest();
        $data = $request->getParsedBody();

        if (empty($data['name'])) {
            $response = JsonResponse::response(HTTP_BAD_REQUEST, array('error' => 'Name required'));
            $response->send();
            stop();
        }

        $user = create_user($data);
        $response = JsonResponse::response(HTTP_CREATED, array('user' => $user));
        $response->send();
    });
});
```

### Common Status Codes

```php
JsonResponse::response(HTTP_OK, $data);                    // 200
JsonResponse::response(HTTP_CREATED, $data);              // 201
JsonResponse::response(HTTP_NO_CONTENT);                  // 204
JsonResponse::response(HTTP_BAD_REQUEST, $data);          // 400
JsonResponse::response(HTTP_UNAUTHORIZED, $data);         // 401
JsonResponse::response(HTTP_FORBIDDEN, $data);            // 403
JsonResponse::response(HTTP_NOT_FOUND, $data);            // 404
JsonResponse::response(HTTP_INTERNAL_SERVER_ERROR, $data); // 500
```

## HtmlResponse

Return HTML with proper headers:

**File: `/wwwroot/admin/index.php`**

```php
<?php
require_once __DIR__ . '/../../vendor/autoload.php';

use PhpCompatible\Router\HtmlResponse;

file_router(function() {
    route(method(GET), url_path('/'), function() {
        $html = render_template('dashboard.php', array(
            'title' => 'Admin Dashboard',
            'stats' => get_dashboard_stats()
        ));
        $response = HtmlResponse::response(HTTP_OK, $html);
        $response->send();
    });
});
```

:::tip Templates
For a PHP 5.5+ compatible templating solution, see [php-compatible/templates](/docs/category/templates).
:::

## Single Action Controllers

Use invokable classes with file-based routing:

**File: `/wwwroot/api/users.php`**

```php
<?php
require_once __DIR__ . '/../../vendor/autoload.php';

use PhpCompatible\Router\ServerRequest;
use PhpCompatible\Router\JsonResponse;

class ShowUser
{
    public function __invoke(ServerRequest $request)
    {
        $id = $request->getRouteParam(':id');
        $user = $this->findUser($id);

        if (!$user) {
            return JsonResponse::response(HTTP_NOT_FOUND, array('error' => 'User not found'));
        }

        return JsonResponse::response(HTTP_OK, array('user' => $user));
    }

    private function findUser($id)
    {
        return array('id' => $id, 'name' => 'Alice');
    }
}

file_router(function() {
    route(method(GET), url_path('/'), function() {
        echo json_response(HTTP_OK, array('users' => get_all_users()));
    });

    route(method(GET), url_path_params('/:id'), ShowUser::class);
});
```

## Benefits for Legacy Code

Using PSR-7 style in file-based routing helps prepare for framework migration:

```php
// Today: file-based with PSR-7
class ShowUser
{
    public function __invoke(ServerRequest $request)
    {
        $id = $request->getRouteParam(':id');
        return JsonResponse::response(HTTP_OK, array('user' => get_user($id)));
    }
}

// Tomorrow: same controller works in Laravel/Symfony
// with minimal changes to the request/response objects
```
