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
  isEmployeeDeleteOpen: boolean;

  selectedId: string;
  selectedScrollPosition: number;

  setIsAgreed: (value: boolean) => void;
  setIsOverlayOpen: (value: boolean) => void;
  setIsMenuOpen: (value: boolean) => void;
  setIsLoginOpen: (value: boolean) => void;
  setIsLogoutOpen: (value: boolean) => void;
  setIsEmployeeSearchOpen: (value: boolean) => void;
  setIsEmployeeCreateOpen: (value: boolean) => void;
  setIsEmployeeEditOpen: (value: boolean) => void;
  setIsEmployeeDeleteOpen: (value: boolean) => void;

  setSelectedId: (value: string) => void;
  setSelectedScrollPosition: (value: number) => void;
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
  isEmployeeDeleteOpen: false,

  selectedId: '',
  selectedScrollPosition: 0,

  setIsAgreed: () => {},
  setIsOverlayOpen: () => {},
  setIsMenuOpen: () => {},
  setIsLoginOpen: () => {},
  setIsLogoutOpen: () => {},
  setIsEmployeeSearchOpen: () => {},
  setIsEmployeeCreateOpen: () => {},
  setIsEmployeeEditOpen: () => {},
  setIsEmployeeDeleteOpen: () => {},

  setSelectedId: () => {},
  setSelectedScrollPosition: () => {},
});
