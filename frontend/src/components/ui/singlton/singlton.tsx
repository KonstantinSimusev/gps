import styles from './singlton.module.css';

interface IProps {
  width?: number;
  height?: number;
}

export const Singlton = ({ width, height }: IProps) => {
  return (
    <div
      className={styles.container}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    ></div>
  );
};
