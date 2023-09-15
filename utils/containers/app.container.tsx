import React, { useEffect } from "react";

const AppContext = React.createContext(null);

function AppStore(props) {
  const { children } = props;

  useEffect(() => {
    const exitingFunction = () => {
      console.log("exiting...");
      fetch(`/api/logout`, {
        method: "GET",
      }).then((response) => {
        console.log({ response });
        if (!response.ok) {
          throw new Error("Could not logout");
        }
        console.log({ response });
        return response;
      });
    };
    window.addEventListener("beforeunload", exitingFunction);
    // router.events.on("routeChangeStart", exitingFunction);
    return () => {
      console.log("unmounting component...");
      // router.events.off("routeChangeStart", exitingFunction);
      window.removeEventListener("beforeunload", exitingFunction);
    };
  }, []);

  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
}

export { AppContext, AppStore };
