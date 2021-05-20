import { PrometheusHealthHandler, ResourceHealthHandler } from '@console/plugin-sdk';
import { HealthState } from '@console/shared/src/components/dashboard/status-card/states';
import { getResiliencyProgress } from '../../../../utils';
import { WatchStoResource } from '../../../../types';
import { StorageInstanceKind } from '../../../../types';

const StoHealthStatus = {
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

export const getStoHealthState: ResourceHealthHandler<WatchStoResource> = ({ sto }) => {
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
  return StoHealthStatus[status] || { state: HealthState.UNKNOWN };
};
export const StorageStatus = (data: StorageInstanceKind) => (data?.status?.phase);

export const getDataResiliencyState: PrometheusHealthHandler = (responses) => {
  const progress: number = getResiliencyProgress(responses[0].response);
  if (responses[0].error) {
    return { state: HealthState.NOT_AVAILABLE };
  }
  if (!responses[0].response) {
    return { state: HealthState.LOADING };
  }
  if (Number.isNaN(progress)) {
    return { state: HealthState.UNKNOWN };
  }
  if (progress < 1) {
    return { state: HealthState.PROGRESS, message: 'Progressing' };
  }
  return { state: HealthState.OK };
};
