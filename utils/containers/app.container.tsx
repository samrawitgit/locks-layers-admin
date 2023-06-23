import React, { useState } from "react";
import Login from "@pages/login";

const AppContext = React.createContext(null);

function AppStore(props) {
  const { children } = props;
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [error, setError] = useState<
    { title: string; message: string } | boolean
  >(false);

  // TODO: redirect -> https://jasonwatmore.com/post/2021/08/30/next-js-redirect-to-login-page-if-unauthenticated
  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        error,
        setError,
      }}
    >
      {/* {isLoggedIn ? children : <Login />} */}
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppStore };
