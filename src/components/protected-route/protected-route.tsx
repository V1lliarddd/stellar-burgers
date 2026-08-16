import type { ReactElement } from 'react';

type ProtectedRouteProps = {
  children: ReactElement;
};

export const ProtectedRoute = (props: ProtectedRouteProps) => props.children;
