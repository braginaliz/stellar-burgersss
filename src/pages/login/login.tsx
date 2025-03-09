import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { userLogin, isAuthorizedSelector, errorSelector } from '../../slice/AuthSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAuthorized = useSelector(isAuthorizedSelector);
  const error = useSelector(errorSelector);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const userdata = { email, password };
    await dispatch(userLogin(userdata));
  };

  useEffect(() => {
    if (isAuthorized) {
      const from = location.state?.from || '/';
      navigate(from);
    }
  }, [isAuthorized, navigate, location.state]);

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
