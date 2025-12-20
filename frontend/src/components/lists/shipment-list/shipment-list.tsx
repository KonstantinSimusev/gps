import styles from './shipment-list.module.css';

import { useEffect } from 'react';

import { EditButton } from '../../buttons/edit/edit';
import { Error } from '../../ui/error/error';
import { InfoBlock } from '../../ui/info-block/info-block';

import { useDispatch, useSelector } from '../../../services/store';
import { selectShipments } from '../../../services/slices/shipment/slice';
import { getShipments } from '../../../services/slices/shipment/actions';
import { Loader } from '../../ui/loader/loader';

interface IListProps {
  shiftId?: string;
}

export const ShipmentList = ({ shiftId }: IListProps) => {
  const dispatch = useDispatch();
  const shipments = useSelector(selectShipments);

  if (!shiftId) {
    return <Error />;
  }

  useEffect(() => {
    dispatch(getShipments(shiftId));
  }, []);

  return (
    <ul className={styles.container}>
      {shipments.length > 0 ? (
        shipments.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.wrapper__header}>
              <h5 className={styles.location}>{item.location}</h5>
              <EditButton
                id={item.id}
                actionType="shipment"
                iconWidth={30}
                iconHeight={30}
              />
            </div>

            <InfoBlock
              title={'№ тупика в цехе'}
              text={`${item.railway}`}
            />
            <InfoBlock
              title={'Отгрузка за смену'}
              text={`${item.count} ваг`}
            />
          </li>
        ))
      ) : (
        <Loader />
      )}
    </ul>
  );
};
