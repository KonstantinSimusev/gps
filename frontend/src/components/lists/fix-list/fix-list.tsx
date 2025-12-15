import styles from './fix-list.module.css';

import { useEffect } from 'react';

import { EditButton } from '../../buttons/edit/edit';
import { Error } from '../../ui/error/error';
import { InfoBlock } from '../../ui/info-block/info-block';

import { useDispatch, useSelector } from '../../../services/store';
import { selectFixs } from '../../../services/slices/fix/slice';
import { getFixs } from '../../../services/slices/fix/actions';

interface IListProps {
  shiftId?: string;
}

export const FixList = ({ shiftId }: IListProps) => {
  const dispatch = useDispatch();
  const fixs = useSelector(selectFixs);

  if (!shiftId) {
    return <Error />;
  }

  useEffect(() => {
    dispatch(getFixs(shiftId));
  }, []);

  return (
    <ul className={styles.container}>
      {fixs.length > 0 ? (
        fixs.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.wrapper__header}>
              <h5 className={styles.location}>{item.location}</h5>
              <EditButton
                id={item.id}
                actionType="fix"
                iconWidth={30}
                iconHeight={30}
              />
            </div>

            <InfoBlock title={'№ тупика в цехе'} text={`${item.railway}`} />
            <InfoBlock
              title={'Раскрепление за смену'}
              text={`${item.count} ваг`}
            />
          </li>
        ))
      ) : (
        <Error />
      )}
    </ul>
  );
};
