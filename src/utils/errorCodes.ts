export enum HttpStatusCode {
    // Successful Responses
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
  
    // Client Error Responses
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
  
    // Server Error Responses
    INTERNAL_SERVER_ERROR = 500
  }
  
  export class HttpError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR) {
      super(message);
      this.name = 'HttpError';
      this.statusCode = statusCode;
    }
  }
  
  export const ErrorMessages = {
    [HttpStatusCode.BAD_REQUEST]: 'Bad Request',
    [HttpStatusCode.UNAUTHORIZED]: 'Unauthorized',
    [HttpStatusCode.FORBIDDEN]: 'Forbidden',
    [HttpStatusCode.NOT_FOUND]: 'Resource Not Found',
    [HttpStatusCode.CONFLICT]: 'Conflict',
    [HttpStatusCode.INTERNAL_SERVER_ERROR]: 'Internal Server Error'
  };