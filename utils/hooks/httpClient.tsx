import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { AppContext } from "@utils/containers/app.container";

export const useHttpClient = () => {
	const [isLoading, setIsLoading] = useState(false);
	// const [error, setError] = useState<any>();
	const { error, setError } = useContext(AppContext)

	const activeHttpRequests = useRef<any[]>([]);

	const sendRequest = useCallback(async (
		url,
		method = 'GET',
		body: any = null,
		headers = {}
	) => {
		setIsLoading(true);
		const httpAbortCtrll = new AbortController();
		activeHttpRequests.current.push(httpAbortCtrll);

		try {
			const response = await fetch(url, {
				method,
				body,
				headers,
				signal: httpAbortCtrll.signal
			})
			const responseData = await response.json();

			activeHttpRequests.current = activeHttpRequests.current.filter(
				reqCtrl => reqCtrl !== httpAbortCtrll
			)

			if (!response.ok) {
				throw new Error(responseData.message)
			}

			setIsLoading(false);
			return responseData;
		} catch (err) {
			setError({ title: 'err', message: err });
			setIsLoading(false);
			throw err;
		}
	}, [])

	const clearError = () => setError(false);

	useEffect(() => {
		return () => {
			activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
		}
	}, [])

	return { isLoading, error, sendRequest, clearError }
}