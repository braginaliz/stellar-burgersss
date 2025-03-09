import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../slice/IngredientSlice';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { OnlyAuth, OnlyUnAuth } from '../route/ProtectedRoute';
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
import { checkUserAuth } from '../../slice/AuthSlice';

const App = () => {
  const location = useLocation();
  const bgLocation = location.state?.background;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleModalClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [checkUserAuth]);

  return (
    <div className={styles.app}>
      <AppHeader></AppHeader>
      <Routes location={bgLocation || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<OnlyUnAuth component={<Login />} />} />
        <Route
          path='/register'
          element={<OnlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<OnlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<OnlyUnAuth component={<ResetPassword />} />}
        />
        <Route
          path='/ingredients/:id'
          element={
            <div className={styles.detailPageWrap}>
              <p className={`text text_type_main-large ${styles.detailHeader}`}>
                Детали ингридиента
              </p>
              <IngredientDetails />
            </div>
          }
        />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/profile'>
          <Route index element={<OnlyAuth component={<Profile />} />} />
          <Route
            path='orders'
            element={<OnlyAuth component={<ProfileOrders />} />}
          />
        </Route>
      </Routes>

      {bgLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={'Детали Заказа'} onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <OnlyAuth
                component={
                  <Modal title={'Детали Заказа'} onClose={handleModalClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
