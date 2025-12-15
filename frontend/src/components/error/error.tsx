import styles from './error.module.css';

// import { useContext } from 'react';
// import { LayerContext } from '../../contexts/layer/layerContext';
import { ErrorIcon } from '../icons/error/error';

export const Error = () => {
  // const { setIsRegisterModalOpen, setIsErrorModalOpen } =
  //     useContext(LayerContext);
  
    // const handleClick = () => {
    //   setIsRegisterModalOpen(true);
    //   setIsErrorModalOpen(false);
    // };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <ErrorIcon />
      </div>
      <span className={styles.text}>Нет доступа к&nbsp;регистрации!</span>
      {/* <button
        className={styles.button__register}
        type="button"
        onClick={handleClick}
      >
        Зарегистрироваться?
      </button> */}
    </div>
  )
};
