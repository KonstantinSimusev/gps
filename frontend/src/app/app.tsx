import { useContext, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import clsx from 'clsx';

import { ROLE_TO_PAGE } from '../utils/types';

import { useDispatch, useSelector } from '../components/../services/store';
import { selectProfile } from '../services/slices/auth/slice';

import { checkAccessToken } from '../components/../services/slices/auth/actions';

import { LayerContext } from '../contexts/layer/layerContext';

import { ProtectedRoute } from '../components/protected-route/protected-route';

import { AdminPage } from '../pages/admin-page/admin-page';
import { DefaultPage } from '../pages/default-page/default-page';
// import { Fix } from '../pages/master/fix/fix';
import { HomePage } from '../pages/home-page/home-page';
import { NotFoundPage } from '../pages/not-found-page/not-found-page';
// import { Pack } from '../pages/master/pack/pack';
// import { Packer } from '../pages/packer/packer';
// import { Production } from '../pages/master/production/production';
// import { Residue } from '../pages/master/residue/residue';
import { ShiftPage } from '../pages/master/shift-page/shift-page';
// import { Shipment } from '../pages/master/shipment/shipment';
import { TimesheetPage } from '../pages/master/timesheet-page/timesheet-page';

// import { Cover } from '../components/cover/cover';
import { Footer } from '../components/footer/footer';
import { Header } from '../components/header/header';
import { Modal } from '../components/ui/modal/modal';
import { Overlay } from '../components/ui/overlay/overlay';

import { AccountInfoForm } from '../components/forms/account-info-form/account-info-form';
import { EmployeeCreateForm } from '../components/forms/employee-create-form/employee-create-form';
import { EmployeeDeleteForm } from '../components/forms/employee-delete-form/employee-delete-form';
import { EmployeeEditForm } from '../components/forms/employee-edit-form/employee-edit-form';
import { EmployeeSearchForm } from '../components/forms/employee-search-form/employee-search-form';
import { LoginForm } from '../components/forms/login-form/login-form';
import { LogoutForm } from '../components/forms/loguot-form/logout-form';
import { PasswordUpdateForm } from '../components/forms/password-update-form/password-update-form';
import { EmployeeAddForm } from '../components/forms/employee-add-form/employee-add-form';
// import { ShiftSearchForm } from '../components/forms/shift-search-form/shift-search-form';
import { TimesheetEditForm } from '../components/forms/timesheet-edit-form/timesheet-edit-form';

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
    // isShiftSearchOpen,
    isEmployeeAddOpen,
    isTimesheetEditOpen,
    selectedScrollPosition,
    setSelectedScrollPosition,
  } = useContext(LayerContext);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector(selectProfile);

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

  useEffect(() => {
    const currentRole = profile?.role;
    const currentPath = location.pathname;

    if (currentPath === '/') {
      sessionStorage.removeItem('userRole');
      return;
    }

    const prevRole = sessionStorage.getItem('userRole');

    if (currentRole && currentRole !== prevRole) {
      const targetPath = ROLE_TO_PAGE[currentRole] || '/home';
      sessionStorage.setItem('userRole', currentRole);
      navigate(targetPath, { replace: true });
    }
  }, [profile?.role, location.pathname]);

  return (
    <div
      className={clsx(
        styles.container,
        isOverlayOpen && styles.container__fixed,
      )}
    >
      <Header />
      {/* <Cover /> */}
      <Routes>
        <Route path='/' element={<DefaultPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/timesheet' element={<ShiftPage />} />
          <Route path='/timesheet/:shiftId' element={<TimesheetPage />} />
          {/* <Route path='/production' element={<ProductionPage />} />
          <Route path='/shipment' element={<ShipmentPage />} />
          <Route path='/pack' element={<PackPage />} />
          <Route path='/fix' element={<FixPage />} />
          <Route path='/residue' element={<ResiduePage />} />
          <Route path='/scan' element={<Packer />} /> */}
        </Route>
        <Route path='*' element={<NotFoundPage />} />
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

      {/* {isShiftSearchOpen && (
        <Modal>
          <ShiftSearchForm />
        </Modal>
      )} */}

      {isEmployeeAddOpen && (
        <Modal>
          <EmployeeAddForm />
        </Modal>
      )}

      {isTimesheetEditOpen && (
        <Modal>
          <TimesheetEditForm />
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
