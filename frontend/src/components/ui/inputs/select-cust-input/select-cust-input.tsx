import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { ATTENDANCE_OPTIONS } from '../../../../utils/constants';

import { DownIcon } from '../../icons/down/down';
import styles from './select-cust-input.module.css';

interface IOption {
  value: string;
  label: string;
}

interface IProps {
  type: string;
  name: string;
  label?: string;
  placeholder?: string;
  options: IOption[];
  value: string;
  error?: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  autoFocus?: boolean;
}

export const SelectCustInput = ({
  type,
  name,
  label,
  placeholder = 'Поиск',
  options,
  value,
  error,
  className,
  autoFocus,
  onBlur,
  onChange,
}: IProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null); // нужен для клика вне
  const [isOpen, setIsOpen] = useState(false);

  // Получаем label по value. Если value пустой — показываем «Не выбрано»
  const selectedLabel =
    (value && ATTENDANCE_OPTIONS.find((o) => o.value === value)?.label) ||
    'Не выбрано';

  const handleSelect = (optionValue: string) => {
    const event = {
      target: {
        name,
        value: optionValue,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(event);
    setIsOpen(false);

    // Фокус остаётся в поле — чтобы можно было сразу печатать (поиск)
    if (inputRef.current) inputRef.current.focus();
  };

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={clsx(styles.container, className)}>
      <label className={styles.label}>{label}</label>

      <div className={styles.wrapper}>
        <input
          ref={inputRef}
          type={type}
          name={name}
          // Когда список открыт — показываем placeholder «Поиск...», иначе — label или «Не выбрано»
          value={isOpen ? '' : selectedLabel}
          placeholder={isOpen ? placeholder : ''}
          className={styles.input}
          onBlur={onBlur}
          onChange={onChange}
          onClick={() => {
            setIsOpen(true);
            if (inputRef.current) {
              inputRef.current.focus();
              // Ставим курсор в самое начало — как ты просил: перед текстом
              inputRef.current.setSelectionRange(0, 0);
            }
          }}
          autoFocus={autoFocus}
        />

        <div className={clsx(styles.arrow, isOpen && styles.arrow__up)}>
          <DownIcon />
        </div>

        {isOpen && (
          <div className={styles.dropdown}>
            <ul className={styles.optionsList}>
              {options.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={clsx(
                    styles.optionItem,
                    value === opt.value && styles.optionItemActive,
                  )}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
