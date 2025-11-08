import { IncomingMessage } from 'http';
import { CreateUserDto } from "../types/user.dto";
import { BASE_API_URL } from "../consts";

export const checkIsUrlValid = (req: IncomingMessage): boolean => {
  if (!req.url) {
    return false;
  }

  const splitPath = req.url.split('/');

  return !(!req.url.startsWith(BASE_API_URL) || splitPath.length > 4);
};

export const checkIsUserValid = (args: CreateUserDto) => {
  const { username, age, hobbies } = args;

  return (
    !!username &&
    typeof username === 'string' &&
    !!age &&
    typeof age === 'number' &&
    !!hobbies &&
    Array.isArray(hobbies)
  );
};
