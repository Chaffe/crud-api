import 'dotenv/config'
import http from 'http';
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from "./api";
import { checkIsUrlValid } from "./utils/validate";
import { handleNotFoundError } from "./utils/handleErrors";

const server = http.createServer((req, res) => {
  if (!req.url) {
    return;
  }

  const isUrlValid = checkIsUrlValid(req);
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

// server.listen(process.env.PORT, 'localhost', null, (error) => {
//   error ? console.log(error) : console.log(`listening port ${process.env.PORT}`);
// });

server.listen(3000, () => console.log(`Listening port ${process.env.PORT}`));
