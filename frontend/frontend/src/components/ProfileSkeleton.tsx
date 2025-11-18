import React from "react";


const ProfileSkeleton = () => {
    return (
        <main className="main-app-container">
        <section className="profile__main-section">

            <div className="profile__user-data-section">

                <div className="profile__user-data-container profile-section-container skeleton">
                    
                </div>
                
                <div className="profile__img-container profile-section-container skeleton">
                    
                </div>
                

            </div>

            <h1 className="profile__orders-title">Aufträge</h1>

              <section className="profile__user-orders-section profile-section-container skeleton">
                </section>


        </section>
        </main>
    )
}

export default ProfileSkeleton