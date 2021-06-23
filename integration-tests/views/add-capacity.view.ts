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
import { $, ExpectedConditions as until, browser } from 'protractor';
import * as crudView from '@console/internal-integration-tests/views/crud.view';
import * as sideNavView from '@console/internal-integration-tests/views/sidenav.view';
import { click } from '@console/shared/src/test-utils/utils';
import { CAPACITY_UNIT, OCS_OP } from '../utils/consts';
import { currentSelectors, VERSION } from './installFlow.view';

/**
 * All generic selectors go into Defaults
 * All OCPX.Y selectors that are not compatible with > X.(Y + 1) OCP goes into its own object.
 * Everything else in DEFAULTS
 */

const DEFAULTS = {
  ocsOp: $(`a[data-test-operator-row='${OCS_OP}']`),
  actionForLabel: (label: string) => $(`button[data-test-action='${label}']`),
  confirmButton: $('#confirm-action'),
  storageClusterRow: (uid: string) => $(`tr[data-id='${uid}']`),
  getSCOption: (scName: string) => $(`a[id='${scName}-link']`),
  capacityValueInput: $('input.ceph-add-capacity__input'),
  totalRequestedcapacity: $('div.ceph-add-capacity__input--info-text strong'),
  scDropdown: $('button[id="ceph-sc-dropdown"]'),
  storageClusterNav: $('a[data-test-id="horizontal-link-Storage Cluster"]'),
  getProgressingStateEl: (statusCol) => statusCol.$('span.co-icon-and-text'),
  getReadyStateEl: (statusCol) => statusCol.$('span.co-icon-and-text span.co-icon-and-text span'),
};

// TODO: NEHA, add support for other versions
export const currentACSelector = (() => {
  switch (VERSION) {
    default:
      return DEFAULTS;
  }
})();

export const verifyFields = async (size: number) => {
  await browser.wait(until.presenceOf(currentACSelector.capacityValueInput));
  await browser.wait(until.presenceOf(currentACSelector.totalRequestedcapacity));
  expect(currentACSelector.capacityValueInput.getAttribute('value')).toBe(String(size));
  expect(currentACSelector.totalRequestedcapacity.getText()).toEqual(
    `${(size * 3).toFixed(2)} ${CAPACITY_UNIT}`,
  );
};

export const clickKebabAction = async (uid: string, actionLabel: string) => {
  await browser.wait(until.presenceOf(currentACSelector.storageClusterRow(uid)));
  const kebabMenu = currentACSelector
    .storageClusterRow(uid)
    .$('button[data-test-id="kebab-button"]');
  await click(kebabMenu);
  await browser.wait(until.presenceOf(currentACSelector.actionForLabel(actionLabel)));
  await click(currentACSelector.actionForLabel(actionLabel));
};

export const goToInstalledOperators = async () => {
  await browser.wait(until.and(crudView.untilNoLoadersPresent));
  await sideNavView.clickNavLink(['Operators', 'Installed Operators']);
  await browser.wait(until.and(crudView.untilNoLoadersPresent));
  await click(currentSelectors.namespaceDropdown);
  await click(currentSelectors.openshiftStorageItem);
  await browser.wait(until.and(crudView.untilNoLoadersPresent));
};

export const selectSCDropdown = async (uid: string) => {
  await goToInstalledOperators();
  await click(currentACSelector.ocsOp);
  await browser.wait(until.presenceOf(currentACSelector.storageClusterNav));
  await click(currentACSelector.storageClusterNav);
  await clickKebabAction(uid, 'Add Capacity');
  await click(currentACSelector.scDropdown);
};
