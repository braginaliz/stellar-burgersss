import { getUser } from '../../slice/AuthSlice';
import { useSelector } from '../../services/store';
import { FC } from 'react';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const user = useSelector(getUser);
  const userName = user?.name;
  return <AppHeaderUI userName={userName || ''} />;
};
