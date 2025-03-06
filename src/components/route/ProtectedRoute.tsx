import { useSelector } from '../../services/store';
import { isAuthorizedSelector, UserSelector } from '../../slice/AuthSlice';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui';

type ProtectedProps = {
  isNotAuthorized?: boolean;
  component: React.JSX.Element;
};

const ProtectedRoute = ({
  isNotAuthorized = false,
  component
}: ProtectedProps) => {
  const isAuthorized = useSelector(isAuthorizedSelector);
  const user = useSelector(UserSelector);
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

  return component;
};

export const IsAuthorized = ProtectedRoute;
export const NotAuthorized = ({
  component
}: {
  component: React.JSX.Element;
}) => <ProtectedRoute isNotAuthorized component={component} />;
