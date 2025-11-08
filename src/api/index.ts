import { v4 as uuidv4 } from 'uuid';
import { IncomingMessage, ServerResponse } from "http";
import { handleBadRequestError, internalServerError } from "../utils/handleErrors";
import { usersAPI } from "../db/users";
import { checkIsUserValid } from "../utils/validate";
import { CreateUserDto } from "../types/user.dto";

export const getAllUsers = (req: IncomingMessage, res: ServerResponse): void => {
  try {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(usersAPI));
  } catch (error) {
    console.error("Something went wrong.", error);
    internalServerError(res);
  }
};

export const createUser = (req: IncomingMessage, res: ServerResponse): void => {
  let requestBody = '';

  try {
    req.on('data', (chunk) => {
      requestBody = chunk.toString();
    });

    req.on('end', () => {
      const { username, age, hobbies }: CreateUserDto = JSON.parse(requestBody);
      const isUserValid = checkIsUserValid({ username, age, hobbies });

      if (!isUserValid) {
        handleBadRequestError(res);
        return;
      }

      const userData = {
        id: uuidv4(),
        username,
        age,
        hobbies,
      };

      usersAPI.push(userData);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(userData));
    })
  } catch (error) {
    console.error("Something went wrong.", error);
    internalServerError(res);
  }
};