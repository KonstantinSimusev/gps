// import styles from './residue-chart.module.css';

import { useLocation } from 'react-router-dom';

import { ChartLayout } from '../../ui/layouts/chart/chart';
import { Chart } from '../../ui/chart/chart';
import { Total } from '../../ui/total/total';
import { Location } from '../../ui/location/location';
import { ShiftStatus } from '../../ui/shift-status/shift-status';
import { ShiftDate } from '../../ui/shift-date/shift-date';
import { HeaderWrapper } from '../../ui/wrappers/header-wrapper/header-wrapper';
import { ColumnWrapper } from '../../ui/wrappers/column/column';

import { getCount } from '../../../utils/utils';
import { TShiftStatus } from '../../../utils/types';
import { IShift } from '../../../utils/api.interface';

interface IProps {
  shift: IShift;
}

export const ResidueChart = ({ shift }: IProps) => {
  // Отображаем только на главной странице
  const { pathname } = useLocation();
  const isHome = pathname === '/home';

  const finished: TShiftStatus = 'завершённая';

  return (
    <>
      {isHome && (
        <ChartLayout>
          <HeaderWrapper>
            <ShiftDate
              date={shift.date}
              shiftNumber={shift.shiftNumber}
              teamNumber={shift.teamNumber}
            />

            <ColumnWrapper>
              <Location title='ОСТАТКИ' />
              <ShiftStatus status={finished} />
            </ColumnWrapper>
          </HeaderWrapper>

          <Chart list={shift.residues ?? []} titleField='location' />

          <Total
            text='Итого:'
            count={getCount(shift.residues ?? [])}
            unit='рул'
          />
        </ChartLayout>
      )}
    </>
  );
};
