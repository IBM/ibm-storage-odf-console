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
import { $, $$, browser } from 'protractor';
import { appHost } from '@console/internal-integration-tests/protractor.conf';
import { isLoaded } from '@console/shared/src/test-views/dashboard-shared.view';

// export const clusterHealth = $('[class="co-dashboard-text--small co-health-card__text"]');
export const clusterHealth = $('div.co-status-card__health-item div svg');
export const detailsCardStructure = $$('.co-details-card__body dt');
const clusterDetails = $$('.co-details-card__body dd');
export const serviceName = clusterDetails.get(0);
export const clusterName = clusterDetails.get(1);
export const provider = clusterDetails.get(2);
export const ocsVersion = clusterDetails.get(3);
const clusterInventory = $$('[class="co-inventory-card__item-title"]');
export const allNodes = clusterInventory.get(0);
export const allPvcs = clusterInventory.get(1);
export const allPvs = clusterInventory.get(2);

export const goToStorageDashboard = async () => {
  await browser.get(`${appHost}/dashboards/persistent-storage`);
  await isLoaded();
};
