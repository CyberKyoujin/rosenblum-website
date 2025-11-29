import React, {useEffect} from "react";
import useAuthStore from "../zustand/useAuthStore";


const GOOGLE_CLIENT_ID = "675268927786-p5hg3lrdsm61rki2h6dohkcs4r0k5p40.apps.googleusercontent.com";


const GoogleLoginBtn = () => {

    const googleLogin = useAuthStore(s => s.googleLogin);

    useEffect(() => {
        
        const handleCredentialResponse = (response: any) => {
            console.log("Google response", response.credential);
            googleLogin(response.credential);
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
                    { theme: "outline", size: "large", type: "standard", shape: "rectangular",width: "100%", logo_alignment: "left" }
                );
            }
        };

        const timer = setTimeout(initGoogleBtn, 100);
        return () => clearTimeout(timer);

    }, [googleLogin]);

    return <div id="google-signin-btn" className="custom-google-sign-in-button"></div>;

}

export default GoogleLoginBtn;