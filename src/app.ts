import { IncomingMessage, ServerResponse } from "http";
import { checkIsUrlValid } from "./utils/validate";
import { handleNotFoundError } from "./utils/handleErrors";
import { getAllUsers, createUser } from "./api";

const app = async (req: IncomingMessage, res: ServerResponse) => {
  if (!req?.url) return;

  const isUrlValid = checkIsUrlValid(req);
  if (!isUrlValid) {
    handleNotFoundError(res);
    return;
  }

  if (req.url.split('/').length === 4) {
    return;
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
