import 'dotenv/config'
import http from 'http';
import app from "./app";

const server = http.createServer(app);

server.listen(3000, () => console.log(`Listening port ${process.env.PORT}`));
