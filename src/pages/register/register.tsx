
import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { userRegistrate } from '../../slice/AuthSlice';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = useSelector(state => state.authorization.error);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(userRegistrate({ email, password, name: userName }));
    if (userRegistrate.fulfilled.match(resultAction)) {

    }
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
