import { useState } from "react";

const useFetchResponse = () => {
  const [fetchResults, setFetchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchResponse = async (url, resultKey) => {
    try {
      setErrorMessage("");
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        setFetchResults(result[resultKey] || []);
      } else {
        setErrorMessage(result.message || "Failed to fetch data!");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Network error! Unable to connect to server.");
    }
  };

  return {
    fetchResults,
    fetchResponse,
    errorMessage,
    setErrorMessage,
  };
};

export default useFetchResponse;
