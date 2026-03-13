import { useMemo, useState } from 'react';
import { LayerContext } from './layerContext';
// import { IUser } from '../../utils/api.interface';

interface TLayerProviderProps {
  children: React.ReactNode;
}

export const LayerProvider = ({ children }: TLayerProviderProps) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [isOpenOverlay, setIsOpenOverlay] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutOpenModal, setIsLogoutOpenModal] = useState(false);
  const [isAddWorkerOpenModall, setIsAddWorkerOpenModall] = useState(false);
  const [isUpdateWorkerOpenModall, setIsUpdateWorkerOpenModall] =
    useState(false);
  const [isAddShiftOpenModall, setIsAddShiftOpenModall] = useState(false);
  const [isDeleteOpenModall, setIsDeleteOpenModall] = useState(false);
  const [isUserShiftInfoOpenModal, setIsUserShiftInfoOpenModal] =
    useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [selectedScrollPosition, setSelectedScrollPosition] = useState(0);
  const [selectedButtonActionType, setSelectedButtonActionType] = useState('');
  const [isProductionOpenMdal, setIsProductionOpenMdal] = useState(false);
  const [isShipmentOpenMdal, setIsShipmentOpenMdal] = useState(false);
  const [isPackOpenMdal, setIsPackOpenMdal] = useState(false);
  const [isFixOpenMdal, setIsFixOpenMdal] = useState(false);
  // const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  // Мемоизируем значение контекста
  const value = useMemo(
    () => ({
      isAgreed,
      isOpenOverlay,
      isOpenMenu,
      isOpenModal,
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
      selectedId,
      selectedScrollPosition,
      selectedButtonActionType,
      // selectedUser,
      setIsAgreed,
      setIsOpenOverlay,
      setIsOpenMenu,
      setIsOpenModal,
      setIsLoginModalOpen,
      setIsLogoutOpenModal,
      setIsAddWorkerOpenModall,
      setIsUpdateWorkerOpenModall,
      setIsAddShiftOpenModall,
      setIsDeleteOpenModall,
      setIsUserShiftInfoOpenModal,
      setIsProductionOpenMdal,
      setIsShipmentOpenMdal,
      setIsPackOpenMdal,
      setIsFixOpenMdal,
      setSelectedId,
      setSelectedScrollPosition,
      setSelectedButtonActionType,
      // setSelectedUser,
    }),
    [
      isAgreed,
      isOpenOverlay,
      isOpenMenu,
      isOpenModal,
      isLoginModalOpen,
      isLogoutOpenModal,
      isAddWorkerOpenModall,
      isUpdateWorkerOpenModall,
      isAddShiftOpenModall,
      isDeleteOpenModall,
      selectedId,
      selectedScrollPosition,
      selectedButtonActionType,
      // selectedUser,
    ],
  );

  return (
    <LayerContext.Provider value={value}>{children}</LayerContext.Provider>
  );
};
