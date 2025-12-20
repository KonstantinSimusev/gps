import styles from './pack-list.module.css';

import { useEffect } from 'react';

import { EditButton } from '../../buttons/edit/edit';
import { Error } from '../../ui/error/error';
import { InfoBlock } from '../../ui/info-block/info-block';

import { useDispatch, useSelector } from '../../../services/store';
import { selectPacks } from '../../../services/slices/pack/slice';
import { getPacks } from '../../../services/slices/pack/actions';
import { Loader } from '../../ui/loader/loader';

interface IListProps {
  shiftId?: string;
}

export const PackList = ({ shiftId }: IListProps) => {
  const dispatch = useDispatch();
  const packs = useSelector(selectPacks);

  const sortedData = [...packs].sort((a, b) => {
    const locA = a.location ?? '';
    const locB = b.location ?? '';
    return locA.localeCompare(locB);
  });

  if (!shiftId) {
    return <Error />;
  }

  useEffect(() => {
    dispatch(getPacks(shiftId));
  }, []);

  return (
    <ul className={styles.container}>
      {sortedData.length > 0 ? (
        sortedData.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.wrapper__header}>
              <h5 className={styles.location}>{item.location}</h5>
              <EditButton
                id={item.id}
                actionType="pack"
                iconWidth={30}
                iconHeight={30}
              />
            </div>

            <InfoBlock title={'Участок в цехе'} text={`${item.area}`} />
            <InfoBlock title={'Упаковка за смену'} text={`${item.count} рул`} />
          </li>
        ))
      ) : (
        <Loader />
      )}
    </ul>
  );
};
