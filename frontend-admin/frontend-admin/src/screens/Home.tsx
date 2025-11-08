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

const Home = () => {

    
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const { loginUser } = useAuthStore.getState();

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

            <div className="home-title-container">
                <h1>Melden Sie sich an</h1>
            </div>

            <form className="main-form-container" onSubmit={handleSubmit}>

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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Password"
                    />
                </FormControl>
                <button type="submit" className="btn">WEITER</button>
            </form>

        </div>
    )
}


export default Home;