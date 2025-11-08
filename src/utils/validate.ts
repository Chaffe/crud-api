import { IncomingMessage } from 'http';

const BASE_PATH = '/api/users'

export const checkIsUrlValid = (req: IncomingMessage): boolean => {
  if (!req.url) {
    return false;
  }

  const splitPath = req.url.split('/');

  return !(!req.url.startsWith(BASE_PATH) || splitPath.length > 4);
};
