import { useState, useCallback } from "react";
import { commsHubApi } from "../util/http";
interface UseAxiosState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useAxios = <T = any>() => {
  const [state, setState] = useState<UseAxiosState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async (url: string, params?: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await commsHubApi.get<T>(url, params);
      setState({
        data: response,
        loading: false,
        error: null,
      });
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      console.log("Error occurred, user was redirected by global handler");
      return null;
    }
  }, []);

  const postData = useCallback(async (url: string, data?: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await commsHubApi.post<T>(url, data);
      setState({
        data: response,
        loading: false,
        error: null,
      });
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      console.log("Error occurred, user was redirected by global handler");
      return null;
    }
  }, []);

  const putData = useCallback(async (url: string, data?: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await commsHubApi.put<T>(url, data);
      setState({
        data: response,
        loading: false,
        error: null,
      });
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      console.log("Error occurred, user was redirected by global handler");
      return null;
    }
  }, []);

  const deleteData = useCallback(async (url: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await commsHubApi.delete<T>(url);
      setState({
        data: response,
        loading: false,
        error: null,
      });
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      console.log("Error occurred, user was redirected by global handler");
      return null;
    }
  }, []);

  const resetState = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    fetchData,
    postData,
    putData,
    deleteData,
    resetState,
  };
};

export default useAxios;