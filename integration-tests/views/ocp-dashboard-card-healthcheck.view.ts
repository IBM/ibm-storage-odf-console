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
import { execSync } from 'child_process';
import { $ } from 'protractor';
import { getPodData } from '../utils/helpers';
import { OCP_HEALTH_ICON_COLORS } from '../utils/consts';

export const mainHealthCardStatus = $(
  '.co-dashboard-card__body--top-margin.co-status-card__health-body',
);
export const smallDivInside = mainHealthCardStatus.$$('.co-dashboard-icon').get(3);
export const mainHealtGreenSvg = smallDivInside.$(`svg[fill="${OCP_HEALTH_ICON_COLORS.GREEN46}"]`);

export const mainHealtYellowSvg = smallDivInside.$(`svg[fill="${OCP_HEALTH_ICON_COLORS.YELLOW}"]`);
export const noOutChange = (setNoOut: string) => {
  const podsList = JSON.parse(
    execSync('kubectl get po -n openshift-storage -o json').toString('utf-8'),
  );
  const pods = podsList.items;
  const opPod = getPodData(pods, 'ceph-operator');
  const opPodName = opPod.metadata.name;
  execSync(`oc -n openshift-storage rsh  ${opPodName} \
        ceph --conf=/var/lib/rook/openshift-storage/openshift-storage.config \
        osd ${setNoOut} noout`);
};

export const mainHealtRedSvg = smallDivInside.$(`svg[fill="${OCP_HEALTH_ICON_COLORS.RED}"]`);
