# `Testing Lab`

This repository contains a small backend server built with **Bun**, **Hono**, **Redis**, and **TypeScript**, designed as a playground for exploring different testing strategies.

The goal of this project is to provide clear, practical examples of **unit tests**, **integration tests**, and **end-to-end (E2E) tests** while experimenting with modern backend tools.

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
- Experiment with backend techniques using Bun and Hono

## `▶️ Running the server`

```sh
bun run dev
```

The server will automatically reload when files change.

## `🧪 Running tests`

```shell
bun test
```

Tests will be progressively added across all categories (unit, integration, and E2E).

---

### `📝 Notes`

This project is intentionally minimal and modular to make testing patterns easy to understand and extend.
More test cases, utilities, and scenarios will be added over time.
