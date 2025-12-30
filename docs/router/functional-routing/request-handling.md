---
sidebar_position: 5
sidebar_label: Request Handling
---

# Request Handling

## JSON Body

Parse JSON request body with `json_body()`:

```php
route(method(POST), url_path('/api/users'), function() {
    $data = json_body();

    if (empty($data['name'])) {
        echo json_response(HTTP_BAD_REQUEST, array('error' => 'Name required'));
        stop();
    }

    echo json_response(HTTP_CREATED, array('user' => $data));
});
```

## Form Data

Access POST form data with `form_body()`:

```php
route(method(POST), url_path('/contact'), function() {
    $form = form_body();  // $_POST data
    $name = $form['name'];
    $email = $form['email'];

    // Process form...
    echo html_response(HTTP_OK, '<p>Thanks, ' . htmlspecialchars($name) . '!</p>');
});
```

## File Uploads

Handle file uploads with `has_file()`, `file_body()`, and `move_file()`:

```php
route(method(POST), url_path('/upload'), function() {
    if (!has_file('document')) {
        echo json_response(HTTP_BAD_REQUEST, array('error' => 'No file uploaded'));
        stop();
    }

    $file = file_body('document');
    move_file('document', '/uploads/' . $file['name']);

    echo json_response(HTTP_OK, array('uploaded' => $file['name']));
});
```

## Request Headers

Read headers with `request_header()`:

```php
route(method(GET), url_path('/api/protected'), function() {
    $auth = request_header('Authorization');

    if (empty($auth)) {
        echo json_response(HTTP_UNAUTHORIZED, array('error' => 'Unauthorized'));
        stop();
    }

    echo json_response(HTTP_OK, array('data' => 'secret'));
});
```

## Content Negotiation

Check the Accept header with `accept()`:

```php
route(method(GET), url_path('/data'), function() {
    $data = array('message' => 'Hello');

    if (accept(JSON_CONTENT)) {
        echo json_response(HTTP_OK, $data);
    } else {
        echo html_response(HTTP_OK, '<p>' . $data['message'] . '</p>');
    }
});
```
