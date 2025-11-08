import { IncomingMessage, ServerResponse } from "http";
import { checkIsUrlValid } from "./utils/validate";
import { handleNotFoundError } from "./utils/handleErrors";

const app = async (req: IncomingMessage, res: ServerResponse) => {
  const isUrlValid = checkIsUrlValid(req);
  if (!isUrlValid) {
    handleNotFoundError(res);
    return;
  }
}

export default app;
