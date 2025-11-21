import axios, { AxiosError } from "axios";
import { ApiErrorResponse } from "../types/error";


function isBackendError(data: unknown): data is {message: string; code?: string; errors?:any} {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as any).message === "string"
  )
}



export function toApiError(error: unknown): ApiErrorResponse {

  if (axios.isAxiosError(error)) {
    return {
      status: null,
      code: 'canceled',
      message: 'Request Canceled'
    };
  }

  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError;
    const status = axiosErr.response?.status ?? null;
    const data = axiosErr.response?.data;

    if (status && isBackendError(data)){
      return {
        status: status,
        code: data.code || 'api_error',
        message: data.message,
        errors: data.errors || undefined,
      }
    }

    if (!axiosErr.response){
      return{
        status: null,
        code: 'network_error',
        message: 'Network error. Please check your connection.'

      }
    }

    return {
        status: status,
        code: 'server_error',
        message: `Server error (${status}). Please try again later.`,
    };


  }

  console.error("Non-Axios error caught:", error);
  return {
      status: null,
      code: 'unknown_error',
      message: 'An unexpected error occurred.',
  };
  
}