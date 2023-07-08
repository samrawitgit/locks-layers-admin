import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";

// import { userService } from 'services';
import { AppContext } from "@utils/containers/app.container";

export function RouteGuard({ children }) {
  const router = useRouter();
  const { user, isLoggedIn, setUser, setIsLoggedIn } = useContext(AppContext);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ["/login"];
    const path = url.split("?")[0];
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    console.log({ path });
    if (!token && !userId && !publicPaths.includes(path)) {
      console.log("not logged in");
      setUser(userId);
      setIsLoggedIn(false);
      setAuthorized(false);
      router.push({
        pathname: "/login",
        query: { returnUrl: router.asPath },
      });
    } else {
      console.log("logged in");
      setAuthorized(true);
    }
  }

  return authorized && children;
}
