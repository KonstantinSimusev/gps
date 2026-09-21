import styles from './error.module.css';

interface IProps {
  width?: number | string;
  height?: number | string;
}

export const ErrorIcon = ({ width = 40, height = 40 }: IProps) => {
  return (
    <svg
      className={styles.icon}
      width={width}
      height={height}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16.99V17m0-10v7"
      />
    </svg>
  );
};
