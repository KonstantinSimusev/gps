// import styles from './home.module.css';

// import { useEffect } from 'react';

// import { MainLayout } from '../../ui/layouts/main/main-layout';
// import { Loader } from '../../ui/loader/loader';
// import { InfoBlock } from '../../ui/info-block/info-block';
// import { ResidueChart } from '../../charts/residue-chart/residue-chart';
// import { ActiveShiftCard } from '../../cards/active-shift-card/active-shift-card';
// import { FinishedShiftCard } from '../../cards/finished-shift-card/finished-shift-card';
// // import { SickInfo } from '../../sick-info/sick-info';
// import { ProfessionInfo } from '../../profession-info/profession-info';

// import { useDispatch, useSelector } from '../../../services/store';
// import { downloadResiduesReport } from '../../../services/slices/report/actions';
// import { selectUser } from '../../../services/slices/auth/slice';

// import {
//   selectActiveShift,
//   selectFinishedShift,
//   selectIsLoadingActiveShift,
//   selectIsLoadingFinishedShift,
// } from '../../../services/slices/shift/slice';

// import {
//   getActiveShift,
//   getFinishedShift,
// } from '../../../services/slices/shift/actions';

// import { selectIsDownloading } from '../../../services/slices/report/slice';

// import { TRole } from '../../../utils/types';

// export const Home = () => {
//   const dispatch = useDispatch();

//   const activeShift = useSelector(selectActiveShift);
//   const finishedShift = useSelector(selectFinishedShift);

//   const isLoadingActiveShift = useSelector(selectIsLoadingActiveShift);
//   const isLoadingFinishedShift = useSelector(selectIsLoadingFinishedShift);

//   const isDownloading = useSelector(selectIsDownloading);

//   const user = useSelector(selectUser);
//   const role: TRole = 'ADMIN';

//   useEffect(() => {
//     dispatch(getFinishedShift());
//     dispatch(getActiveShift());
//   }, []);

// const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     onClick(e);
//   };

//   if (
//     isLoadingActiveShift &&
//     isLoadingFinishedShift &&
//     !activeShift &&
//     !finishedShift
//   ) {
//     return (
//       <MainLayout>
//         <Loader />
//       </MainLayout>
//     );
//   }

//   return (
//     <MainLayout>
//       <InfoBlock
//         className={styles.title__bottom}
//         title='Group Shop'
//         text='Unit 11'
//       />

//       {finishedShift && <ResidueChart shift={finishedShift} />}
//       {activeShift && <ActiveShiftCard shift={activeShift} />}
//       {finishedShift && <FinishedShiftCard shift={finishedShift} />}

//       <ProfessionInfo />
//       {/* <SickInfo /> */}

//       {user?.role === role && (
//         // Нужно использовать <Button text='Загрузить отчёт' onClick={handleDownload} isDownloading={isDownloading} />!!!
//         <ReportButton
//           isDownloading={isDownloading}
//           text='Загрузить отчёт'
//           onClick={() => dispatch(downloadResiduesReport())}
//         />
//       )}
//     </MainLayout>
//   );
// };
