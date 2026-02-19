# Plate.js Migration: Three-Phase Plan PLUS TESTS

## Guiding Constraints (Apply to Every Phase)

1. **Hash routing from day one.** `createHashHistory()` in TanStack Router. URLs: `/#/editor/abc123`. Works in browser, Cloudflare Workers, AND Tauri webview without platform-specific fallback config. Marginally uglier on web, universally reliable everywhere.

2. **Platform abstraction layer from day one.** Every data operation goes through an interface. Phase 1 implements the `fetch()` version. Phase 2 swaps the backend. Phase 3 adds `invoke()` for Tauri. Zero component changes across phases.

3. **No SSR anywhere.** The editor requires DOM (contentEditable). PlateStatic for read-only is nice-to-have but not worth the architectural complexity of maintaining SSR infrastructure that Tauri can't use. Pure SPA.

4. **Bundle budget: < 120KB gzip initial JS.** Every phase must preserve this. The loading sequence (skeleton → shell → editor → heavy plugins) is load-bearing architecture, not a nice-to-have.

5. After all is done, you will research all tools that we can test our implementation automatically. Search wrangler dev, vite dev, playwright and test plugins for plate, bun test at minimum and prepare a plan of deterministic tests that would ensure compliance with the plan, obviously taking into consideration that we may needed changes "on the ground" that slightly deviated to the instructions.

6. Read the excerpts of syntax:

Skip to content

￼Hono

Menu

On this page

Sidebar Navigation

Concepts

Getting Started

API

Guides

create-hono

Middleware

Helpers

JSX

Client Components

Testing

Validation

RPC

Best Practices

Miscellaneous

FAQs

Helpers

Middleware

LLM

Testing

Testing is important. In actuality, it is easy to test Hono's applications. The way to create a test environment differs from each runtime, but the basic steps are the same. In this section, let's test with Cloudflare Workers and Vitest.

TIP

Cloudflare recommends using Vitest with @cloudflare/vitest-pool-workers. For more details, please refer to Vitest integration in the Cloudflare Workers docs.

Request and Response

All you do is create a Request and pass it to the Hono application to validate the Response. And, you can use app.request the useful method.

TIP

For a typed test client see the testing helper.

For example, consider an application that provides the following REST API.

app.get('/posts', (c) => { return c.text('Many posts') }) app.post('/posts', (c) => { return c.json( { message: 'Created', }, 201, { 'X-Custom': 'Thank you', } ) })

Make a request to GET /posts and test the response.

describe('Example', () => { test('GET /posts', async () => { const res = await app.request('/posts') expect(res.status).toBe(200) expect(await res.text()).toBe('Many posts') }) })

To make a request to POST /posts, do the following.

test('POST /posts', async () => { const res = await app.request('/posts', { method: 'POST', }) expect(res.status).toBe(201) expect(res.headers.get('X-Custom')).toBe('Thank you') expect(await res.json()).toEqual({ message: 'Created', }) })

To make a request to POST /posts with JSON data, do the following.

test('POST /posts', async () => { const res = await app.request('/posts', { method: 'POST', body: JSON.stringify({ message: 'hello hono' }), headers: new Headers({ 'Content-Type': 'application/json' }), }) expect(res.status).toBe(201) expect(res.headers.get('X-Custom')).toBe('Thank you') expect(await res.json()).toEqual({ message: 'Created', }) })

To make a request to POST /posts with multipart/form-data data, do the following.

test('POST /posts', async () => { const formData = new FormData() formData.append('message', 'hello') const res = await app.request('/posts', { method: 'POST', body: formData, }) expect(res.status).toBe(201) expect(res.headers.get('X-Custom')).toBe('Thank you') expect(await res.json()).toEqual({ message: 'Created', }) })

You can also pass an instance of the Request class.

test('POST /posts', async () => { const req = new Request('http://localhost/posts', { method: 'POST', }) const res = await app.request(req) expect(res.status).toBe(201) expect(res.headers.get('X-Custom')).toBe('Thank you') expect(await res.json()).toEqual({ message: 'Created', }) })

In this way, you can test it as like an End-to-End.

Env

To set c.env for testing, you can pass it as the 3rd parameter to app.request. This is useful for mocking values like Cloudflare Workers Bindings:

const MOCK_ENV = { API_HOST: 'example.com', DB: { prepare: () => { /* mocked D1 */ }, }, } test('GET /posts', async () => { const res = await app.request('/posts', {}, MOCK_ENV) })

Edit this page on GitHub

Last updated: 2/19/26, 6:48 AM

Pager

Previous pageClient Components

Next pageValidation

import { defineWorkersProject } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersProject({
	test: {
		poolOptions: {
			workers: {
				singleWorker: true,
				wrangler: {
					configPath: "./wrangler.jsonc",
				},
			},
		},
	},
});
import events from "node:events";
import { SELF } from "cloudflare:test";
import { afterEach, assert, it, vi } from "vitest";

afterEach(() => {
	vi.restoreAllMocks();
});

it("mocks GET requests", async ({ expect }) => {
	vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
		const request = new Request(input, init);
		const url = new URL(request.url);

		if (
			request.method === "GET" &&
			url.origin === "https://cloudflare.com" &&
			url.pathname === "/path"
		) {
			return new Response("✅");
		}

		throw new Error("No mock found");
	});

	// Host `example.com` will be rewritten to `cloudflare.com` by the Worker
	let response = await SELF.fetch("https://example.com/path");
	expect(response.status).toBe(200);
	expect(await response.text()).toBe("✅");

	// Invalid paths shouldn't match
	response = await SELF.fetch("https://example.com/bad");
	expect(response.status).toBe(500);
	expect(await response.text()).toMatch("No mock found");
});

it("mocks POST requests", async ({ expect }) => {
	vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
		const request = new Request(input, init);
		const url = new URL(request.url);
		const body = await request.text();

		if (
			request.method === "POST" &&
			url.origin === "https://cloudflare.com" &&
			url.pathname === "/path" &&
			body === "✨"
		) {
			return new Response("✅");
		}

		throw new Error("No mock found");
	});

	const response = await SELF.fetch("https://example.com/path", {
		method: "POST",
		body: "✨",
	});
	expect(response.status).toBe(200);
	expect(await response.text()).toBe("✅");
});

it("mocks WebSocket requests", async ({ expect }) => {
	vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
		const request = new Request(input, init);
		const url = new URL(request.url);

		if (
			request.method === "GET" &&
			url.origin === "https://cloudflare.com" &&
			url.pathname === "/ws" &&
			request.headers.get("Upgrade") === "websocket"
		) {
			const { 0: socket, 1: responseSocket } = new WebSocketPair();
			socket.addEventListener("message", (event) => {
				assert(typeof event.data === "string");
				socket.send(event.data.toUpperCase());
			});
			socket.accept();
			return new Response(null, {
				status: 101,
				webSocket: responseSocket,
			});
		}

		throw new Error("No mock found");
	});

	// Send WebSocket request and assert WebSocket response received...
	const response = await SELF.fetch("https://example.com/ws", {
		headers: { Upgrade: "websocket" },
	});
	expect(response.status).toBe(101);
	const webSocket = response.webSocket;
	assert(webSocket !== null); // Using `assert()` for type narrowing

	// ...then accept WebSocket and send/receive message
	const eventPromise = events.once(webSocket, "message") as Promise<
		[MessageEvent] /* args */
	>;
	webSocket.accept();
	webSocket.send("hello");
	const args = await eventPromise;
	expect(args[0].data).toBe("HELLO");
});
{
	"extends": "./tsconfig.node.json",
	"compilerOptions": {
		"types": [
			"@cloudflare/workers-types/experimental",
			"@cloudflare/vitest-pool-workers", // For `cloudflare:test` types
			"vite/client" // For `?raw`, `?url`, etc. import types
		]
	}
}---
title: Miniflare · Cloudflare Workers docs
description: >-
  Miniflare is a simulator for developing and testing

  Cloudflare Workers. It's written in

  TypeScript, and runs your code in a sandbox implementing Workers' runtime
  APIs.
lastUpdated: 2025-04-10T20:52:52.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/testing/miniflare/
  md: https://developers.cloudflare.com/workers/testing/miniflare/index.md
---

Warning

This documentation describes the Miniflare API, which is only relevant for advanced use cases. Instead, most users should use [Wrangler](https://developers.cloudflare.com/workers/wrangler) to build, run & deploy their Workers locally

**Miniflare** is a simulator for developing and testing [**Cloudflare Workers**](https://workers.cloudflare.com/). It's written in TypeScript, and runs your code in a sandbox implementing Workers' runtime APIs.

* 🎉 **Fun:** develop Workers easily with detailed logging, file watching and pretty error pages supporting source maps.
* 🔋 **Full-featured:** supports most Workers features, including KV, Durable Objects, WebSockets, modules and more.
* ⚡ **Fully-local:** test and develop Workers without an Internet connection. Reload code on change quickly.

[Get Started](https://developers.cloudflare.com/workers/testing/miniflare/get-started)

[GitHub](https://github.com/cloudflare/workers-sdk/tree/main/packages/miniflare)

[NPM](https://npmjs.com/package/miniflare)

***

These docs primarily cover Miniflare specific things. For more information on runtime APIs, refer to the [Cloudflare Workers docs](https://developers.cloudflare.com/workers).

If you find something that doesn't behave as it does in the production Workers environment (and this difference isn't documented), or something's wrong in these docs, please [open a GitHub issue](https://github.com/cloudflare/workers-sdk/issues/new/choose).

* [Get Started](https://developers.cloudflare.com/workers/testing/miniflare/get-started/)
* [Writing tests ](https://developers.cloudflare.com/workers/testing/miniflare/writing-tests/): Write integration tests against Workers using Miniflare.
* [Core](https://developers.cloudflare.com/workers/testing/miniflare/core/)
* [Developing](https://developers.cloudflare.com/workers/testing/miniflare/developing/)
* [Migrations ](https://developers.cloudflare.com/workers/testing/miniflare/migrations/): Review migration guides for specific versions of Miniflare.
* [Storage](https://developers.cloudflare.com/workers/testing/miniflare/storage/)
# How to Test Router with File-Based Routing

This guide covers testing TanStack Router applications that use file-based routing, including testing route generation, file-based route components, and file-based routing patterns.

## Quick Start

Test file-based routing by setting up route mocking utilities, testing generated route trees, and implementing patterns specific to file-based route structures and conventions.

---

## Understanding File-Based Routing Testing

File-based routing testing differs from code-based routing testing in several key ways:

- **Generated Route Trees**: Routes are automatically generated from filesystem structure
- **File Conventions**: Routes follow specific file naming conventions (`index.tsx`, `route.tsx`, `$param.tsx`)
- **Route Discovery**: Routes are discovered through filesystem scanning rather than explicit imports
- **Type Generation**: Route types are automatically generated and need special testing considerations

---

## Setting Up File-Based Route Testing

### 1. Install Test Dependencies

For file-based routing testing, you'll need the same base dependencies as regular router testing:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### 2. Configure Test Environment

Create `vitest.config.ts` with file-based routing support:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    tanstackRouter({
      // Configure for test environment
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      disableLogging: true,
    }),
    react(),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    typecheck: { enabled: true },
    watch: false,
    // Ensure route tree is generated before tests
    globals: true,
  },
})
```

### 3. Create Route Testing Utilities

Create `src/test/file-route-utils.tsx`:

```tsx
import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import {
  createRouter,
  RouterProvider,
  createMemoryHistory,
} from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from '../routeTree.gen'

// Create test router with generated route tree
export function createTestRouterFromFiles(initialLocation = '/') {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [initialLocation],
    }),
    context: {
      // Add any required context for your routes
    },
  })

  return router
}

// Custom render function for file-based routes
interface RenderWithFileRoutesOptions extends Omit<RenderOptions, 'wrapper'> {
  initialLocation?: string
  routerContext?: any
}

export function renderWithFileRoutes(
  ui: React.ReactElement,
  {
    initialLocation = '/',
    routerContext = {},
    ...renderOptions
  }: RenderWithFileRoutesOptions = {},
) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [initialLocation],
    }),
    context: routerContext,
  })

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <RouterProvider router={router}>{children}</RouterProvider>
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    router,
  }
}

// Helper to test specific file routes
export function createMockFileRoute(
  path: string,
  component: React.ComponentType,
) {
  // This is useful for isolated testing when you don't want to use the full route tree
  return {
    path,
    component,
    // Add other common route properties as needed
  }
}
```

---

## Testing File-Based Route Structure

### 1. Test Route Tree Generation

```tsx
import { describe, it, expect } from 'vitest'
import { routeTree } from '../routeTree.gen'

describe('Generated Route Tree', () => {
  it('should generate route tree from file structure', () => {
    // Test that route tree exists and has expected structure
    expect(routeTree).toBeDefined()
    expect(routeTree.children).toBeDefined()
  })

  it('should include all expected routes', () => {
    // Get all route paths from the generated tree
    const getAllRoutePaths = (tree: any, paths: string[] = []): string[] => {
      if (tree.path) {
        paths.push(tree.path)
      }
      if (tree.children) {
        tree.children.forEach((child: any) => {
          getAllRoutePaths(child, paths)
        })
      }
      return paths
    }

    const routePaths = getAllRoutePaths(routeTree)

    // Test that expected routes are present
    expect(routePaths).toContain('/')
    expect(routePaths).toContain('/about')
    // Add assertions for your specific routes
  })

  it('should have correct route hierarchy', () => {
    // Test parent-child relationships
    const homeRoute = routeTree.children?.find(
      (child: any) => child.path === '/',
    )
    expect(homeRoute).toBeDefined()

    // Test for specific route structure based on your file organization
    // For example, if you have /posts/$postId routes:
    // const postsRoute = routeTree.children?.find((child: any) => child.path === '/posts')
    // expect(postsRoute?.children).toBeDefined()
  })
})
```

### 2. Test File Route Conventions

```tsx
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithFileRoutes } from '../test/file-route-utils'

describe('File Route Conventions', () => {
  it('should render index route at root path', () => {
    renderWithFileRoutes(<div />, {
      initialLocation: '/',
    })

    // Test that the index route component renders
    // This depends on what your src/routes/index.tsx exports
    expect(screen.getByText('Welcome Home!')).toBeInTheDocument()
  })

  it('should handle route parameters from filename', () => {
    // If you have a route like src/routes/posts/$postId.tsx
    renderWithFileRoutes(<div />, {
      initialLocation: '/posts/123',
    })

    // Test that parameter is correctly parsed from file-based route
    expect(screen.getByText(/Post.*123/)).toBeInTheDocument()
  })

  it('should handle nested routes from directory structure', () => {
    // If you have src/routes/dashboard/settings.tsx
    renderWithFileRoutes(<div />, {
      initialLocation: '/dashboard/settings',
    })

    expect(screen.getByText(/Settings/)).toBeInTheDocument()
  })

  it('should handle layout routes', () => {
    // If you have src/routes/_layout.tsx
    renderWithFileRoutes(<div />, {
      initialLocation: '/some-nested-route',
    })

    // Test that layout is rendered for nested routes
    expect(screen.getByTestId('layout-header')).toBeInTheDocument()
  })
})
```

---

## Testing File-Based Route Components

### 1. Test Individual Route Files

```tsx
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { createFileRoute } from '@tanstack/react-router'
import { renderWithFileRoutes } from '../test/file-route-utils'

describe('Individual Route Components', () => {
  it('should test about route component', () => {
    renderWithFileRoutes(<div />, {
      initialLocation: '/about',
    })

    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('should test route with loader data', () => {
    // For a route like src/routes/posts/index.tsx with loader
    renderWithFileRoutes(<div />, {
      initialLocation: '/posts',
    })

    // Wait for loader data to load
    expect(screen.getByText(/Posts List/)).toBeInTheDocument()
  })

  it('should test route with search params validation', () => {
    // For a route with validateSearch in src/routes/search.tsx
    renderWithFileRoutes(<div />, {
      initialLocation: '/search?q=react&page=1',
    })

    expect(screen.getByDisplayValue('react')).toBeInTheDocument()
  })
})
```

### 2. Test Route-Specific Hooks

```tsx
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithFileRoutes } from '../test/file-route-utils'

describe('Route-Specific Hooks', () => {
  it('should test useParams in parameterized route', () => {
    // Create a test component that uses Route.useParams()
    function TestComponent() {
      // This would be available in the actual route component
      const params = Route.useParams()
      return <div data-testid="param-value">{params.postId}</div>
    }

    renderWithFileRoutes(<TestComponent />, {
      initialLocation: '/posts/abc123',
    })

    expect(screen.getByTestId('param-value')).toHaveTextContent('abc123')
  })

  it('should test useLoaderData in route with loader', () => {
    renderWithFileRoutes(<div />, {
      initialLocation: '/posts/123',
    })

    // Test that loader data is available in the component
    expect(screen.getByText(/Post Title/)).toBeInTheDocument()
  })

  it('should test useSearch in route with search validation', () => {
    renderWithFileRoutes(<div />, {
      initialLocation: '/search?q=typescript&sort=date',
    })

    // Test that search params are correctly parsed
    expect(screen.getByDisplayValue('typescript')).toBeInTheDocument()
    expect(screen.getByText(/sorted by date/)).toBeInTheDocument()
  })
})
```

---

## Testing Route Navigation with File-Based Routes

### 1. Test Link Navigation

```tsx
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithFileRoutes } from '../test/file-route-utils'

describe('File-Based Route Navigation', () => {
  it('should navigate between file-based routes', async () => {
    const user = userEvent.setup()

    const { router } = renderWithFileRoutes(<div />, {
      initialLocation: '/',
    })

    // Initial state - should be on home route
    expect(screen.getByText('Welcome Home!')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/')

    // Click navigation link
    await user.click(screen.getByRole('link', { name: /about/i }))

    // Should navigate to about route
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/about')
  })

  it('should handle dynamic route navigation', async () => {
    const user = userEvent.setup()

    renderWithFileRoutes(<div />, {
      initialLocation: '/posts',
    })

    // Click on a post link (assuming your posts route renders links)
    await user.click(screen.getByRole('link', { name: /View Post 1/i }))

    // Should navigate to dynamic post route
    expect(screen.getByText(/Post 1 Details/)).toBeInTheDocument()
  })

  it('should handle nested route navigation', async () => {
    const user = userEvent.setup()

    renderWithFileRoutes(<div />, {
      initialLocation: '/dashboard',
    })

    // Navigate to nested route
    await user.click(screen.getByRole('link', { name: /settings/i }))

    expect(screen.getByText(/Dashboard Settings/)).toBeInTheDocument()
  })
})
```

### 2. Test Programmatic Navigation

```tsx
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithFileRoutes } from '../test/file-route-utils'

describe('Programmatic Navigation', () => {
  it('should programmatically navigate between file routes', async () => {
    const user = userEvent.setup()

    const { router } = renderWithFileRoutes(<div />, {
      initialLocation: '/',
    })

    // Trigger programmatic navigation (button in your component)
    await user.click(screen.getByRole('button', { name: /Go to Posts/i }))

    expect(router.state.location.pathname).toBe('/posts')
  })

  it('should navigate with search params', async () => {
    const user = userEvent.setup()

    const { router } = renderWithFileRoutes(<div />, {
      initialLocation: '/search',
    })

    // Trigger search with params
    await user.type(screen.getByRole('textbox'), 'test query')
    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(router.state.location.search).toMatchObject({
      q: 'test query',
    })
  })
})
```

---

## Testing File-Based Route Guards and Loaders

### 1. Test Route Guards

```tsx
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithFileRoutes } from '../test/file-route-utils'

describe('File-Based Route Guards', () => {
  it('should redirect unauthenticated users from protected routes', () => {
    // Mock unauthenticated state
    const mockAuth = { isAuthenticated: false, user: null }

    renderWithFileRoutes(<div />, {
      initialLocation: '/dashboard',
      routerContext: { auth: mockAuth },
    })

    // Should redirect to login (based on your beforeLoad implementation)
    expect(screen.getByText(/Please log in/)).toBeInTheDocument()
  })

  it('should allow authenticated users to access protected routes', () => {
    const mockAuth = {
      isAuthenticated: true,
      user: { id: '1', name: 'John' },
    }

    renderWithFileRoutes(<div />, {
      initialLocation: '/dashboard',
      routerContext: { auth: mockAuth },
    })

    expect(screen.getByText(/Welcome to Dashboard/)).toBeInTheDocument()
  })
})
```

### 2. Test Route Loaders

```tsx
import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithFileRoutes } from '../test/file-route-utils'

describe('File-Based Route Loaders', () => {
  it('should load data for route with loader', async () => {
    // Mock the API function used in your route loader
    const mockFetchPost = vi.fn().mockResolvedValue({
      id: '123',
      title: 'Test Post',
      content: 'Test content',
    })

    // If your route loader uses a global API function, mock it
    vi.mock('../api/posts', () => ({
      fetchPost: mockFetchPost,
    }))

    renderWithFileRoutes(<div />, {
      initialLocation: '/posts/123',
    })

    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument()
    })

    expect(mockFetchPost).toHaveBeenCalledWith('123')
  })

  it('should handle loader errors', async () => {
    const mockFetchPost = vi.fn().mockRejectedValue(new Error('Post not found'))

    vi.mock('../api/posts', () => ({
      fetchPost: mockFetchPost,
    }))

    renderWithFileRoutes(<div />, {
      initialLocation: '/posts/invalid',
    })

    await waitFor(() => {
      expect(screen.getByText(/Error.*Post not found/)).toBeInTheDocument()
    })
  })
})
```

---

## Testing File Route Validation

### 1. Test Search Parameter Validation

```tsx
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithFileRoutes } from '../test/file-route-utils'

describe('File Route Validation', () => {
  it('should validate search parameters', () => {
    // Test with valid search params
    renderWithFileRoutes(<div />, {
      initialLocation: '/search?q=react&page=1&sort=date',
    })

    expect(screen.getByDisplayValue('react')).toBeInTheDocument()
    expect(screen.getByText(/Page 1/)).toBeInTheDocument()
  })

  it('should handle invalid search parameters', () => {
    // Test with invalid search params (e.g., invalid page number)
    renderWithFileRoutes(<div />, {
      initialLocation: '/search?page=invalid&sort=unknown',
    })

    // Should fall back to defaults based on your validation schema
    expect(screen.getByText(/Page 1/)).toBeInTheDocument() // default page
  })

  it('should validate route parameters', () => {
    // Test with valid route param
    renderWithFileRoutes(<div />, {
      initialLocation: '/posts/123',
    })

    expect(screen.getByText(/Post 123/)).toBeInTheDocument()
  })
})
```

---

## Testing File Route Error Boundaries

### 1. Test Route-Level Error Handling

```tsx
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithFileRoutes } from '../test/file-route-utils'

describe('File Route Error Handling', () => {
  it('should handle component errors with error boundary', () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Force an error in a route component
    vi.mock('../routes/error-prone.tsx', () => ({
      Route: {
        component: () => {
          throw new Error('Test error')
        },
      },
    }))

    renderWithFileRoutes(<div />, {
      initialLocation: '/error-prone',
    })

    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('should handle loader errors with error component', async () => {
    const mockFailingLoader = vi
      .fn()
      .mockRejectedValue(new Error('Load failed'))

    vi.mock('../api/data', () => ({
      loadData: mockFailingLoader,
    }))

    renderWithFileRoutes(<div />, {
      initialLocation: '/data-route',
    })

    expect(screen.getByText(/Failed to load data/)).toBeInTheDocument()
  })
})
```

---

## Testing with Generated Route Types

### 1. Test Type Safety

```tsx
import { describe, it, expect } from 'vitest'
import { useNavigate } from '@tanstack/react-router'
import { renderWithFileRoutes } from '../test/file-route-utils'

describe('Generated Route Types', () => {
  it('should provide type-safe navigation', () => {
    function TestComponent() {
      const navigate = useNavigate()

      const handleNavigate = () => {
        // This should be type-safe based on your generated routes
        navigate({
          to: '/posts/$postId',
          params: { postId: '123' },
          search: { tab: 'comments' },
        })
      }

      return (
        <button onClick={handleNavigate} data-testid="navigate-btn">
          Navigate
        </button>
      )
    }

    const { router } = renderWithFileRoutes(<TestComponent />, {
      initialLocation: '/',
    })

    // Test the navigation works correctly
    const button = screen.getByTestId('navigate-btn')
    fireEvent.click(button)

    expect(router.state.location.pathname).toBe('/posts/123')
    expect(router.state.location.search).toEqual({ tab: 'comments' })
  })
})
```

---

## Testing Route Tree Changes

### 1. Test Route Generation During Development

```tsx
import { describe, it, expect } from 'vitest'
import { routeTree } from '../routeTree.gen'

describe('Route Tree Development', () => {
  it('should regenerate routes when files change', () => {
    // This test ensures your route tree is properly generated
    // You can add specific assertions based on your file structure

    expect(routeTree).toBeDefined()
    expect(typeof routeTree.children).toBe('object')

    // Test specific routes exist
    const routes = getAllRouteIds(routeTree)
    expect(routes).toContain('/')
    expect(routes).toContain('/about')
    // Add assertions for your specific routes
  })

  // Helper function to get all route IDs from tree
  function getAllRouteIds(tree: any, ids: string[] = []): string[] {
    if (tree.id) {
      ids.push(tree.id)
    }
    if (tree.children) {
      Object.values(tree.children).forEach((child: any) => {
        getAllRouteIds(child, ids)
      })
    }
    return ids
  }
})
```

---

## E2E Testing for File-Based Routes

### 1. Playwright Configuration for File-Based Routes

Create `e2e/file-routing.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test.describe('File-Based Route E2E', () => {
  test('should navigate through file-based route structure', async ({
    page,
  }) => {
    await page.goto('/')

    // Test home route (from src/routes/index.tsx)
    await expect(page.locator('h3')).toContainText('Welcome Home!')

    // Navigate to about route (from src/routes/about.tsx)
    await page.click('text=About')
    await expect(page).toHaveURL('/about')
    await expect(page.locator('h3')).toContainText('About')

    // Test browser navigation
    await page.goBack()
    await expect(page).toHaveURL('/')
  })

  test('should handle dynamic routes from file structure', async ({ page }) => {
    await page.goto('/posts')

    // Click on a dynamic post link (from src/routes/posts/$postId.tsx)
    await page.click('[data-testid="post-link-1"]')
    await expect(page).toHaveURL('/posts/1')
    await expect(page.locator('h1')).toContainText('Post 1')
  })

  test('should handle nested routes', async ({ page }) => {
    await page.goto('/dashboard')

    // Navigate to nested route (from src/routes/dashboard/settings.tsx)
    await page.click('text=Settings')
    await expect(page).toHaveURL('/dashboard/settings')
    await expect(page.locator('h2')).toContainText('Settings')
  })
})
```

---

## Common File-Based Routing Testing Patterns

### 1. Mock Route Files for Testing

```tsx
// src/test/mock-file-routes.tsx
import { createFileRoute } from '@tanstack/react-router'

// Mock individual route for isolated testing
export const createMockFileRoute = (
  path: string,
  component: React.ComponentType,
  options: any = {},
) => {
  return createFileRoute(path)({
    component,
    ...options,
  })
}

// Common test route components
export const TestHomeRoute = createMockFileRoute('/', () => (
  <div data-testid="home">Home Page</div>
))

export const TestAboutRoute = createMockFileRoute('/about', () => (
  <div data-testid="about">About Page</div>
))

export const TestDynamicRoute = createMockFileRoute('/posts/$postId', () => {
  const { postId } = Route.useParams()
  return <div data-testid="post">Post {postId}</div>
})
```

### 2. Test Route Discovery

```tsx
import { describe, it, expect } from 'vitest'

describe('Route Discovery', () => {
  it('should discover all routes from file structure', () => {
    // Test that your route tree includes all expected routes
    // This helps catch when routes are accidentally not being generated

    const expectedRoutes = [
      '/',
      '/about',
      '/posts',
      '/posts/$postId',
      '/dashboard',
      '/dashboard/settings',
    ]

    expectedRoutes.forEach((routePath) => {
      const routeExists = checkRouteExists(routeTree, routePath)
      expect(routeExists).toBe(true)
    })
  })
})

function checkRouteExists(tree: any, path: string): boolean {
  // Implementation to check if route exists in tree
  // This depends on your route tree structure
  return true // Simplified
}
```

---

## Best Practices for File-Based Route Testing

### 1. Test Organization

```
src/
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   ├── about.tsx
│   ├── posts/
│   │   ├── index.tsx
│   │   └── $postId.tsx
├── test/
│   ├── setup.ts
│   ├── file-route-utils.tsx
│   └── routes/
│       ├── index.test.tsx
│       ├── about.test.tsx
│       └── posts/
│           ├── index.test.tsx
│           └── $postId.test.tsx
```

### 2. Common Test Patterns

```tsx
// Test file for each route file
describe('Posts Route (/posts)', () => {
  it('should render posts list', () => {
    renderWithFileRoutes(<div />, {
      initialLocation: '/posts',
    })

    expect(screen.getByText(/Posts/)).toBeInTheDocument()
  })

  it('should handle loading state', () => {
    // Test pending state for route with loader
  })

  it('should handle error state', () => {
    // Test error handling for route
  })
})

// Test route groups
describe('Dashboard Routes', () => {
  describe('/dashboard', () => {
    // Dashboard index tests
  })

  describe('/dashboard/settings', () => {
    // Settings route tests
  })
})
```

---

## Troubleshooting File-Based Route Testing

### Common Issues

**Problem**: Route tree not found in tests

```bash
Error: Cannot find module '../routeTree.gen'
```

**Solution**: Ensure route tree generation in test setup:

```ts
// vitest.config.ts
export default defineConfig({
  plugins: [
    tanstackRouter(), // Ensure this runs before tests
    react(),
  ],
  test: {
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

**Problem**: Routes not updating in tests after file changes

**Solution**: Clear module cache in test setup:

```ts
// src/test/setup.ts
beforeEach(() => {
  vi.clearAllMocks()
  // Clear route tree cache if needed
  delete require.cache[require.resolve('../routeTree.gen')]
})
```

**Problem**: Type errors in tests with generated routes

**Solution**: Ensure proper TypeScript configuration:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"],
    "moduleResolution": "bundler"
  },
  "include": ["src/**/*", "src/routeTree.gen.ts"]
}
```

---

## Next Steps

After setting up file-based route testing, you might want to:

- [How to Set Up Testing with Code-Based Routing](./setup-testing.md) - Testing patterns for manually defined routes
- [How to Debug Router Issues](./debug-router-issues.md) - Debug file-based routing issues
- [File-Based Routing Guide](../routing/file-based-routing.md) - Learn more about file-based routing

## Related Resources

- [TanStack Router File-Based Routing](../routing/file-based-routing.md) - Complete file-based routing guide
- [File Naming Conventions](../routing/file-naming-conventions.md) - Understanding file structure
- [Testing Library](https://testing-library.com/) - Component testing utilities
- [Vitest](https://vitest.dev/) - Testing framework documentation

---

## Phase 1: Vite + TanStack Router + Bun → Railway

### Goal
Working editor on Railway. No collaboration yet. Documents stored in-memory or localStorage. AI routes served by Bun/Hono on the same Railway service. This phase proves the migration works and gives you a live URL to share.

### 1.0 Scaffold

```
plate-editor/
├── src/
│   ├── client/                    # Vite SPA root
│   │   ├── main.tsx               # React entry point
│   │   ├── router.tsx             # TanStack Router with hash history
│   │   ├── routes/
│   │   │   ├── __root.tsx         # Root layout (fonts, Toaster, QueryClientProvider)
│   │   │   ├── index.tsx          # Redirect → /#/editor/new
│   │   │   └── editor.$docId.tsx  # Editor page (lazy)
│   │   ├── components/            # ← ENTIRE src/components/ from playground, verbatim
│   │   │   ├── editor/            #   plate-editor.tsx, editor-kit.tsx, plugins/*, etc.
│   │   │   └── ui/                #   80+ Plate UI components
│   │   ├── hooks/                 # use-debounce, use-mounted, use-upload-file, etc.
│   │   ├── lib/                   # utils.ts, markdown-joiner-transform.ts
│   │   └── platform/              # ← NEW: abstraction layer
│   │       ├── types.ts           # DocumentStore, AIService interfaces
│   │       ├── index.ts           # Platform detection + re-export
│   │       ├── web.ts             # fetch() implementations (Phase 1+2)
│   │       └── tauri.ts           # invoke() stubs (Phase 3)
│   ├── server/                    # Hono API (runs on Bun)
│   │   ├── index.ts               # Hono app: API routes + static file serving
│   │   ├── routes/
│   │   │   ├── ai.ts              # POST /api/ai/command, POST /api/ai/copilot
│   │   │   └── upload.ts          # ALL /api/uploadthing
│   │   └── ai/                    # ← MOVE from src/app/api/ai/
│   │       ├── prompts.ts         #   Zero changes (pure functions)
│   │       └── utils.ts           #   Zero changes (pure functions)
│   └── shared/
│       └── types.ts               # Document, AICommandParams, etc.
├── public/
│   ├── fonts/
│   │   ├── GeistVF.woff           # ← MOVE from src/app/fonts/
│   │   └── GeistMonoVF.woff
│   └── favicon.ico
├── index.html                     # Vite SPA entry (replaces Next.js layout.tsx)
├── vite.config.ts
├── tsconfig.json
├── biome.json
└── package.json
```

### 1.1 Initialize project

- [ ] Create repo, `bun init`
- [ ] Install core deps:
```bash
# React + Vite
bun add react react-dom
bun add -D vite @vitejs/plugin-react vite-tsconfig-paths

# TanStack
bun add @tanstack/react-router @tanstack/react-query
bun add -D @tanstack/router-plugin

# Tailwind v4
bun add -D tailwindcss @tailwindcss/vite

# React Compiler
bun add -D babel-plugin-react-compiler

# Server
bun add hono

# Linting
bun add -D @biomejs/biome oxlint
```

### 1.2 Create index.html (replaces layout.tsx)

This replaces `src/app/layout.tsx`. The font loading, CSS class application, and metadata all move here.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Plate Editor</title>
  <link rel="icon" href="/favicon.ico" />

  <!-- Critical: preload fonts to avoid FOIT -->
  <link rel="preload" href="/fonts/GeistVF.woff" as="font"
        type="font/woff" crossorigin />
  <link rel="preload" href="/fonts/GeistMonoVF.woff" as="font"
        type="font/woff" crossorigin />

  <!-- Inline critical CSS: skeleton + font-face -->
  <style>
    @font-face {
      font-family: 'Geist Sans';
      src: url('/fonts/GeistVF.woff') format('woff');
      font-display: swap;
      font-weight: 100 900;
    }
    @font-face {
      font-family: 'Geist Mono';
      src: url('/fonts/GeistMonoVF.woff') format('woff');
      font-display: swap;
      font-weight: 100 900;
    }
    :root {
      --font-geist-sans: 'Geist Sans', system-ui, sans-serif;
      --font-geist-mono: 'Geist Mono', ui-monospace, monospace;
    }
    body {
      font-family: var(--font-geist-sans);
      -webkit-font-smoothing: antialiased;
      margin: 0;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/client/main.tsx"></script>
</body>
</html>
```

### 1.3 Vite config

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

export default defineConfig({
  root: '.',
  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/client/routes',
      generatedRouteTree: './src/client/routeTree.gen.ts',
    }),
    react({
      babel: { plugins: ['babel-plugin-react-compiler'] },
    }),
    tailwindcss(),
    tsconfigPaths(),
  ],
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'slate-core': ['slate', 'slate-react', 'slate-dom'],
          'ui-primitives': [
            '@radix-ui/react-popover',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-separator',
            '@radix-ui/react-toolbar',
          ],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',  // Proxy to Hono dev server
    },
  },
});
```

### 1.4 Router with hash history

```ts
// src/client/router.tsx
import { createHashHistory, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

const hashHistory = createHashHistory();

export const router = createRouter({
  routeTree,
  history: hashHistory,
  defaultPreload: 'intent',  // Prefetch on hover/focus
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
```

```tsx
// src/client/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
```

### 1.5 Platform abstraction layer

This is the Tauri-forward design. Phase 1 implements `web.ts`. Phase 3 adds `tauri.ts`.

```ts
// src/client/platform/types.ts
export interface DocumentMeta {
  id: string;
  title: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  title: string;
  content: unknown[];  // Slate node tree (TDescendant[])
  updatedAt: string;
}

export interface DocumentStore {
  get(id: string): Promise<Document | null>;
  save(id: string, doc: Partial<Document>): Promise<void>;
  list(): Promise<DocumentMeta[]>;
  create(): Promise<Document>;
  delete(id: string): Promise<void>;
}

export interface AIService {
  command(params: {
    system: string;
    prompt: string;
    // ... same shape as current route handler input
  }): Promise<Response>;  // Streaming response
  copilot(params: {
    prompt: string;
    // ...
  }): Promise<Response>;
}
```

```ts
// src/client/platform/web.ts
import type { DocumentStore, AIService, Document } from './types';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const store: DocumentStore = {
  async get(id) {
    const res = await fetch(`${API_BASE}/api/documents/${id}`);
    if (!res.ok) return null;
    return res.json();
  },
  async save(id, doc) {
    await fetch(`${API_BASE}/api/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
  },
  async list() {
    const res = await fetch(`${API_BASE}/api/documents`);
    return res.json();
  },
  async create() {
    const res = await fetch(`${API_BASE}/api/documents`, { method: 'POST' });
    return res.json();
  },
  async delete(id) {
    await fetch(`${API_BASE}/api/documents/${id}`, { method: 'DELETE' });
  },
};

export const ai: AIService = {
  command: (params) =>
    fetch(`${API_BASE}/api/ai/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    }),
  copilot: (params) =>
    fetch(`${API_BASE}/api/ai/copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    }),
};
```

```ts
// src/client/platform/index.ts
export type { DocumentStore, AIService, Document, DocumentMeta } from './types';

// Phase 1+2: always web. Phase 3: will add Tauri detection.
export { store, ai } from './web';
```

### 1.6 Move Plate components (THE BULK — mostly copy-paste)

This is the largest task by file count but the simplest by complexity. Every component moves verbatim.

- [ ] Copy `src/components/editor/` → `src/client/components/editor/`
- [ ] Copy `src/components/ui/` → `src/client/components/ui/`
- [ ] Copy `src/hooks/` → `src/client/hooks/`
- [ ] Copy `src/lib/utils.ts` → `src/client/lib/utils.ts`
- [ ] Copy `src/lib/markdown-joiner-transform.ts` → `src/client/lib/`
- [ ] **Bulk remove** `'use client';` directives from all files:
```bash
# From project root
find src/client -name '*.tsx' -o -name '*.ts' | \
  xargs sed -i "s/^'use client';\n//;s/^\"use client\";\n//" 
```
- [ ] **Replace** `next/image` usage in any component (likely none in editor components, only in page.tsx which we replace entirely)
- [ ] **Fix path aliases**: Ensure `tsconfig.json` maps `@/` → `src/client/`

**Working note**: The playground's `page.tsx` (home page) is just the default create-next-app boilerplate with Next.js logos. We replace it entirely. The actual editor is at `src/app/editor/page.tsx` which just renders `<PlateEditor />` + `<Toaster />`.

### 1.7 Rewire editor to use platform layer

Currently `use-chat.ts` references `api: '/api/ai/command'` directly. The AI SDK's `useChat` expects a URL string, so we point it at the platform URL.

- [ ] In `use-chat.ts`: Replace hardcoded `/api/ai/command` with `${import.meta.env.VITE_API_URL || ''}/api/ai/command`
- [ ] In `use-upload-file.ts`: Configure `@uploadthing/react` with `{ url: import.meta.env.VITE_API_URL || '' }`
- [ ] In `plate-editor.tsx`: Wire document loading through `store.get(docId)` in the route loader, pass `value` to `usePlateEditor`

### 1.8 Route: Editor page

```tsx
// src/client/routes/editor.$docId.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Suspense, lazy } from 'react';

// Lazy-load the ENTIRE editor module tree
const PlateEditor = lazy(() => import('../components/editor/plate-editor'));

export const Route = createFileRoute('/editor/$docId')({
  component: EditorPage,
});

function EditorPage() {
  const { docId } = Route.useParams();

  return (
    <div className="h-screen w-full">
      <Suspense fallback={<EditorSkeleton />}>
        <PlateEditor docId={docId} />
      </Suspense>
    </div>
  );
}

function EditorSkeleton() {
  return (
    <div className="h-screen w-full animate-pulse">
      {/* Toolbar skeleton */}
      <div className="h-12 border-b bg-muted/30" />
      {/* Editor area skeleton */}
      <div className="mx-auto mt-8 max-w-3xl space-y-3 px-6">
        <div className="h-8 w-3/4 rounded bg-muted/20" />
        <div className="h-4 w-full rounded bg-muted/10" />
        <div className="h-4 w-5/6 rounded bg-muted/10" />
        <div className="h-4 w-full rounded bg-muted/10" />
      </div>
    </div>
  );
}
```

### 1.9 Server: Hono on Bun (Railway)

```ts
// src/server/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/bun';
import { aiRoutes } from './routes/ai';
import { uploadRoutes } from './routes/upload';

const app = new Hono();

// API routes
app.use('/api/*', cors());
app.route('/api/ai', aiRoutes);
app.route('/api/upload', uploadRoutes);

// Phase 1 temporary: in-memory document store
// (replaced by D1 in Phase 2)
const docs = new Map<string, unknown>();

app.get('/api/documents/:id', (c) => {
  const doc = docs.get(c.req.param('id'));
  if (!doc) return c.json({ error: 'Not found' }, 404);
  return c.json(doc);
});

app.put('/api/documents/:id', async (c) => {
  const body = await c.req.json();
  docs.set(c.req.param('id'), { ...body, id: c.req.param('id'), updatedAt: new Date().toISOString() });
  return c.json({ ok: true });
});

app.post('/api/documents', (c) => {
  const id = crypto.randomUUID();
  const doc = { id, title: 'Untitled', content: [{ type: 'p', children: [{ text: '' }] }], updatedAt: new Date().toISOString() };
  docs.set(id, doc);
  return c.json(doc);
});

// Serve Vite-built SPA (production)
app.use('/*', serveStatic({ root: './dist/client' }));
// SPA fallback: serve index.html for all unmatched routes
app.use('/*', serveStatic({ path: './dist/client/index.html' }));

export default {
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
};
```

### 1.10 Migrate AI routes

The actual AI logic in `prompts.ts` and `utils.ts` is pure functions with zero framework deps. Only the route handlers change.

- [ ] `src/app/api/ai/command/route.ts` → `src/server/routes/ai.ts`:
  - Replace `import { NextRequest } from 'next/server'` → use standard `Request` via Hono's `c.req.raw`
  - `createUIMessageStreamResponse(...)` already returns a standard `Response` — just `return` it
  - The AI SDK `streamUI` / `streamText` functions are framework-agnostic
- [ ] `src/app/api/ai/copilot/route.ts` → same file, separate handler
- [ ] Move `prompts.ts`, `utils.ts` → `src/server/ai/` untouched

### 1.11 Migrate upload route

- [ ] Replace `import { createRouteHandler } from 'uploadthing/next'` → `import { createRouteHandler } from 'uploadthing/server'`
- [ ] Replace `import { createUploadthing } from 'uploadthing/next'` → `import { createUploadthing } from 'uploadthing/server'`
- [ ] Hono adapter: UploadThing v7 has `createRouteHandler` that returns a fetch handler. Wrap in Hono route.

### 1.12 Package.json scripts

```json
{
  "scripts": {
    "dev": "concurrently \"bun run dev:client\" \"bun run dev:server\"",
    "dev:client": "vite",
    "dev:server": "bun --watch src/server/index.ts",
    "build": "vite build && bun build src/server/index.ts --outdir dist/server --target bun",
    "start": "bun dist/server/index.js",
    "typecheck": "tsc --noEmit",
    "lint": "biome check .",
    "lint:fix": "biome check . --fix"
  }
}
```

### 1.13 Railway deployment

**Working note**: Railway's Railpack auto-detects Vite SPAs and serves them via Caddy. But we DON'T want that — we have a Bun server that serves both API routes AND static files. So we need a custom start command.

- [ ] `railway.json`:
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "RAILPACK",
    "buildCommand": "bun install && bun run build"
  },
  "deploy": {
    "startCommand": "bun run start",
    "healthcheckPath": "/api/health"
  }
}
```
- [ ] Add health check route to Hono: `app.get('/api/health', (c) => c.json({ ok: true }))`
- [ ] Set env vars in Railway dashboard: `OPENAI_API_KEY`, `UPLOADTHING_TOKEN`, `PORT`
- [ ] Railway auto-assigns `PORT` — the server reads `process.env.PORT`

### 1.14 Bundle verification

- [ ] After `bun run build`, run `npx vite-bundle-visualizer` (or add `rollup-plugin-visualizer`)
- [ ] Verify initial JS (entry + react-core + router) < 120KB gzip
- [ ] Verify slate-core chunk loads only when navigating to editor route
- [ ] Verify heavy plugins (lowlight, KaTeX, excalidraw) are NOT in any eagerly-loaded chunk

### 1.15 Performance tasks (apply during Phase 1)

These are editor-level, platform-independent. Do them now.

#### Task P1: Dirty tracking + debounced saves
- [ ] Create `use-editor-persistence.ts` (see migration-plan-v2.md, Task 1)
- [ ] Filter `set_selection` ops from onChange — eliminates 80%+ of unnecessary work
- [ ] Debounce saves at 1.5s after last content change
- [ ] Wire into platform `store.save()` instead of direct fetch
- [ ] Add unsaved-changes guard (beforeunload + route navigation)

#### Task P2: Chunking + content-visibility
- [ ] Enable Slate chunking: `editor.getChunkSize = (node) => Editor.isEditor(node) ? 1000 : null`
- [ ] Add `renderChunk` with `contentVisibility: 'auto'` and `containIntrinsicSize: 'auto 400px'`
- [ ] Audit CSS for `[data-slate-editor] > *` selectors, add `[data-slate-chunk]` equivalents
- [ ] Dev-test with chunk size 3, production with 1000
- [ ] Create 5000-paragraph test doc, measure INP in Chrome DevTools

#### Task P3: Hook audit
- [ ] `grep -rn "useSlate\b" src/client/components/ --include="*.tsx" | grep -v "useSlateSelector\|useSlateSelection\|useSlateStatic"`
- [ ] Replace command-only buttons → `useSlateStatic()` (or Plate's `useEditorRef()`)
- [ ] Replace state-reading buttons → `useSlateSelector()` (or Plate's `useEditorSelector()`)
- [ ] Keep `useSlate()` only for floating toolbar (needs full reactivity)
- [ ] Validate with React DevTools Profiler: toolbar buttons should NOT re-render on keystrokes

### Phase 1 Exit Criteria

- [ ] Editor loads on Railway URL with hash routing (`/#/editor/new`)
- [ ] AI command + copilot work (streaming responses)
- [ ] File upload works
- [ ] All 40+ plugin kits function (bold, lists, tables, code blocks, etc.)
- [ ] Bundle: initial JS < 120KB gzip
- [ ] Typing latency < 50ms on 5000-node doc (Chrome DevTools Performance)
- [ ] Profiler: toolbar re-renders eliminated on keystrokes

---

## Phase 2: Cloudflare Workers + Hono + D1 + Durable Objects

### Goal
Move from Railway to Cloudflare. Persistent document storage in D1. Real-time collaboration via Durable Objects + Yjs. AI routes on the edge. Uploads to R2.

### What Changes from Phase 1

| Component | Phase 1 (Railway) | Phase 2 (Cloudflare) |
|---|---|---|
| Runtime | Bun | Cloudflare Workers (V8 isolates) |
| Static serving | Hono `serveStatic({ root: './dist/client' })` | Worker KV / R2 + `serveStatic` from hono/cloudflare-workers |
| Document storage | In-memory `Map` | D1 (SQLite) via Drizzle ORM |
| File uploads | UploadThing | R2 (or keep UploadThing if preferred) |
| AI routes | Direct OpenAI SDK | Same SDK (works on Workers with `nodejs_compat`) |
| Collaboration | None | Durable Objects + y-durableobjects + Yjs |
| Platform layer | `web.ts` calling `/api/...` | Same `web.ts` — endpoints unchanged |

**Critical**: The client SPA does not change AT ALL. Same Vite build, same hash routing, same platform abstraction. Only the server implementation swaps.

### 2.0 Project structure additions

```
plate-editor/
├── src/
│   ├── client/                    # ← UNCHANGED from Phase 1
│   ├── server/                    # ← Rewritten for CF Workers
│   │   ├── index.ts               # Hono app entry for CF Workers
│   │   ├── routes/
│   │   │   ├── ai.ts              # Same handlers, adapted for Workers env
│   │   │   ├── documents.ts       # CRUD → D1 via Drizzle
│   │   │   └── upload.ts          # R2 upload handler
│   │   ├── ai/
│   │   │   ├── prompts.ts         # ← UNCHANGED
│   │   │   └── utils.ts           # ← UNCHANGED
│   │   ├── collaboration/
│   │   │   └── room.ts            # YjsCollabRoom Durable Object
│   │   └── db/
│   │       ├── schema.ts          # Drizzle schema (documents table)
│   │       └── index.ts           # Drizzle client init from D1 binding
│   └── shared/                    # ← UNCHANGED
├── drizzle/
│   └── migrations/                # Generated by drizzle-kit
├── wrangler.toml                  # CF Worker + D1 + DO + R2 config
├── drizzle.config.ts              # Drizzle Kit config (d1-http driver)
└── ...
```

### 2.1 Wrangler configuration

```toml
name = "plate-editor"
main = "src/server/index.ts"
compatibility_date = "2025-09-01"
compatibility_flags = ["nodejs_compat"]

# D1 database
[[d1_databases]]
binding = "DB"
database_name = "plate-editor-db"
database_id = "<from-dashboard>"
migrations_dir = "drizzle/migrations"

# R2 bucket for file uploads
[[r2_buckets]]
binding = "UPLOADS"
bucket_name = "plate-editor-uploads"

# Durable Objects for Yjs collaboration
[durable_objects]
bindings = [
  { name = "YJS_ROOMS", class_name = "YjsCollabRoom" }
]

[[migrations]]
tag = "v1"
new_classes = ["YjsCollabRoom"]

# Static assets (Vite build output)
[assets]
directory = "dist/client"
```

### 2.2 D1 + Drizzle schema

```ts
// src/server/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  title: text('title').notNull().default('Untitled'),
  // Store Slate node tree as JSON text
  // D1 max row size is 1MB — for very large docs, overflow to R2
  content: text('content', { mode: 'json' }).notNull().default('[]'),
  ownerId: text('owner_id'),  // For auth later
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export type DocumentRow = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
```

```ts
// src/server/db/index.ts
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}
```

### 2.3 Document CRUD routes (replace in-memory Map)

```ts
// src/server/routes/documents.ts
import { Hono } from 'hono';
import { createDb } from '../db';
import { documents } from '../db/schema';
import { eq } from 'drizzle-orm';

type Env = { Bindings: { DB: D1Database } };

export const documentRoutes = new Hono<Env>();

documentRoutes.get('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const doc = await db.select().from(documents).where(eq(documents.id, c.req.param('id'))).get();
  if (!doc) return c.json({ error: 'Not found' }, 404);
  return c.json(doc);
});

documentRoutes.put('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  await db.update(documents)
    .set({ ...body, updatedAt: new Date().toISOString() })
    .where(eq(documents.id, c.req.param('id')));
  return c.json({ ok: true });
});

documentRoutes.post('/', async (c) => {
  const db = createDb(c.env.DB);
  const id = crypto.randomUUID();
  const doc = {
    id,
    title: 'Untitled',
    content: [{ type: 'p', children: [{ text: '' }] }],
  };
  await db.insert(documents).values(doc);
  return c.json({ ...doc, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
});

documentRoutes.delete('/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(documents).where(eq(documents.id, c.req.param('id')));
  return c.json({ ok: true });
});

documentRoutes.get('/', async (c) => {
  const db = createDb(c.env.DB);
  // List metadata only, not full content
  const rows = await db.select({
    id: documents.id,
    title: documents.title,
    updatedAt: documents.updatedAt,
  }).from(documents).orderBy(documents.updatedAt);
  return c.json(rows);
});
```

### 2.4 Hono app entry for CF Workers

```ts
// src/server/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { aiRoutes } from './routes/ai';
import { uploadRoutes } from './routes/upload';
import { documentRoutes } from './routes/documents';

type Env = {
  Bindings: {
    DB: D1Database;
    UPLOADS: R2Bucket;
    YJS_ROOMS: DurableObjectNamespace;
    // AI keys
    OPENAI_API_KEY: string;
  };
};

const app = new Hono<Env>();

app.use('/api/*', cors());
app.get('/api/health', (c) => c.json({ ok: true }));

app.route('/api/ai', aiRoutes);
app.route('/api/upload', uploadRoutes);
app.route('/api/documents', documentRoutes);

// WebSocket upgrade for collaboration
app.get('/api/collab/:roomId', async (c) => {
  const roomId = c.req.param('roomId');
  const id = c.env.YJS_ROOMS.idFromName(roomId);
  const stub = c.env.YJS_ROOMS.get(id);
  return stub.fetch(c.req.raw);
});

export default app;

// Export Durable Object class (required by wrangler)
export { YjsCollabRoom } from './collaboration/room';
```

### 2.5 Collaboration: Durable Object + y-durableobjects

```bash
bun add y-durableobjects yjs
```

```ts
// src/server/collaboration/room.ts
import { YDurableObjects } from 'y-durableobjects';

export class YjsCollabRoom extends YDurableObjects {
  // y-durableobjects handles:
  // - WebSocket upgrade via Hono's WS helper
  // - Yjs document sync protocol
  // - Hibernatable WebSockets (cost-efficient idle connections)
  // - Persistence to DO storage

  // Override for custom behavior:
  // async onConnect(conn, doc) { ... }
  // async onDisconnect(conn, doc) { ... }
}
```

**Client-side integration** (in editor component):
```ts
// src/client/components/editor/use-collab.ts
import { YjsPlugin } from '@platejs/yjs/react';

export function makeCollabPlugin(docId: string) {
  const wsUrl = `${import.meta.env.VITE_WS_URL || location.origin.replace('http', 'ws')}/api/collab/${docId}`;

  return YjsPlugin.configure({
    options: {
      providerConfigs: [{
        type: 'custom',
        options: { url: wsUrl, roomName: docId },
      }],
    },
  });
}
```

### 2.6 R2 file uploads

Replace UploadThing with R2 direct uploads (saves cost, removes third-party dependency):

```ts
// src/server/routes/upload.ts
import { Hono } from 'hono';

type Env = { Bindings: { UPLOADS: R2Bucket } };

export const uploadRoutes = new Hono<Env>();

uploadRoutes.post('/file', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File;
  if (!file) return c.json({ error: 'No file' }, 400);

  const key = `${crypto.randomUUID()}-${file.name}`;
  await c.env.UPLOADS.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  // Return public URL (configure R2 custom domain or use presigned)
  return c.json({ url: `/api/upload/file/${key}`, key });
});

uploadRoutes.get('/file/:key', async (c) => {
  const obj = await c.env.UPLOADS.get(c.req.param('key'));
  if (!obj) return c.notFound();

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('cache-control', 'public, max-age=31536000, immutable');

  return new Response(obj.body, { headers });
});
```

### 2.7 Drizzle migrations

```ts
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
```

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate:local": "wrangler d1 migrations apply plate-editor-db --local",
    "db:migrate:prod": "wrangler d1 migrations apply plate-editor-db --remote",
    "db:studio": "drizzle-kit studio"
  }
}
```

### 2.8 Deployment

- [ ] `wrangler d1 create plate-editor-db` → get database_id → update wrangler.toml
- [ ] `wrangler r2 bucket create plate-editor-uploads`
- [ ] `bun run db:generate` → creates migration SQL
- [ ] `bun run db:migrate:prod` → applies to remote D1
- [ ] `wrangler secret put OPENAI_API_KEY`
- [ ] `bun run build` (Vite client build)
- [ ] `wrangler deploy`

### 2.9 Platform layer: zero changes

The client's `web.ts` already calls `/api/documents/:id`, `/api/ai/command`, etc. The Hono Worker serves these same paths. **The SPA does not know or care that the backend moved from Bun on Railway to V8 isolates on Cloudflare.** This is the payoff of the abstraction layer.

### Phase 2 Exit Criteria

- [ ] Editor loads on `*.workers.dev` URL
- [ ] Documents persist in D1 (create, save, load, list, delete)
- [ ] File uploads stored in R2, served with immutable cache headers
- [ ] AI command + copilot work on Workers (streaming)
- [ ] Collaboration: two browser tabs editing same document via Yjs + Durable Object
- [ ] Remote cursor overlay renders for collaborators
- [ ] `wrangler deploy` completes in < 30s
- [ ] Bundle unchanged from Phase 1 (client build is identical)

---

## Phase 3: Tauri Desktop App

### Goal
Wrap the exact same SPA in a Tauri v2 webview. Desktop app with native window chrome, system tray, and optional local-first document storage. Collaboration still goes through CF Workers WebSocket.

### What Changes from Phase 2

| Component | Phase 2 (Web) | Phase 3 (Tauri) |
|---|---|---|
| Shell | Browser | Native webview (WebView2 / WebKit) |
| Routing | Hash routing (same) | Hash routing (same) |
| API calls | `fetch('/api/...')` to same origin | `fetch('https://plate.example.com/api/...')` to remote CF Worker |
| Document storage | D1 via API | **Either**: remote D1 via API (thin wrapper) **OR** local SQLite via Tauri `invoke()` |
| Collaboration | WebSocket to CF DO | WebSocket to CF DO (same) |
| AI | API to CF Worker | API to CF Worker (same) |
| File storage | R2 via API | R2 via API (same) |
| Offline | None | Y.Doc persists to IndexedDB via y-indexeddb |

### 3.0 Project structure additions

```
plate-editor/
├── src/
│   ├── client/
│   │   └── platform/
│   │       ├── index.ts           # ← UPDATED: platform detection
│   │       ├── types.ts           # ← UNCHANGED
│   │       ├── web.ts             # ← UPDATED: absolute URL for Tauri
│   │       └── tauri.ts           # ← NEW: invoke()-based implementations
│   └── ...
├── src-tauri/                     # ← NEW: Rust backend
│   ├── src/
│   │   ├── main.rs                # Tauri entry
│   │   ├── lib.rs                 # Command handlers
│   │   └── db.rs                  # SQLite operations (if local-first)
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── icons/
└── ...
```

### 3.1 Add Tauri to existing project

```bash
# From project root
bun add -D @tauri-apps/cli
bunx tauri init
```

Tauri init will create `src-tauri/` with boilerplate. Configure:

```jsonc
// src-tauri/tauri.conf.json
{
  "build": {
    "beforeDevCommand": "bun run dev:client",
    "devUrl": "http://localhost:5173",
    "beforeBuildCommand": "bun run build",
    "frontendDist": "../dist/client"
  },
  "app": {
    "title": "Plate Editor",
    "identifier": "com.cicero.plate-editor",
    "windows": [
      {
        "title": "Plate Editor",
        "width": 1200,
        "height": 800,
        "resizable": true,
        "fullscreen": false
      }
    ],
    "security": {
      "csp": "default-src 'self'; connect-src 'self' https://plate.example.com wss://plate.example.com; style-src 'self' 'unsafe-inline'; font-src 'self'"
    }
  }
}
```

### 3.2 Update platform detection

```ts
// src/client/platform/index.ts
export type { DocumentStore, AIService, Document, DocumentMeta } from './types';

const isTauri = '__TAURI_INTERNALS__' in window;

// Dynamic import so Tauri-specific code doesn't bloat the web bundle
const platform = isTauri
  ? await import('./tauri')
  : await import('./web');

export const store = platform.store;
export const ai = platform.ai;
```

### 3.3 Update web.ts for absolute URLs

When running inside Tauri, there's no same-origin server. All API calls must use the full CF Worker URL.

```ts
// src/client/platform/web.ts
// In Tauri context, VITE_API_URL must be the full CF Worker URL
// e.g., https://plate-editor.your-domain.workers.dev
const API_BASE = import.meta.env.VITE_API_URL || '';

// ... rest identical to Phase 1
```

For development: `VITE_API_URL=http://localhost:3000` in `.env`
For Tauri production: `VITE_API_URL=https://plate-editor.your-domain.workers.dev` in `.env.production`

### 3.4 Tauri platform adapter (thin wrapper mode)

The simplest approach — Tauri is just a desktop Chrome pointing at your remote API:

```ts
// src/client/platform/tauri.ts
// Thin wrapper: all data flows to remote CF Worker
// Same as web.ts but with absolute URL and Tauri HTTP plugin for CORS-free requests
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

const API_BASE = import.meta.env.VITE_API_URL;

// Use Tauri's HTTP plugin to bypass CORS restrictions in the webview
const f = (url: string, init?: RequestInit) => tauriFetch(url, init);

export const store: DocumentStore = {
  async get(id) {
    const res = await f(`${API_BASE}/api/documents/${id}`);
    if (!res.ok) return null;
    return res.json();
  },
  // ... same pattern as web.ts but using tauriFetch
};

export const ai: AIService = {
  command: (params) =>
    f(`${API_BASE}/api/ai/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    }),
  // ...
};
```

### 3.5 Local-first mode (optional, high-value)

If you want the app to work offline and launch instantly:

```rust
// src-tauri/src/lib.rs
use tauri_plugin_sql::{Migration, MigrationKind};

#[tauri::command]
fn get_document(id: String, db: tauri::State<Database>) -> Result<Document, String> {
    // SQLite query via tauri-plugin-sql
}

#[tauri::command]
fn save_document(id: String, content: serde_json::Value, db: tauri::State<Database>) -> Result<(), String> {
    // SQLite upsert
}
```

```ts
// src/client/platform/tauri.ts (local-first variant)
import { invoke } from '@tauri-apps/api/core';

export const store: DocumentStore = {
  async get(id) {
    return invoke<Document | null>('get_document', { id });
  },
  async save(id, doc) {
    await invoke('save_document', { id, ...doc });
  },
  // ...
};
```

**Sync strategy**: Yjs handles this naturally. The Y.Doc is the single source of truth. On reconnection, `y-indexeddb` replays local changes to the DO via WebSocket. No custom sync code needed.

### 3.6 Tauri plugins to add

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-http = "2"           # CORS-free HTTP from webview
tauri-plugin-sql = { version = "2", features = ["sqlite"] }  # Local SQLite (if local-first)
tauri-plugin-window-state = "2"   # Remember window size/position
```

### 3.7 CSP for Tauri

The Content Security Policy in `tauri.conf.json` must allow connections to your CF Worker:

```
connect-src 'self' https://plate-editor.your-domain.workers.dev wss://plate-editor.your-domain.workers.dev
```

Without this, `fetch()` and `WebSocket` to the remote API will be silently blocked.

### 3.8 Build and distribute

```bash
# Development (opens Tauri window with Vite HMR)
bunx tauri dev

# Production build (creates .dmg / .msi / .AppImage)
bunx tauri build
```

Tauri v2 produces ~3–5MB installers (vs Electron's 80–150MB). The Vite-built SPA is embedded in the binary.

### Phase 3 Exit Criteria

- [ ] `bunx tauri dev` opens native window with working editor
- [ ] Hash routing works: `tauri://localhost/#/editor/abc123`
- [ ] API calls reach remote CF Worker (documents persist in D1)
- [ ] Collaboration works (WebSocket to CF Durable Object from Tauri webview)
- [ ] File uploads work (R2 via CF Worker API)
- [ ] AI features work (streaming from CF Worker)
- [ ] Window state persists between launches (size, position)
- [ ] `bunx tauri build` produces installer < 10MB
- [ ] (If local-first): editor works offline, syncs on reconnection

---

## Cross-Phase Dependency Map

```
Phase 1                    Phase 2                    Phase 3
────────                   ────────                   ────────

Vite build ──────────────────────────────────────────► Same build
TanStack Router (hash) ──────────────────────────────► Same routing
Platform types.ts ───────────────────────────────────► Same interfaces
web.ts (fetch) ──────────► web.ts (same API paths) ──► web.ts (absolute URL)
                                                      tauri.ts (invoke or tauriFetch)
Plate components ────────────────────────────────────► Unchanged (zero edits)
Performance tasks ───────────────────────────────────► Same optimizations

In-memory Map ───────────► D1 + Drizzle              ► D1 (remote) or SQLite (local)
UploadThing ─────────────► R2                         ► R2 (via API)
No collab ───────────────► DO + y-durableobjects      ► Same (WebSocket from webview)
Bun + Hono (Railway) ───► Hono (CF Worker)            ► CF Worker (remote API)
```

The vertical arrows show what changes. The horizontal arrows show what carries forward unchanged. The platform abstraction layer (`types.ts` → `web.ts` / `tauri.ts`) is the seam that makes Phase 3 additive rather than a rewrite.
