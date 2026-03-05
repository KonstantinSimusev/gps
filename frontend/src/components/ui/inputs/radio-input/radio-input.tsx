import clsx from 'clsx';
import styles from './radio-input.module.css';

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  text?: string;
}

export const RadioInput = ({ className, text, ...props }: IInputProps) => {
  return (
    <label className={clsx(styles.label, className)}>
      <input className={styles.visually_hidden} {...props} />
      <span className={styles.input__custom}></span>
      <span className={styles.input__text}>{text}</span>
    </label>
  );
};
