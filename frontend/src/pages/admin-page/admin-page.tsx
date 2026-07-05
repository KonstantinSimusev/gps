import { useContext, useEffect } from 'react';

import { useSelector } from '../../services/store';
import { selectProfile } from '../../services/slices/auth/slice';
import { selectSearсhEmployee } from '../../services/slices/employee/slice';

import { LayerContext } from '../../contexts/layer/layerContext';

import { MainLayout } from '../../components/ui/layouts/main/main-layout';
import { ProfileCard } from '../../components/cards/profile-card/profile-card';

import styles from './admin-page.module.css';

export const AdminPage = () => {
  const {
    setIsOverlayOpen,
    setIsEmployeeEditOpen,
    setIsEmployeeDeleteOpen,
    setIsPasswordUpdateOpen,
    setSelectedId,
  } = useContext(LayerContext);
  
  const profile = useSelector(selectProfile);
  const employee = useSelector(selectSearсhEmployee);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  const updateProfile = () => {
    if (!employee) {
      return;
    }

    setSelectedId(employee.id);
    setIsOverlayOpen(true);
    setIsEmployeeEditOpen(true);
  };

  const updatePassword = () => {
    if (!employee) {
      return;
    }

    if (employee.isActive === true) {
      setSelectedId(employee.id);
      setIsOverlayOpen(true);
      setIsPasswordUpdateOpen(true);
    }
  };

  const deleteProfile = () => {
    if (!employee) {
      return;
    }

    setSelectedId(employee.id);
    setIsOverlayOpen(true);
    setIsEmployeeDeleteOpen(true);
  };

  return (
    <MainLayout className={styles.container}>
      {employee && (
        <ProfileCard
          employee={employee}
          profile={profile}
          onUpdateProfile={updateProfile}
          onUpdatePassword={updatePassword}
          onDeleteProfile={deleteProfile}
        />
      )}
    </MainLayout>
  );
};
