import clsx from 'clsx';

import { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { useDispatch } from '../components/../services/store';

import { checkAccessToken } from '../components/../services/slices/auth/actions';

import { LayerContext } from '../contexts/layer/layerContext';

import { ProtectedRoute } from '../components/protected-route/protected-route';

import { Home } from '../pages/home/home';
import { Admin } from '../pages/admin/admin';
import { Packer } from '../pages/packer/packer';
import { Timesheet } from '../pages/master/timesheet/timesheet';
import { DefaultPage } from '../components/../pages/default/default';
import { NotFound } from '../pages/not-found/not-found';

import { Cover } from '../components/cover/cover';
import { Footer } from '../components/footer/footer';
import { Header } from '../components/header/header';
import { Overlay } from '../components/overlay/overlay';
import { Modal } from '../components/modal/modal';
import { LoginForm } from '../components/forms/login-form/login-form';
import { LogoutForm } from '../components/forms/loguot-form/logout-form';
import { SearchForm } from '../components/forms/search-form/search-form';

import styles from './app.module.css';
import { EmployeeDeleteForm } from '../components/forms/employee-delete-form/employee-delete-form';

const App = () => {
  const {
    isOverlayOpen,
    isLoginOpen,
    isLogoutOpen,
    isEmployeeSearchOpen,
    isEmployeeDeleteOpen,
    selectedScrollPosition,
    setSelectedScrollPosition,
  } = useContext(LayerContext);

  const dispatch = useDispatch();

  // Текущая позициция на странице
  const scrollPosition = window.scrollY;

  useEffect(() => {
    if (isOverlayOpen) {
      // Устанвливаем в контекст значение
      setSelectedScrollPosition(scrollPosition);
      // Фиксируем контент
      document.body.style.position = 'fixed';
      // Смещаем от верха страницы на это расстояние
      document.body.style.top = `-${scrollPosition}px`;
      // Запрещаем прокрутку
      document.body.style.overflow = 'hidden';
    } else {
      // Снимаем фиксацию
      document.body.style.position = '';
      // Разрешаем прокрутку
      document.body.style.overflow = '';
      // Скролим до этой точки где находились
      window.scrollTo(0, selectedScrollPosition);
    }
  }, [isOverlayOpen]);

  useEffect(() => {
    console.log('✅ App смонтирован');
    dispatch(checkAccessToken());
  }, []);

  console.log('🔁 App отрендерен');

  return (
    <div
      className={clsx(
        styles.container,
        isOverlayOpen && styles.container__fixed,
      )}
    >
      <Header />
      <Cover />
      <Routes>
        <Route path='/' element={<DefaultPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/admin' element={<Admin />} />
          <Route path='/home' element={<Home />} />
          <Route path='/master/timesheet' element={<Timesheet />} />
          <Route path='/packer/scan' element={<Packer />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />

      {isOverlayOpen && <Overlay />}

      {isLoginOpen && (
        <Modal>
          <LoginForm />
        </Modal>
      )}

      {isEmployeeSearchOpen && (
        <Modal>
          <SearchForm />
        </Modal>
      )}

      {isEmployeeDeleteOpen && (
        <Modal>
          <EmployeeDeleteForm />
        </Modal>
      )}

      {isLogoutOpen && (
        <Modal>
          <LogoutForm />
        </Modal>
      )}
    </div>
  );
};

export default App;
