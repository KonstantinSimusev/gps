// Используем переменную окружения
export const URL = import.meta.env.VITE_API_URL ?? '/api/gps';

export const downloadResiduesReportApi = async (): Promise<Blob> => {
  try {
    const response = await fetch(`${URL}/reports/residues`, {
      method: 'GET',
      credentials: 'include', // для работы с cookie
    });

    if (!response.ok) {
      throw new Error('Не удалось загрузить отчёт');
    }

    // Возвращаем Blob с содержимым файла
    return await response.blob();
  } catch (error) {
    throw error;
  }
};
