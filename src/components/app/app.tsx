import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';
import {
  ConstructorPage,
  Feed,
  NotFound404,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders
} from '@pages';
import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo
} from '@components';

import { OnlyAuth, OnlyUnAuth } from '../route/ProtectedRoute';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUser, getUserAuth } from '../../slices/userSlice';


export const App = () => {
  const dispatch = useDispatch();
  const Location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.background;
    const isAuthenticated = useSelector(getUserAuth);
  const closeModal = () => {
    navigate(-1);
  };
  
  const profileMatch = useMatch('/profile/orders/:number')?.params.number;

    const feedMatch = useMatch('/feed/:number')?.params.number;
  const orderNumber = profileMatch || feedMatch;

useEffect(() => {
    if (!isAuthenticated) {
      dispatch(getUser()).then(() => {
        const lastPath = localStorage.getItem('lastPath');
        if (isAuthenticated && lastPath) {
          navigate(lastPath);
        }
      });
    }
    dispatch(fetchIngredients());
  }, [dispatch, isAuthenticated, navigate]);


  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
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
          path='/profile'
          element={<OnlyAuth component={< <Profile />} />}
        />
 <Route
          path='/profile/orders'
          element={<OnlyAuth component={< <ProfileOrders />} />}
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


      {isModalOpened && backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title={'Описание ингредиента'}
                onClose={() => {
                  dispatch(closeModal());
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <OnlyAuth
                component={
                  <Modal title={'Детали Заказа'} onClose={() => {
                    dispatch(closeModal());
                  }}
                >
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={'Заказ'}
                onClose={() => {
                  dispatch(closeModal());
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};
