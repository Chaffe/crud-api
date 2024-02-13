import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { IncomingMessage, ServerResponse } from 'http'
import { usersAPI } from "../db/users";
import { checkIsUserValid } from "../utils/validate";
import {
  handleBadRequestError,
  handleUserNotExistedError,
  handleUUIDError,
  internalServerError
} from "../utils/handleErrors";

const SPLIT_URL_LAST_INDEX = -1;

const getUrlId = (req: IncomingMessage): string|undefined => req.url?.split('/').at(SPLIT_URL_LAST_INDEX);

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
      const { username, age, hobbies } = JSON.parse(requestBody);
      const isUserValid = checkIsUserValid(username, age, hobbies);

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

export const getUserById = (req: IncomingMessage, res: ServerResponse): void => {
  try {
    const id = getUrlId(req);
    if (!id) {
      return;
    }

    const isUUIDValid = uuidValidate(id);

    if (!isUUIDValid) {
      handleUUIDError(res);
      return;
    }

    const user = usersAPI.find(user => user.id === id);
    if (!user) {
      handleUserNotExistedError(res);
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } catch (error) {
    console.error("Something went wrong.", error);
    internalServerError(res);
  }
};

export const updateUser = (req: IncomingMessage, res: ServerResponse): void => {
  try {
    const id = getUrlId(req);
    if (!id) {
      return;
    }

    const isUUIDValid = uuidValidate(id);

    if (!isUUIDValid) {
      handleUUIDError(res);
      return;
    }

    const user = usersAPI.find(user => user.id === id);

    if (!user) {
      handleUserNotExistedError(res);
      return;
    }

    let requestBody = '';

    req.on('data', (chunk) => {
      requestBody = chunk.toString();
    });

    req.on('end', () => {
      const { username, age, hobbies } = JSON.parse(requestBody);
      const isUserValid = checkIsUserValid(username, age, hobbies);

      if (!isUserValid) {
        handleBadRequestError(res);
        return;
      }

      const userIndex = usersAPI.findIndex(user => user.id === id);
      usersAPI[userIndex] = { ...usersAPI[userIndex], ...JSON.parse(requestBody) };
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(usersAPI[userIndex]));
    })
  } catch (error) {
    console.error("Something went wrong.", error);
    internalServerError(res);
  }
};

export const deleteUser = (req: IncomingMessage, res: ServerResponse): void => {
  try {
    const id = getUrlId(req);
    if (!id) {
      return;
    }

    const isUUIDValid = uuidValidate(id);

    if (isUUIDValid) {
      const user = usersAPI.find(user => user.id === id);
      const userIndex = usersAPI.findIndex(user => user.id === id);

      if (user) {
        usersAPI.splice(userIndex, 1);
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      } else {
        handleUserNotExistedError(res);
      }
    } else {
      handleUUIDError(res);
    }
  } catch (error) {
    console.error("Something went wrong.", error);
    internalServerError(res);
  }
};
