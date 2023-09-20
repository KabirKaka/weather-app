import { useCallback, useState } from "react";

const useHttpRequests = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const sendRequest = useCallback(async (config, apply) => {
		setIsLoading(true);
		setError(null);
        
		try {
			const response = await fetch(config.url ,{
				method: config.method ? config.method : "GET",
				body: config.body ? JSON.stringify(config.body) : null,
				headers: config.headers ? config.headers : {},
			});

			if (!response.ok) {
				throw new Error("Request failed!");
			}

			const data = await response.json();
			apply(data);
		} catch (err) {
			setError(err.message || "Something went wrong!");
		}
		setIsLoading(false);
	},[]);

	return { error, isLoading, sendRequest };
};

export default useHttpRequests;
