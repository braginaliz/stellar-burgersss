import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import {
  errorSelector, loadingSelector, userLogin} from '../../slice/AuthSlice'

export const Login: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: false,
    password: false
  });
  const isError = useSelector(errorSelector);
  const isLoading = useSelector(loadingSelector);

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault(); 
    const inputErrors = {
      email: !email,
      password: !password
    };
    setErrors(inputErrors);
    if (!inputErrors.email && !inputErrors.password) {
      dispatch(userLogin({ email, password }));
    }
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setErrors({ ...errors, [e.target.name]: false });
  };

  if (isLoading) return <Preloader />;

  return (
    <LoginUI
      errorText={isError ? 'Электронный адрес или пароль введены неверно' : ''}
      email={email}
      password={password}
      handleSubmit={onSubmit}
      setEmail={setEmail} // Передаем setEmail
      setPassword={setPassword} // Передаем setPassword
    />
  );
};
