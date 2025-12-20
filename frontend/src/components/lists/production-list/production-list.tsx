import styles from './production-list.module.css';

import { EditButton } from '../../buttons/edit/edit';
import { InfoBlock } from '../../ui/info-block/info-block';
import { useDispatch, useSelector } from '../../../services/store';
import { selectProductions } from '../../../services/slices/production/slice';
import { useEffect } from 'react';
import { getProductions } from '../../../services/slices/production/actions';
import { formatProductionUnit } from '../../../utils/utils';
import { Loader } from '../../ui/loader/loader';
import { Error } from '../../error/error';

interface IProductionProps {
  shiftId?: string;
}

export const ProductionList = ({ shiftId }: IProductionProps) => {
  const dispatch = useDispatch();
  const productions = useSelector(selectProductions);

  if (!shiftId) {
    return <Error />;
  }

  useEffect(() => {
    dispatch(getProductions(shiftId));
  }, []);

  return (
    <ul className={styles.container}>
      {productions.length > 0 ? (
        productions.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.wrapper__header}>
              <h5 className={styles.location}>{item.location}</h5>
              <EditButton
                id={item.id}
                actionType="production"
                iconWidth={30}
                iconHeight={30}
              />
            </div>

            <InfoBlock
              title={'Оборудование в цехе'}
              text={formatProductionUnit(item.unit)}
            />
            <InfoBlock
              title={'Производство за смену'}
              text={`${item.count} рул`}
            />
          </li>
        ))
      ) : (
        <Loader />
      )}
    </ul>
  );
};
