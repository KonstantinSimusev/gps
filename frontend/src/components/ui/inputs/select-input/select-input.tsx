import clsx from 'clsx';

import { DownIcon } from '../../icons/down/down';
import styles from './select-input.module.css';

interface IInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  label?: string;
  error?: string;
  options: string[];
}

export const SelectInput = ({
  className,
  label,
  error,
  options,
  ...props
}: IInputProps) => {
  return (
    <div className={clsx(styles.container, className)}>
      <label className={styles.label}>{label}</label>
      <div className={styles.wrapper}>
        <select className={styles.select} {...props}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <DownIcon />
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
