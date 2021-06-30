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
