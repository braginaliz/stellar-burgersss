import { ProfileUI } from '@ui-pages';
import { updateUser } from '../../slice/UserSlice';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserEmail, getUserName } from '../../slice/UserSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();

  const userName = useSelector(getUserName);
  const userEmail = useSelector(getUserEmail);

  const [formValue, setFormValue] = useState({
    name: userName || '',
    email: userEmail || '',
    password: ''
  });

  const isFormChanged =
    formValue.name !== userName ||
    formValue.email !== userEmail ||
    !!formValue.password;

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: userName || '',
      email: userEmail || ''
    }));
  }, [userName, userEmail]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    await dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        password: formValue.password
      })
    );

    setFormValue((prevState) => ({
      ...prevState,
      password: ''
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: userName || '',
      email: userEmail || '',
      password: ''
    });
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
