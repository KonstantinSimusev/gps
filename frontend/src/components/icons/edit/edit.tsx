import styles from './edit.module.css';

interface IEditIconProps {
  width?: number | string;
  height?: number | string;
}

export const EditIcon = ({ width = 20, height = 20 }: IEditIconProps) => {
  return (
    <svg
      className={styles.icon}
      width={width}
      height={height}
      viewBox="0 0 24 24"
    >
      <path
        d="M15.137 3.47a.75.75 0 0 0-1.06 0l-9.193 9.192a.75.75 0 0 0-.195.34l-1 3.83a.75.75 0 0 0 .915.915l3.828-1a.75.75 0 0 0 .341-.196l9.192-9.192a.75.75 0 0 0 0-1.06zM6.088 13.579l8.519-8.518 1.767 1.767-8.518 8.519-2.393.625z"
        clipRule="evenodd"
      />
      <path d="M4 19.25a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5z" />
    </svg>
  );
};
