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

export enum StorageDashboardQuery {
  TotalCapacity  = 'TotalCapacity',
  TotalFreeCapacity  = 'TotalFreeCapacity',
  TotalUsedCapacity  = 'TotalUsedCapacity',
}

export const EFFICIENCY_SAVING_QUERY = "sum(flashsystem_pool_savings_bytes)";

export const CAPACITY_BREAKDOWN_QUERIES_ODF = (label: string, queryItem: string):string => {
    switch(queryItem){
    // change kube_persistentvolumeclaim_resource_requests_storage_bytes
    // to kubelet_volume_stats_used_bytes
    
    case StorageDashboardQuery.TotalUsedCapacity:{
      return `sum(flashsystem_pool_capacity_used_bytes{container='${label}'})`;
      }
    case StorageDashboardQuery.TotalFreeCapacity:{
      return `sum(flashsystem_pool_capacity_usable_bytes{container='${label}'})`;
      }
    case StorageDashboardQuery.TotalCapacity:{
      return `sum(flashsystem_pool_capacity_usable_bytes{container='${label}'}) + sum(flashsystem_pool_capacity_used_bytes{container='${label}'})`;
      }
  }
};
