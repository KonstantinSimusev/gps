import styles from './delete.module.css';

interface IDeleteIconProps {
  width?: number | string;
  height?: number | string;
}

export const DeleteIcon = ({ width = 20, height = 20 }: IDeleteIconProps) => {
  return (
    <svg
      className={styles.icon}
      width={width}
      height={height}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        d="M10 11v6M14 11v6M4 7h16M6 7h12v11a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3zM9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9z"
      />
    </svg>
  );
};
