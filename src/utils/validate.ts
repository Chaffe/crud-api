import { IncomingMessage } from 'http';

type TCheckIsUserValid = (username: string, age: number, hobbies: string[]) => boolean;

const BASE_PATH = '/api/users'

export const checkIsUrlValid = (req: IncomingMessage): boolean => {
  if (!req.url) {
    return false;
  }

  const splitPath = req.url.split('/');

  return !(!req.url.startsWith(BASE_PATH) || splitPath.length > 4);
};

export const checkIsUserValid: TCheckIsUserValid = (username, age, hobbies) => {
  return (
    !!username &&
    typeof username === 'string' &&
    !!age &&
    typeof age === 'number' &&
    !!hobbies &&
    Array.isArray(hobbies)
  );
};
