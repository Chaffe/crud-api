import { IncomingMessage, ServerResponse } from "http";
import { checkIsUrlValid } from "./utils/validate";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "./api";
import { handleNotFoundError } from "./utils/handleErrors";

const app = async (req: IncomingMessage, res: ServerResponse) => {
  if (!req.url) {
    return;
  }

  const isUrlValid = checkIsUrlValid(req);
  if (!isUrlValid) {
    handleNotFoundError(res);
    return;
  }

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
}

export default app;
