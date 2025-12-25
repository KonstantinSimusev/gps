import styles from './report-button.module.css';

import clsx from 'clsx';

interface IProps {
  className?: string;
  text: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isDownloading?: boolean;
}

export const ReportButton = ({
  className,
  text,
  onClick,
  isDownloading,
}: IProps) => {
  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick(e);
  };

  return (
    <button
      className={clsx(styles.container, className)}
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {text}
    </button>
  );
};
