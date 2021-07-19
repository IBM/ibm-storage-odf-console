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
import * as React from 'react';
import * as _ from 'lodash';
import {
  Gallery,
  GalleryItem,
} from "@patternfly/react-core";
import {
  useK8sWatchResource,
} from "@console/dynamic-plugin-sdk/api";
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
  HealthItem,
} from "@console/dynamic-plugin-sdk/provisional";
import { 
  getFlashsystemHealthState, 
 } from './utils';
import { StorageInstanceKind } from '../../types';
import {GetFlashSystemResource} from '../../constants/resources'

export const StatusCard: React.FC<any> = (props) => {
  const [data, loaded, loadError] = useK8sWatchResource<StorageInstanceKind>(GetFlashSystemResource(props?.match?.params?.name, props?.match?.params?.namespace));
  const flashHealthState = getFlashsystemHealthState({ sto: { data: data, loaded: loaded, loadError: loadError } });

  return (
    <DashboardCard gradient>
      <DashboardCardHeader>
        <DashboardCardTitle>Status</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody>
        <Gallery className="co-overview-status__health" hasGutter>
          <GalleryItem>
            <HealthItem
              title={props?.match?.params?.name}
              state={flashHealthState.state}
              details={flashHealthState.message}
            />
          </GalleryItem>
        </Gallery>
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default StatusCard;
