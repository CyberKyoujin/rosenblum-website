import React, { useEffect, useState, useMemo } from "react";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import AppSkeleton from "./Skeleton";
import ErrorView from "./ErrorView";
import Divider from '@mui/material/Divider';
import { IconType } from "react-icons/lib";
import TextField from '@mui/material/TextField';
import { ApiErrorResponse } from "../types/error";
import { OrderFiltersParams } from "../types/order";
import { RequestFiltersParams } from "../types/request";
import { LuSearchX } from "react-icons/lu";


interface PaginatedData<T> {
    count: number;
    results: T[]; 
}

interface DashboardSectionProps<T extends {id: number}> {
    data: PaginatedData<T> | null;
    title: string;
    Icon: IconType;
    fetchData: (page: number) => Promise<void>;
    ItemComponent: React.FC<T>;
    loading: boolean;
    error: ApiErrorResponse | null;
    setFilters: (newFilters: OrderFiltersParams | RequestFiltersParams) => void;
    Filter: React.ComponentType;
}

const DashboardSection = <T extends { id: number }> ({
    data, 
    fetchData, 
    ItemComponent,
    title,
    Icon,
    loading,
    error,
    setFilters,
    Filter
} : DashboardSectionProps<T>) => {

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    
    const pageCount = useMemo(() => {
        const totalCount = data?.count ?? 0;
        return Math.ceil(totalCount / 8); 
    }, [data?.count]);

    const handleChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setPage(value);
        fetchData(value); 
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSearch(e.target.value);
    }

    useEffect(() => {

        const delayDebounce = setTimeout(() => {
            setFilters({search: search});

            if (search) setPage(1); 
            
        }, 1000)

        return () => clearTimeout(delayDebounce);

    }, [search, setFilters, fetchData]);

    useEffect(() => {
        fetchData(page);
    }, [page, fetchData])

    return (

        <section className="dashboard__orders-container">


            <div className="dashboard-title-orders">

                    <div className="dashboard-title-info">
                        <Icon style={{fontSize: '40px', color: 'RGB(76 121 212)'}}/>
                        <h1 style={{marginTop: '0.1rem'}}> {title} </h1>
                    </div>

                    <div className="dashboard-title-search">
                        
                        <Filter/>

                        <TextField onChange={handleSearchChange} value={search} id="outlined-basic" label="Suche" variant="outlined" />
                        
                    </div>
                    
            </div>

            <Divider style={{marginTop: '1.5rem'}}/> 

            {error && <ErrorView/>}

            {loading && <AppSkeleton/>}

            <div className="dashboard-orders-container"> 

                {data?.count === 0 && 

                    <div className="error-view-container">
                        <LuSearchX className="app-icon" size={120}/>
                        <h2>Keine {title} gefunden.</h2>
                    </div>
                
                }

                { data?.results.map((item) => 
                                
                    <ItemComponent key={item.id} {...item} />

                )}

                { data && data?.count > 0 &&

                <Stack spacing={2} sx={{marginTop: "2rem"}}>
                    <Pagination count={pageCount} page={page} color="primary" onChange={handleChange}/>
                </Stack>

                }

            </div>  

        </section>

    )

}

export default DashboardSection