import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, UseSelector } from 'react-redux';
import { Preloader } from '@ui';
import { RootState } from 'src/services/root-reducer';

export const UnAuthUserRoute = (props: { children: ReactNode }) => {
  const userState = useSelector((state: RootState) => state.user);

  if (userState.user) {
    return <Navigate to='/' replace />;
  }

  if (!userState.checked) {
    return <Preloader />;
  }

  return <>{props.children}</>;
};
