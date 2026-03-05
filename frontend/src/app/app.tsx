import { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import clsx from 'clsx';

import { Cover } from '../components/cover/cover';
// import { Home } from '../../pages/home/home';
import { Timesheet } from '../pages/master/timesheet/timesheet';
import { DefaultPage } from '../components/../pages/default/default';
// import { NotFound } from '../../pages/not-found/not-found';
import { Overlay } from '../components/overlay/overlay';
import { Modal } from '../components/modal/modal';
import { LoginForm } from '../components/forms/login-form/login-form';
import { ShiftForm } from '../components/forms/shift-form/shift-form';
import { AddWorkerForm } from '../components/forms/add-worker-form/add-worker-form';
import { LogoutForm } from '../components/forms/loguot-form/logout-form';
import { ProtectedRoute } from '../components/protected-route/protected-route';
import { checkAccessToken } from '../components/../services/slices/auth/actions';
import { useDispatch } from '../components/../services/store';
import { UpdateWorkerForm } from '../components/forms/update-worker-form/update-worker-form';
import { AddWorkerInfo } from '../components/add-worker-info/add-worker-info';
// import { HomeShift } from '../../pages/home-shift/home-shift';
// import { Shipment } from '../../pages/shipment/shipment';
// import { Pack } from '../../pages/pack/pack';
// import { Residue } from '../../pages/residue/residue';
// import { Fix } from '../../pages/fix/fix';
import { ProductionForm } from '../components/forms/production/production.form';
import { ShipmentForm } from '../components/forms/shipment/shipment.form';
// import { Production } from '../../pages/production/production';
import { PackForm } from '../components/forms/pack/pack.form';
import { FixForm } from '../components/forms/fix/fix.form';
import { Footer } from '../components/footer/footer';
import { Header } from '../components/header/header';
import { LayerContext } from '../contexts/layer/layerContext';
import { DeleteForm } from '../components/forms/delete-form/delete-form';

import styles from './app.module.css';
import { Production } from '../pages/master/production/production';

const App = () => {
  const {
    isOpenOverlay,
    isLoginModalOpen,
    isLogoutOpenModal,
    isAddWorkerOpenModall,
    isUpdateWorkerOpenModall,
    isAddShiftOpenModall,
    isDeleteOpenModall,
    isUserShiftInfoOpenModal,
    isProductionOpenMdal,
    isShipmentOpenMdal,
    isPackOpenMdal,
    isFixOpenMdal,
    selectedScrollPosition,
    setSelectedScrollPosition,
  } = useContext(LayerContext);

  const dispatch = useDispatch();

  // Текущая позициция на странице
  const scrollPosition = window.scrollY;

  useEffect(() => {
    if (isOpenOverlay) {
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
  }, [isOpenOverlay]);

  useEffect(() => {
    console.log('✅ App смонтирован');
    dispatch(checkAccessToken());
  }, []);

  console.log('🔁 App отрендерен');

  return (
    <div
      className={clsx(
        styles.container,
        isOpenOverlay && styles.container__fixed,
      )}
    >
      <Header />
      <Cover />
      <Routes>
        <Route path='/' element={<DefaultPage />} />
        <Route element={<ProtectedRoute />}>
          {/* <Route path="/home" element={<Home />} /> */}
          {/* <Route path="/home/shifts/:shiftId" element={<HomeShift />} /> */}
          <Route path='/timesheet' element={<Timesheet />} />
          <Route path='/production' element={<Production />} />
          {/* <Route path="/shipment" element={<Shipment />} /> */}
          {/* <Route path="/pack" element={<Pack />} /> */}
          {/* <Route path="/fix" element={<Fix />} /> */}
          {/* <Route path="/residue" element={<Residue />} /> */}
        </Route>
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      <Footer />

      {isOpenOverlay && <Overlay />}

      {isLoginModalOpen && (
        <Modal>
          <LoginForm />
        </Modal>
      )}

      {isAddWorkerOpenModall && (
        <Modal>
          <AddWorkerForm />
        </Modal>
      )}

      {isUpdateWorkerOpenModall && (
        <Modal>
          <UpdateWorkerForm />
        </Modal>
      )}

      {isAddShiftOpenModall && (
        <Modal>
          <ShiftForm />
        </Modal>
      )}

      {isProductionOpenMdal && (
        <Modal>
          <ProductionForm />
        </Modal>
      )}

      {isShipmentOpenMdal && (
        <Modal>
          <ShipmentForm />
        </Modal>
      )}

      {isPackOpenMdal && (
        <Modal>
          <PackForm />
        </Modal>
      )}

      {isFixOpenMdal && (
        <Modal>
          <FixForm />
        </Modal>
      )}

      {isDeleteOpenModall && (
        <Modal>
          <DeleteForm />
        </Modal>
      )}

      {isLogoutOpenModal && (
        <Modal>
          <LogoutForm />
        </Modal>
      )}

      {isUserShiftInfoOpenModal && (
        <Modal>
          <AddWorkerInfo />
        </Modal>
      )}
    </div>
  );
};

export default App;
