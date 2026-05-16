import clsx from 'clsx';

import styles from './button.module.css';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}

export const Button = ({ children, className, ...rest }: IButtonProps) => {
  return (
    <button
      className={clsx(
        styles.button,
        className,
        rest.disabled && styles.button_disabled,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
