import { useState } from "react";

const useFetchResponse = () => {
  const [fetchResults, setFetchResults] = useState([]);

  const fetchResponse = async (url, resultKey) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        setFetchResults(result[resultKey] || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    fetchResults,
    fetchResponse,
  };
};

export default useFetchResponse;
