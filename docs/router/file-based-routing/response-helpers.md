---
sidebar_position: 6
sidebar_label: Response Helpers
---

# Response Helpers

## JSON Response

```php
file_router(function() {
    route(method(GET), url_path('/'), function() {
        echo json_response(HTTP_OK, array('status' => 'ok'));
        // Sets Content-Type: application/json
        // Output: {"status":"ok"}
    });
});
```

## HTML Response

```php
file_router(function() {
    route(method(GET), url_path('/'), function() {
        echo html_response(HTTP_OK, '<h1>Hello World</h1>');
        // Sets Content-Type: text/html
    });
});
```

## Text Response

```php
file_router(function() {
    route(method(GET), url_path('/robots.txt'), function() {
        echo text_response(HTTP_OK, "User-agent: *\nAllow: /");
        // Sets Content-Type: text/plain
    });
});
```

## XML Response

```php
file_router(function() {
    route(method(GET), url_path('/feed'), function() {
        $xml = '<?xml version="1.0"?><rss><channel>...</channel></rss>';
        echo xml_response(HTTP_OK, $xml);
        // Sets Content-Type: text/xml
    });
});
```

## HTTP Status Codes

Use status code constants with responses:

```php
file_router(function() {
    route(method(POST), url_path('/'), function() {
        $data = json_body();
        $user = create_user($data);
        echo json_response(HTTP_CREATED, array('user' => $user));
    });

    route(method(GET), url_path_params('/:id'), function() {
        $user = find_user($_GET[':id']);
        if (!$user) {
            echo json_response(HTTP_NOT_FOUND, array('error' => 'User not found'));
            stop();
        }
        echo json_response(HTTP_OK, array('user' => $user));
    });
});
```

## Response Headers

```php
file_router(function() {
    route(method(GET), url_path('/'), function() {
        response_header('X-Custom-Header', 'value');
        response_header('Cache-Control', 'max-age=3600');
        echo json_response(HTTP_OK, array('cached' => true));
    });
});
```

## File Downloads

```php
file_router(function() {
    // CSV Export
    route(method(GET), url_path('/export/csv'), function() {
        $csv = "id,name,email\n";
        foreach (get_all_users() as $user) {
            $csv .= "{$user['id']},{$user['name']},{$user['email']}\n";
        }
        download_csv($csv, 'users.csv');
    });

    // JSON Export
    route(method(GET), url_path('/export/json'), function() {
        $data = array('users' => get_all_users());
        download_json($data, 'users.json');
    });

    // File Download
    route(method(GET), url_path_params('/files/:id'), function() {
        $file = get_file($_GET[':id']);
        download_file($file['path'], $file['name']);
    });
});
```
