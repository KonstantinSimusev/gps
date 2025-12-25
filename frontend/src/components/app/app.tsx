import styles from './app.module.css';
import clsx from 'clsx';

import { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ThemeContext } from '../../contexts/theme/themeContext';
import { LayerContext } from '../../contexts/layer/layerContext';

import { Header } from '../header/header';
import { Banner } from '../banner/banner';
import { Home } from '../pages/home/home';
import { Timesheet } from '../pages/timesheet/timesheet';
import { DefaultPage } from '../pages/default/default';
import { NotFound } from '../pages/not-found/not-found';
import { Overlay } from '../overlay/overlay';
import { Modal } from '../modal/modal';
import { LoginForm } from '../forms/login/login';
import { ShiftForm } from '../forms/shift/shift';
import { AddWorkerForm } from '../forms/add-worker/add-worker.form';
import { Logout } from '../loguot/logout';
import { Delete } from '../delete/delete';

import { ProtectedRoute } from '../protected-route/protected-route';

import { checkAccessToken } from '../../services/slices/auth/actions';
import { useDispatch } from '../../services/store';
import { UpdateWorkerForm } from '../forms/update-worker/update-worker.form';
import { ModalInfoBlock } from '../modal-info-block/modal-info-block';
import { HomeShift } from '../pages/home-shift/home-shift';

import { Shipment } from '../pages/shipment/shipment';
import { Pack } from '../pages/pack/pack';
import { Residue } from '../pages/residue/residue';
import { Fix } from '../pages/fix/fix';
import { ProductionForm } from '../forms/production/production.form';
import { ShipmentForm } from '../forms/shipment/shipment.form';
import { Production } from '../pages/production/production';
import { PackForm } from '../forms/pack/pack.form';
import { FixForm } from '../forms/fix/fix.form';
import { ResidueForm } from '../forms/residue/residue.form';
import { Footer } from '../footer/footer';

const App = () => {
  const { isLightTheme } = useContext(ThemeContext);
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
    isResidueOpenMdal,
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
        isLightTheme ? 'theme-light' : 'theme-dark',
        isOpenOverlay && styles.container__fixed,
      )}
    >
      <Header />
      <Banner />
      <Routes>
        <Route path="/" element={<DefaultPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/home/shifts/:shiftId" element={<HomeShift />} />
          <Route path="/timesheet" element={<Timesheet />} />
          <Route path="/production" element={<Production />} />
          <Route path="/shipment" element={<Shipment />} />
          <Route path="/pack" element={<Pack />} />
          <Route path="/fix" element={<Fix />} />
          <Route path="/residue" element={<Residue />} />
        </Route>
        <Route path="*" element={<NotFound />} />
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

      {isResidueOpenMdal && (
        <Modal>
          <ResidueForm />
        </Modal>
      )}

      {isDeleteOpenModall && (
        <Modal>
          <Delete />
        </Modal>
      )}

      {isLogoutOpenModal && (
        <Modal>
          <Logout />
        </Modal>
      )}

      {isUserShiftInfoOpenModal && (
        <Modal>
          <ModalInfoBlock />
        </Modal>
      )}
    </div>
  );
};

export default App;
