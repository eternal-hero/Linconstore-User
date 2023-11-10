import {useContext, useEffect} from "react";
import ContextApi from "../Store/context/ContextApi";
export  const useRefresh  = (refetch : () => {}) => {
    const isSeller = useContext(ContextApi).isSeller;
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isSeller) {
                refetch();
            }
        }, 100);
        return () => clearTimeout(timeout);
    }, [isSeller]);
}

export const useTokenRefetch = (refetch : () => {}) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            refetch()
        },300)

        return () => clearTimeout(timeout)
    },[])
}