import 'dotenv/config'
import http from 'http';
import {getAllUsers, createUser, getUserById, updateUser, deleteUser} from "./api/index.js";
import { checkIsUrlValid } from "./utils/validate.js";
import { handleNotFoundError } from "./utils/handleErrors.js";

const server = http.createServer((req, res) => {
  // res.setHeader('Content-Type', 'application/json');

  const isUrlValid = checkIsUrlValid(req, res);
  if (isUrlValid) {
    if (req.url.split('/').length === 4) {
      switch (req.method) {
        case 'GET':
          getUserById(req, res);
          break;
        case 'PUT':
          updateUser(req, res);
          break;
        case 'DELETE':
          deleteUser(req, res);
          break;
      }
    } else {
      switch (req.method) {
        case 'GET':
          getAllUsers(req, res);
          break;
        case 'POST':
          createUser(req, res);
          break;
      }
    }
  } else {
    handleNotFoundError(res);
  }
});

server.listen(process.env.PORT, 'localhost', (error) => {
  error ? console.log(error) : console.log(`listening port ${process.env.PORT}`);
});
