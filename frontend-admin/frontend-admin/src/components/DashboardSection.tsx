import React, { useEffect, useState, useMemo } from "react";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import AppSkeleton from "./Skeleton";
import ErrorView from "./ErrorView";
import { IconType } from "react-icons/lib";
import { ApiErrorResponse } from "../types/error";
import { OrderFiltersParams } from "../types/order";
import { RequestFiltersParams } from "../types/request";
import { LuSearchX } from "react-icons/lu";
import { IoSearchOutline } from "react-icons/io5";


interface PaginatedData<T> {
    count: number;
    results: T[];
    new_count?: number;
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
    Filter,
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

    return (

        <section className="ds">

            <div className="ds__header">
                <div className="ds__title-row">
                    <div className="ds__title-group">
                        <div className="ds__icon">
                            <Icon />
                        </div>
                        <h2 className="ds__title">{title}</h2>
                        {data?.new_count ? (
                            <span className="ds__badge">{data.new_count}</span>
                        ) : null}
                    </div>
                    <div className="ds__actions">
                        <Filter/>
                    </div>
                </div>
                <div className="ds__search">
                    <IoSearchOutline className="ds__search-icon" />
                    <input
                        type="text"
                        className="ds__search-input"
                        placeholder="Suche..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            {error && <ErrorView/>}

            {loading && <AppSkeleton/>}

            <div className="ds__list">

                {data?.count === 0 &&

                    <div className="ds__empty">
                        <LuSearchX className="ds__empty-icon" />
                        <p className="ds__empty-text">Keine {title} gefunden.</p>
                    </div>

                }

                { data && data?.results.map((item) =>

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