import { CircularProgress } from "@mui/material"
import Divider from "@mui/material/Divider"
import { FaQuestionCircle } from "react-icons/fa"

const RequestDetailsSkeleton = () => {
    return (

        <main className="main-container">

            <article className="request-details-container">

                <header className="request-details-title">
                
                    <div className="request-details-item-title-container">
                
                        <FaQuestionCircle className="order-details-icon" size={40}/>
                                                    
                        <h1>Anfrageübersicht</h1>
                                                
                    </div>
                                                
                </header>
                
                <Divider orientation="horizontal"/>

            
                <div className="loader-container">
                    <CircularProgress size={70} className="app-icon"/>    
                </div>
                
            </article>

        </main>

    )
}


export default RequestDetailsSkeleton