import React, { useEffect, useState, useMemo } from "react";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

interface PaginatedData<T> {
    count: number;
    results: T[]; 
}

interface DashboardSectionProps<T extends {id: number}> {
    data: PaginatedData<T> | null;
    fetchData: (page: number) => Promise<void>;
    ItemComponent: React.FC<T>;
}

const DashboardSection = <T extends { id: number }> ({
    data, 
    fetchData, 
    ItemComponent,
} : DashboardSectionProps<T>) => {
    
    const pageCount = useMemo(() => {
        const totalOrders = data?.count ?? 0;
        return Math.ceil(totalOrders / 10); 
    }, [data?.count]);

    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchData(page); 
    }, [page]);

    const handleChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setPage(value);
        fetchData(value); 
    }

    return (

        <div className="dashboard-orders-container">
                            { data?.results.map((item) => 
                            
                            <ItemComponent key={item.id} {...item} />

                            )}

            <Stack spacing={2} sx={{marginTop: "2rem"}}>
                <Pagination count={pageCount} page={page} color="primary" onChange={handleChange}/>
            </Stack>
        </div>

    )

}

export default DashboardSection