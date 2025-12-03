import {useEffect} from "react";
import useAuthStore from "../zustand/useAuthStore";
import { useNavigate } from "react-router-dom";


const GOOGLE_CLIENT_ID = "675268927786-p5hg3lrdsm61rki2h6dohkcs4r0k5p40.apps.googleusercontent.com";


const GoogleLoginBtn = () => {

    const googleLogin = useAuthStore(s => s.googleLogin);

    const navigate = useNavigate();

    useEffect(() => {
        
        const handleCredentialResponse = async (response: any) => {
            console.log("Google response", response.credential);

            try {
                await googleLogin(response.credential);
                navigate('/profile');
            } catch (err: unknown) {
                console.error("Google login failed", err);
            }
            
        };

        const initGoogleBtn = () => {
            const btnElement = document.getElementById("google-signin-btn");
            
            if (window.google && btnElement) {

                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse,
                });

                window.google.accounts.id.renderButton(
                    btnElement,
                    { theme: "outline", size: "large"}
                );
            }
        };

        const timer = setTimeout(initGoogleBtn, 100);
        return () => clearTimeout(timer);

    }, [googleLogin, navigate]);

    return <div id="google-signin-btn" className="custom-google-sign-in-button"></div>;

}

export default GoogleLoginBtn;