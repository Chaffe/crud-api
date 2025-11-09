import http from 'http';
import cluster, { Worker } from 'cluster';
import os from 'os';
import dotenv from "dotenv";
import app from './app';
import { CONTENT_TYPE_HEADER, PORT, STATUS_MODELS } from './consts';

dotenv.config();

const numCPUs = os.cpus().length;
const numWorkers = Math.max(1, numCPUs - 1);

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  const workers: Worker[] = [];
  let currentWorker = 0;

  for (let i = 0; i < numWorkers; i++) {
    const worker = cluster.fork();
    workers.push(worker);
    console.log(`Worker ${worker.process.pid} started on port ${PORT + i + 1}`);
  }

  const balancer =
    http.createServer((req, res) => {
      const targetWorker = workers[currentWorker];
      currentWorker = (currentWorker + 1) % numWorkers;
      const options = {
        hostname: 'localhost',
        port: PORT + workers.indexOf(targetWorker) + 1,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };
      const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode!, proxyRes.headers);
        proxyRes.pipe(res);
      });
      proxyReq.on('error', (err) => {
        console.error('Proxy error:', err);
        res.writeHead(STATUS_MODELS.INTERNAL_SERVER.code, CONTENT_TYPE_HEADER);
        res.end(JSON.stringify({ message: STATUS_MODELS.INTERNAL_SERVER.message }));
      });
      req.pipe(proxyReq);
    });

  balancer.listen(PORT, () => console.log(`Load balancer listening on port ${PORT}`));
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    workers[workers.indexOf(worker)] = cluster.fork();
  });
} else {
  const workerPort = PORT + cluster.worker!.id;
  const server = http.createServer(app);
  server.listen(workerPort, () => console.log(`Worker ${process.pid} listening on port ${workerPort}`));
}