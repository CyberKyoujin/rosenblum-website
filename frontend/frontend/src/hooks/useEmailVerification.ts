import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../zustand/axiosInstance";
import axios from "axios";

interface VerificationState {
    attempts?: number;
    message?: string;
    detail?: string;
}


export default function useEmailVerification () {

    const [attempts, setAttempts] = useState(3);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function verifyEmail(code: string ,email: string | undefined) {
    
        try {

            const response = await axiosInstance.post('/user/email-verification/', {code, email});

            setError(""); 
            
            navigate('/verification-success', {state: {email}});

        } catch (err: any) {

            console.log("Verification error:" , err);

            if (axios.isAxiosError(err) && err.response) {

                const data = err.response.data as VerificationState;

                if (typeof data.attempts === "number") {
                    setAttempts(data.attempts);
                }

                setError(data.message || data.detail || "Die Verifizierung ist fehlgeschlagen. Bitte versuchen Sie es erneut.");


            } else {
                setError("Netzwerkfehler. Bitte versuchen Sie es später erneut."); 
            }

        }
        
    }

    async function resendVerification(email: string | undefined){

        try {
            const response = await axiosInstance.post("/user/resend-verification/", {email});
            setAttempts(3);
            setError("");
        } catch (err: any){
            setError("Netzwerkfehler. Bitte versuchen Sie es später erneut."); 
        }

    }


    return {attempts, error, verifyEmail, resendVerification};

}