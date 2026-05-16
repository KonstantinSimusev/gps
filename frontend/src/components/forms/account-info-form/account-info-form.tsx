import { useContext, useState } from 'react';

import { delay } from '../../../utils/utils';

import { useSelector } from '../../../services/store';

import { selectCreateEmployee } from '../../../services/slices/employee/slice';
import { selectUpdateAccountInfo } from '../../../services/slices/account/slice';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { Button } from '../../ui/buttons/button/button';
import { Form } from '../../ui/form/form';
import { InfoBlock } from '../../ui/info-block/info-block';
import { Spinner } from '../../ui/spinner/spinner';
import { SuccessIcon } from '../../ui/icons/success/success';

import styles from './account-info-form.module.css';

export const AccountInfoForm = () => {
  const createAccountInfo = useSelector(selectCreateEmployee);
  const updateAccountInfo = useSelector(selectUpdateAccountInfo);

  const { setIsOverlayOpen, setIsAccountInfoOpen, setIsPasswordUpdateOpen } =
    useContext(LayerContext);

  const [isLoading, setIsLoading] = useState(false);

  // Определяем, какие данные использовать: приоритет — createAccountInfo, если нет — updateAccountInfo
  const accountInfo = createAccountInfo || updateAccountInfo;

  const handleCopyClick = async () => {
    if (!accountInfo) {
      return;
    }

    setIsLoading(true);
    await delay(200);

    // Чистый текст для fallback
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

    await delay(300);

    setIsOverlayOpen(false);
    setIsAccountInfoOpen(false);
    setIsPasswordUpdateOpen(false);
  };

  return (
    <Form title={'Работник создан'}>
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
        Скопируйте и вставьте информацию в&nbsp;безопасное&nbsp;место.
      </span>

      <div className={styles.message}>{isLoading && <Spinner />}</div>

      <Button type='button' className={styles.button} onClick={handleCopyClick}>
        Скопировать
      </Button>
    </Form>
  );
};
