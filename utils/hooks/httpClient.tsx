import { useCallback, useEffect, useRef, useState } from "react";

// import { AppContext } from "@utils/containers/app.container";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();

  const activeHttpRequests = useRef<any[]>([]);

  const sendRequest = useCallback(
    async (url: string, method = "GET", body: any = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrll = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrll);

      try {
        const response = await fetch(url, {
          method,
          body: body ? JSON.stringify(body) : null,
          headers,
          signal: httpAbortCtrll.signal,
        });
        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrll
        );
        console.log({ response, responseData });

        if (!response.ok) {
          // throw new Error(responseData.message);
          setError(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError({ title: "err", message: err });
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => setError(false);

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
