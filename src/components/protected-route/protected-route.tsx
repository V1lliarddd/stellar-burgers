import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const userState = useSelector((state) => state.user);

  if (!userState.user && !onlyUnAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (!userState.checked) {
    return <Preloader />;
  }

  if (onlyUnAuth && userState.user) {
    const from = location.state?.from?.pathname || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
