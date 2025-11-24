import { HttpServer } from "./src/http/server.ts";
import { RedisService } from "./src/services/redisService.ts";

// TODO: Esto podria pasar a una clase Application que sea general para todos los servicios
async function main() {
    await RedisService.start();
    await HttpServer.start();

    const gracefulShutdown = async () => {
        await HttpServer.stop();
        await RedisService.stop();
        process.exit(0);
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
}

await main();
