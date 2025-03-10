import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { useSelector } from '../../services/store';
import {selectUser,selectIsAuthenticated} from "../../slice/UserSlice"


type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: React.JSX.Element;
};

const ProtectedRoute = ({
  onlyUnAuth = false,
  component
}: ProtectedRouteProps): React.JSX.Element => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }
  if (onlyUnAuth && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  return component;
};

export const OnlyAuth = ProtectedRoute;

export const OnlyUnAuth = ({ component }: { component: React.JSX.Element }) => {
  return <ProtectedRoute onlyUnAuth={true} component={component} />;
};
