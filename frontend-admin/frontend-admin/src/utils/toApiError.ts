import axios from 'axios';
import { ApiErrorResponse } from '../types/error';

const NETWORK_ERRORS = ['ECONNREFUSED', 'ERR_CONNECTION_REFUSED', 'ERR_NETWORK'];

function isAlreadyApiError(data: any): data is ApiErrorResponse {
  return (
    data &&
    typeof data === 'object' &&
    'code' in data &&
    ('status' in data || 'message' in data)
  );
}

function extractErrorData(data: any) {
  let serverMessage = data?.detail || data?.message;
  let customCode = data?.code;

  if (data?.errors && typeof data.errors === 'object') {
    const errors = data.errors as any;

    if (!serverMessage) {
      serverMessage = errors.detail || errors.message;
    }

    if (!customCode) {
      customCode = errors.code;
    }

    if (!serverMessage && Object.keys(errors).length > 0) {
      const firstKey = Object.keys(errors)[0];
      const firstError = errors[firstKey];
      if (Array.isArray(firstError) && typeof firstError[0] === 'string') {
        serverMessage = firstError[0];
      } else if (typeof firstError === 'string') {
        serverMessage = firstError;
      }
    }
  }

  return { serverMessage, customCode };
}

export function toApiError(error: unknown): ApiErrorResponse {
  if (isAlreadyApiError(error)) {
    return error;
  }

  if (axios.isCancel(error)) {
    return { status: null, code: 'canceled', message: 'Request Canceled' };
  }

  if (axios.isAxiosError(error)) {
    const response = error.response;
    if (response) {
      const { serverMessage, customCode } = extractErrorData(response.data);
      const status = response.status;

      if (serverMessage || customCode) {
        return {
          status: status,
          code: customCode || 'api_error',
          message: typeof serverMessage === 'string' && serverMessage.length > 0
            ? serverMessage
            : `Error ${status}: Ambiguous server response.`,
          errors: response.data.errors || undefined,
        };
      }
      
      return {
        status: status,
        code: 'server_error',
        message: `Server error (${status}).`,
      };
    }
    return { status: null, code: 'network_error', message: 'Network error.' };
  }


  if (typeof error === 'object' && error !== null) {
    const err = error as any;

  
    if ('status' in err) {
    
      const { serverMessage, customCode } = extractErrorData(err);
      
      return {
        status: err.status,
        code: customCode || err.code || 'api_error',
        
        message: serverMessage || err.message || `Error ${err.status}`,
        errors: err.errors || undefined,
      };
    }

  
    if ((err.isAxiosError && !err.response) || NETWORK_ERRORS.includes(err.code)) {
       return { status: null, code: 'network_error', message: 'Network connection failed.' };
    }
  }

  console.error('Unknown error caught:', error);
  return {
    status: null,
    code: 'unknown_error',
    message: error instanceof Error ? error.message : 'An unexpected error occurred.',
  };
}