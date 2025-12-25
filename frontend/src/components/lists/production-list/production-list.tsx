import styles from './production-list.module.css';

import { EditButton } from '../../buttons/edit/edit';
import { InfoBlock } from '../../ui/info-block/info-block';

import { IProduction } from '../../../utils/api.interface';

import { formatProductionUnit } from '../../../utils/utils';

interface IProps {
  list: IProduction[];
}

export const ProductionList = ({ list }: IProps) => {
  return (
    <ul className={styles.container}>
      {list.map((item) => (
        <li key={item.id} className={styles.item}>
          <div className={styles.wrapper__header}>
            <h5 className={styles.location}>{item.location}</h5>
            <EditButton
              id={item.id}
              actionType='production'
              iconWidth={30}
              iconHeight={30}
            />
          </div>

          <InfoBlock
            title='Оборудование в цехе'
            text={formatProductionUnit(item.unit)}
          />

          <InfoBlock title='Производство за смену' text={`${item.count} рул`} />
        </li>
      ))}
    </ul>
  );
};
