import { start } from "repl";
import app from "./app";
import { config } from "./config/config";
import { DatabaseService } from "./services/database.service";

const PORT = config.port || 3000;
const dbService = DatabaseService.getInstance();

async function startServer() {
    try {
        await dbService.connect();

        const server = app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT} in ${config.env} mode`);
        });

        const shutdown = async () => {
            console.log('Shutting down server...');
            server.close(async () => {
                await dbService.disconnect();
                console.log('Server shutdown complete.');
                process.exit(0);
            });
        }

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

startServer();