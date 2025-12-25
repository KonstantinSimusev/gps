import styles from './pack-chart.module.css';

import { Error } from '../../ui/error/error';
import { Border } from '../../ui/border/border';

import { IShift, IUserShift } from '../../../utils/api.interface';

import {
  countProfessionsByAttendance,
  filterAndSortProfessions,
  filterWorkers,
  getCount,
  getPackerStats,
  transformLocations,
} from '../../../utils/utils';
import { TShiftStatus } from '../../../utils/types';
import { ShiftDate } from '../../ui/shift-date/shift-date';
import { ShiftStatus } from '../../ui/shift-status/shift-status';
import { ColumnWrapper } from '../../ui/wrappers/column/column';
import { HeaderWrapper } from '../../ui/wrappers/header-wrapper/header-wrapper';
import { Location } from '../../ui/location/location';
import { Chart } from '../../ui/chart/chart';

interface IChartProps {
  shift: IShift;
  list: IUserShift[];
  shiftStatus: 'активная' | 'завершённая';
  date: Date;
  shiftNumber: number;
  teamNumber: number;
}

export const PackChart = ({
  shift,
  list,
  shiftStatus,
  date,
  shiftNumber,
  teamNumber,
}: IChartProps) => {
  const packs = shift.packs;

  const finishedStatusShift: TShiftStatus = 'завершённая';

  // 1. Проверяем, что shipments не undefined
  const total = packs
    ? packs
        .filter((item) => item.location === '2 ОЧЕРЕДЬ')
        .reduce((sum, item) => sum + item.count, 0)
    : 0; // значение по умолчанию, если shipments === undefined

  const transformArray = transformLocations(packs ?? []);

  const workersShifts = filterWorkers(list);
  const packerLocations = getPackerStats(workersShifts);
  const attendanceProfessions = countProfessionsByAttendance(workersShifts);
  const filterArrayByLum = filterAndSortProfessions(attendanceProfessions);

  return (
    <>
      {shiftStatus === finishedStatusShift && (
        <div className={styles.container}>
          {!shift ? (
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
                  <Location title={'УПАКОВКА'} />
                  <ShiftStatus status={shiftStatus} />
                </ColumnWrapper>
              </HeaderWrapper>

              <Chart list={transformArray} titleField={'location'} />

              <div className={styles.wrapper__count}>
                <div className={styles.wrapper__footer}>
                  <span className={styles.total__size}>2 ОЧ + ЛУМ:</span>
                  <span className={styles.total__size}>{total} рул</span>
                </div>

                <div className={styles.wrapper__footer}>
                  <span className={styles.total__size}>Итого за смену:</span>
                  <span className={styles.total__size}>
                    {getCount(packs ?? [])} рул
                  </span>
                </div>
              </div>

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
        </div>
      )}
    </>
  );
};
