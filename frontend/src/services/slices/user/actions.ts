import { createAsyncThunk } from '@reduxjs/toolkit';

import { getProfessionsApi } from '../../../utils/api/user.api';

import { delay } from '../../../utils/utils';

export const getProfessions = createAsyncThunk('user/professions', async () => {
  try {
    const response = await getProfessionsApi();

    // Добавляем задержку кода
    await delay();

    if (!response) {
      throw new Error();
    }

    return response;
  } catch (error) {
    // Добавляем задержку кода
    // await delay();

    // Пойдет в rejected
    throw error;
  }
});
