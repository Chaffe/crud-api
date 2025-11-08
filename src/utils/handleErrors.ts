import { ServerResponse } from 'http';
import {CONTENT_TYPE_HEADER, ERROR_MODELS} from "../consts";

export const handleNotFoundError = (res: ServerResponse) => {
  res.writeHead(ERROR_MODELS.NOT_FOUND.code, CONTENT_TYPE_HEADER);
  res.end(JSON.stringify({ message: ERROR_MODELS.NOT_FOUND.message }));
}

export const handleBadRequestError = (res: ServerResponse) => {
  res.writeHead(ERROR_MODELS.BAD_REQUEST.code, CONTENT_TYPE_HEADER);
  res.end(JSON.stringify({ message: ERROR_MODELS.BAD_REQUEST.message }));
}

export const handleUUIDError = (res: ServerResponse) => {
  res.writeHead(ERROR_MODELS.UUID.code, CONTENT_TYPE_HEADER);
  res.end(JSON.stringify({ message: ERROR_MODELS.UUID.message }));
}

export const handleUserNotExistedError = (res: ServerResponse) => {
  res.writeHead(ERROR_MODELS.USER_NOT_EXISTED.code, CONTENT_TYPE_HEADER);
  res.end(JSON.stringify({ message: ERROR_MODELS.USER_NOT_EXISTED.message }));
}

export const internalServerError = (res: ServerResponse) => {
  res.writeHead(ERROR_MODELS.INTERNAL_SERVER.code, CONTENT_TYPE_HEADER);
  res.end(JSON.stringify({ message: ERROR_MODELS.INTERNAL_SERVER.message }));
}
