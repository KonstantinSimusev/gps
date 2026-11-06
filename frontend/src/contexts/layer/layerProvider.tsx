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
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(false);
  const [isPasswordUpdateOpen, setIsPasswordUpdateOpen] = useState(false);
  const [isShiftSearchOpen, setIsShiftSearchOpen] = useState(false);
  const [isEmployeeAddOpen, setIsEmployeeAddOpen] = useState(false);
  const [isEmployeeShiftEditOpen, setIsEmployeeShiftEditOpen] = useState(false);
  const [isEmployeeShiftDeleteOpen, setIsEmployeeShiftDeleteOpen] =
    useState(false);

  const [selectedId, setSelectedId] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
      isAccountInfoOpen,
      isPasswordUpdateOpen,
      isShiftSearchOpen,
      isEmployeeAddOpen,
      isEmployeeShiftEditOpen,
      isEmployeeShiftDeleteOpen,

      selectedId,
      selectedDate,

      setIsAgreed,
      setIsOverlayOpen,
      setIsMenuOpen,
      setIsLoginOpen,
      setIsLogoutOpen,
      setIsEmployeeSearchOpen,
      setIsEmployeeCreateOpen,
      setIsEmployeeEditOpen,
      setIsAccountInfoOpen,
      setIsPasswordUpdateOpen,
      setIsShiftSearchOpen,
      setIsEmployeeAddOpen,
      setIsEmployeeShiftEditOpen,
      setIsEmployeeShiftDeleteOpen,

      setSelectedId,
      setSelectedDate,
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
      isAccountInfoOpen,
      isPasswordUpdateOpen,
      isShiftSearchOpen,
      isEmployeeAddOpen,
      isEmployeeShiftEditOpen,
      isEmployeeShiftDeleteOpen,

      selectedId,
      selectedDate,
    ],
  );

  return (
    <LayerContext.Provider value={value}>{children}</LayerContext.Provider>
  );
};
