---
sidebar_position: 2
sidebar_label: HTTP Methods
---

# HTTP Methods

Use the `method()` function to match HTTP methods.

## Basic Method Matching

```php
route(method(GET), url_path('/users'), $handler);
route(method(POST), url_path('/users'), $handler);
route(method(PUT), url_path('/users'), $handler);
route(method(DELETE), url_path('/users'), $handler);
route(method(PATCH), url_path('/users'), $handler);
route(method(HEAD), url_path('/users'), $handler);
route(method(OPTIONS), url_path('/users'), $handler);
```

## Match Any Method

Use the `ALL` constant to match any HTTP method:

```php
route(ALL, url_path('/webhook'), function() {
    // Handles any HTTP method
});
```

:::tip Prefer Explicit Methods
While `ALL` is available, prefer explicit methods like `GET`, `POST`, etc. This documents your API contract and makes future framework migrations easier.
:::

## Custom Method Logic

Since predicates are just booleans, you can combine them:

```php
$isGetOrPost = method(GET) || method(POST);
route($isGetOrPost, url_path('/form'), function() {
    // Handles GET and POST
});
```

## RESTful Resource Example

```php
routerGroup('/api', function() {
    // List all users
    route(method(GET), url_path('/users'), function() {
        echo json_response(HTTP_OK, array('users' => get_all_users()));
    });

    // Get single user
    route(method(GET), url_path_params('/users/:id'), function() {
        $user = get_user($_GET[':id']);
        echo json_response(HTTP_OK, array('user' => $user));
    });

    // Create user
    route(method(POST), url_path('/users'), function() {
        $data = json_body();
        $user = create_user($data);
        echo json_response(HTTP_CREATED, array('user' => $user));
    });

    // Update user
    route(method(PUT), url_path_params('/users/:id'), function() {
        $data = json_body();
        $user = update_user($_GET[':id'], $data);
        echo json_response(HTTP_OK, array('user' => $user));
    });

    // Delete user
    route(method(DELETE), url_path_params('/users/:id'), function() {
        delete_user($_GET[':id']);
        echo json_response(HTTP_NO_CONTENT, null);
    });
});
```
