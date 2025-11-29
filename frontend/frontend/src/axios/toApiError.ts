import axios, { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types/error';

function isAlreadyApiError(data: any): data is ApiErrorResponse {
  return (
    data &&
    typeof data === 'object' &&
    'code' in data &&
    ('status' in data || 'message' in data)
  );
}

export function toApiError(error: unknown): ApiErrorResponse {
  
  if (isAlreadyApiError(error)) {
    return error;
  }

  if (axios.isCancel(error)) {
    return {
      status: null,
      code: 'canceled',
      message: 'Request Canceled',
    };
  }

  if (axios.isAxiosError(error)) {
    const response = error.response;

    if (response) {
      const data = response.data as any;
      const status = response.status;

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

      if (serverMessage || customCode) {
        return {
          status: status,
          code: customCode || 'api_error',
          message: typeof serverMessage === 'string' && serverMessage.length > 0
            ? serverMessage
            : `Error ${status}: Ambiguous server response.`,
          errors: data.errors || undefined,
        };
      }

      return {
        status: status,
        code: 'server_error',
        message: `Server error (${status}). Please try again later.`,
      };
    }

    return {
      status: null,
      code: 'network_error',
      message: 'Network error. Could not connect to the server.',
    };
  }

  if (typeof error === 'object' && error !== null) {
    const err = error as any;

    if ('status' in err) {
      const candidates = [err.detail, err.message, err.error];
      const foundMessage = candidates.find(m => typeof m === 'string' && m.length > 0);

      return {
        status: err.status,
        code: err.code || 'api_error',
        message: foundMessage || `Error ${err.status} (Conflict/Error)`,
        errors: err.errors || undefined,
      };
    }

    const isNetworkMarker = 
        (err.isAxiosError === true && !err.response) || 
        err.message === 'NETWORK_ERROR' ||
        err.code === 'ECONNREFUSED';

    if (isNetworkMarker) {
      return {
        status: null,
        code: 'network_error',
        message: 'Network error. Could not connect to the server.',
      };
    }
  }

  console.error('Unknown error caught in toApiError:', error);
  
  return {
    status: null,
    code: 'unknown_error',
    message: error instanceof Error ? error.message : 'An unexpected error occurred.',
  };
}