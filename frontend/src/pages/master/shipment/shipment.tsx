import { useEffect } from 'react';
// import styles from './shipment.module.css';

export const Shipment = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  return <div>Hello</div>;
};
