import { useContext, useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';

import clsx from 'clsx';

import { LayerContext } from '../contexts/layer/layerContext';
import { ProtectedRoute } from '../components/protected-route/protected-route';
import { useLoaderWithDelay } from '../hooks/use-loader-with-delay';

import { useDispatch, useSelector } from '../components/../services/store';

import { checkAccessToken } from '../components/../services/slices/auth/actions';

import { selectIsAuthLoading } from '../services/slices/auth/slice';
import { selectIsUpdateAccountLoading } from '../services/slices/account/slice';

import {
  selectIsCreateEmployeeLoading,
  selectIsSearchEmployeeLoading,
  selectIsUpdateEmployeeLoading,
} from '../services/slices/employee/slice';

import {
  selectIsGetShiftsLoading,
  selectIsSearchShiftsLoading,
  selectIsShiftLoading,
} from '../services/slices/shift/slice';

import {
  selectIsCreateEmployeeShiftLoading,
  selectIsDeleteEmployeeShiftLoading,
  selectIsUpdateEmployeeShiftLoading,
} from '../services/slices/employee-shift/slice';

import { DefaultPage } from '../pages/default/default-page';
import { DocumentItemPage } from '../pages/master/documents/document-item/document-item-page';
import { DocumentListPage } from '../pages/master/documents/document-list-page/document-list-page';
import { HomePage } from '../pages/home/home-page';
import { EmployeePage } from '../pages/employee/employee-page';
import { NotFoundPage } from '../pages/not-found/not-found-page';
import { NoticeItemPage } from '../pages/notice/notice-item/notice-item-page';
import { NoticeListPage } from '../pages/notice/notice-list/notice-list-page';
import { ShiftPage } from '../pages/master/shift/shift-page';
import { ShiftSearchPage } from '../pages/master/shift-search/shift-search-page';
import { TimesheetPage } from '../pages/master/timesheet/timesheet-page';

import { BlockingLoader } from '../components/ui/blocking-loader/blocking-loader';
import { Footer } from '../components/footer/footer';
import { Header } from '../components/header/header';
import { Modal } from '../components/ui/modal/modal';
import { Overlay } from '../components/ui/overlay/overlay';

import { AccountInfoForm } from '../components/forms/account-info-form/account-info-form';
import { EmployeeCreateForm } from '../components/forms/employee-create-form/employee-create-form';
import { EmployeeEditForm } from '../components/forms/employee-edit-form/employee-edit-form';
import { EmployeeSearchForm } from '../components/forms/employee-search-form/employee-search-form';
import { LoginForm } from '../components/forms/login-form/login-form';
import { LogoutForm } from '../components/forms/loguot-form/logout-form';
import { PasswordUpdateForm } from '../components/forms/password-update-form/password-update-form';
import { EmployeeAddForm } from '../components/forms/employee-add-form/employee-add-form';
import { ShiftSearchForm } from '../components/forms/shift-search-form/shift-search-form';
import { EmployeeShiftEditForm } from '../components/forms/employee-shift-edit-form/employee-shift-edit-form';
import { EmployeeShiftDeleteForm } from '../components/forms/employee-shift-delete-form/employee-shift-delete-form';

import styles from './app.module.css';

const App = () => {
  const {
    isOverlayOpen,
    isLoginOpen,
    isLogoutOpen,
    isEmployeeSearchOpen,
    isEmployeeCreateOpen,
    isEmployeeEditOpen,
    isAccountInfoOpen,
    isPasswordUpdateOpen,
    isShiftSearchOpen,
    isEmployeeAddOpen,
    isEmployeeShiftEditOpen,
    isEmployeeShiftDeleteOpen,
  } = useContext(LayerContext);

  const dispatch = useDispatch();

  const isAuthLoading = useSelector(selectIsAuthLoading);
  const isUpdateAccountLoading = useSelector(selectIsUpdateAccountLoading);
  const isCreateEmployeeLoading = useSelector(selectIsCreateEmployeeLoading);
  const isUpdateEmployeeLoading = useSelector(selectIsUpdateEmployeeLoading);
  const isSearchEmployeeLoading = useSelector(selectIsSearchEmployeeLoading);
  const isShiftLoading = useSelector(selectIsShiftLoading);
  const isGetShiftsLoading = useSelector(selectIsGetShiftsLoading);
  const isSearchShiftsLoading = useSelector(selectIsSearchShiftsLoading);

  const isCreateEmployeeShiftLoading = useSelector(
    selectIsCreateEmployeeShiftLoading,
  );

  const isUpdateEmployeeShiftLoading = useSelector(
    selectIsUpdateEmployeeShiftLoading,
  );

  const isDeleteEmployeeShiftLoading = useSelector(
    selectIsDeleteEmployeeShiftLoading,
  );

  const isLoading =
    isAuthLoading ||
    isUpdateAccountLoading ||
    isCreateEmployeeLoading ||
    isUpdateEmployeeLoading ||
    isSearchEmployeeLoading ||
    isShiftLoading ||
    isGetShiftsLoading ||
    isSearchShiftsLoading ||
    isCreateEmployeeShiftLoading ||
    isUpdateEmployeeShiftLoading ||
    isDeleteEmployeeShiftLoading;

  // Применяем задержку ТОЛЬКО к показу блокирующего слоя
  const showBlocker = useLoaderWithDelay(isLoading, 300, 300);

  const lastScrollY = useRef(0);

  useEffect(() => {
    if (isOverlayOpen) {
      lastScrollY.current = window.scrollY;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      window.scrollTo(0, lastScrollY.current);
    }
  }, [isOverlayOpen]);

  // Проверка токена — запускается всегда при монтировании
  useEffect(() => {
    dispatch(checkAccessToken());
  }, []);

  return (
    <div className={clsx(styles.container)}>
      <div className={styles.wrapper}>
        <Header />
        <main className={styles.content}>
          <Routes>
            <Route path='/' element={<DefaultPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path='/home' element={<HomePage />} />
              <Route path='/employee' element={<EmployeePage />} />
              <Route path='/timesheet' element={<TimesheetPage />} />
              <Route path='/timesheet/:shiftId' element={<ShiftPage />} />
              <Route path='/shift-search' element={<ShiftSearchPage />} />
              <Route path='/documents' element={<DocumentListPage />} />
              <Route
                path='/documents/:documentId'
                element={<DocumentItemPage />}
              />
              <Route path='/notices' element={<NoticeListPage />} />
              <Route path='/notices/:noticeId' element={<NoticeItemPage />} />
              <Route path='*' element={<NotFoundPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>

      {showBlocker && <BlockingLoader />}
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

      {isShiftSearchOpen && (
        <Modal>
          <ShiftSearchForm />
        </Modal>
      )}

      {isEmployeeAddOpen && (
        <Modal>
          <EmployeeAddForm />
        </Modal>
      )}

      {isEmployeeShiftEditOpen && (
        <Modal>
          <EmployeeShiftEditForm />
        </Modal>
      )}

      {isEmployeeShiftDeleteOpen && (
        <Modal>
          <EmployeeShiftDeleteForm />
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
