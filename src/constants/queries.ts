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
  UTILIZATION_CAPACITY_QUERY = 'UTILIZATION_CAPACITY_QUERY',
  UTILIZATION_IOPS_QUERY = 'UTILIZATION_IOPS_QUERY',
  UTILIZATION_LATENCY_QUERY = 'UTILIZATION_LATENCY_QUERY',
  UTILIZATION_THROUGHPUT_QUERY = 'UTILIZATION_THROUGHPUT_QUERY',
  TotalCapacity  = 'TotalCapacity',
  TotalFreeCapacity  = 'TotalFreeCapacity',
  TotalUsedCapacity  = 'TotalUsedCapacity',
  TotalReadIOPS         = 'TotalReadIOPS',
  TotalWriteIOPS        = 'TotalWriteIOPS',
  TotalReadBW         = 'TotalReadBW',
  TotalWriteBW        = 'TotalWriteBW',
  TotalReadRespTime   = 'TotalReadRespTime',
  TotalWriteRespTime  = 'TotalWriteRespTime',
}

export const EFFICIENCY_SAVING_QUERY = "sum(flashsystem_pool_savings_bytes)";

export const FlASHSYSTEM_QUERIES = (label: string, queryItem: string):string => {
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
    case StorageDashboardQuery.TotalReadIOPS:{
      return `subsystem_rd_iops{container='${label}'}`;
    }
    case StorageDashboardQuery.TotalWriteIOPS:{
      return `subsystem_wr_iops{container='${label}'}`;
    }
    case StorageDashboardQuery.TotalReadRespTime:{
      return `subsystem_rd_latency{container='${label}'}`;
    }
    case StorageDashboardQuery.TotalWriteRespTime:{
      return `subsystem_wr_latency{container='${label}'}`;
    }
    case StorageDashboardQuery.TotalReadBW:{
      return `subsystem_rd_bytes{container='${label}'}`;
    }
    case StorageDashboardQuery.TotalWriteBW:{
      return `subsystem_wr_bytes{container='${label}'}`;
    }
  }
};

export const UTILIZATION_QUERY_ODF = (label: string, func: string) => {
    switch(func){
      case StorageDashboardQuery.UTILIZATION_CAPACITY_QUERY: 
        return [{query: FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.TotalUsedCapacity), desc: 'Used'},
          {query: FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.TotalFreeCapacity), desc: 'Available'}];
      case StorageDashboardQuery.UTILIZATION_IOPS_QUERY:
        return [{query: FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.TotalReadIOPS) , desc: 'Read'},
          {query: FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.TotalWriteIOPS), desc: 'Write'}];
      case StorageDashboardQuery.UTILIZATION_LATENCY_QUERY:
        return [{query: FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.TotalReadRespTime), desc: 'Read'},
          {query: FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.TotalWriteRespTime), desc: 'Write'}];
      case StorageDashboardQuery.UTILIZATION_THROUGHPUT_QUERY:
        return [{query: FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.TotalReadBW), desc: 'Read'},
          {query: FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.TotalWriteBW), desc: 'Write'}];
    }
  };
