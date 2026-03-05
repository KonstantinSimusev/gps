import clsx from 'clsx';
import styles from './form.module.css';

interface IFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  title?: string;
  className?: string;
  titleClassName?: string;
}

export const Form = ({
  children,
  title,
  className,
  titleClassName,
  ...props
}: IFormProps) => {
  // Функция для форматирования ФИО
  const renderTitle = (title: string | undefined): React.ReactNode => {
    if (!title) return null;

    const words = title
      .trim()
      .split(/\s+/)
      .filter((word) => word);

    // Если ровно 3 слова — вероятно, ФИО
    if (words.length === 3) {
      return (
        <>
          {words[0]} {words[1]}
          <br />
          {words[2]}
        </>
      );
    }

    // Иначе — просто текст
    return title;
  };
  return (
    <form className={clsx(styles.form, className)} {...props}>
      <h3 className={clsx(styles.title, titleClassName)}>
        {renderTitle(title)}
      </h3>
      {children}
    </form>
  );
};
