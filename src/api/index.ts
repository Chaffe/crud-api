import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { IncomingMessage, ServerResponse } from "http";
import {
  handleBadRequestError,
  internalServerError,
  handleUUIDError,
  handleUserNotExistedError
} from "../utils/handleErrors";
import { CONTENT_TYPE_HEADER, STATUS_MODELS, SWW_ERROR_MESSAGE } from "../consts";
import { getUsers, setUsers } from "../db";
import { checkIsUserValid } from "../utils/validate";
import { CreateUserDto } from "../types/user.dto";

const getUrlId = (req: IncomingMessage): string|undefined => {
  if (!req.url) return;
  const urlArr = req.url.split('/');

  return urlArr[urlArr.length - 1];
}

export const getAllUsers = async (_: IncomingMessage, res: ServerResponse): Promise<void> => {
  const users = await getUsers();

  try {
    res.writeHead(STATUS_MODELS.SUCCEEDED_REQUEST.code, CONTENT_TYPE_HEADER);
    res.end(JSON.stringify(users));
  } catch (error) {
    console.error(SWW_ERROR_MESSAGE, error);
    internalServerError(res);
  }
};

export const createUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  let requestBody = '';

  try {
    req.on('data', (chunk) => {
      requestBody = chunk.toString();
    });

    req.on('end', async () => {
      const { username, age, hobbies }: CreateUserDto = JSON.parse(requestBody);
      const isUserValid = checkIsUserValid({ username, age, hobbies });

      if (!isUserValid) {
        handleBadRequestError(res);
        return;
      }

      const users = await getUsers();

      const userData = {
        id: uuidv4(),
        username,
        age,
        hobbies,
      };

      users.push(userData);
      await setUsers(users);
      res.writeHead(STATUS_MODELS.CREATED_REQUEST.code, CONTENT_TYPE_HEADER);
      res.end(JSON.stringify(userData));
    })
  } catch (error) {
    console.error(SWW_ERROR_MESSAGE, error);
    internalServerError(res);
  }
};

export const getUserById = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
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

    const users = await getUsers();
    const user = users.find(user => user.id === id);
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

export const updateUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
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

    const users = await getUsers();
    const user = users.find(user => user.id === id);

    if (!user) {
      handleUserNotExistedError(res);
      return;
    }

    let requestBody = '';

    req.on('data', (chunk) => {
      requestBody = chunk.toString();
    });

    req.on('end', async () => {
      const { username, age, hobbies }: CreateUserDto = JSON.parse(requestBody);
      const isUserValid = checkIsUserValid({username, age, hobbies});

      if (!isUserValid) {
        handleBadRequestError(res);
        return;
      }

      const userIndex = users.findIndex(user => user.id === id);
      users[userIndex] = { ...users[userIndex], ...JSON.parse(requestBody) };
      await setUsers(users);
      res.writeHead(STATUS_MODELS.SUCCEEDED_REQUEST.code, CONTENT_TYPE_HEADER);
      res.end(JSON.stringify(users[userIndex]));
    })
  } catch (error) {
    console.error(SWW_ERROR_MESSAGE, error);
    internalServerError(res);
  }
};

export const deleteUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  try {
    const id = getUrlId(req);
    if (!id) {
      return;
    }

    const isUUIDValid = uuidValidate(id);

    if (isUUIDValid) {
      const users = await getUsers();
      const user = users.find(user => user.id === id);
      const userIndex = users.findIndex(user => user.id === id);

      if (user) {
        users.splice(userIndex, 1);
        await setUsers(users);
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