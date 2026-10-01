import dotenv from "dotenv";
import db from "./config/db.js";
import cluster from "cluster";
import os from "os";
import app from "./app.js";
import http from "http";
import { initSocket } from "./config/socket.js";

dotenv.config();

const startServer = () => {
    const PORT = process.env.PORT || 8000;
    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
        console.log(`Server (PID ${process.pid}) listening on port ${PORT}`);
        db(); 
    });
};

const isClusterEnabled = process.env.ENABLE_CLUSTER === "true";

if (isClusterEnabled) {
    const numCPUs = os.cpus().length;
    if (cluster.isPrimary) {
        console.log(`Primary ${process.pid} is running`);
        console.log(`Setting up ${numCPUs} workers...`);

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on("exit", (worker) => {
            console.log(`Worker ${worker.process.pid} exited. Spawning replacement...`);
            cluster.fork();
        });
    } else {
        startServer();
    }
} else {
    startServer();
}