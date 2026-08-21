import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { RootState } from 'src/services/root-reducer';

export const AppHeader: FC = () => {
  const userState = useSelector((state: RootState) => state.user);

  const userName = userState.user?.name || '';
  return <AppHeaderUI userName={userName} />;
};
