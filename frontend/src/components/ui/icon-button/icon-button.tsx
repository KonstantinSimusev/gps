import styles from './icon-button.module.css';

interface IIconButtonProps {
  children?: React.ReactElement;
  iconWidth?: number | string;
  iconHeight?: number | string;
  onClick?: () => void;
}

export const IconButton = ({
  children,
  iconWidth,
  iconHeight,
  onClick,
}: IIconButtonProps) => {
  return (
    <button
      className={styles.container}
      style={{ width: iconWidth, height: iconHeight }}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
