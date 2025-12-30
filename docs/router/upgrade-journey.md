---
sidebar_position: 1
sidebar_label: Upgrade Journey
---

# Your Upgrade Journey

This router supports developers at every stage of their PHP modernization journey. Start wherever you are, and the patterns you learn will carry you forward.

| Stage | PHP Version | What You Get |
|-------|-------------|--------------|
| **Legacy Cleanup** | 5.5+ | Consolidate scattered routes into clean definitions |
| **Adding Structure** | 7.0+ | Route groups, middleware, organized code |
| **Modern Patterns** | 7.4+ | PSR-7 style request/response objects |
| **Framework Ready** | 8.0+ | Clean patterns ready for Laravel/Symfony migration |

Whether you're maintaining a legacy PHP 5.5 application or starting fresh on PHP 8, the same API works everywhere. No conditional syntax, no version-specific features — just routing that works.

## Choose Your Starting Point

| Your Situation | Recommended Approach | Why |
|----------------|---------------------|-----|
| Legacy app with PHP files scattered everywhere | [File-Based Routing](./file-based-routing/) | Add routing to existing files without restructuring |
| Want full control, centralized routes | [Functional Routing](./functional-routing/) | Simple functions, no classes needed |
| New project, prefer modern syntax | [Modern Routing](./modern-routing/) | Clean `Router::get()` style, auto JSON conversion |

## The Four Stages

### Stage 1: Legacy Cleanup (PHP 5.5+)

**Goal:** Bring order to chaos without changing your PHP version or project structure.

You have working code but messy routing. Routes are scattered across files, HTTP verbs are mixed together, and `.htaccess` rules have become impossible to follow.

**What to do:**
1. Pick [File-Based Routing](./file-based-routing/) to add routing to existing PHP files, or [Functional Routing](./functional-routing/) to centralize routes
2. Add explicit HTTP method checks (`GET`, `POST`, etc.) to document what each endpoint actually does
3. Use response helpers (`json_response()`, `html_response()`) for consistent output

```php
// Before: chaos
if ($_POST) { /* create */ } else { /* list */ }

// After: clarity
route(method(GET), url_path('/users'), 'list_users');
route(method(POST), url_path('/users'), 'create_user');
```

### Stage 2: Adding Structure (PHP 7.0+)

**Goal:** Organize routes and add cross-cutting concerns.

Your routes are cleaner, but you want better organization and features like authentication middleware.

**What to do:**
1. Group related routes with `routerGroup()` or `Router::group()`
2. Add middleware for authentication, logging, CORS
3. Separate routes into files (`routes/web.php`, `routes/api.php`)

```php
routerGroup('/api', function() {
    // Auth middleware for all /api routes
    middleware('require_auth');

    routerGroup('/v1', function() {
        route(method(GET), url_path('/users'), 'list_users');
    });
});
```

### Stage 3: Modern Patterns (PHP 7.4+)

**Goal:** Adopt testable, object-oriented patterns.

You want better testability and cleaner separation of concerns.

**What to do:**
1. Switch to [Modern Routing](./modern-routing/) syntax if you haven't
2. Use `ServerRequest` and `JsonResponse` objects (see PSR-7 Style in each routing section)
3. Create Single Action Controllers for complex handlers

```php
use PhpCompatible\Router\ServerRequest;
use PhpCompatible\Router\JsonResponse;

class ShowUser
{
    public function __invoke(ServerRequest $request)
    {
        $id = $request->getRouteParam(':id');
        $user = $this->findUser($id);

        return $user
            ? JsonResponse::response(HTTP_OK, array('user' => $user))
            : JsonResponse::response(HTTP_NOT_FOUND, array('error' => 'User not found'));
    }
}

Router::get('/users/:id', ShowUser::class);
```

### Stage 4: Framework Ready (PHP 8.0+)

**Goal:** Your code is now structured for easy migration to Laravel, Symfony, or any modern framework.

Because you've been using explicit methods, route groups, middleware, and PSR-7 style objects, your patterns translate directly:

| This Router | Laravel | Symfony |
|------------|---------|---------|
| `Router::get('/users', ...)` | `Route::get('/users', ...)` | `#[Route('/users', methods: ['GET'])]` |
| `Router::group('/api', ...)` | `Route::prefix('/api')->group(...)` | Route prefix |
| `ServerRequest` | `Request` | `Request` |
| `JsonResponse` | `JsonResponse` | `JsonResponse` |
| Single Action Controller | Invokable Controller | Invokable Controller |

## Why Explicit Methods Matter

The **most important thing** you can do is use explicit HTTP methods instead of `ALL`:

```php
// DON'T DO THIS - you learn nothing about the endpoint
route(ALL, url_path('/users'), $handler);

// DO THIS - documents your API contract
route(method(GET), url_path('/users'), 'list_users');
route(method(POST), url_path('/users'), 'create_user');
route(method(PUT), url_path_params('/users/:id'), 'update_user');
route(method(DELETE), url_path_params('/users/:id'), 'delete_user');
```

When you specify methods explicitly:
- Your code documents itself
- Framework migration becomes straightforward
- API documentation can be auto-generated
- You catch HTTP method bugs early

## Next Steps

1. **[Installation](./installation)** — Install the router and choose your routing style
2. **Choose your routing style:**
   - [File-Based Routing](./file-based-routing/) — For existing PHP file structures
   - [Functional Routing](./functional-routing/) — For centralized, function-based routes
   - [Modern Routing](./modern-routing/) — For new projects with clean syntax
