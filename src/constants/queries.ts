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
import { ProjectModel, PodModel, StorageClassModel } from '../models';
import { STORAGE_CLASSES, PROJECTS, PODS } from '.';
import {IBM_STORAGE_CSI_PROVISIONER} from './index';
 
export enum StorageDashboardQuery {
  PODS_TOTAL_USED = 'PODS_TOTAL_USED',
  PODS_BY_USED = 'PODS_BY_USED',
  PROJECTS_TOTAL_USED = 'PROJECTS_TOTAL_USED',
  PROJECTS_BY_USED = 'PROJECTS_BY_USED',
  STORAGE_CLASSES_TOTAL_USED = 'STORAGE_CLASSES_TOTAL_USED',
  STORAGE_CLASSES_BY_USED = 'STORAGE_CLASSES_BY_USED',
  USED_CAPACITY = 'USED_CAPACITY',
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
     const currentProvisioner = IBM_STORAGE_CSI_PROVISIONER;

     switch(queryItem){
     // change kube_persistentvolumeclaim_resource_requests_storage_bytes
     // to kubelet_volume_stats_used_bytes
     case StorageDashboardQuery.PROJECTS_TOTAL_USED:{
       return `sum(sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~'${currentProvisioner}'})) by (namespace))`;
       }
     case StorageDashboardQuery.PROJECTS_BY_USED:{
       return `sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~'${currentProvisioner}'})) by (namespace)`;
       }
     case StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED:{
       return `sum(sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass) group_left(provisioner) kube_storageclass_info {provisioner=~'${currentProvisioner}'})) by (storageclass, provisioner))`;
       }
     case StorageDashboardQuery.STORAGE_CLASSES_BY_USED:{
       return `sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass) group_left(provisioner) kube_storageclass_info {provisioner=~'${currentProvisioner}'})) by (storageclass, provisioner)`;
       }
     case StorageDashboardQuery.PODS_TOTAL_USED:{
       return `sum((kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_right() (kube_pod_info * on(namespace, pod)  group_right(node) kube_pod_spec_volumes_persistentvolumeclaims_info)) * on(namespace,persistentvolumeclaim) group_left(provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~'${currentProvisioner}'}))`;
       }
     case StorageDashboardQuery.PODS_BY_USED:{
       return `sum((kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_right() (kube_pod_info * on(namespace, pod)  group_right(node) kube_pod_spec_volumes_persistentvolumeclaims_info)) * on(namespace,persistentvolumeclaim) group_left(provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~'${currentProvisioner}'})) by (pod)`;
       }
     case StorageDashboardQuery.USED_CAPACITY:{
       return `sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~'${currentProvisioner}'}))`;
       }    
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
       return `flashsystem_subsystem_rd_iops{container='${label}'}`;
     }
     case StorageDashboardQuery.TotalWriteIOPS:{
       return `flashsystem_subsystem_wr_iops{container='${label}'}`;
     }
     case StorageDashboardQuery.TotalReadRespTime:{
       return `flashsystem_subsystem_rd_latency_seconds{container='${label}'}`;
     }
     case StorageDashboardQuery.TotalWriteRespTime:{
       return `flashsystem_subsystem_wr_latency_seconds{container='${label}'}`;
     }
     case StorageDashboardQuery.TotalReadBW:{
       return `flashsystem_subsystem_rd_bytes{container='${label}'}`;
     }
     case StorageDashboardQuery.TotalWriteBW:{
       return `flashsystem_subsystem_wr_bytes{container='${label}'}`;
     }
   }
};

export const BreakdownQueryMapODF = (label: string, queryType: string) => {
    switch(queryType) { 
      case PROJECTS: return {
        model: ProjectModel,
        metric: 'namespace',
        queries: {
          [StorageDashboardQuery.PROJECTS_BY_USED]: `(topk(6,(${
            FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.PROJECTS_BY_USED)
          })))`,
          [StorageDashboardQuery.PROJECTS_TOTAL_USED]:
            FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.PROJECTS_TOTAL_USED),
          [StorageDashboardQuery.USED_CAPACITY]:
            FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.USED_CAPACITY),
          },
        }; 
       
      case STORAGE_CLASSES: return {
        model: StorageClassModel,
        metric: 'storageclass',
        queries: {
            [StorageDashboardQuery.STORAGE_CLASSES_BY_USED]: `(topk(6,(${
              FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.STORAGE_CLASSES_BY_USED)
            })))`,
            [StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED]:
              FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED),
            [StorageDashboardQuery.USED_CAPACITY]:
              FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.USED_CAPACITY),
          },
      };
      case PODS: return {
        model: PodModel,
        metric: 'pod',
        queries: {
          [StorageDashboardQuery.PODS_BY_USED]: `(topk(6,(${
            FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.PODS_BY_USED)
          })))`,
          [StorageDashboardQuery.PODS_TOTAL_USED]:
            FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.PODS_TOTAL_USED),
          [StorageDashboardQuery.USED_CAPACITY]:
            FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.USED_CAPACITY),
        }, 
      }; 
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
