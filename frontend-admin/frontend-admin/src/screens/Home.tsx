import React from "react";
import { useState } from 'react';
import useAuthStore from "../zustand/useAuthStore";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";
import { CircularProgress } from "@mui/material";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Home = () => {

    const error = useAuthStore(s => s.loginError);
    const loginUser = useAuthStore(s => s.loginUser);
    const loading = useAuthStore(s => s.loading);

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const isAtTop = useIsAtTop(5);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        await loginUser(formData);
    }

    return (
        <div className="login">

            <ApiErrorAlert error={error} belowNavbar={isAtTop} fixed/>

            <div className="login__card">

                <div className="login__header">
                    <div className="login__icon-circle">
                        <FaLock />
                    </div>
                    <h1 className="login__title">Willkommen zurück</h1>
                    <p className="login__subtitle">Melden Sie sich in Ihrem Admin-Konto an</p>
                </div>

                <form className="login__form" onSubmit={handleSubmit}>

                    <div className="login__field">
                        <label className="login__label" htmlFor="login-email">E-Mail-Adresse</label>
                        <div className="login__input-wrapper">
                            <FaEnvelope className="login__input-icon" />
                            <input
                                id="login-email"
                                className="login__input"
                                type="email"
                                placeholder="admin@beispiel.de"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="login__field">
                        <label className="login__label" htmlFor="login-password">Passwort</label>
                        <div className="login__input-wrapper">
                            <FaLock className="login__input-icon" />
                            <input
                                id="login-password"
                                className="login__input"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Passwort eingeben"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="login__toggle-pw"
                                onClick={() => setShowPassword(prev => !prev)}
                                tabIndex={-1}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login__submit" disabled={loading}>
                        {loading ? <CircularProgress size={22} sx={{color: "white"}}/> : "Anmelden"}
                    </button>

                </form>
            </div>
        </div>
    )
}


export default Home;