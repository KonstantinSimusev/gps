import { useContext, useEffect } from 'react';

import { LayerContext } from '../../contexts/layer/layerContext';

import { useSelector } from '../../services/store';
import { selectProfile } from '../../services/slices/auth/slice';
import { selectSearсhEmployee } from '../../services/slices/employee/slice';

import { MainLayout } from '../../components/ui/layouts/main/main-layout';
import { ProfileCard } from '../../components/cards/profile-card/profile-card';
import { IconButton } from '../../components/ui/icon-button/icon-button';
import { AddIcon } from '../../components/ui/icons/add/add';
import { SearchIcon } from '../../components/ui/icons/search/search';

import styles from './admin.module.css';

export const Admin = () => {
  const {
    setIsOverlayOpen,
    setIsEmployeeSearchOpen,
    setIsEmployeeCreateOpen,
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

  const createEmployee = () => {
    setIsOverlayOpen(true);
    setIsEmployeeCreateOpen(true);
  };

  const searchEmployee = () => {
    setIsOverlayOpen(true);
    setIsEmployeeSearchOpen(true);
  };

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
    <MainLayout>
      <div className={styles.container}>
        <IconButton type='button' onClick={createEmployee}>
          <AddIcon width={24} height={24} />
        </IconButton>

        <div className={styles.vertical__border}></div>

        <IconButton type='button' onClick={searchEmployee}>
          <SearchIcon width={22} height={22} />
        </IconButton>
      </div>

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
