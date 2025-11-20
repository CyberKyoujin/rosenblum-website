import axios, { AxiosError } from "axios";
import { ApiError } from "../types/auth";

export function toApiError(error: unknown): ApiError | null {

  if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
    return null;
  }

  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError;

    return {
      status: axiosErr.response?.status ?? null,
      message:
        (axiosErr.response?.data as any)?.message ||
        axiosErr.message ||
        "UNKNOWN_ERROR",
      errors: (axiosErr.response?.data as any)?.errors || null,
    };
  }

  return {
    status: null,
    message: (error as any)?.message || "UNKNOWN_ERROR",
    errors: null,
  };
}