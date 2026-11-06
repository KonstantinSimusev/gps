import { useState } from 'react';

import { formatDurationForUI } from '../../../utils/utils';
import { IEmployeeShift } from '../../../utils/api.interfaces';
import { useSelector } from '../../../services/store';
import { selectShift } from '../../../services/slices/shift/slice';

import { IconButton } from '../../ui/buttons/icon-button/icon-button';
import { DeleteIcon } from '../../ui/icons/delete/delete';
import { EditIcon } from '../../ui/icons/edit/edit';
import { SuccessIcon } from '../../ui/icons/success/success';

import styles from './employee-shift-card.module.css';

interface IProps {
  employeeShift: IEmployeeShift;
  onClick: () => void;
  onDelete: () => void;
}

export const EmployeeShiftCard = ({
  employeeShift,
  onClick,
  onDelete,
}: IProps) => {
  const [isShow, setIsShow] = useState(false);

  const shift = useSelector(selectShift);
  const employee = employeeShift.employee;
  const attendanceCode = employeeShift.attendanceCode;
  const workTime = formatDurationForUI(employeeShift.minutes);
  const isReady = employeeShift.isReady;
  const isShowDeleteButton = employeeShift.canDelete;

  const isPresent =
    employeeShift.isPresent === true
      ? '+'
      : employeeShift.isPresent === false
        ? '-'
        : 'Не выбрано';

  if (!shift) {
    return null;
  }

  return (
    <div className={styles.card}>
      <div className={styles.topContainer}>
        <div className={styles.fullname}>
          <div className={styles.lastName}>
            <span>{employee?.lastName ?? ''}</span>
            {isReady && <SuccessIcon />}
          </div>
          <span className={styles.name}>{employee?.firstName ?? ''}</span>
          <span className={styles.name}>{employee?.patronymic ?? ''}</span>
        </div>

        <div className={styles.actions}>
          <div className={styles.actionsWrapper}>
            {isShowDeleteButton && (
              <IconButton
                type='button'
                onClick={onDelete}
                className={styles.button}
              >
                <DeleteIcon width={22} height={22} />
              </IconButton>
            )}

            <IconButton
              type='button'
              onClick={onClick}
              className={styles.button}
            >
              <EditIcon width={22} height={22} />
            </IconButton>
          </div>

          <span className={styles.profession}>{employee.professionName}</span>
        </div>
      </div>

      <div className={styles.bottomContainer}>
        <div className={styles.status}>
          <span className={styles.attendance}>{attendanceCode}</span>
          <span className={styles.workTime}>{workTime}</span>
        </div>

        <button
          type='button'
          className={styles.detailsButton}
          onClick={() => setIsShow(!isShow)}
        >
          {!isShow ? 'Подробнее...' : 'Скрыть'}
        </button>
      </div>

      {isShow && (
        <>
          <div className={styles.info}>
            <span className={styles.title}>Сменно-встречное собрание</span>
            <span className={styles.text}>{isPresent}</span>
          </div>

          <div className={styles.info}>
            <span className={styles.title}>Профессия в смене</span>
            <span className={styles.text}>
              {employeeShift.currentProfessionName}
            </span>
          </div>

          <div className={styles.info}>
            <span className={styles.title}>Рабочее место</span>
            <span className={styles.text}>
              {employeeShift.workplaceName === null
                ? 'Не выбрано'
                : employeeShift.workplaceName}
            </span>
          </div>
        </>
      )}

      {/* <TableBlock
          title='Причина перевода'
          text={employee.transferReason ?? '-'}
        />

        <TableBlock
          title='Личный номер заменяемого'
          text={employee.replacedPersonalNumber ?? '-'}
        />

        <TableBlock
          title='Дата назначения позиции'
          text={employee.positionStartDate ?? '-'}
        />

        <TableBlock
          title='Дата завершения позиции'
          text={employee.positionEndDate ?? '-'}
        /> */}
    </div>
  );
};
