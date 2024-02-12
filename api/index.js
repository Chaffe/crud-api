import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { usersAPI } from "../db/users.js";
import { checkIsUserValid } from "../utils/validate.js";
import {handleBadRequestError, handleUserNotExistedError, handleUUIDError} from "../utils/handleErrors.js";

const SPLIT_URL_LAST_INDEX = -1;

const getUrlId = (req) => req.url.split('/').at(SPLIT_URL_LAST_INDEX);

export const getAllUsers = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(usersAPI));
}

export const createUser = (req, res) => {
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
}

export const getUserById = (req, res) => {
  const id = getUrlId(req);
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
}

export const updateUser = (req, res) => {
  const id = getUrlId(req);
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

    // if (isUserValid) {
    //   const userIndex = usersAPI.findIndex(user => user.id === id);
    //   usersAPI[userIndex] = { ...usersAPI[userIndex], ...JSON.parse(requestBody) };
    //   res.writeHead(201, { 'Content-Type': 'application/json' });
    //   res.end(JSON.stringify(usersAPI[userIndex]));
    // } else {
    //   handleBadRequestError(res);
    // }
  })

  // if (isUUIDValid) {
  //   const user = usersAPI.find(user => user.id === id);
  //
  //   if (user) {
  //     let requestBody = '';
  //
  //     req.on('data', (chunk) => {
  //       requestBody = chunk.toString();
  //     });
  //
  //     req.on('end', () => {
  //       const { username, age, hobbies } = JSON.parse(requestBody);
  //       const isUserValid = checkIsUserValid(username, age, hobbies);
  //
  //       if (isUserValid) {
  //         const userIndex = usersAPI.findIndex(user => user.id === id);
  //         usersAPI[userIndex] = { ...usersAPI[userIndex], ...JSON.parse(requestBody) };
  //         res.writeHead(201, { 'Content-Type': 'application/json' });
  //         res.end(JSON.stringify(usersAPI[userIndex]));
  //       } else {
  //         handleBadRequestError(res);
  //       }
  //     })
  //   } else {
  //     handleUserNotExistedError(res);
  //   }
  // } else {
  //   handleUUIDError(res);
  // }
}

export const deleteUser = (req, res) => {
  const id = getUrlId(req);
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
}
