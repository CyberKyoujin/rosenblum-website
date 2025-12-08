import { Typography } from '@mui/material';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';


const CustomerProfileSkeleton = () => {
    return (
        <section className="profile__main-section">
            <section className="profile__user-data-section">

                <Card className='customer-profile__avatar-skeleton-container'>
                    <Skeleton animation="wave" variant='circular' width={120} height={120}/>
                    <div className='customer-profile__avatar-data-skeleton-container'>
                        <Typography variant='h1' width={120}><Skeleton animation="wave"/></Typography>
                        <Typography variant='h1' width={120}><Skeleton animation="wave"/></Typography>
                    </div>
                </Card>

                <Card className='customer-profile__data-skeleton-container'>
                    <Skeleton animation="wave" sx={{width: "50%"}} height={40}/>
                    <Skeleton animation="wave" height={40}/>
                    <Skeleton animation="wave" height={40}/>
                    <Skeleton animation="wave" height={40}/>
                </Card>

            </section>

             <h1 className="profile__orders-title">Aufträge</h1>

             <section className='profile__user-orders-section'>
                <Card className="customer-profile__orders-skeleton-container">
                    <Skeleton animation="wave" height={40}/>
                    <Skeleton animation="wave" height={40}/>
                    <Skeleton animation="wave" height={40}/>
                    <Skeleton animation="wave" height={40}/>
                </Card>
             </section>

        </section>
    )
}


export default CustomerProfileSkeleton