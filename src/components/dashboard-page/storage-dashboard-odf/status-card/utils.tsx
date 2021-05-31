import * as _ from 'lodash';
import { ResourceHealthHandler } from '@console/plugin-sdk';
import { HealthState } from '@console/shared/src/components/dashboard/status-card/states';
import { Alert } from '@console/internal/components/monitoring/types';
import { WatchStoResource } from '../../../../types';
import { StorageInstanceKind } from '../../../../types';
import { IBM_FlASHSYSTEM } from '../../../../constants/index';

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
export const filterStorageSystemCRAlerts = (alerts: Alert[],data: StorageInstanceKind): Alert[] => {
  const storageName = (_.get(data, 'metadata.name'));
  const nameSpace = (_.get(data, 'metadata.namespace'));
  const getAlertName = (alert: Alert): string => (_.get(alert, 'labels.container'));
  const getAlertNameSpace = (alert: Alert): string => (_.get(alert, 'labels.namespace'));
  const filteredAlerts = alerts.filter((alert) => (getAlertName(alert) === storageName && getAlertNameSpace(alert) === nameSpace));
  return filteredAlerts;
};
export const filterIBMFlashSystemAlerts = (alerts: Alert[]): Alert[] =>
  alerts.filter((alert) => (_.get(alert, 'annotations.storage_type'))?.toLowerCase() === IBM_FlASHSYSTEM.toLowerCase());


