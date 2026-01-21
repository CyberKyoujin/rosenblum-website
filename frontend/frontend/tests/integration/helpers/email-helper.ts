import axios from "axios"

interface verificationProps {
    userEmail: string;
}

export default async function getVerficationCode({userEmail} : verificationProps) {
    try {

        const response = await axios.get("http://localhost:8000/api/test-helpers/user-verification-code/", {params: {"user_email": userEmail}});
        // Ensure code is returned as string
        return String(response.data.code);

    } catch (error) {

        if (axios.isAxiosError(error) && error.response) {
            
            const serverMessage = error.response.data.detail;
            const statusCode = error.response.status;

            console.error(`Error ${statusCode}: ${serverMessage}`);
            
            throw new Error(serverMessage || "Unknown server error");
        }
        
        throw new Error("Network error or server is down");
    }
}



