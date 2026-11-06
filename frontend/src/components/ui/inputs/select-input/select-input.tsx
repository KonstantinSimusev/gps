import clsx from 'clsx';

import { DownIcon } from '../../icons/down/down';
import styles from './select-input.module.css';

interface IProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void; // FocusEvent — правильно для onBlur
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void; // ChangeEvent — правильно для onChange
}

export const SelectInput = ({
  name,
  label,
  options,
  value,
  onBlur,
  onChange,
  error,
  className,
  disabled = false,
}: IProps) => {
  const isEmpty = !value;

  return (
    <div className={clsx(styles.container, className)}>
      <label className={styles.label}>{label}</label>
      <div className={styles.wrapper}>
        <select
          className={clsx(styles.select, isEmpty && styles.empty)}
          name={name}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          disabled={disabled}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className={styles.arrow}>
          <DownIcon />
        </div>
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
