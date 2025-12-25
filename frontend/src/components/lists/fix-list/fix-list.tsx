import styles from './fix-list.module.css';

import { EditButton } from '../../buttons/edit/edit';
import { InfoBlock } from '../../ui/info-block/info-block';

import { IFix } from '../../../utils/api.interface';

interface IProps {
  list: IFix[];
}

export const FixList = ({ list }: IProps) => {
  return (
    <ul className={styles.container}>
      {list.map((item) => (
        <li key={item.id} className={styles.item}>
          <div className={styles.wrapper__header}>
            <h5 className={styles.location}>{item.location}</h5>
            <EditButton
              id={item.id}
              actionType='fix'
              iconWidth={30}
              iconHeight={30}
            />
          </div>

          <InfoBlock title='№ тупика в цехе' text={`${item.railway}`} />
          <InfoBlock title='Раскрепление за смену' text={`${item.count} ваг`} />
        </li>
      ))}
    </ul>
  );
};
