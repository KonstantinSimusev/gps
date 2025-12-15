import styles from './succes.module.css';

interface ISuccessIconProps {
  width?: number | string;
  height?: number | string;
}

export const SuccessIcon = ({ width = 20, height = 20 }: ISuccessIconProps) => {
  return (
    <svg
      className={styles.icon}
      width={width}
      height={height}
      viewBox="0 0 36 36"
    >
      <path
        d="M13.72 27.69 3.29 17.27a1 1 0 0 1 1.41-1.41l9 9L31.29 7.29A1 1 0 0 1 32.7 8.7Z"
        className="clr-i-outline clr-i-outline-path-1"
      />
    </svg>
  );
};
