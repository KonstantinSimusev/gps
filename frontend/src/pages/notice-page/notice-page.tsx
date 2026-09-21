import { useEffect } from 'react';

import { mockMessages } from '../../utils/mocks';

// import { useDispatch } from '../../services/store';

import { MainLayout } from '../../components/ui/layouts/main/main-layout';
import { NoticeList } from '../../components/lists/notice-list/notice-list';

// import styles from './notice-page.module.css';

export const NoticePage = () => {
  // const dispatch = useDispatch();

  const messages = mockMessages;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    (async () => {
      // await dispatch(getMessages());
    })();
  }, []);

  return (
    <MainLayout>
      <NoticeList messages={messages} />
    </MainLayout>
  );
};
