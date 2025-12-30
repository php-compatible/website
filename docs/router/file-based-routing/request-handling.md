---
sidebar_position: 5
sidebar_label: Request Handling
---

# Request Handling

:::tip PSR-7 Style
For a more testable, object-oriented approach to request handling, see [PSR-7 Style](./psr7-style) which provides `ServerRequest` with methods like `getParsedBody()`, `getQueryParam()`, and `getHeaderLine()`.
:::

## JSON Body

Parse JSON request body with `json_body()`:

```php
file_router(function() {
    route(method(POST), url_path('/'), function() {
        $data = json_body();

        if (empty($data['name'])) {
            echo json_response(HTTP_BAD_REQUEST, array('error' => 'Name required'));
            stop();
        }

        echo json_response(HTTP_CREATED, array('user' => $data));
    });
});
```

## Form Data

Access POST form data with `form_body()`:

```php
file_router(function() {
    route(method(POST), url_path('/contact'), function() {
        $form = form_body();
        $name = $form['name'];
        $email = $form['email'];
        $message = $form['message'];

        send_contact_email($name, $email, $message);
        echo html_response(HTTP_OK, '<p>Thanks for your message!</p>');
    });
});
```

## File Uploads

Handle file uploads with `has_file()`, `file_body()`, and `move_file()`:

```php
file_router(function() {
    route(method(POST), url_path('/upload'), function() {
        if (!has_file('document')) {
            echo json_response(HTTP_BAD_REQUEST, array('error' => 'No file uploaded'));
            stop();
        }

        $file = file_body('document');

        // Validate file type
        $allowed = array('pdf', 'doc', 'docx');
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        if (!in_array($ext, $allowed)) {
            echo json_response(HTTP_BAD_REQUEST, array('error' => 'Invalid file type'));
            stop();
        }

        move_file('document', '/uploads/' . $file['name']);
        echo json_response(HTTP_OK, array('uploaded' => $file['name']));
    });
});
```

## Request Headers

Read headers with `request_header()`:

```php
file_router(function() {
    route(method(GET), url_path('/'), function() {
        $auth = request_header('Authorization');
        $apiKey = request_header('X-API-Key');

        if (empty($auth) && empty($apiKey)) {
            echo json_response(HTTP_UNAUTHORIZED, array('error' => 'Unauthorized'));
            stop();
        }

        echo json_response(HTTP_OK, array('data' => 'secret'));
    });
});
```

## Content Negotiation

Check the Accept header with `accept()`:

```php
file_router(function() {
    route(method(GET), url_path('/'), function() {
        $users = get_all_users();

        if (accept(JSON_CONTENT)) {
            echo json_response(HTTP_OK, array('users' => $users));
        } else {
            $html = '<ul>';
            foreach ($users as $user) {
                $html .= '<li>' . htmlspecialchars($user['name']) . '</li>';
            }
            $html .= '</ul>';
            echo html_response(HTTP_OK, $html);
        }
    });
});
```

## Query Parameters

Access query string parameters from `$_GET`:

```php
file_router(function() {
    // GET /api/users?page=2&limit=10
    route(method(GET), url_path('/'), function() {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;

        $users = get_users_paginated($page, $limit);
        echo json_response(HTTP_OK, array(
            'users' => $users,
            'page' => $page,
            'limit' => $limit
        ));
    });
});
```
