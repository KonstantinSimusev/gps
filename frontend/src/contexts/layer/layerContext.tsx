import { createContext } from 'react';

interface ILayerContextValue {
  isAgreed: boolean;
  isOverlayOpen: boolean;
  isMenuOpen: boolean;
  isLoginOpen: boolean;
  isLogoutOpen: boolean;
  isEmployeeSearchOpen: boolean;
  isEmployeeCreateOpen: boolean;
  isEmployeeEditOpen: boolean;
  isAccountInfoOpen: boolean;
  isPasswordUpdateOpen: boolean;
  isShiftSearchOpen: boolean;
  isEmployeeAddOpen: boolean;
  isEmployeeShiftEditOpen: boolean;
  isEmployeeShiftDeleteOpen: boolean;

  selectedId: string;
  selectedDate: string | null;

  setIsAgreed: (value: boolean) => void;
  setIsOverlayOpen: (value: boolean) => void;
  setIsMenuOpen: (value: boolean) => void;
  setIsLoginOpen: (value: boolean) => void;
  setIsLogoutOpen: (value: boolean) => void;
  setIsEmployeeSearchOpen: (value: boolean) => void;
  setIsEmployeeCreateOpen: (value: boolean) => void;
  setIsEmployeeEditOpen: (value: boolean) => void;
  setIsAccountInfoOpen: (value: boolean) => void;
  setIsPasswordUpdateOpen: (value: boolean) => void;
  setIsShiftSearchOpen: (value: boolean) => void;
  setIsEmployeeAddOpen: (value: boolean) => void;
  setIsEmployeeShiftEditOpen: (value: boolean) => void;
  setIsEmployeeShiftDeleteOpen: (value: boolean) => void;

  setSelectedId: (value: string) => void;
  setSelectedDate: (value: string | null) => void;
}

export const LayerContext = createContext<ILayerContextValue>({
  isAgreed: false,
  isOverlayOpen: false,
  isMenuOpen: false,
  isLoginOpen: false,
  isLogoutOpen: false,
  isEmployeeSearchOpen: false,
  isEmployeeCreateOpen: false,
  isEmployeeEditOpen: false,
  isAccountInfoOpen: false,
  isPasswordUpdateOpen: false,
  isShiftSearchOpen: false,
  isEmployeeAddOpen: false,
  isEmployeeShiftEditOpen: false,
  isEmployeeShiftDeleteOpen: false,

  selectedId: '',
  selectedDate: null,

  setIsAgreed: () => {},
  setIsOverlayOpen: () => {},
  setIsMenuOpen: () => {},
  setIsLoginOpen: () => {},
  setIsLogoutOpen: () => {},
  setIsEmployeeSearchOpen: () => {},
  setIsEmployeeCreateOpen: () => {},
  setIsEmployeeEditOpen: () => {},
  setIsAccountInfoOpen: () => {},
  setIsPasswordUpdateOpen: () => {},
  setIsShiftSearchOpen: () => {},
  setIsEmployeeAddOpen: () => {},
  setIsEmployeeShiftEditOpen: () => {},
  setIsEmployeeShiftDeleteOpen: () => {},

  setSelectedId: () => {},
  setSelectedDate: () => {},
});
