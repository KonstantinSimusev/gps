import clsx from 'clsx';
import styles from './switch.module.css';

interface IProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const Switch = ({ label, checked, onChange, className }: IProps) => {
  const handleChange = () => {
    onChange(!checked);
  };

  return (
    <div className={clsx(styles.container, className)}>
      {label && (
        <label className={clsx(styles.label, checked && styles.active)}>
          {label}
        </label>
      )}
      <div
        className={clsx(styles.toggle, checked && styles.checked)}
        onClick={handleChange}
      >
        <div className={styles.thumb} />
      </div>
    </div>
  );
};
