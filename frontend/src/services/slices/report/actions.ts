import { createAsyncThunk } from '@reduxjs/toolkit';

import { downloadResiduesReportApi } from '../../../utils/api/report.api';

export const downloadResiduesReport = createAsyncThunk(
  'report/downloadResiduesReport',
  async (_, { rejectWithValue }) => {
    try {
      // Получаем Blob напрямую из API (метод уже возвращает Promise<Blob>)
      const blob = await downloadResiduesReportApi();

      // Создаём URL для Blob
      const url = window.URL.createObjectURL(blob);

      // Создаём скрытую ссылку для скачивания
      const link = document.createElement('a');
      link.href = url;
      link.download = 'residues-report.xlsx';
      link.style.display = 'none';
      link.rel = 'noopener'; // Безопасность

      // Добавляем в DOM, кликаем и удаляем
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Освобождаем URL (важно для памяти)
      window.URL.revokeObjectURL(url);

      return undefined; // Успех без данных
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка скачивания',
      );
    }
  },
);
