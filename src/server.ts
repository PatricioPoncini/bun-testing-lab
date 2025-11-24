import { serve } from "bun";
import app from "./app";
import { redisClient } from "./services/redisService";

export async function startServer(port = 0) {
    const server = serve({
        port,
        fetch: app.fetch,
    });

    console.log(`[HTTP] Server running on port ${server.port}`);

    return server;
}

export async function stopServer(server: ReturnType<typeof serve>) {
    try {
        if (redisClient?.isOpen) {
            await redisClient.quit();
            console.log("[Redis] Connection closed.");
        }
    } catch (err) {
        console.error("[Redis] Error while closing client:", err);
    }

    server.stop();
    console.log("[HTTP] Shutdown complete.");
}
