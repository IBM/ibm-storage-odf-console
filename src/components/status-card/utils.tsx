/**
 * Copyright contributors to the ibm-storage-odf-console project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as _ from 'lodash';
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
  'Ready': {
    state: HealthState.OK,
  },
  'Not Ready': {
    state: HealthState.WARNING,
    message: 'Warning',
  },
  'Error': {
    state: HealthState.ERROR,
    message: 'Error',
  },
  'PROCESSING': {
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


