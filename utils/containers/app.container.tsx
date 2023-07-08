import React, { useState, useEffect } from "react";

const AppContext = React.createContext(null);

function AppStore(props) {
  const { children } = props;
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState<
    { title: string; message: string } | boolean
  >(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      setUser(userId);
      setIsLoggedIn(true);
    }
    console.log({ token, userId });
  }, []);

  // TODO: redirect -> https://jasonwatmore.com/post/2021/08/30/next-js-redirect-to-login-page-if-unauthenticated

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        error,
        setError,
        user,
        setUser,
      }}
    >
      {/* {isLoggedIn ? children : <Login />} */}
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppStore };
