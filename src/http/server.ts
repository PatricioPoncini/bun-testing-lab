import { serve } from "bun";
import app from "../app.ts";

export class HttpServer {
  private static server: ReturnType<typeof serve> | null = null;
  private static port = 3000;

  static async start() {
    this.server = serve({
      port: this.port,
      fetch: app.fetch,
    });
    console.log(
      `\x1b[32m 📡 Server up and running on port :${this.port} \x1b[0m`,
    );
  }

  static async stop() {
    this.server?.stop();
    console.log("\x1b[31m 🔴 HTTP server stopped \x1b[0m");
  }
}
