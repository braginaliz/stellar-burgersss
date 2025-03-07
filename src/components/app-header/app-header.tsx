import { useSelector } from '../../services/store';
import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { UserSelector } from '../../slice/AuthSlice';

export const AppHeader: FC = () => {
  const user = useSelector(UserSelector);
  const userName = user?.name; // user может быть null
  return <AppHeaderUI userName={userName} />;
};
