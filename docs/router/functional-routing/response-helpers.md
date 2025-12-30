---
sidebar_position: 6
sidebar_label: Response Helpers
---

# Response Helpers

## JSON Response

```php
echo json_response(HTTP_OK, array('status' => 'ok'));
// Sets Content-Type: application/json
// Output: {"status":"ok"}
```

## HTML Response

```php
echo html_response(HTTP_OK, '<h1>Hello World</h1>');
// Sets Content-Type: text/html
```

## Text Response

```php
echo text_response(HTTP_OK, 'Plain text content');
// Sets Content-Type: text/plain
```

## XML Response

```php
echo xml_response(HTTP_OK, '<?xml version="1.0"?><root><item>data</item></root>');
// Sets Content-Type: text/xml
```

## Custom Status Codes

Use `render()` to set status code and output:

```php
render(HTTP_CREATED, json_response(HTTP_CREATED, array('created' => true)));
render(HTTP_NOT_FOUND, html_response(HTTP_NOT_FOUND, '<h1>Not Found</h1>'));
render(HTTP_INTERNAL_SERVER_ERROR, json_response(HTTP_INTERNAL_SERVER_ERROR, array('error' => 'Server error')));
```

## Response Headers

```php
response_header('X-Custom-Header', 'value');
response_header('Cache-Control', 'no-cache');
```

## Downloads

### CSV Download

```php
route(method(GET), url_path('/export'), function() {
    $csv = "id,name\n1,Alice\n2,Bob\n";
    download_csv($csv, 'users.csv');
});
```

### File Download

```php
route(method(GET), url_path('/document'), function() {
    download_file('/path/to/document.pdf');
});
```

### JSON Download

```php
route(method(GET), url_path('/data.json'), function() {
    $data = array('users' => get_all_users());
    download_json($data, 'users.json');
});
```
