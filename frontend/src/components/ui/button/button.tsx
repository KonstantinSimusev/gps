import clsx from 'clsx';
import styles from './button.module.css';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  // label?: string;
  children?: React.ReactNode;
}

export const Button = ({ children, className, ...props }: IButtonProps) => {
  return (
    <button
      className={clsx(
        styles.button,
        className,
        props.disabled && styles.button_disabled,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
