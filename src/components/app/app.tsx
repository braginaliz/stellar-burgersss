
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../slice/IngredientSlice';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { IsAuthorized, NotAuthorized } from '../route/ProtectedRoute';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ConstructorPage } from '@pages';
import { Feed } from '@pages';
import { ForgotPassword } from '@pages';
import { Login } from '@pages';
import { NotFound404 } from '@pages';
import { Profile } from '@pages';
import { ProfileOrders } from '@pages';
import { Register } from '@pages';
import { ResetPassword } from '@pages';
import styles from './app.module.css';
import { Preloader } from '../ui';
import '../../index.css';

const App = () => {
  const location = useLocation();
  const bgLocation = location.state?.background;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={bgLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='*' element={<NotFound404 />} />
        <Route path='/profile' element={<IsAuthorized component={<Profile />} />} />
        <Route path='/login' element={<NotAuthorized component={<Login />} />} />
        <Route path='/register' element={<NotAuthorized component={<Register />} />} />
        <Route path='/forgot-password' element={<NotAuthorized component={<ForgotPassword />} />} />
        <Route path='/reset-password' element={<NotAuthorized component={<ResetPassword />} />} />
        <Route path='/profile/orders' element={<IsAuthorized component={<ProfileOrders />} />} />
        <Route path='/profile/orders/:number' element={<IsAuthorized component={<OrderInfo />} />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
      </Routes>
      {bgLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title='Заказ:'
                children={<OrderInfo />}
                onClose={() => navigate('/feed')}
              />
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали'
                children={<IngredientDetails />}
                onClose={() => navigate('/')}
              />
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title='Заказ'
                children={<IsAuthorized component={<OrderInfo />} />}
                onClose={() => navigate('/profile/orders')}
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
