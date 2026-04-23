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
import { EmployeeSearchForm } from '../components/forms/employee-search-form/employee-search-form';
import { EmployeeCreateForm } from '../components/forms/employee-create-form/employee-create-form';
import { EmployeeDeleteForm } from '../components/forms/employee-delete-form/employee-delete-form';
import { EmployeeEditForm } from '../components/forms/employee-edit-form/employee-edit-form';
import { AccountInfoForm } from '../components/forms/account-info-form/account-info-form';
import { PasswordUpdateForm } from '../components/forms/password-update-form/password-update-form';

import styles from './app.module.css';

const App = () => {
  const {
    isOverlayOpen,
    isLoginOpen,
    isLogoutOpen,
    isEmployeeSearchOpen,
    isEmployeeCreateOpen,
    isEmployeeEditOpen,
    isEmployeeDeleteOpen,
    isAccountInfoOpen,
    isPasswordUpdateOpen,
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
    dispatch(checkAccessToken());
  }, []);

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
          <EmployeeSearchForm />
        </Modal>
      )}

      {isEmployeeCreateOpen && (
        <Modal>
          <EmployeeCreateForm />
        </Modal>
      )}

      {isEmployeeEditOpen && (
        <Modal>
          <EmployeeEditForm />
        </Modal>
      )}

      {isEmployeeDeleteOpen && (
        <Modal>
          <EmployeeDeleteForm />
        </Modal>
      )}

      {isAccountInfoOpen && (
        <Modal>
          <AccountInfoForm />
        </Modal>
      )}

      {isPasswordUpdateOpen && (
        <Modal>
          <PasswordUpdateForm />
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
