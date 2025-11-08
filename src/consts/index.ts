export const PORT = process.env.PORT || 3000;
export const BASE_API_URL= process.env.BASE_API_URL || "/api/users";

export const CONTENT_TYPE_HEADER = { 'Content-Type': 'application/json' };

export const ERROR_MODELS = {
  NOT_FOUND: {
    code: 404,
    message: 'Not Found',
  },
  BAD_REQUEST: {
    code: 400,
    message: 'Body does not contain required fields',
  },
  UUID: {
    code: 400,
    message: 'User id is not correct',
  },
  USER_NOT_EXISTED: {
    code: 404,
    message: 'User is not existed',
  },
  INTERNAL_SERVER: {
    code: 500,
    message: 'Internal Server Error. Please try again later.',
  },
}

