import { CircularProgress } from '@mui/material';

const AppLoader = () => {
    return (
        <div className='main-container'>

            <div className='app-loader-container'>
                <CircularProgress size={60}/>
                <h3>Wird geladen...</h3>
            </div>
            
        </div>
    );
}

export default AppLoader;
