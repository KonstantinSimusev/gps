import { createSlice } from '@reduxjs/toolkit';
import { downloadResiduesReport } from './actions';

interface IReportState {
  isDownloading: boolean;
  downloadError: string | null;
}

const initialState: IReportState = {
  isDownloading: false,
  downloadError: null,
};

export const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    clearDownloadError: (state) => {
      state.downloadError = null;
    },
  },
  selectors: {
    selectIsDownloading: (state: IReportState) => state.isDownloading,
    selectDownloadError: (state: IReportState) => state.downloadError,
  },
  extraReducers: (builder) => {
    builder
      .addCase(downloadResiduesReport.pending, (state) => {
        state.isDownloading = true;
        state.downloadError = null;
      })
      .addCase(downloadResiduesReport.fulfilled, (state) => {
        state.isDownloading = false;
        state.downloadError = null;
      })
      .addCase(downloadResiduesReport.rejected, (state, action) => {
        state.isDownloading = false;
        state.downloadError = action.payload as string;
      });
  },
});

export const { clearDownloadError } = reportSlice.actions;

export const { selectIsDownloading, selectDownloadError } =
  reportSlice.selectors;
