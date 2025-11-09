import { IncomingMessage, ServerResponse } from "http";
import { checkIsUrlValid } from "./utils/validate";
import { handleNotFoundError } from "./utils/handleErrors";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "./api";

const app = async (req: IncomingMessage, res: ServerResponse) => {
  if (!req?.url) return;

  if (req.url.split('/').length === 4) {
    const isUrlValid = checkIsUrlValid(req, true);
    if (!isUrlValid) {
      handleNotFoundError(res);
      return;
    }

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
    const isUrlValid = checkIsUrlValid(req);
    if (!isUrlValid) {
      handleNotFoundError(res);
      return;
    }

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
