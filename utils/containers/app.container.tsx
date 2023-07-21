import { useHttpClient } from "@utils/hooks/httpClient";
import React, { useState, useEffect } from "react";

const AppContext = React.createContext(null);

function AppStore(props) {
  const { children } = props;
  const { sendRequest } = useHttpClient();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  // const [error, setError] = useState<
  //   { title: string; message: string } | boolean
  // >(false);

  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);

  const getLocations = async () => {
    const res = await sendRequest(
      "http://localhost:8080/admin/locations",
      "GET",
      null,
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
    // console.log({ res });
    if (!res.error) {
      setLocations(res.locations);
    }
  };

  const getServices = async () => {
    const res = await sendRequest(
      "http://localhost:8080/admin/services",
      "GET",
      null,
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
    // console.log({ res });
    if (!res.error) {
      setServices(res.services);
    }
  };

  const getCalendar = async (locId) => {
    const res = await sendRequest(
      `http://localhost:8080/bookings/calendar?locationId=${locId}`,
      "GET",
      null,
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
    if (!res.error) {
      console.log({ res });
      return res.bookingData;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      setToken(token);
      setUser(userId);
      setIsLoggedIn(true);
      getLocations();
      getServices();
    }
  }, [isLoggedIn]);

  // TODO: redirect -> https://jasonwatmore.com/post/2021/08/30/next-js-redirect-to-login-page-if-unauthenticated

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        // error,
        // setError,
        token,
        setToken,
        user,
        setUser,
        // SalonData
        locations,
        services,
        getCalendar,
      }}
    >
      {/* {isLoggedIn ? children : <Login />} */}
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppStore };
