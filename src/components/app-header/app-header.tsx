import { useSelector } from '../../services/store';
import { FC } from 'react';
import { AppHeaderUI } from '@ui';


export const AppHeader: FC = () => {
  const { userdata } = useSelector((state) => state.authorization);

  return <AppHeaderUI userName={userdata.name} />;
};