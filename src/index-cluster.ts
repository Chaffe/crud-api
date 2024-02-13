import cluster from "cluster";
import { cpus } from "os";
import dotenv from "dotenv";
import http from "http";
import app from "./app";

dotenv.config();

const numCPUs = cpus().length;
const port = Number(process.env.PORT) || 3000;
const hostname = "127.0.0.1";

if (cluster.isPrimary) {
  console.log(
    `Primary ${process.pid} is running at http://${hostname}:${port}`
  );

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  const newPort = port + cluster.worker.id;
  const server = http.createServer(app);

  server.listen(newPort, () => {
    console.log(`Worker ${process.pid} started on port ${newPort}`);
  });
}
