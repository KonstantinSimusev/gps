import { useContext } from 'react';

import { LayerContext } from '../../../contexts/layer/layerContext';
import { useSelector } from '../../../services/store';
import { selectCreateEmployee } from '../../../services/slices/employee/slice';

import { Form } from '../../ui/form/form';
import { Button } from '../../ui/button/button';
import { InfoBlock } from '../../ui/info-block/info-block';

import styles from './account-info-form.module.css';
import { SuccessIcon } from '../../ui/icons/success/success';

export const AccountInfoForm = () => {
  const { setIsOverlayOpen, setIsAccountInfoOpen } = useContext(LayerContext);

  const accountInfo = useSelector(selectCreateEmployee);

  const handleCopyClick = async () => {
    if (!accountInfo) {
      return;
    }

    // Форматируем объект в читаемый текст (не JSON‑строку)
    const formattedInfo = `
ФИО: 
${accountInfo.lastName} ${accountInfo.firstName} ${accountInfo.patronymic}

Логин:
${accountInfo.login}

Пароль:
${accountInfo.password}
    `.trim();

    await navigator.clipboard.writeText(formattedInfo);
    window.location.reload();

    setIsOverlayOpen(false);
    setIsAccountInfoOpen(false);
  };

  return (
    <Form title={'Сотрудник создан'} titleClassName={styles.title}>
      <div className={styles.icon__wrapper}>
        <SuccessIcon />
      </div>
      {accountInfo && (
        <div className={styles.account__wrapper}>
          <InfoBlock
            title='ФИО'
            text={`${accountInfo.lastName} ${accountInfo.firstName} ${accountInfo.patronymic}`}
          />
          <InfoBlock title='Логин' text={accountInfo.login} />
          <InfoBlock title='Пароль' text={accountInfo.password} />
        </div>
      )}

      <span className={styles.text}>
        Скопируйте и вставьте информацию в
        безопасном месте.
      </span>

      <Button
        type='button'
        label='Скопировать'
        onClick={handleCopyClick}
        className={styles.button}
      />
    </Form>
  );
};
