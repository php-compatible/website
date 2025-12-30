---
sidebar_position: 8
sidebar_label: API Reference
---

# API Reference

Complete reference for all functions and classes in the router package.

## Routing Functions

### router()

Runs routes and handles errors.

```php
router(callable $routes): void
```

**Parameters:**
- `$routes` - Function containing route definitions

**Example:**
```php
router(function() {
    route(method(GET), url_path('/'), function() {
        echo 'Home';
    });
});
```

### file_router()

File-based router that auto-detects the URL path from the file location.

```php
file_router(callable $routes, string $file = null): void
```

**Parameters:**
- `$routes` - Function containing route definitions
- `$file` - Optional file path (auto-detected if not provided)

**Example:**
```php
// In /wwwroot/api/users.php
file_router(function() {
    route(method(GET), url_path('/'), function() {
        // Matches /api/users
    });
});
```

### route()

Defines a route that matches HTTP method and path.

```php
route(bool $http_method_predicate, bool $path_predicate, callable|string $action): void
```

**Parameters:**
- `$http_method_predicate` - Result of `method()` check
- `$path_predicate` - Result of `url_path()` or `url_path_params()` check
- `$action` - Handler function or class name

**Example:**
```php
route(method(GET), url_path('/users'), function() {
    echo json_response(array('users' => array()));
});
```

### method()

Checks if the current request method matches.

```php
method(string $method): bool
```

**Parameters:**
- `$method` - HTTP method constant (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS, CONNECT, TRACE)

### url_path()

Checks if the URL path matches.

```php
url_path(string $path): bool
```

**Parameters:**
- `$path` - URL path to match (use `'*'` to match any path)

### url_path_params()

Checks if the URL path matches with parameters.

```php
url_path_params(string $path): bool
```

**Parameters:**
- `$path` - URL path with `:param` placeholders

**Example:**
```php
route(method(GET), url_path_params('/users/:id'), function() {
    $id = $_GET[':id'];
});
```

### routerGroup()

Groups routes under a common prefix.

```php
routerGroup(string $prefix, callable $routes): void
```

**Example:**
```php
routerGroup('/api', function() {
    route(method(GET), url_path('/users'), function() {
        // Matches /api/users
    });
});
```

### redirect()

Redirects to another URL.

```php
redirect(string $url): void
```

### static_folder()

Serves static files from a folder with automatic MIME type detection.

```php
static_folder(string $folder_path, string $url_prefix, array $options = array()): void
```

**Parameters:**
- `$folder_path` - Absolute or relative path to the static folder
- `$url_prefix` - URL prefix to match (e.g., `/static`, `/assets`)
- `$options` - Optional settings array:
  - `cache_time` - Cache duration in seconds (default: 86400)
  - `allowed_extensions` - Array of allowed file extensions

**Example:**
```php
router(function() {
    // Serve files from /public at /static/*
    static_folder(__DIR__ . '/public', '/static');

    // With options
    static_folder(__DIR__ . '/assets', '/assets', array(
        'cache_time' => 604800,
        'allowed_extensions' => array('css', 'js', 'png', 'jpg')
    ));
});
```

### mime_type()

Gets the MIME type for a file extension.

```php
mime_type(string $extension): string
```

**Parameters:**
- `$extension` - File extension without the dot (e.g., `css`, `png`)

**Returns:** MIME type string (defaults to `application/octet-stream` for unknown types)

**Example:**
```php
mime_type('css');   // 'text/css'
mime_type('png');   // 'image/png'
mime_type('woff2'); // 'font/woff2'
```

### url_path_starts_with()

Checks if URL starts with a prefix and returns the remaining path.

```php
url_path_starts_with(string $prefix): string|false
```

**Parameters:**
- `$prefix` - URL prefix to match

**Returns:** Remaining path after prefix, or `false` if not matched

**Example:**
```php
// URL: /static/css/style.css
$path = url_path_starts_with('/static');
// Returns: 'css/style.css'
```

### use_request_uri()

Uses `REQUEST_URI` instead of `$_GET['url']` for routing.

```php
use_request_uri(): void
```

### set_root_url()

Sets the root URL prefix for subsites.

```php
set_root_url(string $root): void
```

### root_url()

Builds a URL with the root prefix.

```php
root_url(string $path = ''): string
```

## Request Functions

### request_header()

Gets a request header value.

```php
request_header(string $header): string
```

### accept()

Checks if the request accepts a content type.

```php
accept(string $content_type): bool
```

### request_body()

Gets the raw request body.

```php
request_body(): string
```

### json_body()

Parses JSON from the request body.

```php
json_body(): array|null
```

### form_body()

Gets form data from `$_POST`.

```php
form_body(): array
```

### file_body()

Gets uploaded files.

```php
file_body(string $name = null): array|null
```

### has_file()

Checks if a file was uploaded successfully.

```php
has_file(string $name): bool
```

### move_file()

Moves an uploaded file.

```php
move_file(string $name, string $destination): bool
```

## Response Functions

### render()

Renders content with status code and headers.

```php
render(int $http_code, string $content, array $headers = array()): void
```

### content()

Sets content type header and returns content.

```php
content(string $type, string $content): string
```

### json_response()

Returns JSON-encoded content.

```php
json_response(array $array): string
```

### html_response()

Returns HTML content.

```php
html_response(string $html): string
```

### text_response()

Returns plain text content.

```php
text_response(string $text): string
```

### xml_response()

Returns XML content.

```php
xml_response(string $xml): string
```

### response_header()

Sets a response header.

```php
response_header(string $header, string $value): void
```

### download_response()

Sends a download response.

```php
download_response(string $mime_type, string $content, string $filename = null): void
```

### download_file()

Sends a file from disk as download.

```php
download_file(string $filepath, string $filename = null, string $mime_type = null): void
```

## Content Type Constants

```php
ATOM_CONTENT    // 'application/atom+xml'
CSS_CONTENT     // 'text/css'
JAVASCRIPT_CONTENT // 'text/javascript'
JSON_CONTENT    // 'application/json'
PDF_CONTENT     // 'application/pdf'
TEXT_CONTENT    // 'text/plain'
HTML_CONTENT    // 'text/html'
XML_CONTENT     // 'text/xml'
CSV_CONTENT     // 'text/csv'
ZIP_CONTENT     // 'application/zip'
BINARY_CONTENT  // 'application/octet-stream'
```

## HTTP Method Constants

```php
GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS, CONNECT, TRACE
```

## HTTP Status Code Constants

Use these constants with `render()` or when checking response codes:

### 1xx Informational
```php
HTTP_CONTINUE              // 100
HTTP_SWITCHING_PROTOCOLS   // 101
HTTP_PROCESSING            // 102
HTTP_EARLY_HINTS           // 103
```

### 2xx Success
```php
HTTP_OK                              // 200
HTTP_CREATED                         // 201
HTTP_ACCEPTED                        // 202
HTTP_NON_AUTHORITATIVE_INFORMATION   // 203
HTTP_NO_CONTENT                      // 204
HTTP_RESET_CONTENT                   // 205
HTTP_PARTIAL_CONTENT                 // 206
HTTP_MULTI_STATUS                    // 207
HTTP_ALREADY_REPORTED                // 208
HTTP_IM_USED                         // 226
```

### 3xx Redirection
```php
HTTP_MULTIPLE_CHOICES     // 300
HTTP_MOVED_PERMANENTLY    // 301
HTTP_FOUND                // 302
HTTP_SEE_OTHER            // 303
HTTP_NOT_MODIFIED         // 304
HTTP_USE_PROXY            // 305
HTTP_TEMPORARY_REDIRECT   // 307
HTTP_PERMANENT_REDIRECT   // 308
```

### 4xx Client Errors
```php
HTTP_BAD_REQUEST                     // 400
HTTP_UNAUTHORIZED                    // 401
HTTP_PAYMENT_REQUIRED                // 402
HTTP_FORBIDDEN                       // 403
HTTP_NOT_FOUND                       // 404
HTTP_METHOD_NOT_ALLOWED              // 405
HTTP_NOT_ACCEPTABLE                  // 406
HTTP_PROXY_AUTHENTICATION_REQUIRED   // 407
HTTP_REQUEST_TIMEOUT                 // 408
HTTP_CONFLICT                        // 409
HTTP_GONE                            // 410
HTTP_LENGTH_REQUIRED                 // 411
HTTP_PRECONDITION_FAILED             // 412
HTTP_PAYLOAD_TOO_LARGE               // 413
HTTP_URI_TOO_LONG                    // 414
HTTP_UNSUPPORTED_MEDIA_TYPE          // 415
HTTP_RANGE_NOT_SATISFIABLE           // 416
HTTP_EXPECTATION_FAILED              // 417
HTTP_IM_A_TEAPOT                     // 418
HTTP_MISDIRECTED_REQUEST             // 421
HTTP_UNPROCESSABLE_ENTITY            // 422
HTTP_LOCKED                          // 423
HTTP_FAILED_DEPENDENCY               // 424
HTTP_TOO_EARLY                       // 425
HTTP_UPGRADE_REQUIRED                // 426
HTTP_PRECONDITION_REQUIRED           // 428
HTTP_TOO_MANY_REQUESTS               // 429
HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE // 431
HTTP_UNAVAILABLE_FOR_LEGAL_REASONS   // 451
```

### 5xx Server Errors
```php
HTTP_INTERNAL_SERVER_ERROR           // 500
HTTP_NOT_IMPLEMENTED                 // 501
HTTP_BAD_GATEWAY                     // 502
HTTP_SERVICE_UNAVAILABLE             // 503
HTTP_GATEWAY_TIMEOUT                 // 504
HTTP_VERSION_NOT_SUPPORTED           // 505
HTTP_VARIANT_ALSO_NEGOTIATES         // 506
HTTP_INSUFFICIENT_STORAGE            // 507
HTTP_LOOP_DETECTED                   // 508
HTTP_NOT_EXTENDED                    // 510
HTTP_NETWORK_AUTHENTICATION_REQUIRED // 511
```

**Example:**
```php
render(HTTP_OK, json_response(array('status' => 'success')));
render(HTTP_CREATED, json_response(array('id' => 123)));
render(HTTP_NOT_FOUND, json_response(array('error' => 'Not found')));
```

## Router Class

`PhpCompatible\Router\Router`

### Static Methods

| Method | Description |
|--------|-------------|
| `get($path, $action)` | Define GET route |
| `post($path, $action)` | Define POST route |
| `put($path, $action)` | Define PUT route |
| `delete($path, $action)` | Define DELETE route |
| `patch($path, $action)` | Define PATCH route |
| `head($path, $action)` | Define HEAD route |
| `options($path, $action)` | Define OPTIONS route |
| `any($path, $action)` | Match any HTTP method |
| `match($methods, $path, $action)` | Match multiple methods |
| `group($prefix, $routes)` | Group routes with prefix |
| `run($routes)` | Run the router |
| `setRoot($root)` | Set root URL prefix |
| `rootUrl($path)` | Build URL with root |
| `redirect($url)` | Redirect to URL |
| `staticFolder($folder, $prefix, $options)` | Serve static files from folder |

## ServerRequest Class

`PhpCompatible\Router\ServerRequest`

### Methods

| Method | Description |
|--------|-------------|
| `getMethod()` | Get HTTP method |
| `getUri()` | Get request URI |
| `getPath()` | Get URL path |
| `getQueryParams()` | Get all query parameters |
| `getQueryParam($name, $default)` | Get single query parameter |
| `getParsedBody()` | Get parsed body (JSON or POST) |
| `getBodyParam($name, $default)` | Get single body parameter |
| `getBody()` | Get raw request body |
| `getHeaders()` | Get all headers |
| `hasHeader($name)` | Check if header exists |
| `getHeaderLine($name)` | Get header value |
| `getAttributes()` | Get route parameters |
| `getAttribute($name, $default)` | Get single route parameter |
| `getParam($name, $default)` | Alias for getAttribute |
| `withAttribute($name, $value)` | Return new instance with attribute |
| `getServerParams()` | Get `$_SERVER` array |
| `getServerParam($name, $default)` | Get single server param |
| `getUploadedFiles()` | Get `$_FILES` array |
| `getUploadedFile($name)` | Get single uploaded file |
| `hasUploadedFile($name)` | Check if file uploaded |
| `isMethod($method)` | Check request method |
| `isAjax()` | Check if AJAX request |
| `isJson()` | Check if JSON request |
| `accepts($contentType)` | Check Accept header |

## JsonResponse Class

`PhpCompatible\Router\JsonResponse`

### Constructor

```php
new JsonResponse($data = null, $statusCode = 200, $headers = array())
```

### Instance Methods

| Method | Description |
|--------|-------------|
| `getData()` | Get response data |
| `getStatusCode()` | Get HTTP status code |
| `getHeaders()` | Get headers array |
| `getBody()` | Get JSON string |
| `withData($data)` | Return new instance with data |
| `withStatus($code)` | Return new instance with status |
| `withHeader($name, $value)` | Return new instance with header |
| `send()` | Send the response |

### Static Factory Methods

| Method | Status Code |
|--------|-------------|
| `ok($data)` | 200 |
| `created($data)` | 201 |
| `noContent()` | 204 |
| `badRequest($data)` | 400 |
| `unauthorized($data)` | 401 |
| `forbidden($data)` | 403 |
| `notFound($data)` | 404 |
| `serverError($data)` | 500 |

## HtmlResponse Class

`PhpCompatible\Router\HtmlResponse`

### Constructor

```php
new HtmlResponse($content = '', $statusCode = 200, $headers = array())
```

### Instance Methods

| Method | Description |
|--------|-------------|
| `getContent()` | Get HTML content |
| `getStatusCode()` | Get HTTP status code |
| `getHeaders()` | Get headers array |
| `getBody()` | Get HTML content |
| `withContent($content)` | Return new instance with content |
| `withStatus($code)` | Return new instance with status |
| `withHeader($name, $value)` | Return new instance with header |
| `send()` | Send the response |

### Static Factory Methods

| Method | Status Code |
|--------|-------------|
| `ok($content)` | 200 |
| `notFound($content)` | 404 |
| `forbidden($content)` | 403 |
| `serverError($content)` | 500 |
| `view($filepath, $data, $statusCode)` | Render PHP template |

## DownloadResponse Class

`PhpCompatible\Router\DownloadResponse`

### Constructor

```php
new DownloadResponse($content, $mimeType = BINARY_CONTENT, $filename = null, $headers = array())
```

### Instance Methods

| Method | Description |
|--------|-------------|
| `getContent()` | Get file content |
| `getMimeType()` | Get MIME type |
| `getFilename()` | Get download filename |
| `getHeaders()` | Get headers array |
| `getBody()` | Get file content |
| `withContent($content)` | Return new instance with content |
| `withFilename($filename)` | Return new instance with filename |
| `withHeader($name, $value)` | Return new instance with header |
| `send()` | Send the download |

### Static Factory Methods

| Method | MIME Type |
|--------|-----------|
| `json($data, $filename)` | application/json |
| `csv($content, $filename)` | text/csv |
| `pdf($content, $filename)` | application/pdf |
| `zip($content, $filename)` | application/zip |
| `text($content, $filename)` | text/plain |
| `xml($content, $filename)` | text/xml |
| `html($content, $filename)` | text/html |
| `javascript($content, $filename)` | text/javascript |
| `css($content, $filename)` | text/css |
| `binary($content, $filename)` | application/octet-stream |
| `file($filepath, $filename, $mimeType)` | Auto-detected |

## HttpException Class

`HttpException`

### Static Factory Methods

| Method | Status Code |
|--------|-------------|
| `BadRequest($message)` | 400 |
| `Unauthorized($message)` | 401 |
| `Forbidden($message)` | 403 |
| `NotFound($message)` | 404 |
| `MethodNotAllowed($message)` | 405 |
| `Conflict($message)` | 409 |
| `Gone($message)` | 410 |
| `UnprocessableEntity($message)` | 422 |
| `TooManyRequests($message)` | 429 |
| `InternalServerError($message)` | 500 |
| `NotImplemented($message)` | 501 |
| `BadGateway($message)` | 502 |
| `ServiceUnavailable($message)` | 503 |
| `GatewayTimeout($message)` | 504 |
| `ImATeapot($message)` | 418 |
| `create($code, $message)` | Custom code |

**Example:**
```php
throw HttpException::NotFound('User not found');
throw HttpException::create(409, 'Resource conflict');
```
