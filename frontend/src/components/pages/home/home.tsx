import styles from './home.module.css';

import { useEffect } from 'react';

import { Layout } from '../../ui/layout/layout';
import { InfoBlock } from '../../ui/info-block/info-block';
import { ResidueChart } from '../../charts/residue-chart/residue-chart';
import { EmptyCard } from '../../ui/empty-card/empty-card';
import { ShiftCard } from '../../ui/shift-card/shift-card';
import { SickInfo } from '../../sick-info/sick-info';
import { ProfessionInfo } from '../../profession-info/profession-info';

import { useDispatch, useSelector } from '../../../services/store';

import {
  selectActiveShift,
  selectFinishedShift,
} from '../../../services/slices/shift/slice';

import {
  getActiveShift,
  getFinishedShift,
} from '../../../services/slices/shift/actions';

import { TShiftStatus } from '../../../utils/types';

export const Home = () => {
  const dispatch = useDispatch();

  const activeShift = useSelector(selectActiveShift);
  const finishedShift = useSelector(selectFinishedShift);

  const active: TShiftStatus = 'активная';
  const finished: TShiftStatus = 'завершённая';

  useEffect(() => {
    dispatch(getActiveShift());
    dispatch(getFinishedShift());
  }, []);

  return (
    <Layout>
      <InfoBlock
        className={styles.title__bottom}
        title={'Структурное подразделение'}
        text={'ЛПЦ-11 ПАО ММК'}
      />
      {finishedShift && (
        <ResidueChart shiftId={finishedShift.id ?? ''} shiftStatus={finished} />
      )}
      {/* {activeShift && <ResidueChart shiftId={activeShift.id ?? ''} />} */}
      {!activeShift ? (
        <EmptyCard type={active} text={'Идет планирование...'} />
      ) : (
        <ShiftCard
          id={activeShift.id ?? ''}
          date={activeShift.date}
          shiftNumber={activeShift.shiftNumber}
          teamNumber={activeShift.teamNumber}
          type={active}
        />
      )}

      {!finishedShift ? (
        <EmptyCard type={finished} text={'Нет данных...'} />
      ) : (
        <ShiftCard
          id={finishedShift.id ?? ''}
          date={finishedShift.date}
          shiftNumber={finishedShift.shiftNumber}
          teamNumber={finishedShift.teamNumber}
          type={finished}
        />
      )}

      <ProfessionInfo />
      <SickInfo />
    </Layout>
  );
};
