import { Card } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

const AppSkeleton = () => {

    const iterations = Array.from({ length: 8 }, (_, index) => index + 1)

    return (
        
        <div className='dashboard-skeleton-container'>
        
            {iterations.map((num) => (
                <Card key={num} className='dashboard-skeleton-item'>

                    <Skeleton variant='circular' className='dashboard-avatar-skeleton' 
                        height={80} 
                        width={80}
                        animation="wave"
                    />

                    <div className='dashboard-skeleton-item-info'>

                        <Skeleton animation="wave" height={40}/>
                        <Skeleton animation="wave" height={40}/>

                    </div>

                </Card>
            ))}
        
        </div>

        
    )
}

export default AppSkeleton