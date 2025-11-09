import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { IncomingMessage, ServerResponse } from "http";
import {
  handleBadRequestError,
  internalServerError,
  handleUUIDError,
  handleUserNotExistedError
} from "../utils/handleErrors";
import { CONTENT_TYPE_HEADER, STATUS_MODELS, SWW_ERROR_MESSAGE } from "../consts";
import { usersAPI } from "../db/users";
import { checkIsUserValid } from "../utils/validate";
import { CreateUserDto } from "../types/user.dto";

const getUrlId = (req: IncomingMessage): string|undefined => {
  if (!req.url) return;
  const urlArr = req.url.split('/');

  return urlArr[urlArr.length - 1];
}

export const getAllUsers = (_: IncomingMessage, res: ServerResponse): void => {
  try {
    res.writeHead(STATUS_MODELS.SUCCEEDED_REQUEST.code, CONTENT_TYPE_HEADER);
    res.end(JSON.stringify(usersAPI));
  } catch (error) {
    console.error(SWW_ERROR_MESSAGE, error);
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
      res.writeHead(STATUS_MODELS.SUCCEEDED_REQUEST.code, CONTENT_TYPE_HEADER);
      res.end(JSON.stringify(userData));
    })
  } catch (error) {
    console.error(SWW_ERROR_MESSAGE, error);
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

    res.writeHead(STATUS_MODELS.SUCCEEDED_REQUEST.code, CONTENT_TYPE_HEADER);
    res.end(JSON.stringify(user));
  } catch (error) {
    console.error(SWW_ERROR_MESSAGE, error);
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
      const { username, age, hobbies }: CreateUserDto = JSON.parse(requestBody);
      const isUserValid = checkIsUserValid({username, age, hobbies});

      if (!isUserValid) {
        handleBadRequestError(res);
        return;
      }

      const userIndex = usersAPI.findIndex(user => user.id === id);
      usersAPI[userIndex] = { ...usersAPI[userIndex], ...JSON.parse(requestBody) };
      res.writeHead(STATUS_MODELS.CREATED_REQUEST.code, CONTENT_TYPE_HEADER);
      res.end(JSON.stringify(usersAPI[userIndex]));
    })
  } catch (error) {
    console.error(SWW_ERROR_MESSAGE, error);
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
        res.writeHead(STATUS_MODELS.DELETED_REQUEST.code, CONTENT_TYPE_HEADER);
        res.end(JSON.stringify(user));
      } else {
        handleUserNotExistedError(res);
      }
    } else {
      handleUUIDError(res);
    }
  } catch (error) {
    console.error(SWW_ERROR_MESSAGE, error);
    internalServerError(res);
  }
};