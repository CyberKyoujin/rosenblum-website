
const ProfileSkeleton = () => {

    return (
        <main className="main-app-container">

        <section className="profile__main-section">

            <div className="profile-cards">
                <div className="profile-card skeleton" style={{ minHeight: '220px' }}/>
                <div className="profile-card skeleton" style={{ minHeight: '280px' }}/>
            </div>

            <section className="orders-section-wrapper skeleton" style={{ minHeight: '120px' }}/>

        </section>

        </main>
    )
}

export default ProfileSkeleton