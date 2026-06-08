import clsx from 'clsx';
import styles from './text-input.module.css';

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: string;
  placeholder?: string;
  error?: string;
  className?: string;
}

export const TextInput = ({
  label,
  value,
  placeholder = 'Введите текст',
  error,
  className,
  ...props
}: IInputProps) => {
  return (
    <div className={clsx(styles.container, className)}>
      <label className={styles.label}>{label}</label>
      <input
        className={styles.input}
        {...props}
        value={value}
        placeholder={placeholder}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
