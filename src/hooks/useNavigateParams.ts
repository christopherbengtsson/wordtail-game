import {
  NavigateOptions,
  URLSearchParamsInit,
  createSearchParams,
  useNavigate,
} from 'react-router-dom';

export const useNavigateParams = () => {
  const navigate = useNavigate();

  return (
    pathname: string,
    params?: URLSearchParamsInit,
    options?: NavigateOptions,
  ) => {
    const path = {
      pathname,
      search: createSearchParams(params).toString(),
    };
    navigate(path, options);
  };
};
