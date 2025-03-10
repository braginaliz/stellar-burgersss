import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import React from 'react';
import { Preloader } from '@ui';
import { getUserAuth } from '../../slice/UserSlice';

type ProtectedRouteProps = {
  component: React.ReactNode;
  onlyUnAuth?: boolean;
};

const ProtectedRoute = ({
  onlyUnAuth = false,
  component
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(getUserAuth);
  const location = useLocation();

  if (isAuthChecked === undefined) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuthChecked) {
    return <Navigate to='/login' state={{ from: location }} />;
  }
  if (onlyUnAuth && isAuthChecked) {
    const prevPage = location.state?.from || { pathname: '/' };
    return <Navigate to={prevPage} />;
  }
  return <>{component}</>;
};

export const OnlyAuth = ProtectedRoute;

export const OnlyUnAuth = ({ component }: { component: React.JSX.Element }) => {
  return <ProtectedRoute onlyUnAuth={true} component={component} />;
};
