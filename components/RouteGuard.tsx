import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

// import { userService } from 'services';
import { AppContext } from "@utils/containers/app.container";

const PUBLIC_PATHS = ["/login"];

export function RouteGuard({ children }) {
  const router = useRouter();
  const { isLoggedIn } = useContext(AppContext);
  const [authorized, setAuthorized] = useState(false);

  // const [isLoading, setIsLoading] = useState(true);

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    const path = url.split("?")[0];

    // console.log({ path });

    if (!isLoggedIn && !PUBLIC_PATHS.includes(path)) {
      console.log("not authorized");
      setAuthorized(false);
      // setIsLoading(false);
      router.replace({
        pathname: "/login",
        query: { returnUrl: router.asPath },
      });
      return;
    }
    // if (isLoggedIn && PUBLIC_PATHS.includes(path)) {
    //   console.log("authorized user cannot access login!");
    //   router.replace("/");
    //   return;
    // }
    console.log("authorized");
    // setIsLoading(false);
    setAuthorized(true);
  }

  const hideContent = () => setAuthorized(false);

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    // router.events.on("routeChangeStart", () => {
    //   hideContent();
    //   setIsLoading(true);
    // });

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      // router.events.off("routeChangeStart", () => {
      //   hideContent();
      //   setIsLoading(true);
      // });
      router.events.off("routeChangeComplete", authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, router.events, isLoggedIn]);

  return authorized /* && !isLoading */ ? (
    children
  ) : (
    <Box
      sx={{
        width: 300,
        position: "absolute",
        top: "calc(50vh - 80px)",
        left: "calc(50vw - 150px)",
      }}
    >
      <Skeleton height={45} />
      <Skeleton height={45} animation="wave" />
      <Skeleton height={45} animation={false} />
    </Box>
  );
}
