import { useSelector } from '../../services/store';
import { selectProfile } from '../../services/slices/auth/slice';

import { MainLayout } from '../../components/ui/layouts/main/main-layout';

// import styles from './home-page.module.css';

export const HomePage = () => {
  const profile = useSelector(selectProfile);

  if (profile === null) {
    return null;
  }

  return (
    <MainLayout>
      <p>Здравствуйте, {profile.firstName}!</p>
    </MainLayout>
  );
};
