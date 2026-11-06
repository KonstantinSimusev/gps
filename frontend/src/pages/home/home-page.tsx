import { useSelector } from '../../services/store';
import { selectProfile } from '../../services/slices/auth/slice';

import styles from './home-page.module.css';

export const HomePage = () => {
  const profile = useSelector(selectProfile);

  if (profile === null) {
    return null;
  }

  return <div className={styles.container}>Здравствуйте, {profile.firstName}!</div>;
};
