import styles from './pack-list.module.css';

import { EditButton } from '../../buttons/edit/edit';
import { InfoBlock } from '../../ui/info-block/info-block';

import { IPack } from '../../../utils/api.interface';

interface IProps {
  list: IPack[];
}

export const PackList = ({ list }: IProps) => {
  return (
    <ul className={styles.container}>
      {list.map((item) => (
        <li key={item.id} className={styles.item}>
          <div className={styles.wrapper__header}>
            <h5 className={styles.location}>{item.location}</h5>
            <EditButton
              id={item.id}
              actionType='pack'
              iconWidth={30}
              iconHeight={30}
            />
          </div>

          <InfoBlock title='Участок в цехе' text={`${item.area}`} />
          <InfoBlock title='Упаковка за смену' text={`${item.count} рул`} />
        </li>
      ))}
    </ul>
  );
};
