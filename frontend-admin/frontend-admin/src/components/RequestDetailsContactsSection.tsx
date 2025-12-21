import { RiContactsFill } from "react-icons/ri";
import { MdCircle } from "react-icons/md";
import { RequestData } from '../types/request';

interface RequestDetailsContactsSectionProps {
    request: RequestData | null;
}

const RequestDetailsContactsSection = ({request}: RequestDetailsContactsSectionProps) => {

    return (

        <div className="request-details-content-container">

                        <section className="request-details-contact-info">

                            <div className="request-details-item-title-container">

                                <RiContactsFill size={25} className="app-icon"/>

                                <h2>Kontaktdaten</h2>

                            </div>

                            <dl className="request-details-contact-items-grid">
                            
                                <div className="dl-item">
                                    <dt><MdCircle className="app-icon" aria-hidden="true"/> Name:</dt>
                                    <dd>{request?.name}</dd>
                                </div>

                                <div className="dl-item">
                                    <dt><MdCircle className="app-icon" aria-hidden="true"/> Email:</dt>
                                    <dd>{request?.email}</dd>
                                </div>

                                <div className="dl-item">
                                    <dt><MdCircle className="app-icon" aria-hidden="true"/> Tel:</dt>
                                    <dd>{request?.phone_number}</dd>
                                </div>

                            </dl>

                        </section>


        </div>

    );
}

export default RequestDetailsContactsSection;
