import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import { toApiError } from "../axios/toApiError";

interface Errors {
  detail: string;
  attempts: number;
}

interface VerificationState {
    attempts?: number;
    message?: string;
    errors?: Errors;
}

const errorMessages = {
    "user_not_found": "Kein entsprechendes Konto gefunden",
    "no_active_verification": "Es gibt kein Verifizierungscode",
    "verification_code_expired": "Der Code ist abgelaufen",
    "no_verification_attempts": "Sie haben keine Versuche übrig",
    "invalid_verification_code": "Der Code ist nicht korrekt"
} as const;

type ErrorCodeKey = keyof typeof errorMessages;

export default function useEmailVerification () {

    const [attempts, setAttempts] = useState(3);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState<boolean>();

    const navigate = useNavigate();

    async function verifyEmail(code: string ,email: string | undefined) {
    
        try {

            setLoading(true);

            await axiosInstance.post('/user/users/verify-email/', {code, email});

            setError(""); 
            
            navigate('/verification-success', {state: {successMessage: "Ihr Konto wurde erfolgreich verifiziert"}});

        } catch (err: any) {

            const error = err as VerificationState;

            const errorCode = err.errors.detail;

            const attempts = error.errors?.attempts

            setAttempts((attempts === null ? 0 : attempts) || 0)
           

            if (errorCode && errorCode in errorMessages) {

                setError(errorMessages[errorCode as ErrorCodeKey]);

            } else {

                setError("Die Verifizierung ist fehlgeschlagen. Bitte versuchen Sie es erneut.");
            }

        } finally {
            setLoading(false);
        }
        
    }

    async function resendVerification(email: string | undefined){

        try {
            await axiosInstance.post("/user/users/resend-code/", {email});
            setAttempts(3);
            setError("");
        } catch (err: any){
            setError("Netzwerkfehler. Bitte versuchen Sie es später erneut."); 
        }

    }


    return {attempts, error, loading, verifyEmail, resendVerification};

}