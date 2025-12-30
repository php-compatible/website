---
sidebar_position: 3
sidebar_label: Functional Routing
---

# Functional Routing

Functional routing gives you complete control over the routing process using simple PHP functions. This is the core routing approach - all other styles (file-based, Router class) are built on top of these functions.

## When to Use Functional Routing

- **Full Control** - You want direct access to all routing primitives
- **Custom Logic** - Need conditional routing based on complex criteria
- **Centralized Routes** - All routes in a single `index.php` or `routes/web.php`
- **Familiar Style** - Similar to frameworks like Slim or raw PHP routing
- **Minimal Overhead** - No class autoloading, just functions

## Basic Usage

### Single Entry Point (index.php)

```php
<?php
require_once 'vendor/autoload.php';

router(function() {
    route(method(GET), url_path('/'), function() {
        echo html_response('<h1>Home</h1>');
    });

    route(method(GET), url_path('/about'), function() {
        echo html_response('<h1>About Us</h1>');
    });

    route(method(GET), url_path('/contact'), function() {
        echo html_response('<h1>Contact</h1>');
    });
});
```

### Route Files Structure

For larger applications, organize routes in separate files:

```
/app
├── public/
│   └── index.php       # Entry point
├── routes/
│   ├── web.php         # Web routes
│   └── api.php         # API routes
└── vendor/
```

**public/index.php:**
```php
<?php
require_once __DIR__ . '/../vendor/autoload.php';

router(function() {
    require __DIR__ . '/../routes/web.php';
    require __DIR__ . '/../routes/api.php';
});
```

**routes/web.php:**
```php
<?php
route(method(GET), url_path('/'), function() {
    echo html_response('<h1>Welcome</h1>');
});

route(method(GET), url_path('/about'), function() {
    echo html_response('<h1>About</h1>');
});
```

**routes/api.php:**
```php
<?php
routerGroup('/api', function() {
    route(method(GET), url_path('/users'), function() {
        echo json_response(array('users' => array()));
    });

    route(method(POST), url_path('/users'), function() {
        $data = json_body();
        echo json_response(array('created' => $data));
    });
});
```

## HTTP Methods

Use the `method()` function to match HTTP methods:

```php
route(method(GET), url_path('/users'), $handler);
route(method(POST), url_path('/users'), $handler);
route(method(PUT), url_path('/users'), $handler);
route(method(DELETE), url_path('/users'), $handler);
route(method(PATCH), url_path('/users'), $handler);
route(method(HEAD), url_path('/users'), $handler);
route(method(OPTIONS), url_path('/users'), $handler);
```

### Match Any Method

Pass `true` as the first argument:

```php
route(true, url_path('/webhook'), function() {
    // Handles any HTTP method
});
```

### Custom Method Logic

Since predicates are just booleans, you can combine them:

```php
$isGetOrPost = method(GET) || method(POST);
route($isGetOrPost, url_path('/form'), function() {
    // Handles GET and POST
});
```

## URL Matching

### Static Paths

```php
route(method(GET), url_path('/'), $handler);           // Root
route(method(GET), url_path('/users'), $handler);      // /users
route(method(GET), url_path('/users/list'), $handler); // /users/list
```

### Wildcard Path

Match any path:

```php
route(method(GET), url_path('*'), function() {
    // Matches any path - useful for catch-all handlers
});
```

### URL Parameters

Use `url_path_params()` to capture dynamic segments:

```php
route(method(GET), url_path_params('/users/:id'), function() {
    $id = $_GET[':id'];
    echo json_response(array('user_id' => $id));
});

route(method(GET), url_path_params('/posts/:postId/comments/:commentId'), function() {
    $postId = $_GET[':postId'];
    $commentId = $_GET[':commentId'];
    echo json_response(array(
        'post' => $postId,
        'comment' => $commentId
    ));
});
```

## Route Groups

Group routes with a common prefix:

```php
router(function() {
    routerGroup('/api', function() {
        routerGroup('/v1', function() {
            route(method(GET), url_path('/users'), function() {
                // Matches /api/v1/users
            });

            route(method(GET), url_path('/posts'), function() {
                // Matches /api/v1/posts
            });
        });

        routerGroup('/v2', function() {
            route(method(GET), url_path('/users'), function() {
                // Matches /api/v2/users
            });
        });
    });

    // Routes outside the group
    route(method(GET), url_path('/'), function() {
        // Matches /
    });
});
```

## Request Handling

### JSON Body

```php
route(method(POST), url_path('/api/users'), function() {
    $data = json_body();  // Parse JSON request body

    if (empty($data['name'])) {
        render(HTTP_BAD_REQUEST, json_response(array('error' => 'Name required')));
        stop();
    }

    echo json_response(array('user' => $data));
});
```

### Form Data

```php
route(method(POST), url_path('/contact'), function() {
    $form = form_body();  // $_POST data
    $name = $form['name'];
    $email = $form['email'];

    // Process form...
    echo html_response('<p>Thanks, ' . htmlspecialchars($name) . '!</p>');
});
```

### File Uploads

```php
route(method(POST), url_path('/upload'), function() {
    if (!has_file('document')) {
        render(HTTP_BAD_REQUEST, json_response(array('error' => 'No file uploaded')));
        stop();
    }

    $file = file_body('document');
    move_file('document', '/uploads/' . $file['name']);

    echo json_response(array('uploaded' => $file['name']));
});
```

### Request Headers

```php
route(method(GET), url_path('/api/protected'), function() {
    $auth = request_header('Authorization');

    if (empty($auth)) {
        render(HTTP_UNAUTHORIZED, json_response(array('error' => 'Unauthorized')));
        stop();
    }

    echo json_response(array('data' => 'secret'));
});
```

### Content Negotiation

```php
route(method(GET), url_path('/data'), function() {
    $data = array('message' => 'Hello');

    if (accept(JSON_CONTENT)) {
        echo json_response($data);
    } else {
        echo html_response('<p>' . $data['message'] . '</p>');
    }
});
```

## Response Helpers

### JSON Response

```php
echo json_response(array('status' => 'ok'));
// Sets Content-Type: application/json
// Output: {"status":"ok"}
```

### HTML Response

```php
echo html_response('<h1>Hello World</h1>');
// Sets Content-Type: text/html
```

### Text Response

```php
echo text_response('Plain text content');
// Sets Content-Type: text/plain
```

### XML Response

```php
echo xml_response('<?xml version="1.0"?><root><item>data</item></root>');
// Sets Content-Type: text/xml
```

### Custom Status Code

```php
render(HTTP_CREATED, json_response(array('created' => true)));
render(HTTP_NOT_FOUND, html_response('<h1>Not Found</h1>'));
render(HTTP_INTERNAL_SERVER_ERROR, json_response(array('error' => 'Server error')));
```

### Set Headers

```php
response_header('X-Custom-Header', 'value');
response_header('Cache-Control', 'no-cache');
```

### Downloads

```php
route(method(GET), url_path('/export'), function() {
    $csv = "id,name\n1,Alice\n2,Bob\n";
    download_csv($csv, 'users.csv');
});

route(method(GET), url_path('/document'), function() {
    download_file('/path/to/document.pdf');
});
```

## Error Handling

### HTTP Exceptions

```php
route(method(GET), url_path_params('/users/:id'), function() {
    $id = $_GET[':id'];
    $user = find_user($id);

    if (!$user) {
        throw HttpException::NotFound('User not found');
    }

    echo json_response(array('user' => $user));
});
```

### Custom Error Handling

```php
route(method(GET), url_path('/risky'), function() {
    try {
        // Risky operation
        do_something();
    } catch (Exception $e) {
        error_log($e->getMessage());
        render(HTTP_INTERNAL_SERVER_ERROR, json_response(array(
            'error' => 'Something went wrong'
        )));
        stop();
    }
});
```

Errors are automatically caught by `router()` and rendered as JSON or HTML based on the `Accept` header.

## Redirects

```php
route(method(GET), url_path('/old-page'), function() {
    redirect('/new-page');
});

route(method(POST), url_path('/login'), function() {
    // Process login...
    redirect('/dashboard');
});
```

## Middleware Pattern

Apply cross-cutting concerns before routes:

```php
router(function() {
    // Authentication check for all /admin routes
    if (strpos($_GET['url'], 'admin') === 0) {
        $auth = request_header('Authorization');
        if (empty($auth)) {
            render(HTTP_UNAUTHORIZED, json_response(array('error' => 'Unauthorized')));
            stop();
        }
    }

    routerGroup('/admin', function() {
        route(method(GET), url_path('/dashboard'), function() {
            echo json_response(array('admin' => 'dashboard'));
        });

        route(method(GET), url_path('/users'), function() {
            echo json_response(array('admin' => 'users'));
        });
    });

    // Public routes
    route(method(GET), url_path('/'), function() {
        echo html_response('<h1>Public Home</h1>');
    });
});
```

### Using the Middleware Function

```php
function auth_check() {
    $token = request_header('Authorization');
    if (empty($token)) {
        throw HttpException::Unauthorized();
    }
}

function log_request() {
    error_log($_SERVER['REQUEST_METHOD'] . ' ' . $_SERVER['REQUEST_URI']);
}

router(function() {
    route(method(GET), url_path('/api/protected'), function() {
        middleware(
            'auth_check',
            'log_request',
            function() {
                echo json_response(array('secret' => 'data'));
            }
        )();
    });
});
```

## Controllers

### Closure Handlers

```php
route(method(GET), url_path('/users'), function() {
    echo json_response(array('users' => get_all_users()));
});
```

### Single Action Controllers

Pass a class name - it will be instantiated and invoked:

```php
class ShowDashboard
{
    public function __invoke()
    {
        echo html_response('<h1>Dashboard</h1>');
    }
}

route(method(GET), url_path('/dashboard'), ShowDashboard::class);
```

### With Request Injection

Controllers can receive a `ServerRequest` object:

```php
use PhpCompatible\Router\ServerRequest;
use PhpCompatible\Router\JsonResponse;

class ShowUser
{
    public function __invoke(ServerRequest $request)
    {
        $id = $request->getParam('id');
        return JsonResponse::ok(array('user_id' => $id));
    }
}

route(method(GET), url_path_params('/users/:id'), ShowUser::class);
```

## Advanced Patterns

### Conditional Routes

```php
router(function() {
    // Only register admin routes in development
    if (getenv('APP_ENV') === 'development') {
        route(method(GET), url_path('/debug'), function() {
            echo json_response($_SERVER);
        });
    }

    // Feature flag
    if (feature_enabled('new_api')) {
        routerGroup('/api/v2', function() {
            // New API routes
        });
    }
});
```

### Route Priority

Routes are matched in order - first match wins:

```php
router(function() {
    // Specific route first
    route(method(GET), url_path('/users/me'), function() {
        echo json_response(array('user' => 'current'));
    });

    // Parameterized route after
    route(method(GET), url_path_params('/users/:id'), function() {
        echo json_response(array('user' => $_GET[':id']));
    });

    // Catch-all last
    route(method(GET), url_path('*'), function() {
        render(HTTP_NOT_FOUND, html_response('<h1>Not Found</h1>'));
    });
});
```

### Subsite Installation

When installed in a subdirectory:

```php
set_root_url('/myapp');

router(function() {
    route(method(GET), url_path('/'), function() {
        // Matches /myapp/
        $loginUrl = root_url('/login');  // /myapp/login
        echo html_response('<a href="' . $loginUrl . '">Login</a>');
    });
});
```

## Complete Example

```php
<?php
// public/index.php
require_once __DIR__ . '/../vendor/autoload.php';

router(function() {
    // API routes
    routerGroup('/api', function() {
        // List users
        route(method(GET), url_path('/users'), function() {
            echo json_response(array(
                'users' => array(
                    array('id' => 1, 'name' => 'Alice'),
                    array('id' => 2, 'name' => 'Bob'),
                )
            ));
        });

        // Get single user
        route(method(GET), url_path_params('/users/:id'), function() {
            $id = $_GET[':id'];
            echo json_response(array('user' => array('id' => $id)));
        });

        // Create user
        route(method(POST), url_path('/users'), function() {
            $data = json_body();
            echo json_response(array('created' => $data));
        });

        // Update user
        route(method(PUT), url_path_params('/users/:id'), function() {
            $id = $_GET[':id'];
            $data = json_body();
            echo json_response(array('updated' => $id, 'data' => $data));
        });

        // Delete user
        route(method(DELETE), url_path_params('/users/:id'), function() {
            $id = $_GET[':id'];
            echo json_response(array('deleted' => $id));
        });
    });

    // Web routes
    route(method(GET), url_path('/'), function() {
        echo html_response('<!DOCTYPE html>
            <html>
            <head><title>Home</title></head>
            <body><h1>Welcome</h1></body>
            </html>');
    });
});
```
