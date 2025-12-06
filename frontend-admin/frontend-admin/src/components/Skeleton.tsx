import Skeleton from '@mui/material/Skeleton';

const AppSkeleton = () => {
    return (
        <Skeleton
            sx={{ bgcolor: 'grey.300', width: '100%', height: "100%", marginTop: '2rem', borderRadius: '10px' }}
            variant="rectangular"
            animation="wave"
        />
    )
}

export default AppSkeleton