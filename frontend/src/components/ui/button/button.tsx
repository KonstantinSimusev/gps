import styles from './button.module.css';

interface IButtonProps {
  label?: string;
  onClick?: () => void;
}

export const Button = ({ label, onClick }: IButtonProps) => {
  return (
    <button className={styles.container} type="button" onClick={onClick}>
      {label}
    </button>
  );
};
