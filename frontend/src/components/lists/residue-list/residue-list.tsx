import styles from './residue-list.module.css';

import { useEffect } from 'react';

import { EditButton } from '../../buttons/edit/edit';
import { Error } from '../../ui/error/error';
import { InfoBlock } from '../../ui/info-block/info-block';

import { useDispatch, useSelector } from '../../../services/store';
import { selectResidues } from '../../../services/slices/residue/slice';
import { getResidues } from '../../../services/slices/residue/actions';

interface IListProps {
  shiftId?: string;
}

export const ResidueList = ({ shiftId }: IListProps) => {
  const dispatch = useDispatch();
  const residues = useSelector(selectResidues);

  const filterArray = residues
    .filter((residue) => residue.area === 'ВЛРТ')
    .map((residue) => ({ ...residue, area: 'Воллерт' }));

  if (!shiftId) {
    return <Error />;
  }

  useEffect(() => {
    dispatch(getResidues(shiftId));
  }, []);

  return (
    <ul className={styles.container}>
      {filterArray.length > 0 ? (
        filterArray.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.wrapper__header}>
              <h5 className={styles.location}>{item.location}</h5>
              <EditButton
                id={item.id}
                actionType="residue"
                iconWidth={30}
                iconHeight={30}
              />
            </div>

            <InfoBlock title={'Участок в цехе'} text={`${item.area}`} />
            <InfoBlock
              title={'Остаток на конец смены'}
              text={`${item.count} рул`}
            />
          </li>
        ))
      ) : (
        <Error />
      )}
    </ul>
  );
};
