import clsx from 'clsx';
import styles from './checkbox-input.module.css';

interface ICheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  text?: string;
  className?: string;
}

export const CheckboxInput = ({
  className,
  text,
  ...props
}: ICheckboxProps) => {
  return (
    <label className={clsx(styles.label, className)}>
      <input type='checkbox' className={styles.visually_hidden} {...props} />
      <span className={styles.input__custom}></span>
      <span className={styles.input__text}>{text}</span>
    </label>
  );
};
