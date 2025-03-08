
import { FC } from 'react';
import { Input, Button, PasswordInput } from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';

interface LoginUIProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSubmit: (e: React.SyntheticEvent) => void;
  errorText: string;
}

export const LoginUI: FC<LoginUIProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  errorText,
}) => (
  <main className={styles.container}>
    <div className={`pt-6 ${styles.wrapCenter}`}>
      <h3 className='pb-6 text text_type_main-medium'>Вход</h3>
      <form className={`pb-15 ${styles.form}`} name='login' onSubmit={handleSubmit}>
        <div className='pb-6'>
          <Input
            type='email'
            placeholder='E-mail'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name='email'
            error={false}
            errorText=''
            size='default'
          />
        </div>
        <div className='pb-6'>
          <PasswordInput
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name='password'
          />
        </div>
        <div className={`pb-6 ${styles.button}`}>
          <Button type='primary' size='medium' htmlType='submit'>
            Войти
          </Button>
        </div>
        {errorText && (
          <p className={`${styles.error} text text_type_main-default pb-6`}>
            {errorText}
          </p>
        )}
      </form>
    </div>
  </main>
);
