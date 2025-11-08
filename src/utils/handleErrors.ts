import { ServerResponse } from 'http';

export const handleNotFoundError = (res: ServerResponse) => {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Not Found' }));
}

export const handleBadRequestError = (res: ServerResponse) => {
  res.writeHead(400, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Body does not contain required fields' }));
}

export const handleUUIDError = (res: ServerResponse) => {
  res.writeHead(400, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'User id is not correct' }));
}

export const handleUserNotExistedError = (res: ServerResponse) => {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'User is not existed' }));
}

export const internalServerError = (res: ServerResponse) => {
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Internal Server Error. Please try again later.' }))
}
