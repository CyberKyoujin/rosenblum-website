import React from "react";
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useAuthStore from "../zustand/useAuthStore";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";
import { CircularProgress } from "@mui/material";

const Home = () => {

    const error = useAuthStore(s => s.loginError);
    const loginUser = useAuthStore(s => s.loginUser);
    const loading = useAuthStore(s => s.loading);
    
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const isAtTop = useIsAtTop(5);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        await loginUser(formData);
    }

    return (
        <div className="main-container" style={{padding: '0rem 2rem'}}>

            <ApiErrorAlert error={error} belowNavbar={isAtTop} fixed/>

            <form className="main-form-container" onSubmit={handleSubmit}>
                
                <div className="home-title-container">
                    <h1>Melden Sie sich an</h1>
                </div>

                <TextField fullWidth required 
                id="outlined-basic1" 
                label="Email" 
                variant="outlined" 
                value={email} 
                onChange={(e) => {setEmail(e.target.value)}}/>

                <FormControl fullWidth variant="outlined" required>

                    <InputLabel htmlFor="outlined-adornment-password">Passwort</InputLabel>

                    <OutlinedInput
                    id="outlined-adornment-password"
                    value={password}
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => {
                        const newPassword = e.target.value;
                        setPassword(newPassword); 
                    }}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Password"
                    />
                    
                </FormControl>

                <button type="submit" className="btn">
                    {loading ? <CircularProgress sx={{color: "white"}}/> : "WEITER"}
                </button>
                
            </form>

        </div>
    )
}


export default Home;