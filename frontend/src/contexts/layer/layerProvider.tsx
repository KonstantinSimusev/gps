import { useMemo, useState } from 'react';

import { LayerContext } from './layerContext';

interface TLayerProviderProps {
  children: React.ReactNode;
}

export const LayerProvider = ({ children }: TLayerProviderProps) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isEmployeeSearchOpen, setIsEmployeeSearchOpen] = useState(false);
  const [isEmployeeCreateOpen, setIsEmployeeCreateOpen] = useState(false);
  const [isEmployeeEditOpen, setIsEmployeeEditOpen] = useState(false);
  const [isEmployeeDeleteOpen, setIsEmployeeDeleteOpen] = useState(false);
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(false);
  const [isPasswordUpdateOpen, setIsPasswordUpdateOpen] = useState(false);
  const [isShiftAddOpen, setIsShiftAddOpen] = useState(false);
  const [isEmployeeAddOpen, setIsEmployeeAddOpen] = useState(false);
  const [isTimesheetEditOpen, setIsTimesheetEditOpen] = useState(false);

  const [selectedId, setSelectedId] = useState('');
  const [selectedScrollPosition, setSelectedScrollPosition] = useState(0);

  // Мемоизируем значение контекста
  const value = useMemo(
    () => ({
      isAgreed,
      isOverlayOpen,
      isMenuOpen,
      isLoginOpen,
      isLogoutOpen,
      isEmployeeSearchOpen,
      isEmployeeCreateOpen,
      isEmployeeEditOpen,
      isEmployeeDeleteOpen,
      isAccountInfoOpen,
      isPasswordUpdateOpen,
      isShiftAddOpen,
      isEmployeeAddOpen,
      isTimesheetEditOpen,

      selectedId,
      selectedScrollPosition,

      setIsAgreed,
      setIsOverlayOpen,
      setIsMenuOpen,
      setIsLoginOpen,
      setIsLogoutOpen,
      setIsEmployeeSearchOpen,
      setIsEmployeeCreateOpen,
      setIsEmployeeEditOpen,
      setIsEmployeeDeleteOpen,
      setIsAccountInfoOpen,
      setIsPasswordUpdateOpen,
      setIsShiftAddOpen,
      setIsEmployeeAddOpen,
      setIsTimesheetEditOpen,

      setSelectedId,
      setSelectedScrollPosition,
    }),
    [
      isAgreed,
      isOverlayOpen,
      isMenuOpen,
      isLoginOpen,
      isLogoutOpen,
      isEmployeeSearchOpen,
      isEmployeeCreateOpen,
      isEmployeeEditOpen,
      isEmployeeDeleteOpen,
      isAccountInfoOpen,
      isPasswordUpdateOpen,
      isShiftAddOpen,
      isEmployeeAddOpen,
      isTimesheetEditOpen,

      selectedId,
      selectedScrollPosition,
    ],
  );

  return (
    <LayerContext.Provider value={value}>{children}</LayerContext.Provider>
  );
};
