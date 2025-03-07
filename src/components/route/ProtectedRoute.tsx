import { useSelector } from '../../services/store';
import { isAuthorizedSelector, userSelector } from '../../slice/AuthSlice';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui';

type ProtectedProps = {
  isNotAuthorized?: boolean;
  children: React.JSX.Element;
};

export const ProtectedRoute = ({
  isNotAuthorized = false,
  children
}: ProtectedProps) => {
  const isAuthorized = useSelector(isAuthorizedSelector);
  const user = useSelector(userSelector); 
  const location = useLocation();

  if (!isAuthorized) {
    return <Preloader />;
  }

  if (isNotAuthorized && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!isNotAuthorized && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};

