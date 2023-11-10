import { useEffect } from "react";
import { useRouter } from "next/router";

export const useScrollPos = (key: string) => {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = () => {
            localStorage.setItem(key, window.scrollY.toString());
        };

        router.events.on("routeChangeStart", handleRouteChange);

        const storedScrollPosition = localStorage.getItem(key);
        const timeout = setTimeout(() => {
            if (storedScrollPosition) {
                window.scrollTo(0, parseInt(storedScrollPosition));
            }
        }, 500);

        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
            clearTimeout(timeout);
        };
    }, [key, router.events]);
};
