import styles from './home.module.css';

import { MainLayout } from '../../ui/layouts/main/main-layout';
import { InfoBlock } from '../../ui/info-block/info-block';
import { ResidueChart } from '../../charts/residue-chart/residue-chart';
import { ActiveShiftCard } from '../../cards/active-shift-card/active-shift-card';
import { FinishedShiftCard } from '../../cards/finished-shift-card/finished-shift-card';
import { SickInfo } from '../../sick-info/sick-info';
import { ProfessionInfo } from '../../profession-info/profession-info';

export const Home = () => {
  return (
    <MainLayout>
      <InfoBlock
        className={styles.title__bottom}
        title={'Структурное подразделение'}
        text={'ЛПЦ-11 ПАО ММК'}
      />

      <ResidueChart />
      <ActiveShiftCard />
      <FinishedShiftCard />
      <ProfessionInfo />
      <SickInfo />
    </MainLayout>
  );
};
