import { useRef } from 'react';
import clsx from 'clsx';

import { CloseIcon } from '../../icons/close/close';
import styles from './text-input.module.css';

interface IProps {
  type: string;
  name: string;
  label?: string;
  placeholder?: string;
  value: string;
  error?: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  autoFocus?: boolean;
}

export const TextInput = ({
  type,
  name,
  label,
  placeholder,
  value,
  error,
  className,
  autoFocus,
  onBlur,
  onChange,
}: IProps) => {
  const hasValue = !!value;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClear = () => {
    // 1. Вызываем onChange с пустым значением
    onChange?.({
      target: { name, value: '' },
    } as React.ChangeEvent<HTMLInputElement>);

    // 2. Возвращаем фокус в инпут
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={clsx(styles.container, className)}>
      <label className={styles.label}>{label}</label>
      <div className={styles.wrapper}>
        <input
          ref={inputRef}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          className={styles.input}
          autoFocus={autoFocus}
          onBlur={onBlur}
          onChange={onChange}
        />

        {hasValue && (
          <button
            type='button'
            className={styles.clear__button}
            onClick={handleClear}
          >
            <CloseIcon />
          </button>
        )}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
