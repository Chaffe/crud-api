import { ServerResponse } from 'http';
import { CONTENT_TYPE_HEADER, STATUS_MODELS } from "../consts";

export const handleNotFoundError = (res: ServerResponse) => {
  res.writeHead(STATUS_MODELS.NOT_FOUND.code, CONTENT_TYPE_HEADER);
  res.end(JSON.stringify({ message: STATUS_MODELS.NOT_FOUND.message }));
}

export const handleBadRequestError = (res: ServerResponse) => {
  res.writeHead(STATUS_MODELS.BAD_REQUEST.code, CONTENT_TYPE_HEADER);
  res.end(JSON.stringify({ message: STATUS_MODELS.BAD_REQUEST.message }));
}

export const handleUUIDError = (res: ServerResponse) => {
  res.writeHead(STATUS_MODELS.UUID.code, CONTENT_TYPE_HEADER);
  res.end(JSON.stringify({ message: STATUS_MODELS.UUID.message }));
}

export const handleUserNotExistedError = (res: ServerResponse) => {
  res.writeHead(STATUS_MODELS.USER_NOT_EXISTED.code, CONTENT_TYPE_HEADER);
  res.end(JSON.stringify({ message: STATUS_MODELS.USER_NOT_EXISTED.message }));
}

export const internalServerError = (res: ServerResponse) => {
  res.writeHead(STATUS_MODELS.INTERNAL_SERVER.code, CONTENT_TYPE_HEADER);
  res.end(JSON.stringify({ message: STATUS_MODELS.INTERNAL_SERVER.message }));
}
