import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useConvexQuery = (query, ...args) => {
  const result = useQuery(query, ...args);

  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoadng] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (result === undefined) {
      setIsLoadng(true);
    } else {
      try {
        setData(result);
        setError(null);
      } catch (error) {
        setError(error);
        toast.error(error.message);
      } finally {
        setIsLoadng(false);
      }
    }
  }, [result]);

  return { data, isLoading, error };
};

export const useConvexMutation = (mutation) => {
  const mutationFn = useMutation(mutation);

  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoadng] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (...args) => {
    setIsLoadng(true);
    setError(null);

    try {
      const res = await mutationFn(...args);
      setData(res);
      return res;
    } catch (error) {
      setError(error);
      toast.error(error.message);
    } finally {
      setIsLoadng(false);
    }
  };

  return { mutate, data, isLoading, error };
};
