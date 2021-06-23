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
import { Extension } from '@console/plugin-sdk';

interface DashboardsExtensionProperties {
  /** Feature flags which are required for this extension to be effective. */
  required?: string | string[];

  /** Feature flags which are disallowed for this extension to be effective. */
  disallowed?: string | string[];
}

namespace ExtensionProperties {
  export interface DashboardsStorageCapacityDropdownItem extends DashboardsExtensionProperties {
    /** The name of the metric */
    metric: string;

    /** The queries which will be used to query prometheus */
    queries: [string, string];
  }
}

export interface DashboardsStorageCapacityDropdownItem
  extends Extension<ExtensionProperties.DashboardsStorageCapacityDropdownItem> {
  type: 'Dashboards/Storage/Capacity/Dropdown/Item';
}

export const isDashboardsStorageCapacityDropdownItem = (
  e: Extension,
): e is DashboardsStorageCapacityDropdownItem =>
  e.type === 'Dashboards/Storage/Capacity/Dropdown/Item';
