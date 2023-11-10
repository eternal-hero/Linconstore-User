import { useState } from "react";
import { useRouter } from "next/router";
import { useIdleTimer } from "react-idle-timer";
import Cookies from "js-cookie";

export const useAutoLogout = () => {
  const [lastActivityTime, setLastActivityTime] = useState(null);
  const router = useRouter();
  useIdleTimer({
    timeout: 14400000, // 4 hours in milliseconds
    onIdle: () => {
      setLastActivityTime(null);
      localStorage.clear();
      const allCookieNames = Object.keys(Cookies.get());

      // Loop through the array and remove each cookie
      allCookieNames.forEach((cookieName) => {
        Cookies.remove(cookieName);
      });
      router.push("/login");
    },
  });
};
