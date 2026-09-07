import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const userState = useSelector((state) => state.user);

  const userName = userState.user?.name || '';
  return <AppHeaderUI userName={userName} />;
};
