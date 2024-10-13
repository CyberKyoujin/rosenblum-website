import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";


const SearchResults = () => {
    const [query, setQuery] = useState<string>("");
    const location = useLocation();

    useEffect(() => {
        const searchQuery = location.state?.message;
        if (searchQuery) {
            setQuery(searchQuery);
            console.log(searchQuery);  
        }
    }, [location]);

    return (
        <div>
            <h2>Search Results for: {query}</h2>
        </div>
    );
};


export default SearchResults