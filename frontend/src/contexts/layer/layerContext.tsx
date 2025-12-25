import { createContext } from 'react';
import { IUser } from '../../utils/api.interface';

interface ILayerContextValue {
  isOpenOverlay: boolean;
  isOpenMenu: boolean;
  isOpenModal: boolean;
  isLoginModalOpen: boolean;
  isLogoutOpenModal: boolean;
  isAddWorkerOpenModall: boolean;
  isUpdateWorkerOpenModall: boolean;
  isAddShiftOpenModall: boolean;
  isDeleteOpenModall: boolean;
  isUserShiftInfoOpenModal: boolean;
  isProductionOpenMdal: boolean;
  isShipmentOpenMdal: boolean;
  isPackOpenMdal: boolean;
  isFixOpenMdal: boolean;
  isResidueOpenMdal: boolean;
  isCookie: boolean;
  selectedId: string;
  selectedScrollPosition: number;
  selectedButtonActionType: string;
  selectedUser: IUser | null;
  setIsOpenOverlay: (value: boolean) => void;
  setIsOpenMenu: (value: boolean) => void;
  setIsOpenModal: (value: boolean) => void;
  setIsLoginModalOpen: (value: boolean) => void;
  setIsLogoutOpenModal: (value: boolean) => void;
  setIsAddWorkerOpenModall: (value: boolean) => void;
  setIsUpdateWorkerOpenModall: (value: boolean) => void;
  setIsAddShiftOpenModall: (value: boolean) => void;
  setIsDeleteOpenModall: (value: boolean) => void;
  setIsUserShiftInfoOpenModal: (value: boolean) => void;
  setIsProductionOpenMdal: (value: boolean) => void;
  setIsShipmentOpenMdal: (value: boolean) => void;
  setIsPackOpenMdal: (value: boolean) => void;
  setIsFixOpenMdal: (value: boolean) => void;
  setIsResidueOpenMdal: (value: boolean) => void;
  setIsCookie: (value: boolean) => void;
  setSelectedId: (value: string) => void;
  setSelectedScrollPosition: (value: number) => void;
  setSelectedButtonActionType: (value: string) => void;
  setSelectedUser: (value: IUser) => void;
}

export const LayerContext = createContext<ILayerContextValue>({
  isOpenOverlay: false,
  isOpenMenu: false,
  isOpenModal: false,
  isLoginModalOpen: false,
  isLogoutOpenModal: false,
  isAddWorkerOpenModall: false,
  isUpdateWorkerOpenModall: false,
  isAddShiftOpenModall: false,
  isDeleteOpenModall: false,
  isUserShiftInfoOpenModal: false,
  isProductionOpenMdal: false,
  isShipmentOpenMdal: false,
  isPackOpenMdal: false,
  isFixOpenMdal: false,
  isResidueOpenMdal: false,
  isCookie: false,
  selectedId: '',
  selectedScrollPosition: 0,
  selectedButtonActionType: '',
  selectedUser: null,
  setIsOpenOverlay: () => {},
  setIsOpenMenu: () => {},
  setIsOpenModal: () => {},
  setIsLoginModalOpen: () => {},
  setIsLogoutOpenModal: () => {},
  setIsAddWorkerOpenModall: () => {},
  setIsUpdateWorkerOpenModall: () => {},
  setIsAddShiftOpenModall: () => {},
  setIsDeleteOpenModall: () => {},
  setIsUserShiftInfoOpenModal: () => {},
  setIsProductionOpenMdal: () => {},
  setIsShipmentOpenMdal: () => {},
  setIsPackOpenMdal: () => {},
  setIsFixOpenMdal: () => {},
  setIsResidueOpenMdal: () => {},
  setIsCookie: () => {},
  setSelectedId: () => {},
  setSelectedScrollPosition: () => {},
  setSelectedButtonActionType: () => {},
  setSelectedUser: () => {},
});
