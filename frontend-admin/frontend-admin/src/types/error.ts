
export interface ApiErrorResponse{
    status: number | null;
    code: string;
    message: string;
    errors? : Record<string, string[]>;
}