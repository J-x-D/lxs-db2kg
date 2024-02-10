import axios from 'axios';
import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useStore } from 'store/store';

export interface PredicateForColumn {
    predicate: string;
    reference: string;
    child?: string;
}

export default function useFetchPredicatesForColumns() {

    const { setAlert, selectedTable, rmlRules } = useStore();
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/get_mapped_predicates";

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [predicatesForColumns, setPredicatesForColumns] = useState<PredicateForColumn[]>([]);

    async function fetchPredicatesForColumns() {
        if (!rmlRules[selectedTable]) {
            setPredicatesForColumns([]);
            return;
        };


        try {
            setLoading(true);
            const response = (await axios.post(url, rmlRules[selectedTable]));

            setPredicatesForColumns(response.data as PredicateForColumn[]);
            setLoading(false);
        } catch (error) {
            const err = error as AxiosError;
            setError(err.message);
            setLoading(false);
            setAlert({ type: "error", message: `Error while fetching predicates for the columns in table ${selectedTable}`, open: true })
        }
    }

    // fetch initial database schema so that the method doesn't have to be called manually
    useEffect(() => {
        fetchPredicatesForColumns();
        return () => { }
    }, [selectedTable, rmlRules])


    return { predicatesForColumns, loading, error, fetchPredicatesForColumns };
}