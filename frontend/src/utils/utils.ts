export const ROLE_TO_PAGE: { [key: string]: string } = {
  ADMIN: '/admin',
  SECTION_MASTER: '/timesheet',
  // PACKER: '/timesheet',
};

export const delay = (ms: number = 500): Promise<void> =>
  new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      resolve();
    }, ms);
  });
