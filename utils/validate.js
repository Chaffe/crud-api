const BASE_PATH = '/api/users'

export const checkIsUrlValid = (req) => {
  const splitPath = req.url.split('/');

  return !(!req.url.startsWith(BASE_PATH) || splitPath.length > 4);
};

export const checkIsUserValid = (username, age, hobbies) => {
  return (
    !!username &&
    typeof username === 'string' &&
    !!age &&
    typeof age === 'number' &&
    !!hobbies &&
    Array.isArray(hobbies)
  );
};
