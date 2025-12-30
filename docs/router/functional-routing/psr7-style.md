---
sidebar_position: 11
sidebar_label: PSR-7 Style
---

# PSR-7 Style with Functional Routing

You can use PSR-7 compatible request and response objects with functional routing for a more testable, object-oriented approach.

## ServerRequest

The `ServerRequest` class wraps the current HTTP request:

```php
use PhpCompatible\Router\ServerRequest;

router(function() {
    route(method(GET), url_path_params('/users/:id'), function() {
        $request = new ServerRequest();

        $id = $request->getRouteParam(':id');
        $filter = $request->getQueryParam('filter', 'all');

        echo json_response(HTTP_OK, array(
            'user_id' => $id,
            'filter' => $filter
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
$isJson = $request->isJson();
```

## JsonResponse

Return structured JSON responses:

```php
use PhpCompatible\Router\JsonResponse;

router(function() {
    route(method(GET), url_path('/api/users'), function() {
        $users = get_all_users();
        $response = JsonResponse::response(HTTP_OK, array('users' => $users));
        $response->send();
    });

    route(method(POST), url_path('/api/users'), function() {
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

```php
use PhpCompatible\Router\HtmlResponse;

router(function() {
    route(method(GET), url_path('/'), function() {
        $response = HtmlResponse::response(HTTP_OK, '<h1>Welcome</h1>');
        $response->send();
    });

    route(method(GET), url_path_params('/users/:id'), function() {
        $request = new ServerRequest();
        $id = $request->getRouteParam(':id');
        $user = get_user($id);

        $html = render_template('user.php', array('user' => $user));
        $response = HtmlResponse::response(HTTP_OK, $html);
        $response->send();
    });
});
```

:::tip Templates
For a blazing fast PHP templating solution, see [php-compatible/templates](/docs/category/templates).
:::

## Single Action Controllers

Use invokable classes with functional routing:

```php
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
        // Database lookup
        return array('id' => $id, 'name' => 'Alice');
    }
}

router(function() {
    route(method(GET), url_path_params('/users/:id'), ShowUser::class);
});
```

## Mixing Styles

You can mix PSR-7 style with traditional functions:

```php
router(function() {
    // PSR-7 style
    route(method(GET), url_path('/api/users'), function() {
        $request = new ServerRequest();
        $page = $request->getQueryParam('page', 1);
        $response = JsonResponse::response(HTTP_OK, array('users' => array(), 'page' => $page));
        $response->send();
    });

    // Traditional style
    route(method(GET), url_path('/legacy'), function() {
        echo json_response(HTTP_OK, array('legacy' => true));
    });
});
```
