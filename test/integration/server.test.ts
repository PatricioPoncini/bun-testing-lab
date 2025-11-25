import { describe, test, expect } from "bun:test";
import { HttpServer } from "../../src/http/server";

describe("HTTP Server – Integration", () => {
  test("Should start and stop the server without errors", async () => {
    await HttpServer.start();
    await HttpServer.stop();
    expect(true).toBe(true);
  });

  test("Should allow stop() even if server was not started", async () => {
    await HttpServer.stop();
    expect(true).toBe(true);
  });
});
