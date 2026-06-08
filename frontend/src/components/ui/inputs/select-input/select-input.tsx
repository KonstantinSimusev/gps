import clsx from 'clsx';

import { DownIcon } from '../../icons/down/down';
import styles from './select-input.module.css';

interface IInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  value?: string;
  error?: string;
  className?: string;
}

export const SelectInput = ({
  label,
  options,
  value,
  error,
  className,
  ...props
}: IInputProps) => {
  return (
    <div className={clsx(styles.container, className)}>
      <label className={styles.label}>{label}</label>
      <div className={styles.wrapper}>
        <select className={styles.select} {...props} value={value}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <DownIcon />
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
