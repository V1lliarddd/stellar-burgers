import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Preloader } from '@ui';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchIngridients } from '../../services/slices/ingridients-slice';
import { fetchUser } from '../../services/slices/user-slice';
import { AppDispatch } from '../../services/store';
import { RootState } from 'src/services/root-reducer';
import { fetchFeeds } from '../../services/slices/feed-slice';
import { UnAuthUserRoute } from '../protected-route/unauth-user-route';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();

  const ingridientsState = useSelector((state: RootState) => state.ingredients);

  const ingridients = ingridientsState.data;
  const isIngridientsLoading = ingridientsState.isLoading;
  const isIngridientsError = ingridientsState.error;

  const userState = useSelector((state: RootState) => state.user);

  const isUserAuthenticated = userState.user;
  const isUserChecked = userState.checked;

  const background = location.state?.background;

  useEffect(() => {
    dispatch(fetchIngridients());
    dispatch(fetchUser());
  }, [dispatch]);

  const handleCloseModalWindow = () => navigate(-1);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <UnAuthUserRoute>
              <Login />
            </UnAuthUserRoute>
          }
        />
        <Route
          path='/register'
          element={
            <UnAuthUserRoute>
              <Register />
            </UnAuthUserRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={handleCloseModalWindow}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингридиента'
                onClose={handleCloseModalWindow}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Детали заказа' onClose={handleCloseModalWindow}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}

      {isIngridientsLoading && <Preloader />}
      {isIngridientsError && <div>{isIngridientsError}</div>}
    </div>
  );
};

export default App;
