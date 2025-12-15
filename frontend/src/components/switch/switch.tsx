import styles from './switch.module.css';

import { useContext } from 'react';
import { ThemeIcon } from '../icons/theme/theme';
import { ThemeContext } from '../../contexts/theme/themeContext';

export const Switch = () => {
  const { isLightTheme, setIsLightTheme } = useContext(ThemeContext);

  const toggleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Сохраняем новое состояние
    setIsLightTheme(e.target.checked);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <ThemeIcon />
      </div>
      <span className={styles.text}>Тёмная тема</span>
      <label className={styles.switch}>
        <input
          className={styles.input__hidden}
          type="checkbox"
          checked={isLightTheme}
          onChange={toggleTheme}
        />
        <span className={styles.switch__slider}></span>
      </label>
    </div>
  );
};
