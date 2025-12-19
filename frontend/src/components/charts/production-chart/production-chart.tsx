import styles from './production-chart.module.css';

import { useEffect } from 'react';

import { Error } from '../../ui/error/error';
import { Border } from '../../ui/border/border';

import { useDispatch, useSelector } from '../../../services/store';

// import { ShiftStatus } from '../../ui/shift-status/shift-status';

import { selectProductions } from '../../../services/slices/production/slice';
import { getProductions } from '../../../services/slices/production/actions';

import { IUserShift } from '../../../utils/api.interface';

import { TShiftStatus } from '../../../utils/types';

import {
  countProfessionsByAttendance,
  filterAndSortProfessions,
  filterWorkers,
  getCount,
  getPackerStats,
} from '../../../utils/utils';
import { ShiftDate } from '../../ui/shift-date/shift-date';
import { Location } from '../../ui/location/location';
import { HeaderWrapper } from '../../ui/wrappers/header/header';
import { ColumnWrapper } from '../../ui/wrappers/column/column';
import { Chart } from '../../ui/chart/chart';
import { ShiftStatus } from '../../ui/shift-status/shift-status';
import { Total } from '../../ui/total/total';
import { CountWrapper } from '../../ui/wrappers/count-wrapper/count-wrapper';

interface IChartProps {
  shiftId: string;
  list: IUserShift[];
  shiftStatus: 'активная' | 'завершённая';
  date: Date;
  shiftNumber: number;
  teamNumber: number;
}

export const ProductionChart = ({
  shiftId,
  list,
  shiftStatus,
  date,
  shiftNumber,
  teamNumber,
}: IChartProps) => {
  const dispatch = useDispatch();

  const productions = useSelector(selectProductions);

  const activeStatusShift: TShiftStatus = 'активная';

  const workersShifts = filterWorkers(list);
  const packerLocations = getPackerStats(workersShifts);
  const attendanceProfessions = countProfessionsByAttendance(workersShifts);
  const filterArrayByLum = filterAndSortProfessions(attendanceProfessions);

  const productionTotal = productions
    .filter((item) => item.location === '2 ОЧЕРЕДЬ')
    .reduce((sum, item) => sum + item.count, 0);

  // Фиксированная максимальная высота столбца — 300px
  // const FIXED_MAX_HEIGHT = 60;

  useEffect(() => {
    if (shiftId) {
      dispatch(getProductions(shiftId));
    }
  }, [shiftId]);

  return (
    <div className={styles.container}>
      {!shiftId ? (
        <Error />
      ) : (
        <>
          <HeaderWrapper>
            <ShiftDate
              date={date}
              shiftNumber={shiftNumber}
              teamNumber={teamNumber}
            />
            <ColumnWrapper>
              <Location title={'ПРОИЗВОДСТВО'} />
              <ShiftStatus status={shiftStatus} />
            </ColumnWrapper>
          </HeaderWrapper>

          <Chart list={productions} titleField={'unit'} />

          <CountWrapper>
            <Total
              text={'АНГЦ + АНО + АИ:'}
              count={productionTotal}
              unit={'рул'}
            />
            <Total
              text={'Итого за смену:'}
              count={getCount(productions)}
              unit={'рул'}
            />
          </CountWrapper>

          {shiftStatus === activeStatusShift && (
            <>
              <div className={styles.worker__wrapper}>
                <div className={styles.title__wrapper}>
                  <span className={styles.worker__title}>Ручная упаковка</span>
                  <span className={styles.worker__title}>Чел</span>
                </div>
                <Border />
                <ul className={styles.worker__wrapper}>
                  {packerLocations.length > 0 ? (
                    packerLocations.map((item, index) => (
                      <li className={styles.wrapper} key={index}>
                        <span>{item.workplace}</span>
                        <span className={styles.worker__count}>
                          {item.count}
                        </span>
                      </li>
                    ))
                  ) : (
                    <span className={styles.empty}>Нет данных</span>
                  )}
                </ul>
                <Border />
                <div className={styles.total__wrapper}>
                  <span>Всего:</span>
                  <span>{getCount(packerLocations)}</span>
                </div>
              </div>

              <div className={styles.worker__wrapper}>
                <div className={styles.title__wrapper}>
                  <span className={styles.worker__title}>ЛУМ</span>
                  <span className={styles.worker__title}>Чел</span>
                </div>
                <Border />
                <ul className={styles.worker__wrapper}>
                  {filterArrayByLum.length > 0 ? (
                    filterArrayByLum.map((item, index) => (
                      <li className={styles.wrapper} key={index}>
                        <span>{item.profession}</span>
                        <span className={styles.worker__count}>
                          {item.count}
                        </span>
                      </li>
                    ))
                  ) : (
                    <span className={styles.empty}>Нет данных</span>
                  )}
                </ul>
                <Border />
                <div className={styles.total__wrapper}>
                  <span>Всего:</span>
                  <span>{getCount(filterArrayByLum)}</span>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
