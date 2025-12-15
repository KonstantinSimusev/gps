import styles from './user-block.module.css';

interface IUserBlockProps {
  lastName: string;
  firstName: string;
  patronymic: string;
}

export const UserBlock = ({
  lastName,
  firstName,
  patronymic,
}: IUserBlockProps) => {
  return (
    <div className={styles.container}>
      <span className={styles.text}>{lastName}</span>
      <span className={styles.text}>{firstName}</span>
      <span className={styles.text}>{patronymic}</span>
    </div>
  );
};
