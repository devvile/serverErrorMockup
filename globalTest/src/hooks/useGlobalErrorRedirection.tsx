import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setGlobalRedirectHandler } from '../util/http';

export const useGlobalErrorHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setGlobalRedirectHandler((status: number) => {
      switch (status) {
        case 400:
          navigate('/400');
          break;
        case 401:
          navigate('/401');
          break;
        case 403:
          navigate('/403');
          break;
        case 500:
          navigate('/500');
          break;
        case 501:
          navigate('/501');
          break;
        default:
          console.warn(`No redirect configured for status ${status}`);
      }
    });

    // Cleanup function to prevent memory leaks
    return () => {
      setGlobalRedirectHandler(() => {});
    };
  }, [navigate]);
};
