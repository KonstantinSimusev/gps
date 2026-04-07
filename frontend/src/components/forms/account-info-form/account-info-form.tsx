import { useContext, useState } from 'react';

import { LayerContext } from '../../../contexts/layer/layerContext';
import { useSelector } from '../../../services/store';
import { selectCreateEmployee } from '../../../services/slices/employee/slice';

import { Form } from '../../ui/form/form';
import { Button } from '../../ui/button/button';
import { InfoBlock } from '../../ui/info-block/info-block';

import styles from './account-info-form.module.css';
import { SuccessIcon } from '../../ui/icons/success/success';
import { Spinner } from '../../ui/spinner/spinner';
import { delay } from '../../../utils/utils';
import { selectUpdateAccountInfo } from '../../../services/slices/account/slice';

export const AccountInfoForm = () => {
  const { setIsOverlayOpen, setIsAccountInfoOpen, setIsPasswordUpdateOpen } =
    useContext(LayerContext);

  const createAccountInfo = useSelector(selectCreateEmployee);
  const updateAccountInfo = useSelector(selectUpdateAccountInfo);

  const [isLoading, setIsLoading] = useState(false);

  // Определяем, какие данные использовать: приоритет — createAccountInfo, если нет — updateAccountInfo
  const accountInfo = createAccountInfo || updateAccountInfo;

  const handleCopyClick = async () => {
    if (!accountInfo) {
      return;
    }

    setIsLoading(true);
    await delay();

    // HTML‑контент с подчёркиванием для буфера обмена
    const htmlContent = `
<div style="font-family: Arial, sans-serif; font-size: 14px;">
  <p><strong>ФИО:</strong><br>
  ${accountInfo.lastName} ${accountInfo.firstName} ${accountInfo.patronymic}</p>
  <p><strong>Логин:</strong><br>
  <u style="color: #007bff;>${accountInfo.login}</u></p>
  <p><strong>Пароль:</strong><br>
  <u style="color: #007bff;>${accountInfo.password}</u></p>
</div>`;

    // Чистый текст для fallback
    const plainText = `
ФИО:
${accountInfo.lastName} ${accountInfo.firstName} ${accountInfo.patronymic}

Логин:
${accountInfo.login}

Пароль:
${accountInfo.password}
  `.trim();

    // Основной способ: копируем HTML + plain text
    navigator.clipboard
      .write([
        new ClipboardItem({
          'text/html': new Blob([htmlContent], { type: 'text/html' }),
          'text/plain': new Blob([plainText], { type: 'text/plain' }),
        }),
      ])
      .catch(() => {
        // Fallback: если HTML не поддерживается, копируем простой текст
        navigator.clipboard.writeText(plainText);
      });

    window.location.reload();

    await delay();
    setIsOverlayOpen(false);
    setIsAccountInfoOpen(false);
    setIsPasswordUpdateOpen(false);
  };

  return (
    <Form title={'Работник создан'} titleClassName={styles.title}>
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
        Скопируйте и вставьте информацию в&nbsp;безопасном&nbsp;месте.
      </span>

      <Spinner isLoading={isLoading} className={styles.spinner} />

      <Button
        type='button'
        label='Скопировать'
        onClick={handleCopyClick}
        className={styles.button}
      />
    </Form>
  );
};
