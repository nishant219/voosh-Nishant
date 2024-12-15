import { initializeDatabase } from "./config/database";
import createServer from "./utils/server";
import 'dotenv/config';

async function startServer() {
    try {
        await initializeDatabase();
        console.log(`DB connected and tables created`);

        const app = createServer();

        const port = process.env.PORT ? parseInt(process.env.PORT) : 4800;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error(`Unable to start server: ${err}`);
        process.exit(1);
    }
}

startServer();

export default startServer;