import dotenv from "dotenv";
import db from "./config/db.js";
import cluster from "cluster";
import os from "os";
import app from "./app.js";

dotenv.config();

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    console.log(`Setting up ${numCPUs} workers to handle high scale load...`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Spawning a new one...`);
        cluster.fork();
    });
} else {
    const PORT = process.env.PORT || 8000;

    app.listen(PORT, ()=> {
        console.log(`Worker ${process.pid} started and listening on ${PORT}`);
        db(); 
    });
}