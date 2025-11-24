# `Testing Lab`

This repository contains a small backend server built with **Bun**, **Hono**, **Redis**, and **TypeScript**, designed as a playground for exploring different testing strategies.

The project demonstrates how to structure a backend with singleton services and how to write unit, integration, and end-to-end (E2E) tests using real-world tools.

## `🚀 Tech Stack`

- **Bun** – Ultra-fast JavaScript runtime used to run the server and tests
- **Hono** – Lightweight and high-performance web framework
- **Redis** – In-memory data store used for caching and message handling
- **TypeScript** – Static typing to improve maintainability and code quality

## `🎯 Purpose`

This project is intended as a **testing playground**, where you can:

- Write and run **unit tests** for isolated logic
- Build **integration tests** that interact with Redis and other services
- Run **end-to-end tests** that exercise the entire API
- Experiment with backend design patterns like singleton services
- Learn modern testing patterns in a minimal, modular codebase

## `🛠️ Singleton services`

Both RedisService and HttpServer are implemented as singletons:

- Ensures only one instance of Redis or HTTP server exists
- Makes it easier to test, since you can start/stop them globally
- Avoids conflicts when running multiple tests or endpoints simultaneously

## `🧪 How tests work in this project`

### `Unit tests`

- Test individual services or functions in isolation, without starting HTTP server or connecting to Redis.
- Focused on logic correctness.
  Example: Testing `RedisService.lpush` with a mocked Redis client.

```ts
test("Should call lPush on the client", async () => {
  const fakeClient = {
    lPush: mock(async () => 1),
  };

  (RedisService as any).client = fakeClient;

  await RedisService.lpush("messages", "hello");

  expect(fakeClient.lPush).toHaveBeenCalled();
  expect(fakeClient.lPush).toHaveBeenCalledWith("messages", "hello");
});
```

### `Integration tests`

- Test how services work together.
- RedisService singleton is used as-is, no mocking.
- Redis must be running (`docker compose up -d`).

```ts
test("POST /messages → stores a new message successfully", async () => {
  const req = new Request("http://localhost/messages", {
    method: "POST",
    body: JSON.stringify({ text: "hi" }),
  });

  const res = await messageRoutes.request("/", req);
  expect(res.status).toBe(200);
});
```

### `End-to-End (E2E) tests`

- Test the full flow, including HTTP routes and Redis.
- Simulate real API usage: POST a message → GET messages.
- Ensures everything works together.

```ts
test("Should save a valid message and then retrieve it", async () => {
  const body = {
    text: "hi",
  };
  const postResponse = await axios.post<PostMessageResponse>(
    "http://localhost:3000/messages",
    body,
  );
  expect(postResponse.status).toBe(200);
  expect(postResponse.data.ok).toBeTruthy();

  const getResponse = await axios.get<GetMessagesResponse>(
    "http://localhost:3000/messages",
  );
  expect(getResponse.status).toBe(200);
  expect(getResponse.data.count).toEqual(1);
  expect(getResponse.data.messages.length).toEqual(1);
});
```

## `▶️ Running the server`

```sh
bun run dev
```

The server will automatically reload when files change.

## `🧪 Running tests`

```shell
bun test
```

- **Unit tests**: Test logic in isolation
- **Integration tests**: Test services and external dependencies (Redis)
- **E2E tests**: Test full API behavior

---

### `📝 Notes`

- The project is intentionally minimal and modular to make testing patterns easy to understand.
- The README aims to provide immediate understanding of unit vs integration vs E2E tests in a practical backend project.
