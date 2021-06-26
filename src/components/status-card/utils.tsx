import * as _ from 'lodash';
//import { WatchFlashSystemResource } from '../../../../types';
import { StorageInstanceKind } from '../../types';
//import { IBM_FlASHSYSTEM } from '../../../../constants/index';

enum HealthState {
  OK = "OK",
  ERROR = "ERROR",
  WARNING = "WARNING",
  LOADING = "LOADING",
  UNKNOWN = "UNKNOWN",
  UPDATING = "UPDATING",
  PROGRESS = "PROGRESS",
  NOT_AVAILABLE = "NOT_AVAILABLE",
}

const FlashsystemHealthStatus = {
  Ready: {
    state: HealthState.OK,
  },
  'Not Ready': {
    state: HealthState.WARNING,
    message: 'Warning',
  },
  Error: {
    state: HealthState.ERROR,
    message: 'Error',
  },
  PROCESSING: {
    state: HealthState.PROGRESS,
    message: 'PROGRESS',
  },
};

export const getFlashsystemHealthState = ({ sto }) => {
  const { data, loaded, loadError } = sto;
  const status = data?.[0]?.status?.phase;

  if (loadError) {
    return { state: HealthState.NOT_AVAILABLE };
  }
  if (!loaded) {
    return { state: HealthState.LOADING };
  }
  if (data.length === 0) {
    return { state: HealthState.NOT_AVAILABLE };
  }
  return FlashsystemHealthStatus[status] || { state: HealthState.UNKNOWN };
};
export const StorageStatus = (data: StorageInstanceKind) => (data?.status?.phase);



