import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// import styles from './document-list-page.module.css';

export const DocumentListPage = () => {
  const navigate = useNavigate();
  const documentId = 1;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  const handleClick = () => {
    navigate(`/documents/${documentId}`);
  };

  return (
    <>
      <p onClick={handleClick}>Document List Page</p>
    </>
  );
};

