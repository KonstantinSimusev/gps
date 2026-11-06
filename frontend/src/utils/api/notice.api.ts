import { BASE_PATH } from '../api.config';
import { INotice, ISuccess } from '../api.interfaces';

export const createMissingShiftsNoticesApi = async (): Promise<ISuccess> => {
  try {
    const response = await fetch(
      `${BASE_PATH}/notice-management/missing-shifts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        credentials: 'include',
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Что-то пошло не так');
  }
};

export const createPendingShiftsNoticesApi = async (): Promise<ISuccess> => {
  try {
    const response = await fetch(
      `${BASE_PATH}/notice-management/pending-shifts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        credentials: 'include',
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Что-то пошло не так');
  }
};

export const getNoticesApi = async (): Promise<INotice[]> => {
  try {
    const response = await fetch(`${BASE_PATH}/notice-management/notices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Что-то пошло не так');
  }
};

export const getNoticeByIdApi = async (id: string): Promise<INotice> => {
  try {
    const url = `${BASE_PATH}/notices/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Что-то пошло не так');
  }
};

export const markNoticeAsReadApi = async (id: string): Promise<ISuccess> => {
  try {
    const url = `${BASE_PATH}/notices/${id}/read`;

    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Что-то пошло не так');
  }
};
