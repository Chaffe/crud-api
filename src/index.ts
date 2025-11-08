import 'dotenv/config'
import http from 'http';
import app from "./app";
import { PORT } from "./consts";

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Listening port ${PORT}`));
